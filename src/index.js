/**
 * Created by Warrior! on 2016/10/18.
 */

import React, { PropTypes, Component } from 'react';

export default class ReactUploadFile extends Component {
  static propTypes = {
    options: PropTypes.shape({
      /* basics*/
      baseUrl: PropTypes.string.isRequired,
      param: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
      dataType: PropTypes.string,
      paramAddToField: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
      timeout: PropTypes.number,
      numberLimit: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      fileFieldName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      withCredentials: PropTypes.bool,
      requestHeaders: PropTypes.object,
      accept: PropTypes.string,
      multiple: PropTypes.bool,
      userAgent: PropTypes.string,
      /* funcs*/
      beforeChoose: PropTypes.func,
      onChoose: PropTypes.func,
      beforeUpload: PropTypes.func,
      didUpload: PropTypes.func,
      uploading: PropTypes.func,
      uploadSuccess: PropTypes.func,
      uploadError: PropTypes.func,
      uploadFail: PropTypes.func,
      onAbort: PropTypes.func,
    }).isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    /* buttons*/
    chooseFile: PropTypes.element.isRequired,
    uploadFile: PropTypes.element,
  };

  static defaultProps = {
    /* buttons*/
    chooseFile: <button />,
  };

  constructor(props) {
    super(props);
    const emptyFunction = () => { };
    const options = {
      dataType: 'json',
      timeout: 0,
      numberLimit: 10,
      userAgent: window.navigator.userAgent,
      multiple: false,
      withCredentials: false,
      beforeChoose: emptyFunction,
      onChoose: emptyFunction,
      beforeUpload: emptyFunction,
      didUpload: emptyFunction,
      uploading: emptyFunction,
      uploadSuccess: emptyFunction,
      uploadError: emptyFunction,
      uploadFail: emptyFunction,
      onAbort: emptyFunction,
      ...props.options,
    };
    const timeout = parseInt(options.timeout, 10);
    options.timeout = (Number.isInteger(timeout) && timeout > 0) ? timeout : 0;
    const dataType = options.dataType && options.dataType.toLowerCase();
    options.dataType = dataType !== 'json' && 'text';

    /* copy options to instance */
    Object.keys(options).forEach((key) => {
      this[key] = options[key];
    });
  }

  state = {
    /* xhrs' list after start uploading files */
    xhrList: [],
    currentXHRID: 0,
  };

  /* trigger input's click*/
  /* trigger beforeChoose*/
  commonChooseFile = (e) => {
    if (e.target.name !== 'ajax-upload-file-input') {
      const jud = this.beforeChoose();
      if (jud !== true && jud !== undefined) return;
      e.target.childNodes[0].click();
    }
  };

  /* input change event with File API */
  /* trigger chooseFile */
  commonChangeFile = (e) => {
    this.files = e.target.files;
    this.onChoose(this.files);

    /* immediately upload files */
    if (!this.uploadFile) {
      this.commonUploadFile(e);
    }
  };

  /* execute upload */
  commonUploadFile = (e) => {
    /* current timestamp in millisecond for identifying each file */
    const mill = (this.files.length && this.files[0].mill) || (new Date()).getTime();

    /* strange Filelist, make files array from DOM Filelist */
    /* limit the number of files */
    const numberLimit = typeof this.numberLimit === 'function' ? this.numberLimit() : this.numberLimit;
    const fileLen = Math.min(this.files.length, numberLimit);
    const files = [];
    for (let i = 0; i < fileLen; i++) {
      const file = this.files[i];
      // path only appears in electron
      files.push({
        name: file.name,
        lastModified: file.lastModified,
        lastModifiedDate: file.lastModifiedDate,
        path: file.path,
        size: file.size,
        type: file.type,
        webkitRelativePath: file.webkitRelativePath,
      });
    }

    const jud = this.beforeUpload(files, mill);
    if (jud !== true && jud !== undefined) {
      /* clear input's' files */
      e.target.value = '';
      return false;
    }
    if (!this.files) return;
    if (!this.baseUrl) throw new Error('baseUrl missing in options');

    /* store info of current scope*/
    const scope = {};
    /* assemble formData object */
    let formData = new FormData();
    /* append text fields' param */
    formData = this.appendFieldsToFormData(formData);
    const fieldNameType = typeof this.fileFieldName;
    Object.keys(this.files).forEach((key) => {
      if (key === 'length') return;

      if (fieldNameType === 'function') {
        const file = this.files[key];
        const fileFieldName = this.fileFieldName(file);
        formData.append(fileFieldName, file);
      } else if (fieldNameType === 'string') {
        const file = this.files[key];
        formData.append(this.fileFieldName, file);
      } else {
        const file = this.files[key];
        formData.append(file.name, file);
      }
    });

    const baseUrl = this.baseUrl;
    /* url params*/
    const param = typeof this.param === 'function' ? this.param(this.files) : this.param;

    let paramStr = '';

    if (param) {
      const paramArr = [];
      param._ = mill;
      Object.keys(param).forEach(key =>
        paramArr.push(`${key}=${param[key]}`)
      );
      paramStr = `?${paramArr.join('&')}`;
    }
    const targeturl = baseUrl + paramStr;

    /* execute ajax upload */
    const xhr = new XMLHttpRequest();
    xhr.open('POST', targeturl, true);

    /* authorization info for cross-domain */
    xhr.withCredentials = this.withCredentials;
    /* setting request headers */
    const rh = this.requestHeaders;
    if (rh) {
      Object.keys(rh).forEach(key =>
        xhr.setRequestHeader(key, rh[key])
      );
    }

    /* handle timeout */
    if (this.timeout) {
      xhr.timeout = this.timeout;
      xhr.ontimeout = () => {
        this.uploadError({ type: 'TIMEOUTERROR', message: 'timeout' });
        scope.isTimeout = false;
      };
      scope.isTimeout = false;
      setTimeout(() => {
        scope.isTimeout = true;
      }, this.timeout);
    }

    xhr.onreadystatechange = () => {
      /* xhr request finished*/
      try {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
          const resp = this.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
          this.uploadSuccess(resp);
        } else if (xhr.readyState === 4) {
          /* xhr fail*/
          const resp = this.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
          this.uploadFail(resp);
        }
      } catch (err) {
        /* errors except timeout */
        if (!scope.isTimeout) { this.uploadError({ type: 'FINISHERROR', message: err.message }); }
      }
    };
    /* xhr error*/
    xhr.onerror = () => {
      try {
        const resp = this.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
        this.uploadError({ type: 'XHRERROR', message: resp });
      } catch (err) {
        this.uploadError({ type: 'XHRERROR', message: err.message });
      }
    };

    xhr.onprogress = xhr.upload.onprogress = (progress) => {
      this.uploading(progress, mill);
    };

    xhr.send(formData);

    /* save xhr's id */
    const cID = this.state.xhrList.length - 1;
    this.setState({ currentXHRID: cID, xhrList: [...this.state.xhrList, xhr] });

    /* abort */
    xhr.onabort = () => this.onAbort(mill, cID);

    /* trigger didUpload */
    this.didUpload(this.files, mill, this.state.currentXHRID);

    /* clear input's files */
    e.target.value = '';
  }

  /* append text params to formData */
  appendFieldsToFormData = (formData) => {
    const field = typeof this.paramAddToField === 'function' ? this.paramAddToField() : this.paramAddToField;
    if (field) {
      Object.keys(field).forEach((index) => {
        formData.append(index, field[index]);
      });
    }
    return formData;
  }

  /* public method. Manually trigger commonChooseFile for debug */
  forwardChooseFile = () => {
    this.commonChooseFile();
  }

  /**
   * public method. Manually process files
   * @param func(files)
   * @return files
   * Filelist:
   * {
   *   0: file,
   *   1: file,
   *   length: 2
   * }
   */
  fowardProcessFile = (func) => {
    this.files = func(this.files);
  }

  /* public method. Manually trigger commonUploadFile to upload files */
  filesToUpload = (files) => {
    this.files = files;
    this.commonUploadFile();
  }

  /* public method. Abort a xhr by id which didUpload has returned, default the last one */
  abort = (id) => {
    if (id) {
      this.state.xhrList[id].abort();
    } else {
      this.state.xhrList[this.state.currentXHRID].abort();
    }
  }

  render() {
    const inputProps = { accept: this.props.options.accept, multiple: this.props.options.multiple };
    const chooseFileBtn = React.cloneElement(this.props.chooseFile, { onClick: this.commonChooseFile },
      [(<input
        type="file" name="ajax-upload-file-input"
        style={{ display: 'none' }} onChange={this.commonChangeFile}
        {...inputProps}
        key="file-button"
      />)]);
    const uploadFileBtn = this.props.uploadFile && React.cloneElement(this.props.uploadFile, { onClick: this.commonUploadFile });
    return (
      <div>
        {chooseFileBtn}
        {uploadFileBtn}
      </div>
    );
  }
}

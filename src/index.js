/**
 * Created by Warrior! on 2016/10/18.
 */

/**
 * React文件上传组件，只支持现代浏览器
 * 现代浏览器采用AJAX（XHR2+File API）上传。
 * 使用到ES6，需要经babel转译
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
      /* specials*/
      userAgent: PropTypes.string,
      withoutFileUpload: PropTypes.bool,
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
    options: {
      /* basics*/
      dataType: 'json',
      timeout: 30000,
      numberLimit: 10,
      /* specials*/
      userAgent: window.navigator.userAgent,
    },
    /* buttons*/
    chooseFile: <button />,
  };

  constructor(props) {
    super(props);
    const emptyFunction = () => { };
    const options = {
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
    options.timeout = (!isNaN(timeout) && timeout > 0) ? timeout : 0;
    const dataType = options.dataType && options.dataType.toLowerCase();
    options.dataType = dataType !== 'json' && 'text';

    Object.keys(options).forEach((key) => {
      this[key] = options[key] || this[key];
    });

    /* manually set files in option. only executed once, deprecated */
    // if (options.filesToUpload.length) {
    //   options.filesToUpload.forEach((file) => {
    //     this.files = [file];
    //     this.commonUploadFile();
    //   });
    // }
  }

  state = {
    /* xhrs' list from upload start*/
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
    /* mill参数是当前时刻毫秒数，file第一次进行上传时会添加为file的属性，也可在beforeUpload为其添加，之后同一文件的mill不会更改，作为文件的识别id*/
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
    if (jud !== true && jud !== undefined && typeof jud !== 'object') {
      /* clear input file */
      e.target.value = '';
      return false;
    }
    if (!this.files) return;
    if (!this.baseUrl) throw new Error('baseUrl missing in options');

    /* 用于存放当前作用域的东西*/
    const scope = {};
    /* assemble formData object */
    let formData = new FormData();
    /* If we need to add fields before file data append here*/
    formData = this.appendFieldsToFormData(formData);
    if (!this.withoutFileUpload) {
      const fieldNameType = typeof this.fileFieldName;

      /* 判断是用什么方式作为formdata item 的 name*/
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
    }
    const baseUrl = this.baseUrl;

    /* url参数*/
    /* 如果param是一个函数*/
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

    /* AJAX上传部分*/
    const xhr = new XMLHttpRequest();
    xhr.open('POST', targeturl, true);

    /* 跨域是否开启验证信息*/
    xhr.withCredentials = this.withCredentials;
    /* 是否需要设置请求头*/
    const rh = this.requestHeaders;
    if (rh) {
      Object.keys(rh).forEach(key =>
        xhr.setRequestHeader(key, rh[key])
      );
    }

    /* 处理超时。用定时器判断超时，不然xhr state=4 catch的错误无法判断是超时*/
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
      /* xhr finish*/
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
        /* 超时抛出不一样的错误，不在这里处理*/
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

    /* 这里部分浏览器实现不一致，而且ie没有这个方法*/
    xhr.onprogress = xhr.upload.onprogress = (progress) => {
      this.uploading(progress, mill);
    };

    /* 不带文件上传，给秒传使用 */
    if (this.withoutFileUpload) {
      xhr.send(null);
    } else {
      xhr.send(formData);
    }

    /* save xhr id */
    const cID = this.state.xhrList.length - 1;
    this.setState({ currentXHRID: cID, xhrList: [...this.state.xhrList, xhr] });

    /* 有响应abort的情况 */
    xhr.onabort = () => this.onAbort(mill, cID);

    /* trigger didUpload */
    this.didUpload(this.files, mill, this.state.currentXHRID);

    /* clear input file */
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

  /* public method, trigger commonChooseFile for debug */
  forwardChooseFile = () => {
    this.commonChooseFile();
  }

  /**
   * public method，当多文件上传时，用这个方法主动删除列表中某个文件
   * TODO: 此方法应为可以任意操作文件数组
   * @param func 用户调用时传入的函数，函数接收参数files（filesAPI 对象）
   * @return Obj File API 对象
   * File API Obj:
   * {
   *   0 : file,
   *   1 : file,
   *   length : 2
   * }
   */
  fowardRemoveFile = (func) => {
    this.files = func(this.files);
  }

  /* public method，manual trigger commonUploadFile to upload files */
  filesToUpload = (files) => {
    this.files = files;
    this.commonUploadFile();
  }

  /* public method，取消一个正在进行的xhr，传入id指定xhr（didUpload时返回）,默认取消最后一个。 */
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
    console.warn('Render!');
    return (
      <div>
        {chooseFileBtn}
        {uploadFileBtn}
      </div>
    );
  }
}

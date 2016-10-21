/**
 * Created by Warrior! on 2016/10/18.
 */

/**
 * React文件上传组件，兼容ie8+
 * 现代浏览器采用AJAX（XHR2+File API）上传。低版本浏览器使用form+iframe上传。
 * 使用到ES6，需要经babel转译
 */

import React, { PropTypes, Component } from 'react';

/* 生成假的ie上传进度*/
const fakeProgress = () => {
  let add = 6;
  const decrease = 0.3;
  const end = 98;
  const min = 0.2;

  return (lastTime) => {
    let start = lastTime;
    if (start >= end) return start;
    start += add;
    add -= decrease;
    add = add < min ? min : add;
    return start;
  };
};

export default class ReactUploadFile extends Component {
  /* 类型验证*/
  static propTypes = {
    options: PropTypes.shape({
      /* basics*/
      baseUrl: PropTypes.string.isRequired,
      param: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
      dataType: PropTypes.string,
      chooseAndUpload: PropTypes.bool,
      paramAddToField: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
      wrapperDisplay: PropTypes.string,
      timeout: PropTypes.number,
      accept: PropTypes.string,
      multiple: PropTypes.bool,
      numberLimit: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      fileFieldName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      withCredentials: PropTypes.bool,
      requestHeaders: PropTypes.object,
      /* specials*/
      tag: PropTypes.string,
      userAgent: PropTypes.string,
      disabledIEChoose: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
      withoutFileUpload: PropTypes.bool,
      filesToUpload: PropTypes.arrayOf(PropTypes.object),
      textBeforeFiles: PropTypes.bool,
      /* funcs*/
      beforeChoose: PropTypes.func,
      chooseFile: PropTypes.func,
      beforeUpload: PropTypes.func,
      doUpload: PropTypes.func,
      uploading: PropTypes.func,
      uploadSuccess: PropTypes.func,
      uploadError: PropTypes.func,
      uploadFail: PropTypes.func,
      onabort: PropTypes.func
    }).isRequired,
    parent: PropTypes.object,
    style: PropTypes.object,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.userAgent = this.getUserAgent();
    const { options } = props;
    /* 因为ie每次要用到很多form组，如果在同一页面需要用到多个<ReactUploadFile>可以在options传入tag作为区分。并且不随后续props改变而改变*/
    this.ieTag = (options && options.tag) ? `${options.tag}-` : '';
    this.parent = parent;
    this.isIE = !(this.checkIE() < 0 || this.checkIE() >= 10);
    this.timeout = (typeof options.timeout === 'number' && options.timeout > 0) ? options.timeout : 0;
    this.dataType = options.dataType && options.dataType.toLowerCase() === 'text' ? 'text' : this.dataType;

    this.multiple = false;
    this.numberLimit = false;
    this.fileFieldName = false;
    this.withCredentials = false;
    this.requestHeaders = false;
    this.disabledIEChoose = false;
    this.withoutFileUpload = false;
    this.textBeforeFiles = false;
    this.chooseAndUpload = false;
    this.filesToUpload = [];

    this.paramAddToField = null;
    this.accept = '';
    this.wrapperDisplay = 'inline-block';

    const emptyFunction = () => { };
    this.beforeChoose = emptyFunction;
    this.chooseFile = emptyFunction;
    this.beforeUpload = emptyFunction;
    this.doUpload = emptyFunction;
    this.uploading = emptyFunction;
    this.uploadSuccess = emptyFunction;
    this.uploadError = emptyFunction;
    this.uploadFail = emptyFunction;
    this.onabort = emptyFunction;

    Object.keys(options).forEach((key) => {
      switch (key) {
        default: {
          this[key] = options[key] || this[key];
          break;
        }
      }
    });

    if (this.filesToUpload.length && !this.isIE) {
      this.filesToUpload.forEach((file) => {
        this.files = [file];
        this.commonUpload();
      });
    }
  }

  state = {
    // 选择按钮。如果chooseAndUpload=true代表选择并上传。
    chooseBtn: this.refs.chooseAndUpload || this.refs.chooseBtn,
    // 上传按钮。如果chooseAndUpload=true则无效。
    uploadBtn: this.refs.uploadBtn,
  };

  componentWillReceiveProps(props) {
    this.files = props.options.files || this.files || false;
  }

  getUserAgent = () => {
    const userAgentString = this.props.options && this.props.options.userAgent;
    const navigatorIsAvailable = typeof navigator !== 'undefined';
    if (!navigatorIsAvailable && !userAgentString) {
      throw new Error('"options.userAgent" must be set when "navigator" is not defined in the global namespace(eg. on the server).');
    }
    return navigatorIsAvailable ? navigator.userAgent : userAgentString;
  }

  /* 当前ie上传组的id*/
  currentIEID = 0;
  /* 存放当前ie上传组的可用情况*/
  ieFormGroup = [true];
  /* 当前xhr的数组（仅有已开始上传之后的xhr）*/
  xhrList = [];
  currentXHRID = 0;

  /* 触发隐藏的input框选择*/
  /* 触发beforeChoose*/
  commonChooseFile = (e) => {
    const jud = this.beforeChoose();
    if (jud !== true && jud !== undefined) return;
    e.target.click();
    // this.refs['ajax-upload-file-input'].click();
  };

  /* 现代浏览器input change事件。File API保存文件*/
  /* 触发chooseFile*/
  commonChange = (e) => {
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    // e.persist();
    // console.log('common change event');
    // console.log(e);

    /* 如果限制了多文件上传时的数量*/
    const numberLimit = typeof this.numberLimit === 'function' ? this.numberLimit() : this.numberLimit;
    if (this.multiple && numberLimit && files.length > numberLimit) {
      const newFiles = {};
      files.forEach((file, i) => { newFiles[i] = file; });
      newFiles.length = numberLimit;
      files = newFiles;
    }
    this.files = files;
    console.log(this.files);
    this.chooseFile(files, this.parent);
    if (this.chooseAndUpload) {
      this.commonUpload(e);
    }
  };

  /* 执行上传*/
  commonUpload = (e) => {
    /* mill参数是当前时刻毫秒数，file第一次进行上传时会添加为file的属性，也可在beforeUpload为其添加，之后同一文件的mill不会更改，作为文件的识别id*/
    const mill = (this.files.length && this.files[0].mill) || (new Date()).getTime();
    // strange filelist
    const fileLen = this.files.length;
    const newFiles = [];
    for (let i = 0; i < fileLen; i++) {
      const file = this.files[i];
      // path is for electron
      newFiles.push({ name: file.name, lastModified: file.lastModified, lastModifiedDate: file.lastModifiedDate, path: file.path, size: file.size, type: file.type, webkitRelativePath: file.webkitRelativePath });
    }
    const jud = this.beforeUpload(newFiles, this.parent, mill);
    if (jud !== true && jud !== undefined && typeof jud !== 'object') {
      /* 清除input的值*/
      e.target.value = '';
      // this.refs['ajax-upload-file-input'].value = '';
      return;
    }


    if (!this.files) return;
    if (!this.baseUrl) throw new Error('baseUrl missing in options');

    /* 用于存放当前作用域的东西*/
    const scope = {};
    /* 组装FormData*/
    let formData = new FormData();
    /* If we need to add fields before file data append here*/
    if (this.textBeforeFiles) {
      formData = this.appendFieldsToFormData(formData);
    }
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
    /* If we need to add fields after file data append here*/
    if (!this.textBeforeFiles) {
      formData = this.appendFieldsToFormData(formData);
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
        this.uploadError({ type: 'TIMEOUTERROR', message: 'timeout' }, this.parent);
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
          this.uploadSuccess(resp, this.parent);
        } else if (xhr.readyState === 4) {
          /* xhr fail*/
          const resp = this.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
          this.uploadFail(resp, this.parent);
        }
      } catch (err) {
        /* 超时抛出不一样的错误，不在这里处理*/
        if (!scope.isTimeout) { this.uploadError({ type: 'FINISHERROR', message: err.message }, this.parent); }
      }
    };
    /* xhr error*/
    xhr.onerror = () => {
      try {
        const resp = this.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
        this.uploadError({ type: 'XHRERROR', message: resp }, this.parent);
      } catch (err) {
        this.uploadError({ type: 'XHRERROR', message: err.message }, this.parent);
      }
    };
    /* 这里部分浏览器实现不一致，而且ie没有这个方法*/
    xhr.onprogress = xhr.upload.onprogress = (progress) => {
      this.uploading(progress, this.parent, mill);
    };

    /* 不带文件上传，给秒传使用*/
    if (this.withoutFileUpload) {
      xhr.send(null);
    } else {
      xhr.send(formData);
    }

    /* 保存xhr id*/
    this.xhrList.push(xhr);
    const cID = this.xhrList.length - 1;
    this.currentXHRID = cID;

    /* 有响应abort的情况*/
    xhr.onabort = () => this.onabort(this.parent, mill, cID);

    /* trigger执行上传的用户回调*/
    this.doUpload(this.files, this.parent, mill, this.currentXHRID);

    /* 清除input的值*/
    e.target.value = '';
    // this.refs['ajax-upload-file-input'].value = '';
  }

  /* 组装自定义添加到FormData的对象*/
  appendFieldsToFormData = (formData) => {
    const field = typeof this.paramAddToField === 'function' ? this.paramAddToField() : this.paramAddToField;
    if (field) {
      Object.keys(field).map(index =>
        formData.append(index, field[index])
      );
    }
    return formData;
  }

  /* ie选择前验证*/
  /* 触发beforeChoose*/
  ieBeforeChoose = (event) => {
    const e = event || window.event;
    const jud = this.beforeChoose();
    if (jud !== true && jud !== undefined) {
      e.preventDefault();
    }
  }
  /* ie需要用户真实点击上传按钮，所以使用透明按钮*/
  /* 触发chooseFile*/
  ieChooseFile = (event) => {
    const e = event || window.event;
    const target = e.target || e.srcElement;
    this.fileName = target.value.substring(target.value.lastIndexOf('\\') + 1);
    this.chooseFile(this.fileName, this.parent);
    /* 先执行ieUpload，配置好action等参数，然后submit*/
    if (this.chooseAndUpload && this.ieUpload()) {
      document.getElementById(`ajax-upload-file-form-${this.ieTag}${this.currentIEID}`).submit();
    }
    target.blur();
  }
  /* ie处理上传函数*/
  /* 触发beforeUpload doUpload*/
  ieUpload = (event) => {
    const e = event || window.event;
    const mill = (new Date()).getTime();
    const jud = this.beforeUpload(this.fileName, this.parent, mill);
    if (!this.fileName || (jud !== true && jud !== undefined)) {
      e.preventDefault();
      return false;
    }

    /* url参数*/
    const baseUrl = this.baseUrl;

    const param = typeof this.param === 'function' ? this.param(this.fileName) : this.param;
    let paramStr = '';

    if (param) {
      const paramArr = [];
      param._ = mill;
      if (!param.ie) param.ie = 'true';
      Object.keys(param).forEach((key) => {
        if (param[key]) {
          paramArr.push(`${key}=${param[key]}`);
        }
      });
      paramStr = `?${paramArr.join('&')}`;
    }
    const targeturl = baseUrl + paramStr;

    document.getElementById(`ajax-upload-file-form-${this.ieTag}${this.currentIEID}`).setpropibute('action', targeturl);
    /* ie假的上传进度*/
    const getFakeProgress = fakeProgress();
    let loaded = 0;
    let count = 0;

    const progressInterval = setInterval(() => {
      loaded = getFakeProgress(loaded);
      this.uploading({
        loaded,
        total: 100
      }, this.parent, mill);
      /* 防止永久执行，设定最大的次数。暂时为30秒(200*150)*/
      if (++count >= 150) clearInterval(progressInterval);
    }, 200);


    /* 当前上传id*/
    const partIEID = this.currentIEID;
    /* 回调函数*/
    if (window.attachEvent) {
      document.getElementById(`ajax-upload-file-frame-${this.ieTag}${partIEID}`).attachEvent('onload', handleOnLoad);
    } else {
      document.getElementById(`ajax-upload-file-frame-${this.ieTag}${partIEID}`).addEventListener('load', handleOnLoad);
    }

    const handleOnLoad = () => {
      /* clear progress interval*/
      clearInterval(progressInterval);
      try {
        this.uploadSuccess(this.ieCallback(this.dataType, partIEID), this.parent);
      } catch (err) {
        this.uploadError(err, this.parent);
      } finally {
        /* 清除输入框的值*/
        const input = document.getElementById(`ajax-upload-hidden-input-${this.ieTag}${partIEID}`);
        input.innerHTML = input.innerHTML;
      }
    };
    this.doUpload(this.fileName, this.parent, mill);
    /* 置为非空闲*/
    this.ieFormGroup[this.currentIEID] = false;
    return true;
  }
  /* ie回调函数*/
  // TODO 处理Timeout
  ieCallback = (dataType, frameId) => {
    /* 回复空闲状态*/
    this.ieFormGroup[frameId] = true;

    const frame = document.getElementById(`ajax-upload-file-frame-${this.ieTag}${frameId}`);
    const resp = {};
    const content = frame.contentWindow ? frame.contentWindow.document.body : frame.contentDocument.document.body;
    if (!content) throw new Error('Your browser does not support async upload');
    try {
      resp.responseText = content.innerHTML || 'empty response';
      resp.json = JSON ? JSON.parse(resp.responseText) : `${resp.responseText}`;
    } catch (err) {
      /* 如果是包含了<pre>*/
      if (err.message && err.message.indexOf('Unexpected token') >= 0) {
        /* 包含返回的json*/
        if (resp.responseText.indexOf('{') >= 0) {
          const msg = resp.responseText.substring(resp.responseText.indexOf('{'), resp.responseText.lastIndexOf('}') + 1);
          return JSON ? JSON.parse(msg) : `${msg}`;
        }
        return { type: 'FINISHERROR', message: err.message };
      }
      throw err;
    }
    return dataType === 'json' ? resp.json : resp.responseText;
  }

  /* 外部调用方法，主动触发选择文件（等同于调用btn.click()), 仅支持现代浏览器*/
  forwardChoose = () => {
    if (this.isIE) return false;
    this.commonChooseFile();
  }

  /**
   * 外部调用方法，当多文件上传时，用这个方法主动删除列表中某个文件
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

  /* 外部调用方法，传入files（File API）对象可以立刻执行上传动作，ie不支持。调用随后会触发beforeUpload*/
  filesToUpload = (files) => {
    if (this.isIE) return;
    this.files = files;
    this.commonUpload();
  }

  /* 外部调用方法，取消一个正在进行的xhr，传入id指定xhr（doupload时返回）或者默认取消最近一个。*/
  abort = (id) => {
    if (id) {
      this.xhrList[id].abort();
    } else {
      this.xhrList[this.currentXHRID].abort();
    }
  }

  /* 判断ie版本*/
  checkIE = () => {
    const userAgent = this.userAgent;
    const version = userAgent.indexOf('MSIE');
    if (version < 0) return -1;

    return parseFloat(userAgent.substring(version + 5, userAgent.indexOf(';', version)));
  }

  /* ie多文件同时上传，需要多个表单+多个form组合。根据this.currentIEID代表有多少个form。*/
  /* 所有不在空闲（正在上传）的上传组都以display:none的形式插入，第一个空闲的上传组会display:block捕捉。*/
  multiIEForm = () => {
    const formArr = [];
    let hasFree = false;
    const insertIEForm = (i) => {
      /* 如果已经push了空闲组而当前也是空闲组*/
      if (this.ieFormGroup[i] && hasFree) return;
      /* 是否display*/
      const isShow = this.ieFormGroup[i];
      /* Input内联样式*/
      const style = {
        position: 'absolute',
        left: '-30px',
        top: 0,
        zIndex: '50',
        fontSize: '80px',
        width: '200px',
        opacity: 0,
        filter: 'alpha(opacity=0)'
      };

      /* 是否限制了文件后缀，以及是否disabled*/
      const restprops = {
        accept: this.accept,
        disabled: isDisabled
      };

      const input = (
        <input
          type="file" name={`ajax-upload-hidden-input-${i}`} id={`ajax-upload-hidden-input-${i}`}
          ref={`ajax-upload-hidden-input-${i}`} onChange={this.ieChooseFile} onClick={this.ieBeforeChoose}
          style={style} {...restprops}
        />);

      const j = `${this.ieTag}${i}`;
      formArr.push((
        <form
          id={`ajax-upload-file-form-${j}`}
          method="post"
          target={`ajax-upload-file-frame-${j}`}
          key={`ajax-upload-file-form-${j}`}
          encType="multipart/form-data" ref={`form-${j}`} onSubmit={this.ieUpload}
          style={{ display: isShow ? 'block' : 'none' }}
        >
          <div style={{ overflow: 'hidden', position: 'relative', display: 'inline-block' }}>
            {this.state.chooseBtn}
            {/* input file 的name不能省略*/}
            {input}
          </div>
          <div
            style={{
              overflow: 'hidden',
              position: 'relative',
              display: this.chooseAndUpload ? 'none' : this.wrapperDisplay
            }}
          >
            {this.state.uploadBtn}
            <input
              type="submit"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                fontSize: '50px',
                width: '200px',
                opacity: 0
              }}
            />
          </div>
        </form>
      ));
      formArr.push((
        <iframe
          id={`ajax-upload-file-frame-${j}`}
          name={`ajax-upload-file-frame-${j}`}
          key={`ajax-upload-file-frame-${j}`}
          className="ajax-upload-file-frame"
          style={{
            display: 'none',
            width: 0,
            height: 0,
            margin: 0,
            border: 0
          }}
        />
      ));
    };

    /* ie情况下，由于上传按钮被隐藏的input覆盖，不能进行disabled按钮处理。
     * 所以当disabledIEChoose为true（或者func返回值为true）时，禁止ie上传。
     */
    const isDisabled =
      typeof this.disabledIEChoose === 'function' ? this.disabledIEChoose() : this.disabledIEChoose;

    /* 这里this.ieFormGroup的长度会变，所以不能存len*/
    this.ieFormGroup.forEach((form, i) => {
      insertIEForm(i);
      /* 如果当前上传组是空闲，hasFree=true，并且指定当前上传组ID*/
      if (this.ieFormGroup[i] && !hasFree) {
        hasFree = true;
        this.currentIEID = i;
      }
      /* 如果所有上传组都不是空闲状态，push一个新增组*/
      if ((i === this.ieFormGroup.length - 1) && !hasFree) {
        this.ieFormGroup.push(true);
      }
    });

    return (
      <div className={this.props.className} style={this.props.style}>
        {formArr}
      </div>
    );
  }

  render() {
    /* ie用iframe表单上传，其他用ajax Formdata*/
    if (this.isIE) {
      return this.multiIEForm();
    }
    const restProps = {
      accept: this.accept,
      multiple: this.multiple,
    };
    return (
      <div className={this.props.className} style={this.props.style}>
        <div
          onClick={this.commonChooseFile}
          style={{ overflow: 'hidden', postion: 'relative', display: this.wrapperDisplay }}
        >
          {this.state.chooseBtn}
        </div>
        <div
          onClick={this.commonUpload}
          style={{
            overflow: 'hidden',
            postion: 'relative',
            display: this.chooseAndUpload ? 'none' : this.wrapperDisplay
          }}
        >
          {this.state.uploadBtn}
        </div>
        <input
          type="file" name="ajax-upload-file-input"
          style={{ display: 'none' }} onChange={this.commonChange}
          {...restProps}
        />
      </div>
    );
  }
}

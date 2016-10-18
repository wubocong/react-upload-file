(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["react-fileupload"] = factory(require("react"));
	else
		root["react-fileupload"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Warrior! on 2016/10/8.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	/**
	 * React文件上传组件，兼容IE8+
	 * 现代浏览器采用AJAX（XHR2+File API）上传。低版本浏览器使用form+iframe上传。
	 * 使用到ES6，需要经babel转译
	 */

	/* eslint indent: 0 */


	var emptyFunction = function emptyFunction() {};
	/* 当前IE上传组的id*/
	var currentIEID = 0;
	/* 存放当前IE上传组的可用情况*/
	var IEFormGroup = [true];
	/* 当前xhr的数组（仅有已开始上传之后的xhr）*/
	var xhrList = [];
	var currentXHRID = 0;

	var ReactFileUpload = function (_Component) {
	  _inherits(ReactFileUpload, _Component);

	  function ReactFileUpload() {
	    var _ref;

	    var _temp, _this, _ret;

	    _classCallCheck(this, ReactFileUpload);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ReactFileUpload.__proto__ || Object.getPrototypeOf(ReactFileUpload)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
	      chooseBtn: {}, // 选择按钮。如果chooseAndUpload=true代表选择并上传。
	      uploadBtn: {}, // 上传按钮。如果chooseAndUpload=true则无效。
	      before: [], // 存放props.children中位于chooseBtn前的元素
	      middle: [], // 存放props.children中位于chooseBtn后，uploadBtn前的元素
	      after: [] // 存放props.children中位于uploadBtn后的元素,
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	  /* 类型验证*/


	  _createClass(ReactFileUpload, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this.userAgent = this.getUserAgent();
	      this.isIE = !(this.checkIE() < 0 || this.checkIE() >= 10);
	      /* 因为IE每次要用到很多form组，如果在同一页面需要用到多个<FileUpload>可以在options传入tag作为区分。并且不随后续props改变而改变*/
	      var tag = this.props.options && this.props.options.tag;
	      this.IETag = tag ? tag + '_' : '';

	      this.updateProps(this.props);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(newProps) {
	      this.updateProps(newProps);
	    }
	  }, {
	    key: 'getUserAgent',
	    value: function getUserAgent() {
	      var userAgentString = this.props.options && this.props.options.userAgent;
	      var navigatorIsAvailable = typeof navigator !== 'undefined';
	      if (!navigatorIsAvailable && !userAgentString) {
	        throw new Error('`options.userAgent` must be set rendering react-fileuploader in situations when `navigator` is not defined in the global namespace. (on the server, for example)');
	      }
	      return navigatorIsAvailable ? navigator.userAgent : userAgentString;
	    }

	    /* 根据props更新组件*/

	  }, {
	    key: 'updateProps',
	    value: function updateProps(props) {
	      var _this2 = this;

	      this.isIE = !(this.checkIE() < 0 || this.checkIE() >= 10);
	      var options = props.options;
	      this.baseUrl = options.baseUrl; // 域名
	      this.param = options.param; // get参数
	      this.chooseAndUpload = options.chooseAndUpload || false; // 是否在用户选择了文件之后立刻上传
	      this.paramAddToField = options.paramAddToField || undefined; // 需要添加到FormData的对象。不支持IE
	      /* upload success 返回resp的格式*/
	      this.dataType = 'json';
	      if (options.dataType && options.dataType.toLowerCase() === 'text') {
	        this.dataType = 'text';
	      }
	      this.wrapperDisplay = options.wrapperDisplay || 'inline-block'; // 包裹chooseBtn或uploadBtn的div的display
	      this.timeout = typeof options.timeout === 'number' && options.timeout > 0 ? options.timeout : 0; // 超时时间
	      this.accept = options.accept || ''; // 限制文件后缀
	      this.multiple = options.multiple || false;
	      this.numberLimit = options.numberLimit || false; // 允许多文件上传时，选择文件数量的限制
	      this.fileFieldName = options.fileFieldName || false; // 文件附加到formData上时的key，传入string指定一个file的属性名，值为其属性的值。不支持IE
	      this.withCredentials = options.withCredentials || false; // 跨域时是否使用认证信息
	      this.requestHeaders = options.requestHeaders || false; // 要设置的请求头键值对
	      this.parent = props.parent;
	      /* 生命周期函数*/
	      /**
	       * beforeChoose() : 用户选择之前执行，返回true继续，false阻止用户选择
	       * @param  null
	       * @return  {boolean} 是否允许用户进行选择
	       */
	      this.beforeChoose = options.beforeChoose || emptyFunction;
	      /**
	       * chooseFile(file) : 用户选择文件后的触发的回调函数
	       * @param file {File | string} 现代浏览器返回File对象，IE返回文件名
	       * @return
	       */
	      this.chooseFile = options.chooseFile || emptyFunction;
	      /**
	       * beforeUpload(file,mill) : 用户上传之前执行，返回true继续，false阻止用户选择
	       * @param file {File | string} 现代浏览器返回File对象，IE返回文件名
	       * @param mill {long} 毫秒数，如果File对象已有毫秒数则返回一样的
	       * @return  {boolean || object} 是否允许用户进行上传 (hack:如果是obj{
	       *     assign:boolean 默认true
	       *     param:object
	       * }), 则对本次的param进行处理
	       */
	      this.beforeUpload = options.beforeUpload || emptyFunction;
	      /**
	       * doUpload(file,mill) : 上传动作(xhr send | form submit)执行后调用
	       * @param file {File | string} 现代浏览器返回File对象，IE返回文件名
	       * @param mill {long} 毫秒数，如果File对象已有毫秒数则返回一样的
	       * @return
	       */
	      this.doUpload = options.doUpload || emptyFunction;
	      /**
	       * uploading(progress) : 在文件上传中的时候，浏览器会不断触发此函数。IE中使用每200ms触发的假进度
	       * @param progress {Progress} progress对象，里面存有例如上传进度loaded和文件大小total等属性
	       * @return
	       */
	      this.uploading = options.uploading || emptyFunction;
	      /**
	       * uploadSuccess(resp) : 上传成功后执行的回调（针对AJAX而言）
	       * @param resp {json | string} 根据options.dataType指定返回数据的格式
	       * @return
	       */
	      this.uploadSuccess = options.uploadSuccess || emptyFunction;
	      /**
	       * uploadError(err) : 上传错误后执行的回调（针对AJAX而言）
	       * @param err {Error | object} 如果返回catch到的error，其具有type和message属性
	       * @return
	       */
	      this.uploadError = options.uploadError || emptyFunction;
	      /**
	       * uploadFail(resp) : 上传失败后执行的回调（针对AJAX而言）
	       * @param resp {string} 失败信息
	       */
	      this.uploadFail = options.uploadFail || emptyFunction;
	      /**
	       * onabort(mill, xhrID) : 主动取消xhr进程的响应
	       * @param mill {long} 毫秒数，本次上传时刻的时间
	       * @param xhrID {int} 在doUpload时会返回的当次xhr代表ID
	       */
	      this.onabort = options.onabort || emptyFunction;

	      this.files = options.files || this.files || false; // 保存需要上传的文件
	      /* 特殊内容*/

	      /* IE情况下，由于上传按钮被隐藏的input覆盖，不能进行disabled按钮处理。
	       * 所以当disabledIEChoose为true（或者func返回值为true）时，禁止IE上传。
	       */
	      this.disabledIEChoose = options.disabledIEChoose || false;

	      this.withoutFileUpload = options.withoutFileUpload || false; // 不带文件上传，为了给秒传功能使用，不影响IE
	      this.filesToUpload = options.filesToUpload || []; // 使用filesToUpload()方法代替
	      this.textBeforeFiles = options.textBeforeFiles || false; // make this true to add text fields before file data
	      /* 使用filesToUpload()方法代替*/
	      if (this.filesToUpload.length && !this.isIE) {
	        this.filesToUpload.forEach(function (file) {
	          _this2.files = [file];
	          _this2.commonUpload();
	        });
	      }

	      /* 放置虚拟DOM*/
	      var chooseBtn = void 0;
	      var uploadBtn = void 0;
	      var flag = 0;
	      var before = [];
	      var middle = [];
	      var after = [];
	      if (this.chooseAndUpload) {
	        _react2.default.Children.forEach(props.children, function (child) {
	          if (child && child.ref === 'chooseAndUpload') {
	            chooseBtn = child;
	            flag++;
	          } else {
	            flag === 0 ? before.push(child) : flag === 1 ? middle.push(child) : '';
	          }
	        });
	      } else {
	        _react2.default.Children.forEach(props.children, function (child) {
	          if (child && child.ref === 'chooseBtn') {
	            chooseBtn = child;
	            flag++;
	          } else if (child && child.ref === 'uploadBtn') {
	            uploadBtn = child;
	            flag++;
	          } else {
	            flag === 0 ? before.push(child) : flag === 1 ? middle.push(child) : after.push(child);
	          }
	        });
	      }
	      this.setState({
	        chooseBtn: chooseBtn,
	        uploadBtn: uploadBtn,
	        before: before,
	        middle: middle,
	        after: after
	      });
	    }

	    /* 触发隐藏的input框选择*/
	    /* 触发beforeChoose*/

	  }, {
	    key: 'commonChooseFile',
	    value: function commonChooseFile() {
	      var jud = this.beforeChoose();
	      if (jud !== true && jud !== undefined) return;
	      this.refs.ajax_upload_file_input.click();
	    }
	    /* 现代浏览器input change事件。File API保存文件*/
	    /* 触发chooseFile*/

	  }, {
	    key: 'commonChange',
	    value: function commonChange(e) {
	      var files = void 0;
	      e.dataTransfer ? files = e.dataTransfer.files : e.target ? files = e.target.files : '';

	      /* 如果限制了多文件上传时的数量*/
	      var numberLimit = typeof this.numberLimit === 'function' ? this.numberLimit() : this.numberLimit;
	      if (this.multiple && numberLimit && files.length > numberLimit) {
	        var newFiles = {};
	        for (var i = 0; i < numberLimit; i++) {
	          newFiles[i] = files[i];
	        }newFiles.length = numberLimit;
	        files = newFiles;
	      }
	      this.files = files;
	      this.chooseFile(files, this.parent);
	      this.chooseAndUpload && this.commonUpload();
	    }

	    /* 执行上传*/

	  }, {
	    key: 'commonUpload',
	    value: function commonUpload() {
	      var _this3 = this;

	      /* mill参数是当前时刻毫秒数，file第一次进行上传时会添加为file的属性，也可在beforeUpload为其添加，之后同一文件的mill不会更改，作为文件的识别id*/
	      var mill = this.files.length && this.files[0].mill || new Date().getTime();
	      var jud = this.beforeUpload(this.files, this.parent, mill);
	      if (jud !== true && jud !== undefined && (typeof jud === 'undefined' ? 'undefined' : _typeof(jud)) !== 'object') {
	        /* 清除input的值*/
	        this.refs.ajax_upload_file_input.value = '';
	        return;
	      }

	      if (!this.files) return;
	      if (!this.baseUrl) throw new Error('baseUrl missing in options');

	      /* 用于存放当前作用域的东西*/
	      var scope = {};
	      /* 组装FormData*/
	      var formData = new FormData();
	      /* If we need to add fields before file data append here*/
	      if (this.textBeforeFiles) {
	        formData = this.appendFieldsToFormData(formData);
	      }
	      if (!this.withoutFileUpload) {
	        (function () {
	          var fieldNameType = _typeof(_this3.fileFieldName);

	          /* 判断是用什么方式作为formdata item 的 name*/
	          Object.keys(_this3.files).forEach(function (key) {
	            if (key === 'length') return;

	            if (fieldNameType === 'function') {
	              var file = _this3.files[key];
	              var fileFieldName = _this3.fileFieldName(file);
	              formData.append(fileFieldName, file);
	            } else if (fieldNameType === 'string') {
	              var _file = _this3.files[key];
	              formData.append(_this3.fileFieldName, _file);
	            } else {
	              var _file2 = _this3.files[key];
	              formData.append(_file2.name, _file2);
	            }
	          });
	        })();
	      }
	      /* If we need to add fields after file data append here*/
	      if (!this.textBeforeFiles) {
	        formData = this.appendFieldsToFormData(formData);
	      }
	      var baseUrl = this.baseUrl;

	      /* url参数*/
	      /* 如果param是一个函数*/
	      var param = typeof this.param === 'function' ? this.param(this.files) : this.param;

	      var paramStr = '';

	      if (param) {
	        (function () {
	          var paramArr = [];
	          param._ = mill;
	          Object.keys(param).forEach(function (key) {
	            return paramArr.push(key + '=' + param[key]);
	          });
	          paramStr = '?' + paramArr.join('&');
	        })();
	      }
	      var targeturl = baseUrl + paramStr;

	      /* AJAX上传部分*/
	      var xhr = new XMLHttpRequest();
	      xhr.open('POST', targeturl, true);

	      /* 跨域是否开启验证信息*/
	      xhr.withCredentials = this.withCredentials;
	      /* 是否需要设置请求头*/
	      var rh = this.requestHeaders;
	      if (rh) {
	        Object.keys(rh).forEach(function (key) {
	          return xhr.setRequestHeader(key, rh[key]);
	        });
	      }

	      /* 处理超时。用定时器判断超时，不然xhr state=4 catch的错误无法判断是超时*/
	      if (this.timeout) {
	        xhr.timeout = this.timeout;
	        xhr.ontimeout = function () {
	          _this3.uploadError({ type: 'TIMEOUTERROR', message: 'timeout' }, _this3.parent);
	          scope.isTimeout = false;
	        };
	        scope.isTimeout = false;
	        setTimeout(function () {
	          scope.isTimeout = true;
	        }, this.timeout);
	      }

	      xhr.onreadystatechange = function () {
	        /* xhr finish*/
	        try {
	          if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
	            var resp = _this3.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
	            _this3.uploadSuccess(resp, _this3.parent);
	          } else if (xhr.readyState === 4) {
	            /* xhr fail*/
	            var _resp = _this3.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
	            _this3.uploadFail(_resp, _this3.parent);
	          }
	        } catch (e) {
	          /* 超时抛出不一样的错误，不在这里处理*/
	          !scope.isTimeout && _this3.uploadError({ type: 'FINISHERROR', message: e.message }, _this3.parent);
	        }
	      };
	      /* xhr error*/
	      xhr.onerror = function () {
	        try {
	          var resp = _this3.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
	          _this3.uploadError({ type: 'XHRERROR', message: resp }, _this3.parent);
	        } catch (e) {
	          _this3.uploadError({ type: 'XHRERROR', message: e.message }, _this3.parent);
	        }
	      };
	      /* 这里部分浏览器实现不一致，而且IE没有这个方法*/
	      xhr.onprogress = xhr.upload.onprogress = function (progress) {
	        _this3.uploading(progress, _this3.parent, mill);
	      };

	      /* 不带文件上传，给秒传使用*/
	      this.withoutFileUpload ? xhr.send(null) : xhr.send(formData);

	      /* 保存xhr id*/
	      xhrList.push(xhr);
	      var cID = xhrList.length - 1;
	      currentXHRID = cID;

	      /* 有响应abort的情况*/
	      xhr.onabort = function () {
	        return _this3.onabort(_this3.parent, mill, cID);
	      };

	      /* trigger执行上传的用户回调*/
	      this.doUpload(this.files, this.parent, mill, currentXHRID);

	      /* 清除input的值*/
	      this.refs.ajax_upload_file_input.value = '';
	    }

	    /* 组装自定义添加到FormData的对象*/

	  }, {
	    key: 'appendFieldsToFormData',
	    value: function appendFieldsToFormData(formData) {
	      var field = typeof this.paramAddToField === 'function' ? this.paramAddToField() : this.paramAddToField;
	      field && Object.keys(field).map(function (index) {
	        return formData.append(index, field[index]);
	      });
	      return formData;
	    }

	    /* iE选择前验证*/
	    /* 触发beforeChoose*/

	  }, {
	    key: 'IEBeforeChoose',
	    value: function IEBeforeChoose(e) {
	      var jud = this.beforeChoose();
	      jud !== true && jud !== undefined && e.preventDefault();
	    }
	    /* IE需要用户真实点击上传按钮，所以使用透明按钮*/
	    /* 触发chooseFile*/

	  }, {
	    key: 'IEChooseFile',
	    value: function IEChooseFile(e) {
	      this.fileName = e.target.value.substring(e.target.value.lastIndexOf('\\') + 1);
	      this.chooseFile(this.fileName, this.parent);
	      /* 先执行IEUpload，配置好action等参数，然后submit*/
	      this.chooseAndUpload && this.IEUpload() !== false && document.getElementById('ajax_upload_file_form_' + this.IETag + currentIEID).submit();
	      e.target.blur();
	    }
	    /* IE处理上传函数*/
	    /* 触发beforeUpload doUpload*/

	  }, {
	    key: 'IEUpload',
	    value: function IEUpload(e) {
	      var _this4 = this;

	      var mill = new Date().getTime();
	      var jud = this.beforeUpload(this.fileName, this.parent, mill);
	      if (!this.fileName || jud !== true && jud !== undefined) {
	        e && e.preventDefault();
	        return false;
	      }
	      var that = this;

	      /* url参数*/
	      var baseUrl = this.baseUrl;

	      var param = typeof this.param === 'function' ? this.param(this.fileName) : this.param;
	      var paramStr = '';

	      if (param) {
	        (function () {
	          var paramArr = [];
	          param._ = mill;
	          param.ie === undefined && (param.ie = 'true');
	          Object.keys(param).forEach(function (key) {
	            if (param[key] !== undefined) {
	              paramArr.push(key + '=' + param[key]);
	            }
	          });
	          paramStr = '?' + paramArr.join('&');
	        })();
	      }
	      var targeturl = baseUrl + paramStr;

	      document.getElementById('ajax_upload_file_form_' + this.IETag + currentIEID).setAttribute('action', targeturl);
	      /* IE假的上传进度*/
	      var getFakeProgress = this.fakeProgress();
	      var loaded = 0;
	      var count = 0;

	      var progressInterval = setInterval(function () {
	        loaded = getFakeProgress(loaded);
	        _this4.uploading({
	          loaded: loaded,
	          total: 100
	        }, _this4.parent, mill);
	        /* 防止永久执行，设定最大的次数。暂时为30秒(200*150)*/
	        ++count >= 150 && clearInterval(progressInterval);
	      }, 200);

	      /* 当前上传id*/
	      var partIEID = currentIEID;
	      /* 回调函数*/
	      window.attachEvent ? document.getElementById('ajax_upload_file_frame_' + this.IETag + partIEID).attachEvent('onload', handleOnLoad) : document.getElementById('ajax_upload_file_frame_' + this.IETag + partIEID).addEventListener('load', handleOnLoad);

	      function handleOnLoad() {
	        /* clear progress interval*/
	        clearInterval(progressInterval);
	        try {
	          that.uploadSuccess(that.IECallback(that.dataType, partIEID), this.parent);
	        } catch (e) {
	          that.uploadError(e, this.parent);
	        } finally {
	          /* 清除输入框的值*/
	          var oInput = document.getElementById('ajax_upload_hidden_input_' + that.IETag + partIEID);
	          oInput.outerHTML = oInput.outerHTML;
	        }
	      }
	      this.doUpload(this.fileName, this.parent, mill);
	      /* 置为非空闲*/
	      IEFormGroup[currentIEID] = false;
	    }
	    /* IE回调函数*/
	    // TODO 处理Timeout

	  }, {
	    key: 'IECallback',
	    value: function IECallback(dataType, frameId) {
	      /* 回复空闲状态*/
	      IEFormGroup[frameId] = true;

	      var frame = document.getElementById('ajax_upload_file_frame_' + this.IETag + frameId);
	      var resp = {};
	      var content = frame.contentWindow ? frame.contentWindow.document.body : frame.contentDocument.document.body;
	      if (!content) throw new Error('Your browser does not support async upload');
	      try {
	        resp.responseText = content.innerHTML || 'null innerHTML';
	        resp.json = JSON ? JSON.parse(resp.responseText) : '' + resp.responseText;
	      } catch (e) {
	        /* 如果是包含了<pre>*/
	        if (e.message && e.message.indexOf('Unexpected token') >= 0) {
	          /* 包含返回的json*/
	          if (resp.responseText.indexOf('{') >= 0) {
	            var msg = resp.responseText.substring(resp.responseText.indexOf('{'), resp.responseText.lastIndexOf('}') + 1);
	            return JSON ? JSON.parse(msg) : '' + msg;
	          }
	          return { type: 'FINISHERROR', message: e.message };
	        }
	        throw e;
	      }
	      return dataType === 'json' ? resp.json : resp.responseText;
	    }

	    /* 外部调用方法，主动触发选择文件（等同于调用btn.click()), 仅支持现代浏览器*/

	  }, {
	    key: 'forwardChoose',
	    value: function forwardChoose() {
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

	  }, {
	    key: 'fowardRemoveFile',
	    value: function fowardRemoveFile(func) {
	      this.files = func(this.files);
	    }

	    /* 外部调用方法，传入files（File API）对象可以立刻执行上传动作，IE不支持。调用随后会触发beforeUpload*/

	  }, {
	    key: 'filesToUpload',
	    value: function filesToUpload(files) {
	      if (this.isIE) return;
	      this.files = files;
	      this.commonUpload();
	    }

	    /* 外部调用方法，取消一个正在进行的xhr，传入id指定xhr（doupload时返回）或者默认取消最近一个。*/

	  }, {
	    key: 'abort',
	    value: function abort(id) {
	      id === undefined ? xhrList[currentXHRID].abort() : xhrList[id].abort();
	    }

	    /* 判断ie版本*/

	  }, {
	    key: 'checkIE',
	    value: function checkIE() {
	      var userAgent = this.userAgent;
	      var version = userAgent.indexOf('MSIE');
	      if (version < 0) return -1;

	      return parseFloat(userAgent.substring(version + 5, userAgent.indexOf(';', version)));
	    }

	    /* 生成假的IE上传进度*/

	  }, {
	    key: 'fakeProgress',
	    value: function fakeProgress() {
	      var add = 6;
	      var decrease = 0.3;
	      var end = 98;
	      var min = 0.2;
	      return function (lastTime) {
	        var start = lastTime;
	        if (start >= end) return start;

	        start += add;
	        add -= decrease;
	        add < min && (add = min);

	        return start;
	      };
	    }

	    /* IE多文件同时上传，需要多个表单+多个form组合。根据currentIEID代表有多少个form。*/
	    /* 所有不在空闲（正在上传）的上传组都以display:none的形式插入，第一个空闲的上传组会display:block捕捉。*/

	  }, {
	    key: 'multiIEForm',
	    value: function multiIEForm() {
	      var formArr = [];
	      var hasFree = false;

	      /* IE情况下，由于上传按钮被隐藏的input覆盖，不能进行disabled按钮处理。
	       * 所以当disabledIEChoose为true（或者func返回值为true）时，禁止IE上传。
	       */
	      var isDisabled = typeof this.disabledIEChoose === 'function' ? this.disabledIEChoose() : this.disabledIEChoose;

	      /* 这里IEFormGroup的长度会变，所以不能存len*/
	      for (var i = 0; i < IEFormGroup.length; i++) {
	        _insertIEForm.call(this, formArr, i);
	        /* 如果当前上传组是空闲，hasFree=true，并且指定当前上传组ID*/
	        if (IEFormGroup[i] && !hasFree) {
	          hasFree = true;
	          currentIEID = i;
	        }
	        /* 如果所有上传组都不是空闲状态，push一个新增组*/
	        if (i === IEFormGroup.length - 1 && !hasFree) {
	          IEFormGroup.push(true);
	        }
	      }

	      return _react2.default.createElement(
	        'div',
	        { className: this.props.className, style: this.props.style, id: 'react-file-uploader' },
	        formArr
	      );

	      function _insertIEForm(formArr, i) {
	        /* 如果已经push了空闲组而当前也是空闲组*/
	        if (IEFormGroup[i] && hasFree) return;
	        /* 是否display*/
	        var isShow = IEFormGroup[i];
	        /* Input内联样式*/
	        var style = {
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
	        var restAttrs = {
	          accept: this.accept,
	          disabled: isDisabled
	        };

	        var input = _react2.default.createElement('input', _extends({
	          type: 'file', name: 'ajax_upload_hidden_input_' + i, id: 'ajax_upload_hidden_input_' + i,
	          ref: 'ajax_upload_hidden_input_' + i, onChange: this.IEChooseFile, onClick: this.IEBeforeChoose,
	          style: style }, restAttrs));

	        i = '' + this.IETag + i;
	        formArr.push(_react2.default.createElement(
	          'form',
	          {
	            id: 'ajax_upload_file_form_' + i,
	            method: 'post',
	            target: 'ajax_upload_file_frame_' + i,
	            key: 'ajax_upload_file_form_' + i,
	            encType: 'multipart/form-data', ref: 'form_' + i, onSubmit: this.IEUpload,
	            style: { display: isShow ? 'block' : 'none' }
	          },
	          this.state.before,
	          _react2.default.createElement(
	            'div',
	            { style: { overflow: 'hidden', position: 'relative', display: 'inline-block' } },
	            this.state.chooseBtn,
	            input
	          ),
	          this.state.middle,
	          _react2.default.createElement(
	            'div',
	            {
	              style: {
	                overflow: 'hidden',
	                position: 'relative',
	                display: this.chooseAndUpload ? 'none' : this.wrapperDisplay
	              }
	            },
	            this.state.uploadBtn,
	            _react2.default.createElement('input', {
	              type: 'submit',
	              style: {
	                position: 'absolute',
	                left: 0,
	                top: 0,
	                fontSize: '50px',
	                width: '200px',
	                opacity: 0
	              }
	            })
	          ),
	          this.state.after
	        ));
	        formArr.push(_react2.default.createElement('iframe', {
	          id: 'ajax_upload_file_frame_' + i,
	          name: 'ajax_upload_file_frame_' + i,
	          key: 'ajax_upload_file_frame_' + i,
	          className: 'ajax_upload_file_frame',
	          style: {
	            display: 'none',
	            width: 0,
	            height: 0,
	            margin: 0,
	            border: 0
	          }
	        }));
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      /* IE用iframe表单上传，其他用ajax Formdata*/
	      if (this.isIE) {
	        return this.multiIEForm();
	      }
	      var restAttrs = {
	        accept: this.accept,
	        multiple: this.multiple
	      };
	      return _react2.default.createElement(
	        'div',
	        { className: this.props.className, style: this.props.style },
	        this.state.before,
	        _react2.default.createElement(
	          'div',
	          {
	            onClick: this.commonChooseFile,
	            style: { overflow: 'hidden', postion: 'relative', display: this.wrapperDisplay }
	          },
	          this.state.chooseBtn
	        ),
	        this.state.middle,
	        _react2.default.createElement(
	          'div',
	          {
	            onClick: this.commonUpload,
	            style: {
	              overflow: 'hidden',
	              postion: 'relative',
	              display: this.chooseAndUpload ? 'none' : this.wrapperDisplay
	            }
	          },
	          this.state.uploadBtn
	        ),
	        this.state.after,
	        _react2.default.createElement('input', _extends({
	          type: 'file', name: 'ajax_upload_file_input', ref: 'ajax_upload_file_input',
	          style: { display: 'none' }, onChange: this.commonChange
	        }, restAttrs))
	      );
	    }
	  }]);

	  return ReactFileUpload;
	}(_react.Component);

	ReactFileUpload.propTypes = {
	  options: _react.PropTypes.shape({
	    /* basics*/
	    baseUrl: _react.PropTypes.string.isRequired,
	    param: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]),
	    dataType: _react.PropTypes.string,
	    chooseAndUpload: _react.PropTypes.bool,
	    paramAddToField: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]),
	    wrapperDisplay: _react.PropTypes.string,
	    timeout: _react.PropTypes.number,
	    accept: _react.PropTypes.string,
	    multiple: _react.PropTypes.bool,
	    numberLimit: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]),
	    fileFieldName: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
	    withCredentials: _react.PropTypes.bool,
	    requestHeaders: _react.PropTypes.object,
	    /* specials*/
	    tag: _react.PropTypes.string,
	    userAgent: _react.PropTypes.string,
	    disabledIEChoose: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.func]),
	    withoutFileUpload: _react.PropTypes.bool,
	    filesToUpload: _react.PropTypes.arrayOf(_react.PropTypes.object),
	    textBeforeFiles: _react.PropTypes.bool,
	    /* funcs*/
	    beforeChoose: _react.PropTypes.func,
	    chooseFile: _react.PropTypes.func,
	    beforeUpload: _react.PropTypes.func,
	    doUpload: _react.PropTypes.func,
	    uploading: _react.PropTypes.func,
	    uploadSuccess: _react.PropTypes.func,
	    uploadError: _react.PropTypes.func,
	    uploadFail: _react.PropTypes.func,
	    onabort: _react.PropTypes.func
	  }).isRequired,
	  parent: _react.PropTypes.object,
	  style: _react.PropTypes.object,
	  className: _react.PropTypes.string
	};
	exports.default = ReactFileUpload;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;
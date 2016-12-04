(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["react-upload-file"] = factory(require("react"));
	else
		root["react-upload-file"] = factory(root["React"]);
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

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Warrior! on 2016/10/18.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var ReactUploadFile = function (_Component) {
	  _inherits(ReactUploadFile, _Component);

	  function ReactUploadFile(props) {
	    _classCallCheck(this, ReactUploadFile);

	    var _this = _possibleConstructorReturn(this, (ReactUploadFile.__proto__ || Object.getPrototypeOf(ReactUploadFile)).call(this, props));

	    _this.state = {
	      /* xhrs' list after start uploading files */
	      xhrList: [],
	      currentXHRId: 0
	    };

	    _this.commonChooseFile = function (e) {
	      if (e.target.name !== 'ajax-upload-file-input') {
	        var jud = _this.beforeChoose();
	        if (jud !== true && jud !== undefined) return;
	        _this.input.click();
	      }
	    };

	    _this.commonChangeFile = function (e) {
	      _this.files = _this.input.files;
	      _this.didChoose(_this.files);

	      /* immediately upload files */
	      if (!_this.props.uploadFileButton) {
	        _this.commonUploadFile(e);
	      }
	    };

	    _this.commonUploadFile = function (e) {
	      if (!_this.files || !_this.files.length) return false;
	      if (!_this.baseUrl) {
	        throw new Error('baseUrl missed in options');
	      }

	      var jud = e === true ? true : _this.beforeUpload(_this.files);
	      if (!jud) {
	        return false;
	      }

	      var formData = new FormData();
	      formData = _this.appendFieldsToFormData(formData);

	      var fieldNameType = _typeof(_this.fileFieldName);
	      var numberLimit = _this.numberLimit === 0 ? _this.files.length : Math.min(_this.files.length, _this.numberLimit);
	      for (var i = numberLimit - 1; i >= 0; i--) {
	        if (fieldNameType === 'function') {
	          var file = _this.files[i];
	          var fileFieldName = _this.fileFieldName(file);
	          formData.append(fileFieldName, file);
	        } else if (fieldNameType === 'string') {
	          var _file = _this.files[i];
	          formData.append(_this.fileFieldName, _file);
	        } else {
	          var _file2 = _this.files[i];
	          formData.append(_file2.name, _file2);
	        }
	      }

	      var baseUrl = _this.baseUrl;
	      /* url query*/
	      var query = typeof _this.query === 'function' ? _this.query(_this.files) : _this.query;
	      var pos = baseUrl.indexOf('?');
	      var queryStr = void 0;
	      if (pos > -1) {
	        queryStr = baseUrl.substring(pos);
	        baseUrl = baseUrl.substring(0, pos);
	      }
	      if (query) {
	        (function () {
	          if (queryStr) {
	            console.warn('Your url contains query string, which will be ignored when options.query is set.');
	          }
	          var queryArr = [];
	          Object.keys(query).forEach(function (key) {
	            return queryArr.push(key + '=' + query[key]);
	          });
	          queryStr = '?' + queryArr.join('&');
	        })();
	      }
	      queryStr = queryStr || '';
	      var targetUrl = '' + baseUrl + queryStr;

	      var xhr = new XMLHttpRequest();
	      xhr.open('post', targetUrl, true);

	      /* authorization info for cross-domain */
	      xhr.withCredentials = _this.withCredentials;

	      var rh = _this.requestHeaders;
	      if (rh) {
	        Object.keys(rh).forEach(function (key) {
	          return xhr.setRequestHeader(key, rh[key]);
	        });
	      }

	      if (_this.timeout) {
	        xhr.timeout = _this.timeout;
	        xhr.addEventListener('timeout', function () {
	          _this.uploadError({
	            type: '408',
	            message: 'Request Timeout'
	          });
	        });
	        setTimeout(function () {}, _this.timeout);
	      }

	      xhr.addEventListener('load', function () {
	        _this.input.value = '';
	        var res = _this.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
	        _this.uploadSuccess(res);
	      });

	      xhr.addEventListener('error', function () {
	        var err = _this.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
	        _this.uploadError({
	          type: err.type,
	          message: err.message
	        });
	      });

	      xhr.addEventListener('progress', function (progress) {
	        _this.uploading(progress);
	      });

	      var curId = _this.state.xhrList.length - 1;
	      xhr.addEventListener('abort', function () {
	        _this.onAbort(curId);
	      });

	      xhr.send(formData);

	      _this.setState({
	        currentXHRId: curId,
	        xhrList: [].concat(_toConsumableArray(_this.state.xhrList), [xhr])
	      });

	      /* trigger didUpload */
	      _this.didUpload(_this.files, _this.state.currentXHRId);

	      return true;
	    };

	    _this.appendFieldsToFormData = function (formData) {
	      var field = typeof _this.body === 'function' ? _this.body() : _this.body;
	      if (field) {
	        Object.keys(field).forEach(function (index) {
	          formData.append(index, field[index]);
	        });
	      }
	      return formData;
	    };

	    _this.processFile = function (func) {
	      _this.files = func(_this.files);
	    };

	    _this.manuallyChooseFile = function () {
	      _this.commonChooseFile();
	    };

	    _this.manuallyUploadFile = function (files) {
	      _this.files = files && files.length ? files : _this.files;
	      _this.commonUploadFile(true);
	    };

	    _this.abort = function (id) {
	      if (id) {
	        _this.state.xhrList[id].abort();
	      } else {
	        _this.state.xhrList[_this.state.currentXHRId].abort();
	      }
	    };

	    var emptyFunction = function emptyFunction() {};
	    var options = _extends({
	      dataType: 'json',
	      timeout: 0,
	      numberLimit: 0,
	      userAgent: window.navigator.userAgent,
	      multiple: false,
	      withCredentials: false,
	      beforeChoose: emptyFunction,
	      didChoose: emptyFunction,
	      beforeUpload: emptyFunction,
	      didUpload: emptyFunction,
	      uploading: emptyFunction,
	      uploadSuccess: emptyFunction,
	      uploadError: emptyFunction,
	      uploadFail: emptyFunction,
	      onAbort: emptyFunction
	    }, props.options);
	    var timeout = parseInt(options.timeout, 10);
	    options.timeout = Number.isInteger(timeout) && timeout > 0 ? timeout : 0;
	    var dataType = options.dataType && options.dataType.toLowerCase();
	    options.dataType = dataType !== 'json' && 'text';

	    /* copy options to instance */
	    Object.keys(options).forEach(function (key) {
	      _this[key] = options[key];
	    });
	    return _this;
	  }

	  _createClass(ReactUploadFile, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.input = document.querySelector('[name=ajax-upload-file-input]');
	    }

	    /* trigger input's click*/
	    /* trigger beforeChoose*/


	    /* input change event with File API */
	    /* trigger chooseFile */


	    /* execute upload */


	    /* append text params to formData */


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


	    /* public method. Manually trigger commonChooseFile for debug */


	    /* public method. Manually trigger commonUploadFile to upload files */


	    /* public method. Abort a xhr by id which didUpload has returned, default the last one */

	  }, {
	    key: 'render',
	    value: function render() {
	      var inputProps = {
	        accept: this.props.options.accept,
	        multiple: this.props.options.multiple
	      };
	      var chooseFileButton = _react2.default.cloneElement(this.props.chooseFileButton, {
	        onClick: this.commonChooseFile
	      }, [_react2.default.createElement('input', _extends({ type: 'file', name: 'ajax-upload-file-input', style: { display: 'none' }, onChange: this.commonChangeFile }, inputProps, { key: 'file-button' }))]);
	      var uploadFileButton = this.props.uploadFileButton && _react2.default.cloneElement(this.props.uploadFileButton, {
	        onClick: this.commonUploadFile
	      });
	      return _react2.default.createElement(
	        'div',
	        { style: { display: 'inline-block' } },
	        chooseFileButton,
	        uploadFileButton
	      );
	    }
	  }]);

	  return ReactUploadFile;
	}(_react.Component);

	ReactUploadFile.propTypes = {
	  options: _react.PropTypes.shape({
	    /* basics*/
	    baseUrl: _react.PropTypes.string.isRequired,
	    query: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]),
	    body: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]),
	    dataType: _react.PropTypes.string,
	    timeout: _react.PropTypes.number,
	    numberLimit: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]),
	    fileFieldName: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
	    withCredentials: _react.PropTypes.bool,
	    requestHeaders: _react.PropTypes.object,
	    accept: _react.PropTypes.string,
	    multiple: _react.PropTypes.bool,
	    userAgent: _react.PropTypes.string,
	    /* funcs*/
	    beforeChoose: _react.PropTypes.func,
	    didChoose: _react.PropTypes.func,
	    beforeUpload: _react.PropTypes.func,
	    didUpload: _react.PropTypes.func,
	    uploading: _react.PropTypes.func,
	    uploadSuccess: _react.PropTypes.func,
	    uploadError: _react.PropTypes.func,
	    uploadFail: _react.PropTypes.func,
	    onAbort: _react.PropTypes.func
	  }).isRequired,
	  style: _react.PropTypes.object,
	  className: _react.PropTypes.string,
	  /* buttons*/
	  chooseFileButton: _react.PropTypes.element.isRequired,
	  uploadFileButton: _react.PropTypes.element
	};
	ReactUploadFile.defaultProps = {
	  /* buttons*/
	  chooseFileButton: _react2.default.createElement('button', null)
	};
	exports.default = ReactUploadFile;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;
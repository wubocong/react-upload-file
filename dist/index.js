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
	      currentXHRID: 0
	    };

	    _this.commonChooseFile = function (e) {
	      if (e.target.name !== 'ajax-upload-file-input') {
	        var jud = _this.beforeChoose();
	        if (jud !== true && jud !== undefined) return;
	        e.target.childNodes[0].click();
	      }
	    };

	    _this.commonChangeFile = function (e) {
	      _this.files = e.target.files;
	      _this.onChoose(_this.files);

	      /* immediately upload files */
	      if (!_this.props.uploadFile) {
	        _this.commonUploadFile(e);
	      }
	    };

	    _this.commonUploadFile = function (e) {
	      /* current timestamp in millisecond for identifying each file */
	      var mill = _this.files.length && _this.files[0].mill || new Date().getTime();

	      /* strange Filelist, make files array from DOM Filelist */
	      /* limit the number of files */
	      var numberLimit = typeof _this.numberLimit === 'function' ? _this.numberLimit() : _this.numberLimit;
	      var fileLen = Math.min(_this.files.length, numberLimit);
	      var files = [];
	      for (var i = 0; i < fileLen; i++) {
	        var file = _this.files[i];
	        // path only appears in electron
	        files.push({
	          name: file.name,
	          lastModified: file.lastModified,
	          lastModifiedDate: file.lastModifiedDate,
	          path: file.path,
	          size: file.size,
	          type: file.type,
	          webkitRelativePath: file.webkitRelativePath
	        });
	      }

	      var jud = _this.beforeUpload(files, mill);
	      if (jud !== true && jud !== undefined) {
	        /* clear input's' files */
	        e.target.value = '';
	        return false;
	      }
	      if (!_this.files) return false;
	      if (!_this.baseUrl) throw new Error('baseUrl missing in options');

	      /* store info of current scope*/
	      var scope = {};
	      /* assemble formData object */
	      var formData = new FormData();
	      /* append text fields' param */
	      formData = _this.appendFieldsToFormData(formData);
	      var fieldNameType = _typeof(_this.fileFieldName);
	      Object.keys(_this.files).forEach(function (key) {
	        if (key === 'length') return;

	        if (fieldNameType === 'function') {
	          var _file = _this.files[key];
	          var fileFieldName = _this.fileFieldName(_file);
	          formData.append(fileFieldName, _file);
	        } else if (fieldNameType === 'string') {
	          var _file2 = _this.files[key];
	          formData.append(_this.fileFieldName, _file2);
	        } else {
	          var _file3 = _this.files[key];
	          formData.append(_file3.name, _file3);
	        }
	      });

	      var baseUrl = _this.baseUrl;
	      /* url query*/
	      var query = typeof _this.query === 'function' ? _this.query(_this.files) : _this.query;
	      var pos = baseUrl.indexOf('?');
	      var queryStr = void 0;
	      if (pos > -1) {
	        queryStr = baseUrl.substring(pos);
	      }
	      if (query) {
	        (function () {
	          if (queryStr) {
	            console.warn('Your url contains query string, which will be ignored when options.query is set.');
	          }
	          var queryArr = [];
	          query._ = mill;
	          Object.keys(query).forEach(function (key) {
	            return queryArr.push(key + '=' + query[key]);
	          });
	          queryStr = '?' + queryArr.join('&');
	        })();
	      }
	      var targetUrl = '' + baseUrl.substring(0, pos) + queryStr;

	      /* execute ajax upload */
	      var xhr = new XMLHttpRequest();
	      xhr.open('POST', targetUrl, true);

	      /* authorization info for cross-domain */
	      xhr.withCredentials = _this.withCredentials;
	      /* setting request headers */
	      var rh = _this.requestHeaders;
	      if (rh) {
	        Object.keys(rh).forEach(function (key) {
	          return xhr.setRequestHeader(key, rh[key]);
	        });
	      }

	      /* handle timeout */
	      if (_this.timeout) {
	        xhr.timeout = _this.timeout;
	        xhr.ontimeout = function () {
	          _this.uploadError({ type: 'TIMEOUTERROR', message: 'timeout' });
	          scope.isTimeout = false;
	        };
	        scope.isTimeout = false;
	        setTimeout(function () {
	          scope.isTimeout = true;
	        }, _this.timeout);
	      }

	      xhr.onreadystatechange = function () {
	        /* xhr request finished*/
	        try {
	          if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
	            var resp = _this.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
	            _this.uploadSuccess(resp);
	          } else if (xhr.readyState === 4) {
	            /* xhr fail*/
	            var _resp = _this.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
	            _this.uploadFail(_resp);
	          }
	        } catch (err) {
	          /* errors except timeout */
	          if (!scope.isTimeout) {
	            _this.uploadError({ type: 'FINISHERROR', message: err.message });
	          }
	        }
	      };
	      /* xhr error*/
	      xhr.onerror = function () {
	        try {
	          var resp = _this.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText;
	          _this.uploadError({ type: 'XHRERROR', message: resp });
	        } catch (err) {
	          _this.uploadError({ type: 'XHRERROR', message: err.message });
	        }
	      };

	      xhr.onprogress = xhr.upload.onprogress = function (progress) {
	        _this.uploading(progress, mill);
	      };

	      xhr.send(formData);

	      /* save xhr's id */
	      var cID = _this.state.xhrList.length - 1;
	      _this.setState({ currentXHRID: cID, xhrList: [].concat(_toConsumableArray(_this.state.xhrList), [xhr]) });

	      /* abort */
	      xhr.onabort = function () {
	        return _this.onAbort(mill, cID);
	      };

	      /* trigger didUpload */
	      _this.didUpload(_this.files, mill, _this.state.currentXHRID);

	      /* clear input's files */
	      e.target.value = '';

	      return true;
	    };

	    _this.appendFieldsToFormData = function (formData) {
	      var field = typeof _this.paramAddToField === 'function' ? _this.paramAddToField() : _this.paramAddToField;
	      if (field) {
	        Object.keys(field).forEach(function (index) {
	          formData.append(index, field[index]);
	        });
	      }
	      return formData;
	    };

	    _this.forwardChooseFile = function () {
	      _this.commonChooseFile();
	    };

	    _this.fowardProcessFile = function (func) {
	      _this.files = func(_this.files);
	    };

	    _this.filesToUpload = function (files) {
	      _this.files = files;
	      _this.commonUploadFile();
	    };

	    _this.abort = function (id) {
	      if (id) {
	        _this.state.xhrList[id].abort();
	      } else {
	        _this.state.xhrList[_this.state.currentXHRID].abort();
	      }
	    };

	    var emptyFunction = function emptyFunction() {};
	    var options = _extends({
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

	  /* trigger input's click*/
	  /* trigger beforeChoose*/


	  /* input change event with File API */
	  /* trigger chooseFile */


	  /* execute upload */


	  /* append text params to formData */


	  /* public method. Manually trigger commonChooseFile for debug */


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


	  /* public method. Manually trigger commonUploadFile to upload files */


	  /* public method. Abort a xhr by id which didUpload has returned, default the last one */


	  _createClass(ReactUploadFile, [{
	    key: 'render',
	    value: function render() {
	      var inputProps = { accept: this.props.options.accept, multiple: this.props.options.multiple };
	      var chooseFileBtn = _react2.default.cloneElement(this.props.chooseFile, { onClick: this.commonChooseFile }, [_react2.default.createElement('input', _extends({
	        type: 'file', name: 'ajax-upload-file-input',
	        style: { display: 'none' }, onChange: this.commonChangeFile
	      }, inputProps, {
	        key: 'file-button'
	      }))]);
	      var uploadFileBtn = this.props.uploadFile && _react2.default.cloneElement(this.props.uploadFile, { onClick: this.commonUploadFile });
	      return _react2.default.createElement(
	        'div',
	        null,
	        chooseFileBtn,
	        uploadFileBtn
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
	    dataType: _react.PropTypes.string,
	    paramAddToField: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.func]),
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
	    onChoose: _react.PropTypes.func,
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
	  chooseFile: _react.PropTypes.element.isRequired,
	  uploadFile: _react.PropTypes.element
	};
	ReactUploadFile.defaultProps = {
	  /* buttons*/
	  chooseFile: _react2.default.createElement('button', null)
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
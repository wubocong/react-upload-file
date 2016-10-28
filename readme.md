# react-upload-file #

[![NPM version](https://badge.fury.io/js/react-upload-file.svg)](https://www.npmjs.com/package/react-upload-file)
[![NPM downloads](http://img.shields.io/npm/dm/react-upload-file.svg?style=flat)](https://npmjs.org/package/react-upload-file)
[![Build Status](https://secure.travis-ci.org/wubocong/react-upload-file.png)](https://travis-ci.org/wubocong/react-upload-file)
[![License](https://img.shields.io/github/license/wubocong/react-upload-file.svg)](https://spdx.org/licenses/MIT)
[![Code Climate](https://codeclimate.com/github/wubocong/react-upload-file/badges/gpa.svg)](https://codeclimate.com/github/wubocong/react-upload-file)
[![Test Coverage](https://codeclimate.com/github/wubocong/react-upload-file/badges/coverage.svg)](https://codeclimate.com/github/wubocong/react-upload-file/coverage)
[![Node.js version](https://img.shields.io/node/v/gh-badges.svg)](https://nodejs.org)
## Index ##

### Catalog ###
* [Introduce](#introduce)
* [Install](#install)
* [API](#api)
  * [Basic Options](#basic-options)
  * [Life Circle Functions](#life-circle-functions)
  * [Custom Buttons](#custom-buttons)
  * [Component Functions](#component-functions)
* [Examples](#examples)
* [Author](#contributor)
* [License](#license)


## Introduce ##
A **light**, **fast** and **powerful** file upload component of React which support IE10+ and partially support IE9, requiring node4+.

```jsx
import ReactUploadFile from 'react-upload-file';
...
render() {
  /*set properties*/
  const options = {
    baseUrl: 'http://127.0.0.1',
    param:{
      warrior: 'fight'
    }
  }
  /* Use ReactUploadFile with options */
  /* Custom your buttons */
  return (
    <ReactUploadFile options={options} chooseFile=(<YourChooseButton />) uploadFile=(<YourUploadButton />) />
  );
}
```

## Installation ##
`npm install react-upload-file -S`

## API ##

### Basic Options ###
```js
options: {
  baseUrl: 'xxx',
  ...
}
```
`options` is an attribute of `ReactUploadFile`. The properties of `options` are:

name | type | default | note
------------ | ------------- | ------------ | ------------
baseUrl | string | '' | url
param | object | undefined | params that appended after `baseUrl`.
dataType | json/text  | 'json' | type of response.
timeout | number | 0 | Timeout of the request. Callback function `uploadError` will be triggered and an object { type: 'TIMEOUTERROR', message: 'timeout' } will be returned as the argument. Default to 0 meaning no limit.
paramAddToField | object/func | undefined | Key-value that need to add to  formData. When it is a function, use the return.
accept | string | undefined | Limit the type (extension) of file.
multiple | boolean | false | Allow multi-upload or not.
numberLimit | number/func | 10 | Limit how much file that user can choose in multi-upload case.User can still choose but `ReactUploadFile` will filter.
fileFieldName | string/func | undefined | Determine the field name of file. If it is a function, which will receive each file object as argument, use its return value. Default to file's name.
withCredentials | boolean | false | Same as 'xhr.withCredentials'.
requestHeaders | object | undefined | Key-values that will be set using 'xhr.setRequestHeader(key, value)'.
userAgent | string | window.navigator.userAgent | Used to set the User Agent String when serverside rendering isomorphic applications. (required when rendering on the server)

### Life Circle Functions ###
Also set as the properties of options.

#### beforeChoose() ####
Triggered immediately after clicking the `chooseFile` but before choosing file. Return true to continue or false to stop choosing.

@param

@return {boolean} Determine whether to continue uploading

#### chooseFile(files) ####
The callback triggered after choosing.

@param files {array[File]} The array contains files.

@return

#### beforeUpload(files, mill) ####
Triggered before uploading. Return true to continue or false to stop uploading.

@param files {array[File] | string} The array contains files.

@param mill {long} The time of the upload action (millisecond). If the File instance has the `mill` property it will be the same as it.

@return {boolean} Allow the upload action or not.

#### didUpload(files, mill, xhrID) ####
Triggered after the request is sent(xhr send | form submit).

@param files {array[File] | string} The array contains files.

@param mill {long} The time of the upload action (millisecond). If the File instance has the `mill` property it will be the same as it.

@param xhrID {int} ID of this uploading xhr. Could be useful for `abort`.

@return

#### onAbort(mill, id) ####
Triggered after you aborting a xhr.

@param mill {long} The time of the upload action (millisecond) that you aborted.

@param xhrID {int} The ID of the xhr taht you aborted.

#### uploading(progress) ####
It will be triggered continuously when the file is uploading in moderns.

@param progress {Progress} Progress instance，useful properties such as loaded and total can be found.

@return

#### uploadSuccess(resp) ####
Callback when upload succeed (according to the AJAX simply).

@param resp {json | string} The response is fomatted According to options.dataType.

@return

#### uploadError(err) ####
Callback when error occurred (according to the AJAX simply).

@param err {Error | object} If this is an error that caught by `try`, it will be an object with `type` and `message`.

@return

#### uploadFail(resp) ####
Callback when upload failed (according to the AJAX simply).

@param resp {string} Message of it.

### Custom buttons ###
You can display two of your custom buttons by setting two attributes of `ReactUploadFile` as mentioned before.

#### chooseFile
Component that interacts with user to choose files.

#### [uploadFile]
Component that starts uploading(optional).

```jsx
<ReactUploadFile options={...} chooseFile=(<YourChooseButton />) uploadFile=(<YourUploadButton />) />
```

Will be rendered like this:

```jsx
<YourChooseButton {...} /><YourUploadButton {...} />
```

If you don't set the `uploadFile` attribute, then `ReactUploadFile` will upload the files immediately after you choose files.

```jsx
<ReactUploadFile options={...} chooseFile=(<YourChooseButton />) />
```

### Component Functions ###
Use via ref. eg:

```jsx
componentDidUpdate() {
  this.upload.filesToUpload([this.state.file]);
}

render() {
  return (
    <ReactUploadFile ref={(upload) => {this.upload = upload;}} options={...} chooseFile=(<YourChooseButton />) uploadFile=(<YourUploadButton />) />
  );
}
```

#### filesToUpload ####
IF there is file(File instance) that need to be uploaded immediately,use this function. BeforeUpload() will be triggered after this function

@param files {array[file]} files array that need to be uploaded

@return null

#### forwardChoose ####
Do the same as clicking `chooseFile` . Only support modern browsers.

@param null

@return null

#### abort ####
Abort a xhr. Temporarily only works in modern browsers.

@param xhrID {int} If not passing an ID, will abort the newest one. You can get the ID of a xhr in `doUpload()`.

## Examples ##
Simple example:

```jsx
import ReactUploadFile from 'react-upload-file';
...
render() {
  /*set properties*/
  const options = {
    baseUrl: 'http://127.0.0.1',
    param: {
      warrior: 'fight'
    }
  }
  /* Use ReactUploadFile with options */
  /* Custom your buttons */
  return (
    <ReactUploadFile options={options} chooseFile=(<YourChooseButton />) uploadFile=(<YourUploadButton />) />
  );
}
```

Most of the options may be set like:

```jsx
options: {
  baseUrl: './upload',
  param: {
    category: '1',
    _: Date().getTime()
  },
  dataType: 'json',
  multiple: true,
  numberLimit: 9,
  accept: 'image/*',
  chooseAndUpload: false,
  paramAddToField: {
    purpose: 'save'
  },
  // fileFieldName: 'file',
  fileFieldName(file) {
    return file.name;
  },
  withCredentials: false,
  requestHeaders: {
    'User-Agent': 'Warrior!'
  },
  beforeChoose: function () {
    return user.isAllowUpload;
  },
  chooseFile: function (files) {
    console.log('you choose', typeof files == 'string' ? files : files[0].name);
  },
  beforeUpload: function (files, mill) {
    if (typeof files === 'string') return true;
    if (files[0].size < 1024 * 1024 * 20) {
      files[0].mill = mill;
      return true;
    }
    return false;
  },
  doUpload: function (files, mill) {
    console.log('you just uploaded', typeof files === 'string' ? files : files[0].name);
  },
  uploading: function (progress) {
    console.log('loading...', progress.loaded / progress.total + '%');
  },
  uploadSuccess: function (resp) {
    console.log('upload success!');
  },
  uploadError: function (err) {
    alert(err.message);
  },
  uploadFail: function (resp) {
    alert(resp);
  }
}

if (typeof window === 'undefined') {
  options.userAgent = this.props.userAgentString;
}

```

## License ##
MIT

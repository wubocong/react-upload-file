# react-upload-file #

[![NPM version](https://badge.fury.io/js/react-upload-file.svg)](https://www.npmjs.com/package/react-upload-file)
[![NPM monthly downloads](http://img.shields.io/npm/dm/react-upload-file.svg)](https://npmjs.org/package/react-upload-file)
[![NPM total downloads](https://img.shields.io/npm/dt/react-upload-file.svg)](https://npmjs.org/package/react-upload-file)
[![Dependencies Status](https://david-dm.org/wubocong/react-upload-file/status.svg)](https://david-dm.org/wubocong/react-upload-file)
[![Build Status](https://img.shields.io/travis/wubocong/react-upload-file.svg)](https://travis-ci.org/wubocong/react-upload-file)
[![License](https://img.shields.io/github/license/wubocong/react-upload-file.svg)](https://spdx.org/licenses/MIT)
[![Code Climate](https://codeclimate.com/github/wubocong/react-upload-file/badges/gpa.svg)](https://codeclimate.com/github/wubocong/react-upload-file)
[![Test Coverage](https://codeclimate.com/github/wubocong/react-upload-file/badges/coverage.svg)](https://codeclimate.com/github/wubocong/react-upload-file/coverage)

## Maybe the Best File Upload Component for React

Ready for production usage! Migrate to v2 now since v1 has many bugs and is deprecated.
## Index ##

### Catalog ###
* [Introduce](#introduce)
* [Installation](#installation)
  * [Best Practices](#best-practices)
* [API](#api)
  * [Basic Options](#basic-options)
  * [Life Circle Functions](#life-circle-functions)
  * [Custom Buttons](#custom-buttons)
  * [Component Functions](#component-functions)
* [Examples](#examples)
* [Author](#author)
* [License](#license)


## Introduce ##
A **Structure-Only**, **UI-Customizable** and **Modern** file upload component for React which support IE10+ and basically support IE9, requiring node4+.

## Installation ##
`npm install react-upload-file -S`

### Best Practices ###
+ It's recommened to use arrow function to avoid 'this' problems.
+ Queries in `baseUrl` will be ignored if `query` is set.

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
baseUrl | String | '' | url
query | Object/Function | undefined | Queries that appended after `baseUrl`. When it is a function, use its return value
body | Object/Function | undefined | Key-values that need to add to formData besides files. When it is a function, use its return value
dataType | String | 'json' | Accept type of response(json or text)
timeout | Number | 0 | Timeout of the request. Callback function `uploadError` will be triggered and an object { type: 'TIMEOUTERROR', message: 'timeout' } will be returned as the argument. Default to 0 meaning no limit
accept | String | undefined | Limit the type of file
multiple | Boolean | false | Allow multi-upload or not
numberLimit | Number | 0 | Limit how many files can be uploaded a time, 0 means no limit.
fileFieldName | String/Function | undefined | Determine the field name of file. If it is a function, which will receive each file object as argument, use its return value. Default to file's name
withCredentials | Boolean | false | Same as 'xhr.withCredentials'
requestHeaders | Object | undefined | Key-values that will be set using 'xhr.setRequestHeader(key, value)'
userAgent | String | window.navigator.userAgent | Used to set the userAgent string with serverside rendering isomorphic applications(required when rendering on the server)

### Life Circle Functions ###
Also set as the properties of options.

#### beforeChoose() ####
Triggered immediately after clicking the `chooseFileButton` but before `didChoose`. Return true to continue or false to stop choosing.

@param null

@return {Boolean} Determine whether to continue uploading

#### didChoose(files) ####
The callback triggered after choosing.

@param filelist {Filelist} The array contains files.

@return **your return**

#### beforeUpload(files) ####
Triggered before uploading. Return true to continue or false to stop uploading.

@param files {Filelist} The array contains files.

@return {Boolean} Allow the upload action or not.

#### didUpload(files, xhrId) ####
Triggered after the request is sent(xhr send | form submit).

@param files {Filelist | String} The array contains files.

@param xhrId {Number} Id of this uploading xhr. Could be useful for `abort`.

@return **your return**

#### onAbort(xhrId) ####
Triggered after you aborting a xhr.

@param xhrId {Number} Id of the xhr aborted.

@return **your return**

#### uploading(progress) ####
It will be triggered continuously when the file is uploading in moderns.

@param progress {Progress} Progress instance，useful properties such as loaded and total can be found.

@return **your return**

#### uploadSuccess(res) ####
Callback when upload succeed (according to the ajax simply).

@param res {String} The response is formatted according to options.dataType(json or text).

@return **your return**

#### uploadError ####
Callback when error occurred (according to the ajax simply).

@param err {Object} If this is an error that caught by `try`, it will be an object with `type` and `message`.

@return **your return**

### Custom Buttons ###
You can display two of your custom buttons by setting two attributes of `ReactUploadFile` as mentioned before.

#### chooseFileButton
Component to choose files.

#### uploadFileButton(optional)
Component that triggers uploading. If not specified, files will be uploaded immediately after chosen.

```jsx
<ReactUploadFile options={...} chooseFileButton={<YourChooseButton />} uploadFileButton={<YourUploadButton />} />
```

Will be rendered like this:

```jsx
<YourChooseButton {...} /><YourUploadButton {...} />
```

If you don't set the `uploadFile` attribute, then `ReactUploadFile` will upload the files immediately after you choose files.

```jsx
<ReactUploadFile options={...} chooseFileButton={<YourChooseButton />} />
```

### Component Functions ###
Get component reference via ref. eg:

```jsx
componentDidMount() {
  this.upload.manuallyChooseFile();
}

todo() {
  this.upload.processFile(files => files)
}

render() {
  return (
    <ReactUploadFile ref={(upload) => {this.upload = upload;}} options={...} chooseFileButton={<YourChooseButton />} uploadFileButton={<YourUploadButton />} didChoose={this.todo} />
  );
}
```

#### processFile(func) ####
Process files with customed function.

@param func {Function} Receive filelist as param

@return null

#### manuallyChooseFile() ####
Do the same as clicking `chooseFileButton`. Only support modern browsers.

@param null

@return null

#### manuallyUploadFile(files) ####
Upload files manually, use this function. BeforeUpload() won't be triggered after the invoke of this function.

@param files {Filelist} filelist that need to be uploaded, default to the filelist of chosen files.

@return null

#### abort(xhrId) ####
Abort a xhr. Temporarily only works in modern browsers.

@param xhrId {Number} If not passing an id, will abort the newest one. You can get it in `didUpload()`.

## Examples ##
Simple example:

```jsx
import ReactUploadFile from 'react-upload-file';
...
render() {
  /* set properties */
  const options = {
    baseUrl: 'http://127.0.0.1',
    query: {
      warrior: 'fight'
    }
  }
  /* Use ReactUploadFile with options */
  /* Custom your buttons */
  return (
    <ReactUploadFile options={options} chooseFileButton={<YourChooseButton />} uploadFileButton={<YourUploadButton />} />
  );
}
```

Most of the options may be set like:

```jsx
options: {
  baseUrl: 'http://localhost:8080/upload',
  // query: {
  //   category: '1',
  //   _: Date().getTime()
  // },
  query: (files)=>{
    const l = files.length;
    const queryObj = {};
    for(let i = l-1; i >= 0; --i) {
      queryObj[i] = files[i].name;
    }
    return queryObj;
  }
  // body: {
  //   purpose: 'save'
  // },
  body: (files)=>{
    const l = files.length;
    const queryObj = {};
    for(let i = l-1; i >= 0; --i) {
      queryObj[i] = files[i].name;
    }
    return queryObj;
  },
  dataType: 'json',
  multiple: true,
  numberLimit: 9,
  accept: 'image/*',
  // fileFieldName: 'file',
  fileFieldName: (file) {
    return file.name;
  },
  withCredentials: false,
  requestHeaders: {
    'User-Agent': 'Warrior!'
  },
  beforeChoose: () => {
    return user.isAllowUpload;
  },
  didChoose: (files) => {
    console.log('you choose', typeof files == 'string' ? files : files[0].name);
  },
  beforeUpload: (files) => {
    if (typeof files === 'string') return true;
    if (files[0].size < 1024 * 1024 * 20) {
      files[0].mill = mill;
      return true;
    }
    return false;
  },
  didUpload: (files) => {
    console.log('you just uploaded', typeof files === 'string' ? files : files[0].name);
  },
  uploading: (progress) => {
    console.log('loading...', progress.loaded / progress.total + '%');
  },
  uploadSuccess: (resp) => {
    console.log('upload success!');
  },
  uploadError: (err) => {
    alert(err.message);
  }
}

if (typeof window === 'undefined') {
  options.userAgent = this.props.userAgent;
}

```

## Author ##
Warrior! from HCI@SCAU

## License ##
MIT

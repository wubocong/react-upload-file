# ReactUploadFile #

![npm version](https://badge.fury.io/js/react-upload-file.svg)

## Index ##


### Catalog ###
* [Introduce](#introduce)
* [Download](#download)
* [API](#api-en)
  * [options](#options) 
  * [Life Circle Functions](#life-circle-functions)
  * [Special Properties](#special-properties)
  * [Component Functions](#component-functions)
  * [Children](#children)
* [Examples](#examples)
* [Development](#development)
* [Contributor](#contributor)
* [Change-log](#change-log)
* [License](#license)


## Introduce ##
1. A React component of async file uploading, using File API+FormData in modern browser, and form+iframe in IE9-. If want to use in IE8, use es5-shim or so.
2. With help of ES6, so babel is required.
3. When in IE9-, an invisible `<input>` will be put over the chooseBtn so that it can catch the click event. It is simpler in moderns because the event will be caught by the wrapper.
5. Life circle functions.
6. No preset styles. Just use your favorite. 

### Get started ###
```
const ReactUploadFile = require('react-upload-file');
...
render(){
	/*set properties*/
	const options={
		baseUrl:'http://127.0.0.1',
		param:{
			fid:0
		}
	}
	/*Use ReactUploadFile with options*/
	/*Set two dom with ref*/
	return (
		<ReactUploadFile options={options}>
			<button ref="chooseBtn">choose</button>
			<button ref="uploadBtn">upload</button>
		</ReactUploadFile>
	)	        
}
```

## Download ##
`npm install react-upload-file --save`

## API-EN ##

### options ###
```
options:{
    baseUrl:'xxx',
    ...
}
```
`options` is an attribute of `<ReactUploadFile />`. The properties of `options` are: 

name | type | default | note
------------ | ------------- | ------------ | ------------
baseUrl | string | ``''`` | url
param | object | ``{}`` | params that appended after baseUrl.
dataType | `'json'/'text'`  | ``'json'`` | type of response.
chooseAndUpload | boolean | ``false`` | whether the upload action will be triggered just after the user choose a file. If true, an DOM with the `ref='chooseAndUpload'` should be use as a child. default to false.
paramAddToFile(deprecated) | array[string] | ``[]`` | an array that including names of params that need to append to the file instance(File ApI instance). default to [].
wrapperDisplay | string | ``'inline-block'`` | the display of the wrappers of chooseBtn or uploadBtn. default to 'inline-block'.
timeout | number | ``0`` | Timeout of the request, not support IE9- right now, when is timeout the `uploadError` will be triggered, and an object `{type:'TIMEOUTERROR',message:'timeout'}` will be return as the argument. default to 0 as no limit.
paramAddToField | object/func | ``undefined`` | Key-value that need to add to  formData. When it is a function, use the return.
accept | string | ``''`` | Limit the type (extension) of file.
multiple | boolean | ``false`` | Allow multi-upload or not. Not supporting IE9-.
numberLimit | number/func | false | Limit how much file that user can choose in multi-upload case.User can still choose but ReactUploadFile will filter.
fileFieldName | string/func | false | When a file is added to formData, defaulting file name as key. When is a string, use it. And When is a func, use return value. Func will receive the File object as argument.
withCredentials | boolean | false | Same as `xhr.withCredentials`.
requestHeaders | object | false | Key-values that will be set using  `xhr.setRequestHeader(key, value)`.
userAgent | string | undefined | Used to set the User Agent String when serverside rendering isomorphic applications. (required when rendering on the server)

### Life circle functions ###
Also set as the properties of options.

#### beforeChoose() ####
Triggered after clicking the `chooseBtn` and before choosing file. return true to continue or false to stop choosing.

@param  null

@return  {boolean} allow the choose or not

#### chooseFile(files) ####
The callback triggered after choosing.

@param files {array[File] | string} In moderns it will be the array contains the File instance(the way that File API returns). In IE9- it will be the full name of file.

@return

#### beforeUpload(files,mill) ####
Triggered before uploading. return true to continue or false to stop uploading.

@param files {array[File] | string} In moderns it will be the array contains the File instance(the way that File API returns). In IE9- it will be the full name of file.

@param mill {long} The time of the upload action (millisecond). If the File instance has the `mill` property it will be the same as it.

@return  {boolean} Allow the upload action or not.

#### doUpload(files,mill,xhrID) ####
Triggered after the request is sent(xhr send | form submit).

@param files {array[File] | string} In moderns it will be the array contains the File instance(the way that File API returns). In IE9- it will be the full name of file.

@param mill {long} The time of the upload action (millisecond). If the File instance has the `mill` property it will be the same as it.

@param xhrID {int} ID of this uploading xhr. Could be useful for `abort`.

@return

#### onabort(mill,id) ####
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

### Special properties ###
Also can be set as property of `options`, but is not in common use.

#### textBeforeFiles ####
{boolean}

make this true to add text fields before file data.

#### tag ####
{string}

Multi form groups are required in IE. If there are multi-use of `<ReactUploadFile>` in one page, use tag to distinguish them.

#### _withoutReactUploadFile ####
{boolean}

Send AJAX without the file(without the FormData).

#### disabledIEChoose ####
{boolean | func}
In IE, the upload button is actually covered by an invisible `<input />` , and the `disabled` attribute for button will not work. So set this property as `true` (function return true) to disabled choose behavior.

#### filesToUpload(deprecated) ####
Use filesToUpload(files) of component functions instead.

{array[File]}

IF there is file(File instance) that need to be uploaded immediately, it can be pushed in this array, and should be cleared in `beforeUpload` or `doUpload`. Not supporting IE. This file will be detected in `componentWillReceiveProps` and uploaded.


### children ###

You can just set two btns.
```
<ReactUploadFile options={options}>
	<button ref="chooseBtn">choose</button>
	<button ref="uploadBtn">upload<button>
</ReactUploadFile>
```

Or if you set the `chooseAndUpload` to true, you need to set only one with `ref="chooseAndUpload"`.
```
<ReactUploadFile options={options}>
    <button ref="chooseAndUpload">chooseAndUpload</button>
</ReactUploadFile>
```

Other DOMs can also be set as children.
```
<ReactUploadFile options={options}>
    <h3>Please choose</h3>
    <div ref="chooseBtn">
        <i className="icon icon-upload" />
        <span>do it</span>
    </div>
    <p>You have uploaded {this.state.rate}</p>
    <button ref="uploadBtn">upload<button>
    <p>Thanks for using</p>
</ReactUploadFile>
```


### Component functions ###
Use via refs. eg:

```
componentDidUpdate(){
    this.refs['File-Upload'].filesToUpload([this.state.file]);
}

render(){
    return(){
        <ReactUploadFile ref="File-Upload" options={...}>
        </ReactUploadFile>
    }
}
```

#### filesToUpload ####
IF there is file(File instance) that need to be uploaded immediately,use this function. BeforeUpload() will be triggered after this function

@param files {array[file]} files array that need to be uploaded

@return null

#### forwardChoose ####
Do the same as clicking `chooseBtn` . Only support modern browsers.

@param null

@return null

#### abort ####
Abort a xhr. Temporarily only works in modern browsers.

@param xhrID {int} If not passing an ID, will abort the newest one. You can get the ID of a xhr in `doUpload()`. 

## examples ##

If you have better and clearer demos, plz tell me! Online or offline.

simple example:

```
const ReactUploadFile = require('react-upload-file');
...
render(){
	/*set properties*/
	const options={
		baseUrl:'http://127.0.0.1',
		param:{
			fid:0
		}
	}
	/*Use ReactUploadFile with options*/
	/*Set two dom with ref*/
	return (
		<ReactUploadFile options={options}>
			<button ref="chooseBtn">choose</button>
			<button ref="uploadBtn">upload</button>
		</ReactUploadFile>
	)	        
}
```

Most of the options may be set like:

```
options:{
    baseUrl : './upload',
    param : {
        category: '1',
        _: Date().getTime()
    },
    dataType : 'json',
    wrapperDisplay : 'inline-block',
    multiple: true,
    numberLimit: 9,
    accept: 'image/*',
    chooseAndUpload : false,
    paramAddToField : {purpose: 'save'},
    //fileFieldName : 'file',
    fileFieldName(file){ return file.name },
    withCredentials: false,
	  requestHeaders: {'User-Agent': 'So Aanyip'},
    beforeChoose : function()[
        return user.isAllowUpload
    },
    chooseFile : function(files){
        console.log('you choose',typeof files == 'string' ? files : files[0].name)
    },
    beforeUpload : function(files,mill){
        if(typeof files == string) return true
        if(files[0].size<1024*1024*20){
            files[0].mill = mill
            return true
        }
        return false
    },
    doUpload : function(files,mill){
        console.log('you just uploaded',typeof files == 'string' ? files : files[0].name)
    },
    uploading : function(progress){
        console.log('loading...',progress.loaded/progress.total+'%')
    },
    uploadSuccess : function(resp){
        console.log('upload success..!')
    },
    uploadError : function(err){
        alert(err.message)
    },
    uploadFail : function(resp){
        alert(resp)
    }
}

if (typeof window === 'undefined') {
  options.userAgent = this.props.userAgentString;
}

```

An working example:

```
this.uploadOptions = {
  baseUrl: '/node/api',
  param: {
    _c: 'file',
    _a: 'UploadFile'
  },
  multiple: true,
  numberLimit: this._getLimitNumber,
  accept: 'image/*',
  fileFieldName(file) {
    return file.rawID
  },
  chooseAndUpload: true,
  wrapperDisplay: 'block',
  beforeUpload: this._checkUploadImg,
  uploading: this._handleUploading,
  /*xhr success*/
  uploadSuccess: this._handleUploadSuccess,
  /*xhr fail*/
  uploadFail: this._handleUploadFailed,
  uploadError: this._handleUploadFailed
}

/*Litmit how much files could be uploaded*/
@autobind
_getLimitNumber() {
  const IMAGE_LIMIT = this.props.imageLimit  //e.g. 9
  const stateRawID = this.props.formState.rawIDs,
    rawIDs = stateRawID && stateRawID.value ? JSON.parse(stateRawID.value) : []  //How much imgs chosed.

  return rawIDs.length >= IMAGE_LIMIT ? 0 : IMAGE_LIMIT - rawIDs.length
}

/*determine whether the files could be sent or not*/
@autobind
_checkUploadImg(files, mill) {
  const { formState } = this.props,
    formRawIDs = formState.rawIDs && formState.rawIDs.value ? JSON.parse(formState.rawIDs.value) : [],
    attachment = {},
    errorMsg = {
      size:{
        desc: 'Size lagger than 20Mb is not supported',
        names: []
      },
      ext:{
        desc: 'Not supported extention',
        names: []
      }
    }
  let canUpload = true

  Object.keys(files).forEach(key => {
    /*Some browsers may find 'length' as key.*/
    if(key === 'length') return
    const file = files[key],
      dataUrl = window.URL.createObjectURL(file),
      /*rawID: The way I use like md5*/
      rawID = this._addRawID(file),
      { name, size, lastModified } = file

    /*size > 20Mb or not*/
    if( size > (20 * 1024 * 1024) ) return errorMsg.size.names.push(name)
    /*Check extention*/
    if(!isImg(name)) return errorMsg.ext.names.push(name)

    /*Whether img already in FormData*/
    formRawIDs.includes(rawID) ?
      message.info(`You had already chosed ${name}`,2500) :
      attachment[rawID] = {
        name,
        size,
        lastModified,
        rawID,
        dataUrl,
        mill
      }
  })

  const rawIDs = Object.keys(attachment)

  !rawIDs.length && ( canUpload = false )

  const msgStr = this._packErrorMessage(errorMsg)
  msgStr.length && message.error(msgStr)

  !Object.keys(attachment).length && (canUpload = false)

  /*Do xhr or not*/
  return canUpload
}

/*Progress*/
@autobind
_handleUploading(progress, mill) {
  this.props.dispatch(
    this.props.uploadProgress( {progress,mill} )
  )
}


@autobind
_handleUploadSuccess(respArr) {
 //depends on your response
}

@autobind
_handleUploadFailed(err) {
  typeof err !== 'string' && (err = err.msg)
  if(err == 'undefined' || err == undefined) err = 'Unknown error'
  message.error(`Upload failed，${err}`)
}

render() {
  return (
    <ReactUploadFile options={this.uploadOptions} ref="fileUpload">
      <div styleName={dashedBoxStyle} ref="chooseAndUpload">
        {plusIcon}
      </div>
    </ReactUploadFile>
  )
}
```

## License ##
MIT	

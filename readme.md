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
1. A React component of async file uploading in ES6, do not support IE!
2. Life circle functions.
3. Smooth experience. 

### Get started ###
```
import ReactUploadFile from 'react-upload-file';
...
render(){
	/*set properties*/
	const options={
		baseUrl:'http://127.0.0.1',
		param:{
			warrior: 'fight'
		}
	}
	/* Use ReactUploadFile with options */
	/* Custom your buttons */
	return (
    <ReactUploadFile options={options} chooseFile=(<button />) uploadFile=(<button />) />
	)	        
}
```

## Download ##
`npm install react-upload-file -S`

## API ##

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

#### didUpload(files,mill,xhrID) ####
Triggered after the request is sent(xhr send | form submit).

@param files {array[File] | string} In moderns it will be the array contains the File instance(the way that File API returns). In IE9- it will be the full name of file.

@param mill {long} The time of the upload action (millisecond). If the File instance has the `mill` property it will be the same as it.

@param xhrID {int} ID of this uploading xhr. Could be useful for `abort`.

@return

#### onAbort(mill,id) ####
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

#### withoutFileUpload(deprecated) ####
{boolean}

Send AJAX without the file(without the FormData).

### children ###

You can display two buttons anywhere, the ReactUploadFile component will not actually be displayed!
```
<ReactUploadFile options={options} chooseFile=(<button />) uploadFile=(<button />) />
```

Or if you set the `chooseAndUpload` to true, you need to set only one with `ref="chooseAndUpload"`.
```
<ReactUploadFile options={options} chooseFile=(<button />) uploadFile=(<button />) />
```

Your can customize your buttons as mentioned above.

### Component functions ###
Use via ref. eg:

```
componentDidUpdate(){
    this.upload.filesToUpload([this.state.file]);
}

render(){
    return (
        <ReactUploadFile ref={(upload)=>{this.upload=upload}} options={...} chooseFile=(<button />) uploadFile=(<button />) />
    );
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
render() {
	/*set properties*/
	const options={
		baseUrl:'http://127.0.0.1',
		param:{
			warrior: 'fight'
		}
	}
	/* Use ReactUploadFile with options */
	/* Custom your buttons */
	return (
    <ReactUploadFile options={options} chooseFile=(<button />) uploadFile=(<button />) />
	);
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

## License ##
MIT	

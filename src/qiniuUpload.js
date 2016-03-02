/*@inclide(assets/CryptoJS.js)*/
; (function (window) {
  var qiniuUpload = window.qiniuUpload = {};
  /*@include(upTokenBuilder.js)*/
 
  //上传
  var Qiniu_UploadUrl = 'http://up.qiniu.com';
  var upload = function (file, upToken, callback, key) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', Qiniu_UploadUrl, true);
    var formData = new FormData();
    if (key !== null && key !== undefined) {
      formData.append('key', key);
    }
    formData.append('token', upToken);
    formData.append('file', file);
    //处理上传进度
    xhr.upload.addEventListener("progress", function (evt) {
      if (evt.lengthComputable) {
        console.log(evt.loaded);
      }
    }, false);

    xhr.onreadystatechange = function (response) {
      if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
        var blkRet = JSON.parse(xhr.responseText);
        callback && callback(null, blkRet);
      } else if (xhr.status != 200 && xhr.responseText) {
        callback('err: ' + xhr.responseText);
      }
    };
    xhr.send(formData);
  };
  var registerButton2UE = function (editor, index, upToken) {
    UE.registerUI('qiniuupload', function (editor, uiName) {
      //注册按钮执行时的command命令，使用命令默认就会带有回退操作
      editor.registerCommand(uiName, {
        execCommand: function () {
          var fileEl = document.createElement('input');
          fileEl.setAttribute('type', 'file');
          fileEl.setAttribute('accept', 'image/*')
          fileEl.click();
          fileEl.onchange = function (e) {
            var file = e.target.files[0];
            var loadingId = 'loading_' + (+new Date()).toString(36);
            editor.execCommand('inserthtml', '<img class="loadingclass" id="' + loadingId + '" src="' + editor.options.themePath + editor.options.theme + '/images/spacer.gif" title="' + (editor.getLang('simpleupload.loading') || '') + '" >');
            upload(file, upToken, function (err, data) {
              if (err) {
                return alert(err);
              }
              var imgEl = editor.document.getElementById(loadingId);
              imgEl.setAttribute('src', 'http://7xit2j.com1.z0.glb.clouddn.com/' + data.key);
              imgEl.setAttribute('class', '');
            });
            console.log(file)
          };
        }
      });

      //创建一个button
      var btn = new UE.ui.Button({
        //按钮的名字
        name: uiName,
        //提示
        title: '上传图片到七牛', //uiName,
        className: 'edui-for-simpleupload',
        //点击时执行的命令
        onclick: function () {
          //这里可以不用执行命令,做你自己的操作也可
          editor.execCommand(uiName);
        }
      });

      //因为你是添加button,所以需要返回这个button
      return btn;
    }, index, editor.uid/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);
  }
  var upToken;
  qiniuUpload.init = function (editer, index, options) {
    var upToken = qiniuUpload.genUpToken(options.accessKey, options.secretKey, options.putPolicy);
    registerButton2UE(editer, index, upToken);
  };
})(window);
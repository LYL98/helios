import { Config, Http } from '@/util';

export default {
    //获取七牛token
    qiniuUploadToken(data){
        return Http.get(Config.api.qiniuUploadToken, data);
    },
    //七牛上传base64图片
    qiniuUpBase64(data, callback){
        var url = Config.qiniuUpPath + "/putb64/20264";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if (xhr.readyState==4){
                typeof callback === 'function' && callback('ok', xhr.responseText);
            }else{
                typeof callback === 'function' && callback('fail', xhr.responseText);
            }
        }
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/octet-stream");
        xhr.setRequestHeader("Authorization", data.up_token);
        xhr.send(data.img_base64);
    },
    //上传文件到qiniu
    uploadToQiniu(data, callback){
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        formData.append('token',data.token);
        formData.append('key',data.key);
        formData.append("domain",Config.qiniuUpPath);
        formData.append('file', data.file);
        xhr.onreadystatechange = function (e) {
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    typeof callback=='function' && callback(xhr.responseText);
                }else {
                    typeof callback=='function' && callback({
                        code: 500,
                        message: '上传失败，请重试'
                    });
                }
            }
        };
        xhr.open('POST', Config.qiniuUpPath, false);
        xhr.send(formData);
    },

    //获取腾讯PresignedUrl
    tencentPresignedUrl(data){
        return Http.get(Config.api.tencentPresignedUrl, data);
    },
    //上传文件到tencent  data里要有，presigned_url，file
    uploadToTencent(data){
        return Http.put(data.presigned_url, data);
    },
};

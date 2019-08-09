import Vue from 'vue';
import Config from './config';

//处理发送前事件
function beforesendHandling(url, data) {
    if (Config.isPrintRequestLog) console.log("【上送url】：\n", url, "\n【上送的数据】：\n", data);
}

//处理完成事件
function completeHandling(data) {
    if (Config.isPrintRequestLog) console.log("【返回的数据】：\n", data);
    if (Number(data.code) == 200) logout(); //登出
    return data;
}

//处理错误事件
function errHandling(err) {
    if (Config.isPrintRequestLog) console.log("【错误信息】：\n", err);
    return {
        code: 520,
        message: '请求出错啦，请检查网络或联系管理员'
    };
}

//登出事件
function logout() {
    Config.accreditLogin();//重新授权登录
}

/**
 * get请求
 * @param api
 * @param data
 * @returns {Promise.<Response>}
 */
function get(api, data) {
    let url = api + '?time=' + new Date().getTime();

    for (let item in data) {
        url = url + "&" + item + "=" + encodeURIComponent(data[item]);
    }

    beforesendHandling(url, data);//处理发送前事件

    return Vue.http({
        method: "GET",
        credentials: 'include',
        url: url
    })
        .then(response => {
            return completeHandling(response.data);//处理返回事件
        },
            error => {
                return errHandling(error);
            }
        );
}

/**
 * post请求
 * @param url
 * @param data
 * @returns {Promise.<Response>}
 */
function post(api, data) {
    let url = api + '?time=' + new Date().getTime();

    beforesendHandling(url, data);//处理发送前事件

    let options = {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Accept': 'application/json;charset=utf-8',
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data),
        url: url
    };
    return Vue.http(options)
        .then(response => {
            return completeHandling(response.data);//处理返回事件
        },
            error => {
                return errHandling(error);
            }
        );

}

/**
 * put请求(腾讯云专用上传)
 * @param url
 * @param data
 * @returns {Promise.<Response>}
 */
function put(api, data) {
    beforesendHandling(api, data);//处理发送前事件
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) {
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    resolve({
                        code: 0,
                        data: data
                    });
                }else {
                    reject({
                        code: 500,
                        message: '上传失败，请重试'
                    });
                }
            }
        };
        xhr.open('PUT', api, false);
        xhr.send(data.file);
    });
}

/**
 * get请求url拼参数
 * @param url
 * @param data
 * @returns {Promise.<Response>}
 */
function getUrlData(api, data) {
    let url = api;

    for (let item in data) {
        url = url + "/" + data[item];
    }

    url = url + '?time=' + new Date().getTime();

    beforesendHandling(url, data);//处理发送前事件

    let options = {
        method: 'GET',
        credentials: 'include',
        url: url
    };
    return Vue.http(options)
        .then(response => {
            return completeHandling(response.data);//处理返回事件
        },
            error => {
                return errHandling(error);
            }
        );

}

export default { get, post, put, getUrlData };

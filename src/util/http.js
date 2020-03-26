import Vue from 'vue';
import { MessageBox } from 'element-ui';
import Config from './config';
let logoutNum = 0;

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
    if(logoutNum > 0) return;
    MessageBox.alert('登录已失效，请重新登录', '提示', {
        type: 'error',
        confirmButtonText: '我知道了'
    }).then(()=>{
        logoutNum = 0;
        window.location.replace('/#/');
    }).catch(()=>{
        logoutNum = 0;
        window.location.replace('/#/');
    });
    logoutNum++;
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
        let d = data[item];
        if(d === null || typeof d === 'undefined') d = '';
        url = url + "&" + item + "=" + encodeURIComponent(d);
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
let CATCHE_POSTED_LIST = []; // 缓存 post api 请求 的列表 { api: string, latest_timestamp: number  }
function post(api, data, config) {

    let throttle = true;
    if (config && typeof config.throttle === 'boolean') {
      throttle = config.throttle;
    }

    if (throttle) {
      let posted = CATCHE_POSTED_LIST.find(item => item.api === api);

      if (posted) {

        if (posted.latest_timestamp + (2 * 1000) > new Date().getTime()) {
          console.warn('点击频率过于频繁！', posted);
          return Promise.resolve({ code: 520, message: '点击频率过于频繁！需要注意哦 ~ ' });
        }

        posted.latest_timestamp = new Date().getTime();
      } else {
        posted = {api: api, latest_timestamp: new Date().getTime()}
        CATCHE_POSTED_LIST.push(posted);
      }
    }

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

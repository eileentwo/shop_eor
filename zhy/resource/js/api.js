/**
 * api.post = function(action, param, cachetime = 0, fromcache = true) {
    return this.myRequest(action, 'POST', param, cachetime, fromcache);
  }
 * method： api.post
 * action: 请求地址
 * param： 请求参数
 * cachetime: 缓存时间（默认0秒）
 * fromcache： 是否从本地缓存取值
 */


/*
* 使用例子
app.api.getSetting().then((res) => {
  console.log(res);
}).catch((res) => {
  if (res.code == -1) {
    app.tips(res);
  } else { // 执行失败回调操作
    app.tips(res);
  }
})
*/
var util = require('./kxutil.js');
var md5 = require('../../../we7/js/md5.js');

var base = {};
// promise 列表，控制同一时间只有一个相同的请求
base.promiseAist = {};
base.getPromise = function (fun, action, param) {
  let that = this;

  let key = md5(action + JSON.stringify(param));
  if (that.promiseAist[key]) {
    return that.promiseAist[key];
  }
  let p = new Promise(fun);

  that.promiseAist[key] = p.then(res => {
    delete that.promiseAist[key];
    return Promise.resolve(res);
  }).catch(res => {
    delete that.promiseAist[key];
    return Promise.reject(res);
  });
  return that.promiseAist[key];
}
base.myRequest = function (action, method, data, cachetime, fromcache) {
  var that = this;
  if (!data) {
    data = {};
  }
  return that.getPromise(function (resolve, reject) {
    util.request({
      url: action,
      data: data,
      method: method,
      fromcache: fromcache,
      cachetime: cachetime,
      showLoading: false,
      success: function (res) {
        if (res.statusCode == 200) {
          if (!res.data.code) {
            let json = {
              data: res.data.data
            }
            if (res.data.other) json.other = res.data.other;
            if (res.data.msg) json.msg = res.data.msg;
            resolve(json);
          }
          reject(res.data);
        } else {
          let json = {
            code: -1,
            msg: '服务器开小差了，请稍后重试！'
            // msg: '状态：(' + action + ')' + res.statusCode
          }
          reject(json);
        }
      },
      fail: function (res) {
        if (res.errMsg === 'request:fail ') {
          let json = {
            code: -1,
            msg: '网络环境差，请稍后重试！'
          }
          reject(json);
        }
        reject(res.data);
      }
    })
  }, action, data);
}
/**
 * method： api.get
 * action: 请求地址
 * param： 请求参数
 * cachetime: 缓存时间（默认0秒）
 * fromcache： 是否从本地缓存取值
 */
base.get = function (action, param, cachetime = 0, fromcache = true) {
  return this.myRequest(action, 'GET', param, cachetime, fromcache);
}
/**
 * method： api.post
 * action: 请求地址
 * param： 请求参数
 * cachetime: 缓存时间（默认0秒）
 * fromcache： 是否从本地缓存取值
 */
base.post = function (action, param, cachetime = 0, fromcache = true) {
  return this.myRequest(action, 'POST', param, cachetime, fromcache);
}

/**
 * method: apiCommonGetNowTime (获取当前时间)
 */
base.apiCommonGetNowTime = function (param) {
  return this.post('Api_common|getNowTime', param, 0, false);
}

/**
 * method: isMoney (变成金钱)
 */

base.isMoney = function (money) {
  let app = getApp();
  let m = (money.trim() - 0).toFixed(2);
  if (isNaN(m)) {
    app.tips('请输入正确的金额！');
    return '';
  } else {
    if (m <= 0) {
      return '';
    } else {
      return m;
    }
  }
}

let l = require('../../api/l');
let s = require('../../api/s');
let plugl = require('../../api/plugl');
let plugs = require('../../api/plugs');
let api = {
  ...base,
  ...l,
  ...s,
  ...plugl,
  ...plugs
};
module.exports = api;
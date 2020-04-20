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
var api = {};


module.exports = api;
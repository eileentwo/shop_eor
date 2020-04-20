var util = require('./util.js');

/*
* 获取链接某个参数
* url 链接地址
* name 参数名称
*/
function getUrlParam(url, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象  
  var r = url.split('?')[1].match(reg);  //匹配目标参数  
  if (r != null) return unescape(r[2]); return null; //返回参数值  
}
/**
 * 获取签名 将链接地址的所有参数按字母排序后拼接加上token进行md5
 * url 链接地址
 * date 参数{参数名1 : 值1, 参数名2 : 值2} *
 * token 签名token 非必须
 */
function getSign(url, data, token) {
  var _ = require('../../../we7/js/underscore.js');
  var md5 = require('../../../we7/js/md5.js');
  var querystring = '';
  var sign = getUrlParam(url, 'sign');
  if (sign || (data && data.sign)) {
    return false;
  } else {
    if (url) {
      querystring = getQuery(url);
    }
    if (data) {
      var theRequest = [];
      for (let param in data) {
        if (param && data[param]) {
          theRequest = theRequest.concat({
            'name': param,
            'value': data[param]
          })
        }
      }
      querystring = querystring.concat(theRequest);
    }
    //排序
    querystring = _.sortBy(querystring, 'name');
    //去重
    querystring = _.uniq(querystring, true, 'name');
    var urlData = '';
    for (let i = 0; i < querystring.length; i++) {
      if (querystring[i] && querystring[i].name && querystring[i].value) {
        urlData += querystring[i].name + '=' + querystring[i].value;
        if (i < (querystring.length - 1)) {
          urlData += '&';
        }
      }
    }
    token = token ? token : getApp().siteInfo.token;
    sign = md5(urlData + token);
    return sign;
  }
}
function getQuery(url) {
  var theRequest = [];
  if (url.indexOf("?") != -1) {
    var str = url.split('?')[1];
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      if (strs[i].split("=")[0] && unescape(strs[i].split("=")[1])) {
        theRequest[i] = {
          'name': strs[i].split("=")[0],
          'value': unescape(strs[i].split("=")[1])
        }
      }
    }
  }
  return theRequest;
}

/**
	二次封装微信wx.request函数、增加交互体全、配置缓存、以及配合微擎格式化返回数据

	@params option 弹出参数表，
	{
		url : 同微信,
		data : 同微信,
		header : 同微信,
		method : 同微信,
		success : 同微信,
		fail : 同微信,
		complete : 同微信,

		cachetime : 缓存周期，在此周期内不重复请求http，默认缓存 0 秒
    fromcache : 从缓存获取数据，默认 true
	}
*/
util.request = function (option) {
  var _ = require('../../../we7/js/underscore.js');
  var md5 = require('../../../we7/js/md5.js');
  var app = getApp();
  var option = option ? option : {};
  option.cachetime = option.cachetime ? option.cachetime : 0;
  option.showLoading = typeof option.showLoading != 'undefined' ? option.showLoading : true;
  option.fromcache = option.fromcache == undefined ? true : option.fromcache;
  //去掉没用的参数 null/undefine
  for(var key in option.data){
    if(typeof option.data[key] == 'undefined'){
      delete option.data[key];
    }
  }
  var url = option.url;
  if (url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
    url = util.url(url);
  }
  // console.log('url',url)
  var sign = getSign(url, option.data);
  if (sign) {
    url = url + "sign=" + sign;
  }
  if (!url) {
    return false;
  }
  wx.showNavigationBarLoading();
  if (option.showLoading) {
    util.showLoading();
  }
  var cachekey = md5(url);
  if (option.fromcache && option.cachetime) {
    var cachedata = wx.getStorageSync(cachekey);
    var timestamp = Date.parse(new Date());

    if (cachedata && cachedata.data) {
      if (cachedata.expire > timestamp) {
        if (option.complete && typeof option.complete == 'function') {
          option.complete(cachedata);
        }
        if (option.success && typeof option.success == 'function') {
          option.success(cachedata);
        }
        // console.log('cache:' + url);
        wx.hideLoading();
        wx.hideNavigationBarLoading();
        return true;
      } else {
        wx.removeStorageSync(cachekey)
      }
    }
  }
  if(option.method == 'post'){
    for(var i in option.data){
      if (typeof option.data[i] != 'string'){
        option.data[i] = JSON.stringify(option.data[i]);
      }
    }
  }
  console.log('url',url)
  wx.request({
    'url': url,
    'data': option.data ? option.data : {},
    'header': option.header ? option.header : {},
    'method': option.method ? option.method : 'POST',
    'header': {
      'content-type': 'application/x-www-form-urlencoded'
    },
    'success': function (response) {
      wx.hideNavigationBarLoading();
      wx.hideLoading();
      if (response.data && response.data.errno) {
        if (response.data.errno == '41009') {
          wx.setStorageSync('userInfo', '');
          util.getUserInfo(function () {
            util.request(option)
          });
          return;
        } else {
          if (option.fail && typeof option.fail == 'function') {
            option.fail(response);
          } else {
            if (response.data.message) {
              if (response.data.data != null && response.data.data.redirect) {
                var redirect = response.data.data.redirect;
              } else {
                var redirect = '';
              }
              app.util.message(response.data.message, redirect, 'error');
            }
          }
          return;
        }
      } else {
        if (option.success && typeof option.success == 'function') {
          option.success(response);
        }
        //写入缓存，减少HTTP请求，并且如果网络异常可以读取缓存数据
        if (option.cachetime) {
          var cachedata = { 'data': response.data, 'expire': timestamp + option.cachetime * 1000 };
          wx.setStorageSync(cachekey, cachedata);
        }
      }
    },
    'fail': function (response) {
      wx.hideNavigationBarLoading();
      wx.hideLoading();

      //如果请求失败，尝试从缓存中读取数据
      var md5 = require('../../../we7/js/md5.js');
      var cachekey = md5(url);
      var cachedata = wx.getStorageSync(cachekey);
      if (cachedata && cachedata.data) {
        if (option.success && typeof option.success == 'function') {
          option.success(cachedata);
        }
        console.log('failreadcache:' + url);
        return true;
      } else {
        if (option.fail && typeof option.fail == 'function') {
          option.fail(response);
        }
      }
    },
    'complete': function (response) {
      // wx.hideNavigationBarLoading();
      // wx.hideLoading();
      if (option.complete && typeof option.complete == 'function') {
        option.complete(response);
      }
    }
  });
}
module.exports = util;
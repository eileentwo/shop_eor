// apiWxSetUnionID(保存UnionID)
var qitui = wx.getStorageSync('qitui');
if (qitui){
  var config = {
    "appkey": qitui.qt_appkey,//填写从奇推后台获取的appkey
    "is_reportingEvent": false,// 是否上报事件，默认不上报事件
    "is_openPlugins": qitui.qt_isopen==1?true:false,// 是否启用小程序插件，默认不开启
  }
}else{
  var config = {
    "appkey": "",//填写从奇推后台获取的appkey
    "is_reportingEvent": false,// 是否上报事件，默认不上报事件
    "is_openPlugins": false,// 是否启用小程序插件，默认不开启
  }
}
var Version = "1.0.0";
// var onlineURL = "https://qt.fzh.fu
// var apiURL = "https://qt.fzh.fun/api";
var onlineURL = "https://www.7tui.net";
var apiURL = "https://www.7tui.net/api";

var Gdata = {
  v: Version,
  data:"",
  uinfo:"",
  u_code:"",
  lat:"",
  lng: "",
}

function gocheckversion() {
  wx.request({
    url: onlineURL + "/qtapp.json",
    method: "GET",
    success: function (t) {
      if (t.statusCode === 200) {
        if (t.data["v"] != Version) {
          console.warn("奇推sdk已更新,请去官网(https://www.7tui.net/)下载最新版本")
        }
      }
    }
  })
}

function oddPushFormSubmit(t) {
  //console.log("奇推22");
  var tt = this;
  var data = {
    "x":t.detail.target.offsetLeft,
    "y":t.detail.target.offsetTop,
    "fid":t.detail.formId,
  };
  oddpush_data(tt, "frompage", "pushfrom", data);
}

function HookTo(t, e, c) {
  if (t[e]) {
    var a = t[e];
    t[e] = function (t) {
      c.call(this, t, e);
      return a.call.apply(a, [this].concat(Array.prototype.slice.call(arguments)))
    }
  } else {
    t[e] = function (t) {
      c.call(this, t, e)
    }
  }
}

var goto_login = function (t, e) {
  wx.login({
    success: function (t) {
      if (t.code) {
        //console.log('码')
        //console.log(t.code)
        Gdata.u_code = t.code;
        wx.getUserInfo({
          success: function (r) {
            //console.log('用户信息')
            //console.log(r)
            e(r)
          }
        })
      } else {
        Gdata.u_code = 0
      }
    }
  })
};

var goto_openid = function (t, e) {
  var u_openid = wx.getStorageSync("u_openid");
  var u_openid_start_time = wx.getStorageSync("u_openid_start_time");
  if (u_openid_start_time && u_openid) {
    var nt = new Date().getTime();
    if (u_openid_start_time && u_openid) {
      if (nt > (u_openid_start_time + 24 * 3660 * 5)) {
        return false;
      }
    }
  }
  wx.login({
    success: function (t) {
      if (t.code) {
        Gdata.u_code = t.code;
        oddpush_data(Gdata, "getopenid", "getopenid");
      } else {
        Gdata.u_code = 0
      }
    }
  })
};

function getauthSetting (p) {
  if( p == undefined){
    return false;
  }
  wx.getSetting({
    success: function (r) {
      // console.log(r);
      if (r.authSetting["scope.userInfo"]) {
        if (p.u == "userInfo") {
          goto_login(Gdata, function (res) {
            // console.log(res);
            Gdata.oddpush_user_data = res.rawData;
            oddpush_data(Gdata, "userinfo", "userinfo")
          })
        }
      }
      if (r.authSetting["scope.userLocation"]) {
        if (p.l == "location") {
          wx.getLocation({
            type: "wgs84",
            success: function (t) {
              Gdata.lat = t.latitude;
              Gdata.lng = t.longitude;
            }
          })
        }
      }
    }
  })
};

function oddpush_data(t, f, u, d){
  // console.log(u);
  if (!config.appkey) {
    var qitui = wx.getStorageSync('qitui');
    if (qitui){
      config.appkey = qitui.qt_appkey;
      config.is_openPlugins = qitui.qt_isopen == 1 ? true : false;
    }else{
      return false;
    }
  }
  if (!config.is_openPlugins){
    return false;
  }
  
  if (d == undefined) d = {};
  var u_openid = wx.getStorageSync("u_openid");
  //console.log(u_openid);
  var data = {
    "d":d,
    "u_code": Gdata.u_code,
    "akey": config.appkey.replace(/(^\s*)|(\s*$)/g, ""),
    "u_openid": u_openid,
  };
  
  if (f=="userinfo"){
    data["ud"] = Gdata.oddpush_user_data;
    var nt = new Date().getTime();
    var u_openid_time = wx.getStorageSync("u_openid_time");
    //console.log(u_openid_time);
    if (u_openid_time && u_openid){
      if (nt > (u_openid_time + 10 * 60)){
        // console.log("e");
        return false;
      }
    }
  }
// console.log(data);
  wx.request({
    url: apiURL + "/" + u,
    method: "POST",
    header: {
      "content-type": "application/json"
    },
    data: data,
    success: function (r) {
      //console.log(r);
      if (u == "userinfo") {
        if (r.data.openid != undefined){
          wx.setStorageSync("u_openid", r.data.openid);
          var timestamp = new Date().getTime();
          wx.setStorageSync("u_openid_time", timestamp);
        }
      }
      if (u == "getopenid") {
        if (r.data.openid != undefined) {
          wx.setStorageSync("u_openid", r.data.openid);
          var timestamp = new Date().getTime();
          wx.setStorageSync("u_openid_start_time", timestamp);
        }
      }
      // console.log(u);
      // console.log(r);
    }
  })
}

var oddpush = function (t, e) {
  try {
    var n, a;
    e === "App" ? n = t : a = t
  } catch (t) {}

  var g = function (t) {
    // HookTo(t, "onLaunch", b);
    HookTo(t, "onShow", d);
    // HookTo(e, "onHide", h);
    n ? n(t) : App(t)
  };

  var d = function(t){
    goto_openid();
  }

  var p = function (t) {
    // console.log("qitui11");
    // for (var e in t) {
    //   if (typeof t[e] === "function") {
    //     if (e == "onLoad") {
    //       HookTo(t, "onLoad", u);
    //       continue
    //     }
    //     HookTo(t, e, otherPageFunction)
    //   }
    // }
    HookTo(t, "onShow", pd);
    // HookTo(t, "onHide", p);
    // HookTo(t, "hidepushFormSubmit", hidepushFormSubmit);
    HookTo(t, "oddPushFormSubmit", oddPushFormSubmit);
    a ? a(t) : Page(t)
  };

  function b(t) {
    var cur = this;
    if (typeof t != "undefined") {
      
    } else {
      
    }
  }

  function pd(t){
    var cur = this;
    var d = {
      "u":"userInfo"
    }
    getauthSetting(d);
  }
  
  return {
    App: g,
    Page: p
  }
}

gocheckversion();
exports.oddPush = oddpush;
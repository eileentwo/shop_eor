// apiUserMyInfo(user_id获取个人信息)
// apiWxGetopenid (获取Openid)
var Page = require('./oddpush.js').oddPush(Page).Page;
let Page_temp = Page;
let basePage = function(data) {
  let app = getApp();
  data.data.app_type = '';
  data.data.show = false;
  data.data.ajax = false;
  data.data.reload = false;
  data.data.padding = 0;
  // 是否有padding
  data.data.padding = false;
  // 是否显示页面
  data.data.show = false;
  // 当前页面是否没有上级页面
  data.data.newPage = false;
  // 列表
  data.data.list = {
    load: false,
    over: false,
    page: 1,
    length: 10,
    none: false,
    data: []
  }

  // 重写onLoad
  var onLoad_temp = data.onLoad;
  data.onLoad = function(o) {
    let _this = this;
    let old_session_key = wx.getStorageSync('session_key');
    if (!old_session_key) data.checkSessionKey();
    wx.checkSession({
      success() {},
      fail() {
        if (old_session_key) data.checkSessionKey();
      }
    })
    var app = getApp();
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if (prevPage == undefined) {
      this.setData({
        newPage: true
      })
    }
    if (o.scene) {      
      let scene = decodeURIComponent(o.scene);
      let obj = {};
      let scenearr = scene.split('&');
      for (let i = 0; i < scenearr.length; i++) {
        let arr = scenearr[i].split('=');
        obj[arr[0]] = arr[1];
      }
      o = obj;
    }
    if (o.s_id && o.s_id > 0) {
      wx.setStorageSync('s_id', o.s_id);
    }
    let setting = wx.getStorageSync('setting');
    if (setting) {
      wx.setNavigationBarColor({
        frontColor: !setting.config.fontcolor ? '#000000' : setting.config.fontcolor,
        backgroundColor: !setting.config.top_color ? '#ffffff' : setting.config.top_color,
      })
    }
    let u = wx.getStorageSync('zhyshopInfo');
    let user = {
      id: '',
      avatar: '',
      nuckname: ''
    }
    if (!!u) user = u;
    var bind_phone_switch = wx.getStorageSync('bind_phone_switch');
    //console.log(bind_phone_switch);
    if (bind_phone_switch==1){
      if(!user.phone){
        wx.removeStorageSync('zhyshopInfo')
        user = {
          id: '',
          avatar: '',
          nuckname: ''
        }
      }
    }
    //console.log(user)
    this.setData({
      user
    })
    onLoad_temp.call(this, o);
  }
  data.checkSessionKey = function() {
    let _this = this;
    console.log(95555)
    wx.login({
      success(res) {
        if (res.code) {
          app.api.LoginGetopenid({
            code: res.code
          }).then((res) => {
            console.log(102)
            // app.getopenidSuccess(res);
            wx.setStorageSync('session_key', res.data.uid)
          }).catch((res) => {
            return;
          });
        }
      }
    });
  };
  data.navLogin = function(root) {
    if (!root) root = '/pages/home/home';
    let url = encodeURIComponent(root);
    app.reTo("/pages/login/login?id=" + url);
  };
  // cb 回调执行 root 页面路径 reload 是否重新加载个人信息 backPage 默认 1首页 2 上一页 3 当前页 返回页面
  // data.checkLogin = function(cb, root, reload, backPage) { // 判断是否登录  重新加载获取个人信息
  //   var uInfo = wx.getStorageSync('zhyshopInfo');
  //   var infoCenter = wx.getStorageSync('zhycenterInfo');
  //   let osetting = wx.getStorageSync('setting')
  //   if (!osetting || (root == '/pages/home/home')) {
  //     app.api.apiIndexSystemSet().then(res => {
  //       if (res.data.bind_phone_switch == 1) {
  //         if (uInfo && uInfo.id > 0) {
  //           if (reload) {
  //             app.api.apiUserMyInfo({
  //               user_id: uInfo.id
  //             }).then(res => {
  //               wx.setStorageSync('zhyshopInfo', res.data.userinfo);
  //               cb && cb(res.data.userinfo, res.data.myviptype);
  //             }).catch(res => {
  //               app.tips(res.msg);
  //               return data.checkLogin(cb, root);
  //               wx.removeStorageSync('zhyshopInfo');
  //             })
  //           } else {
  //             cb && cb(uInfo)
  //           }
  //         } else {
  //           if (uInfo && uInfo.id > 0 && uInfo.phone > 0) {
  //             cb && cb(uInfo)
  //           } else {
  //             if (!root) return cb && cb(false);
  //             wx.showModal({
  //               title: '提示',
  //               content: '您未登录，请先登录！',
  //               success(res) {
  //                 if (res.confirm) {
  //                   if (!root) root = '/pages/home/home';
  //                   let url = encodeURIComponent(root);
  //                   app.reTo("/pages/login/login?id=" + url);
  //                 } else if (res.cancel) {
  //                   if (backPage == 2) {
  //                     let prevPage = getCurrentPages()[getCurrentPages().length - 2];
  //                     if (prevPage) {
  //                       wx.navigateBack({
  //                         delta: 1
  //                       })
  //                     } else {
  //                       app.lunchTo('/pages/home/home');
  //                     }
  //                   } else if (backPage == 3) {
  //                     return false;
  //                   } else {
  //                     app.lunchTo('/pages/home/home');
  //                   }
  //                 }
  //               }
  //             })
  //           }
  //         }
  //       } else {
  //         if (uInfo && uInfo.id > 0) {
  //           if (reload) {
  //             app.api.apiUserMyInfo({
  //               user_id: uInfo.id
  //             }).then(res => {
  //               wx.setStorageSync('zhyshopInfo', res.data.userinfo);
  //               cb && cb(res.data.userinfo, res.data.myviptype);
  //             }).catch(res => {
  //               app.tips(res.msg);
  //               return data.checkLogin(cb, root);
  //               wx.removeStorageSync('zhyshopInfo');
  //             })
  //           } else {
  //             cb && cb(uInfo)
  //           }
  //         } else {
  //           if (!root) return cb && cb(false);
  //           wx.showModal({
  //             title: '提示',
  //             content: '您未登录，请先登录！',
  //             success(res) {
  //               if (res.confirm) {
  //                 if (!root) root = '/pages/home/home';
  //                 let url = encodeURIComponent(root);
  //                 app.reTo("/pages/login/login?id=" + url);
  //               } else if (res.cancel) {
  //                 if (backPage == 2) {
  //                   let prevPage = getCurrentPages()[getCurrentPages().length - 2];
  //                   if (prevPage) {
  //                     wx.navigateBack({
  //                       delta: 1
  //                     })
  //                   } else {
  //                     app.lunchTo('/pages/home/home');
  //                   }
  //                 } else if (backPage == 3) {
  //                   return false;
  //                 } else {
  //                   app.lunchTo('/pages/home/home');
  //                 }
  //               }
  //             }
  //           })
  //         }
  //       }
  //     }).catch(res => {
  //       app.tips(res.msg);
  //     })
  //   } else {
  //     if (uInfo && uInfo.id > 0) {
  //       if (reload) {
  //         app.api.apiUserMyInfo({
  //           user_id: uInfo.id
  //         }).then(res => {
  //           wx.setStorageSync('zhyshopInfo', res.data.userinfo);
  //           cb && cb(res.data.userinfo, res.data.myviptype);
  //         }).catch(res => {
  //           app.tips(res.msg);
  //           return data.checkLogin(cb, root);
  //           wx.removeStorageSync('zhyshopInfo');
  //         })
  //       } else {
  //         cb && cb(uInfo)
  //       }
  //     } else {
  //       if (!root) return cb && cb(false);
  //       wx.showModal({
  //         title: '提示',
  //         content: '您未登录，请先登录！',
  //         success(res) {
  //           if (res.confirm) {
  //             if (!root) root = '/pages/home/home';
  //             let url = encodeURIComponent(root);
  //             app.reTo("/pages/login/login?id=" + url);
  //           } else if (res.cancel) {
  //             if (backPage == 2) {
  //               let prevPage = getCurrentPages()[getCurrentPages().length - 2];
  //               if (prevPage) {
  //                 wx.navigateBack({
  //                   delta: 1
  //                 })
  //               } else {
  //                 app.lunchTo('/pages/home/home');
  //               }
  //             } else if (backPage == 3) {
  //               return false;
  //             } else {
  //               app.lunchTo('/pages/home/home');
  //             }
  //           }
  //         }
  //       })
  //     }
  //   }
  // };
  // 判断是否有padding
  data.getPadding = function(e) {
    this.setData({
      padding: e.detail
    })
  };
  data.reloadPrevious = function() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];//当前页面的上一个页面
    if (prevPage) {
      //zhyPrevPage_begin  prevPage
      prevPage.setData({
        reload: true
      })
      //zhyPrevPage_end  prevPage
    }
  }
  // 处理下拉加载
  data.dealList = function(res, page) { // 下拉加载
    if (page == 1) {
      this.setData({
        list: {
          load: false,
          over: false,
          page: 1,
          length: 10,
          none: false,
          data: []
        }
      })
    }
    let data = this.data.list.data.concat(res);
    if (res.length < this.data.list.length) {
      this.setData({
        [`list.over`]: true
      })
    }
    if (data.length === 0) {
      this.setData({
        [`list.none`]: true
      })
    }
    this.setData({
      [`list.load`]: false,
      [`list.page`]: ++this.data.list.page,
      [`list.data`]: data,
      ajax: false
    })
  };
  // 跳转首页
  data.onHomeTab = function(e) {
    app.lunchTo('/pages/home/home');
  }
  data.getLatLng = function(cb) {
    let _this = this;
    app.location().then(res => {
      if (res) {
        this.setData({
          ['lng']: res.lng - 0,
          ['lat']: res.lat - 0,
        })
        let latlng = {
          lng: (res.lng - 0),
          lat: (res.lat - 0)
        }
        return cb(latlng);
      } else {
        app.alert('定位需要获取位置信息，请去开启位置授权！', () => {
          wx.openSetting({
            success(res) {
              if (res.authSetting['scope.userLocation']) {
                _this.getLatLng(cb);
              } else {
                _this.getLatLng(cb);
              }
            }
          })
        }, () => {
          return cb(false);
        })
      }
    })
  };

  data.checkDistribution = function(o) {
    let s_id = o.s_id;
    let user = wx.getStorageSync('zhyshopInfo');
    if (!s_id || !user || !user.id) return;
    let param = {
      user_id: user.id,
      referrer_uid: s_id
    }
    app.api.apiPusherSetPusherrelation(param).then((res) => {
      return;
    }).catch((res) => {
      return;
    });
  };

  data.setIntegralSetting = function(cb) {
    app.api.apiintegralintegralSet().then((res) => {
      //console.log(res)
      if (res.data) {
        this.setData({
          integraSetting: res.data
        })
      } else {
        res.data = {
          is_open: 0
        }
        this.setData({
          integraSetting: {
            is_open: 0
          }
        })
      }
      cb(res.data);
    }).catch((res) => {
      app.tips('获取积分设置失败');
      return;
    });
  };
  // 引导关注
  data.getWechetp = function() {
    //判断是公众号还是小程序 
    if (app.app_type && app.app_type == "wechat") {
      //获取公众号关注设置
      let that = this;
      let wechat_openid = wx.getStorageSync('zhyshopInfo') ? wx.getStorageSync('zhyshopInfo').wechat_openid : '';
      app.api.apiWechatShareAndFollow({ openid: wechat_openid, type: 2 }).then(res => {
        if (res.data.subscribe != 1) {
          that.setData({ iswechats: true })
        } else {
          that.setData({ iswechats: false })
        }
        wx.setStorageSync('gzsetting', res.data);
        that.setData({
          gzsset: JSON.parse(JSON.stringify(res.data)),
          wcpshow: true
        })
      }).catch(res => {
        app.tips(res.msg)
      })
    }
  },

  data.setBanlancePayConfig = function() {
    // const isBalance = wx.getStorageSync('setting').config.balance_isopen-0;
    const isBalance = wx.getStorageSync('setting')?wx.getStorageSync('setting').config.balance_isopen - 0:0;
    if (isBalance == 0) {
      this.setData({
        choosePay: {
          type: [{
            name: '微信支付',
            pic: "/zhy/resource/images/pay/wx.png",
          }],
          curr: 1,
          alert: false
        }
      })
    } else {
      this.setData({
        choosePay: {
          type: [{
              name: '微信支付',
              pic: "/zhy/resource/images/pay/wx.png",
            },
            {
              name: '余额支付',
              pic: "/zhy/resource/images/pay/local.png",
            },
          ],
          curr: 1,
          alert: false
        }
      })
    }
  };
  return Page_temp(data);
};

module.exports = {
  basePage
}


var App = require('/zhy/resource/js/oddpush.js').oddPush(App, 'App').App;
App({
  onLaunch() {
    let openid = wx.getStorageSync('openid');
    if (openid != "") { //如果获取到了openid则直接进入
      this.globalData.openid = openid;
      let data = wx.getStorageSync('eorder');
      this.getopenidSuccess(data); //重新给globalData
      // this.lunchTo("/pages/mine/mine");
      // this.lunchTo("/pages/goodslist/goodslist");
      // this.lunchTo("/pages/home/home");
    } 
    this.isIphoneXFn();
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      //console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function() {
      // 新版本下载失败
    })

    let haveunionid = wx.getStorageSync('haveunionid');
    if (haveunionid != 1) {
      wx.removeStorageSync('zhyshopInfo');
      wx.removeStorageSync('zhycenterInfo');
      wx.removeStorageSync('openid');
    }
  },
  onReady(){
  },
  Base: require('/zhy/resource/js/rewrite.js').basePage,
  siteInfo: require('siteinfo.js'),
  util: require('/we7/js/util.js'),
  api: require('/zhy/resource/js/api.js'),
  tabSuccess() {
    this.globalData.tab = false;
  },
  navTo(url) {
    console.log(url)
    if (this.timer) clearInterval(this.timer);
    let _this = this;
    let urls = url.split('?');
    let fetchUrl = urls[0];
    let navList = wx.getStorageSync('setting').nav;
    let lunch = false;
    if (navList) {
      for (let i in navList) {
        if (fetchUrl == navList[i].link) {
          lunch = true;
        }
      }
    }
    let key = this.globalData.tab;
    if (!key) {
      this.globalData.tab = !this.globalData.tab;
      if (lunch) {
        wx.redirectTo({
          url,
          complete: function() {
            _this.tabSuccess();
          },
        })
      } else {
        console.log(key, 66)
        wx.navigateTo({
          url,
          complete: function() {
            _this.tabSuccess();
          },
        })
      }
    }
  },

  animation(dur1, del1, trans1, dur2, del2, trans2, dir1, dir2) {
    let arr = {};
    arr.animation = wx.createAnimation({
      duration: dur1,
      timingFunction: 'ease',
      delay: del1
    });
    if (dir1) {

      arr.animation.translate(trans1, 0).step();
    } else {
      arr.animation.translate(0, trans1).step();
    }
    arr.animation1 = wx.createAnimation({
      duration: dur2,
      timingFunction: 'ease',
      delay: del2
    });
    if (dir2) {
      arr.animation1.translate(trans2, 0).step();
    } else {
      arr.animation1.translate(0, trans2).step();
    }
    return arr;
  },
  reTo(url) {
    if (this.timer) clearInterval(this.timer);
    let _this = this;
    let key = this.globalData.tab;
    if (!key) {
      this.globalData.tab = !this.globalData.tab;
      wx.redirectTo({
        url,
        complete: function() {
          _this.tabSuccess();
        },
      })
    }
  },
  lunchTo(url) {
    if (this.timer) clearInterval(this.timer);
    let _this = this;
    let key = this.globalData.tab;
    if (!key) {
      this.globalData.tab = !this.globalData.tab;
      wx.reLaunch({
        url,
        complete: function() {
          _this.tabSuccess();
        },
      })
    }
  },
  tips(txt) {
    wx.showToast({
      title: txt,
      icon: 'none',
      duration: 1500
    })
  },
  alert(msg, cb, cancb, title, cancelText, confirmText) { // 提示信息， 确定回调， 取消回调 （cancb == 0 没有取消）， 标题，取消按钮文字， 确定按钮文字
    wx.showModal({
      title: title ? title : '提示',
      content: msg ? msg : '暂无提示！',
      showCancel: cancb == 0 ? false : true,
      cancelText: cancelText ? cancelText : '取消',
      confirmText: confirmText ? confirmText : '确定',
      success(res) {
        if (res.confirm) {
          console.log(cb)
          // cb && cb();
        } else if (res.cancel) {
          cancb && cancb();
        }
      }
    })
  },
  phone(tel) {
    tel && wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  map(lat, lng) {
    let latitude = lat - 0;
    let longitude = lng - 0;
    wx.openLocation({
      latitude,
      longitude,
      scale: 28
    })
  },
  location() {
    let _this = this;
    return new Promise(function(resolve, reject) {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          let lat = res.latitude;
          let lng = res.longitude;
          let local = {
            lat,
            lng
          }
          resolve(local);
        },
        fail(res) {
          resolve(false);
        }
      })
    })
  },
  /*getDaysBetween(dateString1, dateString2){
    var  startDate = Date.parse(dateString1);
    var  endDate = Date.parse(dateString2);
    var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
    console.log(days);
    return  days;
  },*/
  timePass(time) {
    return new Promise(function(resolve, reject) {
      setTimeout(() => {
        resolve();
      }, time ? time : 1000)
    })
  },
  reback() {
    let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
    let prevPage = pages[pages.length - 2];
    if (prevPage) {
      //eorder_prevPage start
      wx.navigateBack({
        delta: 1 // 返回上一级页面。
      })
      //eorder_prevPage end
    }
  },
  toTop(){
    wx.pageScrollTo({
      scrollTop: 0
    })
  },
  returnTodayInfo(now) {
    now = now ? new Date(now * 1000): new Date();
    var yearData = now.getFullYear(); //得到年份
    var monthData = now.getMonth(); //得到月份
    var monthDataRel = now.getMonth() + 1; //得到月份
    var dayData = now.getDate(); //得到日期
    var hour = now.getHours(); //得到小时
    var minu = now.getMinutes(); //得到分钟
    var sec = now.getSeconds();
    monthDataRel = this.formatDate(monthDataRel)
    dayData = this.formatDate(dayData)
    hour = this.formatDate(hour)
    minu = this.formatDate(minu);
    sec = this.formatDate(sec);
    return {
      yearData,
      monthDataRel,
      dayData,
      hour,
      minu,
      sec,
    }
  },
  formatDate(e) {
    if (e < 10) {
      e = "0" + e
    };
    return e
  },
  isOverdue(str) {

    // str = str+'';
    var date = new Date(str).getTime();
    var now = new Date().getTime();
    // console.log(str,date,now)
    if (date < now) {
      return true
    } else {
      return false
    }
  },

  setGlobalData(uid, userinfo) { //设置全局变量
    this.globalData.uid = uid;
    this.globalData.userinfo = userinfo;
    this.globalData.check_state=userinfo.check_state ||0;
  },
  getopenidSuccess(res) {
    let data = res.data ? res.data : [];
    if (!data.uid) {
      return;
    }
    let uid = data.uid;
    let userinfo = {};
    if (data.eorder_userinfo){
      userinfo=data.eorder_userinfo
    }else{
      userinfo.address = data.address;
      userinfo.user_headimg = data.avatar;
      userinfo.id = data.id;
      userinfo.level_id = data.level_id;
      userinfo.address = data.address;
      userinfo.nickname = data.nickname;
      userinfo.phone = data.phone;
      userinfo.refuse_text = data.refuse_text;
      userinfo.shop_id = data.shop_id;
    }
    
    if(data.wholsaler_info){   
      userinfo.check_state = data.wholsaler_info.check_state==2?2:0;
    }
    if(data.check_state){  
      userinfo.check_state = data.check_state==2?2:0;
    }
    let openid = data.openid ? data.openid : data.eorder_userinfo.openid;
    wx.setStorageSync('openid', openid);
    userinfo.openid = openid;
    
    wx.setStorageSync('eorder', res);
    this.setGlobalData(uid, userinfo);


  },
  checkUid() {
    if (this.globalData.uid == "") {
      this.navTo("/pages/login/login");
      return
    }
  },
  siteroot(imgroot) {

    let siteroot = imgroot + '/';
    if (this.siteInfo.uniacid > 0) {
      siteroot = ''
    }
    return siteroot
  },
 
  isIphoneXFn(){
    let modelInfo = wx.getSystemInfoSync();
    console.log(modelInfo)
    let global = this.globalData;
    global.isIphoneX = modelInfo.model.indexOf("iPhone X") != -1;
    global.iphoneXH = modelInfo.windowHeight - modelInfo.statusBarHeight - 86 + 'px'
  },
  globalData: {
    isCloseHomeCoupon: false, // 是否关闭首页优惠券弹窗    
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight'],
    windowHeight: wx.getSystemInfoSync().windowHeight,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    uid: '',
    userinfo: {},
  }
})
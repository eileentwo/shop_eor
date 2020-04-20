// LoginGetopenid (获取Openid)
// apiUserLogin(登录)
// apiDistributionSetDistributionParents (成为经销商下线)
// apiPusherSetPusherrelation(成为访客)
// apiPusherBindPusherByInvitationcode (邀请码进入程序邀请码绑定上下级)
// apiUserGetSmsCode (app用户获取验证码)
const app = getApp();
// const homeUrl = "/pages/mine/mine";
const homeUrl ="/pages/home/home";
var timeers;
Page({
  data: {
    siteroot:'',
    bindphone: false,
    time: 60,
    cansend: true,
    timetext: "获取验证码",
    showkuaij: true,
    inviteswitch: false,
    code: '',
    // isApp: false, // app
    // isLogin: true, // app 登录注册状态
    u_encryptedData: '',
    u_iv: '',
    oset: {},
    salerLevel: [], //批发商等级总信息
    level: [],
    level_id:'',//用户选择的等级id
  },
  bindPickerChange: function(e) {//选择批发商等级
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let val = e.detail.value;
    console.log(this.data.salerLevel[val].id)
    this.setData({
      index: val,
      level_id: this.data.salerLevel[val].id
    })
  },
  onLoad(options) {
    //如果是公众号
    if (!app.app_type) {
      this.setData({
        showkuaij: false
      })
    }
   
   
    const newUrl = decodeURIComponent(options.id);
    
    if (newUrl && newUrl != 'undefined') {
      this.setData({
        backurl: newUrl
      })
    } else {
      // app.lunchTo(homeUrl)
    }
  },

  onLoginTap(res) {
    console.log(res,60)
    if (res.detail.errMsg === 'getUserInfo:fail auth deny') {
      return;
    }
    this.setData({
      info: res.detail.userInfo,
      u_encryptedData: res.detail.encryptedData,
      u_iv: res.detail.iv
    })
    
    this.wxLogin(res.data)
  },
  wxLogin(osetting) {
    let _this = this;
    wx.login({
      success(res) {
        console.log(res, 123)
        if (res.code) {
          let param = {
            code: res.code,
            u_encryptedData: _this.data.u_encryptedData,
            u_iv: _this.data.u_iv
          };
          //console.log(param,129)
          if (app.app_type && app.app_type == "app") {
            param.unionid = wx.getStorageSync("unionid");
            let userinfo = wx.getStorageSync("userInfo");
            param.avatar_url = userinfo.avatarUrl;
            param.nick_name = userinfo.nickName;
          }
          app.api.LoginGetopenid(param).then((res) => {
            console.log(res, 137)
            app.getopenidSuccess(res);
            wx.setStorageSync('haveunionid', 1);         
            if(res.data.uid){
              let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
              let prevPage = pages[pages.length - 2];
              console.log(prevPage)
              if (prevPage) {
                //eorder_prevPage start
                wx.navigateBack({
                  delta: 1 // 返回上一级页面。
                })
                app.globalData.uid=res.data.uid;
                prevPage.setData({
                  uid:res.data.uid
                })
                //eorder_prevPage end
              }
            }
          }).catch((res) => {
            if (res.code == 1) {// 执行失败回调操作
              console.log(res.data, 270)
              // app.tips(res.msg);
              // _this.getSalerLevel()
              _this.setData({
                showkuaij:true,
                bindphone: true, openid: res.data.openid, sessionKey: res.data.session_key,
              })
            } else { 
              console.log(268)
              app.tips(res.msg);
            }
          });
        } else {
          app.tips('登录失败！' + res.errMsg);
        }
      }
    });
  },

  getPhoneNumber(e) {
    console.log(e)

    let param = {
      sessionKey: this.data.sessionKey,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
    }
    this.decryAjax(param);
  },
  decryAjax(param) {
    app.api.DecryptPhone(param).then(res => {
      //console.log(res)
      this.setData({
        tel: res.data.phoneNumber
      })
      this.bindPhoneAjax();
    }).catch(res => {
      app.tips(res.msg)
    })
  },
  getSalerLevel() { //获取批发商等级
    let that = this;
    app.api.WholeSalerLevel().then((res) => {
      console.log(res)
      let level = [];
      for (let i = 0, l = res.data.length; i < l; i++) {

        level[i] = res.data[i].role
      }

      that.setData({
        salerLevel: res.data,
        level
      })
    }).catch((res) => {
      return;
    });
  },

  getTel(e) {
    let tel = e.detail.value.trim();
    this.setData({
      tel
    })
  },
  onBindTap(e) {
    if (!this.data.tel || this.data.tel.length < 11) {
      app.tips('请输入正确的手机号码！');
      return;
    }
    // if (!this.data.level_id || this.data.level_id=="") {
    //   app.tips('请选择您的批发商等级！');
    //   return;
    // }
    this.bindPhoneAjax();
  },

  bindPhoneAjax() {
    let that=this;
    let param = {
      openid: this.data.openid,
      phone: this.data.tel,
      nickname: this.data.info.nickName,
      avatar: this.data.info.avatarUrl,
      gender: this.data.info.gender,
    }
    app.api.LoginBindPhone(param).then(res => {
      console.log(res);
      let uid = res.data.uid;
      let userinfo = that.data.info;
      if (res.data.postdata){
        userinfo = res.data.postdata;
        wx.setStorageSync('userinfo', res.data.postdata);
      }
      wx.setStorageSync('uid', res.data.uid);
      wx.setStorageSync('eorder', res.data);
      app.tips('恭喜您，绑定电话号码成功！');
      app.setGlobalData(uid, userinfo);
      app.lunchTo(homeUrl)
    }).catch(res => {
      app.tips(res.msg);
      if(res.msg=='该手机号'){
        
      }
    })
  },
 
  onBackTap() {
    app.lunchTo(homeUrl);
  }
})
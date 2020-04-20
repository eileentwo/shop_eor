// apiUserGetMyInfo (获取我的页面信息)
// apiUserGetMyset (获取我的页面配置)
const app = getApp();

let uid = app.globalData.uid;
Page({
  data: {
    uid,
    isIphoneX: app.globalData.isIphoneX,
  },

  onLoad(o) {
  },
  navigate(e) {
    let index = e.currentTarget.dataset.index;
    console.log(app.globalData.uid,index)
    if (app.globalData.uid == "") {
      if (index == 0) {
        app.navTo("/pages/login/login");
      } else {
        app.tips("请登录")
      }
      return
    }
    switch (index) {
      case '0':
        console.log(index)
        app.navTo('/base/user/user')
        break;
      case '1':
        console.log(index)

        app.navTo('/base/orders/orders')
        break;
      case '2':
        app.navTo('/base/fund/fund')
        break;
      case '3':
        app.navTo('/base/coupon/coupon')

        break;
      case '4':
        app.navTo('/base/commission/commission?integral=' + this.data.personal.integral_num)

        break;
      case '5':
        app.navTo('/base/feedback/feedback')

        break;
      case '6':
        app.navTo('/base/returns/returns')

        break;
      case '7':
        app.navTo('/base/address/address')

        break;
      case '8':
        app.navTo('/base/companyInfo/companyInfo')

        break;
      case '9':
        app.navTo('/base/collect/collect')

        break;
      case '10':
        let personal = this.data.personal;
        let check_state = this.data.check_state;
        if (check_state==1){
          app.tips('审核中，请等待！')
          return;
        }
        app.navTo('/base/register/register?cunsum=' +personal.cunsum + '&check_state=' + check_state)

        break;
    }

  },
  onShow() {

    if(app.globalData.uid==""){
      return
    }else{
      uid = app.globalData.uid
    }
    this.personalCenter();
    this.setData({
      uid
    })
    // this.getTabBar().setData({
    //   selected: 4
    // })
  },
  personalCenter() {
    let param={
      uid
    }
    let that=this;
    app.api.PersonalCenter(param).then(res => {
      console.log(res.data,74)
      if (res.data.userinfo){
        res.data.balance = res.data.balance?res.data.balance.split('.'):['0','00'];
        wx.setStorageSync('integral_num', res.data.integral_num)
        let check_state=0;
        if (res.data.wholsaler_info){
          check_state=res.data.wholsaler_info.check_state          
        }
        let checkstate=check_state==2?2:0;
        app.globalData.check_state=checkstate;
        wx.setStorageSync('check_state', checkstate);
        let userinfo = res.data.eorder_userinfo && res.data.eorder_userinfo.creat_time ? res.data.eorder_userinfo : res.data.userinfo;
        app.globalData.userinfo=userinfo;
        that.setData({
          role_name: res.data.role_name || '',
          userinfo ,
          personal: res.data, check_state
        })
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },

})
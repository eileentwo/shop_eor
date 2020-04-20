const app = getApp();
let foot = require('../../zhy/component/comFooter/dealfoot.js');
let common = require('../../zhy/resource/js/common.js');
let uid =app.globalData.uid;
Page({
  data: {
    checkstate: false,
    isIphoneX: app.globalData.isIphoneX,
    onshowData: 0,
    mask: false,
    showMask:false,//弹出优惠券
    showToTop: false, //返回顶部
    busPos:{
      x:0,y:0
    },
    siteroot: '',
    homeData:[],
    isToSearch:true,
  },
  onLoad(o) {
    this.getCouponsData(1);

  },

  getListData() {
    let that=this;
    app.api.HomeInfo({uid}).then(res => {
      console.log(res.data, 'homeInfo',res)
      if (res.data) {
        let homeData=res.data;
        homeData.hot_list = common.setHomeGoodList(homeData.hot_list)
        homeData.new_list = common.setHomeGoodList(homeData.new_list)
        homeData.rec_list = common.setHomeGoodList(homeData.rec_list) 
        wx.setNavigationBarTitle({
          title: res.data.homepage_title,
        })

        that.setData({
          homeData: res.data,
          siteroot: app.siteroot(res.other.imgroot)
        })
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  getCouponsData(page) {//获取优惠券
    let param = {
      uid,
      length: this.data.length,
      page,
      home_show:1
    }
    let that = this;

    app.api.CouponList(param).then(res => {
      console.log(res.data.data, 'CouponList')
      if (res.data.data) {
        let coupons=[];
        let temp = res.data.data;
        for(let i in temp ){
          temp[i].start_time = temp[i].start_time.substring(0,10);
          temp[i].end_time = temp[i].end_time.substring(0, 10);
          temp[i].money = temp[i].money.split('.');
          if (app.isOverdue(temp[i].end_time) || (temp[i].max_fetch > 0 && temp[i].my_getnums == temp[i].max_fetch) || temp[i].all_getnums == temp[i].count){
            temp[i].is_show=0
          }
          if(temp[i].is_show==1){
            coupons.push(temp[i])
          }
        }
        // coupons.length=4;
        that.setData({
          coupons, showMask:true
        })
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  onShow() {

    common.getWholesalerInfo(this);
    // this.getTabBar().setData({
    //   selected:0
    // })
    if(app.globalData.uid ==""){
      return;
    }else{
      uid = app.globalData.uid 
    }
   
  },
  getSetting(e) {
    wx.setNavigationBarTitle({
      title: e.detail.config.index_title,
    })
    this.setData({
      support: e.detail
    })
  },
 
  onPageScroll: function(e) {
    let showToTop = this.data.showToTop;
    let scrollHeight = this.data.scrollHeight;
    let ani=wx.createAnimation({
      duration: 10,
      timingFunction: 'ease',
      delay: 1000
    });
    if (e.scrollTop <= 0) { // 滚动到最顶部
      e.scrollTop = 0;
    } else if (e.scrollTop >scrollHeight) { // 滚动到最底部
      e.scrollTop =scrollHeight;
    }
    if (e.scrollTop > this.data.scrollTop || e.scrollTop >=scrollHeight) { //向下滚动
      // console.log('向下 ', e.scrollTop)
    // } else { //向上滚动 
      console.log('向上滚动')
      if (this.data.scrollHeight - e.scrollTop <scrollHeight - 100){
        showToTop = true;
        ani.opacity(1).step();
      } else {
        showToTop = false;
        ani.opacity(0).step();
      }

    } //给scrollTop重新赋值 
    this.setData({
      scrollTop: e.scrollTop, showToTop, ani
    })
  },
  getScrollHeight: function() {
    wx.createSelectorQuery().select('#box').boundingClientRect((rect) => {
      this.setData({
        scrollHeight: rect.height
      });
    }).exec()

    // let busPos = this.data.busPos;
    // busPos.y = app.globalData.windowHeight-54;
    // busPos.x = app.globalData.windowWidth / 5 * 4;
    // this.setData({
    //   busPos
    // })
  },
  onReachBottom: function() {

  },
  onReady() {
    // this.getScrollHeight()
  },
  tosearch() {
    app.navTo('/base/selection/selection')
  },
  
  _onNavTab1(e) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let url = '/' + currentPage.route;
    let idx = e.currentTarget.dataset.index;
    let urls = this.data.banner[idx].link;
    let id = this.data.banner[idx].typeid;
    if (urls == url || urls == '') {
      return;
    }
    app.navTo(urls + '?id=' + id);
  },
  toggleCouponTap(){
    this.setData({
      showMask:false
    })
  },
  useFn(e){//领取优惠卷
    console.log(e)
    let item = e.detail.item;
    if (item.max_fetch>0&&item.my_getnums == item.max_fetch){     
      return;
    }
    let that = this;
    app.api.GetCoupon({
      coupon_type_id:item.coupon_type_id,uid
    }).then(res => {
      console.log(res, 'getCoupon')
      app.tips('领取成功');
      that.getCouponsData(1);
    }).catch(res => {
      app.tips(res.msg);
      let coupons = that.data.coupons;
      for (let i in coupons){
        if (coupons[i].coupon_type_id == item.coupon_type_id){
          coupons.splice(i,1)
        }
      }
      that.setData({
        coupons
      })
    })
  },
  toOther(e){
    let index=e.currentTarget.dataset.index;
    let url="";
    app.checkUid();
    uid=app.globalData.uid;
    if (index == 0) {
      url = '/base/discountList/discountList';
    }
    else if (index == 1) {
      url = '/base/coupon/coupon?index=1';
    }
    else if (index == 2) {
      url = '/base/activity/activity';
    }
    else if(index==3){
      url = '/base/collect/collect';
    } 
    app.navTo(url)
  },
  toNotice(e){
    let id=e.currentTarget.dataset.id;
    app.navTo('/base/notice/notice?id='+id)
  },


  onShareAppMessage: function () {

  },
})

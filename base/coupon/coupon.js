// base/coupon/coupon.js
const app = getApp();
let uid = app.globalData.uid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: [],
    length: 10,
    page: 1,
    isA: true,
    cur:0,
  },
  getCouFn(e) {
    console.log(e)
    let cur = e.target.dataset.index;
    this.setData({
      cur
    })
    this.getData(1)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    uid = app.globalData.uid;
    if (options.index && options.index == 1) {
      this.getCouponsData(1);
      this.setData({
        formHome: true,
      })
    } else {
      this.getData(1)
    }
  },

  getCouponsData(page) { //获取所有优惠券列表
    let param = {
      uid,
      length: this.data.length,
      page,
    }
    let that = this;

    app.api.CouponList(param).then(res => {
      console.log(res.data.data, 'CouponList')

      that.setCoupons(res.data.data, page);
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  getData(page) {
    let param = {
      uid,
      length: this.data.length,
      page,
      type:this.data.cur*1+1,
    }
    let that = this;

    app.api.MycouponList(param).then(res => {
      console.log(res.data.data, 'MycouponList')

      that.setCoupons(res.data.data, page);
      if(that.data.cur==0){
        that.setData({
          total_count: res.data.total_count
        })
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  setCoupons(data, page) {
    let coupons = [];
    let that=this;
    let isA = data.length == this.data.length ? true : false;
    if (page > 1) {
      coupons = that.data.coupons
    }

    if (data.length > 0) {
     
      for (let i in data) {
        data[i].money = data[i].money.split(".");
        if (this.data.formHome) {
          if (data[i].max_fetch > 0 && (data[i].my_getnums == data[i].max_fetch)) {
            data[i].getcoupon = false;
            data[i].canuse = 0;
          }else{
            data[i].getcoupon = true;
          }
          data[i].state = app.isOverdue(data[i].end_time) ? 2 : 1     

        }else{
          if (that.data.cur == 0) {
            data[i].canuse = 0;
          }
          else if (that.data.cur == 1) {
            data[i].canuse = 1
          } else {
            data[i].canuse = 0;
            data[i].state = app.isOverdue(data[i].end_time)?2:1
          }
        }
        coupons.push(data[i])
      }
    }
    this.setData({
      coupons,
      isA,
      page,      
    })
  },
  useFn(e) {

    let item = e.detail.item;
    // console.log(e, !item.getcoupon, 49)
    if (item.state == 2) {
      app.tips("优惠券已使用")
      return
    }
    if (item.canuse == 1 ) {
      app.tips("优惠券已过期")
      return
    }
    if (!this.data.formHome || !item.getcoupon) {
      console.log(13111)
      wx.redirectTo({
        url: "/pages/goodslist/goodslist",
      })
    } else {

      this.getCouponFn(item.coupon_type_id);
    }
  },
  getCouponFn(coupon_type_id) {
    let that = this;
    app.api.GetCoupon({
      coupon_type_id: coupon_type_id,
      uid
    }).then(res => {
      console.log(res, 'getCoupon')
      app.tips('领取成功');
      that.getCouponsData(1);
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  pullUpLoad(e) { //触底加载分页
    console.log(e, 104444)
    let dir = e.detail.direction;
    let page = this.data.page;
    let isA = this.data.isA;
    if (dir == "bottom" && isA) {
      page++;
      if (this.data.formHome) {
        this.getCouponsData(page);
      } else {
        this.getData(page)
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
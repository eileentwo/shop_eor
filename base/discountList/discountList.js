// base/discountList/discountList.js
const app=getApp();
let uid = app.globalData.uid;
let common = require('../../zhy/resource/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkstate: false,
    page:1, length:10,
    goodsList:[],
    isA:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uid = app.globalData.uid;
    common.getWholesalerInfo(this);

  },
  getListData(page){

    let that = this;
    app.api.DiscountList({
      page, uid, length:this.data.length
    }).then(res => {
      //console.log(res, 'DiscountList')
      let goodsList=[];
      let isA = res.data.data && res.data.data.length==that.data.length?true:false;
      if(page>1){
        goodsList = this.data.goodsList
      }
      let temp = res.data.data;
      let l = temp.length;
      if (l>0){
        for (let i = 0, l = temp.length; i < l; i++) {
          //console.log(temp[i])
          // temp[i] = common.setPrice(temp[i],1)
          goodsList.push(temp[i]);
        }
      }
      let siteroot = app.siteroot(res.other.imgroot);
      that.setData({
        goodsList, page, isA, siteroot
      })
    }).catch(res => {
      app.tips(res.msg);
    })
  }, 
  pullUpLoad(e) { //触底加载分页
    // console.log(e,104444)
    let dir = e.detail.direction;
    let page = this.data.page;
    let isA = this.data.isA;
    if (dir == "bottom" && isA) {
      page++;
      this.getListData(page);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
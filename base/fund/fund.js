// base/Fund/Fund.js
const app=getApp();
let uid=app.globalData.uid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acounts:[],
    page:1,
    length:10,
    isA:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getacounts(1)
  },
  getacounts(page) {
    
    let that = this;
    app.api.BalanceList({
      uid: app.globalData.uid, page, length: that.data.length,
    }).then((res) => {
      let balance=[];
      let isA = res.data.data && res.data.data.length==that.data.length?true:false;
      if(page>1){
        balance = that.data.balance;
      }
      let temp = res.data.data;
      if (temp.length>0){
        for(let i in temp){
          balance.push(temp[i])
        }
      }
      
      that.setData({
        balance, isA
      })
    }).catch((res) => {
      app.tips(res.msg);
    });
  },
  pullUpLoad(e) {//触底加载分页
    // console.log(e,104444)
    let dir = e.detail.direction;
    let page = this.data.page;
    let isA = this.data.isA;
    if (dir == "bottom" && isA) {
      page++;
      this.getacounts(page);
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
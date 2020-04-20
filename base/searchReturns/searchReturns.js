// base/searchReturns/searchReturns.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beginDate:'',
    endDate:'',
    orderStatus:[],
    orderStatus1:['全部','待退单审核','待收货确认','待退款确认','待收款确认','已完成','已作废'],
    orderStatus2:['全部','代下单','自主下单'],
    showFixed:false,
    oStatus:'全部',
    oAway:'全部'
  },
  bindDateChange(e){
    console.log('bindDateChange发送选择改变，携带值为',e, e.detail.value)
    let index=e.currentTarget.dataset.index;
    let beginDate=this.data.beginDate;
    let endDate=this.data.endDate;
    if(index==0){
      beginDate = e.detail.value
    }
    if(index ==1){
      endDate = e.detail.value
    }
    this.setData({
      beginDate,
      endDate,
    })
  },
  showFixedBox(e){
    let index=e.currentTarget.dataset.index;
    let orderStatus=[];
    if(index==0){
      orderStatus=this.data.orderStatus1
    }else{
      orderStatus=this.data.orderStatus2
    }
    let arr = app.animation(10, 0, 0, 1000, 0, 0);
    this.setData({
      ani: arr.animation.export(),
      ani1: arr.animation1.export(),
      orderStatus,
      currentIndex:index
    })

  },
  hideFixedBox() {
    let arr = app.animation(20, 1000, '100vh', 1000, 0, '100vh');
    this.setData({
      ani: arr.animation.export(),
      ani1: arr.animation1.export(),
    })
  },
  selectStatus(e){
    let val=e.currentTarget.dataset.item;
    let oStatus=this.data.oStatus;
    let oAway=this.data.oAway;
    if(this.data.currentIndex==0){
      oStatus=val
    }else{
      oAway=val
    }
    this.hideFixedBox();
    this.setData({
      oStatus,oAway
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
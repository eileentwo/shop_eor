// base/message/message.js
const app = getApp();
app.Base({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight:app.globalData.statusBarHeight,
    showMsg:0,
    titleText:"",//二级页面标题
    thirdText:"",//三级页面标题
  },

  showSecMsgPage(e){//显示业务消息等下一页面内容
    let titleText=e.currentTarget.dataset.titletext
    
    this.setData({
      showMsg:1,
      titleText
    })
  },
  hideSecMsgPage(){
    this.setData({
      showMsg:0
    })
  },
  showThirdMsg(e){
    this.setData({
      showMsg:2,
      thirdText:this.data.titleText+'详情'
    })

  },
  hideThirdMsgPage(){
    this.setData({
      showMsg:1,
    })
  },
  reback(){
    app.reback();
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
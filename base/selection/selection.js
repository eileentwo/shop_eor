// base/selection/selection.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showClose:false,
    historyData:[],
    searchVal:'',
  },
  clearInput(){//清空内容
    this.setData({
      searchVal:''
    })
  },
  changeVal(e){//输入内容
    this.setData({
      searchVal: e.detail.value
    })
  },
  search(e) {//点击搜索  
    console.log(e.currentTarget.dataset.value, this.data.searchVal)
    let searchVal = this.data.searchVal ? this.data.searchVal : e.currentTarget.dataset.value;
    let historyData = this.data.historyData;
    if(searchVal.length>0){
      if (historyData.length == 0) {
        historyData.unshift(searchVal)
      } else {
        for (let i = 0; i < historyData.length; i++) {
          if (historyData[i] != searchVal) {
            historyData.unshift(searchVal)
          }
        }
      }
    }else{
      app.tips("请输入搜索关键词");
      return
    }
    if(historyData.length>10){
      historyData.length = 10
    }
    wx.setStorageSync('historyData', historyData);
    
    app.navTo("/base/searchResult/searchResult?searchVal=" + searchVal);
    this.setData({
      historyData
    })
  },
  deleteFn(){
    this.setData({
      historyData:[]
    })

    wx.setStorageSync('historyData', this.data.historyData);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let historyData= wx.getStorageSync('historyData') || [];
    this.setData({
      historyData
    })
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
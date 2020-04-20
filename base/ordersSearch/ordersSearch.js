// base/ordersSearch/ordersSearch.js

const app = getApp()
var today = app.returnTodayInfo().yearData + '-' + app.returnTodayInfo().monthDataRel + '-' + app.returnTodayInfo().dayData ;
console.log(today)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    limit: ['一周内', '一个月内', '3个月内'],
    // 时间控件开始

    isPickerRender: false,
    isPickerShow: false,
    startTime: today,
    endTime: today,
    pickerConfig: {
      endDate: false,
      column: "",
      dateLimit: true,
      initStartTime: today,
      initEndTime: today,
      limitStartTime: "2010-01-01  00:00",
      limitEndTime: app.returnTodayInfo().yearData +"-12-31  23:59",
      hideInput: true,
    }
     // 时间控件结束
  },
  pickerShow: function (e) {
    console.log(118,e)
    let curIndex = e.currentTarget.dataset.index;
    
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true,
      curIndex
    });
  },
  pickerHide: function () {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  bindPickerChange: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    console.log(this.data.sensorList);

    this.getData(this.data.sensorList[e.detail.value].id);
    this.setData({
    });
  },
  setPickerTime: function (val) {
    let startTime = this.data.startTime;
    let endTime = this.data.endTime;

    if (this.data.curIndex==0){
      startTime=val.detail.startTime.substring(0, 11)
    }else{

      endTime = val.detail.startTime.substring(0, 11)

    }

    if (startTime > endTime) {
      wx.showToast({
        icon: "none",
        title: "开始时间不能在结束时间之后"
      });
      return;
    }
    console.log(startTime, endTime, startTime<=endTime)
    this.setData({
      startTime,
      endTime,
      curId:''
    });
  },
  limitFn(e){
    console.log(e,83)
    let id=e.target.dataset.id;
    let startTime = this.data.startTime;

    var nowdate = new Date();
    if (id==0){
      nowdate = new Date(nowdate - 7 * 24 * 3600 * 1000);
    }else if(id==1){
      nowdate.setMonth(nowdate.getMonth() - 1);
    } else if (id == 2) {
      nowdate.setMonth(nowdate.getMonth() - 3);
    }

    startTime=this.returnstartDay(nowdate)
    this.setData({
      startTime,
      curId:id
    })
  },
  returnstartDay(nowdate){
    var y = nowdate.getFullYear();
    var m = nowdate.getMonth() + 1;
    var d = nowdate.getDate();
    m = app.formatDate(m);
    d = app.formatDate(d);
    return y + '-' + m + '-' + d
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
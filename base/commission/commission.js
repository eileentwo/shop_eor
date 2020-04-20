// base/commission/commission.js
const app = getApp();
let uid=app.globalData.uid;
var today = app.returnTodayInfo().yearData + '-' + app.returnTodayInfo().monthDataRel + '-' + app.returnTodayInfo().dayData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    page:1, length:10,
    ani:'',
    ani1:'',
    showBox: false, 
    showTitle: "积分规则", 
    showContent: "单笔订单消费金额每满0元，奖励null积分",
    filterName:'全部',
    // 时间控件开始

    isPickerRender: false,
    isPickerShow: false,
    startTime: app.returnTodayInfo().yearData + '-' + app.returnTodayInfo().monthDataRel + '-01' ,
    endTime: today,
    pickerConfig: {
      endDate: false,
      column: "second",
      dateLimit: true,
      initStartTime: today,
      initEndTime: today,
      limitStartTime: "1990-01-01",
      limitEndTime: today
    },
     // 时间控件结束
     commission:[],
  },

  showFilterFn() {//显示筛选条件图层
    console.log('showFilter')
    this.setData({
      isPickerShow: true,
    })
  },
  pickerShow: function () {
    console.log(118)
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
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
    // let startDate = util.formatTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7));
    // let endDate = util.formatTime(new Date());
    this.setData({
      index: e.detail.value,
      sensorId: this.data.sensorList[e.detail.value].id
      // startDate,
      // endDate
    });
  },
  setPickerTime: function (val) {
    let startTime = val.detail.startTime.substring(0, 11);
    let endTime = val.detail.endTime.substring(0, 11);

    this.setData({
      startTime,
      endTime
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    uid = app.globalData.uid;
    this.setData({
      integral_num: options.integral
    })
    this.getCommission(1);
  },
  getCommission(page){
    let that=this;
    app.api.IntegralList({
      uid,page,length:that.data.length,
    }).then((res) => {
      console.log(res, 'IntegralList')
      that.setData({
        commission:res.data.data
      })
    }).catch((res) => {
      app.tips(res.msg);
    });
  },
  seletFn(e){//筛选
  console.log(e)
    let id = e.target.dataset.id;
    let filtername = e.target.dataset.filtername;
    this.setData({
      filterName: filtername,
    })
    this.hideFilter()
  },
  showBox(){
    this.setData({
      showBox:true
    })
  },
  hideBox() {
    this.setData({
      showBox: false
    })
  },
  showFilterBox(e) {
    let arr = app.animation(10, 0, 0, 1000, 0, 0);
    this.setData({
      ani: arr.animation.export(),
      ani1: arr.animation1.export(),
    })
  },
  hideFilter(e) {
    console.log(e,36)
    let arr = app.animation(20, 300, '9999px', 1000, 0, '9999px');
    
    this.setData({
      ani: arr.animation.export(),
      ani1: arr.animation1.export(),
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
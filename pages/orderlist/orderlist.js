// base/orderlist/orderlist.js
const app = getApp();
var now = new Date();
var yearData = now.getFullYear(); //得到年份
var monthData = now.getMonth();//得到月份
var monthDataRel = now.getMonth()+1;//得到月份
var dayData = now.getDate();//得到日期
var today=yearData+'-'+ monthDataRel +'-'+ dayData;
let uid=app.globalData.uid;
let common = require('../../zhy/resource/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    isA:true,//滚动加载开关
    page:1,
    status:'all',
    orderList:[],
    siteroot: '',
    showFilter:false,//是否显示条件筛选
    orderstatus:["全部","待订单审核","待财务审核","待出库审核","待发货确认","待收货确认","已完成","已作废"],
    paystatus:["全部","未付款","部分付款","付款待审核","已付款"],
    paymethods:["全部","代下单","自主下单"],
    orderstatusindex:0,
    paystatusindex:0,
    paymethodsindex:0,
     // 时间控件开始
    
    isPickerRender: false,
    isPickerShow: false,
    startTime:"",
    endTime: "",
    pickerConfig: {
      endDate: false,
      column: "second",
      dateLimit: true,
      initStartTime: today,
      initEndTime: today,
      limitStartTime: "1990-01-01",
      limitEndTime: today
    }
     // 时间控件结束
  },
  showFilterFn(){//显示筛选条件图层
    this.setData({
      showFilter:true,
    })
  },
  hideFilter(){//隐藏筛选条件图层
    this.setData({
      showFilter:false,
    })
  },
  // 确定提交筛选条件
  submitindex(){
    //console.log(this.data.orderstatusindex,this.data.paystatusindex,this.data.paymethodsindex,this.data.startTime,this.data.endTime)
    this.setData({
      showFilter:false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  orderList(page){
    
    let that = this;
    app.api.OrderList({ 
      page,
      length:10,
      status: this.data.status,
      uid
    }).then(res => {
      let orderList = [];
      //console.log(res.data.orderList.data.length)
      let isA = res.data.orderList.data.length == 10?true:false;
      if (page > 1) {
        orderList = that.data.orderList;
      }
      //console.log(82, page, isA, res.data.orderList.data.length == 10, res.data.orderList.data.length)
      if (res.data.orderList.data && res.data.orderList.data.length>0){
        let temp=res.data.orderList.data;
        for (let i = 0, l = temp.length;i<l;i++){
          temp[i].pay_money = temp[i].pay_money.split('.');
          orderList.push(temp[i])
        }       

      }

      that.setData({
        orderList, isA, page,
        siteroot: app.siteroot(res.other.imgroot)
      })
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  pullUpLoad(e) {//触底加载分页
    let dir = e.detail.direction;
    let page = this.data.page;
    let isA = this.data.isA;
    //console.log(e, 104444, dir, isA)
    if (dir == "bottom" && isA) {
      page++;
      this.orderList(page);
    }
  },
  toOrderDetail(e){
    let order_id = e.currentTarget.dataset.order_id;
    // let order_status = e.currentTarget.dataset.order_status;
    // if (order_status==5){
    //   return;
    // }
    app.navTo("/base/goodsorderinfo/goodsorderinfo?order_id=" + order_id)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log(this.selectComponent("#picker"))
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkUid();
    uid=app.globalData.uid;
    this.orderList(1);
    app.toTop();
    // this.getTabBar().setData({
    //   selected: 2
    // })
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

  },
  
  catchtouchmove(){//防止穿透
    return false;
  },
  changeindex(e){
    let currentindex=e.currentTarget.dataset.currentindex;
    let index=e.currentTarget.dataset.index;
    if(currentindex==0){
      this.setData({orderstatusindex:index})
    }
    if(currentindex==1){
      this.setData({paystatusindex:index})
    }
    if(currentindex==2){
      this.setData({paymethodsindex:index})
    }
  },
  resetPicker(){
    this.setData({   
      orderstatusindex:0,
      paystatusindex:0,
      paymethodsindex:0,
      startTime:'',
      endTime:''
    })
  },
  pickerShow: function() {
    //console.log(118)
    this.setData({
      isPickerShow: true,
      isPickerRender: true,
      chartHide: true
    });
  },
  pickerHide: function() {
    this.setData({
      isPickerShow: false,
      chartHide: false
    });
  },

  bindPickerChange: function(e) {
    //console.log("picker发送选择改变，携带值为", e.detail.value);
    //console.log(this.data.sensorList);

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
  setPickerTime: function(val) {
    let startTime=val.detail.startTime.substring(0,11);
    let endTime=val.detail.endTime.substring(0,11);
    
    this.setData({
      startTime,
      endTime
    });
  },
  cancelFn(e) {//取消订单
    let order_id = e.currentTarget.dataset.order_id;

    common.modal('确定取消订单?', order_id,this,'list');
  },
  toReceiving(e) {//确认收货
    let order_id = e.currentTarget.dataset.order_id;
    common.modal('确认收货?', order_id, this, 'list');
  },
  deleteFn(e) {//删除订单
    let order_id = e.currentTarget.dataset.order_id;
    common.modal('确定删除订单?', order_id, this, 'list');
  },
  changeData(e) {
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    let toView=0;
    if(index>2){
      toView =id * 1 * 120
    }
    this.setData({
        status: index, toView
    })
    this.orderList(1)
  },
  toEvaluate(e) {
    //console.log(e, 340, 'toEvaluate')
    let order_id = e.currentTarget.dataset.order_id;
    app.navTo("/base/comment/comment?order_id=" + order_id)
  },

})
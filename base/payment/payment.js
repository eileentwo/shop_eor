// base/payment/payment.js
const app=getApp();
let uid=app.globalData.uid;
let common = require('../../zhy/resource/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    siteroot: '',
    address:[],
    totalCost:0,
    cart_list:'',
    order_sku_info:'',
    leavemessage:'',//备注
    buyer_invoice: '',//	发票
    pick_up_id: '',//自提点
    coupons:[],
    coupon_ids:[],
    showMask:false,
    deliver_price:0,
    integral:0,//积分
    order_id:0,
    showMask1:false,//显示支付
    buttonName:'确认支付',
    choosePay: {
      type: [{
        name: '微信支付',
        pic: "/zhy/resource/images/pay/wx.png",
      }
      //   ,
      // {
      //   name: '余额支付',
      //   pic: "/zhy/resource/images/pay/local.png",
      // },
      ],
      curr: 1,
      alert: false,
      coupon_price:0,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    uid = app.globalData.uid;
    if (options.sku){      
      this.getData1(options.sku);
    } else {
      this.getData(options.cart_ids);
    }

    let address = wx.getStorageSync('address');
    let integral = wx.getStorageSync('integral_num');

    if (address.id) {
      this.setData({
        address, integral
      })
    }
  },
  getData1(order_sku_info){
    let that=this;
    app.api.BuyCheckInfo({ 
      order_sku_info,
      uid
    }).then(res => {
      if (res.data.list.length > 0) {
        let orderData = res.data.list;

        let siteroot = app.siteroot(res.other.imgroot);
        that.setData({
          orderData, order_sku_info, siteroot
        })
        that.setPrice();
      }
      }).then(res =>{
      that.expressCompany();
      }).catch(res => {
      app.tips(res.msg);
    })
  },
  getData(cart_ids){//获取商品信息
    let that=this;
    app.api.CartOrder({ cart_ids, uid }).then(res => {
      //console.log(res, 'cartOrder', res.code)
      if (res.data) {
        let orderData=res.data;

        let siteroot = app.siteroot(res.other.imgroot);
        that.setData({
          orderData, siteroot
        })

        that.setPrice();
      }
    }).then((res)=>{
      that.expressCompany();
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  setPrice() {
    let orderData = this.data.orderData;
    let totalCost = 0;
    
    for (let i in orderData) {
      if (orderData[i].wholesaler_price) {
        totalCost += orderData[i].num * orderData[i].wholesaler_price
      }else{

        totalCost += orderData[i].num * orderData[i].price
      }
      if (orderData[i].mansong_money > 0) {
        totalCost -= orderData[i].mansong_money 
      }
    }

    let deliver_price = this.data.deliver_price;//判断运费
    if (deliver_price > 0) {
      totalCost = (totalCost * 1 + deliver_price).toFixed(2)
    }
    let price1 = this.data.price1 ? this.data.price1:0;//设置优惠金额
    let coupon_price = 0;
    //console.log(price1,totalCost,124444)
    if (parseFloat(price1) > parseFloat(totalCost)) {
      coupon_price = totalCost;
      totalCost = 0;
    } else {
      coupon_price = price1;
      totalCost = (totalCost * 1 - price1 * 1).toFixed(2);
    }
    //console.log(totalCost,12222)
    this.setData({
      coupon_price, totalCost
    })
  },
  returnCarlist(){
    let orderData = this.data.orderData;
    let cart_list = "";
    for (let k in orderData) {
      if(orderData[k].cart_id){
        cart_list += orderData[k].cart_id + ","
      }else
      {
        cart_list  =   ","
      }
    }
    return cart_list.substring(0, cart_list.length - 1)
  },
  getCouponsData() {
    let orderData = this.data.orderData;
    let param = {
      uid,
      cart_list: this.returnCarlist(),
      sku_info: this.data.order_sku_info
    }
    let that = this;

    app.api.UseCoupon(param).then(res => {
      //console.log(res.data, 'useCoupon')
      if (res.data) {
        let coupons = res.data;
        let coupon_ids=that.data.coupon_ids;
        for (let i in coupons) {          
          coupons[i].start_time = coupons[i].start_time.substring(0, 10);
          coupons[i].end_time = coupons[i].end_time.substring(0, 10);

          coupons[i].price = coupons[i].money;
          coupons[i].money = coupons[i].money.split(".");
          if (coupons[i].coupon_id == coupon_ids) {//1.判断是否已经用过了
            coupons[i].canuse = 1;
            } else{
            coupons[i].canuse = 0;
            coupons[i].status = 1;
            }  
        }
        that.setData({
          coupons
        })
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  expressCompany(){//获取物流信息
    let that=this;
    let address = this.data.address;
    if (!address.id){
      return
    }
    
    app.api.ExpressCompany().then(res => {
      // //console.log(res, 'ExpressCompany')
      if (res.data) {
        let express=res.data;
        let expressopion=[];
        for (let i in express){
          expressopion.push(express[i].company_name)
        }
        that.setData({
          express,expressopion        ,
        })
        // //console.log(express[0].co_id,171111111)
        that.getDeliverPrice(express[0].co_id);

      }
    }).catch(res => {
      app.tips(res.msg);
    })
  }, 
  bindRegionChange(e){
    let val=e.detail.value;
    let id = this.data.express[val].co_id;
    this.getDeliverPrice(id);
   this.setData({
     index: this.data.expressopion[val]
   })
  },
  getDeliverPrice(id) {//计算运费
    let address = this.data.address;
    let that=this;
   
   
    let param={
      goods_sku_list: this.returnSku(), 
      shipping_company_id:id, 
      province_id: address.province, 
      city_id: address.city, 
      district_id: address.district,
      address:address.address
    }
    app.api.GetDeliverPrice(param).then(res => {
      //console.log(res.data, 'getDeliverPrice')
      if (res.data) {
        let deliver_price = res.data.deliver_price;      
        that.setData({
          deliver_price, express_company_id: id, noAddress:false
        })
        that.setPrice();
      }
    }).catch(res => {
      if(res.code=='-1'){
        app.tips('不在配送范围！');

      }
      that.setData({
        noAddress:true
      })
    })
  },
  returnSku(){

    let goods_sku_list = '';
    let orderData = this.data.orderData;

    for (let i in orderData) {
      goods_sku_list += orderData[i].sku_id +':'+ orderData[i].num + ','
    }
    return goods_sku_list.substring(0, goods_sku_list.length - 1)

  },
  toAddress(){
    wx.navigateTo({
      url: '/base/address/address?getAddress=1',
    })
  },

  changemsg(e) {//备注信息 
  // //console.log(e,148)
    this.setData({
      leavemessage:e.detail.value
    })
  },
  submitFn(){
    let that=this;    
    let orderData=this.data.orderData;
    let order_id = this.data.order_id;
    let express_company_id = this.data.express_company_id;
    let totalIntegral=0;
    let integral = this.data.integral;
    if (order_id != 0) {
      that.toggleAlertPay(); 
      return;
    }
    if(this.data.address.length==0){
      app.tips('请选择收货地址')
      return
    }
    if (this.data.noAddress){
      return
    }
    for(let i in orderData){
      totalIntegral = totalIntegral * 1 + orderData[i].point_exchange_type>0? parseFloat(orderData[i].point_exchange) * orderData[i].num:0;
      if (orderData[i].num > orderData[i].stock){
        app.tips('库存不足！');
        return;
      } else if (orderData[i].min_buy>0&&orderData[i].num <orderData[i].min_buy){
        app.tips('低于最低购买数量!');
        return;
      } else if (orderData[i].max_buy>0&&orderData[i].num > orderData[i].max_buy) {
        app.tips('超过最高购买数量!');
        return;
      }
    }

    if (integral <totalIntegral){
      app.tips('您的积分不足!');
      return;
    }else{
      integral = integral * 1 - totalIntegral;
      wx.setStorageSync('integral_num', integral)
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    app.api.SetOrder({
      cart_list: this.returnCarlist(),
      order_sku_info: this.data.order_sku_info,
      express_company_id: express_company_id,
      leavemessage: this.data.leavemessage,
      buyer_invoice: this.data.buyer_invoice,
      pick_up_id: this.data.pick_up_id,
      use_coupon:this.data.coupon_ids,
      address_id: this.data.address.id,
      uid,
      integral: totalIntegral,
    }).then(res => {
      //console.log(res.data, 'setOrder')
      if (res.data) {
        if(that.data.totalCost>0){
          that.toggleAlertPay();   
        }  else{
          app.tips('免单成功');
          let timer = setTimeout(function () {
            app.reTo("/base/goodsorderinfo/goodsorderinfo?order_id=" + res.data.order_id)
            clearTimeout(timer)
          }, 1000)
        }
        that.setData({
          order_id: res.data.order_id, 
        })
      }
      wx.hideLoading();
    }).catch(res => {
      app.tips(res.msg);
      wx.hideLoading();
    })
  },
  hidePay(){//隐藏确定支付
    this.setData({
      showMask1:false
    })
  },
  toggleAlertPay() {
    this.setData({
      ['choosePay.alert']: !this.data.choosePay.alert
    })
  },
  onBuyMoneyTab(e) {
    this.setData({
      formId: e.detail.formId
    })
    let key = this.data.choosePay.curr - 0;
    if (key === 1) { // 微信支付
      this.payNow();
    } else { // 余额支付
      this.onBalancePay();
    }
  },
  payNow(){//调用支付接口    
    let that=this;
    common.payment(that,this.data.order_id,'payment');    
  },
  showCouponTap(e){//显示隐藏选择优惠券
    this.getCouponsData();
    this.setData({
      showMask: true
    })
  },
  hideCouponTap() {
    this.setData({
      showMask: false
    }) },
  nouseFn() {//不使用优惠券
    let totalCost = this.data.totalCost;
    let coupon_price = this.data.coupon_price;
    let coupon_ids = this.data.coupon_ids;
    if (coupon_price>0){
      totalCost = totalCost * 1 + coupon_price*1;
      coupon_price=0;
      coupon_ids="";
    }
    this.setData({
      coupon_ids, coupon_price, totalCost, showMask: false,price1:0
    })
  },
  useFn(e) {//选择优惠券
    let item=e.detail.item;
    let price1 = item.price;
    let coupon_ids = item.coupon_id;
    this.setData({
      showMask: false, coupon_ids, price1
    })

    this.setPrice();
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
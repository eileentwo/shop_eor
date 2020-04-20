// base/orders/orders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[

      {
        years: 2020,
        order: [
          {
            month: 1,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          },
          {
            month: 2,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          }, {
            month: 3,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          }
        ]
      },
      {years:2019,
        order: [
          { 
          month: 1,
          type1: {title: "订货",num:0,unit:'笔'},
          type2:{money:'2000',  num: 1,},          
          },
          {
            month:2,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          }, {
            month: 3,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          },
          {
            month: 4,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          },
          {
            month: 5,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          }, {
            month: 6,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          },
          {
            month: 7,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          },
          {
            month: 8,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          }, {
            month: 9,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          },
          {
            month: 10,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          },
          {
            month: 11,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          }, {
            month: 12,
            type1: {money:'2000', num: 1, },
            type2: { money:'2000',  num: 1, },
          },
        ]
      },

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orders=this.data.orders;
    for(let i=0,l=orders.length;i<l;i++){
      orders[i].order = orders[i].order.reverse();
    }
    this.setData({
      orders
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
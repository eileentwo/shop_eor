// base/recent/recent.js
let common = require('../../zhy/resource/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkstate: false,
    goodsList: {
      isA: true,
      arr: [{
          id: '001',
          pic: '../../zhy/resource/images/img/5.jpg',
          title: "瑞士Lindt瑞士莲",
          pirce: '100',
          stock: '100',
          unit: '件',
          num: 0,
          standards: {}
        },
        {
          id: '002',
          pic: '../../zhy/resource/images/img/5.jpg',
          title: "瑞士Lindt瑞士莲特级排装70%可可黑巧克力",
          pirce: '200',
          stock: '100',
          unit: '件',
          num: 0,
          standards: [{
            secid: '1001',
            pic: '../../zhy/resource/images/img/5.jpg',
            title: "瑞士莲",
            pirce: '120',
            stock: '100',
            unit: '件',
            num: 0
          }, {
            secid: '1002',
            pic: '../../zhy/resource/images/img/5.jpg',
            title: "瑞士Lindt",
            pirce: '110',
            stock: '100',
            unit: '件',
            num: 0
          }, {
            secid: '1003',
            pic: '../../zhy/resource/images/img/5.jpg',
            title: "瑞士Lindt瑞士莲",
            pirce: '100',
            stock: '100',
            unit: '件',
            num: 0
          }]
        },
        {
          id: '001',
          pic: '../../zhy/resource/images/img/5.jpg',
          title: "瑞士Lindt瑞士莲",
          pirce: '100',
          stock: '100',
          unit: '件',
          num: 0,
          standards: {}
        },
        {
          id: '002',
          pic: '../../zhy/resource/images/img/5.jpg',
          title: "瑞士Lindt瑞士莲特级排装70%可可黑巧克力",
          pirce: '200',
          stock: '100',
          unit: '件',
          num: 0,
          standards: [{
            secid: '1001',
            pic: '../../zhy/resource/images/img/5.jpg',
            title: "瑞士莲",
            pirce: '120',
            stock: '100',
            unit: '件',
            num: 0
          }, {
            secid: '1002',
            pic: '../../zhy/resource/images/img/5.jpg',
            title: "瑞士Lindt",
            pirce: '110',
            stock: '100',
            unit: '件',
            num: 0
          }, {
            secid: '1003',
            pic: '../../zhy/resource/images/img/5.jpg',
            title: "瑞士Lindt瑞士莲",
            pirce: '100',
            stock: '100',
            unit: '件',
            num: 0
          }]
        },
      ]
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.getWholesalerInfo(this);
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
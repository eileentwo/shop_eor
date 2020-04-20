// base/collect/collect.js
const app = getApp();
let uid = app.globalData.uid;
let common = require('../../zhy/resource/js/common.js');
app.Base({

  /**
   * 页面的初始数据
   */
  data: {
    checkstate: false,
    isIphoneX: app.globalData.isIphoneX,
    collectData: [],
    isA: true,
    page: 1,
    length: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    uid = app.globalData.uid;
  },
  getListData(page) {
    let that = this;
    app.api.CollectGoodsList({
      uid,
      page,
      length: this.data.length
    }).then(res => {
      let collectData = [];
      let isA = res.data && res.data.length == 10 ? true : false;
      if (page > 1) {
        collectData = this.data.collectData
      }
      if (res.data.length > 0) {
        let temp = res.data;
        for (let i = 0, l = temp.length; i < l; i++) {
          if (temp[i].goods_id) {
            temp[i].description = temp[i].description.replace(/<[^<>]+>/g, ""); //去标签
            temp[i].collected = true;
            temp[i] = common.setPrice(temp[i]);
            collectData.push(temp[i]);
            console.log(collectData)
          }
        }
      }
      let siteroot = app.siteroot(res.other.imgroot);
      that.setData({
        collectData,
        isA,
        page,
        siteroot
      })
    }).catch(res => {
      app.tips(res);
    })
  },
  collectFn(e) {
    console.log(e, 38)
    let goods_id = e.detail.goods_id;
    let that = this;
    app.api.CollectGoods({
      uid,
      goods_id: goods_id,
      type: 2
    }).then(res => {
      console.log(res, 'CollectGoods')
      app.tips(res.msg);
      that.getListData(1)
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  pullUpLoad(e) { //触底加载分页
    // console.log(e,104444)
    let dir = e.detail.direction;
    let page = this.data.page;
    let isA = this.data.isA;
    if (dir == "bottom" && isA) {
      page++;
      this.getListData(page);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    common.getWholesalerInfo(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
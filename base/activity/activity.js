// base/activity/activity.js
const app = getApp();
let uid = app.globalData.uid;
let common = require('../../zhy/resource/js/common.js');
app.Base({

  /**
   * 页面的初始数据
   */
  data: {
    isA:false,
    page:1,
    length: 10,
    status:1,
    search_text:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(1)
  },
  getData(page ){
    let that = this;
    app.api.MansongList({
      page,
      length: this.data.length
    }).then(res => {
      let dataList = [];
      let temp = res.data.data;
      let isA = temp && temp.length == 10 ? true : false;
      if (page > 1) {
        dataList = this.data.dataList
      }
      if (temp.length > 0) {
        for (let i = 0, l = temp.length; i < l; i++) {
          let now = app.returnTodayInfo(temp[i].end_time)
          temp[i].end_time = now.yearData + '年' + now.monthDataRel + '月' + now.dayData+'日';
          dataList.push(temp[i]);
          console.log(dataList)
        }
      }

      that.setData({
        dataList,
        isA,
        page
      })
    }).catch(res => {
      app.tips(res);
    })
  },
  pullUpLoad(e) {//触底加载分页
    console.log(e, 104444)
    let dir = e.detail.direction;
    let page = this.data.page;
    let isA = this.data.isA;
    if (dir == "bottom" && isA) {
      page++;
      this.orderList(page);
    }
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
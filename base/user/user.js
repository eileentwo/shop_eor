// base/user/user.js
// AccountInfo (账号管理)
const app = getApp();
app.Base({
  /**
   * 页面的初始数据
   */
  data: {
    footText:"退出",
    changedValue:''
  },
  showBoxFn(e){
    let title=e.currentTarget.dataset.title;
    let index = e.currentTarget.dataset.index;
    
    this.setData({
      showBox:true,
      showTitle:title,
      curIndex:index
    })
  },
  changeBtn() {//退出
    app.setGlobalData('', {});
    wx.clearStorageSync();
 
    wx.redirectTo({
      url: '/pages/home/home',
    })
  },
  navigate(e){
    let index=e.currentTarget.dataset.index;
    let old = this.data.userinfo.user_name;
    if(index==1){
      old = this.data.userinfo.user_password;
    }
    app.navTo('/base/userUpdateInfo/userUpdateInfo?value=' + index + '&old=' + old)
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

    let uid = app.globalData.uid;
    this.accountInfo(uid);
    
  },
  accountInfo(uid){
    let param={
      uid
    }
    app.api.AccountInfo(param).then(res => {
      console.log(res)
      let data=res.data;
      if (data.nick_name){

        this.setData({
          userinfo:data
        })
      }

    }).catch(res => {
      app.tips(res.msg);
    })
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
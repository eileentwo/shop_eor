// base/userUpdateInfo/userUpdateInfo.js
// EditAccount(修改用户名 / 密码)
const app = getApp();
app.Base({

  /**
   * 页面的初始数据
   */
  data: {

    new_psw1: '', 
    new_psw2: '', 
    old: '', 
    value:'',
    user_name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let value = options.value;
    let title ='修改用户名称';
    let old1=options.old;
    if(value==1){
      title = '修改密码';
    }
    wx.setNavigationBarTitle({
      title,
    })
    this.setData({
      value, old1
    })
  },
  username(e){
    let val = e.detail.value;
    val = (/^[A-Za-z0-9]+$/i).test(val)?val:'';
    this.setData({
      user_name:val
    })
  },
  password(e) {
    let val = e.detail.value;
    let index = e.currentTarget.dataset.index;
    let new_psw1 = this.data.new_psw1;
    let new_psw2 = this.data.new_psw2;
    let old = this.data.old;
    if(index==0){
      old=val;
    } else if(index==1){
      new_psw1 = val;
    }else{
      new_psw2 = val;
    }

    this.setData({
      new_psw1, new_psw2,old
    })
  },
  savePassBtn(){

    let value = this.data.value;
    let new_psw1 = this.data.new_psw1;
    let new_psw2 = this.data.new_psw2;
    let param = {
      uid:app.globalData.uid,
      type: value * 1 + 1,
      user_name: this.data.user_name
    }
    if (value==0){
      if (this.data.user_name != '') {
        param.user_name = this.data.user_name 
      }else{
        app.tips("请输入用户名");
      }
    }else{
      param.old_psw=this.data.old

      if (new_psw1 == "" || new_psw2 == ""){
        app.tips("请输入正确的新密码");
        return;
      }

      if (new_psw1 != "" && new_psw2 != "" && new_psw1 != new_psw2) {
        app.tips("两次输入的密码不一致")
        return;
      }
      param.new_psw = this.data.new_psw2
    }
    this.editAccount(param)
  },
  editAccount(param) {
    app.api.EditAccount(param).then(res => {
      console.log(res)
      if (res.msg != "") {
        app.tips(res.msg)
        let timer=setTimeout(function(){
          app.reback();
          clearTimeout(timer)
        },1000)
      }

    }).catch(res => {
      app.tips(res.msg);
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
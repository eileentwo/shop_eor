// base/address/address.js
const app = getApp();
let uid = app.globalData.uid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: true,
    showAddress: true,
    history: ['1'],
    userAddress: [], //用户地址列表
    page: 1,
    pageLen: 10,
    isAdd: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    uid = app.globalData.uid;
    if (options.getAddress){
      this.setData({
        getAddress: options.getAddress
      })
    }
  },

  getList(page) {
    let param = {
      uid: uid,
      page: page,
      length: this.data.length
    }
    let that = this;
    app.api.LoginAddressList(param).then(res => {
      if (res.data && res.data.length > 0) {
        let userAddress = that.data.userAddress;

        if (page > 1) {
          for (let i = 0, l = res.data.length; i < l; i++) {
            userAddress.push(res.data[i])
          }
        } else {
          userAddress = res.data
        }
        for (let i = 0, l = userAddress.length; i < l; i++) {
          userAddress[i].address1 = userAddress[i].address_info.replace(/&nbsp;/ig, "") + userAddress[i].address;
          //console.log(455555)
          if (userAddress[i].is_default){
            wx.setStorageSync('address', userAddress[i])
          }
        }

        that.setData({
          userAddress,
          isAdd: res.data.length == 10,
          page
        })
      } else {
        this.setData({
          isAdd: false, page
        })
      }
    }).catch(res => {
      app.tips(res.msg)
    })
  },

  addAddress(e) {
    let item = e.currentTarget.dataset.item;
    app.globalData.tempitem = item;
    let id = item.id ? item.id : '';
    //console.log(item)
    app.navTo('/base/editaddress/editaddress?id=' + id)
  },
  toSearch() {
    this.setData({
      search: false,
      showAddress: false
    })
  },
  changeType(e) { //设置为默认
    let idx = e.currentTarget.dataset.idx;
    let id = e.currentTarget.dataset.id;
    let userAddress = this.data.userAddress;

    for (let k in userAddress) {

      if (idx == 1) {
        if (userAddress[k].id == id) {
          userAddress[k].is_default = true
          wx.setStorageSync('address', userAddress[k])
        } else {
          userAddress[k].is_default = false
        }
      } else {
        if (userAddress[k].id == id) {
          userAddress.splice(k, 1);
        }
        //console.log(userAddress)
      }
    }

    this.actAddress(idx, id)
    this.setData({
      userAddress
    })
  },
  actAddress(type, id) {
    let param = {
      uid:uid,
      type: type,
      id: id
    }
    let that=this;
    app.api.ActAddress(param).then(res => {
      //console.log(res)

      that.getList(1);
    }).catch(res => {
      app.tips(res.msg)
    })
  },
  chooseAddress(e){
    let item=e.currentTarget.dataset.item;
    
    if (this.data.getAddress && this.data.getAddress==1){
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2];
      if (prevPage) {
        //eorder_address start
        prevPage.setData({
          address:item
        })
        prevPage.expressCompany();
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
        //eorder_address end
      }
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
    //console.log(128)
    this.getList(this.data.page);
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
    let isAdd = this.data.isAdd;
    let page = this.data.page;
    if (isAdd) {
      page++
      this.getList(page);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
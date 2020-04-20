// base/companyInfo/companyInfo.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopMask: false,
    infos: [
      // {
      //   infoTitle: '基本信息',
      //   baseInfo: [{
      //     tip: "供应商名称",
      //       val: '',
      //       disable: true,
      //     },
      //     {
      //       tip: "供应商等级",
      //       val: "浙江省温州市龙湾区",
      //       disable: true,
      //     },
      //     {
      //       tip: "供应商类型",
      //       val: "圩镇塘吓产径管理区奥博富塑胶",
      //       disable: false,
      //     },
      //     {
      //       tip: "供应商电话",
      //       val: "518000",
      //       disable: false,
      //     },
      //     {
      //       tip: "电话",
      //       val: "400-998-7255",
      //       disable: false,
      //     },
      //     {
      //       tip: "传真",
      //       val: "0755-86933836",
      //       disable: false,
      //     }
      //   ],

      // },
      /*{
        infoTitle: '财务信息',
        baseInfo: [{
            tip: "发票抬头",
            val: "",
            disable: false,
          },
          {
            tip: "纳税人识别号",
            val: "",
            disable: false,
          },
          {
            tip: "发票地址",
            val: "",
            disable: false,
          },
          {
            tip: "发票电话",
            val: "",
            disable: false,
          },
          {
            tip: "开户名称",
            val: "",
            disable: false,
          },
          {
            tip: "开户银行",
            val: "",
            disable: false,
          },
          {
            tip: "银行账号",
            val: "",
            disable: false,
          }
        ]
      },
      {
        infoTitle: '签约时间',
        baseInfo: [{
            tip: "签约开始时间",
            val: "2015-11-17",
            disable: true,
          },
          {
            tip: "签约结束时间",
            val: "2016-11-17",
            disable: true,
          }
        ]
      }*/
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getShopInfo()
  },
  getShopInfo() {

    let that = this;
    app.api.ShopInfo().then(res => {
      console.log(res, 74)
      if (res.data.base_info) {
        that.setData({
          shopInfo:res.data
        })
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  callPhone(){
    let phone = this.data.shopInfo.base_info.shop_phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
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

  },
  upDate(e) {
    let disable = e.currentTarget.dataset.disable;
    let popTitle = e.currentTarget.dataset.tip;
    let index = e.currentTarget.dataset.index;
    let parentindex = e.currentTarget.dataset.parentindex;
    let val = e.currentTarget.dataset.val;

    if (disable) {
      app.tips(popTitle + '不可更改');
      return;
    }
    this.setData({
      popTitle,
      parentindex,
      curIndex: index,
      showPopMask: true,
      changedValue: val
    })
  },
  inputTarget(e) {
    this.setData({
      changedValue: e.detail.value
    })
  },
  changeNode() {
    let curIndex = this.data.curIndex;
    let changedValue = this.data.changedValue;
    let parentindex = this.data.parentindex;
    let infos = this.data.infos;
    infos[parentindex].baseInfo[curIndex].val = changedValue
    this.setData({
      infos,
      showPopMask: false
    })
  },
  hidePopMask() {
    this.setData({
      showPopMask: false
    })
  },
})
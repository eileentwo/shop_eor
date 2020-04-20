// base/register/register.js
const app=getApp();
let uid =app.globalData.uid;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:'欢迎加入成为我们公司的欢迎加入成为我们公司的欢迎加入成为我们公司的欢迎加入成为我们公司的欢迎加入成为我们公司的欢迎加入成为我们公司的欢迎加入成为我们公司的欢迎加入成为我们公司的。',
    showmore:false,
    region: ['', '', ''],
    salerLevel: [], //批发商等级总信息
    level: [],
    level_id: '',//用户选择的等级id

    phone: '',
    company_name: '',
    link_name: '',
    province: '',
    city: '',
    district: '',
    address: '',
    join_reason: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var text = this.data.text.substring(0, 64) +'...';
    this.getSalerLevel();
    
    this.setData({
      text, showmore: true, cunsum:options.cunsum
    })
  },
  bindRegionChange(e){
    console.log(e.detail.value)
    let region = e.detail.value;
    this.setData({
      region
    })
  }, 
  bindPickerChange: function (e) {//选择批发商等级
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let val = e.detail.value;
    console.log(this.data.salerLevel[val].id)
    this.setData({
      index: val,
      level_id: this.data.salerLevel[val].id
    })
  },
  
  change(e) {
    this.setData({
      phone: e.detail.value,
    })
  },
  change1(e) {
    this.setData({
      company_name: e.detail.value,
    })},
  change2(e) {
    this.setData({
      link_name: e.detail.value,
    })  
  }, 
  change3(e) {
    this.setData({
      address: e.detail.value,
    })
  },
  change4(e) {
    this.setData({
      join_reason: e.detail.value,

    })
  },
  submit(){//提交申请
    let that = this;
    let data=this.data;
    console.log(data,86)
    let param={
      uid: app.globalData.uid,	
      phone: data.phone,
      level_id: data.level_id,
      company_name: data.company_name,
      link_name: data.link_name,
      province: data.region[0],
      city: data.region[1],
      district: data.region[2],
      address: data.address,
      join_reason: data.join_reason
    }
    console.log(param)
    if (param.phone == "" || param.phone.length < 11){
      app.tips("请输入正确的手机号");
      return;
    }
    if (param.company_name == "") {
      app.tips("请输入公司名称");
      return;
    }
    if (param.link_name == "" ) {
      app.tips("请输入联系人");
      return;
    }
    if (param.address == "" ) {
      app.tips("请输入地址");
      return;
    }
    if (param.province=="") {
      app.tips("请选择所属地区");
      return;
    }
    if (param.level_id == "") {
      app.tips("请选择批发商等级");
      return;
    }

    app.api.ApplyWholesaler(param).then(res => {
      console.log(res, 'ApplyWholesaler')
      app.lunchTo("/pages/mine/mine");
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  getSalerLevel() { //获取批发商等级
    let that = this;
    app.api.WholeSalerLevel().then((res) => {
      console.log(res)
      let level = [];
      for (let i = 0, l = res.data.length; i < l; i++) {

        level[i] = res.data[i].role + '----' + '需累计消费达:' + res.data[i].consume+'元';
        
      }

      that.setData({
        salerLevel: res.data,
        level
      })
    }).catch((res) => {
      return;
    });
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
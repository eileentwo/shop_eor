// base/editaddress/editaddress.js
const app = getApp();
var QQMapWX = require('../../zhy/resource/js/qqmap-wx-jssdk.min.js');
// var address_parse = require('../../zhy/resource/js/address_parse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cTitle: '',
    cName: '',
    cNum: '',
    cAddress1: '',
    checked: false,
    showFixed: false, //弹窗
    region: ['', '', ''],
    customItem: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id;
    if (id == "") {
      console.log(id == "", 266)
      wx.setNavigationBarTitle({
        title: '新增收货地址',
      });
      this.setData({
        id
      })
      return;
    }
    let item = app.globalData.tempitem;
    // console.log(item)
    this.setData({
      id,
      cName: item.consigner,
      cNum: item.mobile,
      cAddress1: item.address,
      checked: item.is_default,
      region: item.address_info.split('&nbsp;'),
    })
    app.globalData.tempitem=null;
  },
  changeValueFn(e) {
    let index = e.currentTarget.dataset.index;
    let changeTitle = e.currentTarget.dataset.title;
    let changeValue = e.currentTarget.dataset.value ? e.currentTarget.dataset.value:'';
    this.setData({
      changeIndex: index,
      changeTitle,
      changeValue,
      showFixed: true
    })
  },
  hideFixed() { //隐藏弹窗
    this.setData({
      showFixed: false
    })
  },
  changeInput(e) {
    let value = e.detail.value;
    this.setData({
      changeValue: value
    })
  },
  popupOk() { //确定更改内容

    let idx = this.data.changeIndex;
    let changeValue = this.data.changeValue;
    if (idx == 0) {
      this.data.cTitle = changeValue
    } else if (idx == 1) {
      this.data.cName = changeValue
    } else if (idx == 2) {
      if(this.phone(changeValue)){
        this.data.cNum = changeValue;
      }else{
        app.tips('请输入正确的手机号');
        return
      }
    }
    this.setData({
      cTitle: this.data.cTitle,
      cName: this.data.cName,
      cNum: this.data.cNum,
      showFixed: false
    })
  },
  phone(TEL) {
    var strTemp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    if (strTemp.test(TEL)) {
      return true;
    }
    return false;
  },


  bindRegionChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let region=e.detail.value;   
    this.setData({
      region
    })
  },
  changecAddress(e) {//详细地址
    console.log(e)
    this.setData({
      cAddress1:e.detail.value
    })
  },
  saveAddrBtn(){//保存地址
    let cNum=this.data.cNum;
    let cName=this.data.cName;
    let region=this.data.region;
    let cAddress1=this.data.cAddress1;
    let checked = this.data.checked;
    if(cNum==''){      
      app.tips("手机号码是必选项")
    }
    if(cName== ''){
      app.tips("联系人是必选项")
    }
    if(region[0]==""){
      app.tips("省份为必选项")
    }
    if(region[1]==""){
      app.tips("市级为必选项")
    }
    
    if(cAddress1==""){
      app.tips("详细地址为必选项")
    }
    
    let param={
      uid:app.globalData.uid,
      consigner: cName,
      mobile: cNum,	
      provincename: region[0], 
      cityname: region[1],
      districtname: region[2],
      address: cAddress1,
      is_default: checked?1:0,
    }
    this.addAddress(param);
  },


  addAddress(param) {
    let that = this;
    if (this.data.id !=""){
      param.id=this.data.id
    }
    app.api.EditAddress(param).then(res => {
      app.reback();

      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2]; 
      if (prevPage) {
        //eorder_address start
        prevPage.getList(1)
        //eorder_address end
      }
    }).catch(res => {
      app.tips(res.msg)
    })
  },
  setChecked() { //设为默认地址
    this.setData({
      checked: !this.data.checked
    })
  },
  clearSmart(){//清空智能填写
    this.setData({
      smart:''
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

  },
  getAddress(e) {
    let parse_list = e.detail.val;
    console.log(e, parse_list)
    // let html = '';
    // for (let key in parse_list) {
    //     if (parse_list[key]) {
    //         html += `<p><span class="key">` + key + `</span>:<span class="value">` + parse_list[key] + `</span></p>`
    //     }
    // }
    // $('#value').html(html);

    // $("#province").val(parse_list.provinceCode);
    // $("#city").val(parse_list.cityCode);
    // $("#county").val(parse_list.countyCode);
    // $("#street").val(parse_list.streetCode);

    // getCity($("#province").val(), parse_list)
    // getCounty($("#city").val(), parse_list)
    // getStreet($("#county").val(), parse_list)

  }


})
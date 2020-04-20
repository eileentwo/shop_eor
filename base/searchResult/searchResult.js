// base/searchResult/searchResult.js
const app = getApp();
let uid = app.globalData.uid;
let common = require('../../zhy/resource/js/common.js');
app.Base({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    siteroot:'',
    windowHeight: app.globalData.windowHeight,
    showFilter: false,
    busPos:{},
    goodsList:[],
    isA:false,
    brandList:[],
    group_list:[],
    cidx: 0,
    brand: false,
    olable: false,
    ridx: 0,
    rank: false,
    length: 10,
    page: 1,
    sort_order: '',
    selectGoodsLabelId: '',
    brand_id: '',
    goods_name: '',
    category_id_1: '',
    category_id_2: '',
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.carBox();
    let val = options.searchVal;
    console.log(options)
    this.setData({
      goods_name: val,
      searchVal:val,
    })
    this.getGoodslist(1)
  },
  changeVal(e){
    this.setData({
      searchVal:e.detail.value
    })
  },
  search(){
    if (searchVal ==""){
      app.tips("请输入您要搜索的商品名称");
      return;
    }
    this.setData({
      goods_name: this.data.searchVal
    })
    this.getGoodslist(1)
  },
  clearInput(){
    this.setData({
      searchVal:''
    })
  },
  getGoodslist(page) { //获取商品列表信息

    let that = this;
    let param = {
      uid,
      length: this.data.length,
      page,
      sort_order: this.data.sort_order,
      selectGoodsLabelId: this.data.selectGoodsLabelId,
      brand_id: this.data.brand_id,
      goods_name: this.data.goods_name,
      category_id_1: this.data.category_id_1,
      category_id_2: this.data.category_id_2,
    }
    app.api.Goodslist(param).then(res => {
      let isA = res.data.length == that.data.length?true:false;
      let goodsList=[];
      if(page>1){
        goodsList = that.data.goodsList;
      }
      if (res.data.length > 0) {
        for (let i in res.data) {
          res.data[i].description = res.data[i].description.replace(/<[^<>]+>/g, ""); //去标签
          res.data[i] = common.setPrice(res.data[i])
          goodsList.push(res.data[i])
        }      
      }

      let siteroot = app.siteroot(res.other.imgroot);
      that.setData({
        goodsList, isA, page, siteroot
      })
    }).catch(res => {
      app.tips(res.msg);
    })
  },

  onShowTap(e) { //点击品牌或者标签或者排序
  console.log(e,1911111)
    let index = e.currentTarget.dataset.title;
    let brand = index == 0;
    let olable = index == 1;
    let rank = index == 2;
    console.log(index, this.data.brandList.length)
    this.setData({
      brand,
      rank,
      olable
    })
    
    if (this.data.brandList.length == 0 && index == 0 || this.data.group_list.length == 0 && index == 1) {
      this.getGoodsTypes();
    }
  },
  getGoodsTypes() { //获取商品分类、品牌、标签信息

    console.log('获取商品分类')
    let that = this;
    app.api.GoodsTypes().then(res => {
      console.log(res, 'GoodsTypes', res.data.brand_list)
      if (that.data.brand) {
        that.setData({
          brandList: res.data.brand_list
        })
      } else if (that.data.olable) {

        that.setData({
          group_list: res.data.group_list
        })
      } else {
        that.setData({
          category_list: res.data.category_list
        })
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  selectBrand(e) {
    console.log(e.detail)
    this.setData({
      brand_id: e.detail.brand_id
    })
    this.getGoodslist(1);
  },
  onLable(e) {
    this.setData({
      selectGoodsLabelId: e.detail.selectGoodsLabelId
    })
    this.getGoodslist(1);
  },
  onRankTap(e) {
    this.setData({
      sort_order: e.detail.sort_order
    })
    this.getGoodslist(1);
  },

  hideBrand(e) {
    this.setData({
      brand_id: e.detail.brand_id
    })
  },
  hideLable(e) {
    this.setData({
      selectGoodsLabelId: e.detail.selectGoodsLabelId
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
  pullUpLoad(e) {//触底加载分页
    // console.log(e,104444)
    let dir = e.detail.direction;
    let page = this.data.page;
    let isA = this.data.isA;
    if (dir == "bottom" && isA) {
      page++;
      this.getGoodslist(page);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
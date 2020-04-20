// base/returnsAddGoods/returnsAddGoods.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    movebox:true,//是否为returnsAddGoods页面的弹窗
    showMore:false,//弹窗折叠开关
    showMore1:false,
    arrowdir:0,
    arrowdir1:0,
    onefilter:0,
    goodsList:[{
      id:'1',
      src:'https://oss.dinghuo123.com/images/productImage/8269/708f6120-202c-46e7-a82b-366472b088fd.png@480w_480h.png',
      title:'迪奥（Dior）护肤套装',
      stands:[{
        type1:['水晶','水晶'],
        colors:['水晶1','水晶2','水晶3'],
      }],
      money:198,
      unit:'件'
    }]
    
  },
  filterFn(e){//筛选条件
    let index=e.currentTarget.dataset.index;
    let arrowdir = this.data.arrowdir;
    let arrowdir1 = this.data.arrowdir1;
    if(index==0){
      arrowdir = 0;
      arrowdir1 = 0;
    }
    if (index == 1 ){
      if (arrowdir == 0 || arrowdir == 2 ) {
        arrowdir = 1
        arrowdir1 = 0
      } else if (arrowdir == 1){
        arrowdir =2
      }
    } else if (index == 2) {
      if (arrowdir1 == 0 || arrowdir1 == 2 ) {
        arrowdir1 = 1
        arrowdir = 0
      } else if (arrowdir1 == 1) {
        arrowdir1 = 2
      } 
    }
    this.setData({
      arrowdir, arrowdir1, onefilter:index
    })
  },
  showFilterBox(e) {    
    let arr = app.animation(10, 0, 0, 1000, 0, 0);
    this.setData({
      ani: arr.animation.export(),
      ani1: arr.animation1.export(),
    })
  },
  get_ani1(e){
    let arr = app.animation(20, 1000, '9999px', 1000, 0, '9999px');
    this.setData({
      ani: arr.animation.export(),
      ani1: arr.animation1.export(),
    })
  },
  toggle(e){
    console.log('toggle',e)
    let index=e.currentTarget.dataset.index;
    if(index=='0'){
      this.setData({
        showMore:!this.data.showMore
      })
    }
    else if(index=='1'){
      this.setData({
        showMore1:!this.data.showMore1
      })
    }
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
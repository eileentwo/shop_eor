const app = getApp();
let foot = require('../comFooter/dealfoot.js');
/**
 * banner:(轮播图数据) 数组
 * height: (高度) 数字
 * showSearch: (是否显示搜索) 布尔值
 * searchLink： （搜索链接地址） 字符串
 */
Component({
  properties: {
    nav: {
      type: Object,
      value: [],
      observer(newVal, oldVal) {
        //console.log(newVal)
        let na = foot.dealFootNav(newVal.list, newVal.root,1);
        this._dealData(na);
      }
    },
    height: {
      type: [String, Number],
      value: 340
    },
    showSearch: {
      type: Boolean,
      value: false
    },
    searchLink: {
      type: String,
      value: ''
    }
  },
  data: {

  },
  attached() {
    const user = wx.getStorageSync('zhyshopInfo');
    if (user) {
      this.setData({
        user
      })
    }
  },
  methods: {
    _dealData(data) {
      //console.log(data)
      let navs = data;
      let newNavs = [];
      for (let i = 0; i < navs.length; i += 10) {
        newNavs.push(navs.slice(i, i + 10));
      }
      this.setData({
        na: newNavs
      })
    },
    _onNavTap(e) {  
      //console.log(this.data.na)         
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      let url = '/' + currentPage.route;
      let index = e.currentTarget.dataset.index;
      let idx = e.currentTarget.dataset.idx;
      let urls = this.data.na[index][idx].link;   
      let linkhome = this.data.na[index][idx].linkhome;
      //2019-11-07 ly - start
      let cid = this.data.na[index][idx].cid
      let store_id = this.data.na[index][idx].store_id;
      let id = ''   
      if (cid > 0){
        id = this.data.na[index][idx].cid;      
      }else{
        id = this.data.na[index][idx].typeid ||0;      
      }
      if (urls == '/base/shoplist/shoplist' && cid == 0){
        id = 0
      }     
      if (urls == '/base/merchantsinfo/merchantsinfo') {
        id = store_id
      } 
      //2019-11-07 ly - end
      if ((urls == url || urls == '') && (urls != '/pages/home/home')) {
        return;
      }      
      if (linkhome){
        app.navTo(urls + '?id=' + id + '&linkhome=' + (linkhome ? linkhome: 0));
      }else{
        app.navTo(urls + '?id=' + id);
      }
    },
    onOtherAppTab: function (e) {
      //console.log(e)
      var appId = e.currentTarget.dataset.id;
      var path = e.currentTarget.dataset.path;
      wx.navigateToMiniProgram({
        appId,
        path,
        success(res) {
          //console.log("跳转成功")
          // 打开成功  
        }
      })
    },
    _onSearchTap() {
      app.navTo(this.data.searchLink);
    }
  }
})

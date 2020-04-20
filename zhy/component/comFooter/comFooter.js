// apiIndexSystemSet(系统设置)
// apiIndexNavIcon(底部导航图标)
const app = getApp();
let foot = require('./dealfoot.js');
Component({
  properties: {
    reload: {
      type: Boolean,
      value: false
    },
    sid: {
      type: Number,
      value: 0,
      observer(newVal, oldVal) {}
    },
    keepShow: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        if (newVal) {
          this.setData({
            show: true
          })
        }
      }
    },
  },
  data: {
    show: false,
    isX: false, // 是否未iphone 刘海屏
    color: "#333D44",
    colorh: "#3292ff",
    nav: [
      {
        "types":1,
        "link": "/pages/home/home",
        "txt": "首页",
        "img": "/zhy/resource/images/nav/a.png",
        "imgh": "/zhy/resource/images/nav/ah.png"
      },
      {
        "types":1,
        "link": "/pages/goodslist/goodslist",
        "txt": "商品",
        "img": "/zhy/resource/images/nav/b.png",
        "imgh": "/zhy/resource/images/nav/bh.png"
      },
      {
        "types":1,
        "link": "/pages/orderlist/orderlist",
        "txt": "订单",
        "img": "/zhy/resource/images/nav/c.png",
        "imgh": "/zhy/resource/images/nav/ch.png"
      },
      {
        "types":1,
        "link": "/pages/car/car",
        "txt": "购物车",
        "img": "/zhy/resource/images/nav/d.png",
        "imgh": "/zhy/resource/images/nav/dh.png"
      },
      {
        "types":1,
        "link": "/pages/mine/mine",
        "txt": "我的",
        "img": "/zhy/resource/images/nav/e.png",
        "imgh": "/zhy/resource/images/nav/eh.png"
      }
    ]
  },
  attached() {
    this._getData();
  },
  detached() {},
  ready() {},
  methods: {
    _getData() {
      let _this = this;
      wx.getSystemInfo({
        success(res) {
          if ((res.model).search('iPhone X') != -1 || (res.model).search('iPhone11') != -1) {
            _this.setData({
              isX: true
            })
          }
        }
      })
      /*if (this.data.reload && this.data.isMine) { 
        wx.removeStorageSync('setting');
      }
      let setting = wx.getStorageSync('setting');
      console.log(setting)
      if (!setting) {
        Promise.all([app.api.apiIndexSystemSet(), app.api.apiIndexNavIcon()]).then(res => {
          let nav = foot.dealFootNav(res[1].data, res[1].other.img_root);
          let setting = {
            config: res[0].data,
            nav
          }
          wx.setStorageSync('setting', setting);
          this.triggerEvent('setting', setting);
          wx.setNavigationBarColor({
            frontColor: !setting.config.fontcolor ? '#000000' : setting.config.fontcolor,
            backgroundColor: !setting.config.top_color ? '#ffffff' : setting.config.top_color,
          })
          let sets = {
            ...setting,
            bg: res[0].data.bottom_color ? res[0].data.bottom_color : "#fff",
            color: res[0].data.bottom_fontcolor_a ? res[0].data.bottom_fontcolor_a : '#999',
            colorh: res[0].data.bottom_fontcolor_b ? res[0].data.bottom_fontcolor_b : '#FEAF64',
          }
          this.setData(sets);
          this.checkChoose();
        }).catch(res => {
          app.tips(res.msg);
        })
      } else {
        this.setData({
          nav: setting.nav,
          bg: setting.config.bottom_color ? setting.config.bottom_color : "#fff",
          color: setting.config.bottom_fontcolor_a ? setting.config.bottom_fontcolor_a : '#999',
          colorh: setting.config.bottom_fontcolor_b ? setting.config.bottom_fontcolor_b : '#FEAF64',
        })
        this.triggerEvent('setting', setting);
        this.checkChoose();
      }*/
      this.setData({
        bg:'#ffffff',
      })
      // this.triggerEvent('setting', setting);
      this.checkChoose();
    },
    checkChoose() {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      let url = '/' + currentPage.route;
      for (let i in this.data.nav) {
        if (this.data.nav[i].link == url) {
          console.log(this.data.nav[i])
          this.setData({
            [`nav[${i}].choose`]: true,
            show: true
          })
          if (this.data.isX) {
            this.triggerEvent('padding', 160);
          } else {
            this.triggerEvent('padding', 120);
          }
        }
      }
    },
    _onNavTab(e) {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      let url = '/' + currentPage.route;
      let idx = e.currentTarget.dataset.index;
      let urls = this.data.nav[idx].link;
      let id = this.data.nav[idx].typeid;
      if (urls == url || urls == '') {
        return;
      }
  
      // if (urls == '/pages/mine/mine'){
      //   wx.removeStorageSync('setting');
      //   this.setData({isMine:true})
      // }
      wx.reLaunch({
        url: urls + '?id=' + id
      })
    },
    _jumpSuccess(e) {}
  }
})
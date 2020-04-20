const app = getApp();
/**
 */
Component({
  properties: {
    show: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        setTimeout(() => {
          this._delShow(newVal);
        }, 80)
      }
    },
    padding: {
      type: [Number, String],
      value: 60,
      observer(newVal, oldVal) {
      }
    },
  },
  data: {
    share: false,
    serve: false,
    home: false,
    newPage: false,
  },
  attached() { //组件生命周期函数-在组件实例进入页面节点树时执行)
    var pages = getCurrentPages();
    var nowPage = pages[pages.length - 1].route;
    var prevPage = pages[pages.length - 2];
    this.setData({
      nowPage
    })
    if (prevPage == undefined) {
      this.setData({
        newPage: true
      })
    }
    const user = wx.getStorageSync('zhyshopInfo');
    if (user) {
      this.setData({
        user
      })
    }
  },
  methods: {
    _delShow(arr) {
      for (let i in arr) {
        if (arr[i] == 1) {
          this.setData({
            share: true
          })
        } else if (arr[i] == 2) {
          this.setData({
            serve: true
          })
        } else if (arr[i] == 3) {
          this.setData({
            home: true
          })
        }
      }
      let nav = wx.getStorageSync('setting').nav;
      if (nav) {
        let navs = JSON.stringify(nav);
        if ((navs).search('/pages/home/home') != -1 && (navs).search(this.data.nowPage) != -1) {
          this.setData({
            home: false
          })
        }

      }
    },
    _onHomeTap() {
      app.lunchTo('/pages/home/home');
    },
    _thankServe(e) {
      return;
    }
  }
})
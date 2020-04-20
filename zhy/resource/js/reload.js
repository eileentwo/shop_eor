const app = getApp();
import {
  UrlData,
  ColorData,
  NavsetData,
  gps
} from './api.js';
const data = {
  show: false,
  ajax: false, // 是否有请求还未完成
  reload: true, // 是否重新加载页面
  padding: 0,
  list: {
    load: false,
    over: false,
    page: 1,
    length: 10,
    none: false,
    data: []
  },
};
const reload = {
  checkLogin(cb, root) { // 判断是否登录
    var uInfo = wx.getStorageSync('zhyshopInfo');
    if (uInfo) {
      cb && cb(uInfo)
    } else {
      wx.showModal({
        title: '提示',
        content: '您未登录，请先登录！',
        success(res) {
          if (res.confirm) {
            if (!root) root = '/pages/home/home';
            let url = encodeURIComponent(root);
            app.reTo("/pages/login/login?id=" + url);
          } else if (res.cancel) {
            app.lunchTo('/pages/home/home');
          }
        }
      })
    }
  },
  dealList(res, page) {
    if (page == 1) {
      this.setData({
        list: {
          load: false,
          over: false,
          page: 1,
          length: 10,
          none: false,
          data: []
        }
      })
    }
    let data = this.data.list.data.concat(res);
    if (res.length < this.data.list.length) {
      this.setData({
        [`list.over`]: true
      })
    }
    if (data.length === 0) {
      this.setData({
        [`list.none`]: true
      })
    }
    this.setData({
      [`list.load`]: false,
      [`list.page`]: ++this.data.list.page,
      [`list.data`]: data
    })
  },
  toReload() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      reload: true
    })
  },
  getPadding(e) {
    this.setData({
      padding: e.detail
    })
  },
  // onUnload() {
  //   let pages = getCurrentPages();
  //   let currentPage = pages[pages.length - 1];
  //   let url = currentPage.route;
  //   wx.setStorageSync('backUrl', url);
  // }
}
module.exports = {
  data,
  reload
}
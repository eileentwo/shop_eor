const app = getApp();
let foot = require('../comFooter/dealfoot.js');
/**
 * banner:(轮播图数据) 数组
 * height: (高度) 数字
 * showSearch: (是否显示搜索) 布尔值
 * searchLink： （搜索链接地址） 字符串
 */
Component({
  properties: { //组件的对外属性，是属性名到属性设置的映射表
    banner: { // 属性名
      type: Object, // 属性的类型（必填）
      value: { // 属性的初值
        list: [],
        root: ''
      },
      observer(newVal, oldVal) { //组件数据字段监听器，用于监听 properties 和 data 的变化
        let ban = foot.dealFootNav(newVal.list, newVal.root,1);
        this.setData({
          ban
        })
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
  methods: { //组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用
    _onNavTap(e) { //下划线开头为私有方法
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      let url = '/' + currentPage.route;
      let idx = e.currentTarget.dataset.index;
      let urls = this.data.ban[idx].link;
      if (!urls) return; 
      let id = this.data.ban[idx].typeid;
      if (urls == url || urls == '') {
        return;
      }
      app.navTo(urls + '?id=' + id);
    },
    _onSearchTap() { //下划线开头为私有方法
      app.navTo(this.data.searchLink);
    }
  }
})
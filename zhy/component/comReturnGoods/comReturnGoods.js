// zhy/component/comReturnGoods/comReturnGoods.js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: {
      type: Object
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    _showFilterBox(e) {
      let item=e.currentTarget.dataset.item;
      let arr = app.animation(10, 0, '0', 1000, 0, '0',true,true);
      this.setData({
        ani: arr.animation.export(),
        ani1: arr.animation1.export(),
        showItem:item
      })
    },
    _hideFilterBox(){
      let arr = app.animation(20, 1000, '999px', 1000, 0, '999px',true,true);
      this.setData({
        ani: arr.animation.export(),
        ani1: arr.animation1.export(),
      })
    }
  }
})

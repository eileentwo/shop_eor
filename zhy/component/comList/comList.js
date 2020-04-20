// zhy/component/comList.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: {
      type: Object
    },
    busPos: {
      type: Object
    },
    fromList: {
      type: Boolean
    },
    isA: {
      type: Boolean
    },
    isA1: {
      type: Boolean
    },
    isB: {
      type: Boolean
    },
    isC: {
      type: Boolean
    },
    isBig: {
      type: Boolean
    },
    collected: {
      type: Boolean
    },
    discount: {
      type: Boolean
    },
    totalcost: {
      type: Number
    }, totalnum: {
      type: Number
    },
    checkstate:{
      type: Boolean
    },
    siteroot: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    mask: false,
    totalcost:0,
    hide_good_box: true, //是否隐藏小球
    uid:app.globalData.uid,
  },
  //组件生命周期函数-在组件布局完成后执行
  ready() {
    // 购物车的位置 （根据实际情况做调整）
    // let timer1 = setTimeout(() => {
    //   this.busPos = this.properties.busPos;
    //   clearTimeout(timer1)
    // }, 1000)
    console.log(this.properties.checkstate)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _toGoodsDetail(e) { //跳转到商品详情
      let id = e.currentTarget.dataset.id;
      let goods_name = e.currentTarget.dataset.goods_name;
      app.checkUid();
      app.navTo('/base/goodsdetail/goodsdetail?goods_id=' + id + '&goods_name=' + goods_name)
      
    },
    _changeNum(e) {
      let isAdd = e.target.dataset.isadd;
      let cur = e.currentTarget.dataset.cur;
      let goods_id = e.currentTarget.dataset.goods_id ;
      this.triggerEvent('changeNum', { cur, goods_id, isAdd });
      
    },
    _collectFn(e) {
      let goods_id = e.currentTarget.dataset.goods_id;
      this.triggerEvent('collectFn', { goods_id });
    }
  }
})
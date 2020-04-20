const app = getApp();
/**
 */
Component({
  properties: {
    coupons:{type: Array},
    getcoupon:{type:Boolean}
  },
  data: {
  },
  
  methods: {
    _useFn(e) {
      let item = e.currentTarget.dataset.item;
      this.triggerEvent("useFn", { item: item })
    },
    _toggle(e){
      let index=e.currentTarget.dataset.index;
      let item=this.properties.coupons[index];
      item.showMore=!item.showMore;
      this.setData({
        coupons:this.properties.coupons
      })
      this.triggerEvent("couponschange", {item:item})
    }
  }
})
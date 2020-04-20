// yzxc_sun/pages/common/SecStar/SecStar.js
Component({
  properties: {
    imgh: { // 选中星星图片地址
      type: String,
      value: '',
      observer(newVal, oldVal, changedPath) {}
    },
    img: { // 未选中星星图片地址
      type: String,
      value: '',
      observer(newVal, oldVal, changedPath) {}
    },
    width: { // 每个星星大小
      type: Number,
      value: 30,
      observer(newVal, oldVal, changedPath) {}
    },
    num: { // 当前星星数量
      type: Number,
      value: 5,
      observer(newVal, oldVal, changedPath) {}
    },
    change: { // 是否可以改变星星
      type: Boolean,
      value: false,
      observer(newVal, oldVal, changedPath) {}
    },
    param: { // 多传的参数直接返回给原本
      type: [Object, Number, String, Boolean],
    }
  },
  methods: {
    _onChangeTab(e) {
      if (this.data.change) {
        let idx = e.currentTarget.dataset.idx - 0;
        this.setData({
          num: idx
        })
        if (this.data.param === null || !this.data.param) {
          this.triggerEvent('watch', idx); //e.detail 返回当前星星数量
        } else {
          this.triggerEvent('watch', {
            idx,
            param: this.data.param
          }); //e.detail 返回当前星星数量
        }
      }
    }
  }
})
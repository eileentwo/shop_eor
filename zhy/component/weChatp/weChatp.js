const app = getApp();
/**
 *
 * 
 * 
 * 
 */
Component({
  properties: {
    'iswechats':{
      type: Boolean,
      value: false
    },
    'gzsset':{
      type: Object,
      value: {}
    }
  },
  data: {
    gzerweimas: false,
  },

  methods: {
    // 立即关注点击
    gztapss() {
      this.setData({
        gzerweimas: !this.data.gzerweimas
      })
    },
  }
})

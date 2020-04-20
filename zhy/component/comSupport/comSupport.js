const app = getApp();
Component({
  properties: {
    info: {
      type: Object,
      value: {},
      observer(newVal, oldVal) {
      }
    },
    root: {
      type: String,
      value: '',
      observer(newVal, oldVal) {
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _onCallTab() {
      wx.makePhoneCall({
        phoneNumber: this.data.info.jszc_tel
      })
    }
  }
})

/**
 * bind:getAddress 获取地图地址经纬度
 * btn 设置按钮样式
 */
Component({
  properties: {
    disabled: {
      type: Boolean,
      value: false
    },
  },
  externalClasses: ['btn'],
  data: {
    gps: false
  },
  attached() {
    let _this = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        let lat = res.latitude
        let lng = res.longitude
        _this.setData({
          gps: true
        })
      },
      fail(res) {
        _this.setData({
          gps: false
        })
      }
    })
  },
  methods: {
    onAddressTap() {
      let _this = this;
      wx.chooseLocation({
        success(res) {
          _this.triggerEvent('getaddress', res);
        }
      })
    },
    getAddress(res) {
      if (!res.detail.authSetting["scope.userLocation"]) {
        this.setData({
          gps: false
        })
      } else {
        this.setData({
          gps: true
        })
        this.onAddressTap();
      }
    },
  }
})
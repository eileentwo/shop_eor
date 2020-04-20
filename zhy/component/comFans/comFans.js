const app = getApp();
Component({
  properties: {

  },
  data: {
    info: {
      is_show: 0,
    },
    fansMask: false,
    has_auth: true,
  },
  attached() {
    var _this = this;
    app.api.apiCommonWelfaregroupSet().then(res => {
      const user = wx.getStorageSync('zhyshopInfo');
      if (user) {
        this.setData({
          user
        })
      }
      this.setData({
        imgRoot: res.other.img_root,
        info: res.data,
      })
    }).catch(res => {app.tips(res.msg)})
  },
  methods: {
    toggleFans() {
      this.setData({
        fansMask: !this.data.fansMask
      })
    },
    getAuth(e) {
      if (e.detail.authSetting['scope.writePhotosAlbum']) {
        this.setData({
          has_auth: true
        })
        this.saveQrTap();
      } else {
        this.setData({
          has_auth: false
        })
      }
    },
    saveQrTap() {
      let _this = this;
      let root = this.data.imgRoot + this.data.info.group_qrcode;
      if (!this.data.has_auth) {
        wx.getImageInfo({
          src: root,
          success(ret) {
            let path = ret.path;
            wx.saveImageToPhotosAlbum({
              filePath: path,
              success(res) {
                app.tips('图片已经保存到您的手机相册！');
                _this.toggleFans();
              },
              fail(res) {
                console.log(res)
              }
            })
          }
        })
      } else {
        wx.getImageInfo({
          src: root,
          success(ret) {
            let path = ret.path;
            wx.saveImageToPhotosAlbum({
              filePath: path,
              success(res) {
                app.tips('图片已经保存到您的手机相册！');
                _this.toggleFans();
              },
              fail(res) {
                console.log(res);
                if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
                  _this.setData({
                    has_auth: false
                  })
                }
              }
            })
          }
        })
      }
    }
  }
})
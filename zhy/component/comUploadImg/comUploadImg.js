const app = getApp();
Component({
  properties: {
    imgArr: {
      type: Array,
      value: [],
      observer(newVal, oldVal, changedPath) {
        this.setData({
          count: this.data.maxCount - newVal.length
        })
      }
    },
    prevent: {
      type: Boolean,
      value: false
    },
    maxCount: {
      type: Number
    },
    title: {
      type: String
    },
    imglink: {
      type: String
    },
    param: { // 多传的参数直接返回给原本不传的话不返回这个
      type: [Object, Number, String, Boolean],
      value: null
    }
  },
  data: {
  },
  ready() {
  },
  methods: {
    _addImg() {
      //console.log('_this.data.param', this.data.param)
      let _this = this;
      if (_this.data.count <= 0) {
        wx.showToast({
          title: '最多只能上传' + _this.data.maxCount + '张图片',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      wx.chooseImage({
        count: _this.data.count,
        success(res) {
          let tempFilePaths = res.tempFilePaths;
          let url = app.siteInfo.siteroot + '?shop_id=' + app.siteInfo.uniacid+'&s=/eorder/Order/uploadPic';
          for (let i in tempFilePaths) {
            wx.uploadFile({
              url,
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {
                'path': tempFilePaths[i]
              },
              success(res) {
                let data = JSON.parse(res.data);
                _this.setData({
                  imglink: res.other.imgroot
                })
                if (!data.code) {
                  let newArr = _this.data.imgArr.concat(data.data);
                  _this.setData({
                    imgArr: newArr
                  })
                  if (_this.data.param === null) {
                    _this.triggerEvent('getarr', _this.data.imgArr);
                  } else {
                    _this.triggerEvent('getarr', { img: _this.data.imgArr, param: _this.data.param});
                  }

                } else {
                  app.tips('上传失败！请重新上传')
                }
              },
              fail(res) {
                app.tips('上传失败！请重新上传')
              }
            })
          }
        }
      })
    },
    _onDelTab(e) {
      let idx = e.currentTarget.dataset.idx;
      this.data.imgArr.splice(idx, 1);
      this.setData({
        imgArr: this.data.imgArr
      })
      if (this.data.param === null) {
        this.triggerEvent('getarr', this.data.imgArr);
      } else {
        this.triggerEvent('getarr', { img: this.data.imgArr, param: this.data.param });
      }
    }
  }
})



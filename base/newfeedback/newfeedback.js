// base/newfeedback/newfeedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    footText: "发送",
    feedText: {
      feedbackCont: "",
      filePickerVal: []
    }
  },
  changeCont(e) {
    let feedText = this.data.feedText
    feedText.feedbackCont=e.detail.value
  },
  changeBtn(e) {//发送
    console.log(e, this.data.feedText)
  },
  filePicker() { // 图片获取
    let that = this;
    wx.chooseMessageFile({
      count: 5,
      type: 'image',
      success: res => {
        console.log(103333, res)

        const imgList = res.tempFiles; // 上传的图片数据

        const imageList = that.data.feedText.filePickerVal; // 原始的图片数据
      
        let imageLenght = imageList.length; // 原来的图片数量

        let nowLenght = imgList.length; // 当前的图片数量

        if (imageLenght == 5) {
          wx.showToast({
            title: "数量已经有5张，请删除在添加...",
          })
        }
        
        if (imageLenght < 5) {

          // 获取缺少的图片张数
          let residue = 5 - imageLenght;
          // 如果缺少的张数大于当前的的张数  
          if (residue >= nowLenght) {
            // 直接将两个数组合并为一个  
            that.data.feedText.filePickerVal = imageList.concat(imgList);
          } else {
            // 否则截取当前的数组一部分  
            that.data.feedText.filePickerVal = imageList.concat(imgList.slice(0, residue));
          }
          
          that.setData({
            feedText: that.data.feedText
          })

        }
      }
    })

  },
  // 删除图片
  deleteImage(event) {
    console.log(event)
    //获取数据绑定的data-id的数据
    const nowIndex = event.currentTarget.dataset.index;
    this.data.feedText.filePickerVal.splice(nowIndex, 1);
    this.setData({
      feedText: this.data.feedText
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
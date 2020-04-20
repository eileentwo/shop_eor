// zhy/component/comShowBox/comshowBox.js
Component({
  externalClasses: ['popup-content1'],
  /**
   * 组件的属性列表
   */
  properties: {
    showContent:{
      type:String
    },
    showTitle: {
      type: String
    },
    showBox: {
      type: Boolean
    },
    showChange: {
      type: Boolean
    },
    showBtns:{
      type: Boolean
    },
    changedValue: {
      type: String
    },
    isNum:{
      type: Boolean
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
    _hideBox(){
      this.setData({
        showBox:false
      })
    },
    _popupok(){
      this.triggerEvent("popupok")
    },
    _inputTarget(e) {
      this.triggerEvent("inputTarget",e.detail)
    },
  }
})

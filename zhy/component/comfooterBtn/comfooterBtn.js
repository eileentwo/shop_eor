// zhy/component/comfooterBtn/comfooterBtn.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isGreen:{
      type:Boolean,
    },
    footText:{
      type:String
    },
    isBgGreen: {
      type: Boolean,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _changeBtn(e){
      this.triggerEvent('changeBtn', { ob: ''})
    }
  }
})

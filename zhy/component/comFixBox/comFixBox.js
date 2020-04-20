// zhy/component/comFixBox/comFixBox.js
const app = getApp()
Component({
  options: {
    multipleSlots: true
  },
  externalClasses: ['dirmask'],
  /**
   * 组件的属性列表
   */
  properties: {
    ani: {
      type: Object
    },
    ani1: {
      type: Object
    },
    movebox: {
      type: Boolean
    }
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
    _showFilterBox() {
      this.triggerEvent("showFilterBox", {})
    },
    _hideFilterBox() {
      this.triggerEvent("hideFilterBox", {})

    },
  }
})
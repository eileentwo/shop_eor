// 购物车下单专用
import { VantComponent } from '../common/component';
VantComponent({
  field: true,
  classes: ['node-class'],
  props: {
    checked: Boolean,
    loading: Boolean,
    disabled: Boolean,
    activeColor: String,
    inactiveColor: String,
    size: {
      type: String,
      value: '30px'
    },
    index: { // 下标
      type: [String,Number]
    },
    status: { // 对应的购物币或者积分的开启状态
      type: [String, Number]
    },
    type: { // 积分还是购物币 1 积分 2 购物币
      type: [String, Number]
    },
    num: { // 积分或者购物币的数量
      type: [String, Number]
    },
    selfStatus: { // 当前自己开启的状态
      type: [String, Number]
    },
    selfNum: { // 当前商品抵用所需积分或者购物币
      type: [String, Number]
    },
  },
  watch: {
    checked: function checked(value) {
      this.set({
        value: value
      });
    }
  },
  created: function created() {
    this.set({
      value: this.data.checked
    });
  },
  methods: {
    onClick: function onClick() {
      if (this.data.type == 1 && this.data.num <= 0 && !this.data.selfStatus){
        // wx.showToast({
        //   title: '积分不足',
        //   icon: 'none',
        //   duration: 1500
        // })
        return false;
      }
      if (this.data.type == 2 && this.data.num <= 0 && !this.data.selfStatus) {
        // wx.showToast({
        //   title: '购物币不足',
        //   icon: 'none',
        //   duration: 1500
        // })
        return false;
      }
      if (this.data.selfNum == 0 && !this.data.selfStatus) {
        return false;
      }
      if (this.data.status) {
        wx.showToast({
          title: '同一商家购物币和积分无法同时使用，请先全关闭再重新选择',
          icon: 'none',
          duration: 1500
        })
        return false;
      }
      if (!this.data.disabled && !this.data.loading) {
        var checked = !this.data.checked;
        var json = {
          index: this.data.index,
          checked
        }
        this.$emit('input', json);
        this.$emit('change', json);
      }
    }
  }
});
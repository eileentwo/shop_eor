// zhy/component/comfiters/comfilters.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    brand:{
      type:Boolean
    },
    rank: {
      type: Boolean
    },
    olable: {
      type: Boolean
    },
    brandList: {
      type: Object
    },
    group_list:{
      type:Object
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

    
    _hideBrand(e) { //重置品牌
      let brandList = this.returnHideData(this.data.brandList);
      console.log(brandList,39)
      this.setData({
        brand: false,
        brandList,
        brand_id: ''
      })
      this.triggerEvent('hideBrand', { brand_id:'' })

    },
    returnHideData(brandList) {
      for (let i = 0, len = brandList.length; i < len; i++) {
        if (brandList[i].isChecked) {
          brandList[i].isChecked = false
        }
      }
      return brandList
    },
    _hideLable() { //重置标签
      let group_list = this.returnHideData(this.data.group_list);

      this.setData({
        olable: false,
        group_list,
        selectGoodsLabelId: ''
      })
      this.triggerEvent('hideLable', { selectGoodsLabelId :''})
    },
    _onBrandTap(e) { //点击品牌
      console.log(e, 'onBrandTap')
      let idx = e.currentTarget.dataset.idx;
      let brandList = this.data.brandList;
      brandList = this.returnData(brandList, idx)
      this.setData({
        brandList
      })
    },
    _selectBrand() { //搜索品牌
      let brandList = this.data.brandList;
      let brand_id = this.returnStr(brandList, 0); //brand_id
      brand_id = brand_id.substring(0, brand_id.length-1)
      this.setData({
        brand: false,
        brand_id,
      })
      // this.getGoodslist(1);
      this.triggerEvent('selectBrand', { brand_id })
    },
    returnData(data, idx) {
      for (let i = 0, l = data.length; i < l; i++) {
        if (i == idx) {
          if (data[i].isChecked) {
            data[i].isChecked = false
          } else {
            data[i].isChecked = true
          }
        }
      }
      return data
    },
    returnStr(data, idx) {
      let str = "";
      for (let i = 0, l = data.length; i < l; i++) {
        if (data[i].isChecked) {
          console.log(data[i])
          if (idx == 1) {
            str += data[i].group_id + ','
          } else {
            str += data[i].brand_id + ','
          }
        }
      }
      console.log(str, 156)
      return str
    },
    _onLableTap(e) { //点击标签
      console.log(e, 'onBrandTap')
      let index = e.currentTarget.dataset.index;
      let group_list = this.data.group_list;
      group_list = this.returnData(group_list, index)
      this.setData({
        group_list
      })
    },
    _onLable() { //点击搜索标签
      let group_list = this.data.group_list;
      let selectGoodsLabelId = this.returnStr(group_list, 1);

      selectGoodsLabelId = selectGoodsLabelId.substring(0, selectGoodsLabelId.length - 1)
      this.setData({
        olable: false,
        selectGoodsLabelId
      })
      // this.getGoodslist(1);
      this.triggerEvent('onLable', { selectGoodsLabelId })
    },
    _onRankTap(e) { //排序
      console.log(e, 'onRankTap')
      let ridx = e.currentTarget.dataset.ridx;


      this.setData({
        rank: !this.data.rank,
        sort_order: ridx
      })
      // this.getGoodslist(1);
      this.triggerEvent('onRankTap', { sort_order: ridx})
    },
  }
})

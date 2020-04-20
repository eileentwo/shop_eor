// base/goodslist/goodslist.js
const app = getApp();
let uid = app.globalData.uid;
let common = require('../../zhy/resource/js/common.js');
Page({
  data: {
    isIphoneX: app.globalData.isIphoneX,
    isToSearch: true,
    cidx: 0,
    brand: false,
    olable: false,
    ridx: 0,
    rank: false,
    siteroot: '',
    checkstate:false,
    goodsList: [],
    page: 1,
    length: 10,
    sort_order: '',
    selectGoodsLabelId: '',
    brand_id: '',
    goods_name: '',
    category_id_1: '',
    category_id_2: '',
    brandList: [], //品牌组
    group_list: [], //标签组
    productquick: false, //下单button
    totalcost: 0, //购物车总价
    totalnum: 0,
    isA: true,
    mask: false,
    totalList:[],//快捷购物车
    showType:false,//是否展示临时购物车里的内容
    isReduce:false,
  },
  onLoad: function(o) {

  },
  tosearch() {
    app.checkUid();
    app.navTo("/base/selection/selection")
  },
  toDetail(e) { //查看商品详情
    // //console.log(e)
    let goods_id = e.currentTarget.dataset.goods_id;
    let goods_name = e.currentTarget.dataset.goods_name;
    app.navTo("/base/goodsdetail/goodsdetail?goods_id=" + goods_id + '&goods_name=' + goods_name)
  },

  getListData(page) { //获取商品列表信息

    let that = this;
    let param = {
      uid,
      length: this.data.length,
      page,
      sort_order: this.data.sort_order,
      selectGoodsLabelId: this.data.selectGoodsLabelId,
      brand_id: this.data.brand_id,
      goods_name: this.data.goods_name,
      category_id_1: this.data.category_id_1,
      category_id_2: this.data.category_id_2,
    }
    //console.log(param)
    app.api.Goodslist(param).then(res => {
      console.log(res.data,'goodslist')
      let isA = res.data.length == 10 ? true : false;
      let goodsList = [];
      if (page > 1) {
        goodsList = this.data.goodsList
      }
      let temp = common.setHomeGoodList(res.data, true);
      // console.log(goodsList,temp,7444)
      if (temp.length > 0) {
        for (let i in temp) {
          goodsList.push(temp[i])
        }
      }

      that.setData({
        goodsList,
        isA,
        page,
        siteroot: app.siteroot(res.other.imgroot)
      })
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  onShow: function () {
    app.checkUid();
    
    uid = app.globalData.uid;
    if(uid){
      this.getGoodsTypes();
      common.getWholesalerInfo(this);
    }
  },
  pullUpLoad(e) { //触底加载分页
    // //console.log(e,104444)
    let dir = e.detail.direction;
    let page = this.data.page;
    let isA = this.data.isA;
    if (dir == "bottom" && isA) {
      page++;
      this.getListData(page);
    }
  },
  onReachBottom: function() {},

  onShareAppMessage: function() {

  },
  onCategoryTap(e) { //左侧筛选
    let cidx = e.currentTarget.dataset.cidx;
    let group_id = e.currentTarget.dataset.group_id;
    this.setData({
      cidx,
      selectGoodsLabelId: group_id
    })
    this.getListData(1);
  },
  onShowTap(e) { //点击品牌或者标签或者排序
    let index = e.currentTarget.dataset.index;
    let brand = index == 0;
    let olable = index == 1;
    let rank = index == 2;
    //console.log(brand)
    this.setData({
      brand,
      rank,
      olable
    })

    if (this.data.brandList.length == 0 && index == 0 || this.data.group_list.length == 0 && index == 1) {
      this.getGoodsTypes();
    }
  },
  getGoodsTypes() { //获取商品分类、品牌、标签信息

    let that = this;
    app.api.GoodsTypes().then(res => {
      //console.log(res, 'GoodsTypes', res.data.brand_list)
      if (that.data.brand) {
        that.setData({
          brandList: res.data.brand_list
        })
      } 
      // if (that.data.olable) 
      else {

        that.setData({
          group_list: res.data.group_list
        })
      } 
      // else {
      //   that.setData({
      //     category_list: res.data.category_list
      //   })
      // }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  selectBrand(e) {
    this.setData({
      brand_id: e.detail.brand_id
    })
    this.getListData(1);
  },
  onLable(e) {
    this.setData({
      selectGoodsLabelId: e.detail.selectGoodsLabelId
    })
    this.getListData(1);
  },
  onRankTap(e) {
    this.setData({
      sort_order: e.detail.sort_order
    })
    this.getListData(1);
  },
  hideBrand(e) {
    this.setData({
      brand_id: e.detail.brand_id
    })
  },
  hideLable(e) {
    this.setData({
      selectGoodsLabelId: e.detail.selectGoodsLabelId
    })
  },
  
  inputTarget(e) {//直接改变数量
    //console.log(e)
    let changedNum=(e.detail.value).replace(/[^0-9]/g, '');
    this.setData({
      changedNum,
    })
  },
  popupok() { //确定直接改变数量
    //console.log('popupok')
    
    let goodsList = this.data.goodsList;
    let changedNum=this.data.changedNum;
    let cur=this.data.cur;
    if(goodsList[cur].min_buy>0&&changedNum<goodsList[cur].min_buy){
      app.tips("最低购买量为:"+goodsList[cur].min_buy);
      return
    }
    if(goodsList[cur].max_buy>0&&changedNum>goodsList[cur].max_buy){
      app.tips("限购:"+goodsList[cur].max_buy);
      return
    }
    if(changedNum>goodsList[cur].stock){
      app.tips("目前库存:"+goodsList[cur].stock+',已超过库存量');
      return
    }
    goodsList[cur].num=this.data.changedNum;
    this.toBuy(goodsList[cur]);
    // console.log(goodsList)
    this.setData({
      goodsList,
    })
    this.setData({
      showBox: false
    })
  },
  
  changeNum(e) {
    //console.log(e, 'changenum')
    let tmp = e.detail;
    let goodsList = this.data.goodsList;
    let isAdd = tmp.isAdd;
    let goods_id = tmp.goods_id;
    let cur = tmp.cur;

    if (isAdd == 0) {
      return
    }
    if (isAdd == 1) {
      this.reduceNum(cur);
      return;
    }
    if (isAdd == 2) {//直接更改数量
      this.setData({
        showBox:true,cur,cur_id:goods_id,changedNum:goodsList[cur].num
      })
      return;
    }
    if (isAdd == 3) {
      this.addNum(cur);
      return;
    }
    if (cur == 'a1') { //多规格      
      this.showFilter(goodsList, goods_id )
    }
  },
  showFilter(goodsList, goods_id  ){
    let showItem = {};
    let attrChoiced=this.data.attrChoiced || [];
    for (let i in goodsList) {
      if (goodsList[i].goods_id == goods_id) {
        showItem = goodsList[i];
        for(let j in showItem.goods_spec_format){
          showItem.goods_spec_format[j].status=false
          for(let k in showItem.goods_spec_format[j].value){
            showItem.goods_spec_format[j].value[k].status=false
          }
        }
      }
    }
    if(attrChoiced.goods_id!=showItem.goods_id){
      attrChoiced=[]
    }
    this.setData({
      mask:true,
      showItem,
      attrChoiced,
      attrChoicedPic:showItem.pic_cover_mid,
    })
  },
  onCloseTap() {
    this.setData({
      mask:false
    })
  },
  onCloseShowType() {
    this.setData({
      showType: false
    })
  },
  onAddCarTap(){//多规格选择加入购物车
    let goodsList=this.data.goodsList;
    let showItem=this.data.showItem;
    let attrChoiced=this.data.attrChoiced;
    if(showItem.length>0&&attrChoiced.length==0){
      app.tips('请选择规格');
      return;
    }
    if(showItem.num==0){
      app.tips('数量不能为0')
      return
    }
    this.toBuy(showItem)
    this.setData({
      mask:false
    })
  },
  addNum1(){
    let attrChoiced = this.data.attrChoiced;
    let showItem=this.data.showItem;
    //如果是多规格的 但是还没选规格就点击了添加键
    if (showItem.goods_spec_format && showItem.goods_spec_format.length > 0) {
      if (showItem.goods_spec_format.length > 0 && attrChoiced.length == 0) {
        app.tips('请先选择规格！');
        return
      }
      //多规格库存不足
      if (showItem.num + 1 > attrChoiced.stock) {
        app.tips('达可购买量上限！');

        return
      }
    }
    showItem.num ++;
    this.setData({
      showItem
    })
  },
  reduceNum1(){
    let showItem=this.data.showItem;
    if (showItem.min_buy > 0 && showItem.num - 1 < showItem.min_buy) {
      app.tips("商品数量不能少于" + showItem.min_buy);
      showItem.num = showItem.min_buy
    } else if (showItem.num - 1<=0) {
      showItem.num = 0
    } else {
      showItem.num = showItem.num - 1
    }
    this.setData({
      showItem
    })
  },
  //减商品数量
  reduceNum: function(cur) {
    let goodsList = this.data.goodsList;
    // let attrChoiced = this.data.attrChoiced;
    if (goodsList[cur].min_buy > 0 && goodsList[cur].num - 1 < goodsList[cur].min_buy) {
      app.tips("商品数量不能少于" + goodsList[cur].min_buy);
      goodsList[cur].num = goodsList[cur].min_buy
    } else if (goodsList[cur].num - 1<=0) {
      goodsList[cur].num = 0
    } else {
      goodsList[cur].num = goodsList[cur].num - 1;
    }
    this.setData({
      goodsList
    })
    if (goodsList[cur].num>0){


      this.updateCartNumGoods(goodsList[cur]);
    }
   
    // this.toBuy(goodsList[cur])
  },
  updateCartNumGoods(item){
    let param = {
      uid,
      goods_id: item.goods_id,	
      sku_id: item.sku_list[0].sku_id,
    }
    let that = this;
    app.api.UpdateCartNumGoods(param).then(res => {
      console.log(res,'updateCartNumGoods')
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  //添加商品数量
  addNum: function(cur) {
    let goodsList = this.data.goodsList;
    
    //单规格库存不足

    if ((goodsList[cur].num + 1) - 0 > (goodsList[cur].stock) - 0) {
      app.tips('商品可购买量上限');

      return
    }

    //购买数量大于限购数量的时候 最大只能达到限购的值    
    if (goodsList[cur].max_buy && (goodsList[cur].num - goodsList[cur].max_buy) == 0) {
      app.tips('达可购买量上限！');
      this.setData({
        goodsList
      })
      return;
    }
    if (goodsList[cur].min_buy && goodsList[cur].num < goodsList[cur].min_buy) { //购买数量小于限购数量的时候 
      goodsList[cur].num = goodsList[cur].min_buy
    } else {
      goodsList[cur].num++;
    }
    this.setData({
      goodsList,
    })
    this.toBuy(goodsList[cur])
  },
  _collectFn(e) { //取消收藏
    this.triggerEvent('collectFn', {
      goods_id: e.currentTarget.dataset.goods_id
    });
  },
  toBuy(item){
     let param = {
      uid,
      cart_detail: JSON.stringify(this.setTemp(item)),
    }
    let that = this;
    app.api.AddCart(param).then(res => {
      //console.log(res, 'AddCart')
     
      if (res.msg == "加入购物车成功") {
        // let totalList=[];
        // that.setTotal(totalList);
       
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  /*aa(item) {
    let attrChoiced = this.data.attrChoiced ||[];
    let check_state=app.globalData.check_state;
    
    var temp = {};
    if(attrChoiced.goods_id){
      
      temp.goods_id = attrChoiced.goods_id;
      temp.goods_name = item.goods_name;
      temp.count = attrChoiced.num;
      temp.sku_id = attrChoiced.sku_id;
      temp.sku_name = attrChoiced.sku_name;
      temp.picture_id = this.data.pic_id;
      if(item.promotion_type==2){
        temp.price =check_state==2?attrChoiced.wholesaler_price:attrChoiced.promote_price; 
        temp.cost = temp.price* item.num;
      }else{
        temp.price=check_state==2?item.wholesaler_price:item.price; 
        temp.cost = temp.price* item.num;
      }
    }  else{        
      
      temp.goods_id = item.goods_id;
      temp.goods_name = item.goods_name;
      temp.count = item.num;
      temp.sku_id = item.sku_id;
      temp.sku_name = item.sku_name;
      temp.picture_id = this.data.pic_id;
      if(item.promotion_type==2){
        temp.price =check_state==2?item.wholesaler_price:item.promote_price; 
        temp.cost = temp.price* item.num;
      }else{
        temp.price=check_state==2?item.wholesaler_price:item.price; 
        temp.cost = temp.price* item.num;
      }
    }
    return JSON.stringify(temp);
  },*/

  setTemp(item) {
    let attrChoiced = this.data.attrChoiced ||[];
    let check_state=app.globalData.check_state;
    let temp ={};
    
    if(attrChoiced.goods_id){
      
      temp.goods_id = attrChoiced.goods_id;
      temp.goods_name = item.goods_name;
      temp.count = attrChoiced.num;
      // temp.num = item.num;
      temp.sku_id = attrChoiced.sku_id;
      temp.sku_name = attrChoiced.sku_name;
      temp.picture_id = this.data.pic_id;
      if(item.promotion_type==2){
        temp.price =check_state==2?attrChoiced.wholesaler_price:attrChoiced.promote_price; 
        temp.cost = temp.price* item.num;
      }else{
        temp.price=check_state==2?item.wholesaler_price:item.price; 
        temp.cost = temp.price* item.num;
      }
    }  else{        
      
      temp.goods_id = item.goods_id;
      temp.goods_name = item.goods_name;
      temp.count = 1;
      // temp.num =  item.num;
      temp.sku_id = item.sku_list[0].sku_id;
      temp.sku_name = item.sku_list[0].sku_name;
      temp.picture_id = item.pic_id;
      if(item.promotion_type==2){
        temp.price =check_state==2?item.wholesaler_price:item.promote_price; 
        temp.cost = temp.price* item.num;
      }else{
        temp.price=check_state==2?item.wholesaler_price:item.price; 
        temp.cost = temp.price* item.num;
      }
    }
    return temp
    // this.settotalList(temp);
  },
  settotalList(temp){   
    let totalList=this.data.totalList ;
   
    if(totalList.length>0){
      for(let j in totalList){
        if(totalList[j].goods_id==temp.goods_id&&totalList[j].sku_id ==temp.sku_id || totalList[j].num==0){          
          totalList.splice(j,1)
        }
      }
    }
    totalList.push(temp)
  
    this.setTotal(totalList)
  },

  setTotal(totalList){
    
    let totalcost = 0;
    let totalnum = 0;
    for(let i in totalList){
      totalnum += totalList[i].num;
      totalcost += totalList[i].num * totalList[i].price;
      if(totalList[i].num==0){
        totalList.splice(i)
      }
    }
    totalcost = totalcost.toFixed(2);
    this.setData({
      totalcost,
      totalnum,
      totalList,
      totaltype:totalList.length,
      attrChoiced:[]
    })
  },
  //点击选择规格
  spTap: function(e) {
    console.log(e);
    const _this = this;
    let idx = e.currentTarget.dataset.idx; //规格的index 比如我有两个选项 颜色和规格 我点中了颜色的第二个黄色 那么idx为1
    let index = e.currentTarget.dataset.index; //规格的第几个 比如我有两个选项 颜色和规格 我点中了规格里面的参数 那么index为1
    
    
    let showItem = _this.data.showItem;
    let attr = showItem.goods_spec_format;
    let count = 0; //选中几个规格
    let group = ''; //存储选中的规格的id
    let choiceName = ''; //存储选中的规格的名称
    let attrChoiced = [];
    let attrChoicedPic = ''; 
    let pic_id = this.data.pic_id;//不同图片的id
    
    if (attr[index].value[idx].spec_value_data>0) {
      pic_id = attr[index].value[idx].spec_value_data;      
      attrChoicedPic = attr[index].value[idx].spec_value_data_src?attr[index].value[idx].spec_value_data_src:'';
      choiceName = attr[index].value[idx].spec_value_name; 
    }
    attr[index].status = true;
    console.log(attr,5496666)
    for (let k in attr[index].value) { //去掉之前选中的
      attr[index].value[k].status = false;
    }

    attr[index].value[idx].status = true; //点击选中规格
    for (let i in attr) { //选中几个规格
      if (attr[i].status == true) {
        count++;
      }
    }

    for (let i in attr) {
      for (let j in attr[i].value) {
        if (attr[i].value[j].status == true) {
          console.log(attr[i].value[j])
          // group += attr[i].value[j].spec_id + ',';
          group += attr[i].value[j].spec_id + ':' + attr[i].value[j].spec_value_id + ';';
        }
      }
    }
    group = group.substring(0, group.length-1);
    
    _this.setData({
      choiceName,
      group,
      pic_id,
      showItem,
    })
    console.log(count,163,attr.length)
    if (attr.length == count) {
      let that = this;
      app.api.GetSpecinfo({
        spec: group,
        goods_id: showItem.goods_id,
        uid
      }).then(res => {
        // app.tips(res.msg);
        console.log(res, 'GetSpecinfo');
        attrChoiced = res.data;
        if (attrChoiced.stock == 0) {
          app.tips('库存不足');
        }
        showItem.num = showItem.min_buy > 0 ? showItem.min_buy : 1;
        console.log(attrChoiced.promote_price , attrChoiced.wholesaler_price)
        showItem.totalprice = showItem.promotion_type == 2 && parseFloat(attrChoiced.promote_price) < parseFloat(attrChoiced.wholesaler_price) ? (attrChoiced.promote_price * showItem.num) : (attrChoiced.wholesaler_price * showItem.num);
      
        that.setData({
          attrChoiced, showItem,
          attrChoicedPic,
        })
      }).catch(res => {
        app.tips(res.msg);
      })
    }

  },
  changeTotalList(e){//删除临时购物车内的东西
    let index=e.currentTarget.dataset.index;
    let goods_id=e.currentTarget.dataset.goods_id;
    let totalList=this.data.totalList;
    let goodsList=this.data.goodsList;
    totalList.splice(index,1);
    for(let i in goodsList){
      if(goodsList[i].goods_id==goods_id){
        goodsList[i].num=0
      }
    }
    let showType=true;
    if(totalList.length==0){
      showType=false;
    }
    this.setData({
      showType,goodsList
    })
    this.setTotal(totalList);
  },  
  showTotalList(){
    this.setData({
      showType:this.data.totalList.length>0
    })
  },
  /*toBuy(){
    let totalList=this.data.totalList;
    if(totalList.length==0){
      return
    }
    let order_sku_info='';
    for(let i in totalList){
      order_sku_info += totalList[i].sku_id + ':' + totalList[i].num +';'
    }
    order_sku_info=order_sku_info.substring(0,order_sku_info.length-1);
    console.log(order_sku_info,64000)
   
    app.navTo("/base/payment/payment?sku="+order_sku_info)
  },*/
})
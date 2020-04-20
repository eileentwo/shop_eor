/*

  GoodsInfo(商品详情)
  GetSpecinfo (获取规格信息)
  
*/

const app = getApp();
var WxParse = require('../../zhy/template/wxParse/wxParse.js'); //富文本编辑器
let uid = app.globalData.uid;
app.Base({
  data: {
    isIphoneX: app.globalData.isIphoneX,
    siteroot: '',
    mask: false,
    is_collect_goods: 0,
    swiperCurrent: 0,
    cur: 0,
    attrChoiced:[],
    attrChoicedPic: '',
    choiceName: '',
    num:1,
    totalprice:0,
    olist:[],//评价列表
    page:1,
    length:10,
    isA:false,
    /*---海报----*/
    share:false,
    posterinfo:{},
    loadImgKey:''
    /*---海报----*/
  },
  onLoad: function (o) {

    app.checkUid();
    uid = app.globalData.uid;
    let integral_num = wx.getStorageSync('integral_num');
    let check_state = app.globalData.check_state;

    let checkstate = false;
    if (check_state == 2 || check_state == 0) {
      checkstate = check_state == 2 ? true : false;

    }
    this.setData({
    
      goods_id: o.goods_id,
      goods_name: o.goods_name,
      integral_num, checkstate
    })

    if (uid) {
      this.getGoodsInfo()
    }else{
      app.lunchTo("/pages/login/login")
    }
  }, 
  onPosterTab() {
    let goodsInfo = this.data.goodsInfo;
    let img = goodsInfo.img_list[0].pic_cover_big;
    if (img== '') {
      app.tips('没有商品封面图,无法生成海报！');
      return;
    }
    this.setData({
      share: false
    })
    wx.showLoading({
      title: '海报生成中...',
    })
    if (this.data.posterUrl) {
      wx.hideLoading()
      wx.previewImage({
        current: this.data.posterUrl,
        urls: [this.data.posterUrl]
      })
    } else {
      let that=this;
      this.setData({
          posterinfo: {
            delRoot: that.data.path,
            bg: '',
            img: that.data.siteroot + img,
            avatar: app.globalData.userinfo.user_headimg,
            qr: that.data.imgroot+'/' + that.data.path,
            title: goodsInfo.goods_name,
            price: that.data.checkstate ? goodsInfo.wholesaler_price : goodsInfo.promotion_type == 2 ? goodsInfo.promotion_price : goodsInfo.price,
            name: app.globalData.userinfo.nick_name,
            hot: goodsInfo.is_hot > 0 ? '销量：' + goodsInfo.real_sales : '',
            is_pic: that.data.posterpic ? that.data.img_root + that.data.posterpic : null,
            recommend: ''
          },
          loadImgKey: true
      })
    }
  },
  createPoster(e) {
    let url = e.detail;
    this.setData({
      posterUrl: url.url
    })
    wx.hideLoading();
    wx.previewImage({
      current: this.data.posterUrl,
      urls: [this.data.posterUrl]
    })
  },
  toggleShare() {
    this.setData({
      share: !this.data.share
    })
  },
  getInfo() {
    let that = this;
    app.api.GoodsInfo({
      uid,
      goods_id: this.data.goods_id
    }).then(res => {
      // app.tips(res.msg);
      console.log(res, 'GoodsInfo')

      let goodsInfo = res.data.info;
      let free_shipping = res.data.free_shipping;
      WxParse.wxParse('detail', 'html', goodsInfo.description, that, 20);
      goodsInfo.mansong_name = goodsInfo.mansong_name.length > 0 ? goodsInfo.mansong_name.substring(0, goodsInfo.mansong_name.length - 2) : '';
      console.log(goodsInfo.mansong_name)
      let num = goodsInfo.min_buy > 0 ? goodsInfo.min_buy : 1;
      let totalprice = goodsInfo.promotion_type == 2&&!this.data.checkstate ? (goodsInfo.promotion_price * num):(goodsInfo.wholesaler_price * num);
      let imgroot = res.other.imgroot;
      let siteroot = app.siteroot(imgroot);
      let img = goodsInfo.img_list[0].pic_cover_big;
 
      that.setData({
        free_shipping,
        goodsInfo,
        num,
        imgroot:imgroot,
        goods_name: goodsInfo.goods_name,
        totalprice: totalprice.toFixed(2),
        is_collect_goods: res.data.is_collect_goods,
        siteroot,
        posterinfo:{
          bg: '',
          img: that.data.siteroot + img,
          avatar: app.globalData.userinfo.user_headimg,
            qr: that.data.imgroot + '/' + that.data.path,
          title: goodsInfo.goods_name,
          price: that.data.checkstate ? goodsInfo.wholesaler_price : goodsInfo.promotion_type == 2 ? goodsInfo.promotion_price : goodsInfo.price,
          name: app.globalData.userinfo.nick_name,
          hot: goodsInfo.is_hot > 0 ? '销量：' + goodsInfo.real_sales : '',
          is_pic: that.data.posterpic ? that.data.img_root + that.data.posterpic : null,
            recommend: ''
          }
      })
      }).catch(res => {
      app.tips(res.msg);
    })
  },
  getCode(){
    let that = this;
    app.api.GetQRCode({
      link: 'base/goodsdetail/goodsdetail?goods_id=' + that.data.goods_id ,
      width: 120
    }).then(res => {
      that.setData({
        path: res.data.path,
        posterinfo:{
          delRoot: that.data.path,
         
        }
      })
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  getGoodsInfo() {
    this.getInfo();this.getCode()
  },
  swiperChange(e) {
    console.log(e, 4)
    this.setData({
      swiperCurrent: e.detail.current,
    })
  },
  chooseFn(e) {
    let index = e.currentTarget.dataset.index;
    let info = this.data.goodsInfo
    if (index == 0) { //点击收藏
      this.setData({
        is_collect_goods: this.data.is_collect_goods != 1 ? 1 : 0
      })

      this.collectGoods(this.data.is_collect_goods)
      return;
    } else if (index == 1) {
      app.lunchTo("/pages/car/car");
      return;
    }
    if (this.data.goodsInfo.stock == 0) {
      app.tips('库存不足')
      return;
    }
    this.setData({
      mask: true,
      chooseIndex: index
    })
  },
  collectGoods(type) { //收藏
    app.api.CollectGoods({
      uid,
      goods_id: this.data.goods_id,
      type
    }).then(res => {
      console.log(res, 'CollectGoods')
      app.tips(res.msg);

    }).catch(res => {
      app.tips(res.msg);
    })
  },
  //点击选择规格
  spTap: function(e) {
    //console.log(e);
    const _this = this;
    let idx = e.currentTarget.dataset.idx; //规格的index 比如我有两个选项 颜色和规格 我点中了颜色的第二个黄色 那么idx为1
    let index = e.currentTarget.dataset.index; //规格的第几个 比如我有两个选项 颜色和规格 我点中了规格里面的参数 那么index为1
    let pic_id = this.data.pic_id; //不同图片的id
    let info = JSON.parse(JSON.stringify(_this.data.goodsInfo));
    let attr = info.goods_spec_format;
    let count = 0; //选中几个规格
    let group = ''; //存储选中的规格的id
    let choiceName = this.data.choiceName; //存储选中的规格的名称
    let attrChoiced = [];
    let attrChoicedPic = this.data.attrChoicedPic;

    if (index === 0) {
      pic_id = attr[0].value[idx].spec_value_data;
      if (attr[0].value[idx].spec_value_data_src){
        attrChoicedPic = attr[0].value[idx].spec_value_data_src
      }else{
        for (let i in info.img_list){
          if (info.img_list[i].pic_id == pic_id){
            attrChoicedPic = info.img_list[i].pic_cover_mid
          }
        }
      }
      
      choiceName = attr[0].value[idx].spec_value_name; 
    }
    attr[index].status = true;
    for (let k in attr[index].value) { //去掉之前选中的
      attr[index].value[k].status = false;
    }

    attr[index].value[idx].status = true; //点击选中规格
    for (let i in info.goods_spec_format) { //选中几个规格
      if (info.goods_spec_format[i].status == true) {
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
    group = group.substring(0, group.length-1)
    if (attr.length == count) {
      let that = this;
      app.api.GetSpecinfo({
        spec: group,
        goods_id: this.data.goods_id,
        uid
      }).then(res => {
        // app.tips(res.msg);
        console.log(res, 'GetSpecinfo');
        attrChoiced = res.data;
        if (attrChoiced.stock == 0) {
          app.tips('库存不足');
        }
        let num = info.min_buy > 0 ? info.min_buy : 1;
        let totalprice =info.promotion_type == 2&&!this.data.checkstate ? (attrChoiced.promote_price * num) : (attrChoiced.wholesaler_price * num);

        that.setData({
          attrChoiced, num, totalprice,
        })
      }).catch(res => {
        app.tips(res.msg);
      })
    }

    _this.setData({
      goodsInfo: info,
      choiceName,
      attrChoicedPic,
      group,
      pic_id,
    })
  },
  //添加商品数量
  addNum: function() {
    let num = this.data.num;
    let goods = this.data.goodsInfo;
    let attrChoiced = this.data.attrChoiced;
    let totalprice =0;
    console.log(attrChoiced)
    //如果是多规格的 但是还没选规格就点击了添加键
    if (goods.goods_spec_format && goods.goods_spec_format.length > 0) {
      if (goods.goods_spec_format.length > 0 && attrChoiced.length ==0) {
        app.tips('请先选择规格！');
        this.setData({
          num: num
        })
        return
      }
      //多规格库存不足
      if (num + 1 > attrChoiced.stock) {
        app.tips('达可购买量上限！');
        this.setData({
          num: num
        })
        return
      }
    }

    //单规格库存不足

    if ((num + 1) - 0 > (goods.stock) - 0) {
      app.tips('商品可购买量上限');
      this.setData({
        num: num
      })
      return
    }

    //购买数量大于限购数量的时候 最大只能达到限购的值    
    if (goods.max_buy && (num - goods.max_buy) == 0) {
      app.tips('达可购买量上限！');
      this.setData({
        num: num
      })
      return;
    }
    if (goods.min_buy && num < goods.min_buy) {//购买数量小于限购数量的时候 
      num = goods.min_buy
    }else{
      num ++;
    }
    console.log(goods.promotion_type)
    if (attrChoiced.length == 0) {
      totalprice = goods.promotion_type == 2 &&!this.data.checkstate? (goods.promotion_price * num) : (goods.wholesaler_price * num);
    } else {
      totalprice = goods.promotion_type == 2 && !this.data.checkstate ? (attrChoiced.promote_price * num) : (attrChoiced.wholesaler_price * num);
    }
    
    totalprice=totalprice.toFixed(2) 
    this.setData({
      num, totalprice
    })
  },
  buyOrSpec: function() { //查看规格
    this.setData({
      mask: true
    })
  },
  //减商品数量
  reduceNum: function() {
    let num = this.data.num;
    let goodsInfo = this.data.goodsInfo;
    let attrChoiced = this.data.attrChoiced;
    if (goodsInfo.min_buy > 0 && num - 1 < goodsInfo.min_buy) {
      app.tips("商品数量不能少于" + goodsInfo.min_buy);
      num= goodsInfo.min_buy
    } else if (num == 1) {
      app.tips("商品数量不能小于一");
      num= 1
    } else {
      num = num - 1
    }
    let totalprice = goodsInfo.promotion_type == 2&&!this.data.checkstate ? (goodsInfo.promotion_price * num) : (goodsInfo.wholesaler_price * num);
    totalprice = totalprice.toFixed(2) 
    this.setData({
      num, totalprice
    })
  },

  onAddCarTap() {

    let num = this.data.num;
    let goods = this.data.goodsInfo;
    let attrChoiced = this.data.attrChoiced;

    let cart_detail = {
      goods_id: this.data.goods_id,
      goods_name: this.data.goods_name,
      count: num,
      picture_id: this.data.pic_id ? this.data.pic_id: goods.picture_detail.pic_id,
    };
    if (attrChoiced.length==0) {
      cart_detail.sku_id = goods.sku_list[0].sku_id;
      cart_detail.sku_name = goods.sku_list[0].sku_name;
      cart_detail.price = goods.sku_list[0].wholesaler_price;
      cart_detail.cost = num * goods.sku_list[0].wholesaler_price
    }else {
      cart_detail.sku_id = attrChoiced.sku_id;
      cart_detail.sku_name = attrChoiced.sku_name;
      cart_detail.price = attrChoiced.wholesaler_price;
      cart_detail.cost = num * attrChoiced.wholesaler_price
    }
    console.log(cart_detail)
    let check = this.checkFn(num);//检查库存
    if (check) {
      return
    }
    let that = this;
    app.api.AddCart({ //加入购物车
      cart_detail: JSON.stringify(cart_detail),
      uid
    }).then(res => {
      app.tips(res.msg);
      that.setData({
        mask: false
      })
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  checkFn(num) {
    let goods = this.data.goodsInfo;
    let attrChoiced = this.data.attrChoiced;
    
    //如果是多规格的 但是还没选规格就点击了添加键
    if (goods.goods_spec_format && goods.goods_spec_format.length > 0) {
      if (attrChoiced.length==0) {
        app.tips('请先选择规格！');
        return true
      }
      //多规格库存不足
      if (num > attrChoiced.stock) {
        app.tips('库存不足！');
        return true
      }

    } else {
      //单规格库存不足
      if (num > goods.stock - 0) {
        app.tips('库存不足！');
        return true
      }
    }
    //购买数量大于限购数量的时候 最大只能达到限购的值    
    if (goods.max_buy && (num - goods.max_buy) > 0) {
      app.tips('超过可购买量上限！');
      return true;
    }
  },
  formSubmit(){//立即购买
    let that = this;
    let num = this.data.num;
    let attrChoiced = this.data.attrChoiced;
    let check=this.checkFn(num);//检查库存
    if (check){
      return
    }
    let order_sku_info='';
    let sku_id=0;
    if (attrChoiced.length==0) {
      sku_id = parseFloat(this.data.goodsInfo.sku_list[0].sku_id);
    } else {
      sku_id = parseFloat(attrChoiced.sku_id)
    }
    order_sku_info = sku_id + ':' + num
    app.navTo("/base/payment/payment?sku="+order_sku_info)
   
  },

  onShow: function() {

  },

  onReachBottom: function() {

  },


  onShareAppMessage: function (res) {
    const _this = this;
    return {
      same_share: true,
      title: _this.data.goods_name,
      path: '/base/goodsdetail/goodsdetail?goods_id=' + _this.data.goods_id + '&goods_name=' + _this.data.goods_name
    }
  },
  onCategoryTap(e) {
    let cidx = e.currentTarget.dataset.cidx
    this.setData({
      cidx
    })
  },
  onCloseTap() {
    this.setData({
      mask: !this.data.mask
    })
  },

  onTabTap: function (e) {
    const _this = this;
    let _index = e.currentTarget.dataset.index;
    _this.setData({
      cur: _index
    })
    if(_index==1){
      this.getComment(1);
    }
  },
  getComment(page){
    

    let that = this;
    app.api.CommentList({
      uid,
      page,
      length:10,
      goods_id: this.data.goods_id
    }).then(res => {
      // app.tips(res.msg);
      console.log(res, 'CommentList')
      let olist = [];
      let temp = res.data.data;
      let isA = temp.length==10?true:false;
      if(page>1){
        olist = that.data.olist;
      }
      if(temp.length>0){
        for (let i in temp) {
          let now = app.returnTodayInfo(temp[i].end_time)
          temp[i].addtime = now.yearData + '-' + now.monthDataRel + '-' + now.dayData ;
          olist.push(temp[i])
        }
      }
      console.log(olist)
      that.setData({
        olist,isA,page
      })
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  pullUpLoad(e) {//触底加载分页
    // console.log(e,104444)
    let dir = e.detail.direction;
    let page = this.data.page;
    let isA = this.data.isA;
    if (dir == "bottom" && isA) {
      page++;
      this.getComment(page);
    }
  },
  //评论缩略图放大
  prewImg: function (e) {
    const _this = this;
    let index = e.currentTarget.dataset.index;
    let idx = e.currentTarget.dataset.idx;
    let olist = _this.data.olist;
    let comment = olist[index].image;
    let arr = []
    for (let i = 0; i < comment.length; i++) {
      arr[i] = _this.data.imgRoot+'/' + comment[i]
    }
    wx.previewImage({
      urls: arr,
      current: arr[idx]
    })
  },
})
//CartList(购物车列表)
const app = getApp();
let uid = app.globalData.uid;
Page({
  data: {
    siteroot:'',
    cartList: [],
    isOff: false,
    isCheck: true,
    allCheck: false,
    allCost: 0,
    isA: true,
    showBox: false,
    totalNum: 0,
    totalType: 0,
    method1: true,
    method2: false,
    isIphoneX: app.globalData.isIphoneX,
    iphoneXH: app.globalData.iphoneXH,
    page:1,
    length:10,
    tempList:[],//临时列表
  },
  onLoad: function(o) {

  },
  getCartList(e) { //获取购物车信息
    let that = this;

    app.api.CartList({
      uid, page: e, length: this.data.length
    }).then(res => {
      console.log(res, 'CartList')
      if (res.data.length > 0) {
        let cartList = [];

        let tempList = that.data.tempList;
        let data=res.data;
        let allCheck=false;
        if(e>1){
          cartList=that.data.cartList;
        }

        for (let i in data) {
          data[i].isCheck = true;
          data[i].isOff = true;
          cartList.push(data[i])
        }
        if (tempList.length>0) {//当删除某个商品时，还原其他未被删除的商品状态
          for (let i in cartList) {
            for (let j in tempList ){
              if (cartList[i].cart_id == tempList[i].cart_id){
                cartList[i].isCheck = tempList[i].isCheck;
                cartList[i].isOff = tempList[i].isOff;
              }
            }
          }
        }

       
        that.setData({
          isA: data.length == 10, page: e,cartList
        })
        that.isCheckAll()
      } else {
        let cartList = []
        that.setTotal(cartList);
      }

      let siteroot = app.siteroot(res.other.imgroot);
      that.setData({
        siteroot
      })
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  onShow: function () {
    console.log('car',uid)
    app.checkUid();
    uid = app.globalData.uid;
    if(uid){
      this.getCartList(1)
    }
  },

  controlFn(e) { //展开/编辑
    let index = e.target.dataset.index;
    let method1 = this.data.method1;
    let method2 = this.data.method2;
    let cartList = this.data.cartList;
    if (index == 1) {
      method1 = !method1;
      for (let i in cartList) {
        cartList[i].isOff = method1
      }
    } else {
      method2 = !method2;
    }
    this.setData({
      method1,
      method2,
      cartList
    })
  },
  deleteFn() { //删除选中
    if (this.data.totalNum > 0) {
      this.setData({
        showBox: true
      })
    }
  },
  toggle(e) { //展开关闭
    this.toggleFn(e, 'isOff')
  },
  toggleFn(e, keyname) {
    let cart_id = e.currentTarget.dataset.cart_id;
    let cartList = this.data.cartList;
    for (let i in cartList) {
      if (cartList[i].cart_id == cart_id) {
        if (!cartList[i][keyname]) {
          cartList[i][keyname] = true;
        } else {
          cartList[i][keyname] = false
        }
      }
    }
    this.setData({
      cartList
    })
  },
  checkFn(e) { //勾选
    this.toggleFn(e, 'isCheck');
    this.isCheckAll();
  },
  isCheckAll(){//判断是否全选

    let allCheck = this.data.allCheck;
    let cartList = this.data.cartList;
    let j = 1;
    for (let i in cartList) {
      if (!cartList[i].isCheck) {
        j = 2;
        break;
      }
    }
    this.setData({
      allCheck: j == 1, //判断是否全选 
    })
    this.setTotal(cartList);
  },
  toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
      return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
      rs = s.length;
      s += '.';
    }
    while (s.length <= rs + 2) {
      s += '0';
    }
    return s;
  },
  checkAll() { //勾选全部
    let cartList = this.data.cartList;
    let allCheck = !this.data.allCheck;
    for (let i in cartList) {
      if (allCheck) {
        cartList[i]['isCheck'] = true
      } else {
        cartList[i]['isCheck'] = false
      }
    }

    this.setTotal(cartList);
    this.setData({
      cartList,
      allCheck
    })
    
  },
  pullUpLoad(e) { //触底加载分页
    // console.log(e,104444)
    let dir = e.detail.direction;
    let page = this.data.page;
    let isA = this.data.isA;
    if (dir == "bottom" && isA) {
      page++;
      this.getCartList(page);
    }
  },
  changeNumFn(e) { //改变数量
    let cart_id = e.currentTarget.dataset.cart_id;
    let idx = e.currentTarget.dataset.idx; //cartList的index
    let index = e.target.dataset.index; //判断是加还是减
    let cartList = this.data.cartList;
    // let num = cartList[idx].num;
    if (index == 0) { //减
      if (cartList[idx].num - 1 < cartList[idx].min_buy || cartList[idx].num == 1) {
        this.setData({
          showBox: true,
          curIndex: idx
        });
        return
      }
      if (cartList[idx].num - 1 >= cartList[idx].min_buy) { //如果再减1会不少于最低购买数量min_buy
        cartList[idx].num--;
      }
    } else if (index == 1) {
      console.log(cartList[idx].num + 1 <= cartList[idx].stock, cartList[idx].num + 1 <= cartList[idx].max_buy)
      if (cartList[idx].num + 1 <= cartList[idx].stock) { //如果再加1会不大于库存;
        if (cartList[idx].num + 1 <= cartList[idx].max_buy || cartList[idx].max_buy == 0) { //如果最大再加1会不大于购买数量max_buy或max_buy为0

          cartList[idx].num++;
        }
      } else {
        app.tips('库存不足!')
      }
    } else {
      return
    }
    this.setTotal(cartList);
    this.updateCartNum(cart_id, cartList[idx].num);
  },
  setTotal(cartList) {

    let totalNum = 0;
    let allCost = 0;
    let totalType = 0;
    let cart_ids = "";
    if (cartList.length > 0) {

      for (let i in cartList) {
        if (cartList[i].isCheck) {
          allCost += cartList[i].num * cartList[i].price;
          totalNum += cartList[i].num;
          cart_ids += cartList[i].cart_id + ',';
          totalType++;
        }
      }
      allCost = this.toDecimal(allCost);
      allCost = allCost.toString().split(".");
    }
    this.setData({
      cartList,
      totalNum,
      allCost,
      totalType,
      cart_ids
    })

  },
  updateCartNum(cart_id, num) { //修改购物车数量
    let that = this;

    app.api.UpdateCartNum({
      cart_id,
      num
    }).then(res => {
      console.log(res, 'updateCartNum')

    }).catch(res => {
      app.tips(res.msg);
    })
  },
  popupok() { //当数量减到0时提示删除
    let cartList = this.data.cartList;
    let curIndex = this.data.curIndex;
    let cart_ids = '';
    let len = 0;
    if (curIndex >= 0) {
      cart_ids = cartList[curIndex].cart_id;
      cartList.splice(curIndex, 1)
    } else {
      for (let i in cartList) {
        if (cartList[i].isCheck) {
          cart_ids += cartList[i].cart_id + ',';
          len++;
        }
      }
    }
    this.setTotal(cartList);
    this.deleteCart(cart_ids);
    this.setData({
      showBox: false
    })
  },
  deleteCart(cart_ids) { //修改购物车数量
    let that = this;
    let tempList = this.data.cartList;
    
    app.api.DeleteCart({
      cart_ids
    }).then(res => {
      console.log(res, 'deleteCart')
      this.setData({
        tempList
      })
      that.getCartList('delete');
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  submitFn(e) {
    let that = this;
    let cart_ids = this.data.cart_ids;
    cart_ids = cart_ids.substring(0, cart_ids.length - 1)
    if (this.data.totalNum > 0) {
      wx.navigateTo({
        url: "/base/payment/payment?cart_ids=" + cart_ids,
      })
    }

  },
  onReachBottom: function() {

  },

  onShareAppMessage: function() {

  },

})
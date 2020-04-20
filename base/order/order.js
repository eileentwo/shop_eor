//apiOrderGetOrderList (获取订单列表)
const app = getApp();
let uid=app.globalData.uid;
app.Base({
  data: {
    nav: [{
        title: '全部订单',
        status: 0
      },
      {
        title: '待付款',
        status: 1
      },
      {
        title: '已付款',
        status: 2
      },
      {
        title: '已完成',
        status: 6
      },
      {
        title: '退款单',
        status: 7
      }
    ],
    curHdIndex: 0,
    page: 1,
    length: 10,
    olist: []
  },
  onLoad(o) {
    //console.log(o)
    if (o.curHdIndex && o.curHdIndex > 0){
      this.setData({
        curHdIndex:o.status,        
      })
    }
    if(o.owner_id > 0){
      this.setData({owner_id:o.owner_id})
    }
    //如果是云店店主则隐藏“立即支付”“取消订单”等操作按钮只能查看订单
    if (o.isShopowner){
      this.setData({ isShopowner: o.isShopowner })
    }else{
      this.setData({ isShopowner: false })
    }
    this.setData({ allidx: o.allidx||0})//顶部所有订单的标识
  },
  onShow(){
    
  },
  
  onLoadData: function() {
    const _this = this;
    let olist = _this.data.olist;
    let length = _this.data.length;
    let page = _this.data.page

    let param = {
      user_id: _this.data.user_id,
      page:page,
      length: length,
      type: _this.data.curHdIndex
    }
    this.data.isShopowner ? param.user_id = 0 : param.user_id = _this.data.user_id
    this.data.isShopowner ? param.owner_user_id = this.data.owner_id : param.owner_user_id = 0
    // app.api.apiOrderGetOrderList(param).then((res) => {      

    //   for (let shop of res.data) {
    //     let can_refund = true;
    //     for (let goods of shop.detail) {
    //       if (goods.goodsinfo && goods.goodsinfo.is_support_refund == 0) {
    //         can_refund = false;          
    //         break;
    //       }
    //     }
    //     shop.can_refund = can_refund;
    //   }
    //   //判断有没有更多的列表进行加载 hasMore表示有更多 
    //   let hasMore = res.data.length < length ? false : true;
    //   if (res.data.length < length) {
    //     _this.setData({
    //       nomore: true,
    //       show: true,
    //     })
    //   }
    //   if (page == 1) {
    //     olist = res.data;
    //   } else {
    //     for (let i in res.data) {
    //       olist.push(res.data[i])
    //     }
    //   }
    //   page = page + 1
    //   _this.setData({
    //     olist: olist,
    //     show: true,
    //     hasMore: hasMore,
    //     page: page,
    //     img_root: res.other.img_root
    //   })
    //   //滚动回顶部
    //   // wx.pageScrollTo({
    //   //   scrollTop: 0,
    //   //   duration: 400
    //   // });
    // }).catch((res) => {
    //   if (res.code == -1) {
    //     app.tips(res);
    //   } else {
    //     app.tips(res);
    //   }
    // });
  },
  swichNav: function(e) {
    //console.log(e)
    const _this = this;
    let status = e.currentTarget.dataset.status;
    _this.setData({
      curHdIndex: status,
      page: 1
    });    
    this.onLoadData();
  },
  onReachBottom: function() {
    var _this = this;
    if (!_this.data.hasMore) {
      this.setData({ nomore:true})
      return;
    }
    _this.onLoadData();
  },
  cancelOrder: function(e) {
    var _this = this;
    let index = e.currentTarget.dataset.index;
    let olist = _this.data.olist;

    wx.showModal({
      title: '提示',
      content: '确定取消该订单吗',
      success: function(res) {
        if (res.confirm) {
          app.ajax({
            url: 'Corder|cancelOrder',
            data: {
              order_id:olist[index].id,
            },
            success: function(res) {
              wx.showToast({
                title: '取消成功'
              })
              olist.splice(index, 1);
              _this.setData({
                olist: olist
              })
            }
          })
        }
      }
    })
  },
  deleteOrder: function(e) {
    var _this = this;
    let index = e.currentTarget.dataset.index;
    let olist = _this.data.olist;
    wx.showModal({
      title: '提示',
      content: '订单删除后不再显示',
      success: function(res) {
        if (res.confirm) {
          app.ajax({
            url: 'Corder|deleteOrder',
            data: {
              order_id:olist[index].id,
            },
            success: function(res) {
              wx.showToast({
                title: '删除成功'
              })
              olist.splice(index, 1);
              _this.setData({
                olist: olist
              })
            }
          })
        }
      }
    })
  },

  payNow: function(e) {
    //console.log(e)    
    var _this = this;
    var oindex = e.currentTarget.dataset.index
    app.ajax({
      url: 'Corder|payOrder',
      data: {
        order_id: _this.data.olist[oindex].id
      },
      success: function(res) {
        if (!!res.other.paydata) {
          wx.requestPayment({
            timeStamp: res.other.paydata.timeStamp,
            nonceStr: res.other.paydata.nonceStr,
            package: res.other.paydata.package,
            signType: res.other.paydata.signType,
            paySign: res.other.paydata.paySign,
            appId: res.other.paydata.appId,
            prepay_id: res.other.paydata.prepay_id,
            success: function(res) { 
              // todo 微信支付成功/跳转
              app.reTo("/sqtg_sun/pages/zkx/pages/ordersuccess/ordersuccess");
            }
          })
        }
      },
      complete: function() {
        _this.setData({
          isRequest: 0
        })
      }
    })
  },
  onOrderinfoTap:function(e){
    if (this.data.isShopowner){
      app.navTo("/base/goodsorderinfo/goodsorderinfo?id=" + e.currentTarget.dataset.id + '&isShopowner='+this.data.isShopowner)
    }else{
      app.navTo("/base/goodsorderinfo/goodsorderinfo?id=" + e.currentTarget.dataset.id)
    }
  },  

  onTabTap(e){
    let allidx = e.currentTarget.dataset.allidx
    if (allidx == 0){
      if (this.data.isShopowner) {
        app.navTo("/plugin/panic/mypanicorder/mypanicorder?allidx=1" + '&owner_id=' + this.data.owner_id + '&isShopowner=' + this.data.isShopowner)
      } else {
        app.reTo("/base/order/order?allidx=0")
      }      
    }
    else if (allidx == 1) {//抢购
      if (this.data.isShopowner) {
        app.navTo("/plugin/panic/mypanicorder/mypanicorder?allidx=1" + '&owner_id=' + this.data.owner_id + '&isShopowner=' + this.data.isShopowner)
      } else {
        app.reTo("/plugin/panic/mypanicorder/mypanicorder?allidx=1")
      }
    }
    else if (allidx == 2) {//拼团
      if (this.data.isShopowner) {
        app.navTo("/plugin/spell/myorder/myorder?allidx=2" + '&owner_id=' + this.data.owner_id + '&isShopowner=' + this.data.isShopowner)
      } else {
        app.reTo("/plugin/spell/myorder/myorder?allidx=2")
      }
    }
    else if (allidx == 3) {//免单
      if (this.data.isShopowner) {
        app.navTo("/plugin/free/myorder/myorder?allidx=3" + '&owner_id=' + this.data.owner_id + '&isShopowner=' + this.data.isShopowner)
      } else {
        app.reTo("/plugin/free/myorder/myorder?allidx=3")
      }
    }
    else if (allidx == 4) {//预约
      if (this.data.isShopowner) {
        app.navTo("/base/myreserveorder/myreserveorder?allidx=4" + '&owner_id=' + this.data.owner_id + '&isShopowner=' + this.data.isShopowner)
      } else {
        app.reTo("/base/myreserveorder/myreserveorder?allidx=4")
      }
    }
    else if (allidx == 5) {//礼包
      if (this.data.isShopowner) {
        app.navTo("/plugin/gift/orderlist/orderlist?allidx=5" + '&owner_id=' + this.data.owner_id + '&isShopowner=' + this.data.isShopowner)
      } else {
        app.reTo("/plugin/gift/orderlist/orderlist?allidx=5")
      }
    }
  },
})
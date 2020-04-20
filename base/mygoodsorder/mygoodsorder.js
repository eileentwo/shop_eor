//apiOrderGetOrderList (获取订单列表)
const app = getApp();
app.Base({
  data: {
    nav: [{
        title: '全部',
        status: 0
      },
      {
        title: '待支付',
        status: 1
      },
      {
        title: '待使用/待发货',
        status: 2
      },
      {
        title: '待收货',
        status: 3
      },
      {
        title: '完成',
        status: 6
      },
      {
        title: '售后',
        status: 7
      }
    ],
    curHdIndex: 0,
    page: 1,
    length: 10,
    olist: [],
  },
  onLoad(o) {},
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
    app.api.apiOrderGetOrderList(param).then((res) => {
      //console.log(res)
      //判断有没有更多的列表进行加载 hasMore表示有更多 
      let hasMore = res.data.length < length ? false : true;
      if (res.data.length < length) {
        _this.setData({
          nomore: true,
          show: true,
        })
      }
      if (page == 1) {
        olist = res.data; //优惠券列表
      } else {
        for (let i in res.data) {
          olist.push(res.data[i])
        }
      }
      page = page + 1
      _this.setData({
        olist: olist,
        show: true,
        hasMore: hasMore,
        page: page,
        img_root: res.other.img_root
      })
      //滚动回顶部
      // wx.pageScrollTo({
      //   scrollTop: 0,
      //   duration: 400
      // });
    }).catch((res) => {
      if (res.code == -1) {
        app.tips(res);
      } else {
        app.tips(res);
      }
    });
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
    app.navTo("/base/goodsorderinfo/goodsorderinfo?id=" + e.currentTarget.dataset.id)
  },
  
})
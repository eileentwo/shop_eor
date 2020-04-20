const app = getApp();
let uid = app.globalData.uid;
module.exports = {
  modal(text, order_id, that, index) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: text,
      success(res) {
        if (res.confirm) {
          if (text == '确认收货?') {
            _this.deliveryOrder(that, order_id, index)
          } else if (text == '确定取消订单?') {

            _this.closeOrder(that, order_id, index)
          } else if (text == '确定删除订单?') {

            _this.deleteOrder(that, order_id, index)
          }
        }
      }
    })
  },
  closeOrder(that, order_id, index) {
    app.api.CloseOrder({
      order_id,
      uid: app.globalData.uid
    }).then(res => {
      console.log(res, 'CloseOrder')
      wx.hideLoading();
      if (index == 'list') {
        that.orderList(1);
      } else {
        that.onLoadData()
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  deliveryOrder(that, order_id, index) {
    app.api.DeliveryOrder({
      order_id,
      uid: app.globalData.uid
    }).then(res => {
      console.log(res, 'deliveryOrder')
      wx.hideLoading();

      if (index == 'list') {
        that.orderList(1);
      } else {
        that.onLoadData()
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  deleteOrder(that, order_id, index) {
    app.api.DeleteOrder({
      order_id,
      uid: app.globalData.uid
    }).then(res => {
      console.log(res, 'CloseOrder')
      wx.hideLoading();
      if (index == 'list') {
        that.orderList(1);
      } else {
        app.reback()
      }
    }).catch(res => {
      app.tips(res.msg);
    })
  },
  payment(that, order_id, text) { //调用支付接口    
    let _this = this;
    app.api.GetPayInfo({
      uid: app.globalData.uid,
      order_id: order_id,
    }).then(res => {
      console.log(res, 'GetPayInfo')
      _this.wxpayAjax(res.data, that, text,order_id);
    }).catch(res => {
      if (text == 'payment') {
        app.tips(res.msg);
      } else {
        that.setData({
          ajax: false
        })
        if (res.code == -1) {
          app.tips(res.msg);
        } else { // 执行失败回调操作
          app.tips(res.msg);
        }
      }
    })
  },
  wxpayAjax(payStamp, that, text, order_id) {
    let data = payStamp;
    let _this=this;
    wx.requestPayment({
      appId: data.appId,
      nonceStr: data.nonceStr,
      package: data.package,
      paySign: data.paySign,
      prepay_id: data.prepay_id,
      signType: data.signType,
      timeStamp: data.timeStamp,
      success: function(res) {
        console.log(res)
        app.tips("支付成功！")
        if (text == 'payment') {
          that.setData({
            showMask1: false
          })
          let timer = setTimeout(function () {
            app.reTo("/base/goodsorderinfo/goodsorderinfo?order_id=" + order_id)
            clearTimeout(timer)
          }, 1000)
        } else {
          that.toggleAlertPay()
          let timer = setTimeout(function () {
            that.onLoadData();
            clearTimeout(timer)
          }, 1000)
        }
      },
      fail: () => {
        if (text == 'payment') {
          app.reTo("/base/goodsorderinfo/goodsorderinfo?order_id=" + order_id)
        } else {
          that.setData({
            buttonName: '继续支付',
            ajax: false
          })
        }
      }
    })
  },
  setHomeGoodList(data,text) {
      
    for (let i in data) {
      data[i].num =0;
      data[i].description = data[i].description.replace(/<[^<>]+>/g, ""); //去标签      
      // if (!text) {
      //   data[i] = this.setPrice(data[i])
      // }
    }
    return (data)
  },
  setPrice(data, discount) {
    if (discount || data.promotion_type==2) {
      data.wholesaler_price = data.promotion_price.split('.')
    } else {
      data.wholesaler_price = data.wholesaler_price.split('.')
    }
    return data
  },
  getWholesalerInfo(that) {
    let uid = app.globalData.uid;
    let check_state =app.globalData.check_state;
  
    let checkstate=false;
    if (check_state==2 || check_state==0){
      checkstate=check_state==2?true:false;
      console.log(checkstate,16444)
      that.setData({
        checkstate
      })
      that.getListData(1);
      return;
    }
    
    app.api.GetWholesalerInfo({
      uid
    }).then(res => {
      console.log(res.data, 'GetWholesalerInfo')
      that.getListData(1);
      check_state = res.data && res.data.check_state==2?2:0;
      console.log(check_state,18111)
      app.globalData.check_state = check_state;
      wx.setStorageSync('check_state', check_state)
      that.setData({
        checkstate: check_state
      })

    }).catch(res => {
      app.tips(res);
    })
  },
}
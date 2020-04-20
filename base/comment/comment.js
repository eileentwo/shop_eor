// AddComment(抢购发布评论)
// apiPanicOrderInfo(抢购订单详情)

const app = getApp();
let uid=app.globalData.uid;
app.Base({
  data: {
    siteroot: '',
    num:5,
  },
  onLoad(o) {
    console.log(o,19)
    this.setData({
      order_id: o.order_id
    })
    uid = app.globalData.uid;
    this.onLoadData();
  },
  onshow(){
  },
  onLoadData() {
    let that=this;
    app.api.OrderDetails({
      orderId: that.data.order_id
    }).then(res => {
      console.log(res)
      let order_goods = res.data.order_goods
      for (let i in order_goods){
        order_goods[i].imgs ='';
        order_goods[i].content='';
        order_goods[i].star = 5;
        order_goods[i].is_anonymous = 1; 
        order_goods[i].explain_type=1; 
        order_goods[i].explain = [{ isCheck: true, value: '好评', explain_type: 0 }, { isCheck: false, value: '中评', explain_type: 1 }, { isCheck: false, value: '差评', explain_type: 2 }]
      }

      let siteroot = app.siteroot(res.other.imgroot);
      this.setData({
        order_goods, order_no: res.data.order_no, siteroot
      })
    }).catch(res => {
      app.tips(res)
    }) 
  },
  radioChange(e){
    console.log(e)
    this.setOrders(e, 'explain')
  },
  getImages(e) {
    this.setOrders(e,'images')
    // this.setData({
    //   images: e.detail
    // })
  },
  getStar(e) {
    this.setOrders(e,'star')
  },
  setOrders(e,item) {
    let index = e.currentTarget.dataset.index;
    let detail = e.detail;
    let order_goods = this.data.order_goods;
    if (item == 'star') {
      order_goods[index].star = detail
    } else if (item == 'images') {
      order_goods[index].images = detail
    } else if (item == 'content') {
      order_goods[index].content = detail.value
    } else if (item == 'anonymous') {
      order_goods[index].is_anonymous = !order_goods[index].is_anonymous ? 1 : 0
    } else if (item == 'explain') {
      order_goods[index].explain_type = detail.value * 1 + 1
      for (let i in order_goods[index].explain){
        order_goods[index].explain[i].isCheck = false;
      }
      order_goods[index].explain[detail.value].isCheck=true;
    }
    console.log(order_goods)
    this.setData({
      order_goods
    })
  },
  getTxt(e) {
    this.setOrders(e, 'content')
    // this.setData({
    //   txt: e.detail.value
    // })
  },
  getAgree(e) {
    this.setOrders(e, 'anonymous')
    // this.setData({
    //   anonymous: !this.data.anonymous
    // })
  },
  goodsEvaluateFn(){
    let arr=[];
   
    let order_goods = this.data.order_goods;
    for(let i in order_goods){
      let temp={};
      temp.order_goods_id = order_goods[i].order_goods_id;
      temp.content = order_goods[i].content;
      temp.imgs ='';
      for (let j in order_goods[i].images){
        temp.imgs +=order_goods[i].images[j]+','
      }
      temp.imgs = temp.imgs.substring(0, temp.imgs.length-1);
      temp.explain_type = order_goods[i].explain_type;
      temp.is_anonymous = order_goods[i].is_anonymous;
      temp.scores = order_goods[i].star;
      arr.push(temp)
    }
    return JSON.stringify(arr)
  },
  onSendTab() {
    var param = {
      order_id: this.data.order_id,
      uid,
      order_no: this.data.order_no,
      goodsEvaluate: this.goodsEvaluateFn(),
    }
    let order_goods = this.data.order_goods;
    for (let i in order_goods){
      if (order_goods[i].content.length < 10) {
        app.tips('亲，服务评价至少10个字哦！');
        return;
      }
    }
    
    if (this.data.ajax) return;
    this.setData({
      ajax: true
    })
    app.api.AddComment(param).then(res => {
      app.alert('谢谢您的评价');
      let timer=setTimeout(function(){
        wx.navigateBack({
          delta: 1
        })
        clearTimeout(timer)
      },1000)
    }).catch(res => {
      this.data.ajax = false;
      app.tips(res);
    })
  }
})
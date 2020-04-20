/**
 * api.post = function(action, param, cachetime = 0, fromcache = true) {
    return this.myRequest(action, 'POST', param, cachetime, fromcache);
  }
 * method： api.post
 * action: 请求地址
 * param： 请求参数
 * cachetime: 缓存时间（默认0秒）
 * fromcache： 是否从本地缓存取值
 */
var api = {};

// ------------------------------------------ 登录 start ------------------------------------------
/**
 * method: LoginGetopenid (获取openid)
 */
api.LoginGetopenid = function (param) {
  return this.post('/eorder/Login/getopenid', param, 0, false);
}
/**
 * method: LoginBindPhone (绑定手机号)
 */
api.LoginBindPhone = function (param) {
  return this.post('/eorder/Login/bindPhone', param, 0, false);
}
/**
 * method: WholeSalerLevel (获取批发商等级)
 */
api.WholeSalerLevel = function (param) {
  return this.post('/eorder/Login/wholesalerLevel', param, 0, false);
}
/**
 * method: LoginAddressList (收货地址列表)
 */
api.LoginAddressList = function (param) {
  return this.post('/eorder/Users/addressList', param, 0, false);
}
/**
 * method:EditAddress (新增/编辑收货地址)
 */
api.EditAddress = function (param) {
  return this.post('/eorder/Users/editAddress', param, 0, false);
}
/**
 * method:ActAddress (收货地址- 设为默认地址/删除)
 */
api.ActAddress = function (param) {
  return this.post('/eorder/Users/actAddress', param, 0, false);
}
/**
 * method:AccountInfo (账号管理)
 */
api.AccountInfo = function (param) {
  return this.post('/eorder/Users/accountInfo', param, 0, false);
}

/**
 * method:EditAccount (修改用户名/密码)
 */
api.EditAccount = function (param) {
  return this.post('/eorder/Users/editAccount', param, 0, false);
}

/**
 * method:PersonalCenter (个人中心/密码)
 */
api.PersonalCenter = function (param) {
  return this.post('/eorder/Users/personalCenter', param, 0, false);
}
/**
 * method:ShopInfo (供应商信息)
 */
api.ShopInfo = function (param) {
  return this.post('/eorder/Users/shopInfo', param, 0, false);
}
/**
 * method:Goodslist (商品列表)
 */
api.Goodslist = function (param) {
  return this.post('/eorder/Goods/goodslist', param, 0, false);
}
/**
 * method:GoodsTypes (商品分类、品牌、标签)
 */
api.GoodsTypes = function (param) {
  return this.post('/eorder/Goods/goodsTypes', param, 0, false);
}
/**
 * method:AddCart (加入购物车)
 */
api.AddCart = function (param) {
  return this.post('/eorder/Goods/addCart', param, 0, false);
}
/**
 * method:GoodsInfo (商品详情)
 */
api.GoodsInfo = function (param) {
  return this.post('/eorder/Goods/goodsInfo', param, 0, false);
}
/**
 * method:CollectGoods (商品收藏 /取消收藏)
 */
api.CollectGoods = function (param) {
  return this.post('/eorder/Goods/collectGoods', param, 0, false);
}
/**
 * method:CartList (购物车列表)
 */
api.CartList = function (param) {
  return this.post('/eorder/Goods/cartList', param, 0, false);
}
/**
 * method:GetSpecinfo (获取规格信息)
 */
api.GetSpecinfo = function (param) {
  return this.post('/eorder/Goods/getSpecinfo', param, 0, false);
}/**
 * method:UpdateCartNum (修改购物车数量)
 */
api.UpdateCartNum = function (param) {
  return this.post('/eorder/Goods/updateCartNum', param, 0, false);
} 
/**
 * method:DeleteCart (删除购物车项目)
 */
api.DeleteCart = function (param) {
  return this.post('/eorder/Goods/deleteCart', param, 0, false);
}
/**
 * method:CartOrder (购物车确认订单)
 */
api.CartOrder = function (param) {
  return this.post('/eorder/Goods/cartOrder', param, 0, false);
}
/**
 * method:SetOrder (下订单)
 */
api.SetOrder = function (param) {
  return this.post('/eorder/Goods/setOrder', param, 0, false);
}
/**
 * method:OrderDetails (订单详情)
 */
api.OrderDetails = function (param) {
  return this.post('/eorder/Order/orderDetails', param, 0, false);
}
/**
 * method:ExpressCompany (物流公司列表)
 */
api.ExpressCompany = function (param) {
  return this.post('/eorder/Order/expressCompany', param, 0, false);
}
/**
 * method:GetDeliverPrice (计算运费)
 */
api.GetDeliverPrice = function (param) {
  return this.post('/eorder/Order/getDeliverPrice', param, 0, false);
}
/**
 * method:GetPayInfo (调支付)
 */
api.GetPayInfo = function (param) {
  return this.post('/eorder/Order/getPayInfo', param, 0, false);
}
/**
 * method:HomeInfo (首页数据)
 */
api.HomeInfo = function (param) {
  return this.post('/eorder/Index/homeInfo', param, 0, false);
} 
/**
 * method:CouponList (优惠券列表)
 */
api.CouponList = function (param) {
  return this.post('/eorder/Coupon/couponList', param, 0, false);
}
/**
 * method:GetCoupon (领取优惠券)
 */
api.GetCoupon = function (param) {
  return this.post('/eorder/Coupon/getCoupon', param, 0, false);
}
/**
 * method:MycouponList (我的优惠券列表)
 */
api.MycouponList = function (param) {
  return this.post('/eorder/Coupon/mycouponList', param, 0, false);
}
/**
 * method:UseCoupon (可用优惠券)
 */
api.UseCoupon = function (param) {
  return this.post('/eorder/Coupon/useCoupon', param, 0, false);
}
/**
 * method:GetPayInfo (调支付)
 */
api.GetPayInfo = function (param) {
  return this.post('/eorder/Order/getPayInfo', param, 0, false);
}
/**
 * method:OrderList (订单列表)
 */
api.OrderList = function (param) {
  return this.post('/eorder/Order/orderList', param, 0, false);
}
/**
 * method:OrderDetails (订单详情)
 */
api.OrderDetails = function (param) {
  return this.post('/eorder/Order/orderDetails', param, 0, false);
}
/**
 * method:CollectGoodsList (收藏列表)
 */
api.CollectGoodsList = function (param) {
  return this.post('/eorder/Index/collectGoodsList', param, 0, false);
}
/**
 * method:BuyCheckInfo (立即购买确认订单页)
 */
api.BuyCheckInfo = function (param) {
  return this.post('/eorder/Order/buyCheckInfo', param, 0, false);
}
/**
 * method:CloseOrder (取消订单)
 */
api.CloseOrder = function (param) {
  return this.post('//eorder/Order/closeOrder', param, 0, false);
}
/**
 * method:DeliveryOrder (确认收货)
 */
api.DeliveryOrder = function (param) {
  return this.post('/eorder/Order/deliveryOrder', param, 0, false);
}
/**
 * method:DeleteOrder (删除订单)
 */
api.DeleteOrder = function (param) {
  return this.post('/eorder/Order/deleteOrder', param, 0, false);
}
/**
 * method:ApplyWholesaler (申请成为批发商)
 */
api.ApplyWholesaler = function (param) {
  return this.post('/eorder/Login/applyWholesaler', param, 0, false);
}
/**
 * method:DiscountList (限时折扣)
 */
api.DiscountList = function (param) {
  return this.post('/eorder/Index/discountList', param, 0, false);
}
/**
 * method:IntegralList  (积分列表)
 */
api.IntegralList = function (param) {
  return this.post('/eorder/Users/integralList', param, 0, false);
}
/**
 * method:BalanceList (余额明细列表)
 */
api.BalanceList = function (param) {
  return this.post('/eorder/Users/balanceList', param, 0, false);
}
/**
 * method:UploadPic (上传图片)
 */
api.UploadPic = function (param) {
  return this.post('/eorder/Order/uploadPic', param, 0, false);
}
/**
 * method:AddComment (发布评论)
 */
api.AddComment = function (param) {
  return this.post('/eorder/Order/addComment', param, 0, false);
}
/**
 * method:ApplyRefund (申请退款)
 */
api.ApplyRefund = function (param) {
  return this.post('/eorder/Order/applyRefund', param, 0, false);
}
/**
 * method:CommentList (评价列表)
 */
api.CommentList = function (param) {
  return this.post('/eorder/Goods/commentList', param, 0, false);
}
/**
 * method:Test (测试)
 */
api.Test = function (param) {
  return this.post('/eorder/Notify/test', param, 0, false);
}
/**
 * method:NoticeInfo (公告详情)
 */
api.NoticeInfo = function (param) {
  return this.post('/eorder/Index/noticeInfo', param, 0, false);
}
/**
 * method:MansongList (满送列表)
 */
api.MansongList = function (param) {
  return this.post('/eorder/Index/mansongList', param, 0, false);
}
/**
 * method:DecryptPhone (微信获取手机号)
 */
api.DecryptPhone = function (param) {
  return this.post('/eorder/Login/decryptPhone', param, 0, false);
}
/**
 * method:GetWholesalerInfo (获取批发商信息)
 */
api.GetWholesalerInfo = function (param) {
  return this.post('/eorder/Users/getWholesalerInfo', param, 0, false);
}
/**
 * method:UpdateCartNumGoods (减少购物车数量 从商品列表)
 */
api.UpdateCartNumGoods = function (param) {
  return this.post('/eorder/Goods/updateCartNumGoods', param, 0, false);
}
/**
 * method:GetQRCode (获取qrcode)
 */
api.GetQRCode = function (param) {
  return this.post('/eorder/Upload/getQRCode', param, 0, false);
}

/**
 * method:apiDeleteQRCode (删除qrcode)
 */
api.apiDeleteQRCode = function (param) {
  return this.post('/eorder/Upload/deleteQRCode', param, 0, false);
}
// ------------------------------------------ 公用接口 end ----------------------------------------
module.exports = api;
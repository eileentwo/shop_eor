{
  "pages": [
    "pages/home/home", // 首页1
    "pages/diyhome/diyhome", // diy跳转旧首页
    "pages/active/active", // 活动1
    "pages/member/member", // 会员卡1
    "pages/market/market", // 集市1
    "pages/mine/mine", // 我的1
    "pages/login/login" // 登陆
  ],
  "subPackages": [
    {
      "root": "base",
      "pages": [
        
      ]
    }
  ],
  "window": {
    "backgroundColor": "#F8F9FE",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTextStyle": "black"
  }
}

return array(
    array('name'=>'首页','value'=>'/pages/home/home'),
    array('name'=>'活动','value'=>'/pages/active/active'),
    array('name'=>'会员卡','value'=>'/pages/member/member'),
    array('name'=>'集市','value'=>'/pages/market/market'),
    array('name'=>'我的','value'=>'/pages/mine/mine'),
    array('name'=>'搜索','value'=>'/base/search/search'),
    array('name'=>'普通商品列表','value'=>'/base/goodslist/goodslist'),
    array('name'=>'抢购商品列表','value'=>'/plugin/panic/list/list'),
    array('name'=>'优惠券列表','value'=>'/base/coupons/coupons'),
)
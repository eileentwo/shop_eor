function dealFootNav(res, root, key) {
  if (res.length < 1 && key != 1) {
    var nav = [{
        img: '/zhy/resource/images/nav/a.png',
        imgh: '/zhy/resource/images/nav/ah.png',
        icon: '',
        txt: '首页',
        link: '/pages/home/home',
        path: '',
        appid: '',
        types: 1,
        typeid: '',
        choose: false
      },
      {        
        img: '/zhy/resource/images/nav/d.png',
        imgh: '/zhy/resource/images/nav/dh.png',
        icon: '',
        txt: '商家',
        link: '/pages/merchants/merchants',
        path: '',
        appid: '',
        types: 1,
        typeid: '',
        choose: false
      },
      {
        img: '/zhy/resource/images/nav/c.png',
        imgh: '/zhy/resource/images/nav/c.png',
        icon: '',
        txt: '会员卡',
        link: '/pages/member/member',
        path: '',
        appid: '',
        types: 1,
        typeid: '',
        choose: false
      },
      {
        img: '/zhy/resource/images/nav/b.png',
        imgh: '/zhy/resource/images/nav/bh.png',
        icon: '',
        txt: '预约',
        link: '/base/reserve/reserve',
        path: '',
        appid: '',
        types: 1,
        typeid: '',
        choose: false
      },
      {
        img: '/zhy/resource/images/nav/e.png',
        imgh: '/zhy/resource/images/nav/eh.png',
        icon: '',
        txt: '我的',
        link: '/pages/mine/mine',
        path: '',
        appid: '',
        types: 1,
        typeid: '',
        choose: false
      }
    ];
  } else {
    var nav = [];
    for (var i = 0; i < res.length; i++) {
      var ia = res[i].clickago_icon;
      var ib = res[i].clickafter_icon;
      var ic = res[i].pic;
      var rule = /https\:\/\//
      
      var ruleLocal = /zhy\/resource\//
      if (!rule.test(ia) && !ruleLocal.test(ia)) {
        ia = root + ia;
      }
      if (!rule.test(ib) && !ruleLocal.test(ib)) {
        ib = root + ib;
      }
      if (!rule.test(ic) && !ruleLocal.test(ic)) {
        ic = root + ic;
      }
      var json = {
        img: ia,
        imgh: ib,
        icon: ic,
        txt: res[i].title,
        link: res[i].url,
        path: res[i].path,
        appid: res[i].appid,
        types: res[i].link_type,
        typeid: res[i].url_typeid,
        choose: false
      }
      nav.push(json);
    }
  }
  return nav;
}

module.exports = {
  dealFootNav: dealFootNav
};
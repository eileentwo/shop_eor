// apiDeleteQRCode(删除太阳码)
const app = getApp();
Component({
  data: {
    avatar: '',
    banner: '',
    qr: '',
    img: [],
    show: true
  },
  properties: {
    load: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal, changedPath) {
        if (newVal) {
          if (this.data.posterInfo.is_pic && this.data.posterInfo.style != 2) {
            console.log(1)
            this.startCreatImg();
          } else {
            console.log(2)
            this.startCreat();
          }
        }
      }
    },
    posterInfo: {
      type: Object,
      value: {
        delRoot: '',
        bg: '',
        img: '',
        avatar: '',
        qr: '',
        title: '',
        price: '',
        name: '',
        hot: '',
        style: ''
      },
      observer(newVal, oldVal, changedPath) { }
    }
  },
  ready() { },
  methods: {
    startCreatImg() {
      console.log(this.data.posterInfo)
      let imgs = [img(this.data.posterInfo.qr), img(this.data.posterInfo.is_pic)];
      Promise.all(imgs).then(res => {
        this.setData({
          qr: res[0],
          is_pic: res[1]
        })
        app.api.apiDeleteQRCode({
          path: this.data.posterInfo.delRoot
        }).then(res => {
          wx.showLoading({
            title: '海报生成中...',
          })
          //console.log('isdelectqr');
        }).catch(res => {
          wx.showLoading({
            title: '海报生成中...',
          })
        })
        this.drawPosterImg(res);
      })
    },
    drawPosterImg(res) {
      const ctx = wx.createCanvasContext('poster', this);
      // 背景
      if (this.data.is_pic) {
        ctx.drawImage(this.data.is_pic, 0, 0, 750, 1330);
      } else {
        ctx.setFillStyle('#f9f3e0');
        ctx.fillRect(0, 0, 750, 1330);
      }

      // 太阳码
      ctx.drawImage(this.data.qr, 480, 1060, 195, 195);
      ctx.draw();
      setTimeout(() => {
        this.createPoster();
      }, 500)
    },
    startCreat() {
      console.log(this.data.posterInfo)

      let imgs = [];
      if (this.data.posterInfo.bg == '') {
        imgs = [img(this.data.posterInfo.img), img(this.data.posterInfo.avatar), img(this.data.posterInfo.qr)];
      } else {
        imgs = [img(this.data.posterInfo.img), img(this.data.posterInfo.avatar), img(this.data.posterInfo.qr), img(this.data.posterInfo.bg)];
      }
      Promise.all(imgs).then(res => {
        //console.log(res)
        this.setData({
          img: res[0],
          avatar: res[1],
          qr: res[2]
        })
        if (res[3]) {
          this.setData({
            bg: res[3]
          })
        }
        console.log(this.data.posterInfo.delRoot)
        app.api.apiDeleteQRCode({
          path: this.data.posterInfo.delRoot
        }).then(res => {
          console.log(res,1111)
          wx.showLoading({
            title: '海报生成中...',
          })
          //console.log('isdelectqr');
        }).catch(res => {
          wx.showLoading({
            title: '海报生成中...',
          })
        })
        this.drawPoster(res);
      })
    },
    drawPoster(res) {
      const ctx = wx.createCanvasContext('poster', this);
      console.log(ctx)
      // 背景
      if (this.data.bg) {
        ctx.drawImage(this.data.bg, 0, 0, 750, 1330);
      } else {
        ctx.setFillStyle('#f9f3e0');
        ctx.fillRect(0, 0, 750, 1330);
      }
      //白色底方框
      roundRect(ctx, 40, 150, 670, 795, 10, '#fff');

      //白色底图片切割-开始
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, 54, 164, 642, 642, 10, '#fff');
      ctx.clip();
      ctx.drawImage(this.data.img, 54, 164, 642, 642);
      ctx.restore();
      //白色底图片切割-结束

      //标题
      let txt0 = {
        obj: ctx,
        str: this.data.posterInfo.title,
        initHeight: 854,
        initWidth: 55,
        titleHeight: 50,
        canvasWidth: 630,
        fontsize: 30,
        color: '#333',
        maxline: 1,
        center: false
      };
      this.drawText(txt0);

      //白色底方框下面
      roundRect(ctx, 40, 984, 670, 248, 10, '#fff');

      // 昵称
      if (this.data.posterInfo.style == 2) {
        let txtname = {
          obj: ctx,
          str: this.data.posterInfo.name,
          initHeight: 1085,
          initWidth: 168,
          titleHeight: 50,
          canvasWidth: 300,
          fontsize: 26,
          color: '#222',
          maxline: 1,
          center: false
        };
        let txtnames = this.drawText(txtname);
      } else {
        let txtname = {
          obj: ctx,
          str: this.data.posterInfo.name,
          initHeight: 1085,
          initWidth: 168,
          titleHeight: 50,
          canvasWidth: 300,
          fontsize: 26,
          color: '#222',
          maxline: 1,
          center: false
        };
        let txtnames = this.drawText(txtname);
      }

      //特别推荐
      if (this.data.posterInfo.style != 2) {
        let txtname = {
          obj: ctx,
          str: '「' + this.data.posterInfo.recommend + '」',
          initHeight: 1165,
          initWidth: 54,
          titleHeight: 50,
          canvasWidth: 360,
          fontsize: 30,
          color: '#000',
          maxline: 1,
          center: false
        };
        let txtnames = this.drawText(txtname);
      }

      // 价格
      if (this.data.posterInfo.price != -1) {
        if (this.data.posterInfo.style == 2) {
          let txtprice = {
            obj: ctx,
            str: this.data.posterInfo.price,
            initHeight: 910,
            initWidth: 54,
            titleHeight: 46,
            canvasWidth: 360,
            fontsize: 28,
            color: '#fe433f',
            maxline: 1,
            center: false
          };
          let txtprices = this.drawText(txtprice);
          // let w = txtprices.width + 60;
          // if (!txtprices.width) {
          //   w = 420;
          // }
          // roundRect(ctx, 56, 876, w, 50, 25, '#fe433f');
          this.drawText(txtprice);
        } else {
          let txtprice = {
            obj: ctx,
            str: this.data.posterInfo.price,
            initHeight: 910,
            initWidth: 54,
            titleHeight: 46,
            canvasWidth: 360,
            fontsize: 28,
            color: '#fe433f',
            maxline: 1,
            center: false
          };
          let txtprices = this.drawText(txtprice);
          // let w = txtprices.width + 60;
          // if (!txtprices.width) {
          //   w = 420;
          // }
          // roundRect(ctx, 56, 876, w, 50, 25, '#fe433f');
          this.drawText(txtprice);
        }
      }

      // 热度
      let txthot = {
        obj: ctx,
        str: this.data.posterInfo.hot,
        initHeight: 1200,
        initWidth: 70,
        titleHeight: 50,
        canvasWidth: 240,
        fontsize: 22,
        color: '#222',
        maxline: 1,
        center: false
      };
      let txthots = this.drawText(txthot);

      // 太阳码
      if (this.data.posterInfo.style == 2) {
        ctx.drawImage(this.data.qr, 480, 1015, 195, 195);
      } else {
        ctx.drawImage(this.data.qr, 480, 986, 195, 195);
      }
      // 太阳码下面文字
      if (this.data.posterInfo.style != 2) {
        let txtqr = {
          obj: ctx,
          str: '长按立即查看',
          initHeight: 1212,
          initWidth: 504,
          titleHeight: 50,
          canvasWidth: 240,
          fontsize: 24,
          color: '#fff',
          maxline: 1,
          center: false
        };
        roundRect(ctx, 456, 1187, 240, 32, 16, '#222');
        this.drawText(txtqr);
      }
      //头像-开始
      if (this.data.posterInfo.style == 2) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(106, 1075, 42, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.data.avatar, 64, 1033, 84, 84);
        ctx.restore();
        //头像-结束
        ctx.draw();
        setTimeout(() => {
          this.createPoster();
        }, 500)
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(106, 1075, 42, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.data.avatar, 64, 1033, 84, 84);
        ctx.restore();
        //头像-结束
        ctx.draw();
        setTimeout(() => {
          this.createPoster();
        }, 500)
      }
    },
    createPoster() {
      let _this = this;
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 750,
        height: 1330,
        destWidth: 750,
        destHeight: 1330,
        canvasId: 'poster',
        success(res) {
          _this.setData({
            show: false
          })
          let myEventDetail = {
            url: res.tempFilePath
          }
          _this.triggerEvent('create', myEventDetail);
        }
      }, this);
    },
    drawText(param) {
      //console.log(param)
      let ctx = param.obj;
      let lineheight = param.titleHeight;
      let lineWidth = 0;
      let lastSubStrIndex = 0; //每次开始截取的字符串的索引
      let line = 0;
      let width = param.canvasWidth;
      ctx.setFontSize(param.fontsize);
      ctx.fillStyle = param.color;
      for (let i = 0; i < param.str.length; i++) {
        lineWidth += ctx.measureText(param.str[i]).width;
        if (lineWidth > param.canvasWidth) {
          ++line;
          if (line >= param.maxline) {
            var str = param.str.substring(lastSubStrIndex, i - 1) + '...';
            if (param.center) {
              let sops = (750 - lineWidth) / 2;
              ctx.fillText(str, sops, param.initHeight);
            } else {
              ctx.fillText(str, param.initWidth, param.initHeight);
            }
            let wh = {
              width: param.canvasWidth,
              height: param.titleHeight
            }
            return param.titleHeight;
          } else {
            ctx.fillText(param.str.substring(lastSubStrIndex, i), param.initWidth, param.initHeight); //绘制截取部分
            param.initHeight += lineheight; //20为字体的高度
            lineWidth = 0;
            lastSubStrIndex = i;
            param.titleHeight += lineheight;
          }
        }
        if (i == param.str.length - 1) {
          if (line < 1) {
            width = lineWidth;
          }
          if (param.center) {
            let sops = (750 - lineWidth) / 2;
            ctx.fillText(param.str.substring(lastSubStrIndex, i + 1), sops, param.initHeight);
          } else {
            ctx.fillText(param.str.substring(lastSubStrIndex, i + 1), param.initWidth, param.initHeight);
          }
        }
      }
      let wh = {
        width: width,
        height: param.titleHeight
      }
      return wh;
    }
  }
})
function testHead(str) {
  return str.indexOf("http:") != -1 ? str.replace("http:", 'https:') : str;
}
function img(src) {
  src = testHead(src)
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: src,
      success(res) {
        resolve(res.path);
      }
    })
  })
}

/**
 * 
 * @param {CanvasContext} ctx canvas上下文
 * @param {number} x 圆角矩形选区的左上角 x坐标
 * @param {number} y 圆角矩形选区的左上角 y坐标
 * @param {number} w 圆角矩形选区的宽度
 * @param {number} h 圆角矩形选区的高度
 * @param {number} r 圆角的半径
 */
function roundRect(ctx, x, y, w, h, r, color) {
  // 开始绘制
  ctx.beginPath()
  // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
  // 这里是使用 fill 还是 stroke都可以，二选一即可
  ctx.setFillStyle(color)
  // ctx.setStrokeStyle('transparent')
  // 左上角
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

  // border-top
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.lineTo(x + w, y + r)
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

  // border-right
  ctx.lineTo(x + w, y + h - r)
  ctx.lineTo(x + w - r, y + h)
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

  // border-bottom
  ctx.lineTo(x + r, y + h)
  ctx.lineTo(x, y + h - r)
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

  // border-left
  ctx.lineTo(x, y + r)
  ctx.lineTo(x + r, y)

  // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
  ctx.fill()
  // ctx.stroke()
  ctx.closePath()
  // 剪切
  // ctx.clip()
}
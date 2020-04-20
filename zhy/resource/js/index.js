var barcode = require('./barcode');
var qrcode = require('./qrcode');
const app = getApp();
function convert_length(length) {
  return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height) {
  barcode.code128(wx.createCanvasContext(id), code, convert_length(width), convert_length(height))
}

function qrc(id, code, width, height) {
  if (app.app_type && app.app_type == "wechat") {
    var Vue = require('vue').default;
    Vue.nextTick(() => {
      var ctx = wx.createCanvasContext(id);
      if (ctx) {
        qrcode.api.draw(code, {
          ctx: ctx,
          width: convert_length(width),
          height: convert_length(height)
        })
      }
    })
  }
  else {
    var ctx = wx.createCanvasContext(id);
    if (ctx) {
      qrcode.api.draw(code, {
        ctx: ctx,
        width: convert_length(width),
        height: convert_length(height)
      })
    }
  }

}

module.exports = {
  barcode: barc,
  qrcode: qrc
}
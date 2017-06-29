//app.js
var enc = require("utils/MD5_UTF8.js");
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    server_url_local: "http://localhost:8080/umer/",
    server_url: "https://www.iumer.top/umer/"
  },
  encode: function(data) {
    if (!data) {
      return {};      	
    } else {
      var data_obj = data
      var keys = Object.keys(data_obj).sort();
      // console.log(keys);
      var param_str = "";
      var data_processed = {};
      for (var i = 0; i < keys.length; i++) {
        if (!keys[i] || !data_obj[keys[i]]) {
          continue;
        }
        data_processed[keys[i]] = data_obj[keys[i]];
        param_str += keys[i] + "=" + data_obj[keys[i]] + "&";
      }
      var key_ = "037F6F3127604B4FAE8AAD1AE4BE78E3";
      //var key = "037Z6Z3127604N4ZKW8KKT1KW4NW78W3";
      //var key_ = SwapSpaces(HTMLEscape(Affine(-1, key, 3, 10)));
      //console.log(key_)
      param_str += "key=" + key_;
      var sign = enc.md5(param_str).toUpperCase();
      //console.log(sign);
      data_processed["sign"] = sign;
      // arguments[1].data = JSON.stringify(data_processed);
      //console.log(arguments[1].data)
      return data_processed;
    }
  }
})
// pages/login/login.js
var app = getApp();
Page({
  data:{
    remember: wx.getStorageSync('remember') || false,
    rememberAccount: wx.getStorageSync('rememberAccount') || "",
    rememberPwd: wx.getStorageSync('rememberPwd') || "",
    account: "",
    pwd: ""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  accountInput: function(e){
    var value = e.detail.value;
    this.setData({
      account: value
    });
    //console.log(this.data)
  },
  pwdInput: function(e) {
    var value = e.detail.value;
    this.setData({
      pwd: value
    });
  },
  login: function(){
    if (!this.data.account && !this.data.rememberAccount ) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'success',
        duration: 5000
      });
      return false;
    }
    if (!this.data.pwd && !this.data.rememberPwd) {
      wx.showToast({
        title: '请输入密码',
        icon: 'success',
        duration: 5000
      });
      return false;
    }
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/customer/sys/user/login', 
      data: {
        "phone": that.data.account || that.data.rememberAccount,
        "password": that.data.pwd || that.data.rememberPwd
      },
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          var data = res.data.data;
          if (that.data.remember) {
            wx.setStorageSync('remember', true);
            wx.setStorageSync('rememberAccount', that.data.account);
            wx.setStorageSync('rememberPwd', that.data.pwd);
          } else {
            wx.removeStorageSync('remember');
            wx.removeStorageSync('rememberAccount');
            wx.removeStorageSync('rememberPwd');
          }
          wx.setStorageSync('id', data.id || "");
          wx.setStorageSync("name", data.name || "");
          wx.setStorageSync("phone", data.phone || "");
          wx.setStorageSync("password", data.password || "");
          wx.setStorageSync("header", data.header || "");
          wx.setStorageSync("sex", data.sex == 0? 0: data.sex == 1? 1: "");
          wx.setStorageSync("birthday", data.birthday || "");
          wx.setStorageSync("X-TOKEN", data.token || "");
          wx.setStorageSync("alias", data.alias || "");
          wx.setStorageSync("authCode", data.authCode || "");
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function(res){
              // success
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          });
        } else {
          
        }
      },
      fail: function(res) {
        console.log("login fail")
      },
      complete: function(res) {
        console.log("login complete")
      }
    });
  },
  rememberPwd: function(e) {
    this.setData({
      remember: e.detail.value == 'rem'
    })
  }
});
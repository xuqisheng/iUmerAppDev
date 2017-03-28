var app = getApp();
var enc = require("../../utils/MD5_UTF8.js");
var timer;
Page({
  data:{
    sec: 0,
    showTimer: false,
    phoneValid: false,
    codeValid: false,
    pwdValid: false
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
    clearInterval(timer);
  },
  checkPhone: function(e) {
    var phone = e.detail.value;
    var result = phone.match(/^1\d{10}$/);
    this.setData({
       phoneValid: !!result,
       phone: phone
    });
  },
  getCode: function() {
    if (!this.data.phoneValid) {
      wx.showModal({
        title: '提示',
        content: '请输入合法的手机号',
        showCancel: false,
        confirmColor: '#FD8CA3',
        success: function(res) {
          if (res.confirm) {
            
          }
        }
      });
      return false;
    }
    if (this.data.showTimer) {
      return false;
    }
    var that = this;
    wx.request({
      url: 'https://www.iumer.cn/umer/webService/common/authPhone',
      data: app.encode({
        "phone": that.data.phone,
        "type": 3, //顾客
        "operationType": 1 //注册
      }),
      method: 'POST',
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        if (res.data.code == 1) {
          wx.showModal({
            title: '提示',
            content: '验证码已发送，请注意查收',
            showCancel: false,
            confirmColor: '#FD8CA3',
            success: function(res) {
              if (res.confirm) {
                
              }
            }
          });
          that.setData({
            showTimer: true
          });
          var sentTime = new Date().getTime();
          timer = setInterval(function() {
            var nowTime = new Date().getTime();
            var diff = 60 * 1000 + sentTime - nowTime;
            var diffMin = parseInt((diff / 1000 / 60) % 60);
            var diffSec = parseInt((diff / 1000) % 60);
            // console.log(diff)
            if (diff <= 0) {
              // 15分钟内未支付取消订单
              clearInterval(timer);
              that.setData({
                showTimer: false
              })
            } else {
              that.setData({
                sec: diffSec 
              });
            }
          }, 1000);  
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.desc,
            confirmColor: '#FD8CA3',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                
              }
            }
          })
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  checkVerifyCode: function(e) {
    var code = e.detail.value;
    var result = code.match(/^\d{6}$/);
    this.setData({
       codeValid: !!result,
       code: code
    });
  },
  inputPwd: function(e){
    this.setData({
      pwd: e.detail.value,
      pwdValid: e.detail.value && e.detail.value == this.data.pwdVerify && e.detail.value.length >= 6 && e.detail.value.length <= 16
    })
  },
  inputPwdVerify: function(e){
    this.setData({
      pwdVerify: e.detail.value,
      pwdValid: e.detail.value && e.detail.value == this.data.pwd && e.detail.value.length >= 6 && e.detail.value.length <= 16
    })
  },
  register: function(){
    if (!this.data.phoneValid){
      wx.showModal({
        title: '提示',
        content: "请输入正确的手机号",
        confirmColor: '#FD8CA3',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            
          }
        }
      });
      return false;
    }
    if (!this.data.codeValid) {
      wx.showModal({
        title: '提示',
        content: "请输入正确的验证码",
        confirmColor: '#FD8CA3',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            
          }
        }
      });
      return false;
    } 
    if (!this.data.pwdValid) {
        wx.showModal({
          title: '提示',
          content: "请输入合法的密码",
          confirmColor: '#FD8CA3',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              
            }
          }
        });
      return false;
    }
    if (this.data.pwd.length < 6 || this.data.pwd.length > 16) {
      wx.showModal({
        title: '提示',
        content: "请输入6-16位密码",
        confirmColor: '#FD8CA3',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            
          }
        }
      });
      return false;
    } 
    var that = this;
    var pwd = enc.md5(that.data.pwd);
    pwd = pwd.substring(2, pwd.length) + pwd.substring(0, 2);
    wx.request({
        url: app.globalData.server_url + 'webService/customer/sys/user/register', 
        data: app.encode({
          phone: that.data.phone,
          password: pwd,
          openId: wx.getStorageSync('openId'),
        	authCode: that.data.code
        }),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            wx.showModal({
              title: '提示',
              confirmColor: '#FD8CA3',
              showCancel: false,
              content: res.data.desc,
              success: function(res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../login/authorize',
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
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              confirmColor: '#FD8CA3',
              showCancel: false,
              content: res.data.desc,
              success: function(res) {
                if (res.confirm) {
                  
                }
              }
            })
          }
        },
        fail: function(res) {
          console.log("searchShopList fail")
        },
        complete: function(res) {
          console.log("searchShopList complete")
        }
    });
  }
})
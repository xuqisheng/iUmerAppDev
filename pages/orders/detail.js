// pages/orders/detail.js
var app = getApp();

Page({
  data:{
    min: 0,
    sec: 0,
    showTimer: false,
    showModal: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderNo: options.orderNo || 'DD5835963228129030'
    });
    this.loadOrder();
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
  loadOrder: function(){
    var orderNo = this.data.orderNo;
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/order/orderDetail', 
        data: {
          orderNo: orderNo,
          customerId: wx.getStorageSync('id')
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;',
           'X-Token': wx.getStorageSync('X-TOKEN'),
           'X-Type': 3
        },
        success: function(res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            that.setData({
              orderInfo: data
            });
            var orderTime = new Date(data.orderTime).getTime();
            if (data.approveStatus == 0) {
              that.setData({
                showTimer: true
              })
              var timer = setInterval(function() {
                var nowTime = new Date().getTime();
                var diff = orderTime - nowTime;
            	  var diffMin = parseInt((diff / 1000 / 60) % 60);
            	  var diffSec = parseInt((diff / 1000) % 60);
                if (diff <= 0) {
                  // 15分钟内未支付取消订单
                  wx.request({
                    url: app.globalData.server_url + 'webService/customer/biz/reserve/cancelOrder', 
                    data: {
                      orderNo: orderNo,
                      customerId: wx.getStorageSync('id')
                    },
                    method: "POST",
                    dataType: "json",
                    header: {
                      'Content-Type': 'application/json;charset=UTF-8;',
                      'X-Token': wx.getStorageSync('X-TOKEN'),
                      'X-Type': 3
                    },
                    success: function(res) {
                      if (res.data.code == 1) {
                        var data = res.data.data;
                        wx.showToast({
                          title: '订单未在15分钟内支付，已取消',
                          icon: 'success',
                          duration: 5000
                        }); 
                        that.setData({
                          showTimer: false
                        })
                      } else if (res.data.code == -4) {
                        wx.navigateTo({
                          url: '../login/login',
                          success: function(res){
                            // success
                          },
                          fail: function() {
                            // fail
                          },
                          complete: function() {
                            // complete
                          }
                        })
                      }
                    },
                    fail: function(res) {
                      console.log("orderDetail - loadOrder fail")
                    },
                    complete: function(res) {
                      console.log("orderDetail - loadOrder complete")
                    }
                });
                } else {
                  that.setData({
                    min: diffMin,
                    sec: diffSec 
                  });
                }
              }, 1000);
            }            
          } else if (res.data.code == -4) {
            wx.navigateTo({
              url: '../login/login',
              success: function(res){
                // success
              },
              fail: function() {
                // fail
              },
              complete: function() {
                // complete
              }
            })
          }
        },
        fail: function(res) {
          console.log("orderDetail - loadOrder fail")
        },
        complete: function(res) {
          console.log("orderDetail - loadOrder complete")
        }
    });
  },
  showQRCode: function() {
    this.setData({
      showModal: true
    });
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/order/payQRDetail', 
        data: {
          orderNo: that.data.orderNo,
          customerId: wx.getStorageSync('id')
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;',
           'X-Token': wx.getStorageSync('X-TOKEN'),
           'X-Type': 3
        },
        success: function(res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            that.setData({
              qrImg: data.qrPath,
              qrTxt: data.payCode
            });
          } else if (res.data.code == -4) {
            wx.navigateTo({
              url: '../login/login',
              success: function(res){
                // success
              },
              fail: function() {
                // fail
              },
              complete: function() {
                // complete
              }
            })
          }
        },
        fail: function(res) {
          console.log("orderDetail - loadQr fail")
        },
        complete: function(res) {
          console.log("orderDetail - loadQr complete")
        }
    });
  },
  hideQRCode: function() {
    this.setData({
      showModal: false
    })
  },
  callPersonnel: function (e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  }
})
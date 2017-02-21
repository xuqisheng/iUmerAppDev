var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderNo: options.orderNo
    });
    this.loadOrder();
    this.loadPaymentMethods();
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
  loadOrder: function() {
    var that = this;
    var orderNo = this.data.orderNo;
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
          that.setData({
            orderInfo: res.data.data
          });
        } else if (res.data.code == -4) {
          wx.navigateTo({
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
          })
        } else {
          
        }
      },
      fail: function(res) {
        console.log("pay - loadOrder fail")
      },
      complete: function(res) {
        console.log("pay - loadOrder complete")
      }
    });
  },
  loadPaymentMethods: function() {
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/common/payMode', 
      data: {
        type: 2
      },
      method: "POST",
      dataType: "json",
      header: {
          'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            paymentMethods: res.data.data
          });
        } else {
          
        }
      },
      fail: function(res) {
        console.log("pay - loadPaymentMethods fail")
      },
      complete: function(res) {
        console.log("pay - loadPaymentMethods complete")
      }
    });
  },
  choosePayment: function(e) {
    var paymentType = e.currentTarget.dataset.type;
    this.setData({
      selected: paymentType
    });
  },
  pay: function() {
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/pay/wechatSubmitPay', 
      data: {
        "orderNo": that.data.orderNo,
        "paymentMode": that.data.selected,
        "customerId": wx.getStorageSync('id'),
        "openId": wx.getStorageSync('openId') || 'oV4G3v6BcECno8Z0XGtMt6ex7Eqk'
      },
      method: "POST",
      dataType: "json",
      header: {
          'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        var res = (typeof(res.data) == "object")? res.data: JSON.parse(res.data);
        if (res.code == 1) {
          if (that.data.selected == "offline"){
            wx.redirectTo({
              url: 'detail?orderNo=' + res.data,
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
			    } else if(that.data.selected == "yetbuy") {
              wx.redirectTo({
                url: 'detail?orderNo=' + res.data,
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
          } else if (that.data.selected == "alipay") {
            
          } else if (that.data.selected == "wechat") {
            wx.requestPayment({
              'timeStamp': res.data.timeStamp,
              'nonceStr': res.data.nonceStr,
              'package': res.data.packAge,
              'signType': 'MD5',
              'paySign': res.data.sign,
              'success':function(res) {
                wx.redirectTo({
                  url: 'detail?paySign=1&orderNo=' + that.data.orderNo,
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
              },
              'fail':function(res) {
              
              }
            });
          }
        } else {
          
        }
      },
      fail: function(res) {
        console.log("pay - loadPaymentMethods fail")
      },
      complete: function(res) {
        console.log("pay - loadPaymentMethods complete")
      }
    });
  }
})
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
      // orderNo: options.orderNo,
      // orderNo: 'DD5835963228129030' // 取消中 5
      // orderNo: 'DD5710593313463820' // 待评价 2
      // orderNo: 'DD2433910090490640' // 已评价 3
      // orderNo: 'DD5836271871488530' // 已取消 4
      orderNo: 'DD5819284514093920' // 进行中 1
      // orderNo: 'DD5819196003434350' // 待付款 0
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
                        wx.showModal({
                          title: '提示',
                          content: '订单未在15分钟内支付，已取消',
                          showCancel: false,
                          success: function() {
                            wx.redirectTo({
                              url: 'detail',
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
  },
  cancelOrder: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否取消订单？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.server_url + 'webService/customer/biz/reserve/cancelOrder', 
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
                wx.showModal({
                  title: '提示',
                  content: '订单已取消',
                  showCancel: false,
                  success: function() {
                    wx.redirectTo({
                      url: 'detail',
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
              } else if (res.data.code == 0){
                wx.showToast({
                  title: res.data.desc,
                  icon: 'success',
                  duration: 5000
                }); 
              }
            },
            fail: function(res) {
              console.log("orderDetail - loadOrder fail")
            },
            complete: function(res) {
              console.log("orderDetail - loadOrder complete")
            }
        });
        }
      }
    });
  },
  applyCancelOrder: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否申请取消订单？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.server_url + 'webService/customer/biz/reserve/applyCancelOrder', 
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
                wx.showModal({
                  title: '提示',
                  content: '已申请取消订单',
                  showCancel: false,
                  success: function() {
                    wx.redirectTo({
                      url: 'detail',
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
              } else if (res.data.code == 0){
                wx.showToast({
                  title: res.data.desc,
                  icon: 'success',
                  duration: 5000
                }); 
              }
            },
            fail: function(res) {
              console.log("orderDetail - loadOrder fail")
            },
            complete: function(res) {
              console.log("orderDetail - loadOrder complete")
            }
          });
        }
      }
    })
  },
  orderDone: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '订单是否已完成？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.server_url + 'webService/customer/biz/order/confirmFinishOrder', 
            data: {
              orderNo: that.data.orderNo,
              customerId: wx.getStorageSync('id'),
              personnelId: that.data.orderInfo.personnelId
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
                wx.showModal({
                  title: '提示',
                  content: '订单已确认完成',
                  showCancel: false,
                  success: function() {
                    wx.redirectTo({
                      url: 'detail',
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
              } else if (res.data.code == 0){
                wx.showToast({
                  title: res.data.desc,
                  icon: 'success',
                  duration: 5000
                }); 
              }
            },
            fail: function(res) {
              console.log("orderDetail - loadOrder fail")
            },
            complete: function(res) {
              console.log("orderDetail - loadOrder complete")
            }
          });   
        }
      }
    });
  }
})
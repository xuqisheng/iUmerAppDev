// pages/orders/detail.js
var app = getApp();
var timer;
Page({
  data:{
    min: 0,
    sec: 0,
    showTimer: false,
    showModal: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    this.setData({
      orderNo: options.orderNo
      // orderNo: 'DD5835963228129030' // 取消中 5
      // orderNo: 'DD5710593313463820' // 待评价 2
      // orderNo: 'DD2433910090490640' // 已评价 3
      // orderNo: 'DD5836271871488530' // 已取消 4
      // orderNo: 'DD5819284514093920' // 进行中 1
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
    console.log("unload");
    clearInterval(timer);
  },
  loadOrder: function(){
    wx.showNavigationBarLoading();
    var orderNo = this.data.orderNo;
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/order/orderDetail', 
        data: app.encode({
          orderNo: orderNo,
          customerId: wx.getStorageSync('id')
        }),
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
            var orderTime = new Date(data.orderTime.replace(new RegExp(/-/g),'/')).getTime();
            if (data.approveStatus == 0) {
              that.setData({
                showTimer: true
              })
              timer = setInterval(function() {
                var nowTime = new Date().getTime();
                var diff = 15 * 60 * 1000 + orderTime - nowTime;
            	  var diffMin = parseInt((diff / 1000 / 60) % 60);
            	  var diffSec = parseInt((diff / 1000) % 60);
                // console.log(diff)
                if (diff <= 0) {
                  // 15分钟内未支付取消订单
                  clearInterval(timer);
                  wx.request({
                    url: app.globalData.server_url + 'webService/customer/biz/reserve/cancelOrder', 
                    data: app.encode({
                      orderNo: orderNo,
                      customerId: wx.getStorageSync('id')
                    }),
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
                          confirmColor: '#FD8CA3',
                          content: '订单未在15分钟内支付，已取消',
                          showCancel: false,
                          success: function() {
                            wx.redirectTo({
                              url: 'detail?orderNo=' + orderNo,
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
                        wx.showModal({
                          title: '提示',
                          content: res.data.desc,
                          confirmColor: '#FD8CA3',
                          showCancel: false,
                          success: function() {
                            
                          }
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
            wx.showModal({
              title: '提示',
              content: res.data.desc,
              confirmColor: '#FD8CA3',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  
                }
              }
            });
          } 
        },
        fail: function(res) {
          console.log("orderDetail - loadOrder fail")
        },
        complete: function(res) {
          console.log("orderDetail - loadOrder complete")
          wx.hideNavigationBarLoading();
        }
    });
  },
  showQRCode: function() {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/order/payQRDetail', 
        data: app.encode({
          orderNo: that.data.orderNo,
          customerId: wx.getStorageSync('id')
        }),
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
              qrTxt: data.payCode,
              showModal: true
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
            wx.showModal({
              title: '提示',
              content: res.data.desc,
              confirmColor: '#FD8CA3',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  
                }
              }
            });
          } 
        },
        fail: function(res) {
          console.log("orderDetail - loadQr fail")
        },
        complete: function(res) {
          console.log("orderDetail - loadQr complete")
          wx.hideNavigationBarLoading();
        }
    });
  },
  hideQRCode: function() {
    var that = this;
    wx.redirectTo({
      url: '../orders/detail?orderNo=' + that.data.orderNo,
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
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
      confirmColor: '#FD8CA3',
      success: function(res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          wx.request({
            url: app.globalData.server_url + 'webService/customer/biz/reserve/cancelOrder', 
            data: app.encode({
              orderNo: that.data.orderNo,
              customerId: wx.getStorageSync('id')
            }),
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
                  content: res.data.desc,
                  showCancel: false,
                  success: function() {
                    wx.redirectTo({
                      url: 'detail?orderNo=' + that.data.orderNo,
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
              } else if (res.data.code == 0){
                wx.showModal({
                  title: '提示',
                  content: res.data.desc,
                  showCancel: false,
                  success: function() {
                    
                  }
                }); 
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.desc,
                  confirmColor: '#FD8CA3',
                  showCancel: false,
                  success: function() {
                    
                  }
                });
              }
            },
            fail: function(res) {
              console.log("orderDetail - loadOrder fail")
            },
            complete: function(res) {
              console.log("orderDetail - loadOrder complete")
              wx.hideNavigationBarLoading();
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
      content: '是否取消订单？',
      confirmColor: '#FD8CA3',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.server_url + 'webService/customer/biz/reserve/applyCancelOrder', 
            data: app.encode({
              orderNo: that.data.orderNo,
              customerId: wx.getStorageSync('id')
            }),
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
                  content: res.data.desc,
                  showCancel: false,
                  success: function() {
                    wx.redirectTo({
                      url: 'detail?orderNo=' + that.data.orderNo,
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
              } else if (res.data.code == 0){
                wx.showModal({
                  title: '提示',
                  content: res.data.desc,
                  showCancel: false,
                  success: function() {
                    
                  }
                });
              } else {
                wx.showModal({
                  title: '提示',
                  confirmColor: '#FD8CA3',
                  content: res.data.desc,
                  showCancel: false,
                  success: function() {
                    
                  }
                });
              }
            },
            fail: function(res) {
              console.log("orderDetail - loadOrder fail")
            },
            complete: function(res) {
              console.log("orderDetail - loadOrder complete")
              wx.hideNavigationBarLoading();
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
      confirmColor: '#FD8CA3',
      content: '订单是否已完成？',
      success: function(res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          wx.request({
            url: app.globalData.server_url + 'webService/customer/biz/order/confirmFinishOrder', 
            data: app.encode({
              orderNo: that.data.orderNo,
              customerId: wx.getStorageSync('id'),
              personnelId: that.data.orderInfo.personnelId
            }),
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
                  confirmColor: '#FD8CA3',
                  content: '订单已确认完成',
                  showCancel: false,
                  success: function() {
                    wx.redirectTo({
                      url: 'detail?orderNo=' + that.data.orderNo,
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
              } else if (res.data.code == 0){
                wx.showModal({
                  title: '提示',
                  content: res.data.desc,
                  confirmColor: '#FD8CA3',
                  showCancel: false,
                  success: function() {
                    
                  }
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: res.data.desc,
                  confirmColor: '#FD8CA3',
                  showCancel: false,
                  success: function() {
                    
                  }
                });
              }
            },
            fail: function(res) {
              console.log("orderDetail - loadOrder fail")
            },
            complete: function(res) {
              console.log("orderDetail - loadOrder complete")
              wx.hideNavigationBarLoading();
            }
          });   
        }
      }
    });
  },
  addComment: function() {
    var that = this;
    wx.navigateTo({
      url: "comment?orderNo=" + that.data.orderNo,
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
  payOrder: function() {
    var that = this;
    wx.navigateTo({
      url: "pay?orderNo=" + that.data.orderNo,
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
  orderAgain: function(){
    var that = this;
    if (!wx.getStorageSync('id')) {
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
      return false;
    }
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/reserve/personnelServeProject', 
      data: app.encode({
        projectId: that.data.orderInfo.projectId,
        personnelId: that.data.orderInfo.personnelId
      }),
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;',
        'X-Token': wx.getStorageSync('X-TOKEN'),
        'X-Type': 3
      },
      success: function(res) {
        if (res.data.code == 1) {
          wx.redirectTo({
            url: '../quickAppoint/appoint?orderNo=' + that.data.orderNo + '&personnelId=' + that.data.orderInfo.personnelId + '&projectId=' + that.data.orderInfo.projectId,
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
          wx.showModal({
            title: '提示',
            content: res.data.desc,
            confirmColor: '#FD8CA3',
            showCancel: false,
            success: function() {
              
            }
          });
        }
      }
    });
  }
})
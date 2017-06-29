// pages/orders/comment.js
var app = getApp();
Page({
  data: {
    levelProfession: 0,
    levelProfession2: 0,
    levelService: 0,
    levelCommunication: 0,
    txt: "",
    chosenLabels: {},
    labels: ['用料足', '手法好', '态度好', '商家服务好'],
    anonymous: false,
    picList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderNo: options.orderNo
    });
    this.loadOrder();
    wx.setNavigationBarTitle({
      title: '评价'
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  loadOrder: function () {
    wx.showNavigationBarLoading();
    var that = this;
    var orderNo = this.data.orderNo;
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
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            orderInfo: res.data.data,
            projectId: res.data.data.projectId,
            personnelId: res.data.data.personnelId
          });
        } else if (res.data.code == -4) {
          wx.navigateTo({
            url: '../login/authorize',
            success: function (res) {
              // success
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.desc,
            confirmColor: '#FF0175',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              }
            }
          });
        }
      },
      fail: function (res) {
        console.log("orderDetail - loadOrder fail")
      },
      complete: function (res) {
        console.log("orderDetail - loadOrder complete")
        wx.hideNavigationBarLoading();
      }
    });
  },
  txtInput: function (e) {
    this.setData({
      txt: e.detail.value
    });
  },
  chooseLevelProfession: function (e) {
    var level = e.currentTarget.dataset.level;
    this.setData({
      levelProfession: level + 1
    });
  },
  chooseLevelProfession2: function (e) {
    var level = e.currentTarget.dataset.level;
    this.setData({
      levelProfession2: level + 1
    });
  },
  chooseLevelService: function (e) {
    var level = e.currentTarget.dataset.level;
    this.setData({
      levelService: level + 1
    });
  },
  chooseLevelCommunication: function (e) {
    var level = e.currentTarget.dataset.level;
    this.setData({
      levelCommunication: level + 1
    });
  },
  checkboxChange: function(e) {
    this.setData({
      anonymous: e.detail.value[0] == "1"
    })
  },
  submitOrder: function () {
    var that = this;
    if (this.data.levelProfession == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择项目评分！',
        confirmColor: '#FF0175',
        success: function (res) {

        }
      });
      return false;
    }
    if (!this.data.txt) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入评价！',
        confirmColor: '#FF0175',
        success: function (res) {

        }
      });
      return false;
    }
    if (this.data.levelProfession2 == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择专业评分！',
        confirmColor: '#FF0175',
        success: function (res) {

        }
      });
      return false;
    }
    if (this.data.levelService == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmColor: '#FF0175',
        content: '请选择服务评分！',
        success: function (res) {

        }
      });
      return false;
    }
    if (this.data.levelCommunication == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmColor: '#FF0175',
        content: '请选择沟通评分！',
        success: function (res) {

        }
      });
      return false;
    }
    var chosenLabelsKeys = Object.keys(that.data.chosenLabels);
    var labels = "";
    for (var i = 0; i < chosenLabelsKeys.length; i++) {
      var key = chosenLabelsKeys[i];
      if (that.data.chosenLabels[key]) {
        labels += that.data.labels[key] + ",";
      }
    }
    labels = labels.substring(0, labels.length - 1);
    
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/order/orderComment',
      data: app.encode({
        "customerId": wx.getStorageSync('id'),
        "personnelId": that.data.personnelId,
        "projectId": that.data.projectId,
        "content": that.data.txt,
        "projectLevel": that.data.levelProfession,
        "domainLevel": that.data.levelProfession2,
        "serveLevel": that.data.levelService,
        "communicationLevel": that.data.levelCommunication,
        "orderNo": that.data.orderNo,
        "anonymity": that.data.anonymous? '0': '1',
        "label": labels
      }),
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;',
        'X-Token': wx.getStorageSync('X-TOKEN'),
        'X-Type': 3
      },
      success: function (res) {
        // console.log(res.data)
        var d = res.data;
        if (d.code == 1) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            confirmColor: '#FF0175',
            content: '评价提交成功！',
            success: function (res) {
              wx.switchTab({
                url: 'orders',
                success: function (res) {
                  // success
                },
                fail: function () {
                  // fail
                },
                complete: function () {
                  // complete
                }
              })
            }
          });
        } else if (d.code == -4) {
          wx.navigateTo({
            url: '../login/authorize',
            success: function (res) {
              // success
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          });
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: d.desc,
            confirmColor: '#FF0175',
            success: function (res1) {

            }
          });
        }
      },
      fail: function (res) {
        console.log("submitOrder fail");
      },
      complete: function (res) {
        console.log("submitOrder complete");
        wx.hideNavigationBarLoading();
      }
    });
  },
  toggleLabel: function(e) {
    var labelId = e.currentTarget.dataset.labelid;
    var chosen = this.data.chosenLabels;
    chosen[labelId] = !chosen[labelId];
    this.setData({
      chosenLabels: chosen
    })
  },
  chooseImage: function(){
    var that = this;
    wx.chooseImage({
      count: 4 - that.data.picList.length,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          picList: that.data.picList.concat(tempFilePaths)
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  removeImage: function(e) {
    var imageIdx = e.currentTarget.dataset.imageid;
    this.data.picList.splice(imageIdx, 1);
    this.setData({
      picList: this.data.picList
    });
  }
})
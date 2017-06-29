// pages/my/my.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCustomerInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  getCustomerInfo: function() {
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/customer/sys/user/customerInfo',
      data: app.encode({
        id: wx.getStorageSync('id')
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
            customerInfo: res.data.data
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
            confirmColor: '#FD8CA3',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              }
            }
          });
        }
      },
      fail: function (res) {
        console.log("my - customerInfo fail")
      },
      complete: function (res) {
        console.log("my - customerInfo complete")
        wx.hideNavigationBarLoading();
      }
    })
  },

  showOrders: function(){
    wx.navigateTo({
      url: '../orders/orders',
    })
  },

  showCards: function() {
    wx.showModal({
      title: '提示',
      content: '功能尚未开放...',
      confirmColor: '#ff0175',
      showCancel: false
    })
    return;
    wx.navigateTo({
      url: '../my/cards',
    })
  },

  logout: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      confirmColor: '#FF0175',
      content: "您确定要登出吗?",
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('id');
          wx.removeStorageSync("name");
          wx.removeStorageSync("phone");
          wx.removeStorageSync("password");
          wx.removeStorageSync("header");
          wx.removeStorageSync("sex");
          wx.removeStorageSync("birthday");
          wx.removeStorageSync("X-TOKEN");
          wx.removeStorageSync("alias");
          wx.removeStorageSync("authCode");
          that.setData({
            login: false
          });
          wx.switchTab({
            url: '../index/index',
          })
        }
      }
    });
  },

  changePhone: function () {
    wx.showModal({
      title: '提示',
      content: '功能尚未开放...',
      confirmColor: '#ff0175',
      showCancel: false
    })
    return;
    
  }
})
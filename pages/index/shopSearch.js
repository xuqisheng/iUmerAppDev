// pages/index/indexSearch.js
var app = getApp();
Page({
  data:{
    shopList: [],
    timestampFirst: 0,
    timestampLast: 0,
    loadingHidden: true,
    loadMoreTimeStamp: 0,
    refreshTimeStamp: 0,
    clickShopItemTimeStamp: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      value: options.value || ""
    })
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
  back: function(e) {
    wx.redirectTo({
      url: 'indexSearch',
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
  inputSearch: function(e) {
    var value = e.detail.value.trim();
    this.setData({
      value: value
    })
    this.searchShop("", value);
  },
  searchShop: function(operationType, value) {
    wx.showNavigationBarLoading();
    var that = this;
    var data = {};
    if (operationType) {
      data["operationType"] = operationType;
      switch (operationType) {
        case "up": data["timestamp"] = this.data.timestampLast; break;
        case "down": data["timestamp"] = this.data.timestampFirst; break;
      }
    }
    data["pageSize"] = 10;
    data["shopName"] = value;
    data["cityId"] = wx.getStorageSync('cityCode');
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/searchShopList', 
        data: app.encode(data),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            if (res.data.data.length == 0 && !operationType) {
              that.setData({
                shopList: [],
                loadingHidden: true
              })
              return false;
            }
            var list = operationType == "down"? res.data.data.concat(that.data.shopList): operationType == "up"? that.data.shopList.concat(res.data.data): res.data.data;
            that.setData({
              shopList: list,
              timestampFirst: list[0].createDate,
              timestampLast: list[list.length - 1].createDate
            });
            if (list.length < 10 || res.data.data.length < 10) {
              that.setData({
                loadingHidden: true
              })
            } else {
              that.setData({
                loadingHidden: false
              })
            }
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
          console.log("searchShopList fail")
        },
        complete: function(res) {
          console.log("searchShopList complete")
          wx.hideNavigationBarLoading();
        }
    });
  },
  clickShopItem: function(e){
    var shopId = e.currentTarget.dataset.shopid;
    var timestamp = e.timeStamp;
    if (timestamp - this.data.clickShopItemTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: 'shopDetail?shopId=' + shopId,
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
    this.setData({
      clickShopItemTimeStamp: timestamp
    })
  },
  loadMore: function(e) {
    console.log("loadMore");
    //console.log(e.timeStamp + " " + this.data.scrollTimeStamp)
    var timestamp = e.timeStamp;
    if (timestamp - this.data.loadMoreTimeStamp < 500) {

    } else {
      this.searchShop("up", this.data.value);
    }
    this.setData({
      loadMoreTimeStamp: timestamp
    });
  },
  refresh: function(e){
    console.log("refresh");
    var timestamp = e.timeStamp;
    if (timestamp - this.data.refreshTimeStamp < 500) {

    } else {
      this.searchShop("down", this.data.value);
    }
    this.setData({
      refreshTimeStamp: timestamp
    })
  }
})
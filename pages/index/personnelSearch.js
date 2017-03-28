// pages/index/indexSearch.js
var app = getApp();
Page({
  data:{
    personnelList: [],
    timestampFirst: 0,
    timestampLast: 0,
    loadingHidden: true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      value: options.value || "",
      'from': options.from || ""
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
    if (this.data.from == "index"){
      wx.switchTab({
        url: 'index',
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
    }
  },
  inputSearch: function(e) {
    var value = e.detail.value.trim();
    this.setData({
      value: value
    })
    this.searchPersonnel("", value);
  },
  searchPersonnel: function(operationType, value) {
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
    data["personnelName"] = value;
    data["cityId"] = wx.getStorageSync('cityCode');
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/searchPersonnelList', 
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
                personnelList: [],
                loadingHidden: true
              });
              return false;
            }
            var list = operationType == "down"? res.data.data.concat(that.data.personnelList): operationType == "up"? that.data.personnelList.concat(res.data.data): res.data.data;
            that.setData({
              personnelList: list,
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
              showCancel: false,
              content: res.data.desc,
              success: function(res1) {
                
              }
            });
          }
        },
        fail: function(res) {
          console.log("indexSearch - searchPersonnel fail")
        },
        complete: function(res) {
          console.log("indexSearch - searchPersonnel complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  clickPersonnelItem: function(e){
    var personnelId = e.currentTarget.dataset.personnelid;
    // console.log(projectId)
    wx.navigateTo({
      url: 'personnelDetail?personnelId=' + personnelId,
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
  },
  loadMore: function(e) {
    console.log("loadMore");
    this.searchPersonnel("up", this.data.value);
  },
  refresh: function(e){
    console.log("refresh");
    this.searchPersonnel("down", this.data.value);
  }
})
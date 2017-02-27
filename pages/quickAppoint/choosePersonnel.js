// pages/quickAppoint/choosePersonnel.js
var app = getApp();
Page({
  data:{
    timestampFirst: 0,
    timestampLast: 0,
    projectPersonnels: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      projectId: options.projectId,
      priceType: options.priceType
    });
    this.loadPersonnels("");
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
  back: function(){
    wx.redirectTo({
      url: 'appointPersonnel?personnelId=' + personnelId + '&projectId=' + projectId + "&priceType=" + priceType,
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
  loadPersonnels:function(operationType){
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
    data["projectId"] = this.data.projectId;
    wx.showNavigationBarLoading();
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/reserve/projectPersonnelList', 
        data: data,
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
       },
        success: function(res) {
          var res = res.data;
          if (res.code == 1) {
            if (res.data.length == 0) {
              that.setData({
                loadingHidden: true
              });
              return false;
            }
            var list = operationType == "down"? res.data.concat(that.data.projectPersonnels): operationType == "up"? that.data.projectPersonnels.concat(res.data): res.data;
            that.setData({
              projectPersonnels: list,
              timestampFirst: list[0].createDate,
              timestampLast: list[list.length - 1].createDate
            });
            if (list.length < 10 || res.data.length < 10) {
              that.setData({
                loadingHidden: true
              });
            } else {
              that.setData({
                loadingHidden: false
              });
            }
          } else {
            
          }
        },
        fail: function(res) {
          console.log("getHotProject fail")
        },
        complete: function(res) {
          console.log("complete")
          wx.hideNavigationBarLoading();
        }
    });
  },
  clickPersonnelItem: function(e) {
    var personnelId = e.currentTarget.dataset.personnelid;
    var projectId = this.data.projectId;
    var priceType = this.data.priceType;
    wx.redirectTo({
      url: 'appointPersonnel?personnelId=' + personnelId + '&projectId=' + projectId + "&priceType=" + priceType,
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
  loadMore: function(e) {
    console.log("loadMore");
    this.loadPersonnels("up");
  },
  refresh: function(e){
    console.log("refresh");
    this.loadPersonnels("down");
  }
})
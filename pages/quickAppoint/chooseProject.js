// pages/quickAppoint/chooseProject.js
var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      personnelId: options.personnelId,
      priceType: options.priceType
    });
    this.loadProjects("");
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
  loadProjects:function(operationType){
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
    data["personnelId"] = this.data.personnelId;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/reserve/personnelProjectList', 
        data: data,
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;',
           "X-Token": wx.getStorageSync('X-TOKEN'),
           "X-Type": 3
       },
        success: function(res) {
          var res = res.data;
          if (res.code == 1) {
            var list = operationType == "down"? res.data.concat(that.data.personnelProjects): operationType == "up"? that.data.personnelProjects.concat(res.data): res.data;
            that.setData({
              personnelProjects: list,
              timestampFirst: list[0].createDate,
              timestampLast: list[list.length - 1].createDate
            });
          } else if (res.code == -4) {
            console.log("TOKEN失效！")
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
          console.log("loadProjects fail")
        },
        complete: function(res) {
          console.log("complete")
        }
    });
  },
  clickProjectItem: function(e) {
    var projectId = e.currentTarget.dataset.projectid;
    var personnelId = this.data.personnelId;
    var priceType = this.data.priceType;
    wx.redirectTo({
      url: 'appointProject?personnelId=' + personnelId + '&projectId=' + projectId + "&priceType=" + priceType,
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
    this.loadProjects("up");
  },
  refresh: function(e){
    console.log("refresh");
    this.loadProjects("down");
  }
})
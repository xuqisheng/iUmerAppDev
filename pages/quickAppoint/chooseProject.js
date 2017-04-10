// pages/quickAppoint/chooseProject.js
var app = getApp();
Page({
  data:{
    timestampFirst: 0,
    timestampLast: 0,
    projectPersonnels: [],
    noDataHidden: true,
    loadMoreTimeStamp: 0,
    refreshTimeStamp: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      personnelId: options.personnelId,
      priceType: options.priceType,
      loadingHidden: true
    });
    this.loadProjects("");
    wx.setNavigationBarTitle({
      title: '选择项目'
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
  loadProjects:function(operationType){
    var that = this;
    wx.showNavigationBarLoading();
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
        data: app.encode(data),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
       },
        success: function(res) {
          var res = res.data;
          if (res.code == 1) {
            if (res.data.length == 0 && !operationType) {
              that.setData({
                loadingHidden: true,
                noDataHidden: false
              });
              return false;
            }
            var list = operationType == "down"? res.data.concat(that.data.personnelProjects): operationType == "up"? that.data.personnelProjects.concat(res.data): res.data;
            that.setData({
              personnelProjects: list,
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
          console.log("loadProjects fail")
        },
        complete: function(res) {
          console.log("complete")
          wx.hideNavigationBarLoading();
        }
    });
  },
  clickProjectItem: function(e) {
    var projectId = e.currentTarget.dataset.projectid;
    var activityId = e.currentTarget.dataset.activityid;
    var personnelId = this.data.personnelId;
    var priceType = this.data.priceType;
    wx.redirectTo({
      url: 'appointProject?personnelId=' + personnelId + '&projectId=' + projectId + "&priceType=" + priceType + "&activityId=" + activityId,
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
    var timestamp = e.timeStamp;
    if (timestamp - this.data.loadMoreTimeStamp < 500) {
       
    } else {
      this.loadProjects("up");
    }
    this.setData({
      loadMoreTimeStamp: timestamp
    })
  },
  refresh: function(e){
    console.log("refresh");
    var timestamp = e.timeStamp;
    if (timestamp - this.data.refreshTimeStamp < 500) {
       
    } else {
      this.loadProjects("down");
    }
    this.setData({
      refreshTimeStamp: timestamp
    })
  },
  back: function(){
    var personnelId = this.data.personnelId;
    var priceType = this.data.priceType;
    wx.redirectTo({
      url: 'appointProject?personnelId=' + personnelId + "&priceType=" + priceType,
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
})
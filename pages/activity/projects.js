var app = getApp();
Page({
  data:{
    timestampFirst: 0,
    timestampLast: 0,
    loadingHidden: true,
    projectList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      shopId: options.shopId,
      activityId: options.activityId
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
  back: function(){
    var that = this;
    wx.redirectTo({
      url: '../activity/activities?shopId=' + that.data.shopId,
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
  loadProjects: function(operationType) {
    wx.showNavigationBarLoading();
    var that = this;
    var data = {};
		if (operationType) {
			data["operationType"] = operationType;
			switch(operationType) {
			case "up": data["timestamp"] = that.data.timestampLast; break;
			case "down": data["timestamp"] = that.data.timestampFirst; break;
			}
		}	
		data["shopId"] = that.data.shopId;
		data["activityId"] = that.data.activityId;
		data["pageSize"] = 10;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/projectActivity/activityDetail', 
        data: data,
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            if (res.data.data.projectDtos.length == 0 && !operationType) {
              that.setData({
                projectList: [],
                loadingHidden: true
              });
              return false;
            }
            var list = operationType == "down"? res.data.data.projectDtos.concat(that.data.projectList): operationType == "up"? that.data.projectList.concat(res.data.data.projectDtos): res.data.data.projectDtos;
            that.setData({
              projectList: list,
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
          console.log("activity-projects - loadProjects fail")
        },
        complete: function(res) {
          console.log("activity-projects - loadProjects complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  clickProjectItem: function(e){
    var projectId = e.currentTarget.dataset.projectid;
    var activityId = e.currentTarget.dataset.activityid;
    // console.log(projectId)
    wx.navigateTo({
      url: '../index/projectDetail?projectId=' + projectId + "&activityId=" + activityId,
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
    this.loadProjects("up");
  },
  refresh: function(e){
    console.log("refresh");
    this.loadProjects("down");
  }
})
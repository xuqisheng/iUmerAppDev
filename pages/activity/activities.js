var app = getApp();
Page({
  data:{
    timestampFirst: 0,
    timestampLast: 0,
    loadingHidden: true,
    noDataHidden: true,
    loadMoreTimeStamp: 0,
    refreshTimeStamp: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '营销活动'
    })
    this.setData({
      shopId: options.shopId
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.loadActivities("");
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  back: function() {
    var that = this;
    wx.redirectTo({
      url: '../index/shopDetail?shopId=' + that.data.shopId,
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
  loadActivities: function(operationType) {
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
		data["pageSize"] = 10;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/projectActivity/activityList', 
        data: app.encode(data),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;',
           'X-Token': wx.getStorageSync('X-TOKEN'),
           'X-Type': 3
        },
        success: function(res) {
          if (res.data.code == 1) {
            if (res.data.data.length == 0 && !operationType) {
              that.setData({
                activityList: [],
                loadingHidden: true,
                noDataHidden: false
              });
              return false;
            }
            for (var i = 0; i < res.data.data.length; i++) {
              var date = res.data.data[i].activityStartDate.split(" ")[0] + "~" + res.data.data[i].activityEndDate.split(" ")[0];
              res.data.data[i].activityDate = date;
            }
            var list = operationType == "down"? res.data.data.concat(that.data.activityList): operationType == "up"? that.data.activityList.concat(res.data.data): res.data.data;
            that.setData({
              activityList: list,
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
              showCancel: false,
              content: res.data.desc,
              success: function(res1) {
                
              }
            });
          }
        },
        fail: function(res) {
          console.log("activity-projects - loadActivities fail")
        },
        complete: function(res) {
          console.log("activity-projects - loadActivities complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  clickActivityItem: function(e){
    var activityId = e.currentTarget.dataset.activityid;
    var that = this;
    // console.log(projectId)
    wx.redirectTo({
      url: "../activity/projects?activityId=" + activityId + "&shopId=" + that.data.shopId,
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
    var timestamp = e.timeStamp;
    if (timestamp - this.data.loadMoreTimeStamp < 500) {

    } else {
      this.loadActivities("up");
    }
    this.setData({
      loadMoreTimeStamp: timestamp
    })
  },
  refresh: function(e){
    console.log("refresh");
    if (timestamp - this.data.refreshTimeStamp < 500) {

    } else {
      this.loadActivities("down");
    }
    this.setData({
      refreshTimeStamp: timestamp
    })
  }
})
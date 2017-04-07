var app = getApp();
var timer;
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
        data: app.encode(data),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            var status = res.data.data.approveStatus;
            that.setData({
              status: status
            });
            var d = res.data.data;
            if (status == 1) {
							var activityEnd = new Date(d.activityEndDate.replace(new RegExp(/-/g),'/').replace("00:00:00", "23:59:59")).getTime();
							timer = setInterval(function(){
								var nowTime = new Date().getTime();
								var diff = activityEnd - nowTime;
								var diffDay = parseInt(diff / 1000 / 60 / 60 / 24);
								var diffHour = parseInt(diff / 1000 / 60 / 60 % 24);
                var diffMin = parseInt((diff / 1000 / 60) % 60);
                var diffSec = parseInt((diff / 1000) % 60);
                if (diff > 0) {
                  that.setData({
                      timerTxt: "距离活动结束还有：" + diffDay + "天" + diffHour + "时" + diffMin + "分" + diffSec + "秒"
                    })
                } else {
                  that.setData({
                      timerTxt: "活动结束"
                  });
                  clearInterval(timer);
                }
							}, 1000);
            } else if (status == 0) {
              var activityStart = new Date(d.activityStartDate.replace(new RegExp(/-/g),'/')).getTime();
							timer = setInterval(function(){
								var nowTime = new Date().getTime();
								var diff = activityStart - nowTime;
								var diffDay = parseInt(diff / 1000 / 60 / 60 / 24);
								var diffHour = parseInt(diff / 1000 / 60 / 60 % 24);
                var diffMin = parseInt((diff / 1000 / 60) % 60);
                var diffSec = parseInt((diff / 1000) % 60);
                if (diff > 0) {
                  that.setData({
                      timerTxt: "距离活动开始还有：" + diffDay + "天" + diffHour + "时" + diffMin + "分" + diffSec + "秒"
                    })
                } else {
                  that.setData({
                      timerTxt: "活动开始"
                  });
                  clearInterval(timer);
                }
							}, 1000);
            }
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
    var timestamp = e.timeStamp;
    if (timestamp - this.data.loadMoreTimeStamp < 500) {

    } else {
      this.loadProjects("up");
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
      this.loadProjects("down");
    }
    this.setData({
      refreshTimeStamp: timestamp
    })
  }
})
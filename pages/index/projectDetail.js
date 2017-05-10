// pages/index/projectDetail.js
var app = getApp();
var timer;
Page({
  data:{
    currTab: 0,
    currTab2: 0,
    totalCommentNum: 0,
    goodReputation: 0,
    middleReputation: 0,
    badReputation: 0,
    goodTimestampFirst: 0,
    goodTimestampLast: 0,
    middleTimestampFirst: 0,
    middleTimestampLast: 0,
    badTimestampFirst: 0,
    badTimestampLast: 0,
    goodList: [],
    middleList: [],
    badList: [],
    loadingHidden: true,
    commentTimeStamp: 0,
    showShopTimeStamp: 0
  },
  onLoad:function(options){
    console.log("projectDetail onLoad");
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      projectId: options.projectId,
      activityId: options.activityId
    });
    this.loadProject();
    this.loadComments(); 
    this.updateCommentNum();
    wx.setNavigationBarTitle({
      title: '项目详情'
    })
  },
  onReady:function(){
    console.log("projectDetail onReady");
    // 页面渲染完成
  },
  onShow:function(){
    console.log("projectDetail onShow");
    // 页面显示
  },
  onHide:function(){
    console.log("projectDetail onHide");
    // 页面隐藏
  },
  onUnload:function(){
    console.log("projectDetail onUnload");
    // 页面关闭
    clearInterval(timer);
  },
  updateCommentNum: function(){
    var that = this;
    // console.log(this.data.projectId)
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/projectCommentGroupNum', 
        data: app.encode({
          projectId: that.data.projectId
        }),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1){
            that.setData({
              totalCommentNum: res.data.data.totalReputation,
              goodReputation: res.data.data.goodReputation,
              middleReputation: res.data.data.middleReputation,
              badputation: res.data.data.badReputation            
            });
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
          console.log("updateCommentNum fail")
        },
        complete: function(res) {
          console.log("updateCommentNum complete")
        }
    });
  },
  loadComments: function() {
    wx.showNavigationBarLoading();
    // console.log("loadComments: " + this)
    var data = {};
    data["projectId"] = this.data.projectId;
    data["commentLevel"] = 3;
    data["pageSize"] = 3;
    // console.log(data)
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/projectCommentList', 
        data: app.encode(data),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1){
            if (res.data.data.length == 0) {
              return false;
            }
            that.setData({
              commentList: res.data.data,
            });
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
          console.log("loadComments fail");
        },
        complete: function(res) {
          console.log("loadComments complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  loadProject: function() {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/projectDetails', 
        data: app.encode({
          id: that.data.projectId,
          customerId: wx.getStorageSync('id'),
          projectActivityId: that.data.activityId
        }),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1){
            var d = res.data.data;
            if (!d.picList || d.picList.length == 0) {
              var filePath = (d.header || "umer/css/image/wechat/2.jpg"); 
              that.setData({
                projectPics: [{ id: 0, filePath: filePath }]
              });
            } else {
              that.setData({
                projectPics: d.picList
              });
            }
            if (d.activityEndDate) {
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
						} 
            that.setData({
              item: d,
              projectUnitPrice: d.unitPrice || 0,
              projectCoursePrice: d.coursePrice || 0,
              projectCourseRemark: d.courseRemark || 0,
              projectTitle: d.projectName || "",
              projectDuration: d.duration || 0,
              projectBrand: d.brand || "",
              projectMatters: d.noticeMatters || "",
              projectApply: d.noticeMatters || "",
              shopAddress: d.shopAddress || "",
              projectDescription: d.description.replace(/^\n{1,}/, ''),
              ifCollect: d.ifCollect || 0,
            });
            wx.request({
              url: app.globalData.server_url + 'webService/customer/biz/index/shopDetail', 
              data: app.encode({
                id: d.shopId
              }),
              method: "POST",
              dataType: "json",
              header: {
                'Content-Type': 'application/json;charset=UTF-8;'
              },
              success: function(res2) {
                // console.log(res.data)
                var d2 = res2.data.data;
                that.setData({
                  shopHeader: d2.header || "/umer/css/image/default.jpg",
                  shopTitle: d2.shopName || "",
                  shopDescription: d2.description || "",
                  projectCount: d2.projectCount || 0,
                  personnelCount: d2.personnelCount || 0
                });
              },
              fail: function(res) {
                console.log("loadProject fail");
              },
              complete: function(res) {
                console.log("loadProject complete");
                that.setData({
                  loadingHidden: true
                });
              }
            });
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
          console.log("loadProject fail");
        },
        complete: function(res) {
          console.log("loadProject complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  appoint: function(){
    if (!wx.getStorageSync('id')) {
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
      return false;
    }
    var that = this;
    wx.redirectTo({
      url: '../quickAppoint/appointPersonnel?from=projectDetail&projectId=' + that.data.projectId + "&activityId=" + (that.data.activityId || ''),
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
  showComments: function(e) {
    var that = this;
    var timestamp = e.timeStamp;
    if (timestamp - this.data.commentTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: '../index/projectComments?projectId=' + that.data.projectId,
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
    this.setData({
      commentTimeStamp: timestamp
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: 'iUmer - 优美东方',
      path: '/pages/index/projectDetail?projectId=' + that.data.projectId
    }
  },
  showShop: function(e) {
    var that = this;
    var timestamp = e.timeStamp;
    if (timestamp - this.data.showShopTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: '../index/shopDetail?shopId=' + that.data.item.shopId,
        success: function(res){
          // success
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      })
    }
    this.setData({
      showShopTimeStamp: timestamp
    })
  }
})
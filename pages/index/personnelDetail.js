// pages/index/personnelDetail.js
var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '优美师详情'
    })
    this.setData({
      personnelId: options.personnelId,
      activityId: options.activityId,
      commentTimeStamp: 0
    });
    this.loadPersonnel();
    this.loadPersonnelProjects();
    this.loadComments(); 
    this.updateCommentNum();
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
  loadPersonnel: function() {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/personnelDetail', 
        data: app.encode({
          id: that.data.personnelId,
          customerId: wx.getStorageSync('id')
        }),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              personnelInfo: res.data.data          
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
          console.log("loadPersonnel fail")
        },
        complete: function(res) {
          console.log("loadPersonnel complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  loadPersonnelProjects: function() {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/reserve/personnelProjectList', 
        data: app.encode({
          personnelId: that.data.personnelId,
          pageSize: 3
        }),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              projectList: res.data.data          
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
          console.log("loadPersonnelProjects fail")
        },
        complete: function(res) {
          console.log("loadPersonnelProjects complete")
          wx.hideNavigationBarLoading();
        }
    });
  },
  updateCommentNum: function(){
    var that = this;
    // console.log(this.data.projectId)
    wx.showNavigationBarLoading();
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/projectCommentGroupNum', 
        data: app.encode({
          personnelId: that.data.personnelId
        }),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              totalCommentNum: res.data.data.totalReputation,
              goodReputation: res.data.data.goodReputation,
              middleReputation: res.data.data.middleReputation,
              badReputation: res.data.data.badReputation            
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
          wx.hideNavigationBarLoading();
        }
    });
  },
  loadComments: function() {
    wx.showNavigationBarLoading();
    // console.log("loadComments: " + this)
    var data = {};
    data["personnelId"] = this.data.personnelId;
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
          if (res.data.code == 1) {
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
  showComments: function(e) {
    var that = this;
    var timestamp = e.timeStamp;
    if (timestamp - this.data.commentTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: '../index/projectComments?personnelId=' + that.data.personnelId,
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
      url: '../quickAppoint/appointProject?from=personnelDetail&personnelId=' + that.data.personnelId,
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
  appointBoth: function(e){
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
    var projectId = e.currentTarget.dataset.projectid;
    var activityId = e.currentTarget.dataset.activityid;
    wx.redirectTo({
      url: '../quickAppoint/appoint?from=personnelDetail&personnelId=' + that.data.personnelId + "&projectId=" + projectId + "&activityId=" + (activityId || ''),
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
  onShareAppMessage: function () {
    var that = this;
    return {
      title: 'iUmer - 优美东方',
      path: '/pages/index/personnelDetail?personnelId=' + that.data.personnelId
    }
  }
})
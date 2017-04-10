var app = getApp();
Page({
  data:{
    loadingHidden: true,
    currTab: 0,
    loadMoreTimeStamp: 0,
    refreshTimeStamp: 0,
    noDataHidden: true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数    
    wx.setNavigationBarTitle({
      title: '快速预约'
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    this.loadProjects("");
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  switchTab: function (e) {
    // this.loadOrders(e.detail.status, ""); 
    if (this.data.currTab == e.target.dataset.tabindex) { 
      return false;  
    } else {  
      this.setData( {  
        currTab: e.target.dataset.tabindex,
      });
    } 
  },
  switchSwiper: function(e) {
    this.setData( {  
      currTab: e.detail.current, 
    });
    if (e.detail.current == 0) {
      this.loadProjects("");
    } else if (e.detail.current == 1) {
      this.loadPersonnels("");
    }
  },
  loadProjects: function(opType) {
    // wx.showNavigationBarLoading();
    var that = this;
    var data = {};
    data["customerId"] = wx.getStorageSync('id');
    data["pageSize"] = 10;
    if (opType) {
      data["operationType"] = opType;
      switch(opType) {
      case "up": data["timestamp"] = this.data.timestampLast; break;
      case "down": data["timestamp"] = this.data.timestampFirst; break;
      }
    }
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/order/reserveProjectRecord', 
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
          if (res.data.data.length == 0 && !opType) {
            that.setData({
              loadingHidden: true,
              noDataHidden: false
            });
            return false;
          }
          var projectList = opType == "down"? res.data.data.concat(that.data.projectList): opType == "up"? that.data.projectList.concat(res.data.data): res.data.data;
          that.setData({
            projectList: projectList,
            timestampFirst: projectList[0].createDate,
            timestampLast: projectList[projectList.length - 1].createDate,
            noDataHidden: true
          });
          if (projectList.length < 10 || res.data.data.length < 10) {
            that.setData({
              loadingHidden: true
            });
          } else {
            that.setData({
              loadingHidden: false
            });
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
        console.log("loadProjects fail")
      },
      complete: function(res) {
        // wx.hideNavigationBarLoading();
        console.log("loadProjects complete")
      }
    });
  },
  loadPersonnels: function(opType) {
    //wx.showNavigationBarLoading();
    var that = this;
    var data = {};
    data["customerId"] = wx.getStorageSync('id');
    data["pageSize"] = 10;
    if (opType) {
      data["operationType"] = opType;
      switch(opType) {
      case "up": data["timestamp"] = this.data.timestampLast; break;
      case "down": data["timestamp"] = this.data.timestampFirst; break;
      }
    }
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/order/reservePersonnelRecord', 
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
          if (res.data.data.length == 0 && !opType) {
            that.setData({
              loadingHidden: true,
              noDataHidden: false
            });
            return false;
          }
          var personnelList = opType == "down"? res.data.data.concat(that.data.personnelList): opType == "up"? that.data.personnelList.concat(res.data.data): res.data.data;
          that.setData({
            personnelList: personnelList,
            timestampFirst: personnelList[0].createDate,
            timestampLast: personnelList[personnelList.length - 1].createDate
          });
          if (personnelList.length < 10 || res.data.data.length < 10) {
            that.setData({
              loadingHidden: true
            });
          } else {
            that.setData({
              loadingHidden: false
            });
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
        console.log("loadPersonnels fail")
      },
      complete: function(res) {
        //wx.hideNavigationBarLoading();
        console.log("loadPersonnels complete")
      }
    });
  },
  loadMore: function(e) {
    console.log("loadMore");
    var timestamp = e.timeStamp;
    if (timestamp - this.data.loadMoreTimeStamp < 500) {

    } else {
      if (this.data.currTab == 0) {
        this.loadProjects("up");
      } else if (this.data.currTab == 1) {
        this.loadPersonnels("up");
      }
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
      if (this.data.currTab == 0) {
        this.loadProjects("down");
      } else if (this.data.currTab == 1) {
        this.loadPersonnels("down");
      }
    }
    this.setData({
      refreshTimeStamp: timestamp
    })
  },
  appointPersonnel: function(e) {
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
    var projectId = e.currentTarget.dataset.projectid;
    wx.redirectTo({
      url: '../quickAppoint/appointPersonnel?projectId=' + projectId,
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
  appointProject: function(e) {
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
    var personnelId = e.currentTarget.dataset.personnelid;
    wx.redirectTo({
      url: '../quickAppoint/appointProject?personnelId=' + personnelId,
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
})
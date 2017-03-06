// pages/index/shopDetail.js
var app = getApp();
Page({
  data:{
    currTab: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      shopId: options.shopId
    });
    this.loadShop();
    this.loadProjects();
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
  loadShop: function(){
    var shopId = this.data.shopId;
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/shopDetail', 
        data: {
          id: shopId
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1){
            var d = res.data.data;
            if (!d.picList || d.picList.length == 0) {
              var filePath = (d.header + 'big.jpg' || "/umer/css/image/wechat/2.jpg"); 
              that.setData({
                projectPics: [{ id: 0, filePath: filePath }]
              });
            } else {
              that.setData({
                projectPics: d.picList
              });
            }
            that.setData({
              shopInfo: d
            });
          }
        },
        fail: function(res) {
          console.log("loadShop fail");
        },
        complete: function(res) {
          console.log("loadShop complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  switchTab: function (e) {
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
    wx.showNavigationBarLoading();
    var that = this;
    var data = {};
    data["shopId"] = that.data.shopId;
    data["pageSize"] = 10;
    if (opType) {
      data["operationType"] = opType;
      switch(opType) {
      case "up": data["timestamp"] = this.data.timestampLast; break;
      case "down": data["timestamp"] = this.data.timestampFirst; break;
      }
    }
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/shopProjectList', 
      data: data,
      method: "POST",
      dataType: "json",
      header: {
          'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          if (res.data.data.length == 0 && !opType) {
            that.setData({
              projectList: [],
              timestampFirst: 0,
              timestampLast: 0
            });
            return false;
          }
          var projectList = opType == "down"? res.data.data.concat(that.data.projectList): opType == "up"? that.data.projectList.concat(res.data.data): res.data.data;
          that.setData({
            projectList: projectList,
            timestampFirst: res.data.data[0].createDate,
            timestampLast: res.data.data[res.data.data.length - 1].createDate
          });
        }
      },
      fail: function(res) {
        console.log("loadProjects fail")
      },
      complete: function(res) {
        wx.hideNavigationBarLoading();
        console.log("loadProjects complete")
      }
    });
  },
  loadPersonnels: function(opType) {
    var that = this;
    wx.showNavigationBarLoading();
    var data = {};
    data["shopId"] = that.data.shopId;
    data["pageSize"] = 10;
    if (opType) {
      data["operationType"] = opType;
      switch(opType) {
      case "up": data["timestamp"] = this.data.timestampLast; break;
      case "down": data["timestamp"] = this.data.timestampFirst; break;
      }
    }
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/shopPersonnelList', 
      data: data,
      method: "POST",
      dataType: "json",
      header: {
          'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          if (res.data.data.length == 0 && !opType) {
            that.setData({
              personnelList: [],
              timestampFirst: 0,
              timestampLast: 0
            });
            return false;
          }
          var personnelList = opType == "down"? res.data.data.concat(that.data.personnelList): opType == "up"? that.data.personnelList.concat(res.data.data): res.data.data;
          that.setData({
            personnelList: personnelList,
            timestampFirst: res.data.data[0].createDate,
            timestampLast: res.data.data[res.data.data.length - 1].createDate
          });
        }
      },
      fail: function(res) {
        console.log("loadPersonnels fail")
      },
      complete: function(res) {
        wx.hideNavigationBarLoading();
        console.log("loadPersonnels complete")
      }
    });
  },
  loadMore: function(e) {
    console.log("loadMore");
    if (this.data.currTab == 0) {
      this.loadProjects("up");
    } else if (this.data.currTab == 1) {
      this.loadPersonnels("up");
    }
  },
  refresh: function(e){
    console.log("refresh");
    if (this.data.currTab == 0) {
      this.loadProjects("down");
    } else if (this.data.currTab == 1) {
      this.loadPersonnels("down");
    }
  },
  appointProject: function(e) {
    var personnelId = e.currentTarget.dataset.personnelid;
    wx.navigateTo({
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
  },
  appointPersonnel: function(e) {
    var projectId = e.currentTarget.dataset.projectid;
    wx.navigateTo({
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
  callShop: function(e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function(res) {
        // success
      }
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: 'iUmer - 优美东方',
      path: '/pages/index/shopDetail?shopId=' + that.data.shopId
    }
  }
}) 
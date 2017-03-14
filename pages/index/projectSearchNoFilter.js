// pages/index/indexSearch.js
var app = getApp();
Page({
  data:{
    personnelList: [],
    page: 1,
    loadingHidden: true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      value: options.value || "",
      'from': options.from
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
  back: function(e) {
    wx.switchTab({
      url: 'index',
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
  inputSearch: function(e) {
    var value = e.detail.value.trim();
    this.setData({
      value: value
    });
    this.searchProject("", value);
  },
  searchProject: function(operationType, value) {
    wx.showNavigationBarLoading();
    var that = this;
    var data = {};
    if (operationType) {
      data["operationType"] = operationType;
      switch (operationType) {
        case "up": data["timestamp"] = this.data.timestampLast; break;
        case "down": data["timestamp"] = this.data.timestampFirst; break;
      }
    }
    data["page"] = that.data.page;
    data["pageSize"] = 10;
    data["projectName"] = value;
    data["cityId"] = wx.getStorageSync('cityCode');
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/searchProjectList', 
      data: data,
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          if (res.data.data.length == 0 && that.data.page == 1) {
            that.setData({
              projectList: [],
              loadingHidden: true
            })
            return false;
          } else if (res.data.data.length == 0) {
            that.setData({
              page: that.data.page - 1,
              loadingHidden: true
            })
            return false;
          }
          var projectList = that.data.page == 1? res.data.data: that.data.projectList.concat(res.data.data);
          that.setData({
            projectList: projectList
          });
          if (projectList.length < 10 || res.data.data.length < 10) {
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
        console.log("loadProjects complete")
        wx.hideNavigationBarLoading();
      }
    });
  },
  clickProjectItem: function(e){
    var projectId = e.currentTarget.dataset.projectid;
    var activityId = e.currentTarget.dataset.activityid;
    // console.log(projectId)
    wx.navigateTo({
      url: 'projectDetail?projectId=' + projectId +  "&activityId=" + activityId,
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
  loadMore: function() {
    this.data.page++;
    this.searchProject('up', this.data.value);
  },
  refresh: function() {
    this.data.page = 1;
    this.searchProject('down', this.data.value);
  }
})
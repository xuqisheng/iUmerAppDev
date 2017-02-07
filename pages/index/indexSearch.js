// pages/index/indexSearch.js
var app = getApp();
Page({
  data:{
    projectList: [],
    personnelList: [],
    shopList: []
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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
  indexSearch: function(e) {
    var txt = e.detail.value;
    this.searchProject(txt);
    this.searchPersonnel(txt);
    this.searchShop(txt);
  },
  searchProject: function(txt) {
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/searchProjectList', 
        data: {
          cityId: wx.getStorageSync("cityCode"),
          projectName: txt,
          pageSize: 3,
          page: 1
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          that.setData({
            projectList: res.data.data
          });
        },
        fail: function(res) {
          console.log("indexSearch - searchProject fail")
        },
        complete: function(res) {
          console.log("indexSearch - searchProject complete")
        }
    });
  },
  searchPersonnel: function(txt) {
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/searchPersonnelList', 
        data: {
          cityId: wx.getStorageSync("cityCode"),
          personnelName: txt,
          pageSize: 3
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          that.setData({
            personnelList: res.data.data
          });
        },
        fail: function(res) {
          console.log("indexSearch - searchPersonnel fail")
        },
        complete: function(res) {
          console.log("indexSearch - searchPersonnel complete")
        }
    });
  },
  searchShop: function(txt) {
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/searchPersonnelList', 
        data: {
          cityId: wx.getStorageSync("cityCode"),
          shopName: txt,
          pageSize: 3
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          that.setData({
            shopList: res.data.data
          });
        },
        fail: function(res) {
          console.log("indexSearch - searchShop fail")
        },
        complete: function(res) {
          console.log("indexSearch - searchShop complete")
        }
    });
  }
})
// pages/index/projectSearch.js
var app = getApp();
Page({
  data:{
    showArea: true,
    showNear: true,
    showSorting: true,
    showCategory: true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.loadAreaList();
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
  showAreaF: function() {
    this.setData({
      showArea: false,
      showSorting: true,
      showCategory: true
    });
  },
  showSortingF: function() {
    this.setData({
      showArea: true,
      showSorting: false,
      showCategory: true
    });
  },
  showCategoryF: function() {
    this.setData({
      showArea: true,
      showSorting: true,
      showCategory: false
    })
  },
  loadAreaList: function() {
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/common/areaList', 
      data: {
        cityId: wx.getStorageSync('cityCode')
      },
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            areaList: res.data.data
          });
        }
      },
        fail: function(res) {
          console.log("getPPT fail")
        },
        complete: function(res) {
          console.log("complete")
        }
    });
  },
  showNearF: function() {
    this.setData({
      showNear: false
    });
  },
  hideFilter: function() {
    this.setData({
      showArea: true,
      showSorting: true,
      showCategory: true
    })
    console.log(this.data.showArea)
  },
  clickArea: function(e) {
    var areaId = e.currentTarget.dataset.areaid;
    this.setData({
      showArea: true
    })
  }
})
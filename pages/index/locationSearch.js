// pages/index/locationSearch.js
var cities = require("../../utils/cities.js");

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      resultList: []
    });
    wx.setNavigationBarTitle({
      title: '城市'
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
  back: function(){
    wx.redirectTo({
      url: 'location',
      success: function(res) {
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
  searchCity: function(e) {
    this.setData({
      resultList: []
    });
    var txt = e.detail.value.trim();
    if (!txt) {
      return false;
    }
    console.log(txt)
    for (var i = 0; i < cities.data.length; i++) {
      var el = cities.data[i];
      var index = el.name;
      var list = el.list;
      for (var j = 0; j < list.length; j++) {
        var ele = list[j];
        var cityName = ele.name;
        var cityCode = ele.code;
        if (cityName.indexOf(txt) > -1) {
          var resList = this.data.resultList;
          resList.push({
              name: cityName,
              code: cityCode
          });
          this.setData({
            resultList: resList
          });
          console.log(this.data.resultList)
        }
      }
    }
  },
  setLocation: function(event){
    console.log(event)
    var cityCode = event.currentTarget.dataset.code;
    var cityName = event.currentTarget.dataset.name;
    console.log(cityCode+ " " + cityName)
    wx.setStorageSync('cityCode', cityCode);
    wx.setStorageSync('cityName', cityName);
    wx.switchTab({
      url: 'index',
      success: function(res){
        // success
        console.log("success");
      },
      fail: function() {
        // fail
        console.log("failed");
      },
      complete: function() {
        // complete
        console.log("complete");
      }
    })
  },
})
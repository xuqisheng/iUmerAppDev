// pages/index/location.js
var cities = require("../../utils/cities.js");

Page({
  data:{

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log("onload");
    this.setData({
      cityList: cities.data,
      currentCity: wx.getStorageSync('cityName') || ""
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.setStorageSync('latitude', latitude);
        wx.setStorageSync('longitude', longitude);
        var letterIndex = [];
        // var url = "http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=" + latitude + "," + longitude + "&output=json&pois=0&ak=Yh9wolTpm7OZPY57B7spMf4t";
        var url = "http://api.map.baidu.com/geocoder/v2/?ak=2IBKO6GVxbYZvaR2mf0GWgZE&output=json&pois=0&location=" + latitude + "," + longitude;
        wx.request({
          url: url, //仅为示例，并非真实的接口地址
          data: {
            
          },
          header: {
             
          },
          success: function(baiduRes) {
            var find = false;
            var city = baiduRes.data.result.addressComponent.city;
            // console.log(cities.data.length)
            for (var i = 0; i < cities.data.length; i++) {
              // console.log(i)
              var el = cities.data[i];
              letterIndex.push(el.name);
              // console.log(el)
              var list = el.list;
              for (var j = 0; j < list.length; j++) {
                var ele = list[j];
                var cityName = ele.name;
                var cityCode = ele.code;
                // console.log(ele)
                if (cityName == city) {
                  that.setData({
                    baiduCity: cityName,
                    baiduCityCode: cityCode
                  });
                  console.log("定位到的城市是：" + city);
                  find = true;
                }
              };
            };
            if (!find) {
              that.setData({
                baiduCity: "定位失败"
              });
            }
            that.setData({
              letterIndex: letterIndex
            });
            // console.log(letterIndex);
          }
        });
        // var speed = res.speed
        // var accuracy = res.accuracy
      }
    });
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
  moveNav: function(e) {
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var letterIndex = (e.changedTouches["0"].clientY - e.currentTarget.offsetTop) / 378 * this.data.letterIndex.length;
    var letter = this.data.letterIndex[parseInt(letterIndex)];
    this.setData({
      selectedLetter: letter
    });
    console.log(parseInt(letterIndex));
  },
  back: function(){
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
  searchCity: function(e) {
    wx.redirectTo({
      url: 'locationSearch',
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
})
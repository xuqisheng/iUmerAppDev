//index.js
//获取应用实例
var app = getApp();
var cities = require("../../utils/cities.js");
Page({
  data: {
    login: false,
    searchTimeStamp: 0,
    clickProjectItemTimeStamp: 0,
    clickPersonnelItemTimeStamp: 0
  },
  onLoad: function (options) {
    console.log('onLoad');
    if (wx.getStorageSync('id')) {
      this.setData({
        login: true
      })
    }
  },
  onReady:function(){
    console.log("onReady");
  },
  onShow: function(){
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/common/checkToken', 
        data: app.encode({
          token: wx.getStorageSync('X-TOKEN')
        }),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              login: true
            })
          } else {
            that.setData({
              login: false
            })
          } 
        },
        fail: function(res) {
          console.log("checkToken fail")
        },
        complete: function(res) {
          console.log("checkToken complete")
        }
    });
    console.log("onShow");
    if (wx.getStorageSync('cityCode')) {
      var city = wx.getStorageSync('cityName');
      if (city.length < 3) {
    
      } else if (city.length == 3) {
        city = city.substring(0, 2);
      }  else {
        city = city.substring(0, 2) + "...";
      }
      that.setData({
        "cityName": city 
      });
      // this.getPPT();
      this.getHotProject();
      this.getHotPersonnel();
    } else {
      wx.showNavigationBarLoading();
      wx.getLocation({
        type: 'wgs84',
        success: function(res) {
          if (res.errMsg == "getLocation:ok") {
            var latitude = res.latitude
            var longitude = res.longitude
            wx.setStorageSync('latitude', latitude);
            wx.setStorageSync('longitude', longitude);
            var letterIndex = [];
            var url = app.globalData.server_url + "webService/common/baiduCoordinate";
            wx.request({
              url: url, //仅为示例，并非真实的接口地址
              data: app.encode({
                latitude: latitude,
                longitude: longitude
              }),
              method: "POST",
              dataType: "json",
              header: {
                'Content-Type': 'application/json;charset=UTF-8;'
              },
              success: function(baiduRes) {
                var res = JSON.parse(baiduRes.data.data);
                var find = false;
                var city = res.result.addressComponent.city;
                // console.log(cities.data.length)
                for (var i = 0; i < cities.data.length; i++) {
                  // console.log(i)
                  var el = cities.data[i];
                  // console.log(el)
                  var list = el.list;
                  for (var j = 0; j < list.length; j++) {
                    var ele = list[j];
                    var cityName = ele.name;
                    var cityCode = ele.code;
                    // console.log(ele)
                    if (cityName == city) {
                      if (city.length < 3) {
    
                      } else if (city.length == 3) {
                        city = city.substring(0, 2);
                      }  else {
                        city = city.substring(0, 2) + "...";
                      }
                      that.setData({
                        baiduCity: cityName,
                        baiduCityCode: cityCode,
                        cityCode: cityCode,
                        cityName: city
                      });
                      wx.setStorageSync('cityCode', cityCode);
                      wx.setStorageSync('cityName', cityName);
                      console.log("定位到的城市是：" + city);
                      that.getHotProject();
                      that.getHotPersonnel();
                      find = true;
                      return false;
                    }
                  };
                };
                if (!find) {
                  that.changeLocation();
                }
              }
            });
          } else {

          }
        },
        fail: function(res) {
          console.log('getLocation failed');
        },
        complete: function(res) {
          console.log("getLocation completed");
          wx.hideNavigationBarLoading()
        }
      });
    }
  },
  changeLocation: function(){
    wx.navigateTo({
      url: 'location',
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
  getPPT: function(){
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/common/messages', 
      data: app.encode({
        "banner": "index",
        "platform": "customer",
        "pageSize": 10
      }),
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            banners: res.data.data
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
          console.log("getPPT fail")
        },
        complete: function(res) {
          console.log("complete")
        }
    });
  },
  getHotProject: function(){ 
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/hotProject', 
        data: app.encode({
          cityId: wx.getStorageSync("cityCode"),
          longitude: wx.getStorageSync("longitude"),
          latitude: wx.getStorageSync("latitude"),
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
              hotProjects: res.data.data
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
          console.log("getHotProject fail")
        },
        complete: function(res) {
          console.log("complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  getHotPersonnel: function(){
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/hotPersonnel', 
        data: app.encode({
          cityId: wx.getStorageSync("cityCode"),
          longitude: wx.getStorageSync("longitude"),
          latitude: wx.getStorageSync("latitude"),
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
              hotPersonnel: res.data.data
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
          console.log("getHotProject fail")
        },
        complete: function(res) {
          console.log("complete")
          wx.hideNavigationBarLoading()
        }
    });
  },
  indexSearch: function(e) {
    wx.navigateTo({
      url: 'indexSearch',
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
  clickProjectItem: function(event){
    var projectId = event.currentTarget.dataset.projectid;
    var activityId = event.currentTarget.dataset.activityid;
    var timestamp = event.timeStamp;
    // console.log(projectId)
    if (timestamp - this.data.clickProjectItemTimeStamp < 500) {

    } else {
      // console.log(projectId)
      wx.navigateTo({
        url: 'projectDetail?projectId=' + projectId + "&activityId=" + activityId,
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
    this.setData({
      clickProjectItemTimeStamp: timestamp
    })
  },
  clickPersonnelItem: function(event) {
    var personnelId = event.currentTarget.dataset.personnelid;
    // console.log(projectId)
    var timestamp = event.timeStamp;
    // console.log(projectId)
    if (timestamp - this.data.clickPersonnelItemTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: 'personnelDetail?personnelId=' + personnelId,
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
    this.setData({
      clickPersonnelItemTimeStamp: timestamp
    })
  },
  jumpToSearchProject: function(e) {
    var timestamp = e.timeStamp;
    // console.log(projectId)
    if (timestamp - this.data.searchTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: 'projectSearch?groupNo=' + e.currentTarget.dataset.groupno + '&type=' + e.currentTarget.dataset.navid,
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
      searchTimeStamp: timestamp
    })
  },
  jumpToSearchPersonnel: function() {
    wx.navigateTo({
      url: 'personnelSearchAll?from=index',
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
  jumpToSearchProjectNoFilter: function() {
    wx.navigateTo({
      url: 'projectSearchAll?from=index',
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
  logout: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      confirmColor: '#FD8CA3',
      content: "您确定要登出吗?",
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('id');
          wx.removeStorageSync("name");
          wx.removeStorageSync("phone");
          wx.removeStorageSync("password");
          wx.removeStorageSync("header");
          wx.removeStorageSync("sex");
          wx.removeStorageSync("birthday");
          wx.removeStorageSync("X-TOKEN");
          wx.removeStorageSync("alias");
          wx.removeStorageSync("authCode");  
          that.setData({
            login: false
          });
        }
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: 'iUmer - 优美东方',
      path: '/pages/index/index'
    }
  },
  moreProjects: function(){
    wx.navigateTo({
      url: '../index/projectSearchAll',
    })
  },
  morePersonnels: function () {
    wx.navigateTo({
      url: '../index/personnelSearchAll',
    })
  }
})

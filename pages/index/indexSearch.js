// pages/index/indexSearch.js
var app = getApp();
Page({
  data: {
    projectList: [],
    personnelList: [],
    shopList: [],
    clickPersonnelItemTimeStamp: 0,
    clickProjectItemTimeStamp: 0,
    clickShopItemTimeStamp: 0,
    hideHint: false,
    searchHistory: wx.getStorageSync('searchHistory')? wx.getStorageSync('searchHistory').substring(1).split(";"): [],
    searchHot: ['金公主', '赛香妃', '优美东方']
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.searchProject();
    this.searchPersonnel();
    // this.searchShop();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  back: function (e) {
    wx.switchTab({
      url: 'index',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  inputKeywords: function (e) {
    var keywords = e.detail.value.trim();
    this.setData({
      searchKeywords: keywords
    })
  },
  clearSearch: function(e) {
    this.setData({
      searchKeywords: "",
      hideHint: false
    })
  },
  searchHint: function(e) {
    var txt = e.currentTarget.dataset.keyword;
    this.searchProject(txt);
    this.searchPersonnel(txt);
    this.setData({
      hideHint: true
    });
  },
  search: function (e) {
    var txt = this.data.searchKeywords;
    var history = wx.getStorageSync('searchHistory') || '';
    if (txt) {
      wx.setStorageSync('searchHistory', history + ';' + txt);
    }
    this.setData({
      hideHint: true,
      searchHistory: wx.getStorageSync('searchHistory').substring(1).split(";")
    })
    
    this.searchProject(txt);
    this.searchPersonnel(txt);
    // this.searchShop(txt);
  },
  searchProject: function (txt) {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/searchProjectList',
      data: app.encode({
        cityId: wx.getStorageSync("cityCode"),
        projectName: txt,
        pageSize: 3,
        page: 1,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      }),
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function (res) {
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
            success: function (res) {
              if (res.confirm) {

              }
            }
          });
        }
      },
      fail: function (res) {
        console.log("indexSearch - searchProject fail")
      },
      complete: function (res) {
        console.log("indexSearch - searchProject complete")
        wx.hideNavigationBarLoading();
      }
    });
  },
  searchPersonnel: function (txt) {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/searchPersonnelList',
      data: app.encode({
        cityId: wx.getStorageSync("cityCode"),
        personnelName: txt,
        pageSize: 3,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      }),
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            personnelList: res.data.data
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.desc,
            confirmColor: '#FD8CA3',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              }
            }
          });
        }
      },
      fail: function (res) {
        console.log("indexSearch - searchPersonnel fail")
      },
      complete: function (res) {
        console.log("indexSearch - searchPersonnel complete")
        wx.hideNavigationBarLoading();
      }
    });
  },
  searchShop: function (txt) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/searchShopList',
      data: app.encode({
        cityId: wx.getStorageSync("cityCode"),
        shopName: txt,
        pageSize: 3,
        longitude: wx.getStorageSync("longitude"),
        latitude: wx.getStorageSync("latitude")
      }),
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            shopList: res.data.data
          });
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.desc,
            confirmColor: '#FD8CA3',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              }
            }
          });
        }
      },
      fail: function (res) {
        console.log("indexSearch - searchShop fail")
      },
      complete: function (res) {
        console.log("indexSearch - searchShop complete")
        wx.hideNavigationBarLoading();
      }
    });
  },
  clickProjectItem: function (event) {
    var projectId = event.currentTarget.dataset.projectid;
    var activityId = event.currentTarget.dataset.activityid;
    var timestamp = event.timeStamp;
    // console.log(projectId)
    if (timestamp - this.data.clickProjectItemTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: 'projectDetail?projectId=' + projectId + "&activityId=" + activityId,
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      });
    }
    this.setData({
      clickProjectItemTimeStamp: timestamp
    })
  },
  clickPersonnelItem: function (e) {
    var personnelId = e.currentTarget.dataset.personnelid;
    var timestamp = e.timeStamp;
    // console.log(projectId)
    if (timestamp - this.data.clickPersonnelItemTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: 'personnelDetail?personnelId=' + personnelId,
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      });
    }
    this.setData({
      clickPersonnelItemTimeStamp: timestamp
    })
  },
  clickShopItem: function (e) {
    var shopId = e.currentTarget.dataset.shopid;
    // console.log(projectId)
    var timestamp = e.timeStamp;
    if (timestamp - this.data.clickShopItemTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: 'shopDetail?shopId=' + shopId,
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      });
    }
    this.setData({
      clickShopItemTimeStamp: timestamp
    })
  },
  moreProjects: function () {
    wx.navigateTo({
      url: 'projectSearch',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  morePersonnels: function () {
    wx.navigateTo({
      url: 'personnelSearch',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  moreShops: function () {
    wx.navigateTo({
      url: 'shopSearch',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})
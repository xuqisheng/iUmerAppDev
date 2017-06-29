// pages/index/PersonnelSearch.js
var app = getApp();
Page({
  data: {
    showArea: true,
    showNear: true,
    showSorting: true,
    page: 1,
    loadMoreTimeStamp: 0,
    refreshTimeStamp: 0,
    clickPersonnelItemTimeStamp: 0,
    noDataHidden: true,
    areaTxt: '全城',
    sortTxt: '排序'
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      'type': options.type,
      groupNo: options.groupNo
    });
    this.loadAreaList();
    this.loadPersonnels();
    wx.setNavigationBarTitle({
      title: '优美师'
    })
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
  showAreaF: function () {
    this.setData({
      showArea: !this.data.showArea,
      showSorting: true
    });
  },
  showSortingF: function () {
    this.setData({
      showArea: true,
      showSorting: !this.data.showSorting
    });
  },
  showCategoryF: function () {
    this.setData({
      showArea: true,
      showSorting: true
    })
  },
  loadAreaList: function () {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/common/areaList',
      data: app.encode({
        cityId: wx.getStorageSync('cityCode') || '320500'
      }),
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            areaList: res.data.data
          });
        }
      },
      fail: function (res) {
        console.log("getPPT fail")
      },
      complete: function (res) {
        console.log("complete");
        wx.hideNavigationBarLoading();
      }
    });
  },
  showNearF: function (e) {
    this.setData({
      showNear: false
    });
  },
  hideFilter: function () {
    this.setData({
      showArea: true,
      showSorting: true
    })
    console.log(this.data.showArea)
  },
  clickArea: function (e) {
    var areaId = e.currentTarget.dataset.areaid;
    var range = e.currentTarget.dataset.range;
    var areaName = e.currentTarget.dataset.areaname;
    this.setData({
      showArea: true,
      areaId: areaId || "",
      range: range || "",
      page: 1,
      showNear: !range,
      all: areaId == 'all' || '',
      areaTxt: areaName || '全城'
    });
    this.loadPersonnels();
    console.log(this.data)
  },
  clickSorting: function (e) {
    var sortingId = e.currentTarget.dataset.sortingid;
    var sortingName = e.currentTarget.dataset.sortname;
    this.setData({
      showSorting: true,
      sortingId: sortingId,
      page: 1,
      sortTxt: sortingName
    });
    this.loadPersonnels();
  },
  loadPersonnels: function () {
    wx.showNavigationBarLoading();
    var that = this;
    var data = {};
    data["longitude"] = wx.getStorageSync("longitude");
    data["latitude"] = wx.getStorageSync("latitude");
    if (that.data.areaId) {
      data["areaId"] = that.data.areaId;
    }
    if (that.data.range) {
      data["range"] = that.data.range;
    }
    data["page"] = that.data.page;
    data["pageSize"] = 10;
    data["cityId"] = wx.getStorageSync("cityCode");
    if (that.data.sortingId) {
      data["orderType"] = that.data.sortingId;
      if (that.data.sortingId == 2) {
        data["sort"] = "asc";
      } else {
        data["sort"] = "desc";
      }
    }
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/searchPersonnelList',
      data: app.encode(data),
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function (res) {
        if (res.data.code == 1) {
          if (res.data.data.length == 0 && that.data.page == 1) {
            that.setData({
              personnelList: [],
              loadingHidden: true,
              noDataHidden: false
            });
            return false;
          } else if (res.data.data.length == 0) {
            that.setData({
              page: that.data.page - 1
            });
            that.setData({
              loadingHidden: true
            });
            return false;
          }
          var personnelList = that.data.page == 1 ? res.data.data : that.data.personnelList.concat(res.data.data);
          that.setData({
            personnelList: personnelList,
            noDataHidden: true
          });
          if (personnelList.length < 10 || res.data.data.length < 10) {
            that.setData({
              loadingHidden: true
            });
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
            success: function (res) {
              if (res.confirm) {

              }
            }
          });
        }
      },
      fail: function (res) {
        console.log("loadPersonnels fail")
      },
      complete: function (res) {
        console.log("loadPersonnels complete")
        wx.hideNavigationBarLoading();
      }
    });
  },
  loadMore: function (e) {
    var timestamp = e.timeStamp;
    if (timestamp - this.data.loadMoreTimeStamp < 500) {

    } else {
      this.data.page++;
      this.loadPersonnels();
    }
    this.setData({
      loadMoreTimeStamp: timestamp
    });
  },
  refresh: function (e) {
    var timeStamp = e.timeStamp;
    if (timeStamp - this.data.refreshTimeStamp < 500) {

    } else {
      this.data.page = 1;
      this.loadPersonnels();
    }
    this.setData({
      refreshTimeStamp: timeStamp
    })
  },
  clickPersonnelItem: function (e) {
    var personnelId = e.currentTarget.dataset.personnelid;
    var activityId = e.currentTarget.dataset.activityid;
    var timestamp = e.timeStamp;
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
      })
    }
    this.setData({
      clickPersonnelItemTimeStamp: timestamp
    })
  }
})
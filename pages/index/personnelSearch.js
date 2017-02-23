// pages/index/indexSearch.js
var app = getApp();
Page({
  data:{
    personnelList: [],
    timestampFirst: 0,
    timestampLast: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      value: options.value || ""
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
    wx.redirectTo({
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
  inputSearch: function(e) {
    var value = e.detail.value.trim();
    this.setData({
      value: value
    })
    this.searchPersonnel("", value);
  },
  searchPersonnel: function(operationType, value) {
    var that = this;
    var data = {};
    if (operationType) {
      data["operationType"] = operationType;
      switch (operationType) {
        case "up": data["timestamp"] = this.data.timestampLast; break;
        case "down": data["timestamp"] = this.data.timestampFirst; break;
      }
    }
    data["pageSize"] = 10;
    data["personnelName"] = value;
    data["cityId"] = wx.getStorageSync('cityCode');
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/searchPersonnelList', 
        data: data,
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            if (res.data.data.length == 0 && !operationType) {
              that.setData({
                personnelList: []
              })
              return false;
            }
            var list = operationType == "down"? res.data.data.concat(that.data.personnelList): operationType == "up"? that.data.personnelList.concat(res.data.data): res.data.data;
            that.setData({
              personnelList: list,
              timestampFirst: list[0].createDate,
              timestampLast: list[list.length - 1].createDate
            });
          }
        },
        fail: function(res) {
          console.log("indexSearch - searchPersonnel fail")
        },
        complete: function(res) {
          console.log("indexSearch - searchPersonnel complete")
        }
    });
  },
  clickPersonnelItem: function(e){
    var personnelId = e.currentTarget.dataset.personnelid;
    // console.log(projectId)
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
  },
  loadMore: function(e) {
    console.log("loadMore");
    this.searchPersonnel("up", this.data.value);
  },
  refresh: function(e){
    console.log("refresh");
    this.searchPersonnel("down", this.data.value);
  }
})
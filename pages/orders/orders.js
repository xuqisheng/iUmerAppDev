// pages/orders/orders.js
var app = getApp();
Page({
  data:{
    currTab: 0,
    status: 1,
    loadingHidden: true,
    loadingHidden2: true,
    orderList: [],
    timestampFirst: 0,
    timestampLast: 0,
    mapping: [1, 0, 2, 3, 4]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    console.log("orders onshow");
    this.loadOrders(this.data.mapping[this.data.currTab], "");
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  switchTab: function (e) {
    // this.loadOrders(e.detail.status, ""); 
    if (this.data.currTab == e.target.dataset.tabindex) { 
      return false;  
    } else {  
      this.setData( {  
        currTab: e.target.dataset.tabindex,
      });
    } 
  },
  switchSwiper: function(e) {
    var mapping = this.data.mapping;
    this.loadOrders(mapping[e.detail.current], ""); 
    this.setData( {  
      currTab: e.detail.current, 
    });
  },
  loadOrders: function(status, opType) {
    console.log(status + " " + opType);
    wx.showNavigationBarLoading();
    var that = this;
    // console.log("loadComments: " + this)
    var data = {};
    data["approveStatus"] = status;
    data["customerId"] = wx.getStorageSync('id');
    data["projectId"] = that.data.projectId;
    data["pageSize"] = 10;
    if (opType) {
      data["operationType"] = opType;
      switch(opType) {
      case "up": data["timestamp"] = that.data.timestampLast; break;
      case "down": data["timestamp"] = that.data.timestampFirst; break;
      }
    }
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/order/myOrderList', 
        data: data,
        method: "POST",
        dataType: "json",
        header: {
          'Content-Type': 'application/json;charset=UTF-8;',
          'X-Token': wx.getStorageSync('X-TOKEN'),
          'X-Type': 3
        },
        success: function(res) {
          // console.log(res.data)
          if (res.data.code == 1) {
            if (res.data.data.length == 0 && !opType) {
              that.setData({
                orderList: [],
                timestampFirst: 0,
                timestampLast: 0,
                loadingHidden2: true
              });
              return false;
            }
            var orderList = opType == "down"? res.data.data.concat(that.data.orderList): opType == "up"? that.data.orderList.concat(res.data.data): res.data.data;
            for (var i = 0; i < orderList.length; i++) {
              var makeTime = orderList[i].makeTime;
              if (makeTime) {
                makeTime = makeTime.split(" ");
                if (makeTime.length > 2) {
                  orderList[i].makeTime = makeTime[0] + ' ' + makeTime[1] + '~' + makeTime[4];
                }
              }
            }
            that.setData({
              orderList: orderList,
              timestampFirst: orderList[0].createDate,
              timestampLast: orderList[orderList.length - 1].createDate
            });
            if (orderList.length < 10 || res.data.data.length < 10) {
              that.setData({
                loadingHidden2: true
              })
            } else {
              that.setData({
                loadingHidden2: false
              })
            }
          } else if (res.data.code == -4) {
            wx.navigateTo({
              url: '../login/authorize',
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
          console.log("loadOrders fail");
        },
        complete: function(res) {
          console.log("loadOrders complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  loadMore: function(e) {
    console.log("loadMore");
var mapping = this.data.mapping;
    this.loadOrders(mapping[this.data.currTab], "up"); 
  },
  refresh: function(e){
    console.log("refresh");
    var mapping = this.data.mapping;
    this.loadOrders(mapping[this.data.currTab], "down"); 
  },
  clickOrderItem: function(e) {
    var orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: 'detail?orderNo=' + orderNo,
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
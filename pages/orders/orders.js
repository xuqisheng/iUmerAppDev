// pages/orders/orders.js
var app = getApp();
Page({
  data:{
    currTab: 0,
    status: 1,
    loadingHidden: true,
    orderList: [],
    timestampFirst: 0,
    timestampLast: 0,
    mapping: [1, 0, 2, 3, 5, 4]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.loadOrders(1, "");
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
    this.setData({
      orderList: []
    });

    this.loadOrders(mapping[e.detail.current], ""); 
    this.setData( {  
      currTab: e.detail.current, 
    });
  },
  loadOrders: function(status, opType) {
    this.setData({
      loadingHidden: false
    });
    // console.log("loadComments: " + this)
    var data = {};
    data["approveStatus"] = status;
    data["customerId"] = wx.getStorageSync('id');
    data["projectId"] = this.data.projectId;
    data["pageSize"] = 10;
    if (opType) {
      data["operationType"] = opType;
      switch(opType) {
      case "up": data["timestamp"] = this.data.timestampLast; break;
      case "down": data["timestamp"] = this.data.timestampFirst; break;
      }
    }
    // console.log(data)
    var that = this;
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
            if (res.data.data.length == 0) {
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
          } else if (res.data.code == -4) {
            wx.navigateTo({
              url: '../login/login',
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
              
          }
        },
        fail: function(res) {
          console.log("loadOrders fail");
        },
        complete: function(res) {
          console.log("loadOrders complete");
          that.setData({
            loadingHidden: true
          });
        }
    });
  },
  loadMore: function(e) {
    console.log("loadMore");
    var status = e.target.dataset.status;
    this.loadOrders(status, "up");
  },
  refresh: function(e){
    console.log("refresh");
    var status = e.target.dataset.status;
    this.loadOrders(status, "down");
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
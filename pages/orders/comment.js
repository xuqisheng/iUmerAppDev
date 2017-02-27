// pages/orders/comment.js
var app = getApp();
Page({
  data:{
    levelProfession: 0,
    levelService: 0,
    levelCommunication: 0,
    txt: ""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderNo: options.orderNo
    });
    this.loadOrder();
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
  loadOrder: function() {
    var that = this;
    var orderNo = this.data.orderNo;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/order/orderDetail', 
        data: {
          orderNo: orderNo,
          customerId: wx.getStorageSync('id')
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;',
           'X-Token': wx.getStorageSync('X-TOKEN'),
           'X-Type': 3
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              orderInfo: res.data.data,
              projectId: res.data.data.projectId,
              personnelId: res.data.data.personnelId
            });
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
            })
          } else {
            
          }
        },
        fail: function(res) {
          console.log("orderDetail - loadOrder fail")
        },
        complete: function(res) {
          console.log("orderDetail - loadOrder complete")
        }
    });
  },
  txtInput: function(e) {
    this.setData({
      txt: e.detail.value
    });
  },
  chooseLevelProfession: function(e) {
    var level = e.currentTarget.dataset.level;
    this.setData({
      levelProfession: level + 1
    });
  },
  chooseLevelService: function(e) {
    var level = e.currentTarget.dataset.level;
    this.setData({
      levelService: level + 1
    });
  },
  chooseLevelCommunication: function(e) {
    var level = e.currentTarget.dataset.level;
    this.setData({
      levelCommunication: level + 1
    });
  },
  submitOrder: function(){
    var that = this;
    if (!this.data.txt) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入评价！',
        success: function(res) {

        }
      });
      return false;
    }
    if (this.data.levelProfession == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择专业评分！',
        success: function(res) {

        }
      });
      return false;
    }
    if (this.data.levelService == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择服务评分！',
        success: function(res) {

        }
      });
      return false;
    }
    if (this.data.levelCommunication == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择沟通评分！',
        success: function(res) {

        }
      });
      return false;
    }
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/order/orderComment', 
        data: {
          "customerId": wx.getStorageSync('id'),
		    	"personnelId": that.data.personnelId,
		    	"projectId": that.data.projectId,
		    	"content": that.data.txt,
		    	"domainLevel": that.data.levelProfession,
		    	"serveLevel": that.data.levelService,
		    	"communicationLevel": that.data.levelCommunication,
		    	"orderNo": that.data.orderNo
        },
        method: "POST",
        dataType: "json",
        header: {
          'Content-Type': 'application/json;charset=UTF-8;',
          'X-Token': wx.getStorageSync('X-TOKEN'),
          'X-Type': 3
        },
        success: function(res) {
          // console.log(res.data)
          var d = res.data;
          if (d.code == 1) {
           wx.showModal({
              title: '提示',
              showCancel: false,
              content: '评价提交成功！',
              success: function(res) {
                wx.switchTab({
                  url: 'orders',
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
            });
          } else if (d.code == -4) {
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
              showCancel: false,
              content: d.desc,
              success: function(res1) {
                
              }
            });
          }
        },
        fail: function(res) {
          console.log("submitOrder fail");
        },
        complete: function(res) {
          console.log("submitOrder complete");
          that.setData({
            loadingHidden: true
          });
        }
    });
  }
})
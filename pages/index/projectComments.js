// pages/index/projectDetail.js
var app = getApp();
Page({
  data:{
    currTab: 0,
    currTab2: 0,
    goodReputation: 0,
    middleReputation: 0,
    badReputation: 0,
    goodTimestampFirst: 0,
    goodTimestampLast: 0,
    middleTimestampFirst: 0,
    middleTimestampLast: 0,
    badTimestampFirst: 0,
    badTimestampLast: 0,
    goodList: [],
    middleList: [],
    badList: [],
    loadingHidden: true
  },
  onLoad:function(options){
    console.log("projectDetail onLoad");
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      projectId: options.projectId
    });
    this.loadProject();
    this.loadComments(0, ""); 
    this.updateCommentNum();
  },
  onReady:function(){
    console.log("projectDetail onReady");
    // 页面渲染完成
  },
  onShow:function(){
    console.log("projectDetail onShow");
    // 页面显示
  },
  onHide:function(){
    console.log("projectDetail onHide");
    // 页面隐藏
  },
  onUnload:function(){
    console.log("projectDetail onUnload");
    // 页面关闭
  },
  back: function(){
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
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
  switchNav: function(e) {   
    var that = this;
    // console.log(this) 
    if (this.data.currTab == e.target.dataset.current ) {  
      return false;  
    } else {  
      that.setData( {  
        currTab: e.target.dataset.current  
      }) ; 
    } 
  },
  switchSwiper: function(e) {
    var that = this;
    if (this.data.currTab == e.detail.current ) {  
      return false;  
    } else {  
      that.setData( {  
        currTab: e.detail.current  
      }) ; 
    } 
  },
  switchNav2: function(e) {   
    var that = this; 
    if (this.data.currTab2 == e.target.dataset.current) { 
      return false;  
    } else {  
      that.setData( {  
        currTab2: e.target.dataset.current  
      });
    } 
  },
  switchSwiper2: function(e) {
    var that = this;
    this.updateCommentNum();
    this.loadComments(e.detail.current, ""); 
    if (this.data.currTab2 == e.detail.current) {  
      return false;  
    } else {  
      that.setData( {  
        currTab2: e.detail.current  
      });
    } 
  },
  updateCommentNum: function(){
    var that = this;
    // console.log(this.data.projectId)
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/projectCommentGroupNum', 
        data: {
          projectId: that.data.projectId
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          that.setData({
            goodReputation: res.data.data.goodReputation,
            middleReputation: res.data.data.middleReputation,
            badputation: res.data.data.badReputation            
          })
        },
        fail: function(res) {
          console.log("updateCommentNum fail")
        },
        complete: function(res) {
          console.log("updateCommentNum complete")
        }
    });
  },
  loadComments: function(level, opType) {
    this.setData({
      loadingHidden: false
    });
    // console.log("loadComments: " + this)
    var data = {};
    data["projectId"] = this.data.projectId;
    if (level == 0) {
      data["commentLevel"] = 3;
    } else if (level == 1) {
      data["commentLevel"] = 2;
    } else if (level == 2) {
      data["commentLevel"] = 1;
    }
    data["pageSize"] = 10;
    if (opType) {
      data["operationType"] = opType;
      switch(opType) {
      case "up": data["timestamp"] = level == 0? this.data.goodTimestampLast: level == 1? this.data.middleTimestampLast: this.data.badTimestampLast; break;
      case "down": data["timestamp"] = level == 0? this.data.goodTimestampFirst: level == 1? this.data.middleTimestampFirst: this.data.badTimestampFirst; break;
      }
    }
    // console.log(data)
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/projectCommentList', 
        data: data,
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          // console.log(res.data)
          if (res.data.data.length == 0) {
            return false;
          }
          if (level == 0) {
            var goodList = opType == "down"? res.data.data.concat(that.data.goodList): opType == "up"? that.data.goodList.concat(res.data.data): res.data.data;
            that.setData({
              goodList: goodList.concat(goodList).concat(goodList).concat(goodList).concat(goodList).concat(goodList).concat(goodList),
              goodTimestampFirst: goodList[0].createDate,
              goodTimestampLast: goodList[goodList.length - 1].createDate
            });
          } else if (level == 1) {
             var middleList = opType == "down"? res.data.data.concat(that.data.middleList): opType == "up"? that.data.middleList.concat(res.data.data): res.data.data;
            that.setData({
              middleList: middleList,
              middleTimestampFirst: middleList[0].createDate,
              middleTimestampLast: middleList[middleList.length - 1].createDate
            });
          } else if (level == 2) {
             var badList = opType == "down"? res.data.data.concat(that.data.badList): opType == "up"? that.data.badList.concat(res.data.data): res.data.data;
            that.setData({
              badList: badList,
              badTimestampFirst: badList[0].createDate,
              badTimestampLast: badList[badList.length - 1].createDate
            });
          }
        },
        fail: function(res) {
          console.log("loadComments fail");
        },
        complete: function(res) {
          console.log("loadComments complete");
          that.setData({
            loadingHidden: true
          });
        }
    });
  },
  loadMore: function(e) {
    console.log("loadMore");
    var level = e.target.dataset.level;
    this.loadComments(level, "up");
  },
  refresh: function(e){
    console.log("refresh");
    var level = e.target.dataset.level;
    this.loadComments(level, "down");
  }
})
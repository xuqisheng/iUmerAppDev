// pages/index/projectDetail.js
var app = getApp();
Page({
  data:{
    currTab: 0,
    currTab2: 0,
    totalCommentNum: 0,
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
    this.loadComments(); 
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
          if (res.data.code == 1){
            that.setData({
              totalCommentNum: res.data.data.totalReputation,
              goodReputation: res.data.data.goodReputation,
              middleReputation: res.data.data.middleReputation,
              badputation: res.data.data.badReputation            
            });
          }
        },
        fail: function(res) {
          console.log("updateCommentNum fail")
        },
        complete: function(res) {
          console.log("updateCommentNum complete")
        }
    });
  },
  loadComments: function() {
    this.setData({
      loadingHidden: false
    });
    // console.log("loadComments: " + this)
    var data = {};
    data["projectId"] = this.data.projectId;
    data["commentLevel"] = 3;
    data["pageSize"] = 3;
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
          if (res.data.code == 1){
            if (res.data.data.length == 0) {
              return false;
            }
            that.setData({
              commentList: res.data.data,
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
  },
  loadProject: function() {
    this.setData({
      loadingHidden: false
    });
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/projectDetails', 
        data: {
          id: that.data.projectId,
          customerId: wx.getStorageSync('id') || 30
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1){
            var d = res.data.data;
            if (!d.picList || d.picList.length == 0) {
              var filePath = (d.header || "umer/css/image/wechat/2.jpg"); 
              that.setData({
                projectPics: [{ id: 0, filePath: filePath }]
              });
            } else {
              that.setData({
                projectPics: d.picList
              });
            }
            that.setData({
              projectUnitPrice: d.unitPrice || 0,
              projectCoursePrice: d.coursePrice || 0,
              projectCourseRemark: d.courseRemark || 0,
              projectTitle: d.projectName || "",
              projectDuration: d.duration || 0,
              projectBrand: d.brand || "",
              projectMatters: d.noticeMatters || "",
              projectApply: d.noticeMatters || "",
              shopAddress: d.shopAddress || "",
              projectDescription: d.description || "",
              ifCollect: d.ifCollect || 0,
            });
            wx.request({
              url: app.globalData.server_url + 'webService/customer/biz/index/shopDetail', 
              data: {
                id: d.shopId
              },
              method: "POST",
              dataType: "json",
              header: {
                'Content-Type': 'application/json;charset=UTF-8;'
              },
              success: function(res2) {
                // console.log(res.data)
                var d2 = res2.data.data;
                that.setData({
                  shopHeader: (d2.header + "big.jpg") || "/umer/css/image/default.jpg",
                  shopTitle: d2.shopName || "",
                  shopDescription: d2.description || "",
                  projectCount: d2.projectCount || 0,
                  personnelCount: d2.personnelCount || 0
                });
              },
              fail: function(res) {
                console.log("loadProject fail");
              },
              complete: function(res) {
                console.log("loadProject complete");
                that.setData({
                  loadingHidden: true
                });
              }
            });
          }
        },
        fail: function(res) {
          console.log("loadProject fail");
        },
        complete: function(res) {
          console.log("loadProject complete");
          that.setData({
            loadingHidden: true
          });
        }
    });
  },
  appoint: function(){
    var that = this;
    wx.redirectTo({
      url: '../quickAppoint/appointPersonnel?from=projectDetail&projectId=' + that.data.projectId,
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
  showComments: function() {
    var that = this;
    wx.navigateTo({
      url: '../index/projectComments?projectId=' + that.data.projectId,
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
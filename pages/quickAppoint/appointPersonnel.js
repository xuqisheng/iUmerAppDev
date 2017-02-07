// pages/quickAppoint/appointPersonnel.js
var app = getApp();
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

Page({
  data:{
    loadingHidden: true,
    durationNum: 0,
    selectedTime: "",
    priceDropdownHidden: true,
    priceType: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      projectId: options.projectId,
      personnelId: options.personnelId,
      priceType: options.priceType
    });
    this.loadProject();
    this.loadWeekdays();
    if (options.personnelId) {
      this.loadPersonnel();
    }
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
    });
  },
  loadProject: function(){
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
          // console.log(res.data)
          var d = res.data.data;
          if (!d.picList || d.picList.length == 0) {
            var filePath = (d.header || "https://www.iumer.cn/umer/css/image/wechat/2.jpg"); 
            that.setData({
              projectPics: [{ id: 0, filePath: filePath }]
            });
          } else {
            that.setData({
              projectPics: d.picList
            });
          }
          that.setData({
            projectFilePath: d.header || "css/image/wechat/2.jpg",
            projectUnitPrice: d.unitPrice || 0,
            projectCoursePrice: d.coursePrice || 0,
            projectCourseRemark: d.courseRemark || 0,
            projectTitle: d.projectName || "",
            projectDuration: d.duration || 0,
            shopAddress: d.shopAddress || "",
            projectDescription: d.description || "",
            ifCollect: d.ifCollect || 0,
            shopTitle: d.shopName || "",
            durationNum: d.durationNum || 0
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
  loadWeekdays: function(){
    var that = this;
    this.setData({
      loadingHidden: false
    });
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/reserve/reservePeriodList', 
        data: {
          
        },
        method: "POST",
        dataType: "json",
        header: {
          'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          // console.log(res.data)
          var d = res.data.data;
          that.setData({
            weekdays: d
          });
        },
        fail: function(res) {
          console.log("loadWeekdays fail");
        },
        complete: function(res) {
          console.log("loadWeekdays complete");
          that.setData({
            loadingHidden: true
          });
        }
    });
  },
  loadTimeslots: function(e) {
    if (!this.data.personnelId) {
      wx.showToast({
        title: '请先选择优美师',
        icon: 'success',
        duration: 5000
      });
      return false;
    }
    var date = e.currentTarget.dataset.time;
    var that = this;
    this.setData({
      chosenDate: date,
      selectedIndex: {}
    })
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/reserve/reserveTimeList', 
        data: {
          personnelId: that.data.personnelId,
          dateTime: date  
        },
        method: "POST",
        dataType: "json",
        header: {
          'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          // console.log(res.data)
          var data = res.data.data;
          that.setData({
            timeslots: data
          })
        },
        fail: function(res) {
          console.log("loadTimeslots fail");
        },
        complete: function(res) {
          console.log("loadTimeslots complete");
          that.setData({
            loadingHidden: true
          });
        }
    });
  },
  loadPersonnel: function(){
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/personnelDetail', 
        data: {
          id: that.data.personnelId
        },
        method: "POST",
        dataType: "json",
        header: {
          'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          // console.log(res.data)
          var d = res.data.data;
          that.setData({
            personnelHeader: d.header || "/css/image/default.jpg",
            personnelName: d.name || ""
          });
        },
        fail: function(res) {
          console.log("loadPersonnel fail");
        },
        complete: function(res) {
          console.log("loadPersonnel complete");
          that.setData({
            loadingHidden: true
          });
        }
    });
  },
  choosePersonnel: function(){
    var that = this;
    console.log(that.data)
    wx.redirectTo({
      url: 'choosePersonnel?projectId=' + that.data.projectId + "&priceType=" + that.data.priceType,
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
  chooseTime: function(e) {
    var timeIdx = e.currentTarget.dataset.index;
    var durationNum = this.data.durationNum;
    var selectedIndex = {};
    var data = this.data.timeslots;
    var chosenHours = [];
    var timeslots = this.data.timeslots;
    if (timeIdx + durationNum - 1> data.length - 1) {
      chosenHours = [];
      this.setData({
        selectedTime: "",
        selectedIndex: {}
      });
      return false;
    }
    for (var i = 0; i < durationNum; i++) {
      var idx = timeIdx + i;
      if (timeslots[idx].ifEnd == 1 || timeslots[idx].ifReserve == 1) {
          chosenHours = [];
          this.setData({
            selectedTime: "",
            selectedIndex: {}
          });
        return false;
      }
    }
    for (var i = 0; i < durationNum; i++) {
      var idx = timeIdx + i;
      chosenHours.push(timeslots[idx].time);
      selectedIndex[idx] = true;
    }
    this.setData({
      selectedIndex: selectedIndex
    });
    if (chosenHours.length == 0) {
      this.setData({
        selectedTime: ""
      });
    } else if (chosenHours.length == 1) {
      this.setData({
        selectedTime: this.data.chosenDate + " " + chosenHours[0]
      });
    } else {
      chosenHours.sort();
      this.setData({
        selectedTime: this.data.chosenDate + " " + chosenHours[0]
      });
    }
  },
  togglePriceType: function(){
    var hidden = this.data.priceDropdownHidden;
    this.setData({
      priceDropdownHidden: !hidden
    })
  },
  changePriceType: function(e){
    var priceType = e.currentTarget.dataset.pricetype;
    this.setData({
      priceType: priceType
    });
  }
})
// pages/quickAppoint/appointPersonnel.js
var app = getApp();
Page({
  data:{
    loadingHidden: true,
    durationNum: 0,
    selectedTime: "",
    priceDropdownHidden: true,
    priceType: 0,
    reservePhone: wx.getStorageSync('phone'),
    reserveName: wx.getStorageSync('name')
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      projectId: options.projectId,
      personnelId: options.personnelId,
      priceType: options.priceType || 0,
      orderNo: options.orderNo
    });
    this.loadProject();
    this.loadPersonnel();
    this.loadWeekdays();
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
    wx.redirectTo({
      url: "../index/projectDetail?projectId=" + this.data.projectId, // 回退前 delta(默认为1) 页面
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
          if (res.data.code == 1) {
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
                if (res2.data.code == 1) {
                  var d2 = res2.data.data;
                  that.setData({
                    shopHeader: (d2.header + "big.jpg") || "/umer/css/image/default.jpg",
                    shopTitle: d2.shopName || "",
                    shopDescription: d2.description || "",
                    projectCount: d2.projectCount || 0,
                    personnelCount: d2.personnelCount || 0
                  });
                } else {

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
          } else {
            
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
          if (res.data.code == 1) {
            var d = res.data.data;
            that.setData({
              weekdays: d
            });
          } else {

          }
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
      chosenHours: [],
      selectedTime: "",
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
          if (res.data.code == 1) {
            var data = res.data.data;
            that.setData({
              timeslots: data
            })
          } else {

          }
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
          if (res.data.code == 1) {
            var d = res.data.data;
            that.setData({
              personnelHeader: d.header || "/css/image/default.jpg",
              personnelName: d.name || ""
            });
          } else {

          }
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
    chosenHours.sort();
    this.setData({
      selectedIndex: selectedIndex,
      chosenHours: chosenHours
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
      // chosenHours.sort();
      this.setData({
        selectedTime: this.data.chosenDate + " " + chosenHours[0]
      });
    }
  },
  togglePriceType: function() {
    var hidden = this.data.priceDropdownHidden;
    this.setData({
      priceDropdownHidden: !hidden
    })
  },
  changePriceType: function(e) {
    var priceType = e.currentTarget.dataset.pricetype;
    this.setData({
      priceType: priceType
    });
  },
  submitOrder: function(e) {
    var that = this;
    
    if (!that.data.projectId) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择项目！',
        success: function(res) {

        }
      });
      return false;
    }
    if (!that.data.personnelId) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择优美师！',
        success: function(res) {

        }
      });
      return false;
    }
    if (!that.data.chosenDate || !that.data.chosenHours || that.data.chosenHours.length == 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择预约时间！',
        success: function(res) {

        }
      });
      return false;
    }
    if (!that.data.reserveName) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入预约人姓名！',
        success: function(res) {

        }
      });
      return false;
    }
    if (!that.data.reservePhone) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入预约手机号！',
        success: function(res) {

        }
      });
      return false;
    }
    if (that.data.priceType == "") {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择价格类型！',
        success: function(res) {

        }
      });
      return false;
    }
    var startDateStr = that.data.chosenDate + " " + that.data.chosenHours[0];
		var startDate = new Date(startDateStr.replace(new RegExp(/-/g),'/'));
		var endDateStr = that.data.chosenDate + " " + that.data.chosenHours[that.data.chosenHours.length - 1];
		var endDate = new Date(endDateStr.replace(new RegExp(/-/g),'/'));
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/reserve/orderSave', 
        data: {
          "projectId": that.data.projectId,
	        "personnelId": that.data.personnelId,
	        "customerId": wx.getStorageSync('id'),
	        "makeStartDate": startDate.getTime(),
	        "makeEndDate": endDate.getTime(),
	        "reserveName" : that.data.reserveName,
	        "reservePhone": that.data.reservePhone,
	        "priceType": that.data.priceType
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
              confirmColor: '#FD8CA3',
              content: '订单提交成功',
              success: function(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../orders/pay?orderNo=' + d.data,
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
              confirmColor: '#FD8CA3',
              content: d.desc,
              success: function(res) {
                if (res.confirm) {
                  
                }
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
  },
  inputReserveName: function(e) {
    this.setData({
      reserveName: e.detail.value
    });
  },
  inputReservePhone: function(e) {
    var value = e.detail.value;
    var last = value.charAt(value.length - 1);
    if (last > '9' || last < '0') {
      value = value.slice(0, value.length - 1);
    }
    this.setData({
      reservePhone: value
    });
    return value;
  },
  cancelOrder: function() {
    var that = this;
    if (that.data.from == "personnelDetail") {
      wx.redirectTo({
        url: '../index/personnelDetail?personnelId=' + that.data.personnelId,
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
      wx.redirectTo({
        url: '../orders/detail?orderNo=' + that.data.orderNo,
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
  }
})
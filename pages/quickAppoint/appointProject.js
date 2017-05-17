// pages/quickAppoint/appointProject.js
var app = getApp();
Page({
  data:{
    loadingHidden: true,
    durationNum: 0,
    selectedTime: "",
    priceDropdownHidden: true,
    priceType: 0,
    reservePhone: wx.getStorageSync('phone'),
    reserveName: wx.getStorageSync('name'),
    submitOrderTimeStamp: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      personnelId: options.personnelId,
      projectId: options.projectId,
      priceType: options.priceType || 0,
      'from': options.from || '',
      activityId: options.activityId,
      referrer: options.referrer
    });
    this.loadPersonnel();
    this.loadWeekdays();
    if (options.projectId) {
      this.loadProject();
    }
    wx.setNavigationBarTitle({
      title: '预约'
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
  loadPersonnel: function() {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/personnelDetail', 
        data: app.encode({
          id: that.data.personnelId,
          latitude: wx.getStorageSync('latitude'),
          longitude: wx.getStorageSync('longitude')
        }),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              personnelInfo: res.data.data          
            });
          }
        },
        fail: function(res) {
          console.log("loadPersonnel fail")
        },
        complete: function(res) {
          wx.hideNavigationBarLoading();
          console.log("loadPersonnel complete")
        }
    });
  },
  loadWeekdays: function(){
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.server_url + 'webService/common/reservePeriodList', 
        data: app.encode({
          
        }),
        method: "POST",
        dataType: "json",
        header: {
          'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            var d = res.data.data;
            that.setData({
              weekdays: d,
              first: d[0].dateTime
            });
            that.loadTimeslots();
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
          console.log("loadWeekdays fail");
        },
        complete: function(res) {
          console.log("loadWeekdays complete");
          wx.hideNavigationBarLoading();
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
    var date = e? e.currentTarget.dataset.time: this.data.first;
    var that = this;
    this.setData({
      chosenDate: date,
      chosenHours: [],
      selectedTime: "",
      selectedIndex: {}
    })
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.server_url + 'webService/common/reserveTimeList', 
        data: app.encode({
          personnelId: that.data.personnelId,
          dateTime: date  
        }),
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
          console.log("loadTimeslots fail");
        },
        complete: function(res) {
          console.log("loadTimeslots complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  loadProject: function(){
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/projectDetails', 
        data: app.encode({
          id: that.data.projectId,
          customerId: wx.getStorageSync('id'),
          projectActivityId: that.data.activityId
        }),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            var d = res.data.data;
            if (!d.picList || d.picList.length == 0) {
              var filePath = ("/umer/css/image/default.jpg"); 
              that.setData({
                projectPics: [{ id: 0, filePath: filePath }]
              });
            } else {
              that.setData({
                projectPics: d.picList
              });
            }
            that.setData({
              item: d,
              projectName: d.projectName || "",
              projectHeader: 'https://www.iumer.cn/' + that.data.projectPics[0].filePath || "https://www.iumer.cn/umer/css/image/default.jpg",
              projectUnitPrice: d.unitPrice || 0,
              projectCoursePrice: d.coursePrice || 0,
              projectCourseRemark: d.courseRemark || "",
              durationNum: d.durationNum || 0
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
          console.log("loadProject fail");
        },
        complete: function(res) {
          console.log("loadProject complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  chooseProject: function(){
    var that = this;
    console.log(that.data)
    wx.redirectTo({
      url: 'chooseProject?personnelId=' + that.data.personnelId + "&priceType=" + that.data.priceType + '&from=' + that.data.from,
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
    if (!this.data.projectId) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请选择项目！',
        success: function(res) {

        }
      });
      return false;
    }
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
  radioChange: function(e) {
    this.setData({
      priceType: e.detail.value
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
    var startDateStr = that.data.chosenDate + " " + that.data.chosenHours[0] + ':00';
		//var startDate = new Date(startDateStr.replace(new RegExp(/-/g),'/'));
		var endDateStr = that.data.chosenDate + " " + that.data.chosenHours[that.data.chosenHours.length - 1] + ':00';
		//var endDate = new Date(endDateStr.replace(new RegExp(/-/g),'/'));
    var timestamp = e.timeStamp;
    if (timestamp - that.data.submitOrderTimeStamp < 500) {

    } else {
      wx.showNavigationBarLoading();

      wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/reserve/orderSave', 
          data: app.encode({
            "projectId": that.data.projectId,
            "personnelId": that.data.personnelId,
            "customerId": wx.getStorageSync('id'),
            "makeStartDate": startDateStr,
            "makeEndDate": endDateStr,
            "reserveName" : that.data.reserveName,
            "reservePhone": that.data.reservePhone,
            "priceType": that.data.priceType,
            "projectActivityId": that.data.activityId,
            "referrer": that.data.referrer
          }),
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
            wx.hideNavigationBarLoading();
          }
      });
    }
    that.setData({
      submitOrderTimeStamp: timestamp
    })
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
      wx.switchTab({
        url: 'quickAppoint',
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
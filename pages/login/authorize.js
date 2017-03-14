var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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
  login: function(){
    wx.login({
      success: function(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: app.globalData.server_url + 'webService/common/getOpenId',
            data: {
              jsCode: '' + res.code
            },
            method: "POST",
            dataType: "json",
            header: {
              'Content-Type': 'application/json;charset=UTF-8;'
            },
            success: function(r) {
              wx.setStorageSync('openId', r.data.data.openid);
              wx.request({
                url: app.globalData.server_url + 'webService/customer/sys/user/miniAppLogin',
                data: {
                  openId: '' + r.data.data.openid
                },
                method: "POST",
                dataType: "json",
                header: {
                  'Content-Type': 'application/json;charset=UTF-8;'
                },
                success: function(rr) {
                  if (rr.data.data.phone) {
                    wx.setStorageSync('phone', rr.data.data.phone);
                    wx.redirectTo({
                      url: 'loginPwd',
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
                    wx.showModal({
                      title: '提示',
                      confirmColor: '#FD8CA3',
                      content: '手机号未绑定',
                      confirmText: '前往绑定',
                      success: function(res) {
                        if (res.confirm) {
                          wx.redirectTo({
                            url: 'login',
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
                  }
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },
  cancel: function() {
    wx.switchTab({
      url: '../index/index',
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
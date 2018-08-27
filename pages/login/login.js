// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showInviteCode: false,
    userInfo: {
      phoneCode: '',
      verificationCode: '',
    },
    btnText: '获取验证码',
    disBtn: false,
    time: 60,
    userBaseInfo: null
  },
  onGotUserInfo: function (e) {
    var _that = this;
    if (e.detail.userInfo) {
      console.log("用户允许获取信息");
      _that.setData({ 'userBaseInfo': e.detail.userInfo })
      _that.phoneLogin()
    } else {
      console.log("用户拒绝获取信息");
    }
  },
  switchInviteCode() {
    this.setData({ showInviteCode: true })
  },
  //获取手机号input值
  getPhoneCode(e) {
    console.log(e)
    // var phoneCode =;
    this.setData({ 'userInfo.phoneCode': e.detail.value })
  },
  //获取验证码input值
  getVerificationCode(e) {
    console.log(e)
    this.setData({ 'userInfo.verificationCode': e.detail.value })
    console.log(this.data.userInfo)
  },
  time() {
    var _that = this;
    if (_that.data.time > 0) {
      _that.setData({ 'time': _that.data.time - 1 })
      //                 console.log(this.time);
      _that.setData({ 'btnText': "倒计" + _that.data.time + "s" });
      setTimeout(_that.time, 1000);
    } else {
      _that.setData({ 'time': 60 })
      _that.setData({ 'btnText': "获取验证码" });
      _that.setData({ 'disBtn': false })
    }
  },
  //发送短信验证码
  sendCode() {
    var _that = this;
    var obj = {};
    obj.mobile = this.data.userInfo.phoneCode;
    getApp().sendRequest.http('/api/captcha', 'POST', JSON.stringify(obj))
      .then(res => {
        console.log(res)
        if (res.statusCode === 400) {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        } else if (res.statusCode === 200) {
          wx.showToast({
            title: "发送成功",
            success: function () {
              _that.setData({ 'disBtn': true });
              _that.time();
            }
          })
        }
      })
  },
  //手机登录
  phoneLogin() {
    // console.log(getApp().globalData.tuiguserID)
    var _that = this;
    if (_that.data.userInfo.phoneCode === '') {
      return wx.showToast({
        title: "手机号码不能为空",
        icon: 'none',
        duration: 2000,
      })
    } else if (_that.data.userInfo.verificationCode === '') {
      return wx.showToast({
        title: "验证码不能为空",
        icon: 'none',
        duration: 2000,
      })
    }
    var obj = {};
    obj.username = _that.data.userInfo.phoneCode;
    obj.code = _that.data.userInfo.verificationCode;
    obj.recommenderId = getApp().globalData.tuiguserID;

  

    console.log(obj)
    getApp().sendRequest.http("/api/account/login", 'POST', JSON.stringify(obj)).then(res => {
      console.log(res)
      if (res.statusCode === 200) {
        //保存token
        wx.setStorageSync('token', "Bearer " + res.data.id_token);
        // app.globalData.userToken='Bearer ' + res.data.id_token;
        //绑定第三方
        _that.thirdPartyBind();
        //获取用户信息传送积分
        _that.getUserInfoDataFn();
        wx.switchTab({
          url: '/pages/index/index',
        })

      } else {
        wx.showToast({
          title: res.data + "请重新获取验证码",
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  //绑定第三方登录
  thirdPartyBind() {
    var _that = this;
    var obj = {}
    obj.username = getApp().globalData.userOpenId;
    obj.platform = "miniplatform";
    if (_that.data.userBaseInfo === null) {
      obj.nickname = ''
      obj.photo = ''
    } else {
      obj.nickname = _that.data.userBaseInfo.nickName;
      obj.photo = _that.data.userBaseInfo.avatarUrl;
    }

    console.log(obj)
    console.log(wx.getStorageSync('token'))
    getApp().sendRequest.http('/api/thirdParty/bind', 'POST', JSON.stringify(obj), { 'Authorization': wx.getStorageSync('token') }).then(res => {
      console.log(res)
      if (res.statusCode === 200 && res.data.code === '1') {
        console.log("绑定登录成功")
      }
    })
  },
  //获取用户信息包括id
  getUserInfoDataFn() {
    var _that = this;
    getApp().sendRequest.http('/api/account', 'GET', {}, { 'Authorization': wx.getStorageSync('token') }).then(res => {
      console.log(res)
      if (res.statusCode === 200) {
        wx.setStorageSync('userInfo', res.data);
      }
    }).then(function () {
      _that.transferIntergral();
    })
  },
  //传送积分
  transferIntergral() {
    var _that = this;
    var userinfo = wx.getStorageSync('userInfo');
    getApp().sendRequest.http('/api/money/check', 'GET', { userId: userinfo.userId }, { 'Authorization': wx.getStorageSync('token') }).then(res => {
      console.log(res)
      return res.data.content
    }).then(function (j) {
      console.log(j)
      var balance;
      var uname = j.user.username;
      var appKey = getApp().globalData.appKey;
      var appSecret = getApp().globalData.appSecret;
      if (j.pointBalance === null) {
        balance = 0;
      } else {
        balance = j.pointBalance;
      }
      console.log
      getApp().sendRequest.ajax('/api/point/username', 'GET', { nowBalance: parseInt(balance), appKey: appKey, appSecret: appSecret, username: uname }).then(res => {
        console.log(res)
        if (res.data.code === "1") {
          console.log("传送积分成功")
        }
      })
    })
  },
  //微信登录
  // wxLogin(){
  //   wx.login({
  //     success: function (res) {
  //       //获取code码
  //       console.log(res.code)
  //       if (res.code) {
  //         var code = res.code;
  //         wx.getUserInfo({
  //           success: function (res) {
  //             console.log("成功")
  //             console.log(res)
  //           },
  //           fail: function (err) {
  //             console.log("失败")
  //             console.log(err)
  //           }
  //         })
  //       } else {
  //         console.log('获取用户登录态失败！' + res.errMsg)
  //       }
  //     },
  //     fail: function () {

  //     }
  //   });
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _that = this;
    console.log(wx.getStorageSync('token'));
    var scene = decodeURIComponent(options.scene);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
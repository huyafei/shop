//index.js
//获取应用实例
const app = getApp()
const $ajax = app.sendRequest.ajax
// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'无锡',
    imgUrls: [
      '/imgs/banner/banner1.png',
      '/imgs/banner/banner1.png'
    ],
  
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000
  },
  //跳转附近门店
  jumpPage(e) {
    let url = e.currentTarget.dataset.pageurl
    wx.navigateTo({
      url: url
    })
  },
  //获取自定义分类列表
  getCustomCategories(){
    console.log(app)
    $ajax('/api/customCategories','get',{}).then(res=>{
      console.log(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCustomCategories();
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

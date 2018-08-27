
let baseShopUrl = 'https://shop-api.easyapi.com';
let baseUrl = 'https://api.51vrhq.com';
//一般请求
var http = function (url, method, data, header) {


  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: baseUrl+url,
      data: data,
      method: method,
      header: header,
      success: resolve,
      fail: reject
    })
  });
  return promise;
};




//微商城请求
module.exports.ajax = function (url, method, data) {
  wx.showLoading({
    title: '加载中',
  })
  data.appKey ='vvhepgd6jr6fyoi7';
  data.appSecret ='f0woiiwcrtiretz3';
  var promise = new Promise(function (resolve, reject) {
    if (method==='get'){
      wx.request({
        url: baseShopUrl + url,
        data: data,
        method: 'get',
        success: function (res) {
          wx.hideLoading()
          resolve (res)
        },
        fail: reject
      })
  
    } else if (method === 'post'){
      wx.request({
        url: baseShopUrl + url,
        data: data,
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res){
          wx.hideLoading()
          resolve(res)
        },
        fail: reject
      })
    }
  });
  return promise;
};

module.exports.http = http 

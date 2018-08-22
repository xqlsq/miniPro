var wxCharts = require('../../libs/wx-charts.min.js');
var util = require('../../utils/util.js');
var app = getApp();
var pie, line;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    var nowPieDatas = this.data._pieDatas[this.data.dateKeys[e.detail.value]];
    var pieDatas = Object.keys(nowPieDatas).map((key) => {
      return {
        name: app.globalData.tags[key],
        data: nowPieDatas[key]
      };
    });
    pie.updateData({
      series: pieDatas
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var datas = wx.getStorageSync('_noteDatas');
    var _pieDatas = {};
    var pieDatas = [];
    var lineData = {};
    Object.keys(datas).forEach(((key) => {
      var _key = key.slice(0, -3);
      lineData[_key] = lineData[_key] ? lineData[_key] + datas[key].reduce((t,c) => t+Number(c.rmb),0) : datas[key].reduce((t,c) => t+Number(c.rmb),0)
      datas[key].forEach((d) => {
        if (_pieDatas[_key]) {
          _pieDatas[_key][d.tagIndex] =_pieDatas[_key][d.tagIndex] ? _pieDatas[_key][d.tagIndex] +  Number(d.rmb) :  Number(d.rmb);
        } else {
          _pieDatas[_key] = {};
          _pieDatas[_key][d.tagIndex] = Number(d.rmb);
        }
      });
    }));
    var keys = Object.keys(_pieDatas);
    this.setData({
      _pieDatas,
      dateKeys: keys.sort(),
      index: keys.findIndex((key) => key === options.date.slice(0,-3))
    });
    var nowPieDatas = _pieDatas[keys.slice(-1)];
    pieDatas = Object.keys(nowPieDatas).map((key) => {
      return {
        name: app.globalData.tags[key],
        data: nowPieDatas[key]
      };
    });
    pie = new wxCharts({
      canvasId: 'pie',
      type: 'pie',
      background: '#000',
      series: pieDatas,
      width: app.globalData.systeminfo.windowWidth,
      height: 300,
      dataLabel: true,
    });
    var categories = Object.keys(lineData).reverse();
    line = new wxCharts({
      canvasId: 'line',
      type: 'line',
      categories: categories,
      series: [{
        name: '月份',
        data: categories.map((c) => lineData[c]),
      }].reverse(),
      yAxis: {
        title: '每月消费金额 (元)',
        min: 0
      },
      width: app.globalData.systeminfo.windowWidth,
      height: 200
    });
  },
})
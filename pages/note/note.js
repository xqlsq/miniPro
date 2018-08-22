var util = require('../../utils/util.js');

Page({
  data: {
    scrollHeight: 0,
    scrollY: false,
    now: util.formatDate(new Date()),
    date: util.formatDate(new Date()),
    datas: [
      {
        project: '买菜',
        rmb: 100,
        tagIndex: 1
      },
      {
        project: '苹果',
        rmb: 800,
        tagIndex: 2
      },
    ]
  },
  onLoad(options) {
    var that = this;
    var _noteDatas = wx.getStorageSync('_noteDatas');
    if (!_noteDatas) {
      wx.setStorageSync('_noteDatas', {});
    }
    wx.getStorage({
      key: '_noteDatas',
      success(res) {
        that.setData({
          datas: res.data[that.data.date] || []
        });
      }
    })
    util.observer(this, this.data, 'datas', (newVal) => {
      this.setData({
        total: newVal.reduce((t,c) => t+(Number(c.rmb) || 0), 0)
      });
      var _noteDatas = wx.getStorageSync('_noteDatas')
      _noteDatas[this.data.date] = newVal;
      wx.setStorage({
        key: '_noteDatas',
        data: _noteDatas
      });
    });
    util.observer(this, this.data, 'date', (newVal) => {
      var _noteDatas = wx.getStorageSync('_noteDatas');
      this.setData({
        datas: _noteDatas[newVal] || []
      });
    });
    const query = wx.createSelectorQuery();
    query.select('.row').boundingClientRect();
    query.select('.date').boundingClientRect();
    query.select('.container').boundingClientRect();
    query.exec((res) => {
      this.setData({
        scrollHeight: res[2].height - res[1].height - res[0].height
      });
    });
  },
  touchstart(e) {
    const currentIndex = e.target.dataset.index;
    var activeIndex;
    var { datas } = this.data;
    datas.forEach((data, index) => {
      if (data.isActive) {
        activeIndex = index
      }
    });
    if (activeIndex !== undefined && activeIndex !== currentIndex) {
      datas[activeIndex].isActive = false;
      this.setData({
        datas
      });
    }
  },
  containerTap(e) {
    this.deactivate();
  },
  scroll(e) {
    this.deactivate();
  },
  deactivate() {
    var { datas } = this.data;
    var count = 0;
    datas = datas.map((data) => {
      if (data.isActive) {
        data.isActive = false;
        count++;
      }
      return data;
    });
    count > 0 && this.setData({
      datas
    });
  },
  active(e) {
    const { datas } = this.data;
    datas[e.detail.index].isActive = true;
    this.setData({
      datas
    });
  },
  delete(e) {
    const { datas } = this.data;
    this.setData({
      datas: datas.filter((c, index) => e.detail.index !== index)
    });
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  prevDate() {
    var timeStamp = new Date(this.data.date).getTime();
    this.setData({
      date: util.formatDate(new Date(timeStamp - 86400000))
    })
  },
  nextDate() {
    var timeStamp = new Date(this.data.date).getTime();
    this.setData({
      date: util.formatDate(new Date(timeStamp + 86400000))
    })
  },
  canScroll(e) {
    this.setData({
      scrollY: e.detail.canScroll
    });
  },
  modifyItem(e) {
    wx.navigateTo({
      url: '/pages/editAccount/editAccount?method=modify&index='+e.currentTarget.dataset.index
    });
  },
  addItem() {
    wx.navigateTo({
      url: '/pages/editAccount/editAccount?method=add'
    });
  },
  toOverview() {
    wx.navigateTo({
      url: '/pages/overview/overview?date=' + this.data.date
    });
  }
})
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tags: app.globalData.tags,
  },

  onLoad(option) {
    var pages = getCurrentPages();
    if(option.method === 'modify') {
      var data = pages[pages.length -2].data.datas[option.index];
      this.setData({
        ...data
      });
    }
    this.setData({
      ...option
    });
  },
  
  bindPickerChange(e) {
    this.setData({
      tagIndex: e.detail.value
    });
  },
  projectChange(e) {
    this.setData({
      project: e.detail.value
    });
  },
  rmbChange(e) {
    this.setData({
      rmb: e.detail.value
    });
  },
  cancel() {
    wx.navigateBack();
  },
  submit() {
    if (!this.data.project) {
      wx.showModal({
        content: '消费项目要填一下下哦～',
        showCancel: false,
      });
    }
    else if (!this.data.rmb) {
      wx.showModal({
        content: '东西不要钱啊～',
        showCancel: false,
      });
    }
    else if (this.data.tagIndex !== 0 && !this.data.tagIndex) {
      wx.showModal({
        content: '打个标签吧，以后会有大用的',
        showCancel: false,
      });
    } else {
       var pages = getCurrentPages();
       var page = pages[pages.length -2] ;
       const data = {
         project: this.data.project,
         rmb: this.data.rmb,
         tagIndex: this.data.tagIndex
       }
       if (this.data.method === 'modify') {
        page.data.datas[this.data.index] = data
       } else {
        page.data.datas.push(data);
       }
       page.setData({
          datas: page.data.datas
       });
       wx.navigateBack();
    }
  }
})
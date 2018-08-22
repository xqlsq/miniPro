//index.js
//获取应用实例
const app = getApp()
var bmap = require('../../libs/bmap-wx.js');
var utils = require('../../utils/util.js')
var BMap;
var isFirstLoad = false;
Page({

    data: {
        weatherData: null,
        updateTime: '',
        searchCity: '',
        adviceIcons: ['clothing.png', 'carwashing.png', 'pill.png', 'running.png', 'sun.png'],
    },

    onLoad() {
        isFirstLoad = true;
        this.fetchWeather();
    },

    searchCity() {
        wx.navigateTo({
            url: '../chooseCity/chooseCity'
        })
    },

    fetchWeather(param) {
        !BMap && (BMap = new bmap.BMapWX({
            ak: app.globalData.BMapAk
        }));
        BMap.weather({
            fail: (data) => wx.showToast({
                icon: 'none',
                title: '获取天气失败，原因：' + data.errMsg || '',
                duration: 2000
            }),
            success: (data) => {
                if (isFirstLoad) {
                    app.globalData.locationCity = data.currentWeather[0].currentCity;
                    isFirstLoad = false;
                }
                this.setData({
                    weatherData: data.originalData.results[0],
                    searchCity: data.currentWeather[0].currentCity,
                    updateTime: utils.formatTime(new Date(), 'MM-dd hh:mm')
                })
            },
            ...param
        });
    },

    onPullDownRefresh() {
        this.updateWeather();
    },

    updateWeather() {
        const requestUrl = app.setGeocoderUrl(this.data.searchCity);
        wx.request({
            url: requestUrl,
            success: this.updateWeatherSuccess,
            fail: () => this.updateWeatherFail(),
            complete: wx.stopPullDownRefresh
        });
    },

    updateWeatherFail(data) {
        
    },

    updateWeatherSuccess(data) {
        const location = data.data.result.location
        this.fetchWeather({
            location: location.lng + ',' + location.lat
        });
    }
})
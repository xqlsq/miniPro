const app = getApp()
const STORAGE_CITYS = 'historyList';
const staticData = require('../../constants/staticData.js');
const cityList = staticData.cities.reduce((sets, current) => {
	if (sets[current.letter]) {
		sets[current.letter].push(current.name);
	} else {
		sets[current.letter] = [current.name];
		!sets.keys && (sets.keys = []);
		sets.keys.push(current.letter);
		sets.keys = sets.keys.sort();
	}
	return sets;
}, {});
var stickies = [];
var stickyContaniers = [];

Page({

	data: {
		top: 0,
		cityList,
		searchPageVisible: false,
		searchList: [],
		historyList: [],
		inputText: '',
		locationCity: ''
	},

	onLoad() {
		this.setData({
			locationCity: app.globalData.locationCity
		});
	},

	onShow() {
		this.setData({
			historyList: wx.getStorageSync(STORAGE_CITYS) || []
		})
	},

	clearHistory: function() {
		wx.removeStorageSync(STORAGE_CITYS)
		this.setData({
			historyList: []
		});
	},

	onChooseCity: function(e) {
		const city = e.currentTarget.dataset.city;
		const historyList = wx.getStorageSync(STORAGE_CITYS) || [] ;

		if (city && historyList.indexOf(city) === -1) {
			const data = historyList.concat(city);
			wx.setStorage({
				key: STORAGE_CITYS,
				data
			})
			this.setData({
				historyList: data
			});
		}
		const Pages = getCurrentPages();
		Pages[Pages.length -2].setData({
			searchCity: city
		});
		Pages[Pages.length -2].updateWeather();
		wx.navigateBack();
	},

	clearInput: function(e) {
		this.setData({
			inputText: '',
			searchPageVisible: false
		});
	},

	onSearch: function(e) {
		const inputText = e.detail.value;
		const { cities } = staticData;
		const cityReg = /[\u4e00-\u9fa5]/img;
		const matches = inputText.match(cityReg);
		if (matches) {
			const searchText = matches.join('');
			this.setData({
				searchList: cities.filter((city) => {
					return city.name.indexOf(searchText) !== -1
				})
			});
		} else {
			this.setData({
				searchList: []
			});
		}
		this.setData({
			searchPageVisible: inputText !== ''
		});
		
	},

	onReady: function () {
		const query = wx.createSelectorQuery();
		query.select('.search').boundingClientRect(((rect) => {
			this.setData({
				top: rect.height
			});
		}));
		query.selectAll('.stickyContanier').boundingClientRect((rects) => {
			stickyContaniers = rects.map(({ top }) => ({ top }));
		});
		query.exec();
	},

	scrollTo: function(e){
		wx.pageScrollTo({
			scrollTop: stickyContaniers[e.currentTarget.dataset.key].top,
			duration: 0
	  })
  }
})
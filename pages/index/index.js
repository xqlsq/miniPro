const app = getApp();
const speed = 10000;
const interval = 500;
var heartTimer = null;
var birthTimer = null;
var index = 0;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		menusInfo: [{
			img: '/img/weather1.png',
			url: '/pages/weather/weather'
		},{
			img: '/img/edit.png',
			url: '/pages/note/note'
		}],
		screenRect: {
			width: app.globalData.systeminfo.screenWidth,
			height: app.globalData.systeminfo.screenHeight
		},
		births: [],
    	flowers: [],
		animation: {},
		showModal: false,
		wish: '',
		whispers: [
			'0819~生日快乐！',
			'幸福快乐每一天！',
			'越来越漂亮哦～',
			'元气美少女',
			'比心❤️',
			'身体健康，心想事成',
			' 愿所有的快乐、所有的幸福、所有的温馨、所有的好运围在你身边',
			'今年你二十五啦！就问你怕不？old菇凉',
			'永远十八！！',
			'爱你每一天哦～～',
			'天空中最亮的那一颗就是你！！',
			'第一次给你过生日，怎么样，我的礼物不错吧！哼～！！',
			'大吉大利，天天吃鸡😊',
			'给爷笑一个？？？！！！！！',
			'恭祝你福寿与天齐！恭贺你生辰快乐！！',
			'祝福一位美丽迷人、聪明大方、温柔可爱的人儿生日快乐',
			'每天都要开心开心，能量满满哦～～',
			'上一次生日是谁陪你过得呢？以后都是我了，哈哈～！',
			'咳咳，提前告知下，我的生日不要送太贵的东西...',
			'happy birthday to you！刘小蓉！！'
		],
	},
	onLoad() {
		this.loopPlay();
		wx.onBackgroundAudioStop(this.loopPlay);
	},

	loopPlay() {
		var songs = ['http://www.ytmp3.cn/down/48455.mp3', 'http://www.ytmp3.cn/down/50235.mp3'];
		wx.playBackgroundAudio({
			dataUrl: songs[index++]
		});
		index >= songs.length && (index = 0);
	},

	onShow: function (options) {
		this.createBirth();
		this.createFlowers();
	},

	onHide() {

	},

	surprise() {
		this.setData({
			showModal: true,
			wish: this.data.whispers[parseInt(Math.random() * (20))]
		});
		var animation = wx.createAnimation({
			duration: 850
		});
		animation.scale(1.5, 1.5).step();
		animation.scale(1, 1).step();
		this.setData({
			heartAnimation: animation.export()
		});
		heartTimer = setInterval(() => {
			animation.scale(1.5, 1.5).step();
			animation.scale(1, 1).step();
			this.setData({
				heartAnimation: animation.export()
			});
		}, 1700);

	},
	close() {
		this.setData({
			showModal: false
		});
		clearInterval(heartTimer);
	},
	createBirth() {
		var births = [];
		// var {
		// 	windowWidth: screenWidth
		// } = app.globalData.systeminfo;
		for (var i = 0; i < 19; i++) {
			var birth = {};
			birth.url = `/img/birth${parseInt(Math.random()*4 + 1)}.png`;
			birth.key = i;
			births.push(birth);
		}
		this.setData({
			births
		});
	},

	createFlowers() {
		var flowers = [];
		for (var i = 0; i < 8; i++) {
			var flower = {};
			flower.url = `/img/flower.png`;
			flower.key = i;
			flowers.push(flower);
		}
		this.setData({
			flowers
		});
	}
})
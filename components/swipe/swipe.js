var touchMFirstTime = true;
var isHorizontal = true;
const app = getApp();
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		data: {
			type: Object,
			observer: function(newVal, oldVal, changedPath) {
				if (oldVal && newVal && !newVal.isActive && oldVal.isActive ) {
					this.setData({
						moveX: 0
					});
				}
			}
		},
		index: Number
	},

	ready() {
		var query = this.createSelectorQuery();
		query.select('.hiddenHandle').boundingClientRect();
		query.select('.swipe').boundingClientRect();
		query.exec((res) => {
			this.setData({
				buttonWidth: res[0] ? res[0].width : 0,
				containerWidth: res[1] ? res[1].width : 0
			});
		});
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		containerWidth: 1000,
		buttonWidth: 0,
		touchX: 0,
		touchY: 0,
		moveX: 0,
		isMovingLeft: false,
		tags: app.globalData.tags
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		delete(e) {
			this.triggerEvent('delete', {
				index: this.properties.index
			}, {})
		},
		touchS(e) {
			if (e.touches.length === 1) {
				this.setData({
					touchX: e.touches[0].clientX,
					touchY: e.touches[0].clientY
				});
			}
		},
		touchM(e) {
			if (e.touches.length === 1) {
				const touchX = e.touches[0].clientX;
				const touchY = e.touches[0].clientY;
				const moveX = touchX - this.data.touchX;
				const moveY = touchY - this.data.touchY;
				if (touchMFirstTime) {
					isHorizontal = Math.abs(moveX) > Math.abs(moveY);
					touchMFirstTime = false;
					if (isHorizontal) {
						this.setData({
							isMovingLeft: moveX < 0
						});
					}
				} else {
					if (isHorizontal) {
						this.setData({
							moveX: (moveX < 0 && -moveX > this.data.buttonWidth) ? -this.data.buttonWidth - Math.pow(-this.data.buttonWidth - moveX, 2/3) : moveX
						});
					}
				}
				if (isHorizontal && this.data.isMovingLeft) {
					this.triggerEvent('canscroll', {
						canScroll: false
					}, {})
				} else {
					this.triggerEvent('canscroll', {
						canScroll: true
					}, {})
				}
			}
		},
		touchE() {
			touchMFirstTime = true;
			this.setData({
				isMovingLeft: false,
				moveX: this.data.moveX < 0 && -this.data.moveX > this.data.buttonWidth/3 ? -this.data.buttonWidth :
					this.data.moveX < 0 && -this.data.moveX <= this.data.buttonWidth/3 ? 0 :
					this.data.moveX
			});
			if (this.data.moveX < 0 && -this.data.moveX > this.data.buttonWidth/3) {
				this.triggerEvent('active', {
					index: this.properties.index
				}, {})
			}
		}
	}
})
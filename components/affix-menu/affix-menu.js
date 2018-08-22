// components/affix-menu/affix-menu.js
var basicNum = 35;
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        menusInfo: {
            value: [],
            type: Array,
        },
        screenRect: Object
    },

    /**
     * 组件的初始数据
     */
    data: {
        menus: [],
        mainAnimation: {},
        isSpread: false
    },

    attached() {
        this.setData({
            menus: this.properties.menusInfo.map((menu, index) => {
                menu.animation = this.createAnimation(index);
                return menu;
            })
        });
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onMove(e) {
            this.data.isSpread && this.animateMenu(true);
            const { clientX, clientY } = e.touches[0];
            this.setData({
                pos: {
                    top: clientY,
                    left: clientX < basicNum*2 ?  basicNum*2 : clientX > this.properties.screenRect.width - (basicNum*2 + 20) ? this.properties.screenRect.width - (basicNum*2 + 20) : clientX
                }
            });
        },
        onMenuClick(e) {
            this.animateMenu(true);
            wx.navigateTo({
                url: this.data.menus[e.target.dataset.key].url
            });
        },
        onMainMenuClick() {
            this.animateMenu(this.data.isSpread);
        },
        animateMenu(isSpread) {
            var mainAnimation = this.createMainAnimation(isSpread);
            mainAnimation.step();
            var menus = this.properties.menusInfo.map((menu, index) => {
                var animation = this.createAnimation(index, isSpread);
                animation.step();
                menu.animation = animation.export();
                return menu;
            });
            this.setData({
                mainAnimation,
                isSpread: !isSpread,
                menus
            });
        },
        createMainAnimation(isSpread) {
            return wx.createAnimation({
                duration: 200,
            }).rotateZ(isSpread ? 0 : 180);
        },
        createAnimation(num, isSpread) {
            if (isSpread) {
                return wx.createAnimation({
                    duration: 200,
                }).opacity(0).translate(0, 0);
            }
            var coordinate = [
                {
                    x: -basicNum*2,
                    y: 0
                },
                {
                    x: -basicNum,
                    y: -basicNum*Math.sqrt(3)
                },
                {
                    x: -basicNum,
                    y: basicNum*Math.sqrt(3)
                },
                {
                    x: basicNum*2,
                    y: 0
                },
                {
                    x: basicNum,
                    y: basicNum*Math.sqrt(3)
                },
                {
                    x: basicNum,
                    y: -basicNum*Math.sqrt(3)
                },
            ][num];
            return wx.createAnimation({
                duration: 200,
            }).opacity(1).translate(coordinate.x, coordinate.y);
        }
    }
})
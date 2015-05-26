/*
 * iDelay - 懒加载插件
 *
 * Create person: 张飞超
 *
 * Create Time: 2015-05-24 20:19
 *
 * Modify Time: 2015-05-26 16:08
 *
 * Version: 1.0.21
 *
 * 新版增加了移动端 动态加载元素后也进行懒加载 需要setEl("滚动的ID")  增加新图片之后调addImgEl()
 *
 */

; (function (win, doc) {
    "use strict";

    win.iDelay = function (Attrs) {
        this.hasTouch = 'ontouchstart' in window;

        this.settings = {
            el: win,
            imgEl: "iDelay",
            poll: null,
            pollTime: 250,
            //placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };
        // 循环绑定参数
        for (var a in Attrs) this.settings[a] = Attrs[a];
        this.init();
    };

    iDelay.prototype = {

        // 初始化
        init: function () {
            this.getImgEl();

            // img添加占位
            //this.imgFor(function (index) {
            //    this.imgEl.item(index).src = this.settings.placeholder;
            //});

            this.addEvent();
        },
        addEvent: function () {
            var that = this;
            console.log(that);
            that.settings.el.addEventListener("load", function () { that.handleComputerMobile(); }, false);
            that.settings.el.addEventListener("scroll", function () { that.handleComputerMobile(); }, false);
            that.settings.el.addEventListener("resize", function () { that.handleComputerMobile(); }, false);
        },

        // 获取所有img
        getImgEl: function () {
            console.log(this.settings.el);
            this.imgEl = doc.querySelectorAll("." + this.settings.imgEl);
        },

        // img循环处理
        imgFor: function (call) {
            for (var d = 0, dMax = this.imgEl.length; d < dMax; d++) {
                call(d);
            }
        },
        handleLoca: function () {
            var that = this;
            that.getImgEl();
            var client = that.getClient(),
                imgClient = null;
            //console.log(client.top + client.height)

            that.imgFor(function (index) {
                imgClient = that.getImgClient(that.imgEl.item(index));

                console.log(client, imgClient)
                if ((imgClient.top + imgClient.height) > client.top && (client.top + client.height) > imgClient.top) {

                    // 创建img对象
                    var img = new Image();
                    img.src = that.imgEl.item(index).getAttribute("data-src");
                    img.onload = function () {

                        // 当出现在可见区域则显示img
                        that.imgEl.item(index).src = img.src;
                    }
                }
            });
        },

        // 清除setTimeout
        clearSettingTimeout: function () {
            win.clearTimeout(this.settings.poll);
            this.settings.poll = null;
        },

        // 处理PC端和移动端差别
        handleComputerMobile: function () {
            var that = this;
            if (that.hasTouch) {
                if (that.settings.poll != null) {
                    that.clearSettingTimeout();
                }

                // 处理移动端scroll延迟250ms
                that.settings.poll = win.setTimeout(function () {
                    that.handleLoca();
                    that.clearSettingTimeout();
                }, that.settings.pollTime);
            } else {
                that.handleLoca();
            }
        },

        // 检索img所在位置
        //checkImgLoca : function () {
        //    this.imgFor(function (index) {
        //        console.log(this.getImgClient(this.imgEl.item(index)));
        //    });
        //},

        setEl: function (id) {
            this.settings.el = doc.getElementById(id);
            this.addEvent();
            this.getImgEl();
        },

        addImgEl: function () {
            this.getImgEl();
        },

        // 获取浏览器的可视区域位置
        getClient: function () {
            var el = this.settings.el != 0 ? this.settings.el : doc.documentElement;
            if (this.settings.el.length != 0) {
                return { top: this.settings.el.scrollTop, height: this.settings.el.clientHeight };
            } else {
                return { top: doc.documentElement.scrollTop || doc.body.scrollTop, height: doc.documentElement.clientHeight };
            }
        },

        // 获取待加载资源位置
        getImgClient: function (p) {
            return { top: p.offsetTop, height: p.offsetHeight };
        }
    };

    window.iDelay = iDelay;
})(window, document);

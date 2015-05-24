/*
 * iDelay - 懒加载插件
 *
 * Create person: 张飞超
 *
 * Modify Time: 2015-05-24 21:48
 *
 * Version: 1.0.0
 *
 */

; (function (win, doc) {
    "use strict";

    win.iDelay = function (Attrs) {
        var $d = this;

        $d.settings = {
            el: win,
            imgEl: "iDelay",
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        }

        // 循环绑定参数
        for (var a in Attrs) $d.settings[a] = Attrs[a];

        // 初始化
        $d.init = function () {

            $d.getImgEl();

            // img添加占位
            //$d.imgFor(function (index) {
            //    $d.imgEl.item(index).src = $d.settings.placeholder;
            //});

            $d.addEvent();
        };
        $d.addEvent = function () {
            win.addEventListener("load", $d.handleLoca, false);
            win.addEventListener("scroll", $d.handleLoca, false);
            win.addEventListener("resize", $d.handleLoca, false);
        }

        // 获取所有img
        $d.getImgEl = function () {
            $d.imgEl = doc.querySelectorAll("." + $d.settings.imgEl);
        };

        // img循环处理
        $d.imgFor = function (call) {
            for (var d = 0, dMax = $d.imgEl.length; d < dMax; d++) {
                call(d);
            }
        };
        $d.handleLoca = function () {
            $d.getImgEl();
            var client = $d.getClient(),
                imgClient = null;
            //console.log(client.top + client.height)

            $d.imgFor(function (index) {
                imgClient = $d.getImgClient($d.imgEl.item(index));

                // 检测是否出现在当前可见区域
                if ((imgClient.top + imgClient.height) > client.top && (client.top + client.height) > imgClient.top) {

                    // 创建img对象
                    $d.createImg(index, function (img) {

                        // 检测img是否加载完成
                        img.onload = function () {

                            // 当出现在可见区域则显示img
                            $d.imgEl.item(index).src = img.src;
                        }
                    });
                }
            });
        }

        // 根据src创建img
        $d.createImg = function (index, call) {
            var img = new Image();
            img.src = $d.imgEl.item(index).getAttribute("data-src");
            call(img);
        };

        // 检索img所在位置
        //$d.checkImgLoca = function () {
        //    $d.imgFor(function (index) {
        //        console.log($d.getImgClient($d.imgEl.item(index)));
        //    });
        //}

        // 返回浏览器的可视区域位置
        $d.getClient = function () {
            var t, h;
            t = doc.documentElement.scrollTop || doc.body.scrollTop;
            h = doc.documentElement.clientHeight;
            return { top: t, height: h };
        };

        // 返回待加载资源位置
        $d.getImgClient = function (p) {
            var t = 0, h;
            t = p.offsetTop;
            h = p.offsetHeight;
            return { top: t, height: h };
        }

        $d.init();
    };
})(window, document);

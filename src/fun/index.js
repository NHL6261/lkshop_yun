/**
 公共方法
 */
const R = require("ramda");
import { Toast } from "vant";

var fun = {
    //数组分级===================================
    //this.fun.chunk(json.data.category,8);
    chunk: function(arr, n) {
        var result = [];
        for (var i = 0, len = arr.length; i < len; i += n) {
            result.push(arr.slice(i, i + n));
        }
        return result;
    },
    //合并数组
    sunArr: function(name = [], params = []) {
        return R.concat(name)(params);
    },
    getCookie(cookie_name) {
        var allcookies = document.cookie;
        //索引长度，开始索引的位置
        var cookie_pos = allcookies.indexOf(cookie_name);

        // 如果找到了索引，就代表cookie存在,否则不存在
        if (cookie_pos != -1) {
            // 把cookie_pos放在值的开始，只要给值加1即可
            //计算取cookie值得开始索引，加的1为“=”
            cookie_pos = cookie_pos + cookie_name.length + 1;
            //计算取cookie值得结束索引
            var cookie_end = allcookies.indexOf(";", cookie_pos);

            if (cookie_end == -1) {
                cookie_end = allcookies.length;
            }
            //得到想要的cookie的值
            var value = unescape(allcookies.substring(cookie_pos, cookie_end));
        }
        return value;
    },
    //设置微信标题
    setWXTitle: function(title) {
        //debugger;
        document.title = title;
        var mobile = navigator.userAgent.toLowerCase();
        // !window.location.href.includes('/o2o/store') 防止门店页面滚动多次触发
        if (/iphone|ipad|ipod/.test(mobile) && !window.location.href.includes("/o2o/store")) {
            var iframe = document.createElement("iframe");
            iframe.style.display = "none";
            // 替换成站标favicon路径或者任意存在的较小的图片即可
            // iframe.setAttribute('src', '/favicon.ico')
            var iframeCallback = function() {
                setTimeout(function() {
                    iframe.removeEventListener("load", iframeCallback);
                    document.body.removeChild(iframe);
                }, 0);
            };
            iframe.addEventListener("load", iframeCallback);
            document.body.appendChild(iframe);
        }
    },
    //判断是否是空
    isTextEmpty: function(str) {
        if (str == null || str == "" || str == undefined) {
            return true;
        } else {
            return false;
        }
    },
    //判断手机还是微信
    isWeiXin: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    //判断是否云打包APP
    isApp: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf("yunzshop") > -1) {
            return true;
        } else {
            return false;
        }
    },
    //判断是否聚合CPS的APP
    isCPS: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.indexOf("yz_cps") > -1) {
            return true;
        } else {
            return false;
        }
    },
    //判断支付宝环境
    isAlipay: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/Alipay/i) == "alipay") {
            return true;
        } else {
            return false;
        }
    },
    getSiteRoot: function() {
        return document.location.protocol + "//" + window.location.host;
    },
    getKey: function(name) {
        let _i = decodeURIComponent((new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [, ""])[1].replace(/\+/g, "%20")) || null;
        if (name == "i") {
            return String(_i).replace(/[^0-9]/gi, ""); //过滤i非数字
        } else {
            return _i;
        }
    },

    getKeyByI: function() {
        let i = this.getKey("i");
        return i;
    },
    getKeyByMid: function() {
        let mid = 0;
        if (!this.getKey("mid")) {
            mid = window.localStorage.uid;
        } else {
            mid = this.getKey("mid");
        }
        return mid;
    },
    getKeyByMicroShopId: function() {
        let micro_shop_id = this.getKey("shop_id");
        return micro_shop_id;
    },
    getSession: function() {
        return this.getKey("session");
    },
    getToken: function() {
        return this.getKey("token");
    },
    getOpenid: function() {
        return this.getKey("openid");
    },
    getTyep: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (window.isMiniprogram || this.getToken()) {
            // 小程序
            return "2";
        }
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            // 微信浏览器
            return "1";
        } else if (this.isApp()) {
            return "7";
        } else if (this.isAlipay()) {
            return "8";
        } else {
            return "5";
        }
    },
    isPc() {
        if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
            return false;
        } else {
            return true;
        }
    },
    browserRedirect(url) {
        //只读的字符串，声明了浏览器用于 HTTP 请求的用户代理头的值
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        var all = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        if (!(bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || all)) {
            window.location.replace(url);
        }
    },
    //url增加默认传参
    getUrl: function(name, params, query) {
        query = R.mergeAll([
            query,
            {
                i: this.getKeyByI(),
                type: this.getTyep(),
                mid: this.getKeyByMid(),
                shop_id: this.getKeyByMicroShopId()
                    //token:this.getToken(),
                    //session:this.getSession(),
            }
        ]);
        return {
            name,
            params,
            query
        };
    },

    getRealUrl: function(url, params) {
        let i = this.getKeyByI();
        let mid = this.getKeyByMid();
        let type = this.getTyep();
        let shop_id = this.getKeyByMicroShopId();
        let baseUrl = "";
        if (mid) {
            baseUrl = "/addons/yun_shop/api.php?i=" + i + "&mid=" + mid + "&type=" + type + "&shop_id=" + shop_id + "&route=";
        } else {
            baseUrl = "/addons/yun_shop/api.php?i=" + i + "&type=" + type + "&shop_id=" + shop_id + "&route=";
        }

        if (params) {
            let paramsArray = [];
            Object.keys(params).forEach(key => paramsArray.push(key + "=" + params[key]));
            url += "&" + paramsArray.join("&");
            url = baseUrl + url;
        } else {
            url = baseUrl + url;
        }

        return url;
    },

    //获取地址信息
    getAddressInfo: function() {
        //saveAddresssInfo
        $http
            .get("member.member-address.address", {
                i: this.getKeyByI(),
                type: this.getTyep()
            })
            .then(
                function(response) {
                    if (response.result == 1) {
                        var province = JSON.stringify(response.data.province);
                        var city = JSON.stringify(response.data.city);
                        var district = JSON.stringify(response.data.district);
                        localStorage.setItem("province", province);
                        localStorage.setItem("city", city);
                        localStorage.setItem("district", district);
                    }
                },
                function(response) {
                    // error callback
                }
            );
    },

    //酒店插件自定义字段
    // getCustomizeHotelHead() {
    // 	$http
    // 	.get('plugin.hotel.frontend.hotel.get-hotel-info.get-custom-name', {}, "加载中...")
    // 	.then(response => {
    // 	  if (response.result == 1) {
    // 		localStorage.setItem("customizeHotelHead", JSON.stringify(response.data));
    // 	  }
    // 	})
    // 	.catch(error => {
    // 	  console.log(error);
    // 	});
    // },

    //如果为空
    isNonEmpty: function(value, errorMsg) {
        return value === "" ? errorMsg : void 0;
    },
    //最小长度
    minLength: function(value, length, errorMsg) {
        return value.length < length ? errorMsg : void 0;
    },
    //是否手机
    isMoblie: function(value) {
        //return !/^1(3|5|7|8|9)[0-9]{9}$/.test(value);
        // return !/^1\d{10}$/.test(value);

        return !/^[0-9]*$/.test(value);
    },
    //是否Email
    isEmail: function(value, errorMsg) {
        return !/^\w+([+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value) ? errorMsg : void 0;
    },
    //是否为URL链接
    isUrl: function(value) {
        return !/^((https|http):\/\/).+$/g.test(value);
    },

    //判断URL链接中是否有mid如果有
    isMid: function(url, val) {
        console.log("url=" + url);
        if (url.indexOf("mid=") >= 0) {
            return this.changeUrlArg(url, "mid", val);
        } else {
            let burl = this.delQueStr(url, "mid");
            console.log(burl, "burl");
            return this.changeUrlArg(burl, "mid", val);
        }
    },
    changeUrlArg: function(url, arg, val) {
        var pattern = arg + "=([^&]*)";
        var replaceText = arg + "=" + val;
        return url.match(pattern) ? url.replace(eval("/(" + arg + "=)([^&]*)/gi"), replaceText) : url.match("[?]") ? url + "&" + replaceText : url + "?" + replaceText;
    },
    delQueStr: function(url, ref) {
        //删除参数值

        var str = "";
        if (url.indexOf("#") != -1) {
            str = url.substr(url.indexOf("#") + 1);
            // console.log("urlTga", str);
        } else {
            return url;
        }

        var arr = "";
        var returnurl = "";
        if (str.indexOf("&") != -1) {
            arr = str.split("&");
            console.log("arr", arr);

            for (let i = 0; i < arr.length; i++) {
                if (arr[i].split("=")[0] != ref) {
                    returnurl = returnurl + arr[i].split("=")[0] + "=" + arr[i].split("=")[1] + "&";
                }
            }
            console.log("returnurl", returnurl);
            return url.substr(0, url.indexOf("?")) + "?menu=#" + returnurl.substr(0, returnurl.length - 1);
        } else {
            arr = str.split("=");
            if (arr[0] == ref) return url.substr(0, url.indexOf("?"));
            else return url;
        }
    },
    //判断是否在云打包的应用中
    isapp: function() {
        var YundabaoUA = navigator.userAgent; //获取当前的useragent
        if (YundabaoUA.indexOf("CK 2.0") > -1) {
            //判断当前的ua中是否包含"CK 2.0"，如果包含"CK 2.0"标识当前在云打包的应用中
            return true;
        } else {
            return false;
        }
    },
    //判断URL链接中是否有shop_id如果有
    isShopId: function(url, val) {
        console.log("url=" + url);
        // let arg = "shop_id";
        if (url.indexOf("shop_id=") >= 0) {
            console.log("shop_id=");
            return this.changeUrlArg(url, "shop_id", val);
        } else {
            let burl = this.delQueStr(url, "shop_id");
            console.log("eeeee3333eshop_id", burl);
            return this.changeUrlArg(burl, "shop_id", val);
        }
    },
    //获取时间戳
    getTimestamp(vales) {
        var timestamp = Date.parse(new Date(vales));

        return timestamp / 1000;
    },
    // 时间戳差值
    getTimeDifference(Timestamp) {
        var now = Date.parse(new Date());
        console.log("Timestamp", Timestamp);
        let time = Timestamp < 1000000000000 ? Timestamp * 1000 : Timestamp;
        console.log(time - now);
        if (time - now > 0) {
            console.log(1);
            return time - now;
        } else if (time - now <= 0) {
            console.log(2);
            return 0;
        }
    },

    //将时间戳转换成正常时间格式
    timestampToTime: function(timestamp) {
        let date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '.';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
        let D = date.getDate() + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return Y + M + D + h + m;
    },
    timeCountDown(times) {
        // 将时间戳转换成倒计时
        // time 属性表示倒计时总时长，单位为毫秒。
        let timestamp = new Date().getTime();
        if ((times >= 1000000000000 && times < timestamp) || (times < 1000000000 && times * 1000 < timestamp)) {
            return "已结束";
        }

        let time = times >= 1000000000000 ? (times - timestamp) / 1000 : (times * 1000 - timestamp) / 1000;
        console.log(time);
        let day = parseInt(time / 60 / 60 / 24);
        let hour = parseInt((time / 60 / 60) % 24);
        let minute = parseInt((time / 60) % 60);
        let seconds = parseInt(time % 60);
        return day + "天" + hour + "小时" + minute + "分钟" + seconds + "秒";
    },

    // 判断是否为金额
    isPriceNumber: function(obj) {
        var isNum = /^\d+(\.\d+)?$/;
        if (!isNum.test(obj)) {
            return false;
        } else {
            return true;
        }
    },

    initMailLanguage() {
        return JSON.parse(localStorage.getItem("mailLanguage"));
    },
    //自定义提现字段
    initWithdrawal() {
        let name_of_withdrawal = JSON.parse(localStorage.getItem("mailLanguage"));
        if (name_of_withdrawal) {
            return name_of_withdrawal.income.name_of_withdrawal;
        } else {
            return {};
        }
    },

    // 余额字样
    getBalanceLang() {
        let balanceLangList = JSON.parse(localStorage.getItem("balanceLang"));
        return balanceLangList.balance;
    },

    setMailLanguage(defaultStr, languageStr) {
        let language = this.isTextEmpty(languageStr) ? defaultStr : languageStr;
        return language;
    },
    getPrice() {
        //获取商品语言设置的现价（全部商品、搜索、品牌、分类列表搜索页）
        let MarketPrice = JSON.parse(localStorage.getItem("mailLanguage"));
        if (MarketPrice.goods && MarketPrice.goods.price) {
            return MarketPrice.goods.price;
        }
    },
    getMarketPrice() {
        //获取商品语言设置的原价（全部商品、搜索、品牌、分类列表搜索页）
        let MarketPrice = JSON.parse(localStorage.getItem("mailLanguage"));
        if (MarketPrice.goods && MarketPrice.goods.market_price) {
            return MarketPrice.goods.market_price != "" ? MarketPrice.goods.market_price : "原价";
        }
        return "原价";
    },

    funHrefFilters(url) {
        if (url == null || url == "" || url == undefined) {
            return "javascript:;";
        }
        let host = document.location.host;
        //let mid=decodeURIComponent((new RegExp('[?|&]' + "mid" + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        let mid = window.localStorage.getItem("uid");
        if (url.indexOf(host) >= 0) {
            return url + "&mid=" + mid;
        } else {
            return url;
        }
    },

    funHrefFilters1(url) {
        if (url == null || url == "" || url == undefined) {
            return "javascript:;";
        }
        let mid = window.localStorage.getItem("uid");

        return url + "&mid=" + mid;
    },
    //替换url中的值
    changeURLArg(url, arg, arg_val) {
        var pattern = arg + "=([^&]*)";
        var replaceText = arg + "=" + arg_val;
        if (url.match(pattern)) {
            var tmp = "/(" + arg + "=)([^&]*)/gi";
            tmp = url.replace(eval(tmp), replaceText);
            return tmp;
        } else {
            if (url.match("[?]")) {
                return url + "&" + replaceText;
            } else {
                return url + "?" + replaceText;
            }
        }
        // return url + "\n" + arg + "\n" + arg_val;
    },

    //判断当前web环境 5代表pc浏览器环境 2代表小程序环境 1代表微信公众号网页环境
    //判断是否是小程序----res.miniprogram为true代表在小程序里,false代表在公众号里
    getWebEnv() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            wx.miniProgram.getEnv(function(res) {
                if (res.miniprogram) {
                    return "2";
                } else {
                    return "1";
                }
            });
        } else {
            return "5";
        }
    },

    bd_decrypt(bd_lng, bd_lat) {
        var X_PI = (Math.PI * 3000.0) / 180.0;
        var x = bd_lng - 0.0065;
        var y = bd_lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        return { lng: gg_lng, lat: gg_lat };
    },

    //高德坐标转百度（传入经度、纬度）
    bd_encrypt(gg_lng, gg_lat) {
        var X_PI = (Math.PI * 3000.0) / 180.0;
        var x = gg_lng,
            y = gg_lat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
        var bd_lng = z * Math.cos(theta) + 0.0065;
        var bd_lat = z * Math.sin(theta) + 0.006;
        return {
            lat: bd_lat,
            lng: bd_lng
        };
    },

    gotoMiniAppCs() {
        var params = "";
        var path = "/pages/cs/index" + params;
        //alert(path);
        //通过JSSDK的api使小程序跳转到指定的小程序页面
        wx.miniProgram.navigateTo({ url: path });
    },

    //判断微信下ios和安卓 ios为1 安卓为2 其他3
    getPhoneEnv() {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || this.isApp(); //ios终端或者云打包
        let isIpad = u.indexOf("Intel Mac OS") > -1 && u.indexOf("Chrome") === -1 && u.indexOf("Safari") === -1 && u.indexOf("Firefox") === -1;
        if (isAndroid) {
            return "2";
        } else if (isIOS || isIpad) {
            return "1";
        } else {
            return "3";
        }
    },
    //判断微信版本是否大于6.7.2，兼容js-dk1.40和1.3.2
    getWechatVersion() {
        if (this.isWeiXin()) {
            var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
            var wechatVersion = wechatInfo[1];
            var version_arr = wechatVersion.split(".");
            if (Number(version_arr[0] > 6)) {
                return true;
            } else if (Number(version_arr[0] == 6)) {
                if (Number(version_arr[1]) > 7) {
                    return true;
                } else if (version_arr[1] == 7) {
                    if (Number(version_arr[2]) >= 2) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    // 判断ios还是android
    isIosOrAndroid() {
        let u = navigator.userAgent;
        let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // android终端
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
        let isStr = "";
        if (isAndroid) {
            isStr = "android";
        }
        if (isiOS) {
            isStr = "ios";
        }
        return isStr;
    },
    isIphoneX() {
        if (/iphone/gi.test(window.navigator.userAgent)) {
            /* iPhone X、iPhone XS */
            var x = window.screen.width === 375 && window.screen.height === 812;
            /* iPhone XS Max */
            var xsMax = window.screen.width === 414 && window.screen.height === 896;
            /* iPhone XR */
            var xR = window.screen.width === 414 && window.screen.height === 896;
            if (x || xsMax || xR) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    isIphone() {
        if (/iphone/gi.test(window.navigator.userAgent)) {
            return true;
        } else {
            return false;
        }
    },
    //键盘顶起页面后隐藏不回弹解决方案
    clearSrcoll() {
        var currentPosition, timer;
        var speed = 1; //页面滚动距离
        timer = setInterval(function() {
            currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
            currentPosition -= speed;
            window.scrollTo(0, currentPosition); //页面向上滚动
            currentPosition += speed; //speed变量
            window.scrollTo(0, currentPosition); //页面向下滚动
            clearInterval(timer);
        }, 1);
    },
    getRouter() {
        //获取网址的路由
        return window.location.href.match(/\#\/(\S*)\?/)[1];
        // return window.location.href.match(/(?<=\#\/).*(?=\?)/)[0]
    },
    /**
     *
     * @param {string} url 分享的Url。为空会根据环境换取当前页面地址
     * @param {object} data 请求的数据
     * @param {object} shareConfig 微信分享配置信息 title description imgUrl type? dataUrl? link?
     * @param {function} shareFun 微信分享获取配置信息后回调方法
     * @param {function} callback 微信分享成功后回调方法
     * @return {object} response 后端数据
     */
    wxShare(url = "", data = {}, shareConfig = {}, shareFun = null, callback = null) {
        if (this.getTyep() == 5) {
            return '';
        }
        if (!url) {
            url = this.isIosOrAndroid() === "ios" ? window.initUrl : document.location.href;
        }
        const requestData = { url, ...data };

        return new Promise((resolve, reject) => {
            if (window.yz_share_data) {
                if (window.yz_share_data.config && window.yz_share_data.config.appId) {
                    try {
                        if (shareFun) {
                            shareFun(window.yz_share_data);
                        }
                        this.dealShare(shareConfig, window.yz_share_data, callback);
                        resolve(window.yz_share_data);
                    } catch (e) {
                        reject(e);
                    }
                }
            } else {
                $http.post("member.member.wxJsSdkConfig", requestData).then(
                    response => {
                        if (response.result === 1) {
                            if (response.data.config && response.data.config.appId) {
                                if (shareFun) {
                                    shareFun(response.data);
                                }
                                window.yz_share_data = response.data;
                                // console.log("wx share - ",shareConfig, requestData);
                                this.dealShare(shareConfig, response.data, callback);
                                resolve(response.data);
                            }
                        } else {
                            reject(response.msg);
                        }
                    },
                    error => {
                        reject(error);
                    }
                );
            }

        });
    },
    /**
     *
     * @param {object} shareConfig 微信分享配置信息 title description imgUrl type? dataUrl? link?
     * @param {object} data 微信配置接口返回的数据
     * @param {function} callback 微信分享成功后回调方法
     */
    dealShare(shareConfig, data, callback = null) {
        let _link = document.location.href + "&share_tag=2";
        _link = this.isMid(_link, data.info.uid);
        // console.log("wx share - ", _link);
        wx.config(data.config);
        wx.ready(() => {
            wx.showOptionMenu();
            wx.onMenuShareTimeline({
                title: shareConfig.title, // 分享标题
                link: _link, // 分享链接
                imgUrl: shareConfig.imgUrl, // 分享图标
                success: function() {
                    Toast("分享成功");
                    if (callback) {
                        callback();
                    }
                },
                cancel: function() {
                    Toast("取消分享");
                }
            });

            wx.onMenuShareAppMessage({
                title: shareConfig.title, // 分享标题
                desc: shareConfig.description ? shareConfig.description : data.shop.shop.name, // 分享描述
                link: _link, // 分享链接
                imgUrl: shareConfig.imgUrl, // 分享图标
                type: shareConfig.type ? shareConfig.type : "link", // 分享类型,music、video或link，不填默认为link
                dataUrl: ["music", "video"].includes(shareConfig.type) ? shareConfig.dataUrl : "", // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    Toast("分享成功");
                    if (callback) {
                        callback();
                    }
                },
                cancel: function() {
                    Toast("取消分享");
                }
            });
        });
    }
};
export default fun;
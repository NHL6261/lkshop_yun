// import { mapState } from 'vuex';
import cTitle from "components/title";
import cMent from "components/o2oment";
import cStoreList from "components/storeList";
import banner from "components/temp/banner";
import showbanner from "components/temp/banner";
import showmenu from "components/temp/menu";
import showtitle from "components/temp/title";
import showsearch from "components/temp/search";
import showline from "components/temp/line";
import showblank from "components/temp/blank";
import showrichtext from "components/temp/richtext";
import showpicture from "components/temp/picture";
import showcube from "components/temp/cube";
import showarea from "components/temp/area";
import showshop from "components/temp/shop";
import showgoods from "components/temp/goods";
import shownotice from "components/temp/notice";

import cMyswipe from "components/myswipe";
import { Swipe, SwipeItem } from "components/meswipe";
import { Toast } from "vant";
// import BScroll from 'better-scroll';
var items = [{
    id: "M1491471961972",
    temp: "showsearch",
    params: {
        placeholder: "",
        style: "style2",
        color: "#000",
        bgcolor: "#FFF",
        bordercolor: "#fa1f24",
        searchurl: "",
        uniacid: "6"
    },
    data: "",
    other: "",
    content: ""
}];

export default {
    data() {
        return {
            position_switch: "",
            amout: false,
            index2: 1,
            category: [],
            goodsListData: [],
            ads: [],
            banner: banner,
            bannername: "banner",
            bannerData: [],
            other: "",
            content: "",
            show: true,
            tempData: items,
            oftemp: false,
            dftempData: false,
            follow_mode: {},
            isfollow: false,
            pageinfo: "",
            status: false,
            sixCity: [],
            hotCity: [],
            citys: [],
            address: "",
            city: "",
            point: ""
        };
    },
    //computed: mapState(['mailInfo']),

    mounted() {
        window.addEventListener("scroll", this.slider);
    },
    created() {
        this.status = this.$route.query.tag == "activity";
        this.ready();
    },
    computed: {
        shortcutList() {
            return this.citys.map(group => {
                return group.title.substr(0, 1);
            });
        }
    },
    activated() {
        this.status = this.$route.query.tag == "activity";
        if (this.status) {
            this.$route.meta.foot = true;
            this.$emit("changeFoot", this.$route.meta.foot);
        }
        this.ready();
        this.guideFollow();
        this.getSixCityList();
        this.getCityList();
        this.fun.setWXTitle(this.$store.state.temp.item.janst);
    },
    methods: {
        ready() {
            let myLocation = this.$store.state.o2oLocation;

            if (myLocation.point) {
                this.address = myLocation.title;
                this.city = myLocation.city;
                this.point = myLocation.point;
                //this.$store.commit('updateLocation', myLocation);
                //this.$store.commit('setLocation', myLocation);
                //初始化数据

                // this.getStores();
            } else {
                console.log("location不存在");
                this.getLocation();
            }
        },
        getLocation() {
            var that = this;
            var mapObj = new AMap.Map("iCenter");
            mapObj.plugin("AMap.Geolocation", function() {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, // 是否使用高精度定位，默认:true
                    timeout: 10000, // 超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, // 定位结果缓存0毫秒，默认：0
                    convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true, // 显示定位按钮，默认：true
                    buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                mapObj.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, "complete", onComplete); // 返回定位信息
                AMap.event.addListener(geolocation, "error", onError); // 返回定位出错信息
            });

            function onComplete(obj) {
                // var res =
                //   '经纬度：' +
                //   obj.position +
                //   '\n精度范围：' +
                //   obj.accuracy +
                //   '米\n定位结果的来源：' +
                //   obj.location_type +
                //   '\n状态信息：' +
                //   obj.info +
                //   '\n地址：' +
                //   obj.formattedAddress +
                //   '\n地址信息：' +
                //   JSON.stringify(obj.addressComponent, null, 4);
                //alert(res);
                //alert(JSON.stringify(obj.addressComponent, null, 4));
                var position = obj.position.toString().split(",");
                that.point = {
                    lat: position[1],
                    lng: position[0]
                };
                that.address = obj.formattedAddress;
                that.title = obj.formattedAddress;
                that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ?
                    obj.addressComponent.city :
                    obj.addressComponent.province;

                var pos = {
                    address: obj.formattedAddress,
                    city: that.city,
                    title: obj.formattedAddress,
                    point: that.point
                };
                console.log("test pos", pos);
                that.$store.commit("updateLocation", pos);
                that.$store.commit("setLocation", pos);
                window.localStorage.setItem("myLocation", JSON.stringify(pos));

                // that.getStores();
            }

            function onError(obj) {
                console.log(obj);
            }
        },
        getSixCityList() {
            let api;
            if (this.$route.query.tag == "hotel") {
                api = "plugin.hotel.frontend.hotel.hotel.get-hot-citys";
            } else if (this.$route.query.tag == "oil") {
                api = "plugin.easy-refuel.frontend.index.getHotCitys";
            } else if (this.$route.query.tag == "activity") {
                api = "plugin.activity-apply.api.index.getHotCitys";
            } else {
                api = "plugin.store-cashier.frontend.store.store.getHotCitys";
            }
            $http.get(api).then(
                response => {
                    if (response.result === 1) {
                        this.sixCity = response.data.citys;
                        if (response.data.position_switch) {
                            this.position_switch = response.data.position_switch;
                        }
                    } else {
                        console.log(response.msg);
                    }
                },
                response => {
                    //alert('网络错误，请稍后再试！')
                }
            );
        },
        getCityList() {
            let api;
            if (this.$route.query.tag == "hotel") {
                api = "plugin.hotel.frontend.hotel.hotel.get-city-initials";
            } else if (this.$route.query.tag == "oil") {
                api = "plugin.easy-refuel.frontend.index.getCitys";
            } else if (this.$route.query.tag == "activity") {
                api = "plugin.activity-apply.api.index.getCityInitials";
            } else {
                api = "plugin.store-cashier.frontend.store.store.getCityInitials";
            }
            $http.get(api).then(
                response => {
                    if (response.result === 1) {
                        this.citys = response.data.initials;
                    } else {
                        console.log(response.msg);
                    }
                },
                response => {
                    //alert('网络错误，请稍后再试！')
                }
            );
        },
        Jump(event, index) {
            let text = event.currentTarget.innerHTML;
            Toast(text);
            let jump = document.querySelectorAll(".d_jump");

            if (typeof jump[index] === "undefined") {
                return;
            }

            // 获取需要滚动的距离
            let total = jump[index].offsetTop;
            // Chrome
            document.body.scrollTop = total;
            // Firefox
            document.documentElement.scrollTop = total;
            // Safari
            window.pageYOffset = total;
        },
        toHot() {
            let text = event.currentTarget.innerHTML;
            Toast(text);
            let jump = document.querySelectorAll(".hot-location");

            // 获取需要滚动的距离
            let total = jump.offsetTop;
            // Chrome
            document.body.scrollTop = total;
            // Firefox
            document.documentElement.scrollTop = total;
            // Safari
            window.pageYOffset = total;
        },
        setCity(areaname) {
            if (!areaname) {
                let point = {
                    lat: "",
                    lng: ""
                };
                let pos = {
                    address: "",
                    city: "",
                    title: "",
                    point: point
                };
                this.$store.commit("updateLocation", pos);
                this.$store.commit("setLocation", pos);
                console.log(this.$store.state.o2oLocation, this.$store.state.referer);
                if (this.$store.state.referer) {
                    window.location.href = this.$store.state.referer;
                } else {
                    this.$router.push(this.fun.getUrl("o2oHome", { fromHome: 1 }));
                }
            } else if (this.$route.query.tag == "hotel") {
                this.city = areaname;
                this.$router.push(
                    this.fun.getUrl("o2oCity", {}, { tag: "hotel", city: areaname })
                );
            } else if (this.$route.query.tag == "appointment") {
                this.$router.push(
                    this.fun.getUrl("o2oCity", {}, { tag: "appointment", city: areaname })
                );
            } else if (this.$route.query.tag == "oil") {
                this.$router.push(
                    this.fun.getUrl("o2oCity", {}, { tag: "oil", city: areaname })
                );
            } else if (this.$route.query.tag == "activity") {
                this.$router.push(
                    this.fun.getUrl("o2oCity", {}, { tag: "activity", city: areaname })
                );
            } else {
                this.city = areaname;
                this.$router.push(this.fun.getUrl("o2oCity", {}, { city: areaname }));
            }
        },
        toGeolocation() {
            if (this.$route.query.tag == "hotel") {
                this.$router.push(this.fun.getUrl("o2oLocation_loc", {}, { tag: "hotel" }));
            } else if (this.$route.query.tag == "appointment") {
                this.$router.push(this.fun.getUrl("o2oLocation_loc", {}, { tag: "appointment" }));
            } else if (this.$route.query.tag == "oil") {
                this.$router.push(this.fun.getUrl("o2oLocation_loc", {}, { tag: "oil" }));
            } else if (this.$route.query.tag == "activity") {
                this.$router.push(this.fun.getUrl("o2oLocation_loc", {}, { tag: "activity" }));
            } else {
                this.$router.push(this.fun.getUrl("o2oLocation_loc"));
            }
        },
        goback() {
            this.$router.go(-1);
        },
        //关注方法
        guideFollow() {
            $http.get("member.member.guideFollow").then(response => {
                    if (response.result == 1) {
                        this.isfollow = true;
                        this.follow_mode = response.data;
                    } else {
                        this.follow_mode = false;
                        console.log(response.msg);
                    }
                },
                response => {
                    //alert('网络错误，请稍后再试！')
                });
        },

        tosearch() {
            if (this.$route.query.tag == "hotel") {
                this.$router.push(
                    this.fun.getUrl("o2oLocation_loc", { fromHome: 1 }, { tag: "hotel" })
                );
            } else if (this.$route.query.tag == "appointment") {
                this.$router.push(
                    this.fun.getUrl(
                        "o2oLocation_loc", { fromHome: 1 }, { tag: "appointment" }
                    )
                );
            } else if (this.$route.query.tag == "activity") {
                this.$router.push(
                    this.fun.getUrl("o2oLocation_loc", { fromHome: 1 }, { tag: "activity" }));
            } else if (this.$route.query.tag == "oil") {
                this.$router.push(
                    this.fun.getUrl("o2oLocation_loc", { fromHome: 1 }, { tag: "oil" })
                );
            } else {
                this.$router.push(this.fun.getUrl("o2oLocation_loc", { fromHome: 1 }));
            }
        },
        slider() {
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            if (top < 50) {
                this.amout = false;
            } else {
                this.amout = true;
            }
        },

        // //获取商城信息
        getMailInfo() {
            let that = this;

            $http.get("setting.get").then(
                function(response) {
                    console.log(response);
                    if (response.result == 1) {
                        that.fun.setWXTitle(response.data.name);
                    }
                },
                function(response) {
                    // error callback
                }
            );
        },
        //获取地址信息
        getAddressInfo() {
            var that = this;
            if (
                this.$store.state.city.length == 0 ||
                this.$store.state.province.length == 0 ||
                this.$store.state.district.length == 0
            ) {
                //saveAddresssInfo

                $http.get("member.member-address.address").then(
                    function(response) {
                        if (response.result == 1) {
                            //console.log(JSON.stringify(response.data.city));
                            that.$store.commit("saveAddresssInfo", {
                                city: response.data.city,
                                province: response.data.province,
                                district: response.data.district
                            });
                        }
                    },
                    function(response) {
                        // error callback
                    }
                );
            }
        },

        //banner点击
        bannerClick(item) {
            if (!this.fun.isTextEmpty(item.link)) {
                window.location.href = item.link; //跳转
            }
        }
    },

    components: {
        cTitle,
        cMent,
        cStoreList,
        banner,
        showbanner,
        showmenu,
        showtitle,
        showsearch,
        showline,
        showblank,
        showrichtext,
        showpicture,
        showcube,
        showarea,
        showshop,
        showgoods,
        shownotice,
        cMyswipe,
        Swipe,
        SwipeItem
    },

    compiled() {
        this.datate();
    }
};
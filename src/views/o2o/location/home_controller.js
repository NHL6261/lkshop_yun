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
            point: "",
            regionInfo: {}
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
                //???????????????
                // this.getStores();
                const uid = JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
                const formData = {
                    uid,
                    addcode: myLocation.adcode,
                    citycode: myLocation.citycode,
                    longitude: myLocation.lng,
                    latitude: myLocation.lat
                }
                this.getRegionInfo(formData)
            } else {
                console.log("location?????????");
                this.getLocation();
            }
        },





        getLocation() {
            var that = this;
            var mapObj = new AMap.Map("iCenter");
            mapObj.plugin("AMap.Geolocation", function() {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, // ????????????????????????????????????:true
                    timeout: 10000, // ??????10???????????????????????????????????????
                    maximumAge: 0, // ??????????????????0??????????????????0
                    convert: true, // ??????????????????????????????????????????????????????????????????true
                    showButton: true, // ??????????????????????????????true
                    buttonPosition: "LB", // ????????????????????????????????????'LB'????????????
                    buttonOffset: new AMap.Pixel(10, 20), // ????????????????????????????????????????????????????????????Pixel(10, 20)
                    showMarker: true, // ???????????????????????????????????????????????????????????????true
                    showCircle: true, // ????????????????????????????????????????????????????????????true
                    panToLocation: true, // ?????????????????????????????????????????????????????????????????????true
                    zoomToAccuracy: true // ????????????????????????????????????????????????????????????????????????????????????????????????false
                });
                mapObj.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, "complete", onComplete); // ??????????????????
                AMap.event.addListener(geolocation, "error", onError); // ????????????????????????
            });

            // function onComplete(obj) {
            //     // var res =
            //     //   '????????????' +
            //     //   obj.position +
            //     //   '\n???????????????' +
            //     //   obj.accuracy +
            //     //   '???\n????????????????????????' +
            //     //   obj.location_type +
            //     //   '\n???????????????' +
            //     //   obj.info +
            //     //   '\n?????????' +
            //     //   obj.formattedAddress +
            //     //   '\n???????????????' +
            //     //   JSON.stringify(obj.addressComponent, null, 4);
            //     //alert(res);
            //     //alert(JSON.stringify(obj.addressComponent, null, 4));
            //     var position = obj.position.toString().split(",");
            //     that.point = {
            //         lat: position[1],
            //         lng: position[0]
            //     };
            //     that.address = obj.formattedAddress;
            //     that.title = obj.formattedAddress;
            //     that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ?
            //         obj.addressComponent.city :
            //         obj.addressComponent.province;

            //     var pos = {
            //         address: obj.formattedAddress,
            //         city: that.city,
            //         title: obj.formattedAddress,
            //         point: that.point
            //     };
            //     console.log("test pos", pos);
            //     that.$store.commit("updateLocation", pos);
            //     that.$store.commit("setLocation", pos);
            //     window.localStorage.setItem("myLocation", JSON.stringify(pos));

            //     // that.getStores();
            // }

            function onComplete(obj) {
                var res =
                    '????????????' +
                    obj.position +
                    '\n???????????????' +
                    obj.accuracy +
                    '???\n????????????????????????' +
                    obj.location_type +
                    '\n???????????????' +
                    obj.info +
                    '\n?????????' +
                    obj.formattedAddress +
                    '\n???????????????' +
                    JSON.stringify(obj.addressComponent, null, 4)
                    //alert(res);
                    //alert(JSON.stringify(obj.addressComponent, null, 4));
                var position = obj.position.toString().split(',')
                that.point = {
                    lat: position[1],
                    lng: position[0]
                }
                that.address = obj.formattedAddress
                that.title = obj.formattedAddress
                that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ?
                    obj.addressComponent.city :
                    obj.addressComponent.province

                var pos = {
                    address: obj.formattedAddress,
                    city: that.city,
                    title: obj.formattedAddress,
                    point: that.point
                }
                console.log(obj)
                console.log('test pos', pos)
                that.$store.commit('updateLocation', pos)
                that.$store.commit('setLocation', pos)
                window.localStorage.setItem('myLocation', JSON.stringify(pos))

                // ????????????????????????
                const uid = JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
                const formData = {
                    uid,
                    addcode: obj.addressComponent.adcode,
                    citycode: obj.addressComponent.citycode,
                    longitude: obj.position.lng,
                    latitude: obj.position.lat
                }
                that.getRegionInfo(formData)

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
                    //alert('?????????????????????????????????')
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
                    //alert('?????????????????????????????????')
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
            // ???????????????????????????
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

            // ???????????????????????????
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
        //????????????
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
                    //alert('?????????????????????????????????')
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

        // //??????????????????
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
        //??????????????????
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

        //banner??????
        bannerClick(item) {
            if (!this.fun.isTextEmpty(item.link)) {
                window.location.href = item.link; //??????
            }
        },
        // ????????????????????????
        getRegionInfo(data) {
            const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/getregion'
            axios({
                url,
                method: 'POST',
                data
            }).then(res => {
                // console.log('??????AAA', res.data.data)
                this.regionInfo = res.data.data
            }).catch(error => {
                console.log(error)
            })
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
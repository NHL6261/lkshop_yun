//window.localStorage.isWeiXin
import { Toast } from 'vant';
import cTitle from "components/title";
export default {
    //name: 'login',
    data() {
        return {
            login_checked: false,
            ys_short_url_redirect_url: '',
            ys_short_url_redirect_tel: '',
            eye_open: false,
            eye_close: true,
            type: "password",
            form: {
                mobile: "",
                mobileErr: "",
                password: "",
                passwordErr: "",
                uuid: 0,
                mid: 0,
                code: "",
                captcha: ""
            },
            mydata: "",
            isApp: false,
            apptoken: "",
            wetach_login: false,
            appShow: true,
            start1: false,
            mobile_login_code: 0,
            imgcode: "",
            wechat_qrcode_config: {
                callback: "",
                is_open: "",
                is_wechat_login: "",
            },
            login_type: 1,
            appid: "",
            redirect_uri: "",
            scope: "",
            state: "",
            login_obj: {},
            loading: false,
            // loading: false,
            is_enable: 0,
            enable_btn: false,
            btnText: '获取短信验证码',
            btnTag: false,
            timer: null,
            count: '',
            toastLogin: null,
            visible: true,
            passwordOrText: 'password'
        };
    },
    components: {
        cTitle
    },
    mounted() {
        this.start1 = false;

        this.ys_short_url_redirect_url = this.fun.getCookie('ys_short_url_redirect_url');
        this.ys_short_url_redirect_tel = this.fun.getCookie('ys_short_url_redirect_tel');
        if (this.ys_short_url_redirect_tel) {
            this.form.mobile = this.ys_short_url_redirect_tel;
            this.mobile_login_code = 1;
            this.loading = true;
        } else {
            this.getLoginMode();
        }
    },
    methods: {
        tapChange() {
            if (this.is_enable == 0) {
                this.is_enable = 1;
            } else {
                this.is_enable = 0;
            }
        },
        getLoginMode() {
            var that = this;
            let _json = {
                basic_info: 1
            };
            //没登录是没有返回basic_info信息的，会导致报错；任务编号: 41368

            $http.get("member.login.login-mode", _json).then(response => {
                // console.log(response);
                if (response.result === 1) {

                    this.loading = true;
                    this.mobile_login_code = response.data.mobile_login_code;
                    if (response.data.sms && response.data.sms.captcha.status == "1") {
                        this.imgcode = response.data.sms.captcha.img;
                    }
                    // PC端扫码登录
                    if (that.fun.isPc()) {
                        console.log(response.data.wechat_qrcode_config);
                        that.wechat_qrcode_config = response.data.wechat_qrcode_config || {};
                        if (that.wechat_qrcode_config.is_open) {
                            console.log('开启PC端微信扫码登录');
                            let yz_redirect = sessionStorage.getItem("yz_redirect");
                            that.login({ is_pc_qrcode: 1, yz_redirect: yz_redirect });
                            that.login_type = 2;
                        }
                    }
                    if (response.basic_info.plugin_setting) {
                        if (response.basic_info.plugin_setting.account_login) {
                            this.is_enable = response.basic_info.plugin_setting.account_login.enable;
                            this.enable_btn = response.basic_info.plugin_setting.account_login.enable;
                        }
                    }
                } else {
                    this.loading = true;
                    Toast(response.msg);
                }
            });
        },
        login(data) {
            let that = this;
            let url;
            let datainfo;
            console.log(data);
            if (this.is_enable == 0) {
                url = "member.login.index";
                datainfo = data;
            } else {
                url = "plugin.account-login.frotend.member.login";
                console.log(data);
                datainfo = {
                    account: data.mobile,
                    mobileErr: data.mobileErr,
                    password: data.password,
                    passwordErr: data.passwordErr,
                    uuid: data.uuid,
                    mid: data.mid,
                    code: data.code,
                    captcha: data.captcha
                };
            }
            $http.post(url, datainfo, "").then(response => {
                // console.log(response);
                if (response.result === 1) {
                    localStorage.setItem("siteMobile", this.form.mobile);
                    console.info("--会员信息--");
                    console.info(response.msg);
                    window.localStorage.getItem('uid', response.msg.uid)
                    that.$store.commit("setLoginStatus", response.data.status);
                    window.localStorage.setItem("isWxLogin", 0);
                    if (that.fun.isApp()) {
                        if (response.msg.uid) {
                            YDB.SetUserRelationForPush(response.msg.uid);
                        } else {
                            YDB.SetUserRelationForPush(response.msg.member_id);
                        }
                    }
                    if (this.ys_short_url_redirect_url) {
                        window.location.href = that.ys_short_url_redirect_url + '&from=mobile';
                        return;
                    }

                    if (response.data.url) {
                        window.location.href = response.data.url;
                    } else {
                        that.$router.push(this.fun.getUrl("home"));
                    }
                } else {
                    if (that.fun.isPc() && response.data.status == 9) {
                        let url = response.msg.url;
                        if (url) {
                            that.appid = that.getParam('appid', url);
                            that.redirect_uri = that.getParam('redirect_uri', url);
                            that.scope = that.getParam('scope', url);
                            that.state = that.getParam('state', url);
                        }
                        this.login_obj = new WxLogin({
                            // self_redirect:true,
                            id: "login_code",
                            appid: that.appid,
                            // scope: "snsapi_login",
                            scope: that.scope,
                            redirect_uri: encodeURIComponent(that.redirect_uri),
                            // redirect_uri:encodeURI(that.redirect_uri),
                            state: that.state,
                            // style: "",
                            // href: ""
                        });
                    } else {
                        that.$dialog.alert({ message: response.msg });
                    }
                }
            });
        },
        //获取图片验证码
        getimgdata() {
            $http
                .get("home-page.getCaptcha")
                .then(res => {
                    if (res.data.captcha) {
                        this.imgcode = res.data.captcha.img;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        mobile_login() {
            if (this.fun.isApp() && !this.login_checked) {
                Toast("请先勾选登录即代表您同意《用户协议》和《隐私政策》！");
                return;
            }

            if (this.fun.isTextEmpty(this.form.mobile)) {
                Toast("请填写手机号");
                return;
            }

            if (this.mobile_login_code != 1) {
                if (this.fun.isTextEmpty(this.form.password)) {
                    Toast("请填写密码");
                    return;
                }
                delete this.form.code;
            }

            this.form.uuid = 0;

            this.form.mid =
                this.fun.isTextEmpty(window.localStorage.getItem("mid")) == null ?
                0 :
                window.localStorage.getItem("mid");

            this.form.is_sms = this.mobile_login_code;
            if (this.mobile_login_code != 1) {
                delete this.form.code;
            }
            let yz_redirect = sessionStorage.getItem("yz_redirect");
            if (!this.fun.isTextEmpty(yz_redirect)) {
                this.form.yz_redirect = yz_redirect;
            }
            console.log(this.form);
            this.login(this.form);
        },
        //发送验证码
        verificationCode() {
            let that = this;
            if (this.fun.isTextEmpty(this.form.mobile)) {
                Toast("请填写手机号");
                return;
            }

            if (this.fun.isMoblie(this.form.mobile)) {
                Toast("请填写正确的手机号");
                return;
            }
            if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
                Toast("请先填图形验证码");
                return;
            }

            this.toastLogin = Toast({
                duration: -1, // 持续展示 toast
                message: '发送中...'
            });
            //发送获取验证码的请求
            $http
                .get("member.register.alySendCode", {
                    mobile: this.form.mobile,
                    captcha: this.form.captcha,
                    sms_type: 3
                })
                .then(
                    response => {
                        this.toastLogin.clear();
                        if (response.result === 1) {
                            that.sendCodeAnimation();
                        } else {
                            //刷新图形验证码
                            Toast(response.msg);
                            this.form.captcha = "";
                            this.getimgdata();
                        }
                    },
                    response => {
                        console.log(response.msg);
                    }
                );
        },
        //发送验证码 倒计时
        sendCodeAnimation() {
            const TIME_COUNT = 60;
            if (!this.timer) {
                this.count = TIME_COUNT;
                Toast.success('验证码已发送');
                this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                        this.count--;
                        this.btnText = this.count + "s后重新获取";
                        this.btnTag = true;
                    } else {
                        this.btnTag = false;
                        this.btnText = "获取短信验证码";
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                }, 1000);
            }
        },


        register() {
            $http
                .get("member.register.chk-register")
                .then(res => {
                    if (res.result === 1 && res.data.state == 0) {
                        console.log(this.is_enable, '上级的点击');
                        this.$router.push(this.fun.getUrl("register", { enable: this.is_enable }));
                    }
                    if (res.result === 0 && res.data.state == 1) {
                        Toast(res.data.reason);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        weixin() {
            var that = this;
            var i = that.fun.getKeyByI();
            var mid = that.fun.getKeyByMid();
            var type = that.fun.getTyep();
            window.localStorage.setItem("isWxLogin", 0);
            var accessUrl =
                that.fun.getSiteRoot() +
                "/addons/yun_shop/api.php?i=" +
                i +
                "&mid=" +
                mid +
                "&type=" +
                type +
                "&route=member.login.index&uuid=" +
                YDB_UUID;
            YDB.WXLogin(0, accessUrl);
        },
        init_login() {
            var that = this;
            if (!that.fun.isApp()) {
                return;
            }
            if (!YDB_isWXApp) {
                return;
            }
            if (that.apptoken) {
                that.login({
                    apptoken: this.apptoken
                });
            } else {
                $http
                    .get("member.login.index", {
                        show_wechat_login: true
                    })
                    .then(response => {
                        console.log(response);
                        if (response.result == 1) {
                            that.wetach_login = parseInt(response.data.wetach_login);
                        }
                    });
            }
        },
        //跳转修改密码
        gotoPwd() {
            this.$router.push(this.fun.getUrl("findpwd"));
        },

        isAppLogin() {
            $http
                .post("member.login.phoneSetGet", {})
                .then(response => {
                    // console.log(response);
                    if (response.result == 1) {
                        // if(response.data.phone_oauth == '1'){
                        // 	this.appShow=true;
                        // }else if(response.data.phone_oauth == '0' ){
                        // 	this.appShow=false;
                        // }else{
                        // 	return;
                        // }
                        this.appShow = parseInt(response.data.phone_oauth);
                    } else {
                        return;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        //点击切换password显示
        isShowpsd() {
            this.eye_open = this.eye_open == false ? true : false;
            this.eye_close = this.eye_close == true ? false : true;
            this.type = this.type == "password" ? "text" : "password";
        },
        // 切换登录方式
        changeLoginType(type) {
            this.login_type = type;
            let dom = document.getElementsByTagName('iframe');
            if (dom) {
                dom[0].setAttribute('style', "display:none");
            }
        },
        getParam(name, url) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            // var r = window.location.search.substr(1).match(reg);
            if (url.indexOf('?') > -1) {
                var r = url.split('?')[1].match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            }
            return null;
        },

        passwordClick() {
            this.visible = !this.visible;
            if (this.visible == true) {
                this.passwordOrText = 'password';
            } else {
                this.passwordOrText = 'text';
            }

        }
    },
    activated() {
        let app = this.fun.getTyep();

        if (app == "7") {
            this.isAppLogin();
        } else {
            this.appShow = true;
        }


        this.apptoken = this.$route.query.apptoken;
        this.init_login();
    }
};
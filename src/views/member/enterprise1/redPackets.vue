<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="红包推广"></c-title>
      <div style="height: 40px"></div>

      <div class="main">
        <div class="field-item">
          <label>投放总金额</label>
          <input type="text" v-model="formData.redmoney" placeholder="0.00" />
          <span>元</span>
        </div>
        <div class="field-item">
          <label>红包个数</label>
          <input type="text" v-model="formData.redmoneynum" placeholder="填写个数" />
          <span>个</span>
        </div>
        <p class="info">总金额大于299元可自定义范围，低于299默认本市
          <van-button icon="location" type="primary" size="mini" v-if="showLoaction" @click="getLocation" />
        </p>

        <div class="btn-container" v-show="isShow">
          <div class="btn-group">
            <h3>投放区域位置</h3>
            <div class="btn-wrap">
              <button
                v-for="item in regionList"
                :key="item.launch"
                :class="{ selected: item.launch === formData.launch }"
                @click="selectRegion(item)"
              >
                {{ item.title }}
              </button>
            </div>
          </div>
          <div class="btn-group">
            <h3>投放人群</h3>
            <div class="btn-wrap">
              <button
                v-for="item in targetList"
                :key="item.launch_sex"
                :class="{ selected: item.launch_sex === formData.launch_sex }"
                @click="selectTarget(item)"
              >
                {{ item.title }}
              </button>
            </div>
          </div>
        </div>

        <p class="text">¥ {{ money }}</p>
        <button :disabled="btnDisabled" class="btn" :class="{ normal: !btnDisabled }" @click="submitOrder">
          立即推广
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog } from 'vant'
import cTitle from 'components/title'
export default {
  components: { cTitle },
  data() {
    return {
      openid: '',
      formData: {
        uid: '',
        redmoney: '',
        redmoneynum: '',
        launch: 3,
        launch_sex: 3,
        addcode: '',
        citycode: '',
        longitude: '',
        latitude: ''
      },
      limitMoney: 299,
      regionList: [
        { title: '附近五公里', launch: 1 },
        { title: '全区/县', launch: 2 },
        { title: '全市', launch: 3 },
        { title: '全省', launch: 4 },
        { title: '全国', launch: 5 }
      ],
      targetList: [
        { title: '全部', launch_sex: 3 },
        { title: '男', launch_sex: 1 },
        { title: '女', launch_sex: 2 },
      ],
      showNumberKeyboard: false,
      isWechat: '',
      trade_type: '',
      host: '',
      queryResultsUrl: '',
      timer: '',
      url: '',
      showLoaction: false
    }
  },
  created() {
    this.getLocation()
    this.host = 'https://' + window.location.host
    this.url = this.host + '/addons/yun_shop/?menu#/member/queryResults?i=2&type=5&mid=0&shop_id'
    this.queryResultsUrl =
      this.urlencode(this.host) + '/addons/yun_shop/?menu#/member/queryResults?i=2&type=5&mid=0&shop_id'
    this.getOpenId()
    this.isWechat = (function () {
      return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
    })()
    this.trade_type = this.isWechat ? 'JSAPI' : 'MWEB'
  },
  watch: {
    'formData.redmoney': {
      handler(val) {
        if (val < this.limitMoney) {
          this.formData.launch = 3
          this.formData.launch_sex = 3
        }
      }
    }
  },
  computed: {
    // 返回展示金额
    money() {
      return this.formData.redmoney ? this.formData.redmoney : '0.00'
    },
    // 返回按钮状态
    btnDisabled() {
      return (this.formData.redmoney > 0 && this.formData.latitude > 0) ? false : true
    },
    // 是否显示选择推广区域和推广人群
    isShow() {
      return this.formData.redmoney > this.limitMoney
    }
  },
  methods: {
    urlencode(str) {
      str = (str + '').toString()

      return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+')
    },
    //获取当前的经纬度
    getLocation() {
      var that = this
      var mapObj = new AMap.Map('iCenter')
      mapObj.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        })
        mapObj.addControl(geolocation)
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', onComplete) // 返回定位信息
        AMap.event.addListener(geolocation, 'error', onError) // 返回定位出错信息
      })

      function onComplete(obj) {
        that.$toast('获取定位成功')
        that.showLoaction = false
        console.log(obj)
        that.formData.addcode = obj.addressComponent.adcode
        that.formData.citycode = obj.addressComponent.citycode
        that.formData.longitude = obj.position.lng
        that.formData.latitude = obj.position.lat

      }

      function onError(obj) {
        that.$toast('获取定位失败，请点击定位按钮')
        that.showLoaction = true
      }
    },
    // 金额获取焦点
    hanldeFocus() {
      this.showNumberKeyboard = true
    },
    // 选择区域
    selectRegion(data) {
      this.formData.launch = data.launch
    },
    // 选择区域
    selectTarget(data) {
      this.formData.launch_sex = data.launch_sex
    },
    // 提交订单
    submitOrder() {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/getsave'
      axios({
        method: 'POST',
        url,
        data: this.formData
      }).then(async res => {
        console.log(res)
        if (res.data.result === 1) {
          const { data } = await this.getSignature()
          console.log(data)
          if (this.isWechat) {
            this.wexinPay(data)
          } else {
            console.log(123, data)
            const payURL =
              data.mweb_url + '&redirect_url=' + encodeURIComponent(this.url + '&out_trade_no=' + data.out_trade_no)
            window.location.href = payURL
          }
        } else {
          this.$dialog({message: res.data.msg})
        }
      })
    },
    // 向后台请求微信支付signature
    async getSignature() {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/newpay'
      const formData = {
        openid: this.openid,
        uid: this.formData.uid,
        money: this.formData.redmoney,
        redmoneynum: this.formData.redmoneynum,
        trade_type: this.trade_type
      }
      return axios({
        method: 'POST',
        url,
        data: formData
      })
    },
    // 微信支付
    wexinPay(data, cb, errorCb) {
      const that = this
      //获取后台传入的数据
      let appId = data.appId
      let timestamp = data.timeStamp
      let nonceStr = data.nonceStr
      let signature = data.signature
      let packages = data.package
      let paySign = data.paySign
      let signType = data.signType
      console.log('发起微信支付')
      //下面要发起微信支付了
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature, // 必填，签名，见附录1
        jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
      wx.ready(function () {
        wx.chooseWXPay({
          timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
          package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: paySign, // 支付签名
          success: function (res) {
            // 支付成功后的回调函数
            // Toast.success('支付成功');
            // cb(res)
            if (res.errMsg === 'chooseWXPay:ok') {
              that.$router.push(that.fun.getUrl('promotionRecord'))
            } else if (res.errMsg === 'chooseWXPay:cancel') {
              that.$toast('取消支付')
            }
          },
          fail: function (res) {
            //失败回调函数
            that.$toast.fail('支付失败')
            // errorCb(res)
          }
        })
      })
      wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        /*alert("config信息验证失败");*/
        console.log(res)
      })
    },
    // 请求登录数据
    getOpenId() {
      $http.post('member.member.member-data', { v: 2 }, ' ').then(res => {
        this.openid = res.data.member.yz_member.yz_openid
        this.formData.uid = res.data.member.uid
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#income,
.supplier {
  height: 100%;
}
.main {
  padding-top: 1.25rem;
  height: calc(100% - 2.5rem);
  background: #ffffff;
  .field-item {
    display: flex;
    align-items: center;
    height: 3.125rem;
    padding: 0 1.25rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    label {
      width: 6.25rem;
      text-align: left;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      line-height: 22px;
    }
    input {
      flex: 1;
      text-align: right;
      border: 0;
      &::placeholder {
        color: #999999;
      }
    }
    span {
      width: 1.25rem;
    }
  }

  .info {
    margin-top: 0.625rem;
    text-align: left;
    text-indent: 1.25rem;
    font-size: 12px;
    color: #999;
  }

  .btn-container {
    margin-top: 1.875rem;
    .btn-group {
      h3 {
        margin-bottom: 1.875rem;
        text-align: left;
        text-indent: 1.25rem;
        font-size: 18px;
        color: #333;
      }
      .btn-wrap {
        padding: 0 1.25rem 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        &:after {
          content: '';
          width: 5.625rem;
        }
        button {
          outline: none;
          border: none;
          margin-bottom: 1rem;
          width: 5.625rem;
          height: 1.875rem;
          border: 1px solid #979797;
          border-radius: 4px;
          font-size: 14px;
          line-height: 1.25rem;
          color: #666;
          &.selected {
            border-color: #0579fc;
            background: #0579fc;
            color: #fff;
          }
        }
      }
    }
  }

  .text {
    margin: 1.5625rem 0;
    font-size: 36px;
    font-weight: 700;
    color: #333333;
    line-height: 3.125rem;
  }

  .btn {
    outline: none;
    border: none;
    width: 19.25rem;
    height: 2.5rem;
    border-radius: 3px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.25rem;
    background: #e4e4e4;
    color: #ffffff;
    &:active {
      background: #056ee6;
    }
  }
  .normal {
    background: #0579fc;
  }
}
</style>

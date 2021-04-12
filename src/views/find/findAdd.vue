<template>
  <div id="income">
    <div class="supplier">
      <c-title
        :hide="false"
        text="发布商机"
      ></c-title>
      <div style="height: 40px"></div>

      <div class="main">
        <van-field
          v-model="formData.content"
          rows="6"
          autosize
          type="textarea"
          maxlength="300"
          placeholder="请输入想要发布的内容…"
          show-word-limit
        />
        <div class="upload-wrap">
          <van-uploader
            v-model="detailFileList"
            upload-icon="plus"
            multiple
            :max-count="9"
            :after-read="afterReadDetail"
            @delete="handleDeleteDetail"
          />
        </div>
        <van-cell
          value="视频"
          :border="false"
        />
        <div class="upload-container">
          <div class="upload-item">
            <van-icon
              v-if="formData.videourl"
              name="delete"
              @click="handleDeleteVideo"
            />
            <video
              v-if="formData.videourl"
              :src="formData.videourl"
              controls
              disablePictureInPicture
              preload="none"
              controlslist="nodownload"
            ></video>
            <van-uploader
              v-else
              v-model="videoFileList"
              multiple
              accept="video/*"
              :max-count="1"
              :after-read="afterReadVideo"
              @delete="handleDeleteVideo"
            />
          </div>
          <div class="upload-item">
          </div>
          <div class="upload-item">
          </div>
        </div>
        <div class="field-item">
          <i class="icon-loc"></i>
          <!-- <label>所在位置</label> -->
          <div class="wrap">
            <input
              class="text-left"
              type="text"
              v-model="formData.sqnadress"
              readonly
              placeholder="当前位置获取中..."
            />
          </div>
        </div>
        <div class="field-item">
          <i class="icon-money"></i>
          <div class="wrap">
            <label>投放总金额</label>
            <input
              type="text"
              v-model="formData.redmoney"
              placeholder="0.00"
            />
            <span>元</span>
          </div>
        </div>
        <div class="field-item">
          <i class="icon-red"></i>
          <div class="wrap">
            <label>红包个数</label>
            <input
              type="text"
              v-model="formData.redmoneynum"
              placeholder="填写个数"
            />
            <span>个</span>
          </div>
        </div>
        <p class="info">
          总金额大于299元可自定义范围，低于299默认本市
          <van-button
            icon="location"
            type="primary"
            size="mini"
            v-if="showLoaction"
            @click="getLocation"
          />
        </p>

        <div class="btn-group">
          <h3><i class="type" /><span>选择类型</span></h3>
          <div class="btn-wrap">
            <div>
              <button
                v-for="item in typeList"
                :key="item.type"
                :class="{ selected: item.type === formData.type }"
                @click="selectType(item)"
              >
                {{ item.title }}
              </button>
            </div>
          </div>
        </div>
        <div
          class="btn-container"
          v-show="isShow"
        >
          <div class="btn-group">
            <h3><i class="fanwei" />投放区域位置</h3>
            <div class="btn-wrap">
              <div>
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
          </div>
          <div class="btn-group">
            <h3><i class="renqun" />投放人群</h3>
            <div class="btn-wrap">
              <div>
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
        </div>

        <p class="text">¥ {{ money }}</p>
        <button
          :disabled="btnDisabled"
          class="btn"
          :class="{ normal: !btnDisabled }"
          @click="submitOrder"
        >发布</button>
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
      isupLoad: false,
      detailFileList: [],
      openid: '',
      formData: {
        uid: '',
        content: '',
        texturl: '',
        sqnadress: '',
        redmoney: '',
        redmoneynum: '',
        type: 1,
        launch: 3,
        launch_sex: 3,
        addcode: '',
        citycode: '',
        longitude: '',
        latitude: '',
        videourl: ''
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
        { title: '女', launch_sex: 2 }
      ],
      typeList: [
        //1企业采购,2企业招商,3提问求助,4介绍推荐,5本地生活,6个人需求
        { title: '企业采购', type: 1 },
        { title: '企业招商', type: 2 },
        { title: '提问求助', type: 3 },
        { title: '介绍推荐', type: 4 },
        { title: '本地生活', type: 5 },
        { title: '个人需求', type: 6 }
      ],
      showNumberKeyboard: false,
      isWechat: '',
      trade_type: '',
      host: '',
      queryResultsUrl: '',
      timer: '',
      url: '',
      showLoaction: false,
      videoFileList: []
    }
  },
  activated() {
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
      return this.formData.redmoney > 0 && this.formData.latitude > 0 ? false : true
    },
    // 是否显示选择推广区域和推广人群
    isShow() {
      return this.formData.redmoney > this.limitMoney
    }
  },
  methods: {
    async afterReadVideo(file) {
      const type = 2 // 视频类型
      const formData = this.generatorFormData(this.videoFileList, type)
      this.formData.videourl = await this.upload(formData)
    },
    async handleDeleteVideo(file) {
      this.videoFileList = []
      this.formData.videourl = ''
    },
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
        that.formData.sqnadress = obj.formattedAddress
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
    // 选择类型
    selectType(data) {
      this.formData.type = data.type
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
      const length = this.formData.texturl.split(',').length
      if (this.isupLoad) {
        this.$dialog({
          message: '图片正在上传请等待!'
        })
        return
      }
      if (length < 3) {
        this.$dialog({
          message: '请至少上传3张详情图片!'
        })
        return
      }
      if (this.formData.videourl && length > 8) {
        this.$dialog({
          message: '上传视频最多上传8张图片!'
        })
        return
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/getfindsave'
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
          this.$dialog({ message: res.data.msg })
        }
      })
    },
    // 向后台请求微信支付signature
    async getSignature() {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/newfindpay'
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
            if (res.errMsg == 'chooseWXPay:ok') {
              that.$router.push(that.fun.getUrl('find'))
            } else if (res.errMsg == 'chooseWXPay:cancel') {
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
    },
    // 详情图片上传
    async afterReadDetail(file) {
      const type = 1 // 图片类型
      const urlArr = []
      const fileArr = []
      this.detailFileList.forEach(item => {
        if (item.url) {
          urlArr.push(item.url)
        } else {
          fileArr.push(item)
        }
      })
      const formData = this.generatorFormData(fileArr, type)
      this.formData.texturl = urlArr.concat(await this.upload(formData)).join(',')
      console.log(this.formData.texturl)
    },
    // 详情图片删除
    async handleDeleteDetail(file) {
      const type = 1 // 图片类型
      const urlArr = []
      const fileArr = []
      this.detailFileList.forEach(item => {
        if (item.url) {
          urlArr.push(item.url)
        } else {
          fileArr.push(item)
        }
      })
      const formData = this.generatorFormData(fileArr, type)
      this.formData.texturl = urlArr.concat(await this.upload(formData)).join(',')
      console.log(this.formData.texturl)
    },
    // 生成FormData
    generatorFormData(array, type) {
      const len = array.length
      if (!len) return
      const formData = new FormData()
      formData.append('type', type)
      for (let i = 0; i < len; i++) {
        formData.append('image[]', array[i].file)
      }
      return formData
    },
    // 上传方法
    upload(formData) {
      this.isupLoad = true
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/image'
      let headers = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      return axios({
        method: 'POST',
        url: url,
        data: formData
      })
        .then(res => {
          if (res.data.result === 1) {
            this.isupLoad = false
            return res.data.data ? res.data.data.img_path : []
          } else {
            Toast(res.data.msg)
          }
        })
        .catch(reason => {
          console.log(reason)
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
  padding: 1.25rem 1.25rem 4.375rem;
  background: #ffffff;
  .field-item {
    display: flex;
    align-items: center;
    height: 3.125rem;
    // padding: 0 1.25rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    // box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    .wrap {
      width: 100%;
      height: 100%;
      line-height: 50px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
    }
    label {
      width: 6.25rem;
      text-align: left;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 22px;
    }
    input {
      flex: 1;
      text-align: right;
      border: 0;
      width: 100%;
      &::placeholder {
        color: #999999;
      }
    }
    span {
      width: 1.85rem;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .info {
    margin: 0.625rem 0 1.25rem;
    text-align: left;
    text-indent: 1.25rem;
    font-size: 12px;
    color: #999;
  }

  .btn-container {
  }

  .btn-group {
    h3 {
      margin: 0.875rem 0;
      text-align: left;
      font-size: 16px;
      color: #333;
    }
    .btn-wrap {
      padding: 0 1.25rem 0;
      & > div {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        &:after {
          content: '';
          width: 5.625rem;
        }
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
.text-left {
  color: #0579fc;
  text-align: left !important;
  font-size: 16px;
  font-weight: 600;
}

.icon-loc,
.icon-money,
.icon-red,
.type,
.fanwei,
.renqun {
  display: inline-block;
  flex: 0 0 1.5rem;
  margin-right: 0.8125rem;
  width: 1.5rem;
  height: 1.5rem;
  background: url('./img/location.png') no-repeat center center;
  background-size: 1.5rem 1.5rem !important;
}
.icon-money {
  background: url('./img/money.png') no-repeat center center;
}
.icon-red {
  background: url('./img/red-packet.png') no-repeat center center;
}

.type {
  vertical-align: bottom;
  background: url('./img/type.png') no-repeat center center;
}
.fanwei {
  vertical-align: bottom;
  background: url('./img/fanwei.png') no-repeat center center;
}
.renqun {
  vertical-align: bottom;
  background: url('./img/renqun.png') no-repeat center center;
}

.van-cell::after {
  border: none;
}
.upload-wrap {
  display: flex;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e5e5;
  .van-uploader {
    width: 100%;
    /deep/.van-uploader__wrapper {
      justify-content: space-between;
      &:after {
        content: '';
        flex: 0 0 80px;
      }
    }
  }
}
.upload-container {
  display: flex;
  padding-left: 0.875rem;
  .upload-item {
  }
}

video {
  width: 16.875rem;
  height: 9.5rem;
  border: 1px dashed #ccc;
}
</style>

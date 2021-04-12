<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="邀请" tolink="newExtension" totext="分享列表" ></c-title>
      <!-- <div style="height: 40px"></div> -->

      <div class="main">
        <img class="qrcode" :src="qrcode" alt="推广二维码">
      </div>
    </div>
  </div>
</template>
<script>
import cTitle from 'components/title'
export default {
  components: { cTitle },
  data() {
    return {
      qrcode: ''
    }
  },
  activated() {
    this.getExtensionInfo()
  },
  methods: {
    getExtensionInfo() {
      // 获取二维码
      this.getQrCode()
        this.getMemberList()
    },
    getQrCode() {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/geterweima'
      const uid = JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      axios({
        url,
        method: 'POST',
        data: { uid }
      }).then(res => {
        this.qrcode = res.data.data.qrcode
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#income,
.supplier,
.main {
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
}
.supplier {
  background: url('../../assets/images/member/qrcode_bg.png') no-repeat;
  background-size: 100% 100%;
}

.main {
  position: relative;
}

.qrcode {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 13.5rem;
  height: 13.5rem;
}

/deep/.mint-header {
  background: transparent !important;
  border-bottom: none !important;
  color: #333;
  font-size: 18px;
}
</style>

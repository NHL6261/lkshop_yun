<template>
  <div id="income">
    <div class="supplier">
      <c-title
        :hide="false"
        :text="message"
      ></c-title>
      <div style="height: 40px"></div>

      <div class="main">
        <div class="success-bg"></div>
        <p class="success-text">{{message}}</p>
        <!-- <div class="success-info">
          <p>交易金额：¥500.00</p>
          <p>订单编号: 20200922111</p>
          <p>支付方式：微信支付</p>
          <p>付款时间：2020-09-22</p>
        </div> -->
        <button
          class="btn"
          @click="handleTo"
        >
          返回
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
      message: '正在查询支付结果',
      out_trade_no: '',
      num: 0
    }
  },
  created() {
    this.num = 0
    // alert(this.$route.query.out_trade_no)
    this.out_trade_no = this.$route.query.out_trade_no
    this.h5PayCallback(this.out_trade_no)
  },
  mounted() {
    // this.num = 2
    // this.h5PayCallback(this.out_trade_no)
  },
  methods: {
    // 返回个人中心
    handleTo() {
      this.$router.push(this.fun.getUrl('member'))
    },
    h5PayCallback(out_trade_no) {

      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/orderquery'
      axios({
        method: 'POST',
        url,
        data: {
          out_trade_no: out_trade_no
        }
      }).then(res => {
        // alert(this.num)
         if(this.num===0){
            this.num++
           this.h5PayCallback(this.out_trade_no)
         }else{
           if (res.data.trade_state === 'SUCCESS') {
            Dialog.alert({
              message: res.data.trade_state_desc
            }).then(() => {
              this.$router.push(this.fun.getUrl('member'))
            })
          } else {
            Dialog.alert({
              message: res.data.trade_state_desc
            }).then(() => {
              this.$router.push(this.fun.getUrl('redPackets'))
            })
          }
         }
        // alert(res.data.trade_state)
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
  padding: 4rem 2.375rem 0;
  height: calc(100% - 2.5rem);
  background: #ffffff;

  .success-bg {
    width: 6.25rem;
    height: 120px;
    margin-left: 50%;
    transform: translateX(-50%);
    background: url('../../../assets/images/strongMan/submit_success@2x.png') no-repeat;
    background-size: 6.25rem 7.5rem;
  }
  .success-text {
    margin: 1rem 0 1.5625rem;
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #494949;
    line-height: 1.5625rem;
  }

  .success-info {
    margin-bottom: 6.375rem;
    padding: 1.125rem 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    p {
      font-size: 14px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #666666;
      line-height: 1.25rem;
      text-align: left;
      text-indent: 0.75rem;
    }
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
    background: #0579fc;
    color: #ffffff;
    &:active {
      background: #056ee6;
    }
  }
}
</style>

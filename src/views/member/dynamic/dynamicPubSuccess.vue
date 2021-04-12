<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="成功"></c-title>
      <div style="height: 40px"></div>

      <div class="main">
        <div class="success-bg"></div>
        <p class="success-text">发布成功</p>
        <!-- <div class="success-info">
          <p>交易金额：¥500.00</p>
          <p>订单编号: 20200922111</p>
          <p>支付方式：微信支付</p>
          <p>付款时间：2020-09-22</p>
        </div> -->
        <button class="btn" @click="handleTo">
          返回
        </button>
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
    }
  },
  methods: {
    // 返回动态列表
    handleTo() {
      this.$router.push(this.fun.getUrl('dynamicList'))
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
  background: #FFFFFF;

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
    background: #0579FC;
    color: #FFFFFF;
    &:active {
      background: #056ee6;
    }
  }
}
</style>

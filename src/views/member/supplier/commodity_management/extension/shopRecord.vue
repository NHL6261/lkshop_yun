<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="红包推广"></c-title>
      <!-- <div style="height:40px;"></div> -->

      <div class="main">
        <!-- 红包推广 -->
        <div class="welcome">
          <div class="bg"></div>
          <div class="header">
            <div class="title">
              <span>推广余额</span>
              <span>单位(元)</span>
              <!-- <button @click="toDetails">领取明细</button> -->
            </div>
            <p class="amount">
              <span>¥</span><span>{{ recordData.surplusmoney }}</span>
            </p>
            <van-divider />

            <!-- 明细 -->
            <div class="detailed">
              <div class="detailed-item">
                <span>推广金额</span>
                <span>{{ recordData.redmoney }}</span>
              </div>
              <div class="detailed-item">
                <span>红包个数</span>
                <span>{{ recordData.redmoneynum }}</span>
              </div>
              <div class="detailed-item">
                <span>领取次数</span>
                <span>{{ recordData.redmoneynum - recordData.surplusnum }}</span>
              </div>
            </div>
            <div class="detailed">
              <div class="detailed-item">
                <span>投放区域</span>
                <span>{{ recordData.launch | launchText }}</span>
              </div>
              <div class="detailed-item">
                <span>投放人群</span>
                <span>{{ recordData.launch_sex | launchSexText }}</span>
              </div>
              <div class="detailed-item">
                <span>上次剩余</span>
                <span>{{ recordData.lastmoney }}</span>
              </div>
            </div>

            <!-- 按钮 -->
            <button class="btn" @click="toRedPackets">{{ (recordData.listhistory && recordData.listhistory.length) ? '再次推广' : '立即推广' }}</button>
          </div>

          <div class="record" v-if="recordData.listhistory && recordData.listhistory.length">
            <div class="year-item" v-for="(year, index) in recordData.listhistory" :key="index">
              <p class="year-text">{{ year.year }}</p>
              <div class="panel">
                <div class="month-item" v-for="(month, index) in year.yearhistory" :key="index">
                  <p class="month-text">{{ month.month }}</p>
                  <div class="day-item" v-for="(day, index) in month.monthhistory" :key="index">
                    <p class="day-text">{{ day.create_time }}</p>
                    <div class="detailed">
                      <div class="detailed-item">
                        <span>推广金额</span>
                        <span>{{ day.redmoney }}</span>
                      </div>
                      <div class="detailed-item">
                        <span>红包个数</span>
                        <span>{{ day.redmoneynum }}</span>
                      </div>
                      <div class="detailed-item">
                        <span>领取次数</span>
                        <span>{{ day.redmoneynum - day.surplusnum }}</span>
                      </div>
                    </div>
                    <div class="detailed">
                      <div class="detailed-item">
                        <span>投放区域</span>
                        <span>{{ day.launch | launchText }}</span>
                      </div>
                      <div class="detailed-item">
                        <span>投放人群</span>
                        <span>{{ day.launch_sex | launchSexText }}</span>
                      </div>
                      <div class="detailed-item">
                        <span>上次剩余</span>
                        <span>{{ day.lastmoney }}</span>
                      </div>
                    </div>
                    <!-- 分割线 -->
                    <van-divider v-if="index !== month.monthhistory.length - 1" dashed />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import cTitle from 'components/title'
export default {
  components: { cTitle },
  filters: {
    launchText(param) {
      const obj = {
        1: '附近五公里',
        2: '全区/县',
        3: '全市',
        4: '全省',
        5: '全国'
      }
      return obj[param] ? obj[param] : '- -'
    },
    launchSexText(param) {
      const obj = {
        1: '男',
        2: '女',
        3: '全部'
      }
      return obj[param] ? obj[param] : '- -'
    }
  },
  data() {
    return {
      goods_id:'',
      recordData: {
        // id: 22,
        // uid: 10,
        // totalmoney: '',
        // historymoney: 100,
        redmoney: '0.00', // 推广金额
        surplusmoney: '0.00', // 剩余金额
        redmoneynum: 0, // 红包个数
        surplusnum: 0, // 剩余个数
        lastmoney: 0.00, // 上次剩余金额
        launch: -1, // 投放区域---->1附近五公里,2全区/县,3全市,4全省..5全国
        launch_sex: -1, // 投放性别1男2女3全部
        // create_time: '1970-01-01 08:00:00',
        lqunum: 0, // 领取个数
        // listhistory: [
        //   {
        //     yearName: '今年',
        //     month: {
        //       monthName: '12月',
        //       data: [
        //         {
        //           dayName: '2020-12-12',
        //           amount: '300.00',
        //           number: 700,
        //           claimTimes: 700,
        //           origin: '全市',
        //           targetPopulation: '全部',
        //           remainingAmount: '200.00'
        //         },
        //         {
        //           dayName: '2020-12-12',
        //           amount: '300.00',
        //           number: 700,
        //           claimTimes: 700,
        //           origin: '全市',
        //           targetPopulation: '全部',
        //           remainingAmount: '200.00'
        //         }
        //       ]
        //     }
        //   }
        // ]
      }
    }
  },
  activated() {
    this.goods_id =  this.$route.query.goods_id
    this.getDetail({goods_id:this.goods_id})
  },
  methods: {
    // 跳转到领取明细
    toDetails() {
      this.$router.push(this.fun.getUrl('collectionDetails'))
    },
    // 去红包充值
    toRedPackets() {
      this.$router.push(this.fun.getUrl('extensionAdd','',{goods_id:this.goods_id}))
    },
    // 获取历史记录
    async getHistoryList() {
      const { data } = await this.getValidInfo()
      const formData = {
        id: data.data.id
      }
      await this.getDetail(formData)
    },
    // 获取认证信息
    getValidInfo() {
      const data = { uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid, id: '' }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/basicname'
      return axios({
        method: 'post',
        url: url,
        data
      })
    },
    // 获取推广数据
    getDetail(data) {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/shophistorylist'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        res = res.data
        const { data, msg, result } = res
        console.log(data, msg, result)
        if (!result) {
          this.$dialog({
            message: msg
          })
          return
        } else {
          // if (!data.id) {
          //   this.$router.push(this.fun.getUrl('redPackets'))
          // } else {
            // this.recordData = {}
          // }
          if (data.id) {
            this.recordData = data
          }
          console.log(this.recordData)
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
/deep/.mint-header.is-fixed{
  background: #0283ff;
  color:#fff;
  border:none;
}
#income,
.supplier,
.main,
.welcome {
  height: 100%;
  box-sizing: border-box;
}
.supplier {
  padding-top: 40px;
  background: #fff;
}
.welcome {
  position: relative;
  padding: 0 0.75rem;
  background: #f9fafb;
}
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 8.5rem;
  background: #0283ff;
  z-index: 90;
}
.header {
  position: fixed;
  top: 50px;
  padding: 1.25rem;
  width: 21.875rem;
  height: 20.25rem;
  background: #fff;
  border-radius: 6px;
  text-align: left;
  z-index: 999;
  .title {
    position: relative;
    line-height: 1.375rem;
    font-size: 16px;
    font-weight: bold;
    color: #666;
    span:nth-of-type(2) {
      padding-left: 0.625rem;
      font-size: 14px;
    }
    button {
      border: none;
      position: absolute;
      right: 0;
      width: 4.375rem;
      height: 1.5625rem;
      background: #0579fc;
      border-radius: 4px;
      font-size: 12px;
      color: #fff;
      font-weight: normal;
    }
  }
  .amount {
    line-height: 2.375rem;
    font-size: 26px;
    color: #333;
    font-weight: bold;
    span:nth-of-type(1) {
      padding-right: 0.3125rem;
      font-size: 18px;
    }
  }
  .btn {
    margin-top: 1.875rem;
    width: 19.25rem;
    height: 2.5rem;
    background: #0579fc;
    border-radius: 0.25rem;
    border: none;
    color: #fff;
  }
}
.detailed {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .detailed-item {
    display: flex;
    flex-direction: column;
    margin-top: 1.25rem;
    width: 33.33%;
    &:nth-of-type(2n) {
      text-indent: 1.5rem;
    }
    &:nth-of-type(3n) {
      text-align: right;
    }
    span:first-child {
      color: #666;
    }
    span:last-child {
      margin-top: 4px;
      color: #333;
      font-weight: bold;
    }
  }
}
.record {
  padding-top: 22.125rem;
}
.year-item {
  margin-bottom: 1.25rem;
  width: 21.875rem;
  text-align: left;
  .year-text {
    margin-bottom: 0.25rem;
    font-size: 20px;
    font-weight: bold;
  }
  .panel {
    padding: 1.25rem;
    background: #fff;
    border-radius: 6px;
    .month-item {
      .month-text {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 0.625rem;
      }
    }
    .day-item {
      .day-text {
        font-size: 12px;
        color: #999;
      }
      .van-divider {
        border-color: #a2a2a2;
      }
    }
  }
}
</style>

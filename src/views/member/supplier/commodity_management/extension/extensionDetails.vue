<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="领取明细"></c-title>

      <div class="main">
        <div class="detail-list">
          <div class="detail-header">
            <div>ID</div>
            <div>领取金额</div>
          </div>
          <div class="detail-body">
            <ul>
              <li v-for="(item, index) in list" :key="index" class="van-hairline--bottom">
                <div>
                  <span>{{ item.nickname }}</span>
                  <span>{{ item.create_time }}</span>
                </div>
                <div>{{ item.money }}</div>
              </li>
            </ul>
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
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getHistoryList()
  },
  methods: {
    // 获取令居记录
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
    // 获取领取数据
    getDetail(data) {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/tgdetailed'
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
          this.list = data
        }
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#income,
.supplier,
.main,
.welcome {
  height: 100%;
  min-height: 100%;
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

.detail-list {
  padding: 0 1.25rem 0 1.375rem;
  .detail-header {
    display: flex;
    padding-top: .75rem;
    position: fixed;
    width: calc(100% - 2.625rem);
    z-index: 999;
    background: #fff;
    & > div {
      flex: 1;
      line-height: 22px;
      font-size: 16px;
      font-weight: bold;
      color: #333;
      &:first-child {
        text-align: left;
      }
      &:last-child {
        text-align: right;
      }
    }
  }
  .detail-body {
    padding-top: 2.1875rem;
    padding-bottom: 3.4375rem;
    ul {
      li {
        display: flex;
        padding: .9375rem 0 .375rem;
        & > div {
          flex: 1;
          line-height: 22px;
          font-weight: bold;
          color: #333;
          &:first-child {
            text-align: left;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            span:nth-of-type(2) {
              font-size: 12px;
              font-weight: normal;
              color: #666;
            }
          }
          &:last-child {
            text-align: right;
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>

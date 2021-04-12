<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="动态列表">
        <van-icon name="plus" slot="edit" @click="toPub" />
      </c-title>
      <!-- <div style="height:40px;"></div> -->

      <div class="main">
        <!-- 动态列表 -->
        <div class="welcome">
          <!-- 有数据状态 -->
          <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
              <!-- 无数据状态 -->
              <van-empty v-if="!this.list.length" description="暂无动态" />
              <van-swipe-cell v-else v-for="item in list" :key="item.id" :before-close="beforeClose">
                <div class="dynamic-item" @click="toPreview(item)">
                  <div class="dynamic-wrap">
                    <img class="dynamic-img" :src="item.img" alt="封面图" />
                    <div class="dynamic-info">
                      <p class="dinamic-title">{{ item.title }}</p>
                      <p class="dinamic-pub-time">{{ item.create_time }}</p>
                    </div>
                  </div>
                  <van-divider />
                </div>
                <template #right>
                  <van-button square type="danger" text="删除" class="del-button" @click="handleDel(item)" />
                </template>
              </van-swipe-cell>
            </van-list>
          </van-pull-refresh>
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
      list: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  activated() {
    this.onLoad()
  },
  methods: {
    toPub() {
      this.$router.push(this.fun.getUrl('dynamicInfo'))
    },
    async onLoad() {
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
      }

      // for (let i = 0; i < 10; i++) {
      //   const dynamic = {
      //     id: this.list.length + i,
      //     url: 'https://img.yzcdn.cn/vant/cat.jpeg',
      //     title: `ACPE成员国跨境培训 北京电子商会副会长ACPE成员国跨境培训 北京电子商会副${i}`,
      //     dateTime: '2019.09.09'
      //   }
      //   this.list.push(dynamic)
      // }
      const { data } = await this.getDynamicList()
      console.log(data)
      if (data.result) {
        this.list = data.data
      } else {
        this.$dialog({
          message: data.msg
        })
      }
      this.loading = false
      this.finished = true
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    beforeClose({ position, instance }) {
      switch (position) {
        case 'left':
        case 'cell':
        case 'outside':
          instance.close()
          break
        case 'right':
          instance.close()
          break
      }
    },
    // 删除
    handleDel(item) {
      this.$dialog
        .confirm({
          message: '确定删除吗？'
        })
        .then(async () => {
          const { data } = await this.delRequest(item)
          if (data.result) {
            console.log(data)
            const msg = data.msg
            // this.$toast
            this.$toast({
              type: 'success',
              message: msg
            })
            this.onRefresh()
          } else {
            this.$toast(msg)
          }
        })
    },
    delRequest(item) {
      const url = ' https://tpkl.minpinyouxuan.com/index.php/api/v1/deletedynamic'
      const data = { id: item.id }
      return axios({
        method: 'post',
        url: url,
        data
      })
    },
    // 获取列表数据
    async getDynamicList() {
      const { data } = await this.getValidInfo()
      if (data.result) {
        const params = { sid: data.data.id }
        const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/dynamiclists'
        return axios({
          method: 'post',
          url: url,
          data: params
        })
      } else {
        this.$dialog({
          message: data.msg
        })
        return
      }
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
    toPreview(item) {
      this.$router.push(this.fun.getUrl('dynamicPreview', { id: item.id }))
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#income,
.supplier,
.main,
.welcome {
  min-height: 100%;
  box-sizing: border-box;
}
.supplier {
  padding-top: 40px;
  background: #fff;
}

.del-button {
  height: 100%;
}

.dynamic-item {
  padding: 0 1.25rem;
  .dynamic-wrap {
    display: flex;
    height: 6.5625rem;
    // border-bottom: 1px solid #E4E4E4;
    box-sizing: border-box;
    .dynamic-img {
      margin-right: 0.625rem;
      width: 6.25rem;
      height: 4.6875rem;
    }
    .dynamic-info {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      text-align: left;
      .dynamic-title {
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
        color: #333333;
      }
      .dinamic-pub-time {
        margin-top: 0.625rem;
        font-size: 14px;
        font-weight: 500;
        color: #999999;
        line-height: 17px;
      }
    }
  }
}
.van-divider {
  margin: 0;
}
</style>

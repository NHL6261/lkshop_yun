<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="动态预览"></c-title>
      <!-- <div style="height:40px;"></div> -->

      <div class="main">
        <!-- 动态内容 -->
        <div class="welcome">
          <h2 class="title">{{ detail.title }}</h2>
          <div class="container">
            <img class="avatar" :src="detail.avatar" alt="头像" />
            <span class="author">{{ detail.nickname }}</span>
            <span class="pub-time">{{ detail.create_time }}</span>
            <div class="content" v-html="detail.content"></div>
          </div>
          <!-- 发布按钮 -->
          <button v-if="!detail.status" class="btn" @click="handlePub">发布</button>
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
      detail: {
        title: '',
        img: '',
        nickname: '',
        create_time: '',
        content: ''
      }
    }
  },
  // watch: {
  //   $route: {
  //     immediate: true,
  //     handler(route) {
  //       console.log(route)
  //       const id = route.params.id
  //       this.getDetail(id)
  //     }
  //   }
  // },
  activated() {
    const id = this.$route.params.id
    this.getDetail(id)
  },
  methods: {
    // 发布
    handlePub() {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/upstatus'
      const data = { id: this.detail.id }
      axios({
        method: 'POST',
        url,
        data
      }).then(res => {
        res = res.data
        const { data, msg, result } = res
        if (!result) {
          this.$dialog({
            message: msg
          })
          return
        } else {
          this.$router.push(this.fun.getUrl('dynamicList'))
        }
      })
    },
    // 获取详情
    getDetail(id) {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/dynadetails'
      const data = { id }
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
          console.log(data)
          this.detail = data
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
  box-sizing: border-box;
}
.supplier {
  padding-top: 40px;
  background: #fff;
}

.welcome {
  padding: 20px;
}

.title {
  margin-bottom: 0.625rem;
  line-height: 1.5625rem;
  font-size: 18px;
  color: #333333;
  font-weight: 500;
  text-align: left;
}
.container {
  text-align: left;
  position: relative;
  .avatar {
    width: 2.1875rem;
    height: 2.1875rem;
    border-radius: 50%;
  }
  .author {
    position: absolute;
    top: 0.125rem;
    left: 2.9375rem;
    font-size: 12px;
    color: #333;
  }
  .pub-time {
    position: absolute;
    top: 1.25rem;
    left: 2.9375rem;
    font-size: 10px;
    color: #999;
  }
  .content {
    padding: 1.375rem 0;
    /deep/ p {
      font-size: 14px;
      color: #333;
      line-height: 1.75rem;
    }
    /deep/ img {
      width: 21rem;
    }
  }
}
.btn {
  margin-bottom: 2.1875rem;
  width: 19.25rem;
  height: 2.5rem;
  background: #0579fc;
  border-radius: 0.25rem;
  border: none;
  color: #fff;
}
</style>

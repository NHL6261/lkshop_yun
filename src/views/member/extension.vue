<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="推荐列表"></c-title>
      <!-- <div style="height: 40px"></div> -->

      <div class="main">
        <div class="qrcode-wrap">
          <img :src="qrcode" alt="推广二维码" />
        </div>
        <h3 class="title">推荐记录</h3>
        <ul class="list" v-if="list && list.length">
          <li class="list-item" v-for="item in list" :key="item.uid">
            <img :src="item.avatar" alt="头像" />
            <span>{{ item.nickname }}</span>
            <span>{{ item.createtime }}</span>
          </li>
        </ul>
        <p class="no-list" v-else>暂无推广记录</p>
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
      qrcode: '',
      list: [
        // {
        //   uid: 1,
        //   mobile: '',
        //   nickname: '吃着火锅唱着歌啊',
        //   avatar:
        //     'http://thirdwx.qlogo.cn/mmopen/BP0pXbmpGCKpevOibXDQW0BFtSmWSayq6IBvhic5Jt5N9RNxliaSZRdib8MxFfsfvMdlic3aPfIOhXhpII37WiaQu9JAErHFeVZnva/132',
        //   create_time: '2020.12.12'
        // },
        // {
        //   uid: 1,
        //   mobile: '',
        //   nickname: '吃着火锅唱着歌啊',
        //   avatar:
        //     'http://thirdwx.qlogo.cn/mmopen/BP0pXbmpGCKpevOibXDQW0BFtSmWSayq6IBvhic5Jt5N9RNxliaSZRdib8MxFfsfvMdlic3aPfIOhXhpII37WiaQu9JAErHFeVZnva/132',
        //   create_time: '2020.12.12'
        // },
        // {
        //   uid: 1,
        //   mobile: '',
        //   nickname: '吃着火锅唱着歌啊',
        //   avatar:
        //     'http://thirdwx.qlogo.cn/mmopen/BP0pXbmpGCKpevOibXDQW0BFtSmWSayq6IBvhic5Jt5N9RNxliaSZRdib8MxFfsfvMdlic3aPfIOhXhpII37WiaQu9JAErHFeVZnva/132',
        //   create_time: '2020.12.12'
        // },
        // {
        //   uid: 1,
        //   mobile: '',
        //   nickname: '吃着火锅唱着歌啊',
        //   avatar:
        //     'http://thirdwx.qlogo.cn/mmopen/BP0pXbmpGCKpevOibXDQW0BFtSmWSayq6IBvhic5Jt5N9RNxliaSZRdib8MxFfsfvMdlic3aPfIOhXhpII37WiaQu9JAErHFeVZnva/132',
        //   create_time: '2020.12.12'
        // },
        // {
        //   uid: 1,
        //   mobile: '',
        //   nickname: '吃着火锅唱着歌啊',
        //   avatar:
        //     'http://thirdwx.qlogo.cn/mmopen/BP0pXbmpGCKpevOibXDQW0BFtSmWSayq6IBvhic5Jt5N9RNxliaSZRdib8MxFfsfvMdlic3aPfIOhXhpII37WiaQu9JAErHFeVZnva/132',
        //   create_time: '2020.12.12'
        // },
        // {
        //   uid: 1,
        //   mobile: '',
        //   nickname: '吃着火锅唱着歌啊',
        //   avatar:
        //     'http://thirdwx.qlogo.cn/mmopen/BP0pXbmpGCKpevOibXDQW0BFtSmWSayq6IBvhic5Jt5N9RNxliaSZRdib8MxFfsfvMdlic3aPfIOhXhpII37WiaQu9JAErHFeVZnva/132',
        //   create_time: '2020.12.12'
        // },
        // {
        //   uid: 1,
        //   mobile: '',
        //   nickname: '吃着火锅唱着歌啊',
        //   avatar:
        //     'http://thirdwx.qlogo.cn/mmopen/BP0pXbmpGCKpevOibXDQW0BFtSmWSayq6IBvhic5Jt5N9RNxliaSZRdib8MxFfsfvMdlic3aPfIOhXhpII37WiaQu9JAErHFeVZnva/132',
        //   create_time: '2020.12.12'
        // },
        // {
        //   uid: 1,
        //   mobile: '',
        //   nickname: '吃着火锅唱着歌啊',
        //   avatar:
        //     'http://thirdwx.qlogo.cn/mmopen/BP0pXbmpGCKpevOibXDQW0BFtSmWSayq6IBvhic5Jt5N9RNxliaSZRdib8MxFfsfvMdlic3aPfIOhXhpII37WiaQu9JAErHFeVZnva/132',
        //   create_time: '2020.12.12'
        // },
        // {
        //   uid: 1,
        //   mobile: '',
        //   nickname: '吃着火锅唱着歌啊',
        //   avatar:
        //     'http://thirdwx.qlogo.cn/mmopen/BP0pXbmpGCKpevOibXDQW0BFtSmWSayq6IBvhic5Jt5N9RNxliaSZRdib8MxFfsfvMdlic3aPfIOhXhpII37WiaQu9JAErHFeVZnva/132',
        //   create_time: '2020.12.12'
        // },
        // {
        //   uid: 1,
        //   mobile: '',
        //   nickname: '吃着火锅唱着歌啊',
        //   avatar:
        //     'http://thirdwx.qlogo.cn/mmopen/BP0pXbmpGCKpevOibXDQW0BFtSmWSayq6IBvhic5Jt5N9RNxliaSZRdib8MxFfsfvMdlic3aPfIOhXhpII37WiaQu9JAErHFeVZnva/132',
        //   create_time: '2020.12.12'
        // }
      ]
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
    },
    getMemberList() {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/memberlists'
      const uid = JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      axios({
        url,
        method: 'POST',
        data: { uid }
      }).then(res => {
        this.list = res.data.data
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
  min-height: 100%;
  background: #fff;
  box-sizing: border-box;
}
.supplier {
  padding-top: 40px;
}

.main {
  padding: 1.25rem;
}

.qrcode-wrap {
  img {
    width: 50%;
    height: 50%;
  }
}

.title {
  margin-top: 0.625rem;
  text-align: left;
  color: #333;
}

.list {
  color: #333;
  padding: .625rem 0;
  .list-item {
    display: flex;
    align-items: center;
    height: 3.125rem;
    img {
      margin: 0;
      width: 1.875rem;
      height: 1.875rem;
      border-radius: 50%;
    }
    span {
      &:nth-of-type(1) {
        flex: 1;
        text-align: left;
        text-indent: .625rem;
      }
      &:nth-of-type(2) {
        width: 6.25rem;
        text-align: right;
      }
    }
  }
}

.no-list {
  padding-top: 1.875rem;
  color: #ccc;
}
</style>

<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="商铺管理"></c-title>
      <!-- <div style="height:40px;"></div> -->

      <div class="main">
        <!--申请   -->
        <div class="welcome">
          <ul class="btn-list">
            <li class="btn-list-item">
              <button @click="toBaseInfo">
                <van-icon name="orders-o" />
                <span>基本信息</span>
              </button>
            </li>
            <li class="btn-list-item">
              <button  @click="toProductInformation">
                <van-icon name="send-gift-o" />
                <span>产品信息</span>
              </button>
            </li>
            <li class="btn-list-item">
              <button @click="toDynamicList">
                <van-icon name="edit" />
                <span>编辑动态</span>
              </button>
            </li>
            <li class="btn-list-item">
              <button @click="toRedPackets">
                <van-icon name="bullhorn-o" />
                <span>红包推广</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import cTitle from 'components/title'
export default {
  components: { cTitle },
  data(){
    return {
      uid:''
    }
  },
   activated(){
    this.uid = JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
  },
  methods: {
     toProductInformation(){
      console.log( this.uid)
      const data = {
        uid:this.uid
      }
     const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/storestatus'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res=>{
        console.log(res)
        if(res.data.result===0){//门店不存在
           this.$router.push(this.fun.getUrl('storeApply'))
        }else{//存在门店
           this.$router.push(this.fun.getUrl('storeManage'))
        }
      })
    },
    toBaseInfo() {
      this.$router.push(this.fun.getUrl('shopsInfo'))
    },
    // 跳转到红包
    toRedPackets() {
       this.$router.push(this.fun.getUrl('promotionRecord'))
      // this.$router.push(this.fun.getUrl('redPackets'))
    },
    // 跳转到动态列表
    toDynamicList() {
      this.$router.push(this.fun.getUrl('dynamicList'))
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

.btn-list {
  padding: 4.75rem 0;
  .btn-list-item {
    display: flex;
    justify-content: center;
    button {
      margin-bottom: 30px;
      width: 11.875rem;
      height: 2.875rem;
      outline: none;
      border: none;
      border: 1px solid #979797;
      border-radius: 6px;
      background: transparent;
      display: flex;
      justify-content: space-between;
      align-items: center;
      i {
        flex: 0 0 3.5rem;
        height: 1.75rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: 1px solid #D1D1D1;
      }
      span {
        flex: 1;
        height: 1.75rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      // &:nth-of-type(1) {
      //   i {
      //     background: url('../../../assets/images/member/member_a(70).png') no-repeat center;
      //     background-size: 1.25rem;
      //   }
      // }
      // &:nth-of-type(2) {
      //   i {
      //     background: url('../../../assets/images/member/') no-repeat center;
      //     background-size: 1.25rem;
      //   }
      // }
      // &:nth-of-type(3) {
      //   i {
      //     background: url('../../../assets/images/member/member_a(70).png') no-repeat center;
      //     background-size: 1.25rem;
      //   }
      // }
      // &:nth-of-type(4) {
      //   i {
      //     background: url('../../../assets/images/member/member_a(70).png') no-repeat center;
      //     background-size: 1.25rem;
      //   }
      // }
    }
  }
}

// .btn-list {
//   padding: 4.75rem 0;
//   .btn-list-item {
//       display: flex;
//       justify-content: center;
//     button {
//       width: 11.875rem;
//       height: 2.875rem;
//       outline: none;
//       border: none;
//       border: 1px solid #979797;
//       border-radius: 6px;
//       background: transparent;
//       padding: 0 2.625rem 0 1.125rem;
//       box-sizing: border-box;
//       display: flex;
//       line-height: 2.875rem;
//       margin-bottom: 1.875rem;
//       i {
//         flex: 0 0 3.5rem;
//         border-right: 0.02875rem solid #D1D1D1;
//       }
//       span {
//         flex: 1;
//       }
//     }
//   }
// }
</style>

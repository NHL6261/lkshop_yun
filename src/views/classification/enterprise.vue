<template>
  <div class="content">
    <ul class="leftList">
      <!-- <li> -->
      <li
        v-for="item in oneList"
        :key="item.id"
      >
        <div class="title"><span>-</span>
          <div><span>{{ item.name }}</span></div><span>-</span>
        </div>
        <ul>
          <li
            v-for="(oneItem, oneIndex) in item.children"
            :key="oneItem.id"
          >
            <div
              @click="checkoutOneList(oneItem, oneIndex,item)"
              class="twoName"
              :class="{ cur: overalOneIndex === oneItem.id }"
            >
              <span>{{ oneItem.name }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="rightList">
      <li
        v-for="item in rightList"
        :key="item.id"
      >
        <div class="rightTitle">
          <span>{{ item.name }}</span>
        </div>
        <ul class="rightFourList">
          <li
            class="fourList"
            v-for="threeItem in item.children"
            :key="threeItem.id"
          >
            <div
              @click="checkoutFourList(item, threeItem)"
              class="fourTitle"
              :class="{ fourCur: overalTowIndex === item.id && overalThreeIndex === threeItem.id }"
            >
              {{ threeItem.name }}
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
//企业分类
export default {
  name: 'people',
  data() {
    return {
      url: process.env,
      oneList: [],
      overalTowIndex: 11,
      overalOneIndex: 0,
      overalThreeIndex: 31,
      rightList: [],
      oneLeave: {},
      twoLevel: {}
    }
  },
  activated() {
    window.scrollTo(0,0);
    this.getCateList()
  },
  methods: {
    checkoutOneList(oneItem, oneIndex, oneLeave) {
      // this.towIndex = towId
      this.overalOneIndex = oneItem.id
      console.log(oneItem)
      this.rightList = oneItem.children
      this.oneLeave = oneLeave
      this.twoLevel = oneItem
    },
    checkoutFourList(twoLevel, threeLevel) {
      this.overalTowIndex = twoLevel.id
      this.overalThreeIndex = threeLevel.id
      if (this.$route.query.tag === 'enterpriseInfo') {
        this.$router.push(this.fun.getUrl('enterpriseInfo', { category: threeLevel }))
      } else if (this.$route.query.tag === 'listEnterprise') {
        let result = []
        result = result.concat({id:this.oneLeave.id,name:this.oneLeave.name}).concat({id:this.twoLevel.id,name:this.twoLevel.name}).concat( {id:twoLevel.id,name:twoLevel.name}).concat( {id:threeLevel.id,name:threeLevel.name})
        this.$router.push(this.fun.getUrl('listEnterprise','',{from:'classificationentErprise'}))
        window.localStorage.setItem('classificationentErprise',JSON.stringify(result))
      }
    },
    // 获取分类数据
    getCateList() {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/admin/catelists'
      const formData = {
        type: 1
      }
      axios({
        method: 'POST',
        url: url,
        data: formData
      }).then(res => {
        // 设置所有分类数据
        this.oneList = res.data.data
        console.log(222, this.oneList[0].children[0].id)
        // 初始化右侧数据
        this.rightList = this.oneList[0].children[0].children
        this.overalOneIndex = this.oneList[0].children[0].id
        this.oneLeave = this.oneList[0]
        this.twoLevel = this.oneList[0].children[0]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  // padding-bottom: 3.125rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  flex-direction: row;
  background-color: #fff;
  // height:auto;
  min-height: 100%;
  height: 100%;
  // padding-bottom: 0.9375rem;
}
.leftList {
  width: 6.625rem;
  background-color: #f8f8f8;
  height: 100%;
  overflow-y: auto;
  min-height: 100%;
}
.title {
  box-sizing: content-box;
  height: 2rem;
  font-size: 0.625rem;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #999999;
  line-height: 2rem;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.3rem 0.3125rem;
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1rem;
  }
}
.twoName {
  height: 3.125rem;
  font-size: 0.75rem;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #666666;
  line-height: 1.0625rem;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  span {
    padding: 0 0.3125rem;
  }
}
.cur {
  background-color: #fff;
  color: #0579fc;
  span {
    border-left: 0.125rem solid #0579fc;
  }
}
.rightList {
  padding: 0.8125rem 0.9rem 0 1rem;
  width: 14.5rem;
  box-sizing: content-box;
  height: 100%;
  overflow-y: auto;
}
.rightTitle {
  height: 2.5rem;
  font-size: 0.875rem;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 2.5rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}
.fourList {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.fourTitle {
  height: 1.75rem;
  background: #ffffff;
  border-radius: 0.3125rem;
  border: 0.125rem solid #f4f4f4;
  font-size: 0.625rem;
  font-family: Helvetica;
  color: #999999;
  padding: 0 0.625rem;
  line-height: 1.75rem;
  margin: 0 0.3125rem;
  margin-bottom: 0.625rem;
}
.fourCur {
  color: #0579fc;
  border-color: #a2ccfd;
  background-color: #e6f1fe;
}
.rightFourList {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>

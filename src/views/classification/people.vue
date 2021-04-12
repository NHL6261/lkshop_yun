<template>
  <div class="content">
    <ul class="leftList">
      <li>
        <ul>
          <li v-for="(oneItem, oneIndex) in oneList" :key="oneItem.id">
            <div
              @click="checkoutOneList(oneItem.id, oneIndex, oneItem)"
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
      <li v-for="item in rightList" :key="item.id">
        <div class="rightTitle">
          <span>{{ item.name }}</span>
        </div>
        <ul class="rightFourList">
          <li class="fourList" v-for="threeItem in item.children" :key="threeItem.id">
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
      oneLeave: {}
    }
  },
  activated() {
    window.scrollTo(0,0);
    this.getCateList()
  },
  methods: {
    checkoutOneList(oneId, oneIndex,oneItem) {
      // this.towIndex = towId
      this.overalOneIndex = oneId
      this.rightList = this.oneList[oneIndex].children
      this.oneLeave = oneItem
    },
    checkoutFourList(twoLevel, threeLevel) {
      this.overalTowIndex = twoLevel.id
      this.overalThreeIndex = threeLevel.id
      console.log(this.$route.query)
      if (this.$route.query.tag === 'strongManInfo') {
        this.$router.push(this.fun.getUrl('strongManInfo', { category: threeLevel }))
      } else if (this.$route.query.tag === 'listPeople') {
        let result = []
        result = result
          .concat({ name: this.oneLeave.name, id: this.oneLeave.id })
          .concat({ name: twoLevel.name, id: twoLevel.id })
          .concat({ name: threeLevel.name, id: threeLevel.id })
          console.log(result)
        this.$router.push(this.fun.getUrl('listPeople', '', { from: 'classificationentPeople' }))
        window.localStorage.setItem('classificationentPeople', JSON.stringify(result))
      } else if (this.$route.query.tag === 'strongManInfoNew') {
        this.$router.push(this.fun.getUrl('strongManInfoNew', { category: threeLevel }))
      }
    },
    // 获取分类数据
    getCateList() {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/admin/catelists'
      const formData = {
        type: 3
      }
      axios({
        method: 'POST',
        url: url,
        data: formData
      }).then(res => {
        // 设置所有分类数据
        this.oneList = res.data.data
        // 初始化右侧数据
        this.rightList = this.oneList[0].children
        this.oneLeave = this.oneList[0]
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
}
.leftList {
  width: 6.625rem;
  background-color: #f8f8f8;
  // height: 100%;
   height: 100%;
  overflow-y: auto;
  min-height: 100%;
}
.title {
  box-sizing: content-box;
  height: 1.875rem;
  font-size: 0.625rem;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #999999;
  line-height: 1.875rem;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 0.3125rem;
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
  min-height: 100%;
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

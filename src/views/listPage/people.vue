<template>
  <div class="content">
    <!-- <div class="classification">
      <ul @click="toCategory">
        <li v-for="item in classification" :key="item.id">{{ item.name }}</li>
      </ul>
    </div> -->
    <div class='serchTitle'>
      <div
        class='returnIcon'
        @click="returnHandle"
      >
        <van-icon
          size='1rem'
          name="arrow-left"
        />
      </div>
      <van-search
        class='serchInput'
        v-model="searchVal"
        placeholder="请输入搜索关键词"
      />
      <div
        class='serchBtn'
        @click="serchHandle"
      >搜索</div>
      <div
        class='classificationIcon'
        @click="toCategory"
      >
        <div></div>
      </div>
    </div>
    <div class="contentList">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          class="contentItem"
          v-for="(item,index) in recommendList"
          :key="index"
          @click="toDetail(item)"
        >
          <div
            v-if="parseFloat(item.redmoney) > 0"
            :class="{receive:item.receive_status !== 0}"
          >
            <!-- <div
              v-show="item.receive_status !== 0"
              class="isReceive"
            ></div> -->
            <p class="introduction">{{ item.qsntitle }}</p>
            <div class='nameAddress'>
              <span>{{item.qsn_name}}</span>{{ item.sqnadress }}
            </div>
            <!-- <div class='nameAddress'>
              <span class='itemName'>{{item.qsn_name}}</span>
              <span class="addressInfo"> {{ item.sqnadress }} </span>
            </div> -->
            <ul class="labelInfo">
              <li
                v-for="(labelItem, labelIndex) in item.catename"
                :key="labelIndex"
              >{{ labelItem }}</li>
            </ul>
            <ul class="photo">
              <li
                v-for="(photoItem, photoIndex) in item.texturl"
                :key="photoIndex"
              >
                <img
                  :src="photoItem"
                  alt=""
                />
              </li>
            </ul>
            <div class="progress">
              <div class="progressBox">
                <div
                  class="progressContent"
                  :style="'width:' + (((item.redmoneynum-item.receive)/item.redmoneynum)*100) + '%;'"
                ></div>
              </div>
              <div class="surplus">
                <span>已领{{ item.receive }}个</span>
                <span>剩余{{ item.surplus }}个</span>
              </div>

            </div>
            <div class='iconInfo'>
              <div>
                <van-icon
                  size='1.25rem'
                  name="eye"
                  color="#dbdbdb"
                />
                <span>{{item.browse}}</span>
              </div>
              <div>
                <van-icon
                  v-if='item.fabulousstatus===0'
                  size='1.25rem'
                  name="like"
                  color="#dbdbdb"
                />
                <van-icon
                  v-else
                  size='1.25rem'
                  name="like"
                  color="#f7173a"
                />
                <span>{{item.fabulous}}</span>
              </div>
              <div>
                <van-icon
                  size='1.25rem'
                  name="chat"
                  color="#dbdbdb"
                />
                <span>{{item.comment}}</span>
              </div>

              <div>
                <van-icon
                  v-if='item.followstatus===0'
                  size='1.25rem'
                  name="star"
                  color="#dbdbdb"
                />
                <van-icon
                  v-else
                  size='1.25rem'
                  name="star"
                  color="#f2bb13"
                />
                <span>{{item.follow}}</span>
              </div>

            </div>
          </div>
          <div v-else>
            <div class="notSet">
              <div class="notSetPhoto">
                <img
                  :src="item.texturl[0]"
                  alt=""
                />
              </div>
              <div class="noSetInfo">
                <div class="noSetintroduction">{{ item.qsntitle }}</div>
                <div class='noSetNameAddress'>
                  <span>{{item.qsn_name}}</span>{{ item.sqnadress }}
                </div>
                <ul class="noSetLabelInfo">
                  <li
                    v-for="(labelItem, labelIndex) in item.catename"
                    :key="labelIndex"
                  >{{ labelItem }}</li>
                </ul>
              </div>
            </div>
            <div class="progress noSetProgress">
              <div class="progressBox">
                <div
                  class="progressContent"
                  :style="'width:' + (((item.redmoneynum-item.receive)/item.redmoneynum)*100) + '%;'"
                ></div>
              </div>
              <div class="notSetSurplus">
                <span>未投放金额</span>
              </div>
            </div>
            <div class='iconInfo'>
              <div>
                <van-icon
                  size='1.25rem'
                  name="eye"
                  color="#dbdbdb"
                />
                <span>{{item.browse}}</span>
              </div>
              <div>
                <van-icon
                  v-if='item.fabulousstatus===0'
                  size='1.25rem'
                  name="like"
                  color="#dbdbdb"
                />
                <van-icon
                  v-else
                  size='1.25rem'
                  name="like"
                  color="#f7173a"
                />
                <span>{{item.fabulous}}</span>
              </div>
              <div>
                <van-icon
                  size='1.25rem'
                  name="chat"
                  color="#dbdbdb"
                />
                <span>{{item.comment}}</span>
              </div>

              <div>
                <van-icon
                  v-if='item.followstatus===0'
                  size='1.25rem'
                  name="star"
                  color="#dbdbdb"
                />
                <van-icon
                  v-else
                  size='1.25rem'
                  name="star"
                  color="#f2bb13"
                />
                <span>{{item.follow}}</span>
              </div>

            </div>
          </div>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import { Search } from 'vant'
export default {
  name: 'listEnterprise',
  data() {
    return {
      searchVal: '',
      classification: [{ id: 1, name: '全部' }],
      recommendList: [],
      page: 1,
      loading: false,
      finished: true,
      qsncategory: '',
      contentList: [
        {
          id: 1,
          qsntitle:
            '中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的,中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的',
          sqnadress: '海淀区 拣到互联技术有限公司',
          catename: ['科技', '技术', '互联网'],
          texturl: [
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png')
          ],
          receive: 90,
          surplus: 10,
          state: 1,
          isLaunch: true,
          redmoney: 100,
          receive_status: 0,
          redmoneynum: 100
        },
        {
          id: 2,
          qsntitle:
            '中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的,中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的',
          sqnadress: '海淀区 拣到互联技术有限公司',
          catename: ['科技', '技术', '互联网'],
          texturl: [
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png')
          ],
          receive: 60,
          surplus: 40,
          state: 0,
          isLaunch: true,
          redmoney: 200,
          receive_status: 1,
          redmoneynum: 100
        },
        {
          id: 0,
          qsntitle:
            '中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的,中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的',
          sqnadress: '海淀区 拣到互联技术有限公司',
          catename: ['科技', '技术', '互联网'],
          texturl: [
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png')
          ],
          receive: 30,
          surplus: 70,
          state: 0,
          isLaunch: false,
          redmoney: 0,
          receive_status: 1,
          redmoneynum: 100
        }
      ]
    }
  },
  activated() {
    this.finished = true
    window.scrollTo(0, 0)
    this.page = 0
    this.recommendList = []
    console.log('active', this.page)
    this.judgeClassification()
  },
  methods: {
    serchHandle() {
      this.recommendList = []
      this.page = 0
      this.getList()
    },
    returnHandle() {
      //返回
      this.$router.go(-1)
    },
    judgeClassification() {
      this.page = 0
      if (this.$route.query.from === 'classificationentPeople') {
        this.classification =
          JSON.parse(window.localStorage.getItem('classificationentPeople')).length === 0
            ? [{ id: 1, name: '全部' }]
            : JSON.parse(window.localStorage.getItem('classificationentPeople'))
        this.qsncategory = this.classification[this.classification.length - 1].id
      } else {
        this.classification = [{ id: 1, name: '全部' }]
        this.qsncategory = ''
      }
      this.onLoad()
      console.log('page', this.page)
    },
    toCategory() {
      this.$router.push(this.fun.getUrl('classificationPeople', '', { tag: 'listPeople' }))
    },
    toDetail(item) {
      this.$router.push(this.fun.getUrl('detailPeople', '', { peopleId: item.id, receive_status: item.receive_status }))
    },
    changeClassification() {
      this.$router.push(this.fun.getUrl('enterprise'))
    },
    onLoad() {
      this.page++
      this.getList()
    },
    getList() {
      const data = {
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid,
        page: this.page,
        qsntype: 3,
        qsncategory: this.qsncategory,
        shop_name: this.searchVal
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/listsenterprise'
      return axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        console.log('res', res)
        if (res.data.result === 1) {
          if (res.data.data.length === 0) {
            this.finished = true
            return false
          } else {
            res.data.data.forEach(item => {
              this.recommendList.push(item)
            })
            this.loading = false
            this.finished = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.content {
  // height: 100%;
  // background-color: #fff;
}
.classification {
  height: 1.875rem;
  background-color: #f8f8f8;
  ul {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
  }
  li {
    height: 1.875rem;
    font-size: 0.75rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #666666;
    line-height: 1.875rem;
    &:not(:last-child) {
      &::after {
        content: '/';
      }
    }
  }
  div {
    height: 1.875rem;
    font-size: 0.75rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #666666;
    line-height: 1.875rem;
  }
}
.serchTitle {
  padding: 0.625rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  background-color: #fff;
}
.returnIcon {
  margin-top: 0.5313rem;
  width: 1.5rem;
}
.serchInput {
  width: 16rem;
  height: 1.875rem;
  // background: #f8f8f8;
  border-radius: 0.3125rem;
}
.serchBtn {
  box-sizing: content-box;
  width: 1.75rem;
  height: 1.875rem;
  font-size: 0.875rem;
  font-family: SourceHanSansCN-Normal, SourceHanSansCN;
  font-weight: 400;
  color: #0579fc;
  line-height: 1.875rem;
  text-align: center;
  padding: 0 0.1rem;
}
.classificationIcon {
  margin-left: 0.5rem;
  box-sizing: content-box;
  width: 1.2rem;
  height: 1rem;
  padding: 0 0.1rem;
  padding-top: 0.5rem;
  div {
    background-image: url(../../assets/newImg/list/serchIcon.png);
    height: 0.875rem;
    width: 100%;
  }
}
/deep/.van-cell::after {
  border-bottom: none !important;
}
.contentList {
  // background-color: #fff;

  /deep/.contentItem {
    // border-bottom: 1px solid #e4e4e4;
    overflow: hidden;
    position: relative;
    margin-bottom: 0.625rem;
    padding: 0 1.5rem !important;
  }
  /deep/.van-cell {
    padding: 0;
  }
  .isReceive {
    width: 5rem;
    height: 5rem;
    background-image: url(../../assets/newImg/index/receive.png);
    position: absolute;
    right: 0;
    top: 3.75rem;
    background-size: 100% 100%;
  }
  .introduction {
    box-sizing: content-box;
    // height: 2.75rem;
    // height: 1.375rem;
    font-size: 1rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #333333;
    line-height: 1.375rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    // padding: 0.5rem 0;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding-bottom: 0.5rem;
    border-bottom: 1px dashed #e4e4e4;
  }
  .nameAddress {
    // display: flex;
    // flex-wrap: wrap;
    // flex-direction: row;
    // justify-content: flex-start;
    //  height: 1.25rem;
    font-size: 0.875rem;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #0579fc !important;
    line-height: 1.25rem;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    span {
      display: inline-block;
      margin-right: 1rem;
      color: #333;
      font-weight: bold;
    }
  }
  .receive .nameAddress {
    color: #666666;
    span {
      color: #666666;
    }
  }
  .addressInfo {
    display: -webkit-box;
    // height: 1.25rem;
    overflow: hidden;
    vertical-align: middle;
    // padding: 0.375rem 0;
    img {
      // margin-top:0.375rem;
      width: 0.75rem;
      height: 0.875rem;
    }
    span {
      height: 1.25rem;
      font-size: 0.875rem;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #333333;
      line-height: 1.25rem;
      // margin-left: 0.375rem;
    }
  }
  .labelInfo {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    // padding: 0.5rem 0;
    padding-left: 1.125rem;
    li {
      height: 0.9rem;
      font-size: 0.625rem;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #0579fc;
      line-height: 0.9rem;
      border-radius: 0.1875rem;
      border: 0.0313rem solid #0579fc;
      box-sizing: content-box;
      padding: 0 0.3125rem;
      margin-right: 0.625rem;
      margin-bottom: 0.3125rem;
    }
  }
  .photo {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-start;
    li {
      margin-right: 0.5rem;
      width: 6.5625rem;
      height: 6.5625rem;
      // margin-right:0.625rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    li:nth-of-type(3) {
      margin-right: 0;
    }
  }
  .progress {
    margin-top: 0.5rem;
  }
  .progressBox {
    height: 0.4rem;
    background-color: #fbeded;
    border-radius: 0.25rem;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
    .progressContent {
      height: 0.4rem;
      background-color: #d9021b;
      //  width:30%;
      border-radius: 0.25rem;
    }
  }
  .surplus {
    box-sizing: content-box;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    height: 0.875rem;
    font-size: 0.625rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #666666;
    line-height: 0.875rem;
  }
}
.notSet {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: flex-start;
  .notSetPhoto {
    margin-top: 0.5rem;
    width: 5.625rem;
    height: 5.625rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .noSetInfo {
    width: 14.1rem;
    margin-left: 0.625rem;
  }
  .noSetintroduction {
    box-sizing: content-box;
    height: 2.75rem;
    font-size: 1rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #333333;
    line-height: 1.375rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    // padding: 0.5rem 0;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .noSetItemName {
    height: 1.25rem;
    font-size: 0.875rem;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #666666;
    line-height: 1.25rem;
  }
  .noSetAddressInfo {
    display: -webkit-box;
    // height: 1.25rem;
    overflow: hidden;
    vertical-align: middle;
    // padding: 0.375rem 0;
    img {
      // margin-top:0.375rem;
      width: 0.75rem;
      height: 0.875rem;
    }
    span {
      height: 1.25rem;
      font-size: 0.875rem;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #333333;
      line-height: 1.25rem;
      // margin-left: 0.375rem;
    }
  }
  .noSetNameAddress {
    font-size: 0.875rem;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #0579fc !important;
    line-height: 1.25rem;
    span {
      display: inline-block;
      margin-right: 1rem;
      color: #333;
      font-weight: bold;
    }
  }
  .noSetLabelInfo {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    // padding: 0.5rem 0;
    padding-left: 1.125rem;
    li {
      height: 0.9rem;
      font-size: 0.625rem;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #0579fc;
      line-height: 0.9rem;
      border-radius: 0.1875rem;
      border: 0.0313rem solid #0579fc;
      box-sizing: content-box;
      padding: 0 0.3125rem;
      margin-right: 0.625rem;
      margin-bottom: 0.3125rem;
    }
  }
}
.noSetProgress .progressBox .progressContent {
  background-color: #f8f8f8;
}
.notSetSurplus {
  box-sizing: content-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: flex-end;
  height: 0.875rem;
  font-size: 0.625rem;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #666666;
  line-height: 0.875rem;
}
.iconInfo {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-between;
  vertical-align: middle;
  overflow: hidden;
  div {
    vertical-align: middle;
    line-height: 1.25rem;
    overflow: hidden;
    width: 25%;
    text-align: center;
  }
  span {
    font-size: 1rem;
    line-height: 1.25rem;
    display: inline-block;
    margin: 0 0.3125rem;
    vertical-align: 3px;
  }
}
</style>

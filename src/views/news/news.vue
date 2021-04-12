<template>
  <div class='content'>
    <van-badge
      v-if='num'
      class='newsNum'
      :content="num"
    />
    <van-tabs
      v-model="active"
      color="#0579fc"
      @change="changeTab(active)"
      swipeable
    >
      <van-tab title="关注">
        <van-list
        class='followListBg'
          v-model="followLoading"
          :finished="followFinished"
          finished-text="没有更多了"
          @load="followOnLoad"
        >
          <van-cell
            v-for="followItem in followList"
            :key="followItem.id"
            @click="tofollowDetailHandle(followItem)"
          >
            <div class='followItem'>
              <div class='photo'><img
                  :src="followItem.topurl"
                  alt=""
                ></div>
              <div class='followInfo'>
                <div class='followName'>{{followItem.qsn_name}}</div>
                <div class='followAddress'>
                  <span>
                    <van-icon
                      color="#999"
                      class="addressIcon"
                      name="location"
                    />{{followItem.sqnadress}}
                  </span>
                </div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </van-tab>
      <van-tab title="通知">
        <div class='contentList'>
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :offset='offset'
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
                <p class="introduction">{{ item.qsntitle }}</p>
                <div class='nameAddress'>
                  <span>{{item.qsn_name}}</span>{{ item.sqnadress }}
                </div>
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
      </van-tab>
    </van-tabs>
  </div>

</template>

<script>
import { Tab, Tabs, List, Badge } from 'vant'
export default {
  name: 'news',
  data() {
    return {
      lease_order: [], // 租凭订单数量数组
      lease_order_one: {},
      lease_order_two: {},
      lease_order_three: {},
      lease_order_four: {},
      active: 0,
      num: 0,
      uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid,
      followLoading: false,
      followFinished: false,
      followPage: 1,
      followList: [],
      page: 1,
      loading: false,
      finished: true,
      recommendList: []
    }
  },
  activated() {
    this.active = 0
    window.scrollTo(0, 0)
    this.getMemberData()
    this.getFindNum()
    this.getFollowList()
  },
  methods: {
    changeTab(index) {
      if (index === 1) {
        this.getList()
      }
    },
    getList() {
      const currentAddress = JSON.parse(localStorage.getItem('currentAddress'))
      const data = {
        uid: this.uid,
        page: this.page,
        citycode: currentAddress.citycode,
        addcode: currentAddress.adcode,
        latitude: currentAddress.lat,
        longitude: currentAddress.lng
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/filists'
      return axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        console.log('res', res)
        console.log('finished', this.finished)
        if (res.data.result === 1) {
          this.getFindNum()
          if (res.data.data.length !== 0) {
            res.data.data.forEach(item => {
              this.recommendList.push(item)
            })
            this.loading = false
            this.finished = false
          } else {
            this.finished = true
          }
        }
      })
    },
    onLoad() {
      this.page++
      this.getList()
    },
    toDetail(obj) {
      if (obj.qsntype === 1) {
        this.$router.push(this.fun.getUrl('detailEnterprise', '', { enterpriseId: obj.id, receive_status: 1 }))
      } else if (obj.qsntype === 2) {
        this.$router.push(this.fun.getUrl('detailShop', '', { shopId: obj.id, receive_status: 1 }))
      } else if (obj.qsntype === 3) {
        this.$router.push(this.fun.getUrl('detailPeople', '', { peopleId: obj.id, receive_status: 1 }))
      }
    },
    tofollowDetailHandle(obj) {
      if (obj.qsntype === 1) {
        this.$router.push(this.fun.getUrl('detailEnterprise', '', { enterpriseId: obj.sid, receive_status: 1 }))
      } else if (obj.qsntype === 2) {
        this.$router.push(this.fun.getUrl('detailShop', '', { shopId: obj.sid, receive_status: 1 }))
      } else if (obj.qsntype === 3) {
        this.$router.push(this.fun.getUrl('detailPeople', '', { peopleId: obj.sid, receive_status: 1 }))
      }
    },
    followOnLoad() {
      this.followPage++
      this.getFollowList()
    },
    getFollowList() {
      const data = {
        uid: this.uid,
        page: this.followPage
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/followlist'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        console.log(res)
        if (res.data.result === 1) {
          if (res.data.data.length !== 0) {
            res.data.data.forEach(item => {
              this.followList.push(item)
            })
            this.followLoading = false
            this.followFinished = false
          } else {
            this.followFinished = true
          }
        } else {
          // this.num = 0
        }
      })
    },
    getFindNum() {
      const currentAddress = JSON.parse(localStorage.getItem('currentAddress'))
      const data = {
        uid: this.uid,
        citycode: currentAddress.citycode,
        addcode: currentAddress.adcode,
        latitude: currentAddress.lat,
        longitude: currentAddress.lng
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/findlistsnum'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        console.log(res)
        if (res.data.result === 1) {
          this.num = res.data.data
        } else {
          this.num = 0
        }
      })
    },
    getMemberData() {
      $http
        .post('member.member.member-data', { v: 2 }, ' ')
        .then(
          response => {
            if (response.result === 1) {
              this.newTemplate(response.data.designer)
              this.getMemberInfo(response.data.member, response.data.order, response.data.plugins)

              this.lease_order = response.data.order.lease_order
              if (!this.fun.isTextEmpty(this.lease_order)) {
                this.lease_order.map(item => {
                  if (item.status == '0') {
                    this.lease_order_one = item
                  } else if (item.status == '1') {
                    this.lease_order_two = item
                  } else if (item.status == '2') {
                    this.lease_order_three = item
                  } else if (item.status == '3') {
                    this.lease_order_four = item
                  }
                })
              }

              if (!this.fun.isTextEmpty(response.data.member.yz_member)) {
                this.custom_value = response.data.member.yz_member.custom_value
                this.getMemberCustom(
                  this.custom_value,
                  response.data.member.yz_member.validity,
                  response.data.setting.custom
                ) // 获取自定义数据
              }
              this.wechat_login_mode = response.data.setting.wechat_login_mode
              this.getEnablePlugin(response.data.plugins)
              this.getStroeWithdraw(response.data.plugins.is_open)
              this.getExtension(response.data.relation)
              this.getMemberGrade(response.data.setting.level)
            } else {
              Toast(response.msg)
              this.template = '01'
              require('@/assets/css/member/02.scss')
            }
          },
          response => {
            console.log(response.msg)
            require('@/assets/css/member/02.scss')
          }
        )
        .catch(err => {
          console.error(err)
          require('@/assets/css/member/02.scss')
        })
    }
  },
  mounted() {
    console.log('测试',this.uid)
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.followListBg{
  background-color: #fff;
}
/deep/.van-tabs__nav--line {
  justify-content: center;
}
/deep/.van-tab {
  width: 2rem;
  flex: 0.1;
  span {
    display: inline-block;
    width: 2rem;
    text-align: center;
  }
}
/deep/.van-tabs__content {
  // padding-top: 1.3125rem;
}
.content {
  position: relative;
  // background-color: #fff;
  padding-bottom: 3.125rem;
}
.newsNum {
  position: absolute;
  top: 0.2rem;
  left: 13.5rem;
  z-index: 999;
}
/deep/.van-cell {
  padding: 0;
  margin-bottom: 0.9375rem;
}
/deep/.van-cell::after {
  border-bottom: none !important;
}
.followItem {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 1.25rem;
  .photo {
    width: 3.125rem;
    height: 3.125rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .followInfo {
    width: 17.8125rem;
    padding-left: 0.625rem;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 0.8125rem;
  }
  .followName {
    height: 1.375rem;
    font-size: 1rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #333333;
    line-height: 1.375rem;
  }
  .addressIcon {
    margin-right: 5px;
  }
  .followAddress {
    height: 1.25rem;
    font-size: 0.875rem;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #666666;
    line-height: 1.25rem;
    margin-top: 0.2rem;
    span {
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
  }
}
/deep/.van-cell::after {
  border-bottom: none !important;
}
.contentList {
  // background-color: #f9fafb;

  /deep/ .contentItem {
    // border-bottom: 1px solid #e4e4e4;
    overflow: hidden;
    position: relative;
    padding: 0 1.5rem;
    background-color: #fff;
    margin-bottom: 0.625rem;
  }
  .receive {
    opacity: 0.8;
    .progress {
      opacity: 0.8;
    }
    .photo {
      opacity: 1;
    }
  }
  .isReceive {
    width: 5rem;
    height: 5rem;
    background-image: url(../../assets/newImg/index/receive.png);
    background-size: 100% 100%;
    position: absolute;
    right: 0;
    top: 3.75rem;
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
  .receive .introduction {
    color: #666666;
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
  .receive .nameAddress {
    color: #666666;
    span {
      color: #666666;
    }
  }
  .itemName {
    height: 1.25rem;
    font-size: 0.875rem;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #666666;
    line-height: 1.25rem;
  }
  .addressInfo {
    height: 1.25rem;
    font-size: 0.875rem;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
    line-height: 1.25rem;
  }
  .labelInfo {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    // padding: 0.5rem 0;
    padding-left: 0;
    li {
      height: 0.9rem;
      font-size: 0.625rem;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #666666;
      line-height: 0.9rem;
      border-radius: 0.1875rem;
      border: 2px solid #999999;
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
    vertical-align: 4px;
  }
}
.notSet {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-between;
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
  .noSetNameAddress {
    font-size: 0.875rem;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #666;
    line-height: 1.25rem;
    span {
      display: inline-block;
      margin-right: 1rem;
      color: #333;
      font-weight: bold;
    }
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
  .noSetLabelInfo {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    // padding: 0.5rem 0;
    padding-left: 0;
    li {
      height: 0.9rem;
      font-size: 0.625rem;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #666666;
      line-height: 0.9rem;
      border-radius: 0.1875rem;
      border: 2px solid #999999;
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
</style>

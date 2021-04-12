<template>
  <div class="content">
    <van-tabs
      @change="changeTab(active)"
      v-model="active"
      color="#0579fc"
      swipeable
    >
      <van-tab
        v-for="item in labelList"
        :key="item.id"
        :title="item.title"
      >
        <div class="findList">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :offset="offset"
            @load="onLoad"
          >
            <van-cell
              v-for="findItem in findList"
              :key="findItem.id"
              @click="toDetailHandle(findItem.id)"
            >
              <div class="findItem">
                <div class='userInfo'>
                  <div class='userPhoto'><img
                      :src="findItem.logourl"
                      alt=""
                    ></div>
                  <div class='userName'>
                    <div>{{findItem.qsn_name}}</div>
                    <span>{{findItem.createtime}}</span>
                  </div>
                </div>
                <p class="introduction">{{ findItem.content }}</p>
                <div class="address">
                  <van-icon
                    color="#999"
                    class="addressIcon"
                    name="location"
                  />{{ findItem.sqnadress }}
                </div>
                <!-- <div class="itemType">{{ findItem.typename }}</div> -->
                <ul class="photo">
                  <li
                    v-for="(photoItem, photoIndex) in findItem.texturl"
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
                      :style="
                        'width:' + ((findItem.redmoneynum - findItem.receive) / findItem.redmoneynum) * 100 + '%;'
                      "
                    ></div>
                  </div>
                  <div class="surplus">
                    <span>已领{{ findItem.receive }}个</span>
                    <span>剩余{{ findItem.surplus }}个</span>
                  </div>
                </div>
                <div class='iconInfo'>
                  <div>
                    <van-icon
                      size='1.25rem'
                      name="eye"
                      color="#dbdbdb"
                    />
                    <span>{{findItem.browse}}</span>
                  </div>
                  <div>
                    <van-icon
                      v-if='findItem.fabulousstatus===0'
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
                    <span>{{findItem.fabulous}}</span>
                  </div>
                  <div>
                    <van-icon
                      size='1.25rem'
                      name="chat"
                      color="#dbdbdb"
                    />
                    <span>{{findItem.comment}}</span>
                  </div>

                  <div>
                    <van-icon
                      v-if='findItem.followstatus===0'
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
                    <span>{{findItem.follow}}</span>
                  </div>

                </div>
                <div class="toType">
                  <div class="typeName">{{ findItem.typename }}</div>
                  <div
                    class="typeNum"
                    @click.stop="toTypeHandle(findItem.type)"
                  ><span>{{ findItem.typenum }}条最新发布</span>
                    <van-icon name="arrow" />
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
    <div
      class='addBtn'
      v-if='showAdd'
      @click="toFindAdd"
    >
      <van-icon
        class='addIcon'
        size='1.3125rem'
        color='#fff'
        name="plus"
      />
    </div>
  </div>
</template>

<script>
//发现列表
import { Tab, Tabs, List } from 'vant'
export default {
  name: 'find',
  data() {
    return {
      // 从新获取的uid 倪更改 time: 2021/4/8
      uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid,
      // uid: window.localStorage.getItem('uid'),
      page: 1,
      offset: 500,
      finished: true,
      loading: false,
      active: 0,
      labelList: [
        {
          title: '全部',
          id: 0
        },
        {
          title: '企业采购',
          id: 1
        },
        {
          title: '企业招商',
          id: 2
        },
        {
          title: '提问求助',
          id: 3
        },
        {
          title: '介绍推荐',
          id: 4
        },
        {
          title: '本地生活',
          id: 5
        },
        {
          title: '个人需求',
          id: 6
        }
      ],
      findList: [],
      showAdd: false
    }
  },
  activated() {
    this.page = 0
    this.findList = []
    this.getMemberData()
    this.isShowAdd()
    this.onLoad()
  },
  deactivated() {
    this.findList = []
  },
  methods: {
    toFindAdd() {
      this.$router.push(this.fun.getUrl('findAdd'))
    },
    toDetailHandle(id) {
      this.$router.push(this.fun.getUrl('findDetail', '', { findId: id }))
    },
    isShowAdd() {
      const data = {
        uid: this.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/shoufind'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          this.showAdd = true
        } else {
          this.showAdd = false
        }
      })
    },
    toTypeHandle(type) {
      console.log('点击')
      this.active = type
      this.findList = []
      this.page = 1
      this.getList()
    },
    getList() {
      const data = {
        type: this.active,
        uid: this.uid,
        page: this.page
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/findlists'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          if (res.data.data.length !== 0) {
            res.data.data.forEach(item => {
              this.findList.push(item)
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
      //懒加载
      this.page++
      this.getList()
    },
    changeTab(index) {
      this.findList = []
      console.log(index)
      this.page = 1
      this.getList()
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
    },
    newTemplate(data) {
      // $http.get("member.member-designer.index").then(
      //   response => {
      //     if (response.result === 1) {
      this.designer = data.data
      this.showDiy = []
      this.designer.map((item, index, key) => {
        if (item.temp === 'showdiyform') {
          this.showDiy.push(item)
        }
      })
      for (let i in this.designer) {
        this.designer[i].temp = 'show' + this.designer[i].temp
        if (this.designer[i].temp === 'showlocation' || this.designer[i].temp === 'showstore') {
          this.isLocation = true
        }
      }
      window.localStorage.setItem('yzdesigner', JSON.stringify(this.designer))
      this.$store.commit('membertempIndex', data)
      this.designerStatus = data.status
      window.yzdesignerStatus = this.designerStatus
      // this.getMemberData();
      //     } else {
      //     }
      //   },
      //   response => {
      //     console.log(response.msg);
      //   }
      // );
    }
  },
  mounted(){
    // console.log('当前的uid:', )
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.content {
  width: 100%;
}
/deep/.van-tabs__wrap {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
/deep/.van-tabs__content {
  padding-top: 44px;
}
/deep/.van-cell::after {
  border-bottom: none;
}
/deep/.van-cell {
  margin-bottom: 0.625rem;
}
.findItem {
  .userInfo {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-start;
    .userPhoto {
      width: 2.375rem;
      height: 2.375rem;
      overflow: hidden;
      border-radius: 50%;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .userName {
      margin-left: 0.5625rem;
      div {
        height: 1.0625rem;
        font-size: 0.75rem;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #333333;
        line-height: 1.0625rem;
      }
      span {
        display: block;
        height: 0.875rem;
        font-size: 0.625rem;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #999999;
        line-height: 0.875rem;
        margin-top: 5px;
      }
    }
  }
  .introduction {
    box-sizing: content-box;
    // height: 2.75rem;
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
    // border-bottom: 1px dashed #e4e4e4;
  }
  .address {
    // height: 1.25rem;
    font-size: 0.875rem;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #0579fc;
    line-height: 1.25rem;
  }
  .addressIcon {
    margin-right: 5px;
  }
  .itemType {
    width: 3.7875rem;
    height: 1.125rem;
    background: #cde4fe;
    border-radius: 0.1875rem;
    // opacity: 0.2;
    font-size: 0.625rem;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #0579fc;
    line-height: 1.125rem;
    padding: 0 0.3125rem;
    margin-top: 0.4688rem;
    text-align: center;
  }
  .photo {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 16px;
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
  .iconInfo {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-end;
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
  .toType {
    width: 20.9375rem;
    height: 1.875rem;
    background: #f8f8f8;
    border-radius: 6px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    font-size: 0.75rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #999999;
    line-height: 1.875rem;
    padding: 0 0.625rem;
    span {
      vertical-align: 2px;
    }
    .typeName {
      color: #0579fc;
    }
  }
}
.addBtn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  position: fixed;
  right: 0.9375rem;
  top: 31.25rem;
  font-size: 1.5rem;
  line-height: 2.5rem;
  background-image: linear-gradient(to bottom right, #02b3fe, #057cfd);
  overflow: hidden;
  .addIcon {
    margin-top: 0.6rem;
  }
}
</style>

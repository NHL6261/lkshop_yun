<template>
  <div class="content">
    <div v-if="isReceive" class="red">
      <div class="redDetail">
        <div v-if="!showRed">
          <!-- <div class='redTop'></div> -->
          <!-- <mt-progress
            :value="val"
            :bar-height="10"
          ></mt-progress> -->
          <van-circle
            stroke-width="60"
            color="#f63a39"
            class="progress"
            v-model="rate"
            :rate="val"
            size="4.75rem"
            layer-color="#ebedf0"
          />
        </div>
      </div>
    </div>
    <div class="redSuccess" v-if="showRed">
      <img :src="redGif" alt="" />
      <div @click="closeRed" class="closeIcon"><van-icon  color="#fff" name="cross" size="1rem" /></div>
      <div class="money" v-show="delay">已领取{{ money }}元</div>
    </div>
    <div class="swiper">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, index) in content.topurl" :key="index"><img :src="item" alt="" /></van-swipe-item>
      </van-swipe>
    </div>
    <div class="logo"><img :src="content.logourl" alt="" /></div>
    <div class="contentInfo">
      <div class="title">
        <h3>
          <strong
            >{{ content.qsn_name }}
            <!-- <div><span></span></div> -->
          </strong>
        </h3>
      </div>
      <div class="classification">
        <div>
          <span>行业：</span>
          <span>{{ content.catename }}</span>
        </div>
      </div>
      <div class="lableList">
        <ul>
          <li
            @click="cheangeLabel(index)"
            v-for="(item, index) in lableList"
            :key="index"
            v-show="item.isShow"
            :class="{ cur: labelIndex === index }"
          >
            <span>{{ item.name }}</span>
            <div></div>
          </li>
        </ul>
      </div>
      <div class="detail" v-show="labelIndex === 0">
        <!-- <div class="detailTitle">{{ content.qsn_name }}</div> -->
        <p>{{ content.qsntext }}</p>
        <div class="demo" v-if="content.qsnvideo !== ''">
          <video-player
            class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :playsinline="true"
            :options="playerOptions"
          >
          </video-player>
        </div>
        <div class="detailPic" v-for="(item, index) in content.texturl" :key="index"><img :src="item" alt="" /></div>
      </div>
      <div class="dynamic" v-show="labelIndex === 2">
        <van-list v-model="dynamicLoading" :finished="dynamicFinished" finished-text="没有更多了" @load="dynamicOnLoad">
          <van-cell v-for="item in dynamicList" :key="item.id">
            <div class="dynamic-item" @click="toPreview(item)">
              <div class="dynamic-wrap">
                <img class="dynamic-img" :src="item.img" alt="封面图" />
                <div class="dynamic-info">
                  <p class="dinamic-title">{{ item.title }}</p>
                  <p class="dinamic-pub-time">{{ item.create_time }}</p>
                </div>
              </div>
            </div>
          </van-cell>
        </van-list>
      </div>
      <div class="aboutUs" v-show="labelIndex === 3">
        <ul>
          <li>
            <span>企业地址</span>
            <strong>{{ content.sqnadress }}</strong>
          </li>
          <li>
            <span>企业电话</span>
            <em>{{ content.qsnphone }}</em>
          </li>
        </ul>
      </div>
    </div>
    <div class="operationBtn">
      <div @click="likeHandle">
        <van-icon v-if="content.fabulousstatus === 0" size="2.2rem" name="like" color="#dbdbdb" />
        <van-icon v-else size="2.2rem" name="like" color="#f7173a" />
        <span>{{ content.fabulous }}</span>
      </div>
      <div @click="showCommentHandle">
        <van-icon size="2.2rem" name="chat" color="#dbdbdb" />
        <span>{{ content.comment }}</span>
      </div>
      <div @click="followHandle">
        <van-icon v-if="content.followstatus === 0" size="2.2rem" name="star" color="#dbdbdb" />
        <van-icon v-else size="2.2rem" name="star" color="#f2bb13" />
        <span>{{ content.follow }}</span>
      </div>
    </div>
    <van-action-sheet v-model="showComment" :title="commentTitle">
      <div class="commentContent" @click.stop="clearReply">
        <div class="commentList">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="item in commentList" :key="item.id">
              <div class="commentListItem">
                <div class="commenAavatar"><img :src="item.avatar" alt="头像" style="width: 100%; height: 100%" /></div>
                <div class="commentItemContent">
                  <div class="commentUserName">{{ item.nickname }}</div>
                  <p class="commentItem">
                    {{ item.content }}
                    <strong>
                      <span>{{ item.create_Time }}</span>
                      <span @click.stop="replyCommentHandle(item)">回复</span>
                    </strong>
                  </p>
                </div>
              </div>
              <ul class="commentChildren">
                <li v-for="commentChild in item.children" :key="commentChild.id">
                  <div class="commenAavatar">
                    <img :src="commentChild.avatar" alt="头像" style="width: 100%; height: 100%" />
                  </div>
                  <div class="commentItemContent">
                    <div class="commentUserName">{{ commentChild.nickname }}</div>
                    <p class="commentItem">
                      {{ commentChild.content }}
                      <strong>
                        <span>{{ item.create_Time }}</span>
                      </strong>
                    </p>
                  </div>
                </li>
              </ul>
            </van-cell>
          </van-list>
        </div>
        <div class="submitComment">
          <van-cell-group>
            <van-field
              ref="commentValue"
              @click.stop="nothHandle"
              v-model="commentValue"
              :placeholder="commentPlaceholder"
            ></van-field>
          </van-cell-group>
          <van-button @click.stop="submitComment" size="small" plain>发送</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Toast, Circle, ActionSheet } from 'vant'
export default {
  data() {
    return {
      dynamicLoading: false,
      dynamicFinished: false,
      dynamicList: [],
      dynamicPage: 1,
      loading: false,
      finished: false,
      commentPage: 1,
      commentValue: '',
      commentNum: 0,
      showComment: false,
      rate: 100,
      lableList: [
        {
          name: '企业信息',
          isShow: true
        },
        {
          name: '产品信息',
          isShow: true
        },
        {
          name: '企业动态',
          isShow: true
        },
        {
          name: '联系我们',
          isShow: true
        }
      ],
      labelIndex: 0,
      content: {
        swipeList: [
          { url: require('../../assets/newImg/detail/swipeItem.png') },
          { url: require('../../assets/newImg/detail/swipeItem.png') },
          { url: require('../../assets/newImg/detail/swipeItem.png') },
          { url: require('../../assets/newImg/detail/swipeItem.png') }
        ],
        logo: require('../../assets/newImg/detail/logo.png'),
        title: '北京拣到互联技术有限公司',
        classification: {
          one: '一级分类',
          two: '二级分类',
          three: '三级分类',
          four: '四级分类'
        }
      },
      val: 0,
      timer: '',
      timeoutOnoff: '',
      showRed: false,
      uid: '',
      receive_status: '',
      isReceive: false,
      money: '1.23',
      delay: false,
      timeStamp: new Date().getTime().toString(),
      redGif: require('./img/red6.gif'),
      playerOptions: {
        //播放速度
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        //如果true,浏览器准备好时开始回放。
        autoplay: false,
        // 默认情况下将会消除任何音频。
        muted: false,
        // 导致视频一结束就重新开始。
        loop: false,
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        preload: 'auto',
        language: 'zh-CN',
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        aspectRatio: '16:9',
        // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        fluid: true,
        sources: [
          {
            //类型
            type: 'video/mp4',
            //url地址
            src: ''
          }
        ],
        //你的封面地址
        poster: '',
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          //全屏按钮
          fullscreenToggle: true
        }
      },
      commentList: [],
      parent_id: 0,
      commentPlaceholder: '写评论...'
    }
  },
  activated() {
    this.showRed = false
    this.isReceive = false
    window.scrollTo(0, 0)
    this.redGif = this.redGif + '?' + this.timeStamp
    this.val = 0
    this.showRed = false
    this.uid = this.$route.query.enterpriseId
    this.receive_status = this.$route.query.receive_status
    // this.isReceive = Number(this.receive_status) === 0 ? true : false
    this.commentList = []
    this.dynamicList = []
    this.getInfo()
    this.commentPage = 1
    this.dynamicPage = 1
    this.getCommentList()
    this.getDynamicList()
    this.canReceive()
    this.labelIndex = 0
  },
  deactivated() {
    clearInterval(this.timer)
    this.showRed = false
    clearTimeout(this.timeoutOnoff)
  },
  computed: {
    commentTitle() {
      return `共${this.commentNum}条评论`
    }
  },
  methods: {
    nothHandle() {},
    clearReply() {
      this.parent_id = 0
      this.commentPlaceholder = '写评论...'
    },
    replyCommentHandle(item) {
      console.log(item)
      this.$refs.commentValue.focus()
      this.parent_id = item.id
      this.commentPlaceholder = '回复' + item.nickname
    },
    showCommentHandle() {
      //评论
      this.$nextTick(() => {
        this.showComment = true
      })
    },
    closeRed() {
      this.showRed = false
      this.isReceive = false
    },
    getRed() {
      const currentAddress = JSON.parse(localStorage.getItem('currentAddress'))
      const data = {
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid,
        id: this.content.id,
        citycode: currentAddress.citycode,
        addcode: currentAddress.adcode,
        latitude: currentAddress.lat,
        longitude: currentAddress.lng
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/watchbonus'
      return axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          this.money = res.data.data
          this.showRed = true
          this.timeoutOnoff = setTimeout(() => {
            this.delay = true
            clearTimeout(this.timeoutOnoff)
          }, 1500)
          const hideRed = setTimeout(() => {
            this.closeRed()
            clearTimeout(hideRed)
          }, 5000)
        } else {
          this.isReceive = false
          Toast(res.data.msg)
        }
      })
    },
    setVal() {
      this.timer = setInterval(() => {
        this.val++
        if (this.val >= 100) {
          this.getRed()
          clearInterval(this.timer)
        }
      }, 50)
    },
    getInfo() {
      const data = {
        id: this.uid,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/basicname'
      return axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          for (const key in res.data.data) {
            this.$set(this.content, key, res.data.data[key])
          }
          this.swipeList = res.data.data.topurl
          this.playerOptions.sources[0].src = this.content.qsnvideo
          this.commentNum = this.content.comment
          this.addvisit()
          this.judgeLabel()
        }
      })
    },
    judgeLabel() {
      if (!this.content.supplier) {
        this.lableList[1].isShow = false
      } else {
        this.lableList[1].isShow = true
      }
      if (!this.content.dynamic) {
        this.lableList[2].isShow = false
      } else {
        this.lableList[2].isShow = true
      }
    },
    cheangeLabel(index) {
      if (index === 1) {
        if (this.content.supplier) {
          this.$router.push(this.fun.getUrl('o2oStore_v2', { store_id: this.content.store_id }))
        } else {
          Toast('暂无产品')
        }
      }
      this.labelIndex = index
    },
    addvisit() {
      //浏览
      const data = {
        sid: this.content.id,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/addvisit'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {})
    },
    likeHandle() {
      if (this.content.fabulousstatus === 0) {
        this.getlike()
      } else {
        this.updatelike()
      }
    },
    getlike() {
      //点赞
      const data = {
        sid: this.content.id,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/getlike'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          this.content.fabulousstatus = 1
          this.content.fabulous++
          Toast(res.data.msg)
        } else {
          Toast(res.data.msg)
        }
      })
    },
    updatelike() {
      //取消点赞
      const data = {
        sid: this.content.id,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/updatelike'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          this.content.fabulousstatus = 0
          this.content.fabulous--
          Toast(res.data.msg)
        } else {
          Toast(res.data.msg)
        }
      })
    },
    followHandle() {
      if (this.content.followstatus === 0) {
        this.addfollow()
      } else {
        this.cancelfollow()
      }
    },
    addfollow() {
      //关注
      const data = {
        sid: this.content.id,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/addfollow'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          this.content.followstatus = 1
          this.content.follow++
          Toast(res.data.msg)
        } else {
          Toast(res.data.msg)
        }
      })
    },
    cancelfollow() {
      //取消关注
      const data = {
        sid: this.content.id,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/cancelfollow'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          this.content.followstatus = 0
          this.content.follow--
          Toast(res.data.msg)
        } else {
          Toast(res.data.msg)
        }
      })
    },
    onLoad() {
      this.commentPage++
      this.getCommentList()
    },
    getCommentList() {
      const data = {
        id: this.uid,
        page: this.commentPage
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/comments'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          if (res.data.data.length !== 0) {
            this.$nextTick(() => {
              res.data.data.forEach(item => {
                this.commentList.push(item)
              })
            })
            this.loading = false
            this.finished = false
          } else {
            this.finished = true
          }
        }
      })
    },
    submitComment() {
      if (this.commentValue === '') {
        Toast('请输入内容')
        return
      }
      if (this.commentValue.length > 20) {
        Toast('字数限制20字')
        return
      }
      const data = {
        parent_id: this.parent_id,
        sid: this.content.id,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid,
        common_text: this.commentValue
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/getcomment'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          Toast('评论成功')
          this.commentPlaceholder = '写评论...'
          this.parent_id = 0
          this.content.comment++
          this.commentPage = 1
          this.commentList = []
          this.commentValue = ''
          this.finished = true
          this.getCommentList()
        }
      })
    },
    dynamicOnLoad() {
      this.dynamicPage++
      this.getDynamicList()
    },
    getDynamicList() {
      const data = {
        sid: this.uid,
        page: this.dynamicPage
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/dynamiclists'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          if (res.data.data.length !== 0) {
            res.data.data.forEach(item => {
              this.dynamicList.push(item)
            })
            this.dynamicLoading = false
            this.dynamicFinished = false
          } else {
            this.dynamicFinished = true
          }
        }
      })
    },
    toPreview(item) {
      this.$router.push(this.fun.getUrl('dynamicPreview', { id: item.id }))
    },
    canReceive() {
      //判断能否领取红包
      const currentAddress = JSON.parse(localStorage.getItem('currentAddress'))
      console.log(currentAddress)
      const data = {
        id: this.uid,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid,
        citycode: currentAddress.citycode,
        addcode: currentAddress.adcode,
        latitude: currentAddress.lat,
        longitude: currentAddress.lng
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/actioncheckbonus'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        console.log(res)
        if (res.data.result === 1) {
          this.isReceive = true
          this.setVal()
        } else {
          this.isReceive = false
          Toast(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.submitComment div{
  border:0px !important;
}
/deep/.van-button--small {
  font-size: 14px;
}
/deep/.van-hairline--top-bottom::after{
  border:0px;
}
input {
  border: none !important;
  background: none !important;
  outline: none !important;
  border: none !important;
}
/deep/.submitComment .van-cell-group .van-field__control {
  border: 1px solid #d8d8d8;
//  border: none !important;
  background: none !important;
  outline: none !important;
  // border: 0px !important
}
.progress {
  background-size: 3.7rem 3rem;
  background-image: url('../../assets/newImg/detail/redtop2.png');
  background-repeat: no-repeat;
  background-position: center;
}
.mt-progress-content {
  border-radius: 5px;
  overflow: hidden;
}
/deep/ .mt-progress-runway {
  border-radius: 5px;
  overflow: hidden;
}
/deep/.mt-progress-progress {
  background-color: #f63a39;
  border-radius: 5px;
}
.redSuccess {
  position: fixed;
  width: 15.625rem;
  height: 15.625rem;
  top: 50%;
  left: 50%;
  margin-top: -7.8125rem;
  margin-left: -7.8125rem;
  background-size: 100% 100%;
  z-index: 200001;
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 200000;
    top: 0;
    left: 0;
  }
  .money {
    position: relative;
    z-index: 200001;
    text-align: center;
    line-height: 15.625rem;
    color: #fff;
  }
  .closeIcon {
    width:2rem;
    height: 2rem;
    position: absolute;
    top: 2.5rem;
    right: 4rem;
    z-index: 200001;
    // border:1px solid #000;
    overflow: hidden;
    /deep/ i{
      margin:0.5rem auto;
    }
  }
}
.redSuccessBg {
  position: fixed;
  width: 15.625rem;
  height: 15.625rem;
  top: 50%;
  left: 50%;
  margin-top: -7.8125rem;
  margin-left: -7.8125rem;
  background-color: #000;
  opacity: 0.5;
  z-index: 200000;
}
.content {
  background-color: #fff;
}
.mt-progress {
  width: 3.72rem;
  height: 0.2rem;
}
.red {
  position: fixed;
  top: 50%;
  left: 0.5rem;
  width: 5rem;
  height: 5rem;
  z-index: 9997;
  .redDetail {
    position: relative;
  }
  .redTop {
    width: 3.7rem;
    height: 3rem;
    background-size: 100% 100%;
    background-image: url('../../assets/newImg/detail/redtop2.png');
  }
  .redDown {
    box-sizing: content-box;
    width: 3.7rem;
    height: 1.4rem;
    line-height: 1.4rem;
    text-align: center;
    border: 0.0625rem solid #979797;
    border-top: none;
    background-color: #fff;
    font-size: 0.2rem;
  }
  .redEffect {
    // background-color: #fff;
    z-index: 9998;
    position: absolute;
    height: 4rem;
    width: 3.7rem;
    top: 0;
    left: 0;
    font-size: 0.2rem;
    line-height: 4rem;
    span {
      position: relative;
      z-index: 10000;
    }
    img {
      width: 100%;
      height: 100%;
      z-index: 9999;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.my-swipe {
  height: 9.125rem;
  .van-swipe-item {
    height: 9.125rem;
  }
  img {
    width: 100%;
    height: 100%;
  }
  /deep/.van-swipe__indicators {
    left: 90%;
  }
}
.logo {
  width: 4.375rem;
  height: 4.375rem;
  margin: -2.1875rem auto 0;
  position: relative;
  z-index: 99;
  overflow: hidden;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
.contentInfo {
  padding: 0 0.9375rem;
}
.title {
  h3 {
    // height: 1.25rem;
    height: 2rem;
    font-size: 1rem;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #333333;
    line-height: 2rem;
    overflow: hidden;
    vertical-align: middle;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: center;
  }
  span {
    display: inline-block;
    width: 0.8125rem;
    height: 0.8125rem;
    background-image: url('../../assets/newImg/detail/collection.png');
    background-size: 100% 100%;
    // margin-left: 0.5rem;
    // margin-top: 0.3rem;
  }
  strong {
    position: relative;
    div {
      position: absolute;
      width: 0.8125rem;
      height: 0.8125rem;
      top: 0;
      right: -0.8125rem;
    }
  }
}
.classification {
  margin-top: 0.625rem;
}
.classification > div {
  // height: 1.0625rem;
  font-size: 0.75rem;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #666666;
  line-height: 1.0625rem;
}
.numList {
  // height: 0.875rem;
  font-size: 0.625rem;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #666666;
  line-height: 1.2rem;
  margin-top: 0.625rem;
  padding-left: 0.9375rem;
  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  li {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 22%;
  }
  .numListItem {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  strong {
    color: #999;
  }
  .numListBorder {
    height: 1.1875rem;
    width: 2px;
    background-color: #e4e4e4;
    margin-top: 0.625rem;
  }
}
.lableList {
  margin-top: 1.5rem;
  height: 1.9375rem;
  border-top: 2px solid #e4e4e4;
  border-bottom: 2px solid #e4e4e4;
  padding: 0 0.7813rem;
  padding-top: 0.125rem;
  box-sizing: content-box;
  ul {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  li {
    height: 1.75rem;
    font-size: 0.8125rem;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: #333333;
    line-height: 1.75rem;
    display: flex;
    flex-direction: column;
    span {
      display: block;
    }
    div {
      width: 2.25rem;
      height: 0.125rem;
      margin: 0 auto -0.3125rem;
    }
  }
  .cur div {
    background-color: #0579fc;
  }
}
.detail {
  margin-top: 0.625rem;
  font-size: 0.9375rem;
  //  font-size:0.9375rem;
  font-family: PingFang-SC-Bold, PingFang-SC;
  color: #333333;
  // line-height: 1.0625rem;
  line-height: 1.5625rem;
  .detailTitle {
    font-weight: bold;
    text-align: left;
  }
  p {
    text-indent: 2em;
    text-align: justify;
    margin-bottom: 0.625rem;
  }
  .detailPic {
    width: 100%;
    height: auto;
    margin-top: 0.625rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.aboutUs {
  margin-top: 1.25rem;
  font-size: 0.875rem;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #333333;
  line-height: 1.25rem;
  li {
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    flex-direction: row;
    padding: 0.625rem 0;
  }
  strong {
    font-weight: normal;
    width: 50%;
    text-align: justify;
  }
  em {
    font-weight: normal;
  }
}
.demo {
  // display: inline-block;
  width: 100%;
  height: 10.5625rem;
  text-align: center;
  line-height: 3.125rem;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  margin-top: 0.3125rem;
}
.demo /deep/ .vjs-custom-skin > .video-js .vjs-big-play-button {
  width: 3.125rem !important;
  height: 3.125rem !important;
  border-radius: 50% !important;
  line-height: 3.125rem !important;
  margin-left: -1.5625rem !important;
}
.demo:hover {
  display: block;
}
.operationBtn {
  z-index: 500;
  position: fixed;
  top: 24.0625rem;
  right: 0.6875rem;
  width: 1.875rem;
  height: 9.6875rem;
  opacity: 0.8;
  div {
    span {
      display: block;
      // font-size: 0.625rem;
      font-size: 0.875rem;
      color: #000;
      text-align: center;
    }
  }
}
.comment {
  z-index: 30001;
  height: 26.375rem;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
}
.commentContent {
  height: 26.375rem;
  overflow: hidden;
}
.commentList {
  height: 24rem;
  overflow-y: auto;
  .commentListItem {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding-left: 0.625rem;
  }
  .commenAavatar {
    width: 1.875rem;
    height: 1.875rem;
    border-radius: 50%;
    overflow: hidden;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .commentItemContent {
    margin-left: 0.625rem;
    width: 12.8125rem;
  }
  .commentUserName {
    height: 1.0625rem;
    font-size: 0.75rem;
    font-family: PingFang-SC-Bold, PingFang-SC;
    // font-weight: 600;
    color: #333;
    line-height: 1.0625rem;
  }
  .commentItem {
    font-size: 0.875rem;
    font-family: PingFang-SC-Medium, PingFang-SC;
    // font-weight: 500;
    color: #333333;
    line-height: 1.25rem;
    strong {
      display: block;
      // margin-top: 0.3125rem;
      font-size: 0.625rem;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: #999999;
      line-height: 0.875rem;
    }
    span {
      // display: block;
      // margin-left: 0.9375rem;
      display: inline-block;
    }
    span:nth-of-type(2) {
      margin-left: 5px;
    }
  }
  .commentChildren {
    padding-left: 3.125rem;
    overflow: hidden;
    li {
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      justify-content: flex-start;
      margin-top: 0.5rem;
    }
  }
}
.submitComment {
  padding-left: 1.5625rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  background-color: #fff;
  /deep/ .van-cell-group input {
    border-radius: 1.0625rem;
    border: 2px solid #d8d8d8;
    background: #ffffff;
    height: 1.875rem;
    text-indent: 1em;
  }
  /deep/ .van-field {
    width: 18.125rem;

    background: #ffffff;
  }
  /deep/ .van-cell {
    padding: 0;
    line-height: 1.875rem;
  }
  /deep/.van-button {
    border: none;
    line-height: 1.875rem;
    height: 1.875rem;
  }
}
.dynamic {
  /deep/.van-cell {
    padding: 0;
  }
}
.dynamic-item {
  // padding: 0 1.25rem;
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
</style>

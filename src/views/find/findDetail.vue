<template>
  <div
    class="content"
    @click.stop="clearReply"
  >
    <div
      v-if="isReceive"
      class="red"
    >
      <div class="redDetail">
        <div v-if="!showRed">
          <van-circle
            stroke-width="60"
            color="#f63a39"
            class="redProgress"
            v-model="rate"
            :rate="val"
            size="4.75rem"
            layer-color="#ebedf0"
          />
        </div>
      </div>
    </div>
    <div
      class="redSuccess"
      v-if="showRed"
    >
      <img
        :src="redGif"
        alt=""
      />
      <div @click="closeRed" class="closeIcon"><van-icon  color="#fff" name="cross" size="1rem" /></div>
      <div
        class="money"
        v-show="delay"
      >已领取{{ money }}元</div>
    </div>
    <div class="findItem">
      <div class="userInfo">
        <div class="userPhoto"><img
            :src="findItem.logourl"
            alt=""
          /></div>
        <div class="userName">
          <div>{{ findItem.qsn_name }}</div>
          <span>{{ findItem.createtime }}</span>
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
      <div class="itemType">{{ findItem.typename }}</div>
      <ul class="photo">
        <li
          v-for="(photoItem, photoIndex) in findItem.texturl"
          :key="photoIndex"
          @click="showImageHandle(photoIndex)"
        >
          <img
            :src="photoItem"
            alt=""
          />
        </li>
      </ul>
      <div
        class="demo"
        v-if="findItem.videourl"
      >
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
        >
        </video-player>
      </div>
      <div class="progress">
        <div class="progressBox">
          <div
            class="progressContent"
            :style="'width:' + ((findItem.redmoneynum - findItem.surplusnum) / findItem.redmoneynum) * 100 + '%;'"
          ></div>
        </div>
        <div class="surplus">
          <span>已领{{ findItem.redmoneynum }}个</span>
          <span>剩余{{ findItem.surplusnum }}个</span>
        </div>
      </div>
    </div>
    <div
      class="comment"
      ref="comment"
    >
      <div
        class="commentTitle"
        :class="{ fix: commentTop <= 0 }"
      >
        <div class="commentNum">
          评论：<span>{{ findItem.comment }}</span>
        </div>
        <div class="operationPartent">
          <div
            class="like"
            @click="likeHandle"
          >
            <van-icon
              v-if="findItem.fabulousstatus === 0"
              size="1.2rem"
              name="like"
              color="#dbdbdb"
            />
            <van-icon
              v-else
              size="1.2em"
              name="like"
              color="#f7173a"
            />
            <span>{{ findItem.fabulous }}</span>
          </div>
          <div
            class="follow"
            @click="followHandle"
          >
            <van-icon
              v-if="findItem.followstatus === 0"
              size="1.2rem"
              name="star"
              color="#dbdbdb"
            />
            <van-icon
              v-else
              size="1.2rem"
              name="star"
              color="#f2bb13"
            />
            <span>{{ findItem.follow }}</span>
          </div>
        </div>
      </div>
      <div class="commentList">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :offset="offset"
        >
          <van-cell
            v-for="item in commentList"
            :key="item.id"
          >
            <div class="commentListItem">
              <div class="commenAavatar">
                <img
                  :src="item.avatar"
                  alt="头像"
                  style="width: 100%; height: 100%"
                />
              </div>
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
              <li
                v-for="commentChild in item.children"
                :key="commentChild.id"
              >
                <div class="commenAavatar">
                  <img
                    :src="commentChild.avatar"
                    alt="头像"
                    style="width: 100%; height: 100%"
                  />
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
    </div>
    <div class="submitComment">
      <van-cell-group>
        <van-field
          @click.stop="nothHandle"
          ref="commentValue"
          v-model="commentValue"
          :placeholder="commentPlaceholder"
        ></van-field>
      </van-cell-group>
      <van-button
        @click="submitComment"
        size="small"
        plain
      >发送</van-button>
    </div>
    <van-image-preview
      v-model="showImg"
      :images="imagesList"
      :startPosition="showImgIndex"
      @change="onChange"
    >
      <template v-slot:index>第{{ imgIndex }}页</template>
    </van-image-preview>
  </div>
</template>

<script>
import { Toast, Circle, ImagePreview } from 'vant'
export default {
  data() {
    return {
      findId: '',
      uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid,
      findItem: {},
      commentList: [],
      commentPage: 1,
      loading: false,
      finished: true,
      commentValue: '',
      offset: 100000,
      commentTop: 1,
      isReceive: false, //是否显示红包进度条
      val: 0,
      timer: 0,
      showRed: false,
      delay: false,
      money: '',
      timeoutOnoff: '',
      timeStamp: new Date().getTime().toString(),
      redGif: require('./img/red6.gif'),
      imgIndex: 0,
      showImgIndex:0,
      showImg: false,
      imagesList: [],
      parent_id: 0,
      commentPlaceholder: '写评论...',
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
      }
    }
  },
  activated() {
    window.scrollTo(0, 0)
    this.showRed = false
    this.isReceive = false
    this.findId = this.$route.query.findId
    this.uid = JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
    console.log(this.uid)
    this.canReceive()
    this.getDetail()
    this.getCommentList()
    window.addEventListener('scroll', this.slideHandle)
    this.showRed = false
    this.val = 0
    this.redGif = this.redGif + '?' + this.timeStamp
    this.browse()
  },
  deactivated() {
    clearInterval(this.timer)
    this.showRed = false
    clearTimeout(this.timeoutOnoff)
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
    showImageHandle(index) {
      this.showImg = true
      this.imgIndex = index + 1
      this.showImgIndex = index
      console.log( this.showImgIndex)
    },
    onChange(index) {
      this.imgIndex = index + 1
    },
    closeRed() {
      this.showRed = false
      this.isReceive = false
    },
    browse() {
      const data = {
        uid: this.uid,
        sid: this.findId
      }
      console.log(data)
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/addfindvisit'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        console.log(res)
      })
    },
    getRed() {
      const currentAddress = JSON.parse(localStorage.getItem('currentAddress'))
      const data = {
        uid: this.uid,
        id: this.findId,
        citycode: currentAddress.citycode,
        addcode: currentAddress.adcode,
        latitude: currentAddress.lat,
        longitude: currentAddress.lng
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/watchfind'
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
      //红包进度条定时器
      this.timer = setInterval(() => {
        this.val++
        if (this.val >= 100) {
          console.log(this.timer)
          this.getRed()
          clearInterval(this.timer)
        }
      }, 50)
    },
    canReceive() {
      //判断能否领取红包
      const currentAddress = JSON.parse(localStorage.getItem('currentAddress'))
      console.log(currentAddress)
      const data = {
        id: this.findId,
        uid: this.uid,
        citycode: currentAddress.citycode,
        addcode: currentAddress.adcode,
        latitude: currentAddress.lat,
        longitude: currentAddress.lng
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/judgefind'
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
    },
    followHandle() {
      //收藏
      if (this.findItem.followstatus === 0) {
        this.getfollow()
      } else {
        this.updatefollow()
      }
    },
    getfollow() {
      const data = {
        sid: this.findId,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/addfindollow'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          this.findItem.followstatus = 1
          this.findItem.follow++
          Toast(res.data.msg)
        } else {
          Toast(res.data.msg)
        }
      })
    },
    updatefollow() {
      const data = {
        sid: this.findId,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/cancelfindfollow'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          this.findItem.followstatus = 0
          this.findItem.follow--
          Toast(res.data.msg)
        } else {
          Toast(res.data.msg)
        }
      })
    },
    likeHandle() {
      if (this.findItem.fabulousstatus === 0) {
        this.getlike()
      } else {
        this.updatelike()
      }
    },
    getlike() {
      //点赞
      const data = {
        type: 1,
        sid: this.findId,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/getlike'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          this.findItem.fabulousstatus = 1
          this.findItem.fabulous++
          Toast(res.data.msg)
        } else {
          Toast(res.data.msg)
        }
      })
    },
    updatelike() {
      //取消点赞
      const data = {
        type: 1,
        sid: this.findId,
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/updatelike'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        if (res.data.result === 1) {
          this.findItem.fabulousstatus = 0
          this.findItem.fabulous--
          Toast(res.data.msg)
        } else {
          Toast(res.data.msg)
        }
      })
    },
    slideHandle() {
      // console.log(this.$refs.comment.getBoundingClientRect().top)
      this.commentTop = this.$refs.comment.getBoundingClientRect().top
    },
    onLoad() {
      this.commentPage++
      this.getCommentList()
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
        type: 1,
        sid: this.findId,
        uid: this.uid,
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
          this.findItem.comment++
          this.commentPage = 1
          this.commentList = []
          this.commentValue = ''
          this.finished = true
          this.getCommentList()
        }
      })
    },
    getCommentList() {
      const data = {
        id: this.findId,
        type: 1,
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
    getDetail() {
      const data = {
        uid: this.uid,
        id: this.findId
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/finddetails'
      axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        console.log(res)
        if (res.data.result === 1) {
          this.findItem = res.data.data
          this.imagesList = res.data.data.texturl
          this.playerOptions.sources[0].src = this.findItem.videourl
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.demo {
  // display: inline-block;
  width: 100%;
  // height: 10.5625rem;
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
/deep/.van-button--small {
  font-size: 14px;
}
/deep/.van-hairline--top-bottom::after {
  border: 0px;
}
/deep/.submitComment .van-cell-group .van-field__control {
  border: 1px solid #d8d8d8;
}
.findItem {
  padding: 0.5rem 1.25rem 0;
  overflow: hidden;
  text-align: left;
  background-color: #fff;
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
    // text-overflow: -o-ellipsis-lastline;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-line-clamp: 2;
    // -webkit-box-orient: vertical;
    padding-bottom: 0.5rem;
    // border-bottom: 1px dashed #e4e4e4;
  }
  .address {
    // height: 1.25rem;
    font-size: 0.875rem;
    font-family: PingFang-SC-Regular, PingFang-SC;
    font-weight: 400;
    color: #333333;
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
    margin-top: 0.4rem;
    li {
      margin-right: 0.4rem;
      width: 6.5625rem;
      height: 6.5625rem;
      margin-bottom: 0.5rem;
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
.fix {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0 0.625rem;
  background-color: #f5f5f5;
  z-index: 99;
}
.comment {
  padding: 0 0.625rem;
  overflow: hidden;
  .commentTitle {
    width: 100%;
    padding-top: 0.75rem;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
  }
  .commentNum {
    height: 1rem;
    border-left: 0.25rem solid #0579fc;
    font-size: 0.75rem;
    line-height: 1rem;
    padding-left: 0.3125rem;
    padding-top: 0.1rem;
    span {
      font-size: 0.75rem;
      line-height: 1rem;
    }
  }
  .operationPartent {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-start;
  }
  .like,
  .follow {
    font-size: 1rem;
    line-height: 1rem;
    margin: 0 5px;
    span {
      display: inline-block;
      margin-left: 0.1563rem;
      vertical-align: 5px;
    }
  }
}
.commentList {
  padding-bottom: 3.125rem;
  // height: 24rem;
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
  width: 100%;
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 0.75rem 0;
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
/deep/ .van-cell {
  background: transparent;
  padding-left: 0;
  padding-right: 0;
}
/deep/.van-cell::after {
  border: none;
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
.redProgress {
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
</style>

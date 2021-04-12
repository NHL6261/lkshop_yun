<!-- 新抽奖活动 -->
<template>
  <div id="new_draw">
    <c-title :hide="false" text="抽奖活动"></c-title>
    <!-- 顶部悬浮按钮 -->
    <div class="award-life fixed-btn-top flex-column-stlye">
      <i class="icon-fontclass-dashang iconfont"></i>
      <div class="text-color-box">中奖名单</div>
    </div>
    <div class="share-sheet fixed-btn-top">
      <div class="sheet-chilid flex-column-stlye">
        <i class="icon-share iconfont"></i>
        分享
      </div>
      <div class="sheet-chilid flex-column-stlye">
        <i class="icon-fontclass-tousu iconfont"></i>
        投诉
      </div>
    </div>
    <!-- main -->
    <div class="main">
      <div class="text-img">
        <img class="text-img-src" src="https://www.yunzmall.com/min_img/images/text-img.png" alt="" />
      </div>
      <div class="active-time">
        活动时间：2020.12.31 15:23:00—2021.01.13 15:24:55
      </div>

      <div class="active-introduce">

      </div>
    </div>
  </div>
</template>

<script>
import index_controller from "./index_controller";
export default index_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#new_draw {
  padding: 40px 15px;
  background: #ff7405;
  min-height: 100vh;

  .fixed-btn-top {
    position: fixed;
    top: 4.375rem;
  }

  .award-life {
    left: 20px;

    i {
      font-size: 24px;
      color: #feca03;
    }

    .text-color-box {
      background-color: #ff9000;
      border-radius: 0.531rem;
      color: #fff;
      font-size: 10px;
      padding: 0 8px;
    }
  }

  .share-sheet {
    right: 20px;
    color: #fff;

    i {
      font-size: 18px;
    }

    .sheet-chilid {
      margin-bottom: 0.875rem;
    }
  }

  .flex-column-stlye {
    display: flex;
    flex-direction: column;
  }

  .main {
    .text-img {
      padding: 1.875rem 0 12.875rem;

      .text-img-src {
        height: 3.25rem;
        object-fit: contain;
      }
    }

    .active-time {
      color: #fff;
      font-size: 10px;
      margin-bottom: 0.75rem;
    }
  }
}
</style>

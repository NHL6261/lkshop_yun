<template>
  <div class="comment-list">
    <div class="comment-container" v-for="item in data" :key="item.id">
      <div class="comment-item" :class="{ 'margin-b-8': item.children }">
        <div class="avatar-wrap">
          <img class="avatar" :src="item.avatar" alt="头像" />
        </div>
        <div class="content-wrap">
          <div class="name">{{ item.nickname }}</div>
          <p class="content">{{ item.content }}</p>
          <div class="repeat-wrap">
            <span class="time">{{ item.create_Time }}</span>
            <span class="repeat-btn">回复</span>
          </div>
        </div>
      </div>

      <template v-if="item.children && item.children.length">
        <comments :data="item.children" />
        <p v-if="item.parent_id" class="more">展开 12 条评论</p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comments",
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.comment-list {
  width: 100%;
  padding-left: 0.9375rem;
  padding-right: 2.5rem;
  box-sizing: border-box;
}
.comment-item {
  display: flex;
  text-align: left;
  margin-bottom: 0.9375rem;
  .avatar-wrap {
    margin-right: 0.625rem;
    .avatar {
      width: 1.875rem;
      height: 1.875rem;
      border-radius: 50%;
    }
  }
  .content-wrap {
    .name {
      line-height: 17px;
      font-size: 12px;
      color: #666;
    }
    .content {
      margin: 0;
      line-height: 20px;
      font-size: 16px;
      color: #333;
    }
    .repeat-wrap {
      line-height: 17px;
      font-size: 12px;
      color: #999;
      .time {
        padding-right: 0.625rem;
      }
    }
  }
}
.more {
    margin: 0;
    margin-bottom: .9375rem;
    text-align: left;
    line-height: 17px;
    font-size: 12px;
    color: #3D7DED;
}
.margin-b-8 {
    margin-bottom: .5rem;
}
</style>
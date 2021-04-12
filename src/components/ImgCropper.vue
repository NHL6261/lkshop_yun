<template>
  <div id="container">
    <div class="cropper-wrap">
      <template v-if="orignFileList.length">
        <div v-for="(item, index) in orignFileList" :key="index" class="preview-wrap" @click="imagePreview(index)">
          <div class="preview-delete" @click.stop="handleDel(item, index)">
            <i class="preview-delete-icon">+</i>
          </div>
          <img class="preview-img" v-if="item.url" :src="item.url" alt="图片" />
          <img class="preview-img" v-else :src="item.content" alt="图片" />
        </div>
      </template>
      <!-- option是配置，格式是对象，getbase64Data是组件的一个方法获取裁剪完的头像 2.14新增一个获取getblobData的方法 -->
      <div class="wrap" v-if="showUpload">
        <van-icon name="photograph" />
        <h5-cropper  :option="option" @getFile="getFile"></h5-cropper>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, ImagePreview } from 'vant'
export default {
  name: 'App',
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number
    },
    fixedNumber: {
      type: Array,
      default: () => [1, 1]
    }
  },
  data() {
    return {
      option: {
        ceilbutton: true,
        fixedNumber: this.fixedNumber
      }, //配置
      orignFileList: [],
      reviewList: []
    }
  },
  computed: {
    showUpload() {
      return this.orignFileList.length < this.limit
    }
  },
  watch: {
    fileList: {
      handler(val) {
        [...this.orignFileList] = val
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 图片预览
    imagePreview(index) {
      console.log(this.orignFileList)
      const imgArr = this.orignFileList.map(item => {
        return item.url ? item.url : item.content
      })
      ImagePreview({
        images: imgArr,
        startPosition: index
      })
    },
    async getFile(file) {
      const content = await this.fileToBase64(file)
      this.orignFileList.push({
        file: file,
        content,
        message: '',
        status: ''
      })
      this.$emit('after-read', file, this.orignFileList)
    },
    fileToBase64(file) {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve(reader.result)
        }
      })
    },
    handleDel(item, index) {
      this.reviewList.splice(index, 1)
      this.orignFileList.splice(index, 1)
      this.$emit('after-del', this.orignFileList)
    },
    // async getReviewList(obj) {
    //   if (obj.url) {
    //     this.reviewList.push(obj)
    //   } else {
    //     const base64 = await this.fileToBase64(obj)
    //     this.reviewList.push({
    //       url: base64
    //     })
    //   }
    // },
  }
}
</script>

<style scoped>
.container {
  width: 100%;
}
.cropper-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.cropper-wrap > div {
  flex: 0 0 80px;
  height: 80px;
}

.cropper-wrap:after {
  content: '';
}

/* .upbtn:after {
  content: '+';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #dcdee0;
  font-size: 40px;
  z-index: -1;
} */
.wrap {
  position: relative;
  background: #f7f8fa;
}
.wrap .van-icon {
  position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: #dcdee0;
}
.upbtn {
  position: relative;
}

.preview-wrap {
  position: relative;
  margin: 0 8px 8px 0;
}

.preview-delete {
  position: absolute;
  top: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 0 0 0 12px;
}

.preview-delete-icon {
  position: absolute;
  top: -11px;
  right: -3px;
  color: #fff;
  font-size: 30px;
  transform: rotateZ(45deg) scale(0.5);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

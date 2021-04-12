<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="添加动态"></c-title>
      <!-- <div style="height:40px;"></div> -->

      <div class="main">
        <!-- 动态列表 -->
        <div class="welcome">
          <van-field
            v-model="form.title"
            rows="2"
            autosize
            label="主标题"
            type="textarea"
            maxlength="40"
            placeholder="请输入标题"
            show-word-limit
          />
          <!-- 分割线 -->
          <van-divider />
          <!-- 列表图 -->
          <van-cell value="列表图" :border="false" />
          <div class="upload-container">
            <div class="upload-item">
              <van-uploader v-model="avatarFileList" multiple :max-count="1" :after-read="afterReadAvatar" />
            </div>
            <div class="upload-item"></div>
            <div class="upload-item"></div>
          </div>
          <van-field label="内容" placeholder="请编辑内容" readonly />
          <div id="toolbar-container" class="toolbar"></div>
          <div id="text-container" class="text"></div>

          <!-- 发布按钮 -->
          <button class="btn" @click="handlePreview">预览并发布</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import E from 'wangeditor'
import cTitle from 'components/title'
export default {
  components: { cTitle },
  data() {
    return {
      avatarFileList: [],
      form: {
        uid: '', // 用户id
        sid: '', // 企业id
        title: '', // 标题
        img: '', //列表图片
        content: ''
      },
      editor: null
    }
  },
  created() {
    this.getValidInfo()
  },
  mounted() {
    this.initEdit()
  },
  methods: {
    initEdit() {
      this.editor = new E('#toolbar-container', '#text-container')
      this.editor.config.placeholder = '请输入内容'
      // 配置菜单栏，删减菜单，调整顺序
      this.editor.config.menus = ['undo', 'redo', 'image', 'fullScreen']

      // 默认情况下，只有 IE 和 旧版 Edge 会使用兼容模式，如果需要在其它浏览器上也使用兼容模式，可以在函数内进行判定
      this.editor.config.compatibleMode = function () {
        // 返回 true 表示使用兼容模式；返回 false 使用标准模式
        return false
      }
      // 当我们使用兼容模式的时候，可以自定义记录的频率，默认 200 ms
      this.editor.config.onchangeTimeout = 500
      // 还可以修改历史记录的步数。默认 30 步
      this.editor.config.historyMaxSize = 50

      // 配置 onchange 回调函数
      this.editor.config.onchange = newHtml => {
        console.log('change 之后最新的 html', newHtml)
        this.form.content = newHtml
      }
      // 配置触发 onchange 的时间频率，默认为 200ms
      this.editor.config.onchangeTimeout = 200

      // 上传图片
      this.editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        const formData = this.generatorFormData(resultFiles, 1)
        const { data } = await this.upload(formData)
        // 上传图片，返回结果，将图片插入到编辑器中
        insertImgFn(data.data.img_path)
      }
      this.editor.create()
    },
    // 头像上传
    async afterReadAvatar(file) {
      const type = 1 // 图片类型
      const formData = new FormData()
      formData.append('type', type)
      formData.append('image[]', file.file)
      const { data } = await this.upload(formData)
      if (data.result) {
        this.form.img = data.data.img_path
      } else {
        this.$dialog({
          message: data.msg
        })
        return
      }
    },
    // 生成FormData
    generatorFormData(array, type) {
      console.log(array)
      const len = array.length
      if (!len) return
      const formData = new FormData()
      formData.append('type', type)
      for (let i = 0; i < len; i++) {
        formData.append('image[]', array[i])
      }
      return formData
    },
    // 上传方法
    upload(formData) {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/image'
      let headers = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      return axios({
        method: 'POST',
        url: url,
        data: formData
      })
    },
    // 获取认证信息
    getValidInfo() {
      const data = { uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid, id: '' }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/basicname'
      return axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        res = res.data
        const { data, msg, result } = res
        if (!result) {
          this.$dialog({
            message: data.msg
          })
          return
        } else {
          this.form.uid = data.uid
          this.form.sid = data.id
        }
      })
    },
    // 预览并发布
    handlePreview() {
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/adddaynmic'
      axios({
        method: 'post',
        url: url,
        data: this.form
      }).then(res => {
        res = res.data
        const { data, msg, result } = res
        console.log(data, msg, result)
        if (!result) {
          this.$dialog({
            message: data.msg
          })
          return
        } else {
          this.$router.push(this.fun.getUrl('dynamicPreview', { id: data.id }))
          this.$nextTick(() => {
            this.form.title = ''
            this.form.img = ''
            this.form.content = ''
            this.avatarFileList = []
            this.editor.txt.clear()
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#income,
.supplier,
.main,
.welcome {
  min-height: 100%;
  box-sizing: border-box;
}
.supplier {
  padding-top: 40px;
  background: #fff;
}
.van-cell::after {
  border: none;
}
.text {
  text-align: left;
  height: 300px;
}
.upload-container {
  display: flex;
  padding-left: 0.875rem;
}
.toolbar,
.text {
  border-bottom: 1px solid #d2d2d2;
  // z-index: 2000 !important;
}

.btn {
  margin: 2.1875rem 0;
  width: 19.25rem;
  height: 2.5rem;
  background: #0579fc;
  border-radius: 0.25rem;
  border: none;
  color: #fff;
}
</style>

<style lang="scss">
.van-dialog {
  z-index: 99999 !important;
}
.van-overlay {
  z-index: 99998 !important;
}
</style>

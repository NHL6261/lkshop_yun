<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="企业申请"></c-title>
      <!-- <div style="height:40px;"></div> -->

      <div class="main">
        <!--申请   -->
        <div class="welcome">
          <h2 class="strong-title">认证信息</h2>
          <van-cell-group>
            <van-field v-model="form.name" label="企业名称" placeholder="请输入企业名称" />
          </van-cell-group>
          <van-cell title="扫描营业执照" value="请扫描营业执照上的二维码" :border="false" />
          <div class="upload-container">
            <div class="upload-item">
              <van-uploader
                v-model="fileList"
                preview-size="186px"
                :max-count="1"
                image-fit="contain"
                :after-read="afterRead"
                @delete="handleDelete"
              />
            </div>
          </div>
          <van-button type="info" block @click="handleSubmit">提交</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import cTitle from 'components/title'
export default {
  components: {cTitle},
  data() {
    return {
      fileList: [],
      form: {
        uid: '',
        name: '',
        type: 1, // 企业
        imageurl: ''
      }
    }
  },
  mounted() {
    this.form.uid = JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
  },
  methods: {
    // 上传营业执照
    async afterRead(file) {
      const type = 1 // 图片类型
      const formData = this.generatorFormData(this.fileList, type)
      this.form.imageurl = await this.upload(formData)
    },
    // 删除营业执照
    async handleDelete(img) {
      const type = 1 // 图片类型
      const formData = this.generatorFormData(this.fileList, type)
      this.form.imageurl = await this.upload(formData)
    },
    // 生成FormData
    generatorFormData(array, type) {
      const len = array.length
      if (!len) return
      const formData = new FormData()
      formData.append('type', type)
      for(let i = 0; i < len; i++) {
        formData.append('image[]', array[i].file)
      }
      return formData
    },
    // 提交
    async handleSubmit() {
      await this.valid(this.form)
    },
    // 上传图片方法
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
        .then(res => {
          return res.data.data ? res.data.data.img_path : ''
        })
        .catch(reason => {
          console.log(reason)
        })
    },
    // 身份证验证
    valid(formData) {
      const validUrl = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/demojiek'
      axios({
        method: 'post',
        url: validUrl,
        data: formData
      })
        .then(res => {
          console.log(res)
          if (res.data.result === 1) {
            // 认证成功跳转
            localStorage.setItem('enterprise', JSON.stringify(res.data.data))
            this.$router.push(this.fun.getUrl('validSuccess',  {tag: 'enterprise'}))
          } else {
            // 认证失败跳转
            this.$router.push(this.fun.getUrl('validFaild',  {tag: 'enterprise'}))
          }
        })
        .catch(reason => {
          console.log(reason)
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
  height: 100%;
  box-sizing: border-box;
}
.supplier {
  padding-top: 40px;
}
#tips {
  text-align: left;
  color: #ff5d5c;
  font-size: 12px;
  display: inline-block;
  padding-left: 12px;
}

.el-input__icon.el-icon-caret-top {
  color: #b8b8b8;
}

.el-input__inner {
  border: 0.0625rem solid #b8b8b8;
  font-size: 12px;
}

.el-select {
  display: block;
  margin-bottom: 0.5rem;
  width: 100%;
  height: 2rem;
  border-radius: 0.3125rem;
  box-sizing: border-box;
  outline: none;
}

.delimg {
  position: absolute;
  top: 0rem;
  right: 0rem;
  height: 1.25rem;
  width: 1.875rem;
  color: #fff;
  background-color: red;
}

#income {
  h3 {
    background: #f5f5f5;
    margin: 0;
    padding: 0 0.625rem;
    text-align: left;
    font-weight: normal;
    font-size: 12px;
    height: 2rem;
    box-sizing: border-box;
    line-height: 2rem;
    span {
      color: #999;
    }
  }
}

a {
  text-decoration: none;
  color: #222;
}

input {
  border-width: 0;
  position: absolute;
  right: 0px;
}

.list-ul img {
  width: 80%;
  height: 80%;
}

.list-ul {
  display: flex;
  flex-direction: column;
}

.image-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 0.75rem 0;
  margin-top: -0.625rem;
  .otherphoto {
    .photobox {
      position: relative;
      width: 5rem;
      height: 5rem;
      border: 1px dashed #c0ccda;
      margin-right: 0.2rem;
      margin-left: 0.2rem;
      margin-bottom: 0.2rem;
      img {
        width: 100%;
        height: 100%;
      }
      i {
        width: 1.2rem;
        height: 1.2rem;
        position: absolute;
        top: 0.1rem;
        right: 0.1rem;
        background: url('../../../assets/images/close_iocn.png');
        background-size: 100%;
      }
    }
  }
}

.list-default-img {
  height: 3.125rem;
  text-align: left;
  padding-left: 0.75rem;
}

.supplier .banner img {
  width: 100%;
}

.supplier .main {
  position: relative;
}

.welcome {
  padding: 0.625rem;
  background: #ffffff;
  .text {
    p {
      font-size: 12px;
      color: #666;
      line-height: 1.2rem;
      margin-top: 0;
      span {
        color: #f55955;
      }
    }
  }
  .info {
    margin-top: 0.625rem;
    input {
      position: relative;
      display: block;
      margin-bottom: 0.5rem;
      width: 100%;
      height: 2rem;
      border-radius: 0.3125rem;
      padding: 0 0.3125rem;
      box-sizing: border-box;
      outline: none;
    }

    .inp1 {
      border: 0.0625rem solid #b8b8b8;
    }

    .inp {
      border: 0.0625rem solid #b8b8b8;
    }
    .inp:focus {
      border-color: #f55955;
      box-sizing: border-box;
    }
    span {
      color: #f55955;
    }
    .btn {
      background: #f55955;
      color: #ffffff;
      margin-bottom: 0.5rem;
      width: 100%;
      height: 2rem;
      border-radius: 0.3125rem;
      padding: 0 0.3125rem;
      box-sizing: border-box;
      text-align: center;
      font-size: 12px;
      line-height: 2rem;
      i {
        display: inline-block;
      }
    }
    .btn:focus {
      background: #d8403c;
    }
  }
}

.supplier .main .vip_main {
  background: #ffffff;
  margin: 0.9375rem 0;
  .title {
    padding: 0.625rem;
    font-size: 12px;
    border-bottom: 0.0625rem solid #eeeeee;
    text-align: center;
  }
  .vip {
    padding: 0.9375rem 0.625rem;
    overflow: hidden;
    font-size: 12px;
    color: #999;
    .ico1,
    .ico2 {
      width: 15%;
      float: left;
    }
    .ico1 {
      i {
        background: #32cd32;
      }
    }
    .ico2 {
      i {
        background: #fece00;
      }
    }
    .text {
      float: left;
      width: 100%;
      .t1 {
        font-size: 16px;
        color: #333;
        margin-bottom: 0.3125rem;
        text-align: left;
      }
      .t2 {
        text-align: justify;
      }
    }
    i {
      background: #32cd32;
      height: 2.25rem;
      width: 2.25rem;
      border-radius: 1.125rem;
      color: #fff;
      text-align: center;
      line-height: 2.375rem;
      font-size: 1.25rem;
    }
  }
  .vip1 {
    border-bottom: 0.0625rem solid #eeeeee;
  }
}

.supplier .success {
  height: 12.5rem;
  padding-top: 4.0625rem;
  background: #ffffff;
  .ico {
    height: 4.0625rem;
    width: 4.0625rem;
    margin: auto;
    border: 0.1875rem solid #32cd32;
    border-radius: 4rem;
    color: #32cd32;
    font-size: 2.3rem;
    text-align: center;
    line-height: 4rem;
  }
  .text {
    height: 2rem;
    margin-top: 1.875rem;
    color: #666;
    line-height: 1.6rem;
    text-align: center;
  }
  a .sub {
    height: 2rem;
    width: 80%;
    background: #f55955;
    margin: 1.25rem auto;
    border-radius: 2rem;
    color: #fff;
    line-height: 2rem;
    text-align: center;
    font-size: 14px;
    margin-bottom: 1.25rem;
  }
  a .sub:focus {
    background: #d8403c;
  }
}
.imgflex {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.strong-title {
  padding: 0.875rem 0;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
  text-align: left;
  font-weight: 500;
}

.upload-container {
  display: flex;
  padding: 1.25rem;
  margin-bottom: 6.25rem;
  .upload-item {
    flex: 1;
  }
}

/deep/ .van-cell__title {
  flex: 0 0 6rem;
  text-align: left;
}
/deep/ .van-field__control {
  text-align: right;
}
.pic {
  margin-bottom: 6.5rem;
  width: 8.9375rem;
  height: 11.5625rem;
}
</style>

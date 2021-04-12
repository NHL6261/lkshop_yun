<template>
  <div id="income">
    <div class="supplier">
      <c-title :hide="false" text="企业管理"></c-title>
      <!-- <div style="height:40px;"></div> -->

      <div class="main">
        <!--申请   -->
        <div class="welcome">

          <div class="success-bg"></div>
          <p class="success-text">审核未通过</p>
          <p class="success-exam-text">
            未通过原因：未通过未通过未通过未通过未通过未通过
          </p>

          <van-button type="info" block style="margin-bottom:49px;">重新填写</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import cTitle from 'components/title'
export default {
  components: {cTitle}
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
  // top: -0.25rem;
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
  justify-content: space-between;
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
/deep/ textarea.van-field__control {
  text-align: left;
}
.success-bg {
  margin-top: 4rem;
  margin-left: 8.625rem;
  width: 6.25rem;
  height: 7.5rem;
  background: url('../../../assets/images/strongMan/exam_faild@2x.png') no-repeat;
  background-size: 100%;
}
.success-text {
  margin-top: 1rem;
  line-height: 1.5625rem;
  font-size: 18px;
  color: #494949;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
.success-exam-text {
  margin-top: 0.5625rem;
  margin-bottom: 5.3125rem;
  font-size: 14px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: #333333;
  line-height: 20px;
}
</style>

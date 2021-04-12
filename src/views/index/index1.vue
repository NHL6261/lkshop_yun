<template>
  <div class="content" @scroll="slideHandle">
    <div class="header">
      <div class="title">
        <h3>慈善超市</h3>
        <div class="titleExplain">
          <div>中华人民共和国</div>
          <div>民政部监制</div>
        </div>
      </div>
      <div class="serchInfo">
        <div class="titleAddress" @click="tolocation">
          <div class="titleAddressInfo">
            <span>{{ city }}</span
            ><span>{{ address }}</span>
          </div>
          <div class="titleAddressIcon"></div>
        </div>
        <div class="serchInput" @click="toSerchHandle">
          <img src="../../assets/newImg/index/serchIcon.png" alt="" />
          <span>输入企业名称、商铺名称、牛人姓名等</span>
          <div @click="scanningHandle" class="scanning"></div>
        </div>
      </div>
    </div>
    <div class="classList">
      <ul>
        <li @click="classListHandle(item)" v-for="item in classList" :key="item.id">
          <img :src="item.icon" alt="" />
          <div>{{ item.name }}</div>
        </li>
      </ul>
    </div>
    <div class="labList" ref="labList" :class="{ fixed: contentListTop <= 0 }">
      <ul>
        <li
          v-for="(item, index) in labList"
          :key="item.id"
          :class="{ cur: index === curIndex }"
          @click="labCheckHandle(index, item)"
        >
          <span>{{ item.val }}</span>
          <i></i>
        </li>
      </ul>
    </div>
    <div class="contentList" ref="contentList" :class="{ contentListPaddingTop: contentListTop <= 0 }">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :offset="offset" @load="onLoad">
        <van-cell class="contentItem" v-for="(item, index) in recommendList" :key="index" @click="toDetail(item)">
          <div v-if="parseFloat(item.redmoney) > 0" :class="{ receive: item.receive_status !== 0 }">
            <!-- <div
              v-show="item.receive_status !== 0"
              class="isReceive"
            ></div> -->
            <p class="introduction">{{ item.qsntitle }}</p>
            <div class="nameAddress">
              <span>{{ item.qsn_name }}</span>
              <van-icon color="#999" class="addressIcon" name="location" />{{ item.sqnadress }}
            </div>
            <!-- <div class='nameAddress'>
              <span class='itemName'>{{item.qsn_name}}</span>
              <span class="addressInfo"> {{ item.sqnadress }} </span>
            </div> -->
            <ul class="labelInfo">
              <li v-for="(labelItem, labelIndex) in item.catename" :key="labelIndex">{{ labelItem }}</li>
              <!-- <van-tag plain color="#0579fc" v-for="(labelItem, labelIndex) in item.catename" :key="labelIndex">{{ labelItem }}</van-tag> -->
            </ul>
            <ul class="photo">
              <li v-for="(photoItem, photoIndex) in item.texturl" :key="photoIndex">
                <img :src="photoItem" alt="" />
              </li>
            </ul>
            <div class="progress">
              <div class="progressBox">
                <div
                  class="progressContent"
                  :style="'width:' + ((item.redmoneynum - item.receive) / item.redmoneynum) * 100 + '%;'"
                ></div>
              </div>
              <div class="surplus">
                <span>已领{{ item.receive }}个</span>
                <span>剩余{{ item.surplus }}个</span>
              </div>
            </div>
            <div class="iconInfo">
              <div>
                <van-icon size="1.25rem" name="eye" color="#dbdbdb" />
                <span>{{ item.browse }}</span>
              </div>
              <div>
                <van-icon v-if="item.fabulousstatus === 0" size="1.25rem" name="like" color="#dbdbdb" />
                <van-icon v-else size="1.25rem" name="like" color="#f7173a" />
                <span>{{ item.fabulous }}</span>
              </div>
              <div>
                <van-icon size="1.25rem" name="chat" color="#dbdbdb" />
                <span>{{ item.comment }}</span>
              </div>

              <div>
                <van-icon v-if="item.followstatus === 0" size="1.25rem" name="star" color="#dbdbdb" />
                <van-icon v-else size="1.25rem" name="star" color="#f2bb13" />
                <span>{{ item.follow }}</span>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="notSet">
              <div class="notSetPhoto">
                <img :src="item.texturl[0]" alt="" />
              </div>
              <div class="noSetInfo">
                <div class="noSetintroduction">{{ item.qsntitle }}</div>
                <div class="noSetNameAddress">
                  <span>{{ item.qsn_name }}</span>
                  <van-icon color="#999" class="addressIcon" name="location" />{{ item.sqnadress }}
                </div>
                <ul class="noSetLabelInfo">
                  <li v-for="(labelItem, labelIndex) in item.catename" :key="labelIndex">{{ labelItem }}</li>
                  <!-- <van-tag plain color="#0579fc" v-for="(labelItem, labelIndex) in item.catename" :key="labelIndex">{{ labelItem }}</van-tag> -->
                </ul>
              </div>
            </div>
            <div class="progress noSetProgress">
              <div class="progressBox">
                <div
                  class="progressContent"
                  :style="'width:' + ((item.redmoneynum - item.receive) / item.redmoneynum) * 100 + '%;'"
                ></div>
              </div>
              <div class="notSetSurplus">
                <span>未投放金额</span>
              </div>
            </div>
            <div class="iconInfo">
              <div>
                <van-icon size="1.25rem" name="eye" color="#dbdbdb" />
                <span>{{ item.browse }}</span>
              </div>
              <div>
                <van-icon v-if="item.fabulousstatus === 0" size="1.25rem" name="like" color="#dbdbdb" />
                <van-icon v-else size="1.25rem" name="like" color="#f7173a" />
                <span>{{ item.fabulous }}</span>
              </div>
              <div>
                <van-icon size="1.25rem" name="chat" color="#dbdbdb" />
                <span>{{ item.comment }}</span>
              </div>
              <div>
                <van-icon v-if="item.followstatus === 0" size="1.25rem" name="star" color="#dbdbdb" />
                <van-icon v-else size="1.25rem" name="star" color="#f2bb13" />
                <span>{{ item.follow }}</span>
              </div>
            </div>
          </div>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
import showlocation from 'components/temp/location'

import { MessageBox, Indicator, Toast } from 'mint-ui'
import { List } from 'vant'
export default {
  name: 'index',
  components: {
    showlocation
  },
  data() {
    return {
      offset: 500,
      labListHeight: '',
      contentListTop: '',
      lease_order: [], // 租凭订单数量数组
      lease_order_one: {},
      lease_order_two: {},
      lease_order_three: {},
      lease_order_four: {},
      curIndex: 0,
      classList: [
        {
          name: '慈善超市',
          icon: require('../../assets/newImg/index/cscs.png'),
          href: '',
          id: 0
        },
        {
          name: '慈善医养',
          icon: require('../../assets/newImg/index/csyy.png'),
          href: '',
          id: 1
        },
        {
          name: '本地企业',
          icon: require('../../assets/newImg/index/bdqy.png'),
          href: '/list/enterprise',
          pathName: 'enterprise',
          tag: 'listEnterprise',
          id: 2
        },
        {
          name: '本地商铺',
          icon: require('../../assets/newImg/index/bdsp.png'),
          href: '',
          pathName: 'classificationShop',
          tag: 'listShop',
          id: 3
        },
        {
          name: '本地牛人',
          icon: require('../../assets/newImg/index/bdnr.png'),
          href: '',
          pathName: 'classificationPeople',
          tag: 'listPeople',
          id: 4
        },
        {
          name: '本地文化',
          icon: require('../../assets/newImg/index/bdwh.png'),
          href: '',
          id: 5
        },
        {
          name: '餐饮',
          icon: require('../../assets/newImg/index/cy.png'),
          href: '',
          id: 6
        },
        {
          name: '娱乐',
          icon: require('../../assets/newImg/index/yl.png'),
          href: '',
          id: 7
        },
        {
          name: '附近服务',
          icon: require('../../assets/newImg/index/fjfw.png'),
          href: '',
          id: 8
        },
        {
          name: '更多',
          icon: require('../../assets/newImg/index/gd.png'),
          href: '',
          id: 9
        }
      ],
      labList: [
        {
          id: 0,
          val: '推荐',
          href: ''
        },
        {
          id: 1,
          val: '看企业',
          pathName: 'listEnterprise',
          tag: 'listEnterprise'
        },
        {
          id: 2,
          val: '看商铺',
          pathName: 'listShop',
          tag: 'listShop'
        },
        {
          id: 3,
          val: '看牛人',
          pathName: 'listPeople',
          tag: 'listPeople'
        }
      ],
      recommendList: [],
      address: '海淀区',
      city: '北京市',
      point: {},
      page: 1,
      loading: false,
      finished: true,
      contentList: [
        {
          id: 1,
          qsntitle:
            '中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的,中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的',
          sqnadress: '海淀区 拣到互联技术有限公司',
          catename: ['科技', '技术', '互联网'],
          texturl: [
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png')
          ],
          receive: 90,
          surplus: 10,
          state: 1,
          isLaunch: true,
          redmoney: 100,
          receive_status: 0,
          redmoneynum: 100,
          qsntype: 1
        },
        {
          id: 2,
          qsntitle:
            '中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的,中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的',
          sqnadress: '海淀区 拣到互联技术有限公司',
          catename: ['科技', '技术', '互联网'],
          texturl: [
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png')
          ],
          receive: 60,
          surplus: 40,
          state: 0,
          isLaunch: true,
          redmoney: 200,
          receive_status: 1,
          redmoneynum: 100,
          qsntype: 2
        },
        {
          id: 0,
          qsntitle:
            '中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的,中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的',
          sqnadress: '海淀区 拣到互联技术有限公司',
          catename: ['科技', '技术', '互联网'],
          texturl: [
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png'),
            require('../../assets/newImg/index/pic1.png')
          ],
          receive: 30,
          surplus: 70,
          state: 0,
          isLaunch: false,
          redmoney: 0,
          receive_status: 1,
          redmoneynum: 100,
          qsntype: 3
        }
      ]
    }
  },
  activated() {
    // this.getLocation()
    this.finished = true
    // window.scrollTo(0, 0)
    this.page = 0
    this.getMemberData()
    this.ready()
    // this.getList()
    this.onLoad()
    this.recommendList = []
    window.addEventListener('scroll', this.slideHandle)
    this.contentListTop = this.$refs.contentList.getBoundingClientRect().top
    this.labListHeight = this.$refs.labList.getBoundingClientRect().height

    // 推广
    this.setIntroduce()
    // document.documentElement.scrollTop = 289.5
  },
  deactivated() {
    window.removeEventListener('scroll', this.slideHandle)
  },
  methods: {
    // 推广
    setIntroduce() {
      const tuid = this.$route.query.uid
      const uid = JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/getIntroduce'
      axios({
        url,
        method: 'POST',
        data: {
          uid,
          tuid
        }
      })
    },
    toSerchHandle() {
      this.$router.push(this.fun.getUrl('listSerch', '', { tag: 'listSerch' }))
    },
    slideHandle() {
      this.contentListTop = this.$refs.contentList.getBoundingClientRect().top - this.labListHeight
    },
    tolocation() {
      this.$router.push(this.fun.getUrl('o2oLocation', '', { tag: 'index' }))
    },
    toDetail(obj) {
      if (obj.qsntype === 1) {
        this.$router.push(
          this.fun.getUrl('detailEnterprise', '', { enterpriseId: obj.id, receive_status: obj.receive_status })
        )
      } else if (obj.qsntype === 2) {
        this.$router.push(this.fun.getUrl('detailShop', '', { shopId: obj.id, receive_status: obj.receive_status }))
      } else if (obj.qsntype === 3) {
        this.$router.push(this.fun.getUrl('detailPeople', '', { peopleId: obj.id, receive_status: obj.receive_status }))
      }
    },
    onLoad() {
      this.page++
      if (this.curIndex === 0) {
        this.getList()
      } else {
        this.getTypeList(this.curIndex)
      }
    },
    getList() {
      const data = {
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid,
        page: this.page
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/orderlists'
      return axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        console.log('档期那', res)
        console.log('finished', this.finished)
        if (res.data.result === 1) {
          if (res.data.data.length !== 0) {
            res.data.data.forEach(item => {
              this.recommendList.push(item)
            })
            this.loading = false
            this.finished = false
          } else {
            this.finished = true
          }
          console.log(this.contentListTop)
        }
      })
    },
    getTypeList(type) {
      const data = {
        uid: JSON.parse(localStorage.getItem('tempIndex')).memberinfo.uid,
        page: this.page,
        qsntype: type,
        qsncategory: this.qsncategory,
        shop_name: this.searchVal
      }
      const url = 'https://tpkl.minpinyouxuan.com/index.php/api/v1/listsenterprise'
      return axios({
        method: 'post',
        url: url,
        data
      }).then(res => {
        // console.log('res', res)
        if (res.data.result === 1) {
          if (res.data.data.length === 0) {
            this.finished = true
            return false
          } else {
            res.data.data.forEach(item => {
              this.recommendList.push(item)
            })
            this.loading = false
            this.finished = false
          }
          console.log(this.contentListTop)
        }
      })
    },
    classListHandle(obj) {
      //分类跳转

      this.$router.push(this.fun.getUrl(obj.pathName, '', { tag: obj.tag }))
    },
    labCheckHandle(index) {
      this.curIndex = index
      this.page = 1
      console.log(index)
      this.recommendList = []
      console.log(this.contentListTop)
      if (index === 0) {
        this.getList()
      } else {
        this.getTypeList(index)
      }

      // this.$router.push(this.fun.getUrl(obj.pathName, '', { tag: obj.tag }))
    },
    scanningHandle() {
      Toast('请下载app')
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
    },
    ready: function () {
      //this.getLocation();

      //var myLocation = window.localStorage.getItem('myLocation');
      var myLocation = this.$store.state.o2oLocation

      // this.$store.commit('setReferer', window.location.href)
      //console.log('path::::::', this.$route.path);
      if (myLocation.point) {
        this.address = myLocation.title
        this.city = myLocation.city
        this.point = myLocation.point
        console.log('temp myLocation:', myLocation)

        //初始化数据
        //this.getStores();
        //this.getStoresCategory();
      } else {
        console.log('location不存在')
        this.getLocation()
      }
    },

    getLocation() {
      var that = this
      var mapObj = new AMap.Map('iCenter')
      mapObj.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: 'LB', // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        })
        mapObj.addControl(geolocation)
        // console.log('geolocation', onComplete)
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', onComplete) // 返回定位信息
        AMap.event.addListener(geolocation, 'error', onError) // 返回定位出错信息
      })

      function onComplete(obj) {
        console.log('obj', obj)
        var currentAddress = {
          adcode: obj.addressComponent.adcode,
          citycode: obj.addressComponent.citycode,
          lat: obj.position.lat,
          lng: obj.position.lng
        }
        console.log('currentAddress', currentAddress)
        window.localStorage.setItem('currentAddress', JSON.stringify(currentAddress))
        var res =
          '经纬度：' +
          obj.position +
          '\n精度范围：' +
          obj.accuracy +
          '米\n定位结果的来源：' +
          obj.location_type +
          '\n状态信息：' +
          obj.info +
          '\n地址：' +
          obj.formattedAddress +
          '\n地址信息：' +
          JSON.stringify(obj.addressComponent, null, 4)
        //alert(res);
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(',')
        that.point = {
          lat: position[1],
          lng: position[0]
        }
        that.address = obj.formattedAddress
        that.title = obj.formattedAddress
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city)
          ? obj.addressComponent.city
          : obj.addressComponent.province

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point,
          adcode: obj.addressComponent.adcode,
          citycode: obj.addressComponent.citycode,
          lat: obj.position.lat,
          lng: obj.position.lng
        }
        console.log('test pos', pos)
        that.$store.commit('updateLocation', pos)
        that.$store.commit('setLocation', pos)
        window.localStorage.setItem('myLocation', JSON.stringify(pos))
      }

      function onError(obj) {
        //alert(obj.info + '--' + obj.message);
        console.log(obj)
      }

      /*var that = this;
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var mk = new BMap.Marker(r.point);
                console.log('您的位置ok：', r);
                that.address = r.address.city;
                that.city = r.address.city;

                that.point = r.point;
                var pos = {
                    address:that.address,
                    city:that.city,
                    title:that.address,
                    point:that.point,
                }
                //this.balance = this.$store.state.balance;
                that.$store.commit('updateLocation', pos);
                that.$store.commit('setLocation', pos);
                window.localStorage.setItem("myLocation",JSON.stringify(pos));
                //that.getStores();
            }
            else {
                //todo, 获取收货地址
                that.getMyAddress();
            }
        },{enableHighAccuracy: true})
   */
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.addressIcon {
  margin-right: 5px;
}
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.content {
  padding-bottom: 3.125rem;
}
.header {
  height: 12.75rem;
  // background: linear-gradient(180deg, #0283ff 0%, #0579fc 100%);
  border-radius: 0 0 15px 15px;
  overflow: hidden;
  background-image: url(../../assets/newImg/index/titleBg.png);
  background-size: 100% 100%;
}
.title {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: center;
  height: 4.125rem;
  margin-top: 1.6875rem;

  h3 {
    font-size: 1.9375rem;
    line-height: 2.125rem;
    color: #fff;
    opacity: 0;
  }
  .titleExplain {
    width: 5.9375rem;
    height: 2.125rem;
    background-color: #cb3030;
    color: #fff;
    font-size: 0.5rem;
    line-height: 1.0625rem;
    margin: 0 0.625rem;
    text-align: center;
    opacity: 0;
  }
}
.serchInfo {
  margin-top: 1.5625rem;
  padding: 0 1.25rem;
  height: 60px;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
}
.titleAddress {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
}
.titleAddressInfo {
  display: flex;
  flex-direction: column;
  width: 2.3438rem;
  overflow: hidden;
  span {
    width: 100%;
    display: block;
    color: #fff;
    font-size: 0.625rem;
    font-family: Helvetica;
    color: #ffffff;
    line-height: 0.9375rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.titleAddressIcon {
  width: 0.625rem;
  height: 0.375rem;
  background-image: url(../../assets/newImg/index/address.png);
  background-size: 100% 100%;
  margin-top: 0.625rem;
}
.serchInput {
  position: relative;
  width: 17.8125rem;
  height: 1.875rem;
  background: #ffffff;
  border-radius: 0.3125rem;
  margin-left: 0.3125rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  img {
    width: 1rem;
    height: 1rem;
    margin: 0;
    margin-top: 0.4375rem;
    margin-left: 0.5rem;
  }
  span {
    font-size: 0.75rem;
    font-family: Helvetica;
    color: #999999;
    line-height: 1.875rem;
    margin-left: 0.4688rem;
  }
  .scanning {
    position: absolute;
    top: 0.3125rem;
    right: 0.5rem;
    width: 1.25rem;
    height: 1.25rem;
    background-size: 100% 100%;
    background-image: url('../../assets/newImg/index/scanning.png');
  }
}
.classList {
  width: 22.4375rem;
  height: 11rem;
  margin: -2.0313rem auto 0;
  border-radius: 5px;
  background-color: #fff;
  margin-bottom: 1.25rem;
}
.classList ul {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  overflow: hidden;
  // padding-top: 0.3125rem;
  li {
    width: 20%;
    margin-top: 1.25rem;
    img {
      width: 2.25rem;
      height: 2.25rem;
      // width: 2.875rem;
      // height: 2.875rem;
    }
    div {
      text-align: center;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 17px;
    }
  }
}
.labList {
  padding: 0 2.5rem;
  background-color: #fff;
  ul {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: flex-start;
    padding: 1.5rem 0 0.5rem;
  }
  li {
    width: 25%;
    text-align: center;
    // height: 22px;
    font-size: 16px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #333333;
    line-height: 22px;
    display: flex;
    flex-direction: column;
    i {
      display: inline-block;
      height: 0.25rem;
      width: 3rem;
      background-color: #0579fc;
      border-radius: 5px;
      margin: 0 auto;
      display: none;
    }
  }
  li:nth-of-type(1) i {
    width: 2.5rem;
  }
  .cur {
    color: #0579fc;
    i {
      display: inline-block;
    }
  }
}
/deep/.van-cell::after {
  border-bottom: none !important;
}
.contentList {
  background-color: #f9fafb;
  min-height: 1500px;
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
    padding: 0.2rem 0;
    padding-left: 0;
    span{
       margin-right: 0.625rem;
      margin-bottom: 0.3125rem;
      line-height: 18px;
      border-radius: 0.1875rem;
    }
    li {
      height: 1.1rem;
      font-size: 0.6rem;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #0579fc;
      line-height: 1.3rem;
      border-radius: 0.1875rem;
      border: 0.0313rem solid #0579fc;
      box-sizing: content-box;
      padding: 0 0.3125rem;
      margin-right: 0.625rem;
      margin-bottom: 0.3125rem;
      // display: flex;
      // /*实现垂直居中*/
      // align-items: center;
      // /*实现水平居中*/
      // justify-content: center;

      // text-align: justify;
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
.contentListPaddingTop {
  padding-top: 4rem;
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
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .noSetNameAddress {
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
    padding: 0.2rem 0;
    padding-left: 0;
     span{
       margin-right: 0.625rem;
      margin-bottom: 0.3125rem;
      line-height: 18px;
      border-radius: 0.1875rem;
    }
    li {
      height: 1rem;
      font-size: 0.6rem;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: #0579fc;
      line-height: 1rem;
      border-radius: 0.1875rem;
      border: 0.0313rem solid #0579fc;
      box-sizing: content-box;
      padding: 0 0.3125rem;
      margin-right: 0.625rem;
      margin-bottom: 0.3125rem;
      display: flex;
      /*实现垂直居中*/
      align-items: center;
      /*实现水平居中*/
      justify-content: center;

      text-align: justify;
    }
  }
}
.noSetProgress {
  // margin-top: 0!important;
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

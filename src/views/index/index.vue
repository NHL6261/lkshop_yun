<template>
    <div>
          <ul>
      <li
          class="contentItem"
          v-for="item in recommendList"
          :key="item.id"
        >
          <div v-if="item.redmoney!==0">
            <div
              v-show="item.receive_status !== 0"
              class="isReceive"
            ></div>
            <p class="introduction">{{ item.qsntitle }}</p>
            <div class="addressInfo">
              <img
                :src="item.addressInfo.img"
                alt=""
              />
              <span>{{ item.addressInfo.info }}</span>
            </div>
            <ul class="labelInfo">
              <li
                v-for="(labelItem, labelIndex) in item.labelInfo"
                :key="labelIndex"
              >{{ labelItem.labelName }}</li>
            </ul>
            <ul class="photo">
              <li
                v-for="(photoItem, photoIndex) in item.photoInfo"
                :key="photoIndex"
              >
                <img
                  :src="photoItem.url"
                  alt=""
                />
              </li>
            </ul>
            <div class="progress">
              <div class="progressBox">
                <div
                  class="progressContent"
                  :style="'width:' + item.surplus + '%;'"
                ></div>
              </div>
              <div
                class="surplus"
                v-if="item.isLaunch"
              >
                <span>已领{{ item.receive }}个</span>
                <span>剩余{{ item.surplus }}个</span>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="notSet">
              <div class="notSetPhoto">
                <img
                  :src="item.photoInfo[0].url"
                  alt=""
                />
              </div>
              <div class="noSetInfo">
                <div class="noSetintroduction">{{ item.qsntitle }}</div>
                <div class="noSetAddressInfo">
                  <img
                    :src="item.addressInfo.img"
                    alt=""
                  />
                  <span>{{ item.addressInfo.info }}</span>
                </div>
                <ul class="noSetLabelInfo">
                  <li
                    v-for="(labelItem, labelIndex) in item.labelInfo"
                    :key="labelIndex"
                  >{{ labelItem.labelName }}</li>
                </ul>
              </div>
            </div>
            <div class="progress">
              <div class="progressBox">
                <div
                  class="progressContent"
                  :style="'width:' + item.surplus + '%;'"
                ></div>
              </div>
              <div class="notSetSurplus">
                <span>未投放金额</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
export default {
    name:'index',
     data() {
    return {
      contentList: [
        {
          id: 0,
          introduction:
            '中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的,中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的',
          addressInfo: {
            img: require('../../assets/newImg/index/addressIcon.png'),
            info: '海淀区 拣到互联技术有限公司'
          },
          labelInfo: [{ labelName: '科技' }, { labelName: '技术' }, { labelName: '互联网' }],
          photoInfo: [
            { url: require('../../assets/newImg/index/pic1.png') },
            { url: require('../../assets/newImg/index/pic1.png') },
            { url: require('../../assets/newImg/index/pic1.png') }
          ],
          receive: 30,
          surplus: 70,
          state: 0,
          isLaunch: false
        },
        {
          id: 1,
          introduction:
            '中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的,中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的',
          addressInfo: {
            img: require('../../assets/newImg/index/addressIcon.png'),
            info: '海淀区 拣到互联技术有限公司'
          },
          labelInfo: [{ labelName: '科技' }, { labelName: '技术' }, { labelName: '互联网' }],
          photoInfo: [
            { url: require('../../assets/newImg/index/pic1.png') },
            { url: require('../../assets/newImg/index/pic1.png') },
            { url: require('../../assets/newImg/index/pic1.png') }
          ],
          receive: 90,
          surplus: 10,
          state: 1,
          isLaunch: true
        },
        {
          id: 2,
          introduction:
            '中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的,中国慈善超市创新建设项目的实施主体，是慈善超市品牌推广、体系建设及社会化发展的',
          addressInfo: {
            img: require('../../assets/newImg/index/addressIcon.png'),
            info: '海淀区 拣到互联技术有限公司'
          },
          labelInfo: [{ labelName: '科技' }, { labelName: '技术' }, { labelName: '互联网' }],
          photoInfo: [
            { url: require('../../assets/newImg/index/pic1.png') },
            { url: require('../../assets/newImg/index/pic1.png') },
            { url: require('../../assets/newImg/index/pic1.png') }
          ],
          receive: 60,
          surplus: 40,
          state: 0,
          isLaunch: true
        }
      ],
    }
  },

  methods: {}

}
</script>

<style>
.bg1{
    width:100%;
    height:19.875rem;
    background-image: url("../../assets/newImg/index/bg1.png");
    background-size: 100% 100%;
}
.font{
    text-align: left;
  }
</style>


import { Toast } from "mint-ui";



export default {
  data() {
    return {
    };
  },
  activated() {
    this.getMemberData();
  },
  
  mounted() { },
  methods: {
    // new
    getMemberData() {
      $http
        .post("member.member.member-data", { v: 2 }, " ")
        .then(
          response => {
            if (response.result === 1) {
              this.newTemplate(response.data.designer);
              this.getMemberInfo(
                response.data.member,
                response.data.order,
                response.data.plugins
              );

              this.lease_order = response.data.order.lease_order;
              if (!this.fun.isTextEmpty(this.lease_order)) {
                this.lease_order.map(item => {
                  if (item.status == "0") {
                    this.lease_order_one = item;
                  } else if (item.status == "1") {
                    this.lease_order_two = item;
                  } else if (item.status == "2") {
                    this.lease_order_three = item;
                  } else if (item.status == "3") {
                    this.lease_order_four = item;
                  }
                });
              }

              if (!this.fun.isTextEmpty(response.data.member.yz_member)) {
                this.custom_value = response.data.member.yz_member.custom_value;
                this.getMemberCustom(
                  this.custom_value,
                  response.data.member.yz_member.validity,
                  response.data.setting.custom
                ); // 获取自定义数据
              }
              this.wechat_login_mode = response.data.setting.wechat_login_mode;
              this.getEnablePlugin(response.data.plugins);
              this.getStroeWithdraw(response.data.plugins.is_open);
              this.getExtension(response.data.relation);
              this.getMemberGrade(response.data.setting.level);
            } else {
              Toast(response.msg);
              this.template = "01";
              require("@/assets/css/member/02.scss");
            }
          },
          response => {
            console.log(response.msg);
            require("@/assets/css/member/02.scss");
          }
        )
        .catch(err => {
          console.error(err);
          require("@/assets/css/member/02.scss");
        });
    },
    
  }
};

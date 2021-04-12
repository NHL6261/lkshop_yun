import cTitle from 'components/title';


export default {
  data() {
    return {
      protocol:"",

    };
  },


  mounted() {

  },

  methods: {
    //协议信息
    getProtocolInfo() {
      var that = this;
      $http.get('setting.get-member-protocol', {}).then((response) => {
        if (response.result == 1) {
          that.protocol = response.data.content;
        }
      }, (response) => {
        console.log(response.msg);
      });

    },
  },
  activated() {
    this.getProtocolInfo();
  },

  components: { cTitle }


};
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      //province: this.$province,
      //auth: this.$auth,
      //viewWindowHeight: 0
    }
  },
  created() {
    /*const fun = ()=>{
      let wh = window.innerHeight;
      this.$data.viewWindowHeight = wh;
    }
    fun();
    window.onresize = () => {
      fun();
    };*/
  },
  computed: mapGetters({
    auth: 'globalAuth',
    province: 'globalProvince',
    viewWindowHeight: 'windowHeight'
  }),
  methods: {
    //获取当前页面的组件
    viewGetPageComponents(name){
      let com = null;
      const fun = (refs)=>{
        for(let item in refs){
          if(item === name){
            com = refs[name];
          }
          if(refs[item] && refs[item].$refs){
            fun(refs[item].$refs);
          }
        }
      }
      fun(this.$refs);
      return com;
    },
  }
}
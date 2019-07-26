
export default {
  data() {
    return {
      province: this.$province,
      auth: this.$auth,
      windowHeight: 0
    }
  },
  created() {
    const fun = ()=>{
      let wh = window.innerHeight;
      this.$data.windowHeight = wh;
    }
    fun();
    window.onresize = () => {
      fun();
    };
  },
  methods: {
    //获取当前页面的组件
    getPageComponents(name){
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

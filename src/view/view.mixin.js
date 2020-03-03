export default {
  data() {
    return {
      province: this.$province,
      auth: this.$auth,
      viewWindowHeight: 0
    }
  },
  created() {
    const fun = ()=>{
      let wh = window.innerHeight;
      this.$data.viewWindowHeight = wh;
    }
    fun();
    window.onresize = () => {
      fun();
    };
    //监听页面滚动
    window.onscroll = (e) => {
      this.handleScroll(e);
    };
  },
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
    //监听页面滚动
    handleScroll(e){
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop; // 滚动条偏移量

      //表格表头滚动时固定
      let domQuery = document.querySelector('.container-query');
      let domTableTop = document.querySelector('.container-table > .table-top');
      let domSubMenu = document.querySelector('app-my-sub-menu');
      let topHeight = 16;
      if(domQuery && domQuery.clientHeight) topHeight += domQuery.clientHeight + 16;
      if(domTableTop && domTableTop.clientHeight) topHeight += domTableTop.clientHeight + 16;
      if(domSubMenu && domSubMenu.clientHeight) topHeight += domSubMenu.clientHeight + 16;

      if(scrollTop >= topHeight){
        let dom2 = document.querySelector('.my-table-float > .el-table__header-wrapper');
        if(dom2) dom2.classList.add('my-table-float__header-wrapper');
        let dom3 = document.querySelector('.my-table-float > .el-table__body-wrapper');
        if(dom2 && dom3) dom3.style.marginTop = `${dom2.clientHeight}px`;
      }else{
        let dom2 = document.querySelector('.my-table-float > .el-table__header-wrapper');
        if(dom2) dom2.classList.remove('my-table-float__header-wrapper');
        let dom3 = document.querySelector('.my-table-float > .el-table__body-wrapper');
        if(dom3) dom3.style.marginTop = '0px';
      }
    }
  }
}
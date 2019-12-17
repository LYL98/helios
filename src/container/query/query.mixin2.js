import baseMixin from '@/container/base.mixin';
import { Constant } from '@/util';
import { QueryItem, CollapseQuery } from '@/common';

export default {
  mixins: [baseMixin],
  components: {
    'my-query-item': QueryItem,
    'my-collapse-query': CollapseQuery
  },
  data() {
    return {
      query: {
        page: 1,
        page_size: Constant.PAGE_SIZE
      },
      isShowFiltrate: false, //显示高级筛选
      isExpand: false,
      fixDateOptions: Constant.FIX_DATE_RANGE,
    }
  },
  created() {
    
  },
  methods: {
    //初始化搜索条件
    initQueryData(){
      if(this.initQuery){
        for(let key in this.initQuery){
          this.query[key] = this.initQuery[key]
        }
        this.query.page = 1;
        this.$data.query = this.copyJson(this.query);
      }
    },
    //搜索方法(页面组件)
    handleQuery(pageComponent){
      let pc = this.getPageComponents(pageComponent);
      this.$data.query.page = 1;
      pc.getData(this.query);
    },
    //清除搜索(页面组件)
    handleClearQuery(pageComponent){
      let pc = this.getPageComponents(pageComponent);
      this.initQueryData();
      pc.getData(this.query);
    },
    //显示高级筛选
    handleShowFiltrate(){
      this.$data.isShowFiltrate = true;
    },
    //隐藏高级筛选
    handleHideFiltrate(){
      this.$data.isShowFiltrate = false;
    },
    //收起展开
    onExpandChange(isExpand, pageComponent) {
      this.isExpand = isExpand;
      let pc = this.getPageComponents(pageComponent);
      if(pc){
        pc.onExpandChange(isExpand);
      }
    }
  }
}

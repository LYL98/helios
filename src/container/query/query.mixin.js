import baseMixin from '@/container/base.mixin';
import { Constant } from '@/util';
import { QueryItem, QuerySearchInput } from '@/common';

export default {
  mixins: [baseMixin],
  components: {
    'my-query-item': QueryItem,
    'query-search-input': QuerySearchInput
  },
  props: {
    // 查询对象
    queryData: { type: Object },
    reset: { type: Function }
  },
  model: {
    prop: 'queryData',
    event: 'change'
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
  computed: {
    editQuery: {
      get() {
        /**
         * 修复输入条件，不点击查询按钮，直接点击重置后，无法还原查询条件的问题。
         */
        // return Object.assign({}, this.$props.queryData);
        return this.$props.queryData;
      },
      set(v) {
        // 当editQuery改变时，触发change事件，修改父组件的query对象。
        this.$emit('change', v);
      }
    }
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
    // 搜索按钮处理
    changeQuery() {
      // 更新editQuery
      this.editQuery = Object.assign(this.editQuery, { page: 1 });
    },
    // 重置按钮处理
    resetQuery() {
      this.$props.reset();
    },
  }
}

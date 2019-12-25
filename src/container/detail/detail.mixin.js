import { Constant } from '@/util';
import Layout from './../layout/Layout';
import baseMixin from '@/container/base.mixin';

export default {
  mixins: [baseMixin],
  components: {
    'detail-layout': Layout,
  },
  data() {
    return {
      defaultAvatar: Constant.IMGS.defaultAvatar,
      isShow: false,
      detail: {}
    }
  },
  created() {
    
  },
  methods: {
    //返回表格序号
    indexMethod(index) {
      let { query } = this;
      return (query.page - 1) * query.page_size + index + 1;
    },
    //显示新增修改(供外部也调用)
    showDetail(data){
      if(data){
        this.$data.detail = this.copyJson(data);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
      }
      this.$data.isShow = true;
    },
    //取消
    handleCancel(){
      this.$data.isShow = false;
      this.$data.detail = this.copyJson(this.initDetail);
    },
  }
}

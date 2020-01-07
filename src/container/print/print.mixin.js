import baseMixin from '@/container/base.mixin';
import LayoutOverall from './../layout/LayoutOverall';

export default {
  mixins: [baseMixin],
  components: {
    'print-layout': LayoutOverall,
  },
  data() {
    return {
      isShow: false,
      detail: {},
    }
  },
  created() {
    
  },
  methods: {
    //显示打印(供外部也调用)
    showPrint(data){
      if(data){
        this.$data.detail = this.copyJson(data);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
      }
      this.$data.isShow = true;
    },
    //打印
    handlePrint(){
      window.print();
    },
    //取消打印
    handleCancel(){
      this.$data.detail = this.copyJson(this.initDetail);
      this.$data.isShow = false;
    },
  }
}

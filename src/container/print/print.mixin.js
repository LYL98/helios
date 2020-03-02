import baseMixin from '@/container/base.mixin';
import LayoutPrint from './../layout/LayoutPrint';

export default {
  mixins: [baseMixin],
  components: {
    'print-layout': LayoutPrint,
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
      /*var strHTML=document.getElementsByClassName("el-drawer__body")[0].innerHTML;
      LODOP.PRINT_INITA(1,1,770,660,"测试预览功能");
      LODOP.ADD_PRINT_TEXT(10,60,300,200,"这是测试的纯文本，下面是超文本:");
      LODOP.ADD_PRINT_HTM(30,5,"100%","80%",strHTML);
      LODOP.PREVIEW();*/
    },
    //取消打印
    handleCancel(){
      this.$data.detail = this.copyJson(this.initDetail);
      this.$data.isShow = false;
    },
  }
}

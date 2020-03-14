import baseMixin from '@/container/base.mixin';
import Layout from './../layout/Layout';

export default {
  mixins: [baseMixin],
  components: {
    'form-layout': Layout
  },
  data() {
    return {
      isShow: false,
      detail: {},
      rules: {}
    }
  },
  created() {
    
  },
  methods: {
    //显示form(供外部也调用)
    showForm(data){
      if(data){
        this.$data.detail = this.copyJson(data);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
      }
      this.$data.isShow = true;
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
    },
    //提交
    handleFormSubmit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submitData();
        } else {
          return false;
        }
      });
    },
    //取消form
    handleCancel(){
      this.$data.detail = this.copyJson(this.initDetail);
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.$data.isShow = false;
    },
  }
}

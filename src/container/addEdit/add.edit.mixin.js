import baseMixin from '@/container/base.mixin';
import Layout from './../layout/Layout';
import { DataHandle, Constant } from '@/util';

export default {
  mixins: [baseMixin],
  components: {
    'add-edit-layout': Layout,
  },
  data() {
    return {
      defaultAvatar: Constant.IMGS.defaultAvatar,
      isShow: false,
      detail: {},
      rules: {},
    }
  },
  created() {
    
  },
  methods: {
    //显示新增修改(供外部也调用)
    showAddEdit(data){
      if(data){
        this.$data.detail = this.copyJson(data);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
      }
      this.$data.isShow = true;
    },
    //提交
    handleAddEdit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.addEditData();
        } else {
          return false;
        }
      });
    },
    //取消新增修改
    handleCancel(){
      this.$data.detail = this.copyJson(this.initDetail);
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.$data.isShow = false;
    },
  }
}

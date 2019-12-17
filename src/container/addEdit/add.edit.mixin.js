import baseMixin from '@/container/base.mixin';
import Layout from './../layout/Layout';
import { DataHandle, Constant } from '@/util';

export default {
  mixins: [baseMixin],
  components: {
    'add-edit-layout': Layout,
  },
  data() {
    //今天
    let today = DataHandle.returnDateStr(); //返回今日日期时间字符串
    today = DataHandle.returnDateFormat(today, 'yyyy-MM-dd');

    //明天
    let tomorrow = DataHandle.returnDateCalc(today, 1);
    tomorrow = DataHandle.returnDateFormat(tomorrow, 'yyyy-MM-dd');

    return {
      today: today, //今天
      tomorrow: tomorrow, //明天
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

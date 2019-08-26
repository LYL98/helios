import baseMixin from '@/container/base.mixin';
import { DataHandle, Constant, Config } from '@/util';

export default {
  mixins: [baseMixin],
  components: {
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
      tencentPathUp: Config.tencentUpPath,
      tencentPath: Config.tencentPath,
      defaultAvatar: Constant.IMGS.defaultAvatar,
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
        this.$data.detail = JSON.parse(JSON.stringify(data));
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      }
      this.$data.isShow = true;
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
      this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      if(this.$refs['ruleForm']) this.$refs['ruleForm'].resetFields();
      this.$data.isShow = false;
    },
  }
}

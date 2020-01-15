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
      pageTitles: {
        add: '新增',
        edit: '修改',
        detail: '详情'
      },
      pageType: 'add', //add, edit, detail
    }
  },
  created() {
    
  },
  methods: {
    //窗体标题
    returnPageTitles(title){
      let { pageTitles, pageType } = this;
      if(pageType === 'detail'){
        return title + pageTitles[pageType];
      }
      return pageTitles[pageType] + title;
    },
    //显示新增修改(供外部也调用)
    showAddEdit(data, type){
      if(data){
        this.$data.detail = this.copyJson(data);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
      }
      if(type) this.$data.pageType = type;
      this.$data.isShow = true;
    },
    //提交
    handleAddEdit(e){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.addEditData(e);
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

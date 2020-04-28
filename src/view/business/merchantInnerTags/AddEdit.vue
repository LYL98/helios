<template>
  <div>
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'修改':'新增'}商户内标签`" :visible="isShow" width="720px" :before-close="handleCancel">
      <el-form class="custom-form" size="mini" label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" size="medium" placeholder="请输入20位以内的字符" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(c, i) in detail.child_tags" :key="i"
          :label="`标签项-${i + 1}`"
          :prop="`child_tags[${i}].title`"
          :rules="[{ required: true, message: '名称不能为空', trigger: 'change' }]"
        >
          <el-row>
            <el-col :span="22">
              <el-input v-model="c.title" size="medium" placeholder="请输入20位以内的字符" :maxlength="20"></el-input>
            </el-col>
            <el-col :span="2" class="t-r">
              <a href="javascript:void(0);" @click="handleDeleteItem(i)" style="padding-top: 10px;">删除</a>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="">
          <el-button size="mini" @click="handleAddItem">增加标签项</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import addEditMixin from '@/share/mixin/add.edit.mixin';
import { Http, Config, Constant, Verification } from '@/util';

export default {
  name: "AddEdit",
  mixins: [addEditMixin],
  components: {
  },
  data(){
    let initDetail = {
      title: '',
      child_tags: [{
        title: ''
      }]
    }
    return{
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        title: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    handleAddItem(){
      let { detail } = this;
      detail.child_tags.push({
        title: ''
      });
      this.$data.detail = this.copyJson(detail);
    },
    handleDeleteItem(index){
      let { detail } = this;
      detail.child_tags.remove(index);
      this.$data.detail = this.copyJson(detail);
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'basicdataMerchantInnerTagsEdit' : 'basicdataMerchantInnerTagsAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('Table');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

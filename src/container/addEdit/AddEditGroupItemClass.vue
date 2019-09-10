<template>
  <el-dialog :title="`${detail.id?'修改':'新增'}商品分类`" :visible="isShow" width="720px" append-to-body :before-close="handleCancel" :close-on-click-modal="false">
    <el-form class="custom-form" label-position="right" label-width="110px" style="width: 95%" :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="编号" v-if="detail.code">{{detail.code}}</el-form-item>
      <el-form-item label="名称" prop="title">
        <el-input size="medium" v-model="detail.title" :maxLength="6" placeholder="请输入6位以内的字符"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="rank">
        <el-input v-model="detail.rank" :maxlength="3"  placeholder="0 - 999"></el-input>
      </el-form-item>
      <el-form-item label="备注">
          <el-input v-model="detail.remark" type="textarea" :maxlength="200"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Verification } from '@/util';

export default {
  name: "AddEditGroupItemClass",
  mixins: [addEditMixin],
  components: {
  },
  data(){
    let initDetail = {
      title: '',
      rank: '',
      remark: ''
    }
    return{
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        title: [
          { required: true, message: '商品分类不能为空', trigger: 'change' },
        ],
        rank: [
          { pattern: Verification.testStrs.isNumber, message: '排序必须为正整数数字', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'groupItemClassEdit' : 'groupItemClassAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableGroupItemClass');
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

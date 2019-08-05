<template>
  <div class="user-reset-password">
    <el-dialog :close-on-click-modal="false" :title="`${detail.id?'编辑':'新增'}科学分类`" :visible="isShow" width="720px" :before-close="handleCancel">
      <el-form label-position="right" label-width="100px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm" v-if="isShow">
        <el-form-item label="父分类" v-if="detail.is_top_add">
          {{detail.top_title}}
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="detail.code" :disabled="detail.id" placeholder="系统自动生成" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" placeholder="请输入10位以内字符" :maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input v-model="detail.rank" :maxlength="3" placeholder="0 - 999"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="detail.remark" type="textarea" :maxlength="200" placeholder="请输入200位以内的字符"></el-input>
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
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant, Verification } from '@/util';

export default {
  name: "AddEditSystemClass",
  mixins: [addEditMixin],
  components: {
  },
  data(){
    return{
      initDetail: {},
      rules: {
        title: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
        rank: [
          { pattern: Verification.testStrs.isNumber, message: '排序必须为正整数数字', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    //显示新增修改(重写)
    showAddEdit(data){
      if(data){
        let d = JSON.parse(JSON.stringify(data));
        let dd = {};
        if(d.is_top_add){
          dd.top_code = d.code;
          dd.top_title = d.title;
          dd.is_top_add = true;
        }else{
          dd = d;
          dd.id = true;
        }
        this.$data.detail = JSON.parse(JSON.stringify(dd));
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      }
      this.$data.isShow = true;
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'basicdataSystemClassEdit' : 'basicdataSystemClassAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableBasicDataSystemClass');
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

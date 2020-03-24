<template>
  <div class="user-reset-password">
    <add-edit-layout :title="returnPageTitles('科学分类')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" :rules="rules" ref="ruleForm" v-if="isShow">
        <el-form-item label="父分类" v-if="detail.is_top_add">
          {{detail.top_code}}&nbsp;{{detail.top_title}}
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="detail.code" size="medium" placeholder="系统自动生成" disabled></el-input>
        </el-form-item>
        <!--该分类是否需要生产日期,第一级显示-->
        <el-form-item label="" v-if="!detail.top_code">
          <el-radio v-model="detail.has_produce_date" :label="true" border size="medium">该分类需要生产日期</el-radio>
          <el-radio v-model="detail.has_produce_date" :label="false" border size="medium">不需要</el-radio>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="detail.title" size="medium" placeholder="请输入10位以内字符" :maxlength="10"></el-input>
        </el-form-item>
        <!--<el-form-item label="排序" prop="rank">
          <el-input v-model="detail.rank" :maxlength="3" placeholder="0 - 999"></el-input>
        </el-form-item>-->
        <el-form-item label="备注">
          <el-input v-model="detail.remark" type="textarea" :maxlength="200" placeholder="请输入200位以内的字符"></el-input>
        </el-form-item>
        <el-form-item label="抽检率" prop="qa_rate" v-if="showQaStandard()">
          <input-percent size="medium" min="0" max="100" v-model="detail.qa_rate" placeholder="请输入抽检率" unit="%"/>
        </el-form-item>
        <el-form-item label="品控标准" prop="qa_standard" v-if="showQaStandard()">
          <quill-editor mainClass="sys-class-quill-editor" v-model="detail.qa_standard" module="systemClass" height="200"></quill-editor>
        </el-form-item>
      </el-form>
      <div style="margin-left: 140px; margin-top: 20px;">
        <el-button size="medium" @click.native="handleCancel">取 消</el-button>
        <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from '@/share/mixin/add.edit.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { QuillEditor, InputPercent } from '@/common';

export default {
  name: "AddEditSystemClass",
  mixins: [addEditMixin],
  components: {
    'input-percent': InputPercent,
    'quill-editor': QuillEditor,
  },
  data(){
    return{
      initDetail: {
        has_produce_date: false
      },
      rules: {
        title: [
            { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
        rank: [
          { pattern: Verification.testStrs.isNumber, message: '排序必须为正整数数字', trigger: 'blur' },
        ],
        qa_rate: [
          { required: true, message: '抽检率不能为空', trigger: 'change' },
        ],
        qa_standard: [
          { required: true, message: '品控标准不能为空', trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    //是否显示修改标准
    showQaStandard(){
      let { detail } = this;
      if((detail.code && detail.code.length >= 6) ||
        (detail.top_code && detail.top_code.length >= 4 && detail.is_top_add)){
          return true;
      }
      return false;
    },
    //显示新增修改(重写)
    showAddEdit(data, type){
      this.$data.pageType = type;
      if(data){
        let d = this.copyJson(data);
        let dd = {};
        if(d.is_top_add){
          dd.top_code = d.code;
          dd.top_title = d.title;
          dd.is_top_add = true;
        }else{
          dd = d;
        }
        this.$data.detail = this.copyJson(dd);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
      }
      this.$data.isShow = true;
    },
    //提交数据
    async addEditData(){
      let { detail, pageType } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[pageType === 'edit' ? 'basicdataSystemClassEdit' : 'basicdataSystemClassAdd'], detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${pageType === 'edit' ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemSystemClass');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
<style lang="scss">
  .sys-class-quill-editor{
    .ql-container {
      height: 100px;
    }
  }
</style>

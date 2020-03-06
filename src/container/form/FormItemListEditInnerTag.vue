<template>
  <el-dialog :close-on-click-modal="false" title="修改内标签" :visible="isShow" width="540px" :before-close="handleCancel">
    <el-form label-position="right" label-width="120px" style="width: 400px;" :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="商品编号/名称">{{detail.code}}/{{detail.title}}</el-form-item>
      <el-form-item label="原内标签">{{detail.inner_tag.title}}（加价率：{{returnPercent(detail.inner_tag.rise_min)}}% - {{returnPercent(detail.inner_tag.rise_max)}}%）</el-form-item>
      <el-form-item label="现内标签" prop="new_inner_tag_id">
        <select-inner-tag clearable v-model="detail.new_inner_tag_id" style="width: 300px;"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { SelectInnerTag } from '@/common';

export default {
  name: "FormItemListEditInnerTag",
  mixins: [formMixin],
  components: {
    'select-inner-tag': SelectInnerTag
  },
  created() {
  },
  data(){
    let initDetail = {
      inner_tag: {},
      new_inner_tag_id: ''
    }
    return{
      initDetail: initDetail,
      detail: JSON.parse(JSON.stringify(initDetail)),
      rules: {
        new_inner_tag_id: [
            { required: true, message: '请选择现内标签', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //显示form(供外部也调用)
    showForm(data){
      if(data){
        this.itemDetail(data.id);
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
      }
    },
    //获取详情
    async itemDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.itemDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //提交
    async submitData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.itemInnerTagEdit, {
        id: detail.id,
        inner_tag_id: detail.new_inner_tag_id
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '修改成功', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemList');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

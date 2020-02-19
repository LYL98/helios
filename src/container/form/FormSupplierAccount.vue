<template>
  <form-layout title="新增用户" :isShow="isShow" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="110px" :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="姓名" prop="name">
        <el-input placeholder="10个字符以内" size="medium" :maxlength="10" v-model="detail.name"/>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input placeholder="" size="medium" v-model="detail.phone"/>
      </el-form-item>
    </el-form>
    <div style="margin: 20px 0 0 110px;">
      <el-button size="medium" @click.native="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Verification } from '@/util';

export default {
  name: "FormSupplierAccount",
  mixins: [formMixin],
  components: {
  },
  created() {
  },
  data(){
    let initDetail = {
      supplier_id: null,
      name: '',
      phone: ''
    }
    return{
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        name: [
          {required: true, message: '姓名不能为空', trigger: 'change'}
        ],
        phone: [
          { required: true, message: '账号手机号不能为空', trigger: 'change' },
          { pattern: Verification.testStrs.checkMobile, message: '请输入11位的手机号', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    //显示form(供外部也调用)
    showForm(data){
      this.$data.detail.supplier_id = data.id;
      this.$data.isShow = true;
    },
    //提交
    async submitData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supAccountAdd, detail);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '用户新增成功', type: 'success'});
        //刷新数据
        let pc = this.getPageComponents('DetailSupplierList');
        pc.getDetail(pc.detail.id);
        this.handleCancel(); //隐藏
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .select-supplier{
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    >.select{
      width: 240px;
    }
    >.move{
      margin-left: 10px;
      font-size: 12px;
      >a{
        margin-right: 5px;
        display: block;
        line-height: 20px;
      }
    }
    >.delete{
      font-size: 12px;
    }
    >.main{
      margin-left: 24px;
      font-size: 12px;
      >span{
        cursor: pointer;
        &:hover{
          &::before{
            content: '移除'
          }
        }
      }
    }
  }
</style>

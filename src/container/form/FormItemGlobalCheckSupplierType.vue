<template>
  <form-layout title="采购属性" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="商品编号/名称">{{detail.code}}/{{detail.title}}</el-form-item>
      <el-form-item label="供应商类型" prop="sup_type">
        <el-radio v-model="detail.sup_type" :label="key" :key="key" border size="mini" v-for="(value, key) in supplierType">{{value}}</el-radio>
        <div style="color: #ff5252; margin-top: 10px;">采购类型为商品重要属性，一旦切换需要重新选择供应商。</div>
      </el-form-item>
      <!--统采-->
      <el-form-item label="选择供应商" v-if="detail.sup_type === 'global_pur'">
        <div v-for="(item, index) in detail.supplier_binds" :key="index" style="margin-bottom: 10px;">
          <select-supplier v-model="item.supplier_id" size="medium" supplierType="global_pur" :supplierIds="supplierIds" style="width: 360px;"/>
          <i style="margin-left: 10px; cursor: pointer;" class="el-icon-close icon-button" @click="deleteSupplier(index)" v-if="detail.supplier_binds.length > 1"></i>
        </div>
        <a href="javascript: void(0);" @click="addSupplier" style="font-size: 12px;">增加供应商</a>
      </el-form-item>
      <!--地采-->
      <template v-else>
        <el-form-item label="选择供应商">
          <div>江西省</div>
          <div>
            <select-supplier v-model="supplier_id" size="medium" supplierType="global_pur" :supplierIds="supplierIds" style="width: 360px;"/>
            <i style="margin-left: 10px; cursor: pointer;" class="el-icon-close icon-button" @click="deleteSupplier(index)" v-if="detail.supplier_binds.length > 1"></i>
          </div>
          <a href="javascript: void(0);" @click="addSupplier" style="font-size: 12px;">增加供应商</a>
        </el-form-item>
      </template>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { SelectSupplier } from '@/component';

export default {
  name: "FormItemGlobalCheckSupplierType",
  mixins: [formMixin],
  components: {
    'select-supplier': SelectSupplier
  },
  created() {
  },
  data(){
    let initDetail = {
      sup_type: 'global_pur',
      supplier_binds: [{ supplier_id: '' }]
    }
    return{
      supplierType: Constant.SUPPLIER_TYPE(),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      gAddEditData: {
        id: '',
        supplier_binds: []
      },
      lAddEditData: {
        id: '',
        provinces: []
      },
    }
  },
  computed: {
    //当前选择的供应商ids
    supplierIds() {
      let ids = this.detail.supplier_binds.map(item => item.supplier_id);
      return ids;
    }
  },
  methods: {
    //显示form(供外部也调用)
    showForm(data){
      if(data){
        this.pItemDetail(data.id);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
      }
    },
    
    //获取详情
    async pItemDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.pItemDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        //补全供应商信息
        if(!rd.sup_type) rd.sup_type = 'global_pur';
        if(rd.supplier_binds.length === 0) rd.supplier_binds = [{ supplier_id: '' }];

        this.$data.detail = this.copyJson(rd);
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //增加供应商
    addSupplier(){
      this.$data.detail.supplier_binds.push({ supplier_id: '' });
    },
    //删除供应商
    deleteSupplier(index){
      let { detail } = this;
      detail.supplier_binds.remove(index)
      this.$data.detail = this.copyJson(detail);
    },
    //提交
    async submitData(){
      let { detail } = this;
      let con = true;
      if(detail.sup_type === 'global_pur'){
        detail.supplier_binds.forEach(item => {
          if(!item.supplier_id){
            con = false;
          }
        });
      }
      if(!con){
        this.$message({message: '请选择供应商', type: 'error'});
        return;
      }
      this.$loading({isShow: true});
      let res = await Http.post(detail.sup_type === 'global_pur' ? Config.api.pItemChgToGlobal : Config.api.pItemChgToLocal, {
        id: detail.id,
        sup_type: detail.sup_type,
        supplier_binds: detail.supplier_binds
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '修改成功', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemGlobal');
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

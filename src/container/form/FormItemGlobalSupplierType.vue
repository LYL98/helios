<template>
  <form-layout title="采购属性" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="商品编号/名称">{{detail.code}}/{{detail.title}}</el-form-item>
      <el-form-item label="选择供应商">
        <!--全国-->
        <div style="margin-bottom: 8px;">全国</div>
        <div v-for="(item, index) in globalSupplierBinds" :key="'g' + index" style="margin-bottom: 10px;">
          <select-supplier v-model="item.supplier_id" size="medium" supplierType="global_pur" :supplierIds="gSupplierIds" style="width: 360px;"/>
          <i style="margin-left: 10px; cursor: pointer;" class="el-icon-close icon-button" @click="deleteGSupplier(index)"></i>
        </div>
        <a href="javascript: void(0);" @click="addGSupplier" style="font-size: 12px;">增加供应商</a>
        <div style="border-bottom: 1px solid #eee; margin: 32px 0;"></div>
        <!--区域-->
        <div v-for="(item, index) in localSuppliers" :key="'l' + index" style="margin-bottom: 20px;">
          <div style="margin-bottom: 8px;">{{item.title}}</div>
          <div v-for="(s, i) in item.suppliers" :key="i" class="select-supplier">
            <div class="select"><select-supplier v-model="s.supplier_id" size="medium" supplierType="local_pur" :provinceCode="item.province_code" :supplierIds="supplierIds(index)"/></div>
            <div class="move">
              <a href="javascript: void(0);" v-if="i !== 0" @click="upMove(index, i)">上移</a>
              <a href="javascript: void(0);" v-if="i !== item.suppliers.length - 1" @click="downMove(index, i)">下移</a>
            </div>
            <div class="delete" title="删除"><i style="margin-left: 10px; cursor: pointer;" class="el-icon-close icon-button" @click="deleteSupplier(index, i)"></i></div>
            <div class="main">
              <el-checkbox v-model="s.is_main">反采供应商</el-checkbox>
            </div>
          </div>
          <a href="javascript: void(0);" @click="addSupplier(index)" style="font-size: 12px;">增加供应商</a>
        </div>
      </el-form-item>
    </el-form>
    <div style="margin: 20px 0 0 140px;">
      <el-button size="medium" @click.native="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { SelectSupplier } from '@/component';

export default {
  name: "FormItemGlobalSupplierType",
  mixins: [formMixin],
  components: {
    'select-supplier': SelectSupplier
  },
  created() {
  },
  data(){
    let initDetail = {}
    return{
      supplierType: Constant.SUPPLIER_TYPE(),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      globalSupplierBinds: [],
      localSuppliers: []
    }
  },
  computed: {
    //全国当前选择的供应商ids
    gSupplierIds() {
      let ids = this.globalSupplierBinds.map(item => item.supplier_id);
      return ids;
    }
  },
  methods: {
    //显示form(供外部也调用)
    showForm(data){
      this.$data.detail = this.copyJson(data);
      this.baseProvinceList();
      this.$data.isShow = true;
    },
    //当前选择的供应商ids
    supplierIds(index){
      let ids = this.localSuppliers[index].suppliers.map(item => item.supplier_id);
      return ids;
    },
    //获取省列表
    async baseProvinceList(){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.baseProvinceList, {});
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        rd.forEach(item => {
          item.province_code = item.code;
          item.suppliers = [];
        });
        this.$data.localSuppliers = rd;
        this.pItemGetSuppliers();
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //返回商品的供应商
    async pItemGetSuppliers(){
      let { localSuppliers } = this;
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.pItemGetSuppliers, { id: this.detail.id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        //匹配数据
        if(rd.sup_type === 'local_pur'){
          localSuppliers.forEach(item => {
            rd.suppliers.forEach(r => {
              if(item.province_code === r.province_code){
                item.suppliers = r.suppliers;
              }
            });
          });
        }
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //增加供应商(全国)
    addGSupplier(){
      this.$data.globalSupplierBinds.push({ supplier_id: '' });
    },
    //删除供应商(全国)
    deleteGSupplier(index){
      let { globalSupplierBinds } = this;
      globalSupplierBinds.remove(index);
      this.$data.globalSupplierBinds = this.copyJson(globalSupplierBinds);
    },
    //增加供应商
    addSupplier(index){
      let len = this.localSuppliers[index].suppliers.length;
      this.$data.localSuppliers[index].suppliers.push({ supplier_id: '', is_main: false, rank: len});
    },
    //删除供应商
    deleteSupplier(index, i){
      let { localSuppliers } = this;
      localSuppliers[index].suppliers.remove(i)
      this.$data.localSuppliers = this.copyJson(localSuppliers);
    },
    //上移
    upMove(index, i){
      let { localSuppliers } = this;
      let ub = [];
      localSuppliers[index].suppliers.forEach((item, ii) => {
        if(ii === i - 1){
          ub.push({
            ...localSuppliers[index].suppliers[ii + 1],
            rank: ub.length
          });
        }else if(ii === i){
          ub.push({
            ...localSuppliers[index].suppliers[ii - 1],
            rank: ub.length
          });
        }else{
          ub.push({
            ...item,
            rank: ub.length
          });
        }
      });
      localSuppliers[index].suppliers = ub;
      this.$data.localSuppliers = this.copyJson(localSuppliers);
    },
    //下移
    downMove(index, i){
      let { localSuppliers } = this;
      let ub = [];
      localSuppliers[index].suppliers.forEach((item, ii) => {
        if(ii === i){
          ub.push({
            ...localSuppliers[index].suppliers[ii + 1],
            rank: ub.length
          });
        }else if(ii === i + 1){
          ub.push({
            ...localSuppliers[index].suppliers[ii - 1],
            rank: ub.length
          });
        }else{
          ub.push({
            ...item,
            rank: ub.length
          });
        }
      });
      localSuppliers[index].suppliers = ub;
      this.$data.localSuppliers = this.copyJson(localSuppliers);
    },
    //提交
    async submitData(){
      let { globalSupplierBinds, localSuppliers } = this;
      let con = true, conMain = true;
      localSuppliers.forEach(item => {
        let mainNum = 0;
        item.suppliers.forEach(s => {
          if(!s.supplier_id){
            con = false;
          }
          if(s.is_main){
            mainNum++;
          }
        });
        if(mainNum === 0 && item.suppliers.length > 0){
          conMain = false;
        }
      });
      if(!con){
        this.$message({message: '请选择供应商', type: 'error'});
        return;
      }
      if(!conMain){
        this.$message({message: '请选择主供应商', type: 'error'});
        return;
      }
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.pItemChgSupplier, {
        id: this.detail.id,
        global_suppliers: globalSupplierBinds,
        local_suppliers: localSuppliers
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '修改成功', type: 'success'});
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemGlobal');
        pc.getData(pc.query);
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

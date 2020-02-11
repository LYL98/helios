<template>
  <div>
    <div v-for="(item, index) in provinceList" :key="index" style="margin-bottom: 20px;">
      <div style="margin-bottom: 8px;">{{item.title}}</div>
      <div v-for="(s, i) in item.supplier_binds" :key="i" class="select-supplier">
        <div class="select"><select-supplier v-model="s.supplier_id" size="medium" supplierType="local_pur" :provinceCode="item.province_code" :supplierIds="supplierIds(index)"/></div>
        <div class="move">
          <a href="javascript: void(0);" v-if="i !== 0" @click="upMove(index, i)">上移</a>
          <a href="javascript: void(0);" v-if="i !== item.supplier_binds.length - 1" @click="downMove(index, i)">下移</a>
        </div>
        <div class="delete" title="删除"><i style="margin-left: 10px; cursor: pointer;" class="el-icon-close icon-button" @click="deleteSupplier(index, i)"></i></div>
        <div class="main">
          <el-checkbox v-model="s.is_main">主供应商</el-checkbox>
        </div>
      </div>
      <a href="javascript: void(0);" @click="addSupplier(index)" style="font-size: 12px;">增加供应商</a>
    </div>
    <div style="margin-top: 20px;">
      <el-button size="medium" @click.native="pageComponent.handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click.native="submitData">确 定</el-button>
    </div>
  </div>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config } from '@/util';
import { SelectSupplier } from '@/component';

export default {
  name: "FormItemGlobalSupplierTypeL",
  mixins: [formMixin],
  components: {
    'select-supplier': SelectSupplier
  },
  props: {
    pageComponent: { type: Object, default: {} }
  },
  created() {
    this.baseProvinceList();
  },
  data(){
    return{
      provinceList: []
    }
  },
  methods: {
    //当前选择的供应商ids
    supplierIds(index){
      let ids = this.provinceList[index].supplier_binds.map(item => item.supplier_id);
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
          item.supplier_binds = [];
        });
        this.$data.provinceList = rd;
        this.pItemGetSuppliers();
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //返回商品的供应商
    async pItemGetSuppliers(){
      let { provinceList, pageComponent} = this;
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.pItemGetSuppliers, { id: pageComponent.detail.id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        //匹配数据
        if(rd.sup_type === 'local_pur'){
          provinceList.forEach(item => {
            rd.suppliers.forEach(r => {
              if(item.province_code === r.province_code){
                item.supplier_binds = r.supplier_binds;
              }
            });
          });
        }
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //增加供应商
    addSupplier(index){
      let len = this.provinceList[index].supplier_binds.length;
      this.$data.provinceList[index].supplier_binds.push({ supplier_id: '', is_main: false, rank: len});
    },
    //删除供应商
    deleteSupplier(index, i){
      let { provinceList } = this;
      provinceList[index].supplier_binds.remove(i)
      this.$data.provinceList = this.copyJson(provinceList);
    },
    //上移
    upMove(index, i){
      let { provinceList } = this;
      let ub = [];
      provinceList[index].supplier_binds.forEach((item, ii) => {
        if(ii === i - 1){
          ub.push({
            ...provinceList[index].supplier_binds[ii + 1],
            rank: ub.length
          });
        }else if(ii === i){
          ub.push({
            ...provinceList[index].supplier_binds[ii - 1],
            rank: ub.length
          });
        }else{
          ub.push({
            ...item,
            rank: ub.length
          });
        }
      });
      provinceList[index].supplier_binds = ub;
      this.$data.provinceList = this.copyJson(provinceList);
    },
    //下移
    downMove(index, i){
      let { provinceList } = this;
      let ub = [];
      provinceList[index].supplier_binds.forEach((item, ii) => {
        if(ii === i){
          ub.push({
            ...provinceList[index].supplier_binds[ii + 1],
            rank: ub.length
          });
        }else if(ii === i + 1){
          ub.push({
            ...provinceList[index].supplier_binds[ii - 1],
            rank: ub.length
          });
        }else{
          ub.push({
            ...item,
            rank: ub.length
          });
        }
      });
      provinceList[index].supplier_binds = ub;
      this.$data.provinceList = this.copyJson(provinceList);
    },
    //提交
    async submitData(){
      let { pageComponent, provinceList } = this;
      let con = true, conMain = true;
      provinceList.forEach(item => {
        let mainNum = 0;
        item.supplier_binds.forEach(s => {
          if(!s.supplier_id){
            con = false;
          }
          if(s.is_main){
            mainNum++;
          }
        });
        if(mainNum === 0 && item.supplier_binds.length > 0){
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
      let res = await Http.post(Config.api.pItemChgToLocal, {
        id: pageComponent.detail.id,
        provinces: provinceList
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '修改成功', type: 'success'});
        //刷新数据(列表)
        let pc = pageComponent.getPageComponents('TableItemGlobal');
        pc.getData(pc.query);
        pageComponent.handleCancel(); //隐藏
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

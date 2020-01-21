<template>
  <div>
    <div v-for="(item, index) in provinceList" :key="index" style="margin-bottom: 20px;">
      <div style="margin-bottom: 8px;">{{item.title}}</div>
      <div v-for="(s, i) in item.supplier_binds" :key="i" class="select-supplier">
        <div class="select"><select-supplier v-model="item.supplier_id" supplierType="local_pur" :provinceCode="item.province_code" :supplierIds="[]"/></div>
        <div class="move">
          <a href="javascript: void(0);" v-if="i !== 0" @click="upMove(index, i)">上移</a>
          <a href="javascript: void(0);" v-if="i !== item.supplier_binds.length - 1" @click="downMove(index, i)">下移</a>
        </div>
        <div class="main">
          <span v-if="s.is_main" @click="settingMain(index, i)">主供应商</span>
          <a href="javascript: void(0);" v-else @click="settingMain(index, i)">设为主供应商</a>
        </div>
        <div class="delete" title="删除"><i style="margin-left: 10px; cursor: pointer;" class="el-icon-close icon-button" @click="deleteSupplier(index, i)"></i></div>
      </div>
      <a href="javascript: void(0);" @click="addSupplier(index)" style="font-size: 12px;">增加供应商</a>
    </div>
    <div style="margin-top: 20px;">
      <el-button @click.native="pageComponent.handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="submitData">确 定</el-button>
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
      provinceList: [],
      addEditData: {
        id: '',
        provinces: []
      },
    }
  },
  computed: {
    //当前选择的供应商ids
    supplierIds(e, index){
      let ids = this.provinceList[index].supplier_binds.map(item => item.supplier_id);
      return ids;
    }
  },
  methods: {
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
    //设置主供应商
    settingMain(index, i){
      let { provinceList } = this;
      let isMain = provinceList[index].supplier_binds[i].is_main;
      provinceList[index].supplier_binds[i].is_main = !isMain;
      this.$data.provinceList = this.copyJson(provinceList);
    },
    //上移
    upMove(index, i){
      let { provinceList } = this;
      let ub = [];
      provinceList[index].supplier_binds.forEach((item, ii) => {
        if(ii === i - 1){
          ub.push({
            ...provinceList[index].supplier_binds[ii],
            is_main: ub.length === 0 ? true : false,
            rank: ub.length
          });
        }else if(i === ii){
          ub.push({
            ...provinceList.supplier_binds[ii - 1],
            is_main: ub.length === 0 ? true : false,
            rank: ub.length
          });
        }else{
          ub.push({
            ...item,
            is_main: ub.length === 0 ? true : false,
            rank: ub.length
          });
        }
      });
      provinceList.supplier_binds = ub;
      this.$data.provinceList = this.copyJson(provinceList);
    },
    //下移
    downMove(index, i){
      let { provinceList } = this;
      let ub = [];
      provinceList[index].supplier_binds.forEach((item, ii) => {
        if(ii === i){
          ub.push({
            ...provinceList.supplier_binds[ii + 1],
            is_main: ub.length === 0 ? true : false,
            rank: ub.length
          });
        }else if(ii === i + 1){
          ub.push({
            ...provinceList.supplier_binds[ii - 1],
            is_main: ub.length === 0 ? true : false,
            rank: ub.length
          });
        }else{
          ub.push({
            ...item,
            is_main: ub.length === 0 ? true : false,
            rank: ub.length
          });
        }
      });
      provinceList[index].supplier_binds = ub;
      this.$data.provinceList = this.copyJson(provinceList);
    },
    //提交
    async submitData(){
      let { addEditData, pageComponent } = this;
      let con = true;
      addEditData.supplier_binds.forEach(item => {
        if(!item.supplier_id){
          con = false;
        }
      });
      if(!con){
        this.$message({message: '请选择供应商', type: 'error'});
        return;
      }
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.pItemChgToLocal, addEditData);
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
    >.main{
      margin-left: 10px;
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
    >.delete{
      font-size: 12px;
    }
  }
</style>

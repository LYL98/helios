<template>
  <div>
    <div v-for="(item, index) in addEditData.supplier_binds" :key="index" style="margin-bottom: 10px;">
      <select-supplier v-model="item.supplier_id" size="medium" supplierType="global_pur" :supplierIds="supplierIds" style="width: 360px;"/>
      <i style="margin-left: 10px; cursor: pointer;" class="el-icon-close icon-button" @click="deleteSupplier(index)" v-if="addEditData.supplier_binds.length > 1"></i>
    </div>
    <a href="javascript: void(0);" @click="addSupplier" style="font-size: 12px;">增加供应商</a>
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
  name: "FormItemListEditSupplier",
  mixins: [formMixin],
  props: {
    pageComponent: { type: Object, default: {} }
  },
  components: {
    'select-supplier': SelectSupplier
  },
  created() {
    this.$data.addEditData = this.copyJson(this.pageComponent.detail);
  },
  data(){
    return{
      addEditData: {
        id: '',
        supplier_binds: []
      }
    }
  },
  computed: {
    //当前选择的供应商ids
    supplierIds() {
      let ids = this.addEditData.supplier_binds.map(item => item.supplier_id);
      return ids;
    }
  },
  methods: {
    //增加供应商
    addSupplier(){
      this.$data.addEditData.supplier_binds.push({ supplier_id: '' });
    },
    //删除供应商
    deleteSupplier(index){
      let { addEditData } = this;
      addEditData.supplier_binds.remove(index)
      this.$data.addEditData = this.copyJson(addEditData);
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
      let res = await Http.post(Config.api.pItemChgToGlobal, addEditData);
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

</style>

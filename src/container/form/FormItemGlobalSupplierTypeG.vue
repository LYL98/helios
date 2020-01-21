<template>
  <el-dialog :close-on-click-modal="false" title="修改供应商" :visible="isShow" width="680px" :before-close="handleCancel">
    <el-form label-position="right" label-width="120px" style="width: 600px;" :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="供应商类型">{{supplierType[detail.sup_type]}}</el-form-item>
      <el-form-item label="选择供应商" v-if="detail.sup_type === 'local_pur'">
        <div v-for="(item, index) in detail.supplier_binds" :key="index" class="select-supplier">
          <div class="select"><select-supplier v-model="item.supplier_id" supplierType="local_pur" :provinceCode="detail.province_code" :supplierIds="supplierIds"/></div>
          <div class="move">
            <a href="javascript: void(0);" v-if="index !== 0" @click="upMove(index)">上移</a>
            <a href="javascript: void(0);" v-if="index !== detail.supplier_binds.length - 1" @click="downMove(index)">下移</a>
          </div>
          <div class="delete"><i style="margin-left: 10px; cursor: pointer;" class="el-icon-close icon-button" @click="deleteSupplier(index)" v-if="detail.supplier_binds.length > 1"></i></div>
          <div class="main">
            <span v-if="item.is_main">主供应商</span>
            <a href="javascript: void(0);" v-else @click="settingMain(index)">设为主供应商</a>
          </div>
        </div>
        <a href="javascript: void(0);" @click="addSupplier" style="font-size: 12px;">增加供应商</a>
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
import { SelectSupplier } from '@/component';

export default {
  name: "FormItemListEditSupplier",
  mixins: [formMixin],
  components: {
    'select-supplier': SelectSupplier
  },
  created() {
  },
  data(){
    let initDetail = {
      sup_type: 'local_pur',
      supplier_binds: [{ supplier_id: '' }]
    }
    return{
      supplierType: Constant.SUPPLIER_TYPE(),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
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
        this.itemDetail(data.id);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
      }
    },
    
    //获取详情
    async itemDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.itemDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        //补全供应商信息
        if(!rd.sup_type) rd.sup_type = 'local_pur';
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
      detail.supplier_binds.remove(index);
      this.$data.detail = this.copyJson(detail);
    },
    //设置主供应商
    settingMain(index){
      let { detail } = this;
      let ub = [];
      ub.push({
        ...detail.supplier_binds[index],
        is_main: true,
        rank: 0
      });
      detail.supplier_binds.forEach((item, i) => {
        if(index !== i){
          ub.push({
            ...item,
            is_main: false,
            rank: ub.length
          })
        }
      });
      detail.supplier_binds = ub;
      this.$data.detail = this.copyJson(detail);
    },
    //上移
    upMove(index){
      let { detail } = this;
      let ub = [];
      detail.supplier_binds.forEach((item, i) => {
        if(i === index - 1){
          ub.push({
            ...detail.supplier_binds[index],
            is_main: ub.length === 0 ? true : false,
            rank: ub.length
          });
        }else if(i === index){
          ub.push({
            ...detail.supplier_binds[index - 1],
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
      detail.supplier_binds = ub;
      this.$data.detail = this.copyJson(detail);
    },
    //下移
    downMove(index){
      let { detail } = this;
      let ub = [];
      detail.supplier_binds.forEach((item, i) => {
        if(i === index){
          ub.push({
            ...detail.supplier_binds[i + 1],
            is_main: ub.length === 0 ? true : false,
            rank: ub.length
          });
        }else if(i === index + 1){
          ub.push({
            ...detail.supplier_binds[i - 1],
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
      detail.supplier_binds = ub;
      this.$data.detail = this.copyJson(detail);
    },
    //提交
    async submitData(){
      let { detail } = this;
      let sb = [], con = true;
      detail.supplier_binds.forEach((item, index) => {
        sb.push({
          supplier_id: item.supplier_id,
          rank: index,
          is_main: index === 0 ? true : false
        });
        if(!item.supplier_id){
          con = false;
        }
      });
      if(!con){
        this.$message({message: '请选择供应商', type: 'error'});
        return;
      }
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.itemChgSupplier, {
        id: detail.id,
        supplier_binds: sb
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '修改成功', type: 'success'});
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
      width: 60px;
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
      margin-left: 10px;
      font-size: 12px;
    }
  }
</style>

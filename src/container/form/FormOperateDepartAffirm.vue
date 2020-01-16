<template>
  <form-layout title="发车确认" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" ref="ruleForm" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次">{{detail.batch_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库">{{detail.warehouse_title}}/{{detail.tray_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存数量">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出库">场地</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出库数量" prop="num_out">
            <input-number size="medium" v-model="detail.num_out" unit="件" :min="1"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-left: 140px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config } from '@/util';

export default {
  name: "FormOperateDepartAffirm",
  mixins: [formMixin],
  created() {
  },
  components: {
  },
  data(){
    let initDetail = {}
    return{
      rules: {},
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    }
  },
  methods: {
    //显示form(重写)
    showForm(data){
      this.departAffirm(data.id);
    },
    //获取发车确认
    async departAffirm(id){
      this.$loading({isShow: true, isWhole: true});
      let res = await Http.get(Config.api.departAffirm, { id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        //如果没有缺货
        if(rd.id){
          this.$messageBox.confirm(`商品正常，您确认发车？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitData();
          }).catch(() => {
            //console.log('取消');
          });
        }else{
          this.$data.detail = res.data;
          this.$data.isShow = true;
        }
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //提交
    async submitData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supOutAdd, {
        id: detail.id,
        num: detail.num_out,
        province_code: this.$province.code
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已出库', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('DetailWarehouseInventory');
        pc.$data.query.page = 1;
        pc.wareTrayItemQeruy();
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

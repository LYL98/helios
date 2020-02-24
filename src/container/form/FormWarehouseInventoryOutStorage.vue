<template>
  <form-layout title="出库" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="110px" :model="detail" ref="ruleForm" :rules="rules">
      <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
      <el-row>
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
      </el-row>
      <el-form-item label="出库数量" prop="num_out">
        <input-number size="medium" v-model="detail.num_out" unit="件" :min="1"/>
      </el-form-item>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config } from '@/util';
import { InputNumber } from '@/common';

export default {
  name: "FormWarehouseInventoryOutStorage",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber
  },
  data(){
    let initDetail = {}
    return{
      rules: {
        num_out: { required: true, message: '请输入出库数量', trigger: 'change' }
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    }
  },
  methods: {
    //提交
    async submitData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supOutAdd, {
        plan_out_id: detail.plan_out_id || null, //根据出库计划出库的时候，传递这个参数
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
        if(pc) pc.wareTrayItemQeruy();

        //刷新库存列表
        pc = this.getPageComponents('TableWarehouseInventory');
        if(pc) pc.getData(pc.query);

        //刷新仓库出库计划列表
        pc = this.getPageComponents('TableWarehouseOutStorage');
        if(pc) pc.getData(pc.query);
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

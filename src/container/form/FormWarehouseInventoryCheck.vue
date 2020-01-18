<template>
  <form-layout title="盘点" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
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
      </el-row>
      <el-form-item label="盘点后库存" prop="num_after">
        <input-number size="medium" v-model="detail.num_after" unit="件"/>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="盘点类型">
            <template v-if="typeof detail.num_after !== 'number' || detail.num === detail.num_after">正常</template>
            <template v-else-if="detail.num > detail.num_after">盘亏</template>
            <template v-else-if="detail.num < detail.num_after">盘盈</template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盘点数量">{{typeof detail.num_after !== 'number' ? '-' : detail.num_after - detail.num}}件</el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="detail.remark" type="textarea" :maxlength="50" placeholder="请输入50位以内的字符"></el-input>
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
import { Http, Config, Constant, Verification } from '@/util';
import { InputNumber } from '@/common';

export default {
  name: "FormWarehouseInventoryCheck",
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
        num_after: { required: true, message: '请输入盘点后数量', trigger: 'change' },
        remark: { required: true, message: '请输入备注', trigger: 'change' }
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
      let res = await Http.post(Config.api.supCheckAdd, {
        id: detail.id,
        num_after: detail.num_after,
        remark: detail.remark
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已盘点', type: 'success'});
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

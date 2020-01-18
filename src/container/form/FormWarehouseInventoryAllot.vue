<template>
  <form-layout title="调拨" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="调入仓" prop="tar_storehouse_id">
            <select-storehouse size="medium" v-model="detail.tar_storehouse_id" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调入数量" prop="num_in">
            <input-number size="medium" v-model="detail.num_in" unit="件" :min="1"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="可售日期" prop="available_date">
            <el-date-picker
              size="medium"
              style="width: 100%;"
              placeholder="可售日期"
              v-model="detail.available_date"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
import { SelectStorehouse } from '@/component';

export default {
  name: "FormWarehouseInventoryAllot",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber,
    'select-storehouse': SelectStorehouse
  },
  data(){
    let initDetail = {}
    return{
      rules: {
        num_in: { required: true, message: '请输入调入数量', trigger: 'change' },
        tar_storehouse_id: { required: true, message: '请选择调入仓', trigger: 'change' },
        available_date: { required: true, message: '请选择可售日期', trigger: 'change' }
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
      let res = await Http.post(Config.api.supDistributeAdd, {
        tray_items: [{tray_item_id: detail.id, num: detail.num_in}],
        storehouses: [{storehouse_id: detail.tar_storehouse_id, num: detail.num_in, available_date: detail.available_date}]
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已调拨', type: 'success'});
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

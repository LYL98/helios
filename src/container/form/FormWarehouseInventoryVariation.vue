<template>
  <form-layout title="变动" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
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
          <el-form-item label="变动数量" prop="chg_num">
            <input-number size="medium" v-model="detail.chg_num" unit="件" :min="1"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变动类型">
            <select-option
              size="small"
              v-model="detail.reason"
              :options="supOptTypes"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="变动后库存">123件</el-form-item>
    </el-form>
    <div style="margin-left: 110px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from './form.mixin';
import { Http, Config, Constant } from '@/util';
import { InputNumber, SelectOption } from '@/common';

export default {
  name: "FormWarehouseInventoryVariation",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber,
    'select-option': SelectOption
  },
  data(){
    let initDetail = {}
    return{
      supOptTypes: Constant.SUP_OPT_TYPES('value_key'),
      rules: {
        chg_num: { required: true, message: '请输入变动数量', trigger: 'change' }
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
      let res = await Http.post(Config.api.supModifyAdd, {
        id: detail.id,
        num: detail.chg_num,
        opt_type: detail.opt_type,
        chg_num: detail.chg_num,
        amount: detail.amount,
        remark: detail.remark
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已变动', type: 'success'});
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

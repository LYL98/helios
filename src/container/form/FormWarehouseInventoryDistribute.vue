<template>
  <form-layout title="调拨" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" ref="ruleForm" :rules="rules">
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
          <el-form-item label="销售日期" prop="available_date">
            <el-date-picker
              size="medium"
              style="width: 100%;"
              placeholder="销售日期"
              v-model="detail.available_date"
              type="date"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计到货" prop="estimate_arrive_at">
            <el-date-picker size="medium" type="datetime" v-model="detail.estimate_arrive_at" value-format="yyyy-MM-dd HH:mm:ss" placeholder="预计到货" style="width: 100%;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="司机姓名" prop="driver_id">
            <select-driver size="medium" v-model="detail.driver_id" filterable :createdGetData="false" @change="selectDriver"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号">
            <el-input size="medium" :value="detail.driver_phone" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车牌">
            <el-input size="medium" :value="detail.driver_car_num" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车型">
            <el-input size="medium" :value="detail.driver_car_type" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="费用" prop="fee">
            <input-price size="medium" v-model="detail.fee"/>
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
import { Http, Config, Constant, Verification } from '@/util';
import { InputNumber, InputPrice } from '@/common';
import { SelectStorehouse, SelectDriver } from '@/component';

export default {
  name: "FormWarehouseInventoryDistribute",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice,
    'select-storehouse': SelectStorehouse,
    'select-driver': SelectDriver
  },
  data(){
    let initDetail = {}
    return{
      rules: {
        num_in: { required: true, message: '请输入调入数量', trigger: 'change' },
        tar_storehouse_id: { required: true, message: '请选择调入仓', trigger: 'change' },
        available_date: { required: true, message: '请选择销售日期', trigger: 'change' },
        estimate_arrive_at: [
          { required: true, message: '请选择预计到达时间', trigger: 'change' }
        ],
        driver_id: [
          {required: true, message: '司机姓名不能为空', trigger: 'change'}
        ],
        fee: [
          { required: true, message: '费用不能为空', trigger: 'change' },
        ],
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    }
  },
  methods: {
    //选择司机
    selectDriver(item){
      let { detail } = this;
      detail.driver_name = item.realname || '';
      detail.driver_phone = item.phone || '';
      detail.driver_car_num = item.driver_car_num || '';
      detail.driver_car_type = item.driver_car_type || '';
      this.$data.detail = detail;
    },
    //提交
    async submitData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supDistributeAdd, {
        tray_items: [{tray_item_id: detail.id, num: detail.num_in}],
        storehouses: [{storehouse_id: detail.tar_storehouse_id, num: detail.num_in, available_date: detail.available_date, estimate_arrive_at: detail.estimate_arrive_at}],
        driver_id: null,
        driver_name: detail.driver_name,
        driver_phone: detail.driver_phone,
        driver_car_num: detail.driver_car_num,
        driver_car_type: detail.driver_car_type,
        fee: detail.fee
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已调拨', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('DetailWarehouseInventory');
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

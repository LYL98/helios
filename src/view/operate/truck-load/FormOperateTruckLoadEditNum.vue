<template>
  <form-layout title="打货" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" ref="ruleForm" :rules="rules">
      <el-form-item label="门店名称">{{detail.store.title}}</el-form-item>
      <el-form-item label="原分配数量">
        <input-number size="medium" disabled :value="detail.allocated_num" unit="件"/>
      </el-form-item>
      <el-form-item label="打货数量" prop="num">
        <input-number size="medium" v-model="detail.num" :min="1" :max="detail.allocated_num" unit="件"/>
      </el-form-item>
    </el-form>
    <div style="margin-left: 140px; margin-top: 20px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleFormSubmit">确 定</el-button>
    </div>
  </form-layout>
</template>

<script>
import formMixin from '@/share/mixin/form.mixin';
import { Http, Config, Constant, Verification } from '@/util';
import { InputNumber } from '@/common';

export default {
  name: "FormOperateTruckLoadEditNum",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber
  },
  data(){
    let initDetail = {
      store: {},
      num: ''
    }
    return{
      rules: {
        num: { required: true, message: '请输入分配数量', trigger: 'change' }
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
      let res = await Http.post(Config.api.supDeliveryEditItemStoreDetail, {
        store_id: detail.store.id,
        item_id: detail.item_id,
        delivery_date: detail.delivery_date,
        num: detail.allocated_num - detail.num
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '分配数量修改成功', type: 'success'});
        //刷新数据(列表)
        let pc = this.getPageComponents('DetailOperateTruckLoad');
        pc.supDeliveryItemStoreDetail();

        //刷新列表
        pc = this.getPageComponents('TableOperateTruckLoad');
        pc.getData(pc.query);

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
</style>

<template>
  <form-layout title="变动" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="dialog" width="840px">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="detail" ref="ruleForm" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品编号/名称">{{detail.item_code}}/{{detail.item_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="批次">{{detail.batch_code}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="仓库">{{detail.warehouse_title}}/{{detail.tray_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存数量">{{detail.num}}件</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品过期时间">{{detail.due_date || '-'}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存过期时间">{{detail.stock_due_date || '-'}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="变动类型" prop="opt_type">
            <select-option
              size="medium"
              v-model="detail.opt_type"
              :options="supOptTypes"
              placeholder="请选择变动类型"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!--库内品控-->
      <el-row v-if="detail.opt_type === 'stocked_qa'">
        <el-col :span="12">
          <el-form-item label="保质期" prop="shelf_life">
            <input-number size="medium" v-model="detail.new_shelf_life" unit="天" :min="1"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存期" prop="stock_life">
            <input-number size="medium" v-model="detail.new_stock_life" unit="天" :min="1"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新商品过期时间">
            <el-input size="medium" :value="newShelfDueDate" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="新库存过期时间">
            <el-input size="medium" :value="newStockDueDate" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <!--其它-->
      <el-row v-else>
        <el-col :span="12">
          <el-form-item label="变动数量" prop="chg_num">
            <input-number size="medium" v-model="detail.chg_num" unit="件" :min="1"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="变动后库存">
            <input-number v-if="typeof detail.chg_num !== 'number'" size="medium" value="-" unit="件" disabled/>
            <input-number v-else-if="detail.opt_type === 'refund'" size="medium" :value="detail.num + detail.chg_num" unit="件" disabled/>
            <input-number v-else size="medium" :value="detail.num - detail.chg_num" unit="件" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="detail.remark" type="textarea" :maxlength="50" placeholder="请输入50位以内的字符"></el-input>
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
import { Http, Config, DataHandle, Constant } from '@/util';
import { InputNumber, InputPrice, SelectOption } from '@/common';

export default {
  name: "FormWarehouseInventoryVariation",
  mixins: [formMixin],
  created() {
  },
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice,
    'select-option': SelectOption
  },
  data(){
    let initDetail = {}
    return{
      supOptTypes: Constant.SUP_OPT_TYPES('value_key'),
      rules: {
        chg_num: { required: true, message: '请输入变动数量', trigger: 'change' },
        opt_type: { required: true, message: '请选择变动类型', trigger: 'change' },
        remark: { required: true, message: '请输入备注', trigger: 'change' }
      },
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
    }
  },
  computed: {
    //新商品有效期
    newShelfDueDate(){
      let { detail } = this;
      if(detail.new_shelf_life){
        let date = DataHandle.returnDateStr();
            date = DataHandle.returnDateCalc(date, detail.new_shelf_life);
        return date;
      }
      return detail.due_date;
    },
    //新库存有效期
    newStockDueDate(){
      let { detail } = this;
      if(detail.new_stock_life){
        let date = DataHandle.returnDateStr();
            date = DataHandle.returnDateCalc(date, detail.new_stock_life);
        return date;
      }
      return detail.stock_due_date;
    }
  },
  methods: {
    //提交
    submitData(){
      let { detail } = this;
      if(detail.opt_type === 'stocked_qa'){
        if(detail.new_shelf_life || detail.new_stock_life){
          let str = '请仔细确认信息，该批次所有商品的';
          if(detail.new_shelf_life){
            str += `商品过期时间更新为：${this.newShelfDueDate}；`;
          }
          if(detail.new_stock_life){
            str += `库存过期时间为：${this.newStockDueDate}；`;
          }
          this.$messageBox.confirm(str, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.stockedQaSubmit();
          }).catch(() => {
            // console.log('取消');
          });
        }else{
          this.stockedQaSubmit();
        }
      }else{
        this.commonSubmit();
      }
    },
    //库内品控变动
    async stockedQaSubmit(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supModifyStockQa, {
        id: detail.id,
        shelf_life: detail.new_shelf_life || null,
        stock_life: detail.new_stock_life || null,
        remark: detail.remark
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已变动', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('DetailWarehouseInventory');
        pc.wareTrayItemQuery();
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //一般变动
    async commonSubmit(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.supModifyAdd, {
        id: detail.id,
        num: detail.chg_num,
        opt_type: detail.opt_type,
        chg_num: detail.opt_type === 'refund' ? detail.chg_num : -detail.chg_num,
        remark: detail.remark
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '已变动', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('DetailWarehouseInventory');
        pc.wareTrayItemQuery();
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>

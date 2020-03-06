<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      
        <!--新增-->
        <el-form v-if="pageType === 'add'" class="custom-form" label-position="right" label-width="140px" style="width: 98%; max-width: 1400px; margin-top: 20px;" :model="detail" :rules="rules" ref="ruleForm">
          <el-form-item label="供应商" prop="supplier_id">
            <select-supplier size="medium" v-model="detail.supplier_id" style="width: 320px;" filterable/>
          </el-form-item>
          <el-form-item label="操作类型" prop="type">
            <el-radio v-model="detail.type" label="top_up" border size="mini" @change="detail.bill_reason = 'other'">充值</el-radio>
            <el-radio v-model="detail.type" label="withhold" border size="mini" @change="detail.bill_reason = 'other'">扣款</el-radio>
          </el-form-item>
          <el-form-item label="流水类型" prop="bill_reason">
            <el-select size="medium" v-model="detail.bill_reason" style="width: 240px;">
              <el-option label="其它" value="other"></el-option>
              <el-option label="货损" value="item_damage" v-if="detail.type === 'withhold'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="bill_amount">
            <input-price size="medium" v-model="detail.bill_amount" style="width: 240px;"/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="detail.remark" type="textarea" :maxlength="200" rows="4" placeholder="请输入200位以内的字符" style="width: 320px;"></el-input>
          </el-form-item>
        </el-form>

        <!--详情-->
        <el-form v-else class="custom-form" size="mini" label-position="right" label-width="140px" style="max-width: 680px; margin-top: 20px;" :model="detail" :rules="rules" ref="ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商">{{detail.supplier.title}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="流水类型">{{billReason[detail.bill_reason]}}</el-form-item>
            </el-col>
          </el-row>
          <!--手动新增没有商品-->
          <template v-if="!detail.creator_id">
            <el-row>
              <el-col :span="24">
                <el-form-item label="商品编号/名称">{{detail.item_code}} / {{detail.item_title}}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="入库数量">{{detail.item_num}}件</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采购价">&yen;{{returnPrice(detail.item_price_buy)}}</el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入库金额">
                <div class="amount">
                  <div v-if="detail.bill_amount === 0">&yen;{{returnPrice(detail.bill_amount)}}</div>
                  <div class="up" v-else-if="detail.bill_amount > 0">&yen;{{returnPrice(detail.bill_amount)}}</div>
                  <div class="down" v-else>&yen;{{returnPrice(Math.abs(detail.bill_amount))}}</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注">{{detail.remark || '-'}}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="创建人">{{detail.creator.realname || '系统'}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建时间">{{detail.creator.created || detail.created}}</el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="detail.auditor.id">
            <el-col :span="12">
              <el-form-item label="审核人">{{detail.auditor.realname}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核时间">{{detail.auditor.created}}</el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <div style="margin-left: 110px; margin-top: 80px;">
        <template v-if="judgeOrs(pageType, ['add', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant } from '@/util';
import { InputPrice } from '@/common';
import { SelectSupplier } from '@/component';

export default {
  name: "AddEditFinanceSBDetail",
  mixins: [addEditMixin],
  components: {
    'input-price': InputPrice,
    'select-supplier': SelectSupplier
  },
  created() {
  },
  data(){
    let initDetail = {
      supplier: {},
      creator: {},
      auditor: {},
      supplier_id: '',
      type: 'top_up', //充值top_up、扣款withhold
      bill_reason: 'other', //其它other、货损item_damage
      bill_amount: '',
      remark: ''
    }
    return {
      billReason: Constant.SUPPLIER_BILL_REASON(),
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        supplier_id: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        bill_amount: [
          {required: true, message: '请输入金额', trigger: 'change'}
        ],
      },
      pageTitles: {
        add: '手动新增',
        detail: '流水详情'
      },
      pageType: 'add', //add, edit, detail
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      if(data){
        this.financeSupBDetailDetail(data.id);
        this.$data.pageType = type;
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
        this.$data.pageType = 'add';
      }
    },
    //获取详情
    async financeSupBDetailDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.financeSupBDetailDetail, { id });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.detail = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.financeSupBDetailAdd, {
        ...detail,
        bill_amount: detail.type === 'withhold' ? -(detail.bill_amount) : detail.bill_amount
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: '新增成功', type: 'success'});
        this.handleCancel(); //隐藏
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./add.edit.scss";
</style>

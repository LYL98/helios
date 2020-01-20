<template>
  <detail-layout title="报价详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" style="width: 98%; max-width: 1400px;" :model="detail" :rules="rules" ref="ruleForm">
      <h6 class="subtitle">商品报价</h6>
      <el-row>
        <el-col :span="8">
          <el-form-item label="昨日供货价">{{returnPriceFormat(detail.price_buy_last)}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="今日供货价">{{returnPriceFormat(detail.price_buy)}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="昨日加价率">{{returnRate(detail.price_buy_last, detail.price_sale_last)}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="今日建议价">{{returnSuggestPrice(detail)}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="昨日销售价">{{returnPriceFormat(detail.price_sale_last)}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="今日销售价">
            <span style="margin-right: 10px;">{{returnPriceFormat(detail.price_sale)}}</span>
            <!--如果不是今日-->
            <template v-if="detail.opt_date !== today"></template>
            <!--如果地采供应商已报价、或统采有可销售数量-->
            <template v-else-if="((detail.sup_type === 'local_pur' && detail.bd_status !== 'no_bd') || (detail.sup_type === 'global_pur' && detail.available_num > 0) && (auth.isAdmin || auth.ItemPriceFix))">
              <a href="javascript:void(0);" v-if="!detail.is_quoted" @click="handleShowAddEdit('AddEditItemPricing', detail, 'add')">报价</a>
              <a href="javascript:void(0);" v-else-if="!detail.is_audited" @click="handleShowAddEdit('AddEditItemPricing', detail, 'edit')">修改</a>
            </template>
            <a href="javascript:void(0);" v-else @click="notBiddingHint(detail)">报价</a>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="今日加价率">{{returnRate(detail.price_buy, detail.price_sale)}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="昨日销量">{{returnNumFormat(detail.sale_num_last)}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实库库存">{{returnNumFormat(detail.real_stock)}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="可售数量">{{returnNumFormat(detail.available_num)}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h6 class="subtitle">供应商报价</h6>
    <div style="margin: 0 60px;">
      <el-table :data="supplierList" width="100%" :row-class-name="highlightRowClassName">
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column label="供应商名称">
          <template slot-scope="scope">{{scope.row.supplier.title}}<span v-if="scope.row.is_main" class="main-tag no-pre">主供应商</span></template>
        </el-table-column>
        <el-table-column label="供应商报价" width="240">
          <template slot-scope="scope">
            &yen;{{returnPrice(scope.row.price)}}
          </template>
        </el-table-column>
        <el-table-column label="供应商库存" width="240">
          <template slot-scope="scope">
            <span style="margin-right: 10px;">{{scope.row.num}}件</span>
            <a href="javascript:void(0);"
              v-if="detail.sup_type === 'local_pur' && detail.is_audited && detail.is_quoted && detail.opt_date === today && (auth.isAdmin || auth.ItemPriceEditNum)"
              @click="handleShowForm('FormItemPricingEditNum', scope.row)">修改</a>
          </template>
        </el-table-column>
        <el-table-column label="报价时间" width="160">
          <template slot-scope="scope">{{scope.row.created || '-'}}</template>
        </el-table-column>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
import detailMixin from './detail.mixin';
import { Http, Config, Constant, DataHandle } from '@/util';
import { NumberKey, InputNumber, InputPrice } from '@/common';

export default {
  name: "DetailItemPricing",
  mixins: [detailMixin],
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice
  },
  data(){
    return {
      weightScope: Constant.WEIGHT_SCOPE,//重量浮动范围
      initDetail: {},
      rules: {},
      supplierList: []
    }
  },
  methods: {
    //显示(重写)
    showDetail(data){
      let d = this.copyJson(data);
      d.price_buy_last = Number(d.price_buy_last);
      d.price_buy = d.price_buy ? Number(d.price_buy) : '';
      d.price_sale = d.price_sale ? Number(d.price_sale) : '';
      this.$data.detail = d;
      this.itemPriceDetail(d);
    },
    //获取供应商列表
    async itemPriceDetail(data){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.itemPriceDetail, {
        item_id: data.item_id,
        opt_date: data.opt_date
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$data.supplierList = res.data;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //返回建议价(今日询价，今日加价率)
    returnSuggestPrice(item){
      let min = DataHandle.returnSuggestPrice(item.price_buy, item.rise_min);
      let max = DataHandle.returnSuggestPrice(item.price_buy, item.rise_max);
      if(min === '0' && max === '0') return '-';
      return `￥${min} - ￥${max}`;
    },
    //返回加价率(询价，销售价)
    returnRate(p1, p2){
      if(!p1 || !p2) return '-';
      //传的数值：如10.3 传 103
      return this.returnMarkup((p2 / p1 - 1) * 1000) + '%';
    },
    //返回价格格式化
    returnPriceFormat(data){
      if(data){
        return '￥' + this.returnPrice(data);
      }
      return '-';
    },
    //返回数量格式化
    returnNumFormat(data){
      if(data){
        return data + '件';
      }
      return '-';
    },
    //未报价提示
    notBiddingHint(data){
      if(data.sup_type === 'local_pur'){
        this.$message({message: '主供应商尚未报价，请联系主供应商报价', type: 'error'});
      }else{
        this.$message({message: '该商品今日暂无可售数量，暂不可报价', type: 'error'});
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import "./detail.scss";
  .input-behind-span{
    height: 34px;
    line-height: 34px;
    float: left;
    font-size: 18px;
    margin-left: 5px;
  }
  .main-tag{
    font-size: 12px;
    color: #fff;
    background: #ff5252;
    border-radius: 3px;
    padding: 0 5px;
    margin-left: 5px;
  }
</style>

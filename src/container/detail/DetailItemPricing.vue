<template>
  <detail-layout title="报价详情" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" style="width: 98%; max-width: 1400px;" :model="detail" :rules="rules" ref="ruleForm">
      <h6 class="subtitle">商品报价</h6>
      <el-row>
        <el-col :span="8">
          <el-form-item label="昨日供货价">&yen;{{returnPriceFormat(detail.price_buy_last)}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="今日供货价">&yen;{{returnPriceFormat(detail.price_buy)}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="昨日加价率">{{returnRate(detail.price_buy_last, detail.price_sale_last)}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="今日建议价">&yen;{{detail.suggest_price}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="昨日销售价">&yen;{{returnPriceFormat(detail.price_sale_last)}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="今日销售价">&yen;{{returnPriceFormat(detail.price_sale)}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="今日加价率">{{returnRate(detail.price_buy, detail.price_sale)}}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="昨日销量">{{detail.sale_num_last}}&nbsp;件</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实库库存">{{detail.real_stock}}&nbsp;件</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="可售数量">{{detail.available_num}}&nbsp;件</el-form-item>
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
        <el-table-column label="供应商报价" width="100">
          <template slot-scope="scope">
            &yen;{{returnPrice(scope.row.price)}}
          </template>
        </el-table-column>
        <el-table-column label="供应商库存" width="360">
          <template slot-scope="scope">{{scope.row.num}}件</template>
        </el-table-column>
        <el-table-column label="报价时间" prop="updated" width="160"></el-table-column>
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
      rules: {
        price_sale: [
          { required: true, message: '请输入今日销售价', trigger: 'change' },
          { type: 'number', min: 0.01, message: '请输入今日销售价', trigger: 'change' },
          //{ validator: validPriceSale, trigger: 'change' },
        ]
      },
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
      if(d.price_buy && d.rise_min && d.rise_max){
        let min = DataHandle.returnSuggestPrice(d.price_buy, d.rise_min);
        let max = DataHandle.returnSuggestPrice(d.price_buy, d.rise_max);
        d.suggest_min = min;
        d.suggest_max = max;
      }else{
        d.suggest_min = 0;
        d.suggest_max = 0;
      }
      this.$data.detail = d;
      this.itemPriceDetail(d);
      this.$data.isShow = true;
    },
    //获取供应商列表
    async itemPriceDetail(data){
      let res = await Http.get(Config.api.itemPriceDetail, {
        item_id: data.item_id,
        opt_date: data.opt_date
      });
      if(res.code === 0){
        this.$data.supplierList = res.data;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //返回建议价(今日询价，加价率)
    returnSuggestPrice(priceBuy){
      let { detail } = this;
      let min = DataHandle.returnSuggestPrice(priceBuy, detail.rise_min);
      let max = DataHandle.returnSuggestPrice(priceBuy, detail.rise_max);
      detail.suggest_min = min;
      detail.suggest_max = max;
      this.$data.detail = detail;
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
        return this.returnPrice(data);
      }
      return '-';
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

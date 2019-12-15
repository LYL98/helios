<template>
  <add-edit-layout :title="`报价：${detail.code} ${detail.title}`" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" label-position="right" label-width="110px" style="width: 98%; max-width: 1400px;" :model="detail" :rules="rules" ref="ruleForm">
      <el-row>
        <el-col :span="14">
          <h6 class="subtitle">报价信息</h6>
          <el-row>
            <el-col :span="8">
              <el-form-item label="">
                
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="今日供货价">
                <span class="show-span">
                  {{detail.price_buy}}
                </span>
                <span class="input-behind-span">元</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="昨日加价率">
                <span class="show-span">
                  {{returnRate(detail.price_buy_last, detail.price_sale_last)}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="建议价" prop="net_weight_temp">
                <span class="show-span">
                  {{detail.suggest_price}}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="昨日销售价">
                <span class="show-span">
                  &yen;{{detail.price_sale_last}}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="今日销售价" prop="price_sale">
                <input-price size="medium" v-model="detail.price_sale" style="width: 140px;"/>
                <span style="margin-left: 10px;">今日加价率：{{returnRate(detail.price_buy, detail.price_sale)}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="库存">
                <span class="show-span">
                  {{detail.item_stock}}&nbsp;件
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="新库存" prop="new_item_stock">
                <input-number size="medium" v-model="detail.new_item_stock" unit="件" style="width: 140px;"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10">
          <h6 class="subtitle">供应商今日供货信息</h6>
          <div style="margin-left: 20px;">
            <el-row v-for="(item,index) in 6" :key="index" style="margin-bottom: 10px; ">
              <el-col :span="14">供应商{{index}}<span v-if="index === 0" class="main-tag">主供应商</span></el-col>
              <el-col :span="5">200件</el-col>
              <el-col :span="5">30元/件</el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-left: 110px; margin-top: 50px;">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleAddEdit">确定报价</el-button>
    </div>
  </add-edit-layout>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Constant, DataHandle } from '@/util';
import { NumberKey, InputNumber, InputPrice } from '@/common';

export default {
  name: "AddEditItemPricing",
  mixins: [addEditMixin],
  components: {
    'input-number': InputNumber,
    'input-price': InputPrice
  },
  data(){
    let that = this;
    //今日售价校验
    let validPriceSale = function (rules, value, callback) {
      let { detail } = that;
      if (Number(value) >= Number(detail.suggest_min) && Number(value) <= Number(detail.suggest_max)) {
        callback();
      }else{
        callback('销售价要在建议价之间')
      }
    };

    return {
      weightScope: Constant.WEIGHT_SCOPE,//重量浮动范围
      initDetail: {
        province_code: this.$province.code
      },
      rules: {
        price_sale: [
          { required: true, message: '请输入今日销售价', trigger: 'change' },
          { type: 'number', min: 0.01, message: '请输入今日销售价', trigger: 'change' },
          { validator: validPriceSale, trigger: 'change' },
        ],
        new_item_stock: [
          { required: true, message: '请输入库存', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //显示新增修改(重写)
    showAddEdit(data){
      if(data){
        let d = JSON.parse( JSON.stringify(data));
        d.province_code = this.$province.code;
        d.new_item_stock = d.item_stock;
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
      }else{
        this.$data.detail = JSON.parse( JSON.stringify( this.initDetail ));
      }
      this.$data.isShow = true;
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
    //输入今日询价
    clickPriceBuy(){
      let that = this;
      let { detail } = that;
      let p = detail.price_buy
      NumberKey.show({
        num: p || '',
        type: 'Price',
        confirm(price){
          let priceSale = that.returnSuggestPrice(price); //今日售价
          detail.suggest_price = priceSale;
          detail.price_buy = price;
          that.$data.detail = detail;
          //that.$refs['ruleForm'].validate(()=>{return false;});
        }
      });
    },
    //修改今日销售价
    clickPriceSale(){
      let that = this;
      let { detail } = that;
      let p = detail.price_sale;
      NumberKey.show({
        num: p || '',
        type: 'Price',
        confirm(price){
          detail.price_sale = price;
          that.$data.detail = detail;
          that.$refs['ruleForm'].validate(()=>{return false;});
        }
      });
    },
    //修改库存
    clickNewItemStock(){
      let that = this;
      let { detail } = that;
      NumberKey.show({
        num: detail.new_item_stock || '',
        type: 'Number',
        confirm(num){
          detail.new_item_stock = num;
          that.$data.detail = detail;
          that.$refs['ruleForm'].validate(()=>{return false;});
        }
      });
    },

    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api.itemPriceFix, {
        ...detail,
        item_stock: detail.new_item_stock,
        price_buy: this.handlePrice(detail.price_buy),
        price_sale: this.handlePrice(detail.price_sale)
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        //data.index = detail.index;
        this.$message({message: '商品已报价', type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemPricing');
        pc.getData(pc.query);
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

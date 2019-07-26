<template>
  <div class="receiving-allot">
    <el-dialog :title="`报价：${detail.code} ${detail.title}`" :visible="isShow" width="680px" :before-close="cancel" :close-on-click-modal="false">
      <el-form label-position="right" label-width="100px" style="width: 620px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="昨日询价">
              <span class="show-span">
                {{detail.price_buy_last}}&nbsp;元
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="今日询价" prop="price_buy">
              <span class="input-span" @click="clickPriceBuy">
                {{detail.price_buy}}
              </span>
              <span class="input-behind-span">元</span>
              <el-button size="mini" style="margin-left: 10px;" @click.native="usePriceBuyLast">使用昨日询价</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="计划加价率">
              <span class="show-span">
                {{detail.markup_rate}}%
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="建议价" prop="net_weight_temp">
              <span class="show-span">
                {{detail.suggest_price}}&nbsp;元
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="昨日销售价">
              <span class="show-span">
                {{detail.price_sale_last}}&nbsp;元
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="今日销售价" prop="price_sale">
              <span class="input-span" @click="clickPriceSale">
                {{detail.price_sale}}
              </span>
              <span class="input-behind-span">元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="库存">
              <span class="show-span">
                {{detail.item_stock}}&nbsp;件
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="新库存" prop="new_item_stock">
              <span class="input-span" @click="clickNewItemStock">
                {{detail.new_item_stock}}
              </span>
              <span class="input-behind-span">件</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancel">取 消</el-button>
        <el-button type="primary" @click.native="submit">确定报价</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Form, FormItem, Button, Dialog, Col, Row } from 'element-ui';
import { Constant, DataHandle, } from '@/util';
import { NumberKey } from '@/common';

export default {
  name: "ReceivingEditWeigh",
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-dialog': Dialog,
    'el-row': Row,
    'el-col': Col,
  },
  computed: mapGetters({
    isShow: 'itemPricingIsShowEdit',
    editData: 'itemPricingEditData'
  }),
  data(){
    return {
      province: this.$province,
      weightScope: Constant.WEIGHT_SCOPE,//重量浮动范围
      detail: {},
      query: {
        item_id: '',
        price_buy: '',
        price_sale: '',
        item_stock: '',
        province_code: '',
        is_quoted: '',
        is_approve: '',
        buyer_id: '',
        display_class_code: '',
        opt_date: ''
      },
      rules: {
        price_buy: [
          { required: true, message: '请输入今日询价', trigger: 'change' },
          { type: 'number', min: 0.01, message: '请输入今日询价', trigger: 'change' }
        ],
        price_sale: [
          { required: true, message: '请输入今日销售价', trigger: 'change' },
          { type: 'number', min: 0.01, message: '请输入今日销售价', trigger: 'change' }
        ],
        new_item_stock: [
          { required: true, message: '请输入库存', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    //返回建议价(今日询价，加价率)
    returnSuggestPrice(priceBuy, markupRate){
      return DataHandle.returnSuggestPrice(priceBuy, markupRate);
    },
    //使用昨日询价
    usePriceBuyLast(){
      let that = this;
      let { detail } = that;
      let price = detail.price_buy_last; //昨日采购价
      let markupRate = detail.markup_rate; //加价率
      let priceSale = that.returnSuggestPrice(price, markupRate); //今日售价(从建议价读取)
      detail.suggest_price = priceSale;
      detail.price_buy = price;
      detail.price_sale = Number(priceSale);
      that.$data.detail = detail;
      that.$refs['ruleForm'].validate(()=>{return false;});
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
          let markupRate = detail.markup_rate; //加价率
          let priceSale = that.returnSuggestPrice(price, markupRate); //今日售价(从建议价读取)
          detail.suggest_price = priceSale;
          detail.price_buy = price;
          detail.price_sale = Number(priceSale);
          that.$data.detail = detail;
          that.$refs['ruleForm'].validate(()=>{return false;});
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
    //取消
    cancel(){
      this.itemPricingShowHideEdit({ isShow: false });
      setTimeout(()=>{
        this.$refs['ruleForm'].resetFields();
      },0);
    },

    //确认提交
    submit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail, query } = that;
          query.item_id = detail.item_id;
          query.price_buy = DataHandle.handlePrice(detail.price_buy);
          query.price_sale = DataHandle.handlePrice(detail.price_sale);
          query.item_stock = detail.new_item_stock;

          that.itemPricingPriceFix({
            data: query,
            callback: (data)=>{
              data.index = detail.index;
              let c = that.$attrs.callback;
              typeof c === 'function' && c(data);//回调
              that.cancel();
            }
          });
        } else {
          return false;
        }
      });
    },
    ...mapActions(['itemPricingShowHideEdit', 'itemPricingPriceFix'])
  },
  watch:{
    editData: {
      deep: true,
      handler: function (a, b) {
        let that = this;
        let { query } = this;
        let d = {};
        if(a){
          if (a.query) {
            query.is_quoted = a.query.is_quoted === '' ? null : a.query.is_quoted;
            query.is_approve = a.query.is_approve === '' ? null : a.query.is_approve;
            query.buyer_id = a.query.buyer_id === '' ? null : a.query.buyer_id;
            query.display_class_code = a.query.display_class_code === '' ? null : a.query.display_class_code;
            query.province_code = a.query.province_code;
            query.opt_date = a.query.opt_date
          }

          d = JSON.parse( JSON.stringify(a));
          d.new_item_stock = d.item_stock;
          d.price_buy_last = Number(d.price_buy_last);
          d.price_buy = d.price_buy ? Number(d.price_buy) : '';
          d.price_sale = d.price_sale ? Number(d.price_sale) : '';
        }
        that.$data.detail = d;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .show-span{
    font-size: 18px;
  }
  .input-span{
    font-size: 18px;
    border: 1px solid #999;
    width: 106px;
    height: 32px;
    line-height: 32px;
    border-radius: 3px;
    float: left;
    text-align: center;
  }
  .input-behind-span{
    height: 34px;
    line-height: 34px;
    float: left;
    font-size: 18px;
    margin-left: 5px;
  }
</style>

<template>
  <div>
    <el-dialog :title="`${detail.id?'修改':'新增'}商品`" :visible="isShow" width="1200px" top="5vh" append-to-body :before-close="handleCancel" :close-on-click-modal="false">
      <el-form class="custom-form" label-position="right" label-width="110px" style="width: 98%" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="商品图片">
          <image-preview>
            <img style="width: 64px; height: 64px; margin-right: 10px" v-for="(item, index) in detail.images" :key="index" :src="tencentPath + item + '_min200x200'" alt=""/>
          </image-preview>
        </el-form-item>
        <h6 class="subtitle" style="padding-bottom: 16px">基本信息</h6>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="商品名称">{{detail.title}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="框"><span v-if="detail.frame_code">{{detail.frame.title}}&nbsp;(&yen;{{returnPrice(detail.frame.price)}})</span></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产地">{{detail.origin_place}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="包装规格">{{detail.package_spec}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格">{{detail.item_spec}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="毛重">{{returnWeight(detail.gross_weight)}}斤</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="净重">{{returnWeight(detail.net_weight)}}斤</el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="科学分类">{{detail.system_class.title}}</el-form-item>
          </el-col>
        </el-row>
        <h6 class="subtitle" style="padding-bottom: 16px">销售信息</h6>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="采购价" prop="price_buy_temp">
              <el-input size="medium" v-model="detail.price_buy_temp" placeholder="0 - 1000000"><template slot="append">元</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售价" prop="price_sale_temp">
              <el-input size="medium" v-model="detail.price_sale_temp" @input="changePriceSale" placeholder="0 - 1000000"><template slot="append">元</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="markup_rate_temp">
              <el-input size="medium" v-model="detail.markup_rate_temp" placeholder="0 - 1000"><template slot="append">元</template></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="原价" prop="price_origin">
              <el-input size="medium" v-model="detail.price_origin" placeholder="0 - 1000000"><template slot="append">元</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="展示分类" prop="display_class_code">
              <my-select-display-class size="medium" v-model="detail.display_class_code"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大订货数量" prop="order_num_max">
              <el-input size="medium" v-model="detail.order_num_max" placeholder="1 - 999" :maxlength="3">
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="库存" prop="item_stock">
              <el-input size="medium" v-model="detail.item_stock" :maxlength="6"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="rank">
              <el-input size="medium" v-model="detail.rank" :maxlength="3"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否赠品" prop="order_is_gift">
              <el-radio v-model="detail.is_gift" :label="true" border size="mini">是</el-radio>
              <el-radio v-model="detail.is_gift" :label="false" border size="mini">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item v-if="!detail.is_gift" label="是否预售" prop="">
              <el-radio v-model="detail.is_presale" :label="true" border size="mini">是</el-radio>
              <el-radio v-model="detail.is_presale" :label="false" border size="mini">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="!detail.is_gift && detail.is_presale" label="配送日期" prop="presale_date">
              <el-date-picker
                style="width: 100%"
                v-model="detail.presale_date"
                type="daterange"
                value-format="yyyy-MM-dd"
                :picker-options="fixDateOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <h6 class="subtitle" style="padding-bottom: 16px">其他信息</h6>
        <el-row :gutter="0">
          <el-col :span="8">
            <el-form-item label="内标签" prop="">
              
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品详情">
          <div class="content-div" v-html="detail.content"></div>
        </el-form-item>
        <el-form-item>
          <div style="float: right">
            <el-button @click.native="handleCancel">取 消</el-button>
            <el-button type="primary" @click.native="submitAddEdit">确 认</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, DataHandle, Verification, Constant } from '@/util';
import { SelectDisplayClass } from '@/common';

export default {
  name: "AddEditItemList",
  mixins: [addEditMixin],
  components: {
    'my-select-display-class': SelectDisplayClass
  },
  created() {
    this.$data.detail.province_code = this.province.code;
  },
  data(){
    let validPresaleDate = function (rules, value, callback) {
      if (!value) {
        callback(new Error('请选择配送日期'));
        return
      }
      let dateStart = Date.parse(value[0]);
      let now = new Date().getTime();

      if (dateStart < now) {
        callback(new Error('起始日期必须选择今天以后的日期'));
      } else {
        callback();
      }
    };
    let validOrderNum = function (rules, value, callback) {
      let num = parseInt(value);
      if (typeof num === 'number') {
        if (num > 999) {
          callback(new Error('最大订货件数为999'))
        } else if (num < 1) {
          callback('最大订货件数不能小于1')
        } else {
          callback()
        }
      } else {
        callback('必须是数值类型')
      }
    };
    let validPriceBuy = function (rules, value, callback) {
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 1000000) {
          callback('采购价不能超过1000000')
        } else if (numStr.indexOf('.') > 2) {
          callback('最多只能输入2位小数')
        } else {
          callback()
        }
      } else {
        callback('必须是数值类型')
      }
    };
    let validPriceSale = function (rules, value, callback) {
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 1000000) {
          callback('售价不能超过1000000')
        } else if (numStr.indexOf('.') > 2) {
          callback('最多只能输入2位小数')
        } else {
          callback()
        }
      } else {
        callback('必须是数值类型')
      }
    };
    let validMarkupRate = function (rules, value, callback) {
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 1000) {
          callback('计划加价率不能超过1000')
        } else if (numStr.indexOf('.') > 1) {
          callback('最多只能输入1位小数')
        } else {
          callback()
        }
      } else {
        callback('必须是数值类型')
      }
    };
    let validPriceOrigin = function (rules, value, callback) {
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 1000000) {
          callback('原价不能超过1000000')
        } else if (numStr.indexOf('.') > 2) {
          callback('最多只能输入2位小数')
        } else {
          callback()
        }
      } else {
        callback('必须是数值类型')
      }
    };
    let validCityPercent = function (rules, value, callback) {
      if (isNaN(value)) {
        return callback(new Error('必须是数值类型'));
      }
      let num = Number(value);
      if (typeof num === 'number' && value) {
        let numStr = num.toString().split('').reverse();
        if (numStr.indexOf('.') > 1) {
          callback(new Error('最多只1位小数'))
        } else if (num === 0) {
          callback(new Error('不能等于零'));
        } else if (num <= -100) {
          callback(new Error('必须大于-100%'));
        } else if (num > 1000) {
          callback(new Error('不能超过1000%'));
        } else {
          callback()
        }
      }
    };
    let validCityPrice = function (rules, value, callback) {
      console.log("value");
      if (value > 1000000) {
        callback(new Error('不能超过1000000'));
      } else {
        callback();
      }
    };
    let validGrossWeight = function (rules, value, callback) {
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 100000) {
          callback('毛重不能超过100000')
        } else if (numStr.indexOf('.') > 1) {
          callback('最多只能输入1位小数')
        } else {
          callback()
        }
      } else {
        callback('必须是数值类型')
      }
    };
    let validNetWeight = function (rules, value, callback) {
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 100000) {
          callback('净重不能超过100000')
        } else if (numStr.indexOf('.') > 1) {
          callback('最多只能输入1位小数')
        } else {
          callback()
        }
      } else {
        callback('必须是数值类型')
      }
    };
    return {
      id: 0,
      upData: {},//上传数据
      systemClassList: [], //科学分类列表
      scientificTypeList: [],
      isShowSelectSystemClass: false,
      selectSystemClassData: [], //当前选择的科学分类
      initDetail: {
        images: [],
        sale_unit: '件',
        sale_unit_gift: '件',
        is_weigh: true,
        markup_rate_temp: 10,
        tags: [],
        content: '',
        is_presale: false,
        is_gift: false,
        order_num_max: 999,
        city_prices_temp: []
      },
      systemClassProps: {
        value: 'code',
      },
      cityList: [],
      /*
        今日
        昨日
        最近30天（以当天作为结尾，往前30天）
        本周
        上周
        本月（以本月作为选择）
        上月（以当前所在月的上一个月作为选择）*/
      fixDateOptions: Constant.FIX_DATE_RANGE,
      rules: {
        images: [
          { type: 'array', required: true, message: '至少要上传一张图片', trigger: 'change' }
        ],
        code: [
          { required: true, message: '商品编号不能为空', trigger: 'change' },
          { pattern: Verification.testStrs.isInteger, message: '商品编号只能是数字', trigger: 'blur' },
          { max: 6, message: '编号不能大于6位数字', trigger: 'blur' }
        ],
        title: [
            { required: true, message: '商品名称不能为空', trigger: 'change' },
            { max: 20, message: '商品名称不能超过20个字符', trigger: 'blur' }
        ],
        price_buy_temp: [
            { required: true, message: '请输入采购价', trigger: 'change' },
            { pattern: Verification.testStrs.isValidValue, message: '采购价必须为数字', trigger: 'blur' },
            { validator: validPriceBuy, trigger: 'blur' },
        ],
        price_sale_temp: [
          { required: true, message: '请输入售价', trigger: 'change' },
          { pattern: Verification.testStrs.isValidValue, message: '售价必须为数字', trigger: 'blur' },
          { validator: validPriceSale, trigger: 'blur' },
        ],
        markup_rate_temp: [
          { required: true, message: '请输入加价率', trigger: 'change' },
          { pattern: Verification.testStrs.isValidValue, message: '计划加价率必须为数字', trigger: 'blur' },
          { validator: validMarkupRate, trigger: 'blur' },
        ],
        price_origin: [
          { pattern: Verification.testStrs.isValidValue, message: '原价必须为数字', trigger: 'change' },
          { validator: validPriceOrigin, trigger: 'blur' },
        ],
        package_spec: [
          { required: true, message: '包装规格不能为空', trigger: 'change' },
          { max: 6, message: '包装规格不能超过6个字符', trigger: 'blur' }
        ],
        item_spec: [
          { required: false },
          { max: 20, message: '规格不能超过20个字符', trigger: 'blur' }
        ],
        origin_place: [
          { required: true, message: '产地不能为空', trigger: 'change' },
          { max: 30, message: '产地不能超过30个字符', trigger: 'blur' }
        ],
        gross_weight_temp : [
          { required: true, message: '请输入毛重', trigger: 'change' },
          { pattern: Verification.testStrs.isValidValue, message: '毛重必须为数字', trigger: 'blur' },
          { validator: validGrossWeight, trigger: 'blur' },
        ],
        net_weight_temp: [
          { required: true, message: '请输入净重', trigger: 'change' },
          { pattern: Verification.testStrs.isValidValue, message: '净重必须为数字', trigger: 'blur' },
          { validator: validNetWeight, trigger: 'blur' },
        ],
        order_num_max: [
          { required: true, message: '请输入最大订货件数', trigger: 'change' },
          { pattern: Verification.testStrs.isNumber, message: '最大订货件数必须为整数', trigger: 'blur' },
          // { type: 'number', max: 3, message: '最大订货件数为999', trigger: 'blur' }
          { validator: validOrderNum, trigger: 'blur' },
        ],
        presale_date: [
          { validator: validPresaleDate, trigger: 'change' },
          { required: true, message: '请选择配送日期', trigger: 'change' }
        ],
        system_class_code: [
          { required: false, message: '请选择科学分类', trigger: 'change' }
        ],
        display_class_code: [
          { required: true, message: '请选择展示分类', trigger: 'change' }
        ],
        item_stock: [
          { pattern: Verification.testStrs.isNumber, message: '库存必须为整数', trigger: 'blur' },
        ],
        rank: [
          { pattern: Verification.testStrs.isNumber, message: '排序值必须为整数', trigger: 'blur' },
        ]
      },
      validCityPercent: validCityPercent,
      validCityPrice: validCityPrice
    }
  },
  methods: {

    changePriceSale() {
      let detail = this.$data.detail;
      if (!detail.price_sale_temp || isNaN(detail.price_sale_temp)) return;
      let city_prices_temp = this.$data.detail.city_prices_temp;
      city_prices_temp = city_prices_temp.map(item => {
        if (item.percent && !isNaN(item.percent)) {
          item.price = (Number(detail.price_sale_temp) + Number(this.returnMarkup(this.returnPrice((this.handlePrice(detail.price_sale_temp) * this.handleMarkup(item.percent) / 100))))).toFixed(2)
        }
        return item;
      });
    },
    //确认提交
    submitAddEdit(){
      let that = this;
      that.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { detail } = that;

          //判断是否赠品
          if (detail.is_gift) {
            detail.is_presale = false;
            detail.frame_code = '';
            detail.sale_unit = detail.sale_unit_gift
          }

          //判断是否预售商品
          if (detail.is_presale) {
            if (detail.presale_date) {
              detail.presale_begin = detail.presale_date[0];
              detail.presale_end = detail.presale_date[1]
            }
            delete detail.presale_date;
          }
          //如果商品单位为件，不需要称重（默认是需要）
          if (detail.sale_unit === '件') {
            detail.is_weigh = false
          }

          that.itemItemAddEdit({
            data: {
              ...detail,
              price_buy: that.handlePrice(detail.price_buy_temp),
              price_sale: that.handlePrice(detail.price_sale_temp),
              markup_rate: that.handleMarkup(detail.markup_rate_temp),
              price_origin: that.handlePrice(detail.price_origin),
              city_prices: detail.city_prices_temp.map(item => {
                let city = {...item};
                city.percent = that.handleMarkup(city.percent);
                return { city_code: city.city_code, percent: city.percent };
              }),
              gross_weight: that.handleWeight(detail.gross_weight_temp),
              net_weight: that.handleWeight(detail.net_weight_temp),
              rank: Number(detail.rank),
              item_stock: Number(detail.item_stock),
              order_num_max: Number(detail.order_num_max)
            },
            callback: (res)=>{
              that.$attrs.callback();//回调
              that.handleCancel();
            }
          });
        } else {
          return false;
        }
      });
    },
  },
  watch:{
    itemItemDetail: {
      deep: true,
      handler: function (a, b) {
        // 商品详情页也watch了itemItemDetail对象，打开详情页时，这里也会被调用，
        // detail对象会被填充，因此如果关闭详情页再新增，detail对象会复用之前
        // 填充的属性值，这里填充前先重置下detail对象
        this.resetDetailData();

        let that = this;
        let rd = JSON.parse( JSON.stringify( a ) );
        if(rd.id){
          rd.price_buy_temp = that.returnPrice(rd.price_buy);
          rd.price_sale_temp = that.returnPrice(rd.price_sale);
          rd.markup_rate_temp = that.returnMarkup(rd.markup_rate);
          rd.price_origin = that.returnPrice(rd.price_origin) || '';
          rd.city_prices_temp = rd.city_prices.map(item => {
            item.percent = that.returnMarkup(item.percent);
            item.price = rd.frame && rd.frame.price ? that.returnPrice(item.price_sale_piece - rd.frame.price) : that.returnPrice(item.price_sale_piece);
            return item;
          });
          rd.gross_weight_temp = that.returnWeight(rd.gross_weight);
          rd.net_weight_temp = that.returnWeight(rd.net_weight);
          if (rd.presale_begin && rd.presale_end) {
            rd.presale_date = Array(rd.presale_begin, rd.presale_end);
          }
        }

        if (!rd.province_code) {
          that.$data.detail.province_code = this.province.code
        }

        that.$data.detail = Object.assign({}, that.$data.detail, rd);

      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .subtitle{
    color: #5A5D64;
    margin-left: 20px;
    font-size: 14px;
  }
  .img-div{
    overflow: hidden;
    .img-item{
      float: left;
      width: 64px;
      height: 64px;
      margin-right: 10px;
      position: relative;
      >img{
        width: 64px;
        height: 64px;
      }
      .img-del{
        position: absolute;
        right: 0;
        top: 0;
        background: #ff5252;
        color: #fff;
        width: 18px;
        height: 18px;
        text-align: center;
        line-height: 18px;
        font-size: 14px;
      }
    }
    .add-btn{
      float: left;
      border: 1px dashed #999;
      width: 62px;
      height: 62px;
      color: #999;
      text-align: center;
      line-height: 62px;
      font-size: 32px;
      position: relative;
    }
    .add-btn > form > input{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      opacity: 0;
    }
  }


  .display-class-item{
    border-bottom: 1px solid #f3f4f6;
    padding: 10px;
  }

  .system-class{
    width: 500px;
    .select-div{
      border-bottom: 1px solid #f3f4f6;
      padding: 0 10px;
      height: 40px;
      line-height: 40px;
      span{
        display: inline-block;
        margin-left: 5px;
        background: #f3f4f6;
        padding: 0 10px;
        height: 32px;
        line-height: 32px;
        &.select{
          color: #999;
        }
      }
    }
    .content{
      width: 500px;
      top: 82px;
      .not-data{
        font-size: 14px;
        text-align: center;
        margin-top: 32px;
        color: #999;
      }
    }
    .bottom{
      width: 480px;
    }
  }
</style>

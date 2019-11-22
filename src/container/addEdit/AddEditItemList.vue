<template>
  <div>
    <add-edit-layout :title="pageTitles[pageType]" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
      <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="110px" style="width: 98%; max-width: 1400px;" :model="detail" :rules="rules" ref="ruleForm">
        <el-form-item label="商品图片">
          <image-preview>
            <img style="width: 64px; height: 64px; margin-right: 10px" v-for="(item, index) in detail.images" :key="index" :src="tencentPath + item + '_min200x200'" alt=""/>
          </image-preview>
        </el-form-item>
        <h6 class="subtitle" style="padding-bottom: 16px">基本信息</h6>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="编号/名称">{{detail.code}}/{{detail.title}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="筐">
              <span v-if="detail.frame_code">{{detail.frame.title}}&nbsp;(&yen;{{returnPrice(detail.frame.price)}})</span>
              <span v-else>-</span>
            </el-form-item>
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
            <el-form-item label="规格">{{detail.item_spec ? detail.item_spec : '-'}}</el-form-item>
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
          <el-col :span="16">
            <el-form-item label="价格标签" prop="inner_tag_id">
              <select-inner-tag clearable v-model="detail.inner_tag_id" :disabled="pageType === 'edit' ? true : false" size="medium"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="采购价" prop="price_buy">
              <input-price  placeholder="0 - 1000000" size="medium" v-model="detail.price_buy"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售价" prop="price_sale">
              <input-price  placeholder="0 - 1000000" size="medium" v-model="detail.price_sale"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价" prop="markup_rate">
              <!--销售价 / 毛重-->
              <input-price size="medium" disabled :value="detail.price_sale / (detail.gross_weight / 10)"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="原价" prop="price_origin">
              <input-price  placeholder="0 - 1000000" size="medium" v-model="detail.price_origin"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="展示分类" prop="display_class_code">
              <my-select-display-class size="medium" v-model="detail.display_class_code"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大订货数量" prop="order_num_max">
              <input-number size="medium" v-model="detail.order_num_max" placeholder="1 - 999" unit="件" :max="999"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="库存" prop="item_stock">
              <input-number size="medium" v-model="detail.item_stock" unit="件" :max="999999"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="rank">
              <input-number size="medium" v-model="detail.rank"/>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="!detail.frame_code">
            <el-form-item label="是否赠品" prop="order_is_gift">
              <el-radio v-model="detail.is_gift" :label="true" border size="mini">是</el-radio>
              <el-radio v-model="detail.is_gift" :label="false" border size="mini">否</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
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
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="区域定价">
              <ul>
                <li v-for="(item, index) in detail.city_prices_temp" :key="index" style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <el-form-item
                      :prop="'city_prices_temp.' + index + '.city_code'"
                      :rules="[{ required: true, message: '请选择所在仓', trigger: 'change' }]"
                    >
                      <el-select v-model="item.city_code" placeholder="请选择所在仓" size="medium">
                        <el-option
                          v-for="city in cityList"
                          :key="city.code"
                          :label="city.title"
                          :value="city.code"
                          :disabled="detail.city_prices_temp.some(item => item.city_code === city.code)"
                        >
                        </el-option>
                      </el-select>

                    </el-form-item>

                    <el-form-item
                      :prop="'city_prices_temp.' + index + '.percent'"
                      :rules="[
                        { required: true, message: '请输入浮动比例', trigger: 'change' },
                        { validator: validCityPercent, trigger: 'blur' },
                      ]"
                      style="margin-left: 10px;"
                    >
                      <el-input
                        style="width: 230px;"
                        v-model="item.percent"
                        @input="changeCityPercent(index)"
                        placeholder="浮动(-100% ~ 1000%)"
                        size="medium"
                      >
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>

                    <el-form-item
                      style="margin-left: 10px;"
                      :prop="'city_prices_temp.' + index + '.price'"
                      :rules="[
                          { validator: validCityPrice, trigger: 'change' },
                        ]"
                    >
                      <el-input
                        disabled
                        v-model="item.price"
                        placeholder="0 - 1000000"
                        style="width: 180px;"
                        size="medium"
                      >
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
                  </div>
                  <i style="margin-left: 10px; cursor: pointer;" class="el-icon-close icon-button" @click="handleRemoveCityPrice(index)"></i>
                </li>
              </ul>
              <!-- 新增区域定价按钮 -->
              <el-button plain size="medium" type="primary" @click="handleAddCityPrice">增加区域定价</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品标签" prop="tags">
              <select-item-tags v-model="detail.tags"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="商品详情">
              <div class="my-content-div" v-html="detail.content"></div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第一次上架人">
              <div style="line-height: 24px;">{{detail.first_grounder.realname}}<br/>{{detail.created}}</div>
            </el-form-item>
            <el-form-item label="最后更新人">
              <div style="line-height: 24px;">{{detail.last_updater.realname}}<br/>{{detail.updated}}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="margin-left: 110px;">
        <template v-if="judgeOrs(pageType, ['on_sale', 'edit'])">
          <el-button size="medium" @click.native="handleCancel">取 消</el-button>
          <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
        </template>
        <template v-else>
          <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
          <el-button size="medium" type="primary" @click.native="pageType = 'edit'" v-if="(auth.isAdmin || auth.ItemGlobalEdit) && detail.is_on_sale">修改销售信息</el-button>
          <el-button size="medium" type="primary" @click.native="pageType = 'on_sale'" v-else-if="(auth.isAdmin || auth.ItemListOnGround) && !detail.is_on_sale">上 架</el-button>
        </template>
      </div>
    </add-edit-layout>
  </div>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import Layout from './Layout';
import { Http, Config, DataHandle, Verification, Constant } from '@/util';
import { SelectDisplayClass, ImagePreview, InputNumber, InputPrice, SelectInnerTag, SelecItemTags } from '@/common';

export default {
  name: "AddEditItemList",
  mixins: [addEditMixin],
  components: {
    'input-price': InputPrice,
    'input-number': InputNumber,
    'select-inner-tag': SelectInnerTag,
    'select-item-tags': SelecItemTags,
    'my-select-display-class': SelectDisplayClass,
    'image-preview': ImagePreview
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
    let initDetail = {
      images: [],
      is_weigh: true,
      price_origin: '',
      inner_tag_id: '',
      tags: [],
      content: '',
      is_presale: false,
      is_gift: false,
      order_num_max: 999,
      display_class: {},
      frame: {},
      system_class: {},
      first_grounder: {},
      last_updater: {},
      city_prices_temp: []
    }
    return {
      initDetail: initDetail,
      detail: JSON.parse(JSON.stringify(initDetail)),
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
        price_buy: [
            { required: true, message: '请输入采购价', trigger: 'change' },
            { pattern: Verification.testStrs.isValidValue, message: '采购价必须为数字', trigger: 'blur' },
            { validator: validPriceBuy, trigger: 'blur' },
        ],
        price_sale: [
          { required: true, message: '请输入售价', trigger: 'change' },
          { pattern: Verification.testStrs.isValidValue, message: '售价必须为数字', trigger: 'blur' },
          { validator: validPriceSale, trigger: 'blur' },
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
        display_class_code: [
          { required: true, message: '请选择展示分类', trigger: 'change' }
        ],
        inner_tag_id: [
          { required: true, message: '请选择商品加价标签', trigger: 'change' }
        ],
      },
      pageTitles: {
        on_sale: '上架商品',
        edit: '修改销售信息',
        detail: '商品详情'
      },
      pageType: 'edit', //on_sale, edit, detail
    }
  },
  methods: {
    //根据传进来的省份code 获取城市列表
    async baseCityList(){
      let res = await Http.get(Config.api.baseCityList, {
        province_code: this.$province.code || '',
        zone_code: ''
      });
      if(res.code === 0){
        let rd = res.data;
        this.$data.cityList = rd;
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      this.baseCityList(); //获取城市列表
      if(data){
        this.itemDetail(data.id, type);
        this.$data.pageType = type;
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
        this.$data.isShow = true;
        this.$data.pageType = 'add';
      }
    },
    //获取详情
    async itemDetail(id, type){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.itemDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        //如果是上架
        if(type === 'on_sale'){
          rd.price_buy = rd.price_buy || '';
          rd.price_sale = rd.price_sale || '';
          rd.price_origin = rd.price_origin || '';
          rd.item_stock = rd.item_stock || '';
        }
        //配送时间
        if(rd.presale_begin && rd.presale_end){
          rd.presale_date = [rd.presale_begin, rd.presale_end];
        }
        //区域价格
        rd.city_prices_temp = rd.city_prices.map(item => {
          item.percent = this.returnMarkup(item.percent);
          item.price = this.returnPrice(item.price_sale);
          return item;
        });
        this.$data.detail = rd;
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //新增区域价格
    handleAddCityPrice() {
      let city_prices_temp = this.$data.detail.city_prices_temp;
      city_prices_temp.push({ city_code: '', percent: '', price: '' });
      this.$data.detail.city_prices_temp = city_prices_temp;
    },
    //删除区域价格
    handleRemoveCityPrice(i) {
      let city_prices_temp = this.$data.detail.city_prices_temp.filter((item, index) => index !== i);
      this.$data.detail.city_prices_temp = city_prices_temp;
    },
    //修改价格
    changePriceSale() {
      let detail = this.$data.detail;
      if (!detail.price_sale / 100 || isNaN(detail.price_sale / 100)) return;
      let city_prices_temp = this.$data.detail.city_prices_temp;
      city_prices_temp = city_prices_temp.map(item => {
        if (item.percent && !isNaN(item.percent)) {
          item.price = (Number(detail.price_sale / 100) + Number(this.returnMarkup(this.returnPrice((this.handlePrice(detail.price_sale / 100) * this.handleMarkup(item.percent) / 100))))).toFixed(2)
        }
        return item;
      });
    },
    //修改区域价格
    changeCityPercent(index) {
      let detail = this.$data.detail;
      let item = this.$data.detail.city_prices_temp[index];
      item.price = detail.price_sale / 100 && item.percent && !isNaN(detail.price_sale / 100) && !isNaN(item.percent)
        ? (Number(detail.price_sale / 100) + Number(this.returnMarkup(this.returnPrice((this.handlePrice(detail.price_sale / 100) * this.handleMarkup(item.percent) / 100))))).toFixed(2)
        : ''
      let city_prices_temp = this.$data.detail.city_prices_temp;
      city_prices_temp[index] = item;
      this.$data.detail.city_prices_temp = city_prices_temp;
    },
    //请选择所在仓
    onSystemClassChange(val) {
      this.nodeList(val.length - 1, val)
    },
    //获取要查询的节点
    nodeList(n, val) {
      // console.log('n = ', n, val)
      if (n < 0) {
        return;
      }
      if (n === 0) {
        let index = -1;
        for (let i = 0; i < this.scientificTypeList.length; i++) {
          if (this.scientificTypeList[i].code === val[n]) {
            index = i;
            break;
          }
        }
        if (!this.scientificTypeList[index].children || this.scientificTypeList[index].children.length === 0) {
          if (index >= 0) {
            this.baseSystemClassList(val[0], list => {
              this.scientificTypeList[index].children = list;
            });
          }
          return;
        } else {
          return this.scientificTypeList[index].children
        }
      }

      let parentNodeList = this.nodeList(n - 1, val);
      let currentIndex = -1;
      for (let i = 0; i < parentNodeList.length; i ++) {
        if (parentNodeList[i].code === val[n]) {
          currentIndex = i;
        }
      }
      if (!parentNodeList[currentIndex].children || parentNodeList[currentIndex].children.length === 0) {
        if (currentIndex >= 0) {
          this.baseSystemClassList(val[n], list => {
            parentNodeList[currentIndex].children = list;
          })
        }
      } else {
        return parentNodeList[currentIndex].children
      }
    },
    //提交数据
    async addEditData(){
      let { detail, pageType } = this;
      //判断是否预售商品
      if (detail.is_presale) {
        if (detail.presale_date) {
          detail.presale_begin = detail.presale_date[0];
          detail.presale_end = detail.presale_date[1]
        }
        delete detail.presale_date;
      }
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[pageType === 'edit' ? 'itemEdit' : 'itemOnGround'], {
        ...detail,
        city_prices: detail.city_prices_temp.map(item => {
          let city = {...item};
          city.percent = this.handleMarkup(city.percent);
          return { city_code: city.city_code, percent: city.percent };
        }),
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `商品${pageType === 'edit' ? '信息修改成功' : '已上架'}`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemList');
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
</style>
<style lang="scss">
  .my-content-div{
    width: 360px;
    min-height: 200px;
    border: 1px solid #ececec;
    padding: 0 10px;
    background: #F5F7FA;
    overflow: hidden;
    img{
      width: 100% !important;
    }
  }
</style>

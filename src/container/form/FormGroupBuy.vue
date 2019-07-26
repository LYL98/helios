<template>
  <div>
    <el-form :model="editItem" style="width: 1000px;" label-position="right" label-width="140px" ref="ruleForm" :rules="rules">
      <my-form-area label="新建商品信息">
        <el-row>
          <el-col :span="7">
            <el-form-item label="商品封面" prop="cover_images">
              <!--<div v-if="isDisableRow(editItem)" class="img-div" style="flex: 1;">-->
              <!--<my-image-preview>-->
              <!--<img -->
              <!--style="width: 64px; height: 64px; margin-right: 10px" -->
              <!--:src="tencentPath + editItem.cover_images + '_min200x200'" -->
              <!--alt=""-->
              <!--/></my-image-preview>-->
              <!--</div>-->
              <my-upload-img v-model="editItem.cover_images" module="groupBuy" :limit="1"></my-upload-img>
              <div style="color: #999; font-size: 12px;">建议上传图片尺寸 2 : 1</div>
            </el-form-item>
          </el-col>
          <el-col :span="17">
            <el-form-item label="商品轮播图" prop="item_images">
              <div style="display: flex; justify-content: space-between">
                <!--<div v-if="isDisableRow(editItem)" class="img-div" style="flex: 1;">-->
                <!--<my-image-preview>-->
                <!--<img-->
                <!--style="width: 64px; height: 64px; margin-right: 10px"-->
                <!--v-for="(item, index) in editItem.item_images"-->
                <!--:key="index"-->
                <!--:src="tencentPath + item + '_min200x200'"-->
                <!--alt=""-->
                <!--/></my-image-preview>-->
                <!--</div>-->
                <my-upload-img v-model="editItem.item_images" module="groupBuy" :limit="5"></my-upload-img>
                <div style="display: flex;flex-direction: column-reverse">
                  <el-button size="small" style="float: right; flex: none;" @click="handleBannerPreview">查看海报预览</el-button>
                  <my-image-preview ref="imgPreview"></my-image-preview>
                </div>
              </div>
              <div style="color: #999; font-size: 12px;">建议上传图片尺寸 1 : 1</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="商品名" prop="item_title">
            <el-input size="medium" v-model="editItem.item_title" :maxlength="25" placeholder="请输入25位以内的字符"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="团长价" prop="price_sale">
              <el-input size="medium"
                        :disabled="isDisableRow(editItem)"
                        v-model="editItem.price_sale"
                        @change="handlePriceSaleChange"
                        placeholder="0 - 1000000">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="rank">
              <el-input size="medium" v-model="editItem.rank" placeholder="排序值越高团购排名越靠前"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品详情">
          <my-quill-editor v-model="editItem.content" module="item"></my-quill-editor>
        </el-form-item>
      </my-form-area>
      <my-form-area label="设置团购信息">
        <el-row>
          <el-col :span="14">
            <el-form-item label="团购时间" prop="pickerValue" class="required">
              <el-date-picker
                style="width: 400px;"
                :disabled="isDisableRow(editItem)"
                v-model="editItem.pickerValue"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="changePicker"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="发货日期" prop="delivery_date" class="required">
              <el-date-picker
                :clearable="false"
                style="width: 100%;"
                placeholder="发货日期"
                :disabled="isDisableRow(editItem)"
                v-model="editItem.delivery_date"
                type="date"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="14">
            <el-form-item label="单人最高购买数量" prop="max_num_pp">
              <el-input style="width: 400px;" :disabled="isDisableRow(editItem)" size="medium" v-model="editItem.max_num_pp" placeholder="1 - 100000" :maxlength="6">
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="成团件数" prop="gb_num">
              <el-input :disabled="isDisableRow(editItem)" size="medium" v-model="editItem.gb_num" placeholder="1 - 100000" :maxlength="6">
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="团购价" prop="price">
              <div style="display: flex;">
                <el-input :disabled="isDisableRow(editItem)"
                          size="medium"
                          style="width: 400px;"
                          v-model="editItem.price"
                          placeholder="0 - 1000000">
                  <template slot="append">元</template>
                </el-input>
                <div style="flex: none; width: 40px; text-align: center; justify-content: center;">
                  <el-tooltip effect="dark" content="团购价：商品的基础价格，没有阶梯时则按照团购价进行售卖" placement="bottom">
                    <i class="el-icon-question" style="font-size: 20px;"></i>
                  </el-tooltip>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="库存" prop="stock_num">
              <div style="display: flex">
                <el-input size="medium" v-model="editItem.stock_num" placeholder="1 - 100000" :maxlength="6">
                  <template slot="append">件</template>
                </el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="原价" prop="price_origin">
              <div style="display: flex;">
                <el-input :disabled="isDisableRow(editItem)"
                          size="medium"
                          style="width: 400px;"
                          v-model="editItem.price_origin"
                          placeholder="0 - 1000000">
                  <template slot="append">元</template>
                </el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-row>-->
          <!--<el-col :span="12">-->
            <!--<el-form-item label="团购价" prop="price">-->
              <!--<div style="display: flex;">-->
                <!--<el-input :disabled="isDisableRow(editItem)"-->
                          <!--size="medium"-->
                          <!--style="flex: 1;"-->
                          <!--v-model="editItem.price"-->
                          <!--placeholder="0 - 1000000">-->
                  <!--<template slot="append">元</template>-->
                <!--</el-input>-->
                <!--<div style="flex: none; width: 40px; text-align: center; justify-content: center;">-->
                  <!--<el-tooltip effect="dark" content="团购价：商品的基础价格，没有阶梯时则按照团购价进行售卖" placement="bottom">-->
                    <!--<i class="el-icon-question" style="font-size: 20px;"></i>-->
                  <!--</el-tooltip>-->
                <!--</div>-->
              <!--</div>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
        <!--</el-row>-->

        <el-form-item label="阶梯优惠" :error="error.rules">
          <ul class="rules">
            <li v-for="(item, index) in editItem.rules" :key="'rule-' + index">
              <div style="display: flex;">
                <div style="display: flex;flex: initial;">
                  <span style="margin-right: 10px;">满</span>
                  <el-form-item
                    :prop="'rules.' + index + '.full'"
                    :rules="[
                { required: true, message: '件数不能为空', trigger: 'change' },
                { validator: validFull, trigger: 'blur' }
              ]"
                  >
                    <div style="display: flex; align-items: center;">
                      <el-input :disabled="isDisableRow(editItem)" size="small" style="width: 140px;" v-model.trim="item.full">
                      </el-input>
                      <span style="margin-left: 10px;">件</span>
                    </div>
                  </el-form-item>
                  <span style="margin-left: 30px; margin-right: 10px;">售</span>
                  <el-form-item
                    :prop="'rules.' + index + '.price'"
                    :rules="[
                { required: true, message: '售价不能为空', trigger: 'change' },
                { validator: validPrice, trigger: 'blur' },
                { validator: validRulePrice, trigger: 'blur' }
              ]"
                  >
                    <div style="display: flex; align-items: center;">
                      <el-input :disabled="isDisableRow(editItem)" size="small" style="width: 140px;" v-model.trim="item.price">
                      </el-input>
                      <span style="margin-left: 10px;">元</span>
                    </div>
                  </el-form-item>
                </div>
                <i class="el-icon-close icon-button" style="flex: none; margin-left: 20px" v-if="!isDisableRow(editItem)" @click="handleRemoveRule(index)"></i>
              </div>
            </li>
          </ul>
          <div class="rule-plus" :style="editItem.rules.length === 0 ? 'margin-top: 0px' : ''" v-if="editItem.rules.length < 3 && !isDisableRow(editItem)" @click="handleAddRule" >
            <i class="el-icon-circle-plus icon-button" style="margin-left: 0px;"></i>
            <span>增加阶梯优惠</span>
          </div>
        </el-form-item>
      </my-form-area>

      <my-form-area label="设置团购分享信息">
        <el-row>
          <el-col :span="12">
            <el-form-item label="分享文案" prop="share_content">
              <el-input size="medium" v-model="editItem.share_content" :maxlength="30" placeholder="请输入团购商品分享文案"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分享图片" prop="share_content">
              <my-upload-img v-model="editItem.share_images" module="groupBuy" :limit="1"></my-upload-img>
              <div style="color: #999; font-size: 12px;">上传图片尺寸为 5 : 4</div>
            </el-form-item>
          </el-col>
        </el-row>
      </my-form-area>

      <el-row>
        <el-col :span="12">
          <el-form-item v-if="!isEditMode" label="是否立即上架" prop="order_num_max">
            <el-checkbox v-model="editItem.status" :disabled="isEditMode"></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="isEditMode ? 24 : 12">
          <el-form-item style="display: flex; justify-content: flex-end;">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" :loading="sending" @click="handleSubmit">确认</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { Form, FormItem, Table, TableColumn, DatePicker, Radio, RadioGroup, Input, Button, Message, Row, Col, Checkbox, Dialog, Tooltip, Select, Option } from 'element-ui';
  import {FormArea, UploadImg, QuillEditor, ImagePreview} from '@/common';
  import {SearchItem} from "@/container/search";
  import { DataHandle, Verification, Config } from '@/util';
  import preview_img from '@/assets/img/preview_group_buy.jpg'

  export default {
    name: "FormGroupBuy",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-date-picker': DatePicker,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'el-input': Input,
      'el-button': Button,
      'el-col': Col,
      'el-row': Row,
      'el-dialog': Dialog,
      'el-checkbox': Checkbox,
      'el-tooltip': Tooltip,
      'el-select': Select,
      'el-option': Option,
      'my-form-area': FormArea,
      'my-search-item': SearchItem,
      'my-upload-img': UploadImg,
      'my-quill-editor': QuillEditor,
      'my-image-preview': ImagePreview,
    },
    props: {
      item: {type: Object, required: true}, // 需要编辑的项
      dialogType: { type: String, required: true },
      submit: {type: Function, required: true},
      close: {type: Function, required: true},
      sending: {type: Boolean, required: true}
    },
    model: {
      prop: 'item',
      event: 'change'
    },
    data() {
      let that = this;
      let item = Object.assign({}, this.$props.item);
      let type = this.$props.dialogType;

      let validPickerValue = function (rules, value, callback) {
        if (value) {
          if (value.length <= 0) {
            return callback(new Error('请选择活动开始和结束时间'));
          } else if (new Date().getTime() > new Date(value[1]).getTime()) {
            return callback(new Error('活动结束时间不能小于当前时间'));
          } else if (value[0] === value[1]) {
            return callback(new Error('活动开始和结束时间不能相等'));
          } else {
            // 如果日期合法，并且发货日期存在的情况下，则重新验证发货日期。
            item.delivery_date && that.$refs['ruleForm'] && that.$refs['ruleForm'].validateField('delivery_date');
            callback();
          }
        } else {
          return callback(new Error('请选择活动开始和结束时间'));
        }
      };

      let validDeliveryDate = function (rules, value, callback) {
        if (value) {
          if (item.end_time && new Date(value).getTime() < new Date(DataHandle.returnDateFormat(item.end_time, 'yyyy-MM-dd')).getTime()) {
            return callback(new Error('发货日期不能小于团购的结束日期'));
          } else {
            callback();
          }
        } else {
          return callback(new Error('请选择发货日期'));
        }
      };

      let validFull = function(rules, value, callback) {
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('满件数必须为大于零的纯数字'));
        }
        if (!!value && String(value).indexOf(".") > -1) {
          return callback(new Error('满件数必须为整数'));
        }
        if (!!value && Number(value) > 100000) {
          return callback(new Error('满件数不能超过100000'));
        }
        if (!!value && Number(value) <= 1) {
          return callback(new Error('件数必须大于1'));
        }
        callback();
      };

      let validPriceSale = function (rules, value, callback) {
        let num = Number(value);
        if (typeof num === 'number') {
          let numStr = num.toString().split('').reverse();
          if (num > 1000000) {
            callback('金额不能超过1000000')
          } else if (numStr.indexOf('.') > 2) {
            callback('最多只能输入2位小数')
          } else if(num <= 0) {
            callback('金额必须大于0')
          } else {
            callback();
          }
        } else {
          callback('必须是数值类型')
        }
      };

      let validPriceSaleExtra = function (rules, value, callback) {
        if (Number(item.price) < Number(item.price_sale)) {
          callback('团购价必须大于等于团长价')
        } else {
          callback()
        }
      };

      let validRulePrice = function (rules, value, callback) {
        let rulePrice = Number(value);
        if (rulePrice <= Number(item.price_sale) ||  rulePrice >= Number(item.price)) {
          callback('售价须在团长价和团购价之间')
        } else {
          callback()
        }
      };

      let validStock = function (rules, value, callback) {
        let num = Number(value);
        if (typeof num === 'number') {
          if (num > 100000) {
            callback('库存不能超过100000')
          } else if(num <= 0) {
            callback('库存必须大于0')
          } else {
            callback();
          }
        } else {
          callback('必须是数值类型')
        }
      };

      let validMaxNumPP = function (rules, value, callback) {
        let num = Number(value);
        if (typeof num === 'number') {
          if (num > 100000) {
            callback('数量不能超过100000')
          } else if(num <= 0) {
            callback('数量必须大于0')
          } else {
            callback();
          }
        } else {
          callback('必须是数值类型')
        }
      };

      let validRank = function (rules, value, callback) {
        if (value) {
          if (isNaN(value) || String(value).indexOf(".") > -1) {
            callback(new Error('排序值必须是整数'))
          } else if (value > 100000) {
            callback('排序值不能超过100000')
          } else if(value < 0) {
            callback('排序值不能为负')
          } else {
            callback();
          }
        } else {
          callback()
        }
      };

      let validGroupBuyNum = function (rules, value, callback) {
        let num = Number(value);
        if (typeof num === 'number') {
          if (num > 100000) {
            callback('成团件数不能超过100000')
          } else if(num <= 0) {
            callback('成团件数必须大于0')
          } else {
            callback();
          }
        } else {
          callback('必须是数值类型')
        }
      };

      return {
        tencentPath: Config.tencentPath,
        editItem: item,
        isEditMode: this.dialogType === 'edit',
        error: {
          rules: '',
          items: ''
        },
        rules: {
          cover_images: [
            { type: 'array', required: true, message: '请上传图片', trigger: 'change' }
          ],
          item_images: [
            { type: 'array', required: true, message: '至少要上传一张图片', trigger: 'change' }
          ],
          item_title: [
            { required: true, message: '品名不能为空', trigger: 'change' }
          ],
          price_sale: [
            { required: true, message: '请输入团长价', trigger: 'change' },
            { pattern: Verification.testStrs.isValidValue, message: '团长价必须为数字', trigger: 'blur' },
            { validator: validPriceSale, trigger: 'blur' },
          ],
          rank: [
            { validator: validRank, trigger: 'change' },
          ],
          price: [
            { required: true, message: '请输入团购价', trigger: 'change' },
            { pattern: Verification.testStrs.isValidValue, message: '团购价必须为数字', trigger: 'blur' },
            { validator: validPriceSale, trigger: 'blur' },
            { validator: validPriceSaleExtra, trigger: 'blur'}
          ],
          price_origin: [
            { required: true, message: '请输入原价', trigger: 'change' },
            { pattern: Verification.testStrs.isValidValue, message: '原价必须为数字', trigger: 'blur' },
            { validator: validPriceSale, trigger: 'blur' },
            // { validator: validPriceSaleExtra, trigger: 'blur'}
          ],
          pickerValue: [
            { validator: validPickerValue, trigger: 'blur' }
          ],
          delivery_date: [
            { validator: validDeliveryDate, trigger: 'change' }
          ],
          max_num_pp: [
            { required: true, message: '单人最高购买数量不能为空', trigger: 'change' },
            { pattern: Verification.testStrs.isNumber, message: '购买数量必须为整数', trigger: 'blur' },
            { validator: validMaxNumPP, trigger: 'blur' }
          ],
          gb_num: [
            { required: true, message: '成团件数不能为空', trigger: 'change' },
            { pattern: Verification.testStrs.isNumber, message: '件数必须为整数', trigger: 'blur' },
            { validator: validGroupBuyNum, trigger: 'blur' }
          ],
          stock_num: [
            { required: true, message: '请输入库存', trigger: 'change' },
            { pattern: Verification.testStrs.isNumber, message: '库存必须为整数', trigger: 'blur' },
            { validator: validStock, trigger: 'blur'}
          ],
        },
        validPickerValue: validPickerValue,
        validFull: validFull,
        validPrice: validPriceSale,
        validRulePrice: validRulePrice,
        previewImage: preview_img
      }
    },
    created() {
    },
    methods: {

      isDisableRow(item) {
        let { isEditMode } = this;
        //编辑模式 而且是已生效状态, 团购中 -> 失效输入框
        //status = true 已生效
        //status = false 未生效

        return isEditMode;
      },

      handlePriceSaleChange(value) {
        let priceSale = Number(value);
        this.$set(this.$data.editItem, 'price', DataHandle.keepTwoDecimal(priceSale * 1.1));
      },

      //搜索日期
      changePicker(value){
        // console.log('changePicker: ', value)
        if(value && value.length === 2){
          this.$data.error.items = '';
          this.$data.editItem.start_time = value[0];
          this.$data.editItem.end_time = value[1];
        }else{
          this.$data.editItem.pickerValue = null;
          this.$data.editItem.start_time = '';
          this.$data.editItem.end_time = '';
        }
      },

      handleRemoveRule(index) {
        this.editItem.rules = this.editItem.rules.filter((item, i) => i !== index);
      },
      handleAddRule() {
        // 新增活动规则
        this.$data.editItem.rules.push({ full: null, price: null });
      },

      validRules() {
        let { editItem } = this;

        //件数递增排序
        editItem.rules.sort((a, b) => Number(a.full) - Number(b.full));

        //验证金额是否递减
        let isPriceDescend = true;
        for (let i = 0; i < editItem.rules.length - 1; i++) {
          let rule = editItem.rules[i];
          let ruleNext = editItem.rules[i+1];
          if (Number(rule.price) <= Number(ruleNext.price)) {
            isPriceDescend = false;
            break;
          }
        }

        if (!isPriceDescend) {
          Message({
            showClose: true,
            message: '价格阶梯需满足件数递增，价格递减的规则，请重新填写',
            type: 'error'
          });
        }

        //验证件数是否递增
        let isFullIncrement = true;
        for (let i = 0; i < editItem.rules.length - 1; i++) {
          let rule = editItem.rules[i];
          let ruleNext = editItem.rules[i+1];
          if (Number(rule.full) >= Number(ruleNext.full)) {
            isFullIncrement = false;
            break;
          }
        }

        if (!isFullIncrement) {
          Message({
            showClose: true,
            message: '件数阶梯需满足件数递增，价格递减的规则，请重新填写',
            type: 'error'
          });
        }

        return isPriceDescend && isFullIncrement;
      },

      handleSubmit() {
        this.$refs['ruleForm'].validate(valid => {
          if (valid && this.validRules()) {
            this.$emit('change', this.$data.editItem);
            this.$props.submit(this.$data.editItem);
          }
        })
      },

      handleClose() {
        this.$props.close();
      },

      handleBannerPreview() {
        this.$refs.imgPreview.showImageManual(this.$data.previewImage)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rules {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        align-items: center;
      }
    }
    li + li {
      margin-top: 20px;
    }
  }
  .img-div{
    overflow: hidden;
    background: #fff;
    >img{
      width: 64px;
      height: 64px;
      margin-right: 10px;
    }
  }
  .rule-plus {
    margin-top: 20px;
    width: 120px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
</style>

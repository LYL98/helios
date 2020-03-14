<template>
  <el-form
    :model="editItem"
    :style="editItem.coupon_type === 'type_gift' ? 'width: 840px;' : 'width: 620px;'"
    label-position="right"
    label-width="110px"
    ref="ruleForm"
  >
    <my-form-area label="优惠券信息">
      <el-form-item
        label="优惠券名称"
        prop="title"
        :rules="[
          {required: true, message: '优惠券名称不能为空', trigger: 'change'},
          {max: 15, message: '请输入15个以内的字符', trigger: 'blur'}
        ]">
        <el-input v-model="editItem.title" style="width: 310px;" :maxlength="15" placeholder="请输入优惠券名称"/>
      </el-form-item>
      <el-form-item
        label="使用时间"
        prop="pickerValue"
        class="required"
        :rules="[{validator: validPickerValue, trigger: 'blur'}]"
      >
        <el-date-picker
          style="width: 478px;"
          v-model="editItem.pickerValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changePicker"
        />
      </el-form-item>
      <el-form-item
        label="优惠券类型"
        prop="coupon_type"
        :rules="[{ required: true, message: '请选择优惠券类型', trigger: 'blur' }]"
      >
        <el-radio-group v-model="editItem.coupon_type" @change="changeCouponType">
          <el-radio label="type_reduction" border size="small">满减券</el-radio>
          <el-radio label="type_discount" border size="small">满折券</el-radio>
          <el-radio label="type_gift" border size="small">满赠券</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="优惠券规则"
        prop="range.type"
        :rules="[{ required: true, message: '请选择优惠券规则', trigger: 'blur' }]"
      >
        <!-- 满减 -->
        <ul class="rule" v-if="editItem.coupon_type === 'type_reduction'">
          <!-- 订单优惠 -->
          <li style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <el-radio class="radio" label="all" v-model="editItem.range.type" @change="handleCutoverRange">单笔订单满</el-radio>
              <el-form-item
                style="margin-left: 20px;"
                prop="rule.amount_full"
                :rules="editItem.range.type === 'item' ? [{}] : [{ required: true, message: '满金额不能为空', trigger: 'change' }, { validator: validAmountFull, trigger: 'blur' }]"
              >
                <el-input
                  style="width: 160px;"
                  v-model.trim="editItem.range.type === 'item' ? '' : editItem.rule.amount_full"
                  :disabled="editItem.range.type === 'item'"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
            <div style="flex: 1; display: flex; align-items: center;">
              <span style="margin: 0 10px 0 20px;">减</span>
              <el-form-item
                prop="rule.benefit"
                :rules="editItem.range.type === 'item' ? [{}] : [{ required: true, message: '减金额不能为空', trigger: 'change' }, { validator: validBenefitOnReduction, trigger: 'blur' }]"
              >
                <el-input
                  v-model.trim="editItem.range.type === 'item' ? '' : editItem.rule.benefit"
                  style="width: 160px;"
                  :disabled="editItem.range.type === 'item'"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
          </li>
          <!-- 指定商品优惠 -->
          <li style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <el-radio class="radio" label="item" v-model="editItem.range.type" @change="handleCutoverRange">指定商品满</el-radio>
              <el-form-item
                style="margin-left: 20px;"
                prop="rule.amount_full"
                :rules="editItem.range.type === 'all' ? [{}] : [{ required: true, message: '满金额不能为空', trigger: 'change' }, { validator: validAmountFull, trigger: 'blur' }]"
              >
                <el-input
                  style="width: 160px;"
                  v-model.trim="editItem.range.type === 'all' ? '' : editItem.rule.amount_full"
                  :disabled="editItem.range.type === 'all'"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
            <div style="flex: 1; display: flex; align-items: center;">
              <span style="margin: 0 10px 0 20px;">减</span>
              <el-form-item
                v-if="editItem.coupon_type === 'type_reduction'"
                prop="rule.benefit"
                :rules="editItem.range.type === 'all' ? [{}] : [{ required: true, message: '减金额不能为空', trigger: 'change' }, { validator: validBenefitOnReduction, trigger: 'blur' }]"
              >
                <el-input
                  v-model.trim="editItem.range.type === 'all' ? '' : editItem.rule.benefit"
                  style="width: 160px;"
                  :disabled="editItem.range.type === 'all'"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
          </li>
          <!-- 选择指定商品 -->
          <li v-if="editItem.range.type === 'item'">
            <el-form-item
              label="选择指定商品"
              class="required"
              prop="range.item"
              :rules="editItem.range.type === 'all' ? [{}] : [{ validator: validRangeItem, trigger: 'change' }]"
              :error="error.range_item"
            >
              <my-search-item
                style="width: 310px;"
                v-model="editItem.range.item"
                :is_gift="0"
                @select="handleSelectItem"
                @noresult="handleItemNoResult"
                @hasresult="handleItemHasResult"
              ></my-search-item>
            </el-form-item>
          </li>
        </ul>
        <!-- 满折 -->
        <ul class="rule" v-if="editItem.coupon_type === 'type_discount'">
          <!-- 订单优惠 -->
          <li style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <el-radio class="radio" label="all" v-model="editItem.range.type" @change="handleCutoverRange">单笔订单满</el-radio>
              <el-form-item
                style="margin-left: 20px;"
                prop="rule.amount_full"
                :rules="editItem.range.type === 'item' ? [{}] : [{ required: true, message: '满金额不能为空', trigger: 'change' }, { validator: validAmountFull, trigger: 'blur' }]"
              >
                <el-input
                  style="width: 160px;"
                  v-model.trim="editItem.range.type === 'item' ? '' : editItem.rule.amount_full"
                  :disabled="editItem.range.type === 'item'"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
            <div style="flex: 1; display: flex; align-items: center;">
              <span style="margin: 0 10px 0 20px;">打</span>
              <el-form-item
                v-if="editItem.coupon_type === 'type_discount'"
                prop="rule.benefit"
                :rules="editItem.range.type === 'item' ? [{}] : [{ required: true, message: '折扣不能为空', trigger: 'change' }, { validator: validBenefitOnDiscount, trigger: 'blur' }]"
              >
                <el-input
                  v-model.trim="editItem.range.type === 'item' ? '' : editItem.rule.benefit"
                  style="width: 160px;"
                  :disabled="editItem.range.type === 'item'"
                >
                  <template slot="append">折</template>
                </el-input>
              </el-form-item>
            </div>
          </li>
          <!-- 指定商品优惠 -->
          <li style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <el-radio class="radio" label="item" v-model="editItem.range.type" @change="handleCutoverRange">指定商品满</el-radio>
              <el-form-item
                style="margin-left: 20px;"
                prop="rule.amount_full"
                :rules="editItem.range.type === 'all' ? [{}] : [{ required: true, message: '满金额不能为空', trigger: 'change' }, { validator: validAmountFull, trigger: 'blur' }]"
              >
                <el-input
                  style="width: 160px;"
                  v-model.trim="editItem.range.type === 'all' ? '' : editItem.rule.amount_full"
                  :disabled="editItem.range.type === 'all'"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
            <div style="flex: 1; display: flex; align-items: center;">
              <span style="margin: 0 10px 0 20px;">打</span>
              <el-form-item
                v-if="editItem.coupon_type === 'type_discount'"
                prop="rule.benefit"
                :rules="editItem.range.type === 'all' ? [{}] : [{ required: true, message: '折扣不能为空', trigger: 'change' }, { validator: validBenefitOnDiscount, trigger: 'blur' }]"
              >
                <el-input
                  v-model.trim="editItem.range.type === 'all' ? '' : editItem.rule.benefit"
                  style="width: 160px;"
                  :disabled="editItem.range.type === 'all'"
                >
                  <template slot="append">折</template>
                </el-input>
              </el-form-item>
            </div>
          </li>
          <!-- 选择指定商品 -->
          <li v-if="editItem.range.type === 'item'">
            <el-form-item
              label="选择指定商品"
              class="required"
              prop="range.item"
              :rules="editItem.range.type === 'all' ? [{}] : [{ validator: validRangeItem, trigger: 'blur' }]"
              :error="error.range_item"
            >
              <my-search-item
                style="width: 310px;"
                v-model="editItem.range.item"
                :is_gift="0"
                @select="handleSelectItem"
                @noresult="handleItemNoResult"
                @hasresult="handleItemHasResult"
              ></my-search-item>
            </el-form-item>
          </li>
        </ul>
        <!-- 满赠 -->
        <ul class="rule" v-if="editItem.coupon_type === 'type_gift'">
          <!-- 订单优惠 -->
          <li style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <el-radio class="radio" label="all" v-model="editItem.range.type" @change="handleCutoverRange">单笔订单满</el-radio>
              <el-form-item
                style="margin-left: 20px;"
                prop="rule.amount_full"
                :rules="editItem.range.type === 'item' ? [{}] : [{ required: true, message: '满金额不能为空', trigger: 'change' }, { validator: validAmountFull, trigger: 'blur' }]"
              >
                <el-input
                  style="width: 160px;"
                  v-model.trim="editItem.range.type === 'item' ? '' : editItem.rule.amount_full"
                  :disabled="editItem.range.type === 'item'"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center;">
                <span style="margin: 0 10px 0 20px;">送</span>
                <el-form-item
                  v-if="editItem.range.type === 'all'"
                  :error="editItem.range.type === 'item' ? '' : error.rule_item"
                >
                  <my-search-item
                    style="width: 194px;"
                    v-model="editItem.range.type === 'item' ? Object.assign(editItem.rule.item, { id: '', title: '' }) : editItem.rule.item"
                    placeholder="查询可以使用的赠品"
                    :is_gift="is_gift"
                    @select="handleSelectGift"
                    @noresult="handleGiftNoResult"
                    @hasresult="handleGiftHasResult"
                    @blur="validGift"
                  ></my-search-item>
                </el-form-item>
                <el-form-item v-if="editItem.range.type === 'item'">
                  <el-input style="width: 194px;" placeholder="查询可以使用的赠品" disabled/>
                </el-form-item>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="margin: 0 10px 0 20px;">商品</span>
                <el-form-item
                  prop="rule.benefit"
                  :rules="editItem.range.type === 'item' ? [{}] : [{ required: true, message: '满赠件数不能为空', trigger: 'change' }, { validator: validBenefitOnGift, trigger: 'blur' }]"
                >
                  <el-input
                    style="width: 160px;"
                    v-model.trim="editItem.range.type === 'item' ? '' : editItem.rule.benefit"
                    :disabled="editItem.range.type === 'item'"
                  >
                    <template slot="append">件</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </li>
          <!-- 指定商品优惠 -->
          <li style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
              <el-radio class="radio" label="item" v-model="editItem.range.type" @change="handleCutoverRange">指定商品满</el-radio>
              <el-form-item
                style="margin-left: 20px;"
                prop="rule.amount_full"
                :rules="editItem.range.type === 'all' ? [{}] : [{ required: true, message: '满金额不能为空', trigger: 'change' }, { validator: validAmountFull, trigger: 'blur' }]"
              >
                <el-input
                  style="width: 160px;"
                  v-model.trim="editItem.range.type === 'all' ? '' : editItem.rule.amount_full"
                  :disabled="editItem.range.type === 'all'"
                >
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center;">
                <span style="margin: 0 10px 0 20px;">送</span>
                <el-form-item
                  v-if="editItem.range.type === 'item'"
                  :error="editItem.range.type === 'item' ? error.rule_item : ''"
                >
                  <my-search-item
                    style="width: 194px;"
                    v-model="editItem.range.type === 'all' ? Object.assign(editItem.rule.item, { id: '', title: '' }) : editItem.rule.item"
                    placeholder="查询可以使用的赠品"
                    :is_gift="is_gift"
                    @select="handleSelectGift"
                    @noresult="handleGiftNoResult"
                    @hasresult="handleGiftHasResult"
                    @blur="validGift"
                  ></my-search-item>
                </el-form-item>
                <el-form-item v-if="editItem.range.type === 'all'">
                  <el-input style="width: 194px;" placeholder="查询可以使用的赠品" disabled/>
                </el-form-item>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="margin: 0 10px 0 20px;">商品</span>
                <el-form-item
                  prop="rule.benefit"
                  :rules="editItem.range.type === 'all' ? [{}] : [{ required: true, message: '满赠件数不能为空', trigger: 'change' }, { validator: validBenefitOnGift, trigger: 'blur' }]"
                >
                  <el-input
                    style="width: 160px;"
                    v-model.trim="editItem.range.type === 'all' ? '' : editItem.rule.benefit"
                    :disabled="editItem.range.type === 'all'"
                  >
                    <template slot="append">件</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </li>
          <!-- 选择指定商品 -->
          <li v-if="editItem.range.type === 'item'">
            <el-form-item
              label="选择指定商品"
              class="required"
              prop="range.item"
              :rules="editItem.range.type === 'all' ? [{}] : [{ validator: validRangeItem, trigger: 'change' }]"
              :error="error.range_item"
            >
              <my-search-item
                style="width: 310px;"
                v-model="editItem.range.item"
                :is_gift="0"
                @select="handleSelectItem"
                @noresult="handleItemNoResult"
                @hasresult="handleItemHasResult"
              ></my-search-item>
            </el-form-item>
          </li>
        </ul>
      </el-form-item>
    </my-form-area>

    <my-form-area label="发放规则">
      <el-form-item
        label="自动发放"
        prop="is_auto_dis"
        :rules="[{ required: true, message: '请选择是否自动发放优惠券', trigger: 'blur' }]"
      >
        <el-radio-group v-model="editItem.is_auto_dis" @change="changeAutoType">
          <el-radio :label="0" border size="small">不设置</el-radio>
          <el-radio :label="1" border size="small">设置</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发放时间" v-if="editItem.is_auto_dis == 1">
        <el-date-picker style="width: 478px;"
          v-model="editItem.pickerDisValue"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="changePickerDis"
        />
      </el-form-item>
      <el-form-item
        class="required"
        v-if="editItem.is_auto_dis == 1"
        :rules="[{ required: true, message: '请选择优惠券自动发放的范围', trigger: 'blur' }]"
      >
        <el-radio-group v-model="editItem.auto_range.type" @change="handleCutoverAutoRange">
          <el-radio label="all" border size="small">按订单金额自动发放</el-radio>
          <el-radio label="item" border size="small">按单品金额自动发放</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="editItem.is_auto_dis == 1">
        <el-form-item
          label="自动发放条件:"
          class="required"
          label-width="120px"
        >
          <div style="display: flex; align-items: center;">
            <span>{{ editItem.auto_range.type === 'all' ? '订单' : '单品' }}满</span>
            <el-form-item
              style="margin-left: 10px;"
              prop="auto_dis_full"
              :rules="[{ required: true, message: '自动发放条件不能为空', trigger: 'change' }, { validator: validAutoDisFull, trigger: 'blur' }]"
            >
              <el-input style="width: 200px;" v-model="editItem.auto_dis_full">
                <template slot="append">元</template>
              </el-input>
              <span style="margin-left: 10px;">系统自动发放一张</span>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form-item>
      <el-form-item v-if="editItem.is_auto_dis == 1 && editItem.auto_range.type === 'item'">
        <el-form-item
          label="自动发放范围:"
          class="required"
          label-width="120px"
        >
          <div style="display: flex; align-items: center;">
            <span>指定商品</span>
            <el-form-item
              style="margin-left: 10px;"
              prop="auto_range.item"
              :rules="[{ validator: validAutoRangeItem, trigger: 'change' }]"
              :error="error.auto_item"
            >
              <my-search-item
                style="width: 310px;"
                v-model="editItem.auto_range.item"
                :disabled="editItem.auto_range.type !== 'item'"
                :is_gift="0"
                @select="handleSelectAutoItem"
                @noresult="handleAutoItemNoResult"
                @hasresult="handleAutoItemHasResult"
              ></my-search-item>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form-item>
    </my-form-area>

    <el-form-item style="text-align: right;">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="sending" @click="handleSubmit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {Form, FormItem, DatePicker, Radio, RadioGroup, Input, Button} from 'element-ui';
  import {FormArea} from '@/common';
  import {SearchItem} from "@/container/search";
  import { DataHandle } from '@/util';

  export default {
    name: "FormMarketingCouponAdd",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-date-picker': DatePicker,
      'el-radio': Radio,
      'el-radio-group': RadioGroup,
      'el-input': Input,
      'el-button': Button,
      'my-form-area': FormArea,
      'my-search-item': SearchItem
    },
    props: {
      item: {type: Object, required: true}, // 需要编辑的项
      changeType: { type: Function, required: true },
      submit: {type: Function, required: true},
      close: {type: Function, required: true},
      sending: {type: Boolean, required: true}
    },
    model: {
      prop: 'item',
      event: 'change'
    },
    data() {
      let item = Object.assign({}, this.$props.item);

      let validPickerValue = function (rules, value, callback) {
        if (value) {
          if (value.length <= 0) {
            return callback(new Error('请选择活动开始和结束时间'));
          } else if (new Date().getTime() > new Date(value[1]).getTime()) {
            return callback(new Error('活动结束时间不能小于当前时间'));
          } else if (value[0] === value[1]) {
            return callback(new Error('活动开始和结束时间不能相等'));
          } else {
            callback();
          }
        } else {
          return callback(new Error('请选择活动开始和结束时间'));
        }
      };
      let validAmountFull = function (rules, value, callback) {
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('满金额必须为大于零的纯数字'));
        }
        if (String(value).indexOf(".") > -1) {
          return callback(new Error('满金额必须为整数'));
        }
        if (value > 1000000) {
          return callback(new Error('满金额不能超过1000000'));
        }
        callback();
      };
      let validBenefitOnReduction = function (rules, value, callback) {
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('减金额必须为大于零的纯数字'));
        }
        if (String(value).indexOf(".") > -1) {
          return callback(new Error('减金额必须为整数'));
        }
        if (item.rule.amount_full && Number(value) >= item.rule.amount_full) {
          return callback(new Error('减金额 必须小于 满金额'));
        }
        if (value > 1000000) {
          return callback(new Error('减金额不能超过1000000'));
        }
        callback();
      };
      let validBenefitOnDiscount = function (rules, value, callback) {
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('折扣必须为大于零的纯数字'));
        }
        if (!/^[0-9]+([.]\d{1})?$/.test(value)) {
          return callback(new Error('折扣最多只能输入一位小数'));
        }
        if (value >= 10) {
          return callback(new Error('折扣不能大于等于10'));
        }
        callback();
      };
      let validGiftOnAll = function (rules, value, callback) {
        // console.log('value', value);
        if (!value) {
          return callback(new Error('满赠商品不能为空'));
        }
        callback();
      };
      let validGiftOnItem = function (rules, value, callback) {
        // console.log('value', value);
        if (!value) {
          return callback(new Error('满赠商品不能为空'));
        }
        callback();
      };
      let validBenefitOnGift = function (rules, value, callback) {
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('满赠件数必须为大于零的纯数字'));
        }
        if (String(value).indexOf(".") > -1) {
          return callback(new Error('满赠件数必须为整数'));
        }
        if (value > 100000) {
          return callback(new Error('满赠件数不能超过100000'));
        }
        callback();
      };
      let validRangeItem = function (rules, value, callback) {
        if (!value.id) {
          return callback(new Error('指定商品不能为空'));
        }
        callback();
      };
      let validAutoDisFull = function (rules, value, callback) {
        if (!!value && (isNaN(value) || value <= 0)) {
          return callback(new Error('自动发放条件必须为大于零的纯数字'));
        }
        if (String(value).indexOf(".") > -1) {
          return callback(new Error('自动发放条件必须为整数'));
        }
        if (value > 1000000) {
          return callback(new Error('自动发放条件不能超过1000000'));
        }
        callback();
      };
      let validAutoRangeItem = function (rules, value, callback) {
        if (!value.id) {
          return callback(new Error('请选择优惠券自动发放的指定商品'));
        }
        callback();
      };
      return {
        editItem: item,
        is_gift: 1, // 1 表示赠品  0 不是赠品
        error: {
          rule_item: '', // 赠品
          range_item: '', // 使用范围的商品
          auto_item: '' // 自动发放的商品
        },
        validPickerValue: validPickerValue,
        validAmountFull: validAmountFull,
        validBenefitOnReduction: validBenefitOnReduction,
        validBenefitOnDiscount: validBenefitOnDiscount,
        validGiftOnAll: validGiftOnAll,
        validGiftOnItem: validGiftOnItem,
        validBenefitOnGift: validBenefitOnGift,
        validRangeItem: validRangeItem,
        validAutoDisFull: validAutoDisFull,
        validAutoRangeItem: validAutoRangeItem
      }
    },
    methods: {
      //搜索日期
      changePicker(value) {
        if (value && value.length === 2) {
          this.$data.editItem.time_start = value[0];
          this.$data.editItem.time_end = value[1];
        } else {
          this.$data.editItem.pickerValue = null;
          this.$data.editItem.time_start = '';
          this.$data.editItem.time_end = '';
        }
      },
      //发放日期
      changePickerDis(value) {
        if (value && value.length === 2) {
          this.$data.editItem.dis_time_start = value[0];
          this.$data.editItem.dis_time_end = value[1];
        } else {
          this.$data.editItem.pickerDisValue = null;
          this.$data.editItem.dis_time_start = '';
          this.$data.editItem.dis_time_end = '';
        }
      },
      // 改变优惠券类型
      changeCouponType(type) {
        this.$props.changeType(type);
        this.$data.editItem = Object.assign(this.$data.editItem, {
          rule: { // handle 优惠券使用规则
            amount_full: '',
            benefit: '',
            item: Object.assign(this.$data.editItem.rule.item, { id: '', title: '', value: '' }),
          }
        });
        this.$data.editItem.range.item = Object.assign(this.$data.editItem.range.item, { id: '', title: '', value: '' });
        this.$data.error.rule_item = '';
        this.$data.error.range_item = '';
        // 重置表单项的验证规则
        this.$refs['ruleForm'].clearValidate(["rule.amount_full", "rule.benefit", "range.item" ]);
      },
      // 改变优惠券的使用范围
      handleCutoverRange() {
        this.$data.editItem = Object.assign(this.$data.editItem, {
          rule: { // handle 优惠券使用规则
            amount_full: '',
            benefit: '',
            item: Object.assign(this.$data.editItem.rule.item, { id: '', title: '', value: '' }),
          }
        });
        this.$data.editItem.range.item = Object.assign(this.$data.editItem.range.item, { id: '', title: '', value: '' });
        this.$data.error.rule_item = '';
        this.$data.error.range_item = '';
        this.$refs['ruleForm'].clearValidate(["rule.amount_full", "rule.benefit", "range.item" ]);
      },
      // 没有查到赠品的情况
      handleGiftNoResult() {
        this.$data.error.rule_item = '没有找到满足条件的赠品';
      },
      // 查到赠品的情况
      handleGiftHasResult() {
        this.$data.error.rule_item = '';
      },
      // 选择搜索到赠品的情况
      handleSelectGift() {
        this.$data.error.rule_item = '';
      },
      // 没有查到指定商品的情况
      handleItemNoResult() {
        this.$data.error.range_item = '没有找到满足条件的商品';
      },
      // 查到指定商品的情况
      handleItemHasResult() {
        this.$data.error.range_item = '';
      },
      // 选择搜索到指定商品的情况
      handleSelectItem() {
        this.$refs['ruleForm'].clearValidate(["range.item"]);
        this.$data.error.range_item = '';
      },
      // 改变自动发放商品类型
      changeAutoType() {
        this.$data.editItem = Object.assign(this.$data.editItem, {
          auto_dis_full: '',
          auto_range: Object.assign(this.$data.editItem.auto_range, {
            type: 'all',
            item: {id: '', title: ''}
          })
        });
        this.$refs['ruleForm'].clearValidate(["auto_dis_full", "auto_range.item" ]);
      },
      // 改变优惠券的自动发放范围
      handleCutoverAutoRange() {
        this.$data.editItem.auto_range.item = Object.assign(this.$data.editItem.auto_range.item, { id: '', title: '', value: '' });
        this.$data.error.auto_item = '';
        this.$refs['ruleForm'].clearValidate(["auto_dis_full", "auto_range.item" ]);
      },
      // 没有查到自动发放商品的情况
      handleAutoItemNoResult() {
        this.$data.error.auto_item = '没有找到满足条件的商品';
      },
      // 查到自动发放商品的情况
      handleAutoItemHasResult() {
        this.$data.error.auto_item = '';
      },
      // 选择搜索到自动发放商品的情况
      handleSelectAutoItem() {
        this.$refs['ruleForm'].clearValidate(["auto_range.item"]);
        this.$data.error.auto_item = '';
      },
      // 验证赠品是否通过校验
      validGift() {
        if (this.$data.editItem.coupon_type === 'type_gift' && !this.$data.editItem.rule.item.id) {
          this.$data.error.rule_item = '满赠商品不能为空';
          return false;
        }
        return true;
      },
      handleSubmit() {
        this.$refs['ruleForm'].validate(valid => {
          if (valid & this.validGift()) {
            this.$emit('change', this.$data.editItem);
            this.$props.submit();
          }
        })
      },
      handleClose() {
        this.$props.close();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon-plus {
    margin-top: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;

    i {
      font-size: 18px;
    }
  }

  .rule {
    li + li {
      margin-top: 20px;
    }
  }

  .radio {
    display: block;
    padding: 10px 0;
    margin-left: 0px;
    margin-right: 0 !important;
  }
</style>

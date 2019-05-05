<template>
    <div>
      <el-dialog
        :title="manualDetail.code + '/' + manualDetail.store_title"
        :visible.sync="isShow"
        width="800px"
        height="600px"
        :before-close="onCancelDialog"
        :close-on-click-modal="false"
      >
        <div v-if="isShowModify">
          <div style="text-align: center">
            <span style="font-size: 14px">修改订单件数/重量</span>
          </div>
          <el-table
            :data="manualDetail.items"
            style="width: 100%;">
            <el-table-column
              prop="item_title"
              label="商品">
              <template slot-scope="scope">
                <span>{{scope.row.item_title + '/' + scope.row.item_code}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="count_real_tmp"
              label="实收/应收(件)"
              align="right"
              width="180">
              <template slot-scope="scope">
                <div>
                  <el-input-number size="small"
                                  v-model="scope.row.count_real_t"
                                   :precision="0"
                                  @input="onCountInputChange(scope.row, scope.row.count_real_tmp, scope.row.count_real_t, scope.row.count_pre)"
                                  :class="scope.row.countHasError ? 'custom-input' : ''"
                                   :controls="false"
                                   style="width: 80px"></el-input-number>
                  <span>/</span>
                  <span>{{scope.row.count_pre}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount_real"
              label="实重/应重(斤)"
              align="right"
              width="180">
              <template slot-scope="scope">
                <div v-if="scope.row.is_weigh">
                  <el-input-number size="small"
                                   :precision="1"
                                    @input="onWeighInputChange(scope.row, scope.row.wgt_with_frm_real_tmp, scope.row.wgt_with_frm_real_t, scope.row.wgt_with_frm_pre)"
                                    :class="scope.row.weighHasError ? 'custom-input' : ''"
                                    v-model="scope.row.wgt_with_frm_real_t"
                                   :controls="false"
                                   style="width: 80px;"></el-input-number>
                  <span>/</span>
                  <span>{{returnWeight(scope.row.wgt_with_frm_pre)}}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="!isShowModify">
          <el-form class="custom-form" label-position="right" :model="postData" label-width="120px" :rules="rules"  ref="ruleForm" style="width: 98%;">
            <el-form-item label="选择配送方式">
              <el-radio-group v-model="postData.ship_type">
                <el-radio border size="small" label="merchat">自配</el-radio>
                <el-radio border size="small" label="third_party">第三方物流</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="选择物流公司" v-if="postData.ship_type === 'third_party'" prop="ship_code">
              <my-select-express-company v-model="postData.ship_code" size="small" placeholder="请选择物流公司"></my-select-express-company>
            </el-form-item>
            <el-form-item label="快递单号" v-if="postData.ship_type === 'third_party'" prop="express_company">
              <el-input size="small" v-model="postData.express_company" placeholder="请输入快递单号"></el-input>
            </el-form-item>
          </el-form>
          <div style="text-align: right; margin-right: 20px">
            <a href="javascript:void(0)" @click="showModify" style="text-decoration: underline" v-if="auth.isAdmin || auth.OrderManualChange">修改订单件数、重量</a>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="onCancel">{{isShowModify ? '返 回' : '取 消'}}</el-button>
          <el-button type="primary" @click.native="onConfirm">确 认</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {Row, Col, Button, Dialog, RadioGroup, Radio, Form, FormItem, Input, Table, TableColumn, InputNumber, MessageBox} from "element-ui";
import { SelectExpressCompany } from '@/container'
import { DataHandle, Verification, Constant } from '@/util';

export default {
  name: "ManualDelivery",
  data() {
    return {
      isShowModify: false,
      manualDetail: {},
      weightScope: Constant.WEIGHT_SCOPE,
      modifyPostData: {
        id: '',
        items: []
      },
      postData: {
        id: '',
        ship_type: 'merchat',
        ship_info: {
          shipper_code: '',
          express_code: ''
        },
        express_company: '',
        ship_code: '',
      },
      rules: {
        ship_code: [
          { required: true, message: '请选择快递公司', trigger: 'change' }
        ],
        express_company: [
          { required: true, message: '快递单号不能为空', trigger: 'change' },
          { pattern: Verification.testStrs.isNumberOrAlpha, message: '快递单号只能是字母和数字的组合', trigger: 'blur' },
          { max: 20, message: '快递单号不能大于20个字符', trigger: 'change' }
          // { validator: validShipCode, trigger: 'change' },
        ],
      },
    }
  },
  components: {
    'el-row': Row,
    'el-col': Col,
    'el-button': Button,
    'el-dialog': Dialog,
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-input-number': InputNumber,
    'el-table': Table,
    'el-table-column': TableColumn,
    'my-select-express-company': SelectExpressCompany
  },
  computed: {
    ...mapGetters({
      auth: 'globalAuth',
      isShow: 'orderIsShowManualDelivery',
      detail: 'orderDataDetail'
    })
  },
  watch: {
    detail: function (a, b) {
      let newItems = Array();
      for (let i = 0; i < a.items.length; i++) {
        let newItem = {};
        let item = a.items[i];
        newItem = Object.assign({}, item);
        newItem.wgt_with_frm_real_t = this.returnWeight(item.wgt_with_frm_real_tmp);
        newItem.count_real_t = item.count_real_tmp;
        newItem.countHasError = false;
        newItem.weighHasError = false;
        newItems.push(newItem);
      }
      this.manualDetail.items = newItems;
      this.manualDetail.store_title = a.store_title;
      this.manualDetail.code = a.code;
      this.manualDetail.id = a.id;

      this.$data.postData = {
        id: '',
        ship_type: 'merchat',
        ship_info: {
          shipper_code: '',
          express_code: ''
        },
        express_company: '',
        ship_code: '',
      };
      this.$data.modifyPostData = {
        id: '',
        items: []
      }
    },
    isShowModify: function (a, b) {
      if (a) {
        //显示订单修改页面时校验
        let { manualDetail } = this;
        for (let i = 0; i < manualDetail.items.length; i++) {
          let item = manualDetail.items[i];
          if (!item.count_real_t) {
            item.count_real_t = '0';
          }
          if (!item.wgt_with_frm_real_t) {
            item.wgt_with_frm_real_t = '0';
          }
          //校验件数
          this.validCount(item, item.count_real_tmp, item.count_real_t, item.count_pre);
          //校验重量
          if (item.is_weigh) {
            this.validWeigh(item, this.returnWeight(item.wgt_with_frm_real_tmp), item.wgt_with_frm_real_t, this.returnWeight(item.wgt_with_frm_pre))
          }
        }
      }
    }
  },
  methods: {
    //返回重量
    returnWeight(data) {
      return DataHandle.returnWeight(data);
    },
    //返回重量
    handleWeight(data) {
      return DataHandle.handleWeight(data);
    },
    showModify() {
      this.isShowModify = true;
    },
    onCancelDialog() {
      if (this.isShowModify) {
        this.isShowModify = false;
      } else {
        this.$attrs.callback();
        this.orderShowHideManualDelivery({isShow: false});
      }
    },
    onCountInputChange(row, origin, value, limit) {
      // if (value === '') {
      //   row.count_real_tmp = '0';
      // }
      let v = Number(value);
      let l = Number(limit);
      // console.log('v: ', v, ', l: ', l);
      if (v > l) {
        let msg = '实收件数已超过应收件数';
        MessageBox.alert(msg, '提示', { type: 'warning'});
        // row.count_real_tmp = origin;
        row.countHasError = true;
        return false;
      } if (v < l) {
        row.countHasError = true;
      } else {
        row.countHasError = false;
      }
    },
    onWeighInputChange(row, origin, value, limit) {
      // if (value === '') {
      //   row.wgt_with_frm_real_temp = '0';
      // }

      origin = this.returnWeight(origin);
      limit = this.returnWeight(limit);
      let v = Number(value);
      let l = Number(limit);
      // console.log('v: ', v, ', l: ', l);
      if (v > l) {
        if (v > l * (1 + this.weightScope)) {
          //实际重量超过应重20%
          row.weighHasError = true;
        } else {
          row.weighHasError = false;
        }
      } else if (v < l) {
        if (v < l * (1 - this.weightScope)) {
          //实际重量小于应重20%
          row.weighHasError = true;
        } else {
          row.weighHasError = false;
        }
      } else {
        row.weighHasError = false;
      }
    },
    validCount(row, origin, value, limit) {
      let v = Number(value);
      let l = Number(limit);
      if (v > l) {
        let msg = '实收件数已超过应收件数';
        MessageBox.alert(msg, '提示', { type: 'warning'});
        row.countHasError = true;
        return false;
      } if (v < l) {
        row.countHasError = true;
      } else {
        row.countHasError = false;
      }
      return true;
    },
    validWeigh(row, origin, value, limit) {
      let v = Number(value);
      let l = Number(limit);
      if (v > l) {
        if (v > l * (1 + this.weightScope)) {
          //实际重量超过应重20%
          row.weighHasError = true;
        } else {
          row.weighHasError = false;
        }
      } else if (v < l) {
        if (v < l * (1 - this.weightScope)) {
          //实际重量小于应重20%
          row.weighHasError = true;
        } else {
          row.weighHasError = false;
        }
      } else {
        row.weighHasError = false;
      }
      if (v > 100000) {
        MessageBox.alert('重量不能超过100000', '提示', { type: 'warning'});
        return false
      }
      return true;
    },
    onCancel() {
      // console.log('reset')
      if (this.isShowModify) {
        this.isShowModify = false;
        //恢复修改页面的默认值
        let newItems = Array();
        for (let i = 0; i < this.detail.items.length; i++) {
          let newItem = {};
          let item = this.detail.items[i];
          newItem = Object.assign({}, item);
          newItem.count_real_t = item.count_real_tmp;
          newItem.wgt_with_frm_real_t = this.returnWeight(item.wgt_with_frm_real_tmp);
          newItems.push(newItem);
        }
        this.manualDetail.items = newItems;
        this.manualDetail.store_title = this.detail.store_title;
        this.manualDetail.code = this.detail.code;
      } else {
        this.$attrs.callback();
        this.orderShowHideManualDelivery({isShow: false});
      }
    },
    onConfirm() {
      let that = this;
      if (that.isShowModify) {
        let { modifyPostData, manualDetail } = that;
        // console.log('manualDetail: ', manualDetail);
        for (let i = 0; i < manualDetail.items.length; i++) {
          let item = manualDetail.items[i];
          if (!item.count_real_t) {
            item.count_real_t = '0';
          }
          if (!item.wgt_with_frm_real_t) {
            item.wgt_with_frm_real_t = '0';
          }
          //校验件数
          if (!this.validCount(item, item.count_real_tmp, item.count_real_t, item.count_pre)) {
            return
          }
          //校验重量
          if (item.is_weigh) {
            if (!this.validWeigh(item, this.returnWeight(item.wgt_with_frm_real_tmp), item.wgt_with_frm_real_t, this.returnWeight(item.wgt_with_frm_pre))) {
              return
            }
          }
        }

        modifyPostData.id = manualDetail.id;
        let newItems = Array();
        for (let i = 0; i < manualDetail.items.length; i++) {
          let newItem = {};
          let item = manualDetail.items[i];
          newItem.order_item_id = item.id;
          newItem.count_real_tmp = Number(item.count_real_t);
          newItem.wgt_with_frm_real_tmp = that.handleWeight(item.wgt_with_frm_real_t);
          newItems.push(newItem);
        }
        modifyPostData.items = newItems;
        that.orderManualChange({
          data: modifyPostData,
          callback: () => {
            that.isShowModify = false;
            //提交成功，刷新manualDetail
            this.orderShowHideManualDelivery({data: {id: manualDetail.id},isShow: true})
          }
        })
      } else {
        //提交手动发货
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let { postData, manualDetail } = that;
            postData.id = manualDetail.id;
            postData.ship_info.express_code = postData.express_company;
            postData.ship_info.shipper_code = postData.ship_code;
            that.orderShip({
              data: postData,
              callback: () => {
                that.onCancelDialog();
              }
            });
          } else {
            return false;
          }
        });
      }
      // console.log('postData: ', this.postData)
    },
    ...mapActions(['orderShowHideManualDelivery', 'orderManualChange', 'orderShip'])
  }
}
</script>

<style scoped>

</style>

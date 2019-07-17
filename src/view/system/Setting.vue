<template>
  <div>
    <div :style="{ overflowY: 'auto', overflowX: 'auto', height: windowHeight - offsetHeight + 'px', background: '#fff'}">

      <div class="settingItem" v-for="(settingItem, index) in settingItems" :key="index" v-if="index === 0 && (auth.isAdmin || auth.SystemSettingBrandInfo)">
        <p class="title">{{settingItem.title}}</p>
        <div class="content">
          <div class="item" v-for="(item, itemIndex) in settingItem.content" :key="itemIndex">
            <div class="name">{{item.name}}</div>
            <div class="space"></div>
            <div class="value" v-if="item.type === 'text'"><span>{{item.value}}</span><span class="appendix" v-if="item.appendix">{{item.appendix}}</span></div>
            <div class="value" v-else>
              <img :src="item.value" style="width: 80px; height: 80px"/>
            </div>
          </div>
        </div>
        <div class="operation">
          <el-button style="margin-left: 124px" size="small" type="primary" plain @click="showEditDialog(settingItem)">编辑</el-button>
        </div>
      </div>

      <div style="display: flex;">
        <div class="settingItem" v-for="(settingItem, index) in settingItems" :key="index" v-if="(index === 1 && (auth.isAdmin || auth.SystemSettingDeliveryInfo)) || (index === 2 && (auth.isAdmin || auth.SystemSettingOrderTime))">
          <p class="title">{{settingItem.title}}</p>
          <div class="content">
            <div class="item" v-for="(item, itemIndex) in settingItem.content" :key="itemIndex">
              <div class="name" :style="index === 2 ? 'width: 136px' : ''">{{item.name}}</div>
              <div class="space"></div>
              <div class="value" v-if="item.type === 'text'"><span>{{item.value}}</span><span class="appendix" v-if="item.appendix">{{item.appendix}}</span></div>
              <div class="value" v-else>
                <img :src="item.value" style="width: 80px; height: 80px"/>
              </div>
            </div>
          </div>
          <div class="operation">
            <el-button :style="index === 2 ? 'margin-left: 148px' : 'margin-left: 124px'" size="small" type="primary" plain @click="showEditDialog(settingItem)">编辑</el-button>
          </div>
        </div>
      </div>

      <div style="display: flex;">
        <div class="settingItem" v-for="(settingItem, index) in settingItems" :key="index" v-if="(index === 3 && (auth.isAdmin || auth.SystemSettingConfirmTime)) || (index === 4 && (auth.isAdmin || auth.SystemSettingShipType))">
          <p class="title">{{settingItem.title}}</p>
          <div class="content">
            <div class="item" v-for="(item, itemIndex) in settingItem.content" :key="itemIndex">
              <div class="name" :style="index === 4 ? 'width: 136px' : ''">{{item.name}}</div>
              <div class="space"></div>
              <div class="value" v-if="item.type === 'text'"><span>{{item.value}}</span><span class="appendix" v-if="item.appendix">{{item.appendix}}</span></div>
              <div class="value" v-else>
                <img :src="item.value" style="width: 80px; height: 80px"/>
              </div>
            </div>
          </div>
          <div class="operation">
            <el-button :style="index === 4 ? 'margin-left: 148px' : 'margin-left: 124px'" size="small" type="primary" plain @click="showEditDialog(settingItem)">编辑</el-button>
          </div>
        </div>
      </div>

      <div class="settingItem" v-for="(settingItem, index) in settingItems" :key="index" v-if="index === 5 && (auth.isAdmin || auth.SystemSettingAdvert)">
        <p class="title">{{settingItem.title}}</p>
        <div class="content">
          <div class="item" v-for="(item, itemIndex) in settingItem.content" :key="itemIndex">
            <div class="name">{{item.name}}</div>
            <div class="space"></div>
            <div class="value" v-if="item.type === 'text'"><span>{{item.value}}</span><span class="appendix" v-if="item.appendix">{{item.appendix}}</span></div>
            <div class="value" v-else>
              <img :src="item.value" style="width: 80px; height: 80px"/>
            </div>
          </div>
        </div>
        <div class="operation">
          <el-button style="margin-left: 124px" size="small" type="primary" plain  @click="showEditDialog(settingItem)">编辑</el-button>
        </div>
      </div>

      <!--设置项编辑dialog-->
      <el-dialog :title="dialogSettingItem.title"
              :visible.sync="settingsDialogIsShow"
              width="600px"
              @close="onCancelDialog"
              :close-on-click-modal="false"
              :before-close="onCancelDialog">
        <div v-if="dialogSettingItem.settingType === 'brand'">
          <!--品牌设置-->
          <el-form label-position="right"
                   class="custom-form-operating-config"
                   label-width="160px" style="width: 500px;" :model="brandInfo" :rules="brandRules"
                   ref="brandRuleForm">
            <el-form-item :label="dialogSettingItem.content[0].name" prop="brand_icon">
              <my-upload-img ref="upload" v-model="brandInfo.brand_icon" module="brand_icon" @change="changeBrandIcon"
                             :limit="1"></my-upload-img>
            </el-form-item>
            <el-form-item :label="dialogSettingItem.content[1].name" prop="brand_name">
              <el-input size="small" v-model="brandInfo.brand_name" placeholder="请输入15位以内的字符" :max="8"></el-input>
            </el-form-item>
            <el-form-item :label="dialogSettingItem.content[2].name" prop="complaint_hotline">
              <el-input size="small" v-model="brandInfo.complaint_hotline" type="tel" :maxlength="11" placeholder="请输入11位手机号"></el-input>
            </el-form-item>
            <el-form-item :label="dialogSettingItem.content[3].name" prop="qr_code">
              <my-upload-img ref="upload2" v-model="brandInfo.qr_code" @change="changeBrandQr" module="qr_code"
                             :limit="1"></my-upload-img>
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="dialogSettingItem.settingType === 'delivery'">
          <!--运费-->
          <el-form label-position="right"
                   class="custom-form-operating-config"
                   label-width="76px" :model="deliveryInfo" :rules="deliveryInfoRules" ref="ruleForm1">
            <el-form-item :label="dialogSettingItem.content[0].name" prop="discount_delivery_line">
              <el-input size="small" v-model="deliveryInfo.discount_delivery_line" style="width:340px;" placeholder="0 - 1000000">
                <template slot="prepend">全场满</template>
                <template slot="append">元，免运费</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="dialogSettingItem.content[1].name" prop="delivery_price">
              <el-input size="small" v-model="deliveryInfo.delivery_price" style="width:200px;" placeholder="0 - 1000">
                <template slot="prepend">运费</template>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="dialogSettingItem.settingType === 'order'">
          <!--订单确认设置-->
          <el-form
            style="min-width: 600px;flex: 1;margin-left: 20px"
            label-position="right"
            label-width="110px"
            class="custom-form-operating-config"
            :model="confirmTime" :rules="confirmTimeRules"
            ref="ruleForm3">
            <el-form-item label="订单自动确认">
              <el-radio-group v-model="confirmTime.is_auto_confirmed">
                <el-radio size="small" border label="1">自动确认和手动确认</el-radio>
                <el-radio size="small" border label="0">手动确认</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="截单时间" prop="confirm_time" v-if="confirmTime.is_auto_confirmed === '1'">
              <el-time-picker
                style="width: 270px;"
                placeholder="截单时间"
                size="small"
                v-model="confirmTime.confirm_time"
                value-format="HH:mm:ss">
              </el-time-picker>
            </el-form-item>
          </el-form>
        </div>
        <div v-else-if="dialogSettingItem.settingType === 'shipping'">
          <!--发货设置-->
          <el-form
            style="margin-left: 20px"
            label-position="right"
            label-width="116px"
            class="custom-form-operating-config"
            :model="shipType"
            ref="ruleForm4">
            <el-form-item :label="dialogSettingItem.content[0].name" prop="ship_type">
              <el-radio-group v-model="shipType.ship_type">
                <el-radio border size="small" label="merchant">是</el-radio>
                <el-radio border size="small" label="third_party">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="onCancelDialog">取 消</el-button>
          <el-button type="primary" @click.native="onConfirm(dialogSettingItem)">确 认</el-button>

          <!--注：选择"否"，分拣并审核完成后需要前往订单列表填写物流信息-->
          <div style="color: #EA6584;font-size: 12px;margin-top: 40px;text-align: left" v-if="dialogSettingItem.settingType === 'shipping'">
            <p style="line-height: normal">注：选择"否"，分拣并审核完成后需要前往订单列表填写物流信息</p>
          </div>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import { Form, FormItem, Button, Input, MessageBox, TimePicker, Notification, RadioGroup, Radio, Row, Col, Dialog } from 'element-ui';
import { DataHandle, Verification, Config, Constant } from '@/util';
import { System } from '@/service';
import {UploadImg} from '@/common';
import brand from "@/store/modules/system/brand";

export default {
  name: 'Setting',
  components: {
    'el-form': Form,
    'el-form-item': FormItem,
    'el-button': Button,
    'el-input': Input,
    'el-time-picker': TimePicker,
    'el-radio-group': RadioGroup,
    'el-radio': Radio,
    'el-row': Row,
    'el-col': Col,
    'el-dialog': Dialog,
    'my-upload-img': UploadImg,
  },
  created(){
    let that = this;
    documentTitle("设置 - 运营配置");

    that.basicdataOrderTimeGet((orderTime) => {
      that.updateSettingItemsInfo('operating', orderTime);
    });
    that.basicdataDeliveryInfoGet((deliveryInfo) => {
      that.updateSettingItemsInfo('delivery', deliveryInfo);
    });
    that.basicdataConfirmTimeGet((confirmTime) => {
      that.updateSettingItemsInfo('order', confirmTime);
    });
    that.basicdataShipTypeGet((shipType) => {
      that.updateSettingItemsInfo('shipping', shipType);
    });
    that.systemBrandGet((brandInfo) => {
      that.updateSettingItemsInfo('brand', brandInfo);
    });
  },
  computed: mapGetters({
    auth: 'globalAuth',
    windowHeight: 'windowHeight'
  }),
  data(){
    let validImages = function (rules, value, callback) {
      if (value.length && value.length > 0) {
        callback();
      } else {
        callback(new Error('请上传图片'));
      }
    };
    let validQrImages = function (rules, value, callback) {
      if (value.length && value.length > 0) {
        callback();
      } else {
        callback(new Error('请上传图片'));
      }
    };
    let validName = function (rules, value, callback) {
      if (value.length && value.length <= 8) {
        callback();
      } else if (value.length && value.length > 8) {
        callback(new Error('品牌名称不能大于8个字'));
      } else {
        callback(new Error('品牌名不能为空'));
      }
    }

    let validDeliveryLine = function (rules, value, callback) {
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 1000000) {
          callback('满减金额不能超过1000000')
        } else if (numStr.indexOf('.') > 2) {
          callback('最多只能输入2位小数')
        } else {
          callback()
        }
      } else {
        callback('必须是数值类型')
      }
    };
    let validDelivery = function (rules, value, callback) {
      let num = Number(value);
      if (typeof num === 'number') {
        let numStr = num.toString().split('').reverse();
        if (num > 1000) {
          callback('运费不能超过1000')
        } else if (numStr.indexOf('.') > 2) {
          callback('最多只能输入2位小数')
        } else {
          callback()
        }
      } else {
        callback('必须是数值类型')
      }
    };
    return {
      offsetHeight: Constant.OFFSET_BASE_HEIGHT,
      settingsDialogIsShow: false,
      dialogSettingItem: {},
      settingItems: [
        {
          title: '品牌信息',
          settingType: 'brand',
          content: [
            {
              name: '品牌logo',
              value: '@/assets/img/export_preview_city.png',
              type: 'image'
            },
            {
              name: '品牌名',
              value: '蒲公英',
              type: 'text'
            },
            {
              name: '投诉电话',
              value: '15919810022',
              type: 'text'
            },
            {
              name: '客服微信',
              value: '@/assets/img/export_preview_city.png',
              type: 'image'
            }
          ]
        },
        {
          title: '运费设置',
          settingType: 'delivery',
          content: [
            {
              name: '免运费',
              value: '全场满1000元，免运费',
              type: 'text'
            },
            {
              name: '运费',
              value: '80元',
              type: 'text'
            }
          ]
        },
        {
          title: '订单确认设置',
          settingType: 'order',
          content: [
            {
              name: '订单确认方式',
              value: '自动确认和手动确认',
              type: 'text'
            }
          ]
        },
        {
          title: '发货设置',
          settingType: 'shipping',
          content: [
            {
              name: '分拣完成自动发货',
              value: '-',
              appendix: '(选择“否”，分拣并审核完成后请前往订单列表填写物流信息)',
              type: 'text'
            }
          ]
        },
      ],
      confirmTime: {
        is_auto_confirmed: '1',
        confirm_time: ''
      },
      orderTime: {
        orderTimeRange: [],
      },
      deliveryInfo: {
        delivery_price: '',
        discount_delivery_line: ''
      },
      shipType: {
        ship_type: 'third_party'
      },
      brandInfo: {
        brand_name: '',
        brand_icon: [],
        complaint_hotline: '',
        qr_code: []
      },
      confirmTimeRules:{
        confirm_time: [
          { required: true, message: '请选择截单时间', trigger: 'change' }
        ]
      },
      orderTimeRules: {
        orderTimeRange: [
          { required: true, message: '请选择下单时间', trigger: 'change' }
        ]
      },
      deliveryInfoRules: {
        discount_delivery_line: [
          { required: true, message: '满减金额不能为空', trigger: 'change' },
          { pattern: Verification.testStrs.isValidValue, message: '满减金额只能是数字', trigger: 'blur' },
          { validator: validDeliveryLine, trigger: 'blur' },
        ],
        delivery_price: [
          { required: true, message: '运费不能为空', trigger: 'change' },
          { pattern: Verification.testStrs.isValidValue, message: '运费只能是数字', trigger: 'blur' },
          { validator: validDelivery, trigger: 'blur' },
        ]
      },
      brandRules: {
        brand_name: [
          // {validator: validName, trigger: 'blur'},
          {required: true, message: '品牌名不能为空', trigger: 'change'},
          { max: 15, message: '品牌名不能超过15个字符', trigger: 'blur' },
        ],
        brand_icon: [
          {validator: validImages, trigger: 'change'},
          {required: true, message: '请上传图片', trigger: 'change'}
        ],
        complaint_hotline: [
          {required: true, message: '投诉电话不能为空'},
          {pattern: Verification.testStrs.checkMobile, message: '手机号码格式不正确', trigger: 'change'}
        ],
        qr_code: [
          {validator: validQrImages, trigger: 'change'},
          {required: true, message: '请上传图片', trigger: 'change'}
        ],
      },
    }
  },
  methods: {
    //返回价格
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    //处理价格
    handlePrice(price){
      return DataHandle.handlePrice(price);
    },

    showEditDialog(item) {
      this.settingsDialogIsShow = true;
      this.dialogSettingItem = item;

      let that = this;

      switch (item.settingType) {
        case 'brand':
          that.systemBrandGet((brandInfo) => {
          });
          break;
        case 'delivery':
          that.basicdataDeliveryInfoGet((deliveryInfo) => {
          });
          break;
        case 'operating':
          that.basicdataOrderTimeGet((orderTime) => {
          });
          break;
        case 'order':
          that.basicdataConfirmTimeGet((confirmTime) => {
          });
          break;
        case 'shipping':
          that.basicdataShipTypeGet((shipType) => {
          });
          break;
      }
    },

    onCancelDialog() {
      this.settingsDialogIsShow = false;
      this.dialogSettingItem = {};
    },
    onConfirm(item) {
      let that = this;
      let {orderTime, deliveryInfo, confirmTime, shipType, brandInfo} = that;
      switch (item.settingType) {
        case 'brand':
          that.submitBrandInfo(() => {
            that.onCancelDialog();
            that.updateSettingItemsInfo('brand', brandInfo);
          });
          break;
        case 'delivery':
          that.submitDeliveryInfo(() => {
            that.onCancelDialog();
            that.updateSettingItemsInfo('delivery', deliveryInfo);
          });
          break;
        case 'order':
          that.submitConfirmTime(() => {
            that.onCancelDialog();
            that.updateSettingItemsInfo('order', confirmTime);
          });
          break;
        case 'shipping':
          that.basicdataShipTypeSet(() => {
            that.onCancelDialog();
            that.updateSettingItemsInfo('shipping', shipType);
          });
          break;
      }

    },

    updateSettingItemsInfo(type, data) {
      let {settingItems} = this;
      switch (type) {
        case 'brand':
          //品牌logo
          settingItems[0].content[0].value = Config.tencentPath + data.brand_icon[0] + '_min200x200';
          //品牌名
          settingItems[0].content[1].value = data.brand_name;
          //投诉电话
          settingItems[0].content[2].value = data.complaint_hotline;
          //客服微信
          settingItems[0].content[3].value = Config.tencentPath + data.qr_code[0] + '_min200x200';
          break;
        case 'delivery':
          //运费设置
          settingItems[1].content[0].value = '全场满' + data.discount_delivery_line + '元，免运费';
          settingItems[1].content[1].value = data.delivery_price + '元';
          break;
        case 'order':
          //订单确认方式设置
          settingItems[2].content[0].value = data.is_auto_confirmed === '1' ? '自动确认和手动确认' : '手动确认';
          if (data.is_auto_confirmed === '1') {
            settingItems[2].content[0].appendix = '(截单时间: ' + data.confirm_time + ')';
          } else {
            settingItems[2].content[0].appendix = null;
          }
          break;
        case 'shipping':
          settingItems[3].content[0].value = data.ship_type === 'merchant' ? '是' : '否';
          break;
      }
    },

    //品牌信息start----------------------------------------
    changeBrandIcon() {
      this.$refs['brandRuleForm'].validateField('brand_icon');
    },
    changeBrandQr() {
      this.$refs['brandRuleForm'].validateField('qr_code');
    },
    //品牌信息end----------------------------------------

    //提交运费
    submitDeliveryInfo(callback) {
      let that = this;
      that.$refs['ruleForm1'].validate((valid) => {
        if (valid) {
          that.basicdataDeliveryInfoSet(callback)
        } else {
          return false;
        }
      });
    },
    //提交下单时间
    submitOrderTime(callback) {
      let that = this;
      that.$refs['ruleForm2'].validate((valid) => {
        if (valid) {
          that.basicdataOrderTimeSet(callback)
        } else {
          return false;
        }
      });
    },
    //提交截单时间
    submitConfirmTime(callback) {
      let that = this;
      that.$refs['ruleForm3'].validate((valid) => {
        if (valid) {
          that.basicdataConfirmTimeSet(callback)
        } else {
          return false;
        }
      });
    },
    //提交品牌信息
    submitBrandInfo(callback) {
      let that = this;
      that.$refs['brandRuleForm'].validate((valid) => {
        if (valid) {
          that.systemBrandSet(callback)
        } else {
          return false;
        }
      });
    },
    //提交广告语
    submitAdvert(callback) {
      let that = this;
      that.$refs['adRuleForm'].validate((valid) => {
        if (valid) {
          that.basicdataAdSet(callback)
        } else {
          return false;
        }
      });
    },
    async basicdataConfirmTimeGet(callback) {
      let that = this;
      let { confirmTime } = that;
      let res = await System.basicdataConfirmTimeGet();
      if (res.code === 0) {
        confirmTime.confirm_time = res.data.confirm_time;
        confirmTime.is_auto_confirmed = res.data.is_auto_confirmed;
        typeof callback === 'function' && callback(confirmTime);
      }
    },
    async basicdataConfirmTimeSet(callback) {
      let that = this;
      let { confirmTime } = that;
      let res = await System.basicdataConfirmTimeSet({
        is_auto_confirmed: confirmTime.is_auto_confirmed,
        confirm_time: confirmTime.confirm_time
      });
      if (res.code === 0) {
        Notification.success({
          title: '提示',
          message: '订单确认方式设置成功'
        });
        typeof callback === 'function' && callback();
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
    async basicdataOrderTimeGet(callback) {
      let that = this;
      let { orderTime } = that;
      let res = await System.basicdataOrderTimeGet();
      if (res.code === 0) {
        orderTime.orderTimeRange = [res.data.order_start_time, res.data.order_end_time]
        typeof callback === 'function' && callback(orderTime);
      }
    },
    async basicdataOrderTimeSet(callback) {
      let that = this;
      let { orderTime } = that;
      let res = await System.basicdataOrderTimeSet({
        order_start_time: orderTime.orderTimeRange[0],
        order_end_time: orderTime.orderTimeRange[1]
      });
      if (res.code === 0) {
        Notification.success({
          title: '提示',
          message: '下单时间设置成功'
        });
        typeof callback === 'function' && callback();
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
    async basicdataDeliveryInfoGet(callback) {
      let that = this;
      let { deliveryInfo } = that;
      let res = await System.basicdataDeliveryInfoGet();
      if (res.code === 0) {
        deliveryInfo.delivery_price = DataHandle.returnPrice(res.data.delivery_price);
        deliveryInfo.discount_delivery_line = DataHandle.returnPrice(res.data.discount_delivery_line);
        typeof callback === 'function' && callback(deliveryInfo)
      }
    },
    async basicdataDeliveryInfoSet(callback) {
      let that = this;
      let { deliveryInfo } = that;
      let res = await System.basicdataDeliveryInfoSet({
        delivery_price: DataHandle.handlePrice(deliveryInfo.delivery_price),
        discount_delivery_line: DataHandle.handlePrice(deliveryInfo.discount_delivery_line)
      });
      if (res.code === 0) {
        Notification.success({
          title: '提示',
          message: '运费设置成功'
        });
        typeof callback === 'function' && callback();
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
    //设置发货方式
    async basicdataShipTypeGet(callback) {
      let that = this;
      let { shipType } = that;
      let res = await System.basicdataShipTypeGet();
      if (res.code === 0) {
        shipType.ship_type = res.data;
        typeof callback === 'function' && callback(shipType);
      }
    },
    //获取发货方式
    async basicdataShipTypeSet(callback) {
      let that = this;
      let { shipType } = that;
      let res = await System.basicdataShipTypeSet({
        ship_type: shipType.ship_type,
      });
      if (res.code === 0) {
        Notification.success({
          title: '提示',
          message: '发货方式设置成功'
        });
        typeof callback === 'function' && callback();
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },

    //获取品牌信息
    async systemBrandGet(callback) {
      let that = this;
      let { brandInfo } = that;
      let res = await System.systemBrandGet();
      if (res.code === 0) {
        brandInfo.brand_name = res.data.brand_name;
        brandInfo.brand_icon = res.data.brand_icon.split();
        brandInfo.complaint_hotline = res.data.complaint_hotline;
        brandInfo.qr_code = res.data.qr_code.split();
        typeof callback === 'function' && callback(brandInfo);
      }
    },
    //设置品牌信息
    async systemBrandSet(callback) {
      let that = this;
      let { brandInfo } = that;
      let res = await System.systemBrandSet({
        brand_name: brandInfo.brand_name,
        brand_icon: brandInfo.brand_icon.join(),
        complaint_hotline: brandInfo.complaint_hotline,
        qr_code: brandInfo.qr_code.join()
      });
      if (res.code === 0) {
        Notification.success({
          title: '提示',
          message: '品牌信息设置成功'
        });
        typeof callback === 'function' && callback();
      }else{
        MessageBox.alert(res.message, '提示');
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .settingItem{
    width: 526px;
    padding-right: 20px;
    >.title{
      margin-left: 20px;
      margin-top: 20px;
      font-size: 14px;
      color: #3B3D42;
      font-weight: bold;
    }
    >.content{
      >.item{
        margin-top: 20px;
        display: flex;
        font-size: 12px;
        width: 100%;
        >.name {
          width: 112px;
          flex: none;
          color: #73767D;
          text-align: right;
        }
        >.space{
          width: 12px;
          flex: none;
        }
        >.value{
          flex: 1;
          color: #3B3D42;
          text-align: left;
          >.appendix{
            padding-left: 12px;
          }
        }
      }
    }
    >.operation{
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }

  .setting{
    padding: 60px 0 0 100px;
  }
  .radio {
    display: block;
    padding: 10px 0;
    margin-left: 0px;
  }

</style>


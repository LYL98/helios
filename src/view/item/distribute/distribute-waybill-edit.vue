<template>
  <div>
    <el-form label-position="right" label-width="120px" size="mini" class="px-20">
      <el-form-area class="bg-grey py-10">
        <el-row :gutter="32">
          <el-col :sm="10" :span="10">
            <el-form-item class="m-0" label="调拨计划单：">{{ formData.plan_code || '-' }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="10" :span="10">
            <el-form-item class="m-0" label="调出仓：">
              {{ formData.src_storehouse_title }}
            </el-form-item>
          </el-col>
          <el-col :sm="10" :span="10">
            <el-form-item class="m-0" label="调入仓：">
              {{ formData.tar_storehouse_title }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="10" :span="10">
            <el-form-item class="m-0" label="销售日期：">
              {{ formData.available_date || '-' }}
            </el-form-item>
          </el-col>
          <el-col :sm="10" :span="10">
            <el-form-item class="m-0" label="预计到货：">
              {{ formData.estimate_arrive_at || '-' }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-area>
    </el-form>
    <el-form class="mt-20" label-position="right" label-width="120px" :model="formData" ref="ruleForm">

      <el-form-area label="配送司机">
        <el-row :gutter="32">
          <el-col :sm="10" :span="10">
            <el-form-item
              label="司机"
              prop="driver_id"
              :rules="[ { required: true, message: '司机不能为空', trigger: 'change' } ]"
            >
              <el-select
                v-model="formData.driver_id"
                remote
                filterable
                :remote-method="remoteDriver"
                :loading="remoting"
                placeholder="请搜索指定配送司机"
                style="width: 100%"
                no-match-text="没有符合条件的司机"
                no-data-text="没有符合条件的司机"
              >
                <el-option
                  v-for="item in driver_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  @click.native="changeDriver(item)"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="10" :span="10">
            <el-form-item
              label="手机号"
              prop="phone"
            >
              <el-input v-model="formData.phone" disabled placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="10" :span="10">
            <el-form-item
              label="车牌"
              prop="driver_car_num"
            >
              <el-input v-model="formData.driver_car_num" disabled placeholder="请输入车牌" />
            </el-form-item>
          </el-col>
          <el-col :sm="10" :span="10">
            <el-form-item
              label="车型"
              prop="driver_car_type"
            >
              <el-input v-model="formData.driver_car_type" disabled placeholder="请输入车型" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="10" :span="10">
            <el-form-item
              label="运费"
              prop="fee"
              :rules="[ { required: true, message: '运费不能为空', trigger: 'change' }, { validator: validFee, trigger: 'blur' } ]"
            >
              <el-input
                v-model="formData.fee"
                placeholder="请输入运费"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-area>

      <el-form-area label="调拨商品">
        <el-row :gutter="32">
          <el-col :sm="20" :span="10" style="padding-left: 60px">
            <el-table
              :data="formData.p_items"
              :row-class-name="highlightRowClassName"
              highlight-current-row="highlight-current-row"
            >
              <el-table-column prop="item_title" label="商品编号/名称" />
              <el-table-column prop="num" label="调拨数量" width="180" align="center">
                <template slot-scope="scope">
                  <span v-if="!!scope.row.num">{{scope.row.num}}件</span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column prop="is_active" label="指定调拨商品" width="140" align="center">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.is_active"
                    :active-value="true"
                    :inactive-value="false"
                  >
                  </el-switch>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-form-area>

      <el-form-item class="mt-30">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import { Form, FormItem, Row, Col, Button, Input, Switch, Select, Option, Message } from "element-ui";
  import {FormArea} from '@/common';
  import {SelectStorehouse, SelectGItem} from '@/component';
  import {Http, Config, DataHandle} from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';
  export default {
    name: "distribute-waybill-edit",
    mixins: [tableMixin],
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-input': Input,
      'el-switch': Switch,
      'el-select': Select,
      'el-option': Option,
      'el-form-area': FormArea,
      'el-select-storehouse': SelectStorehouse,
      'el-select-g-item': SelectGItem,
    },
    props: {
      type: { type: String, default: '' },
      item: { type: Object, default: () => ({}) },
    },
    data() {
      return {
        remoting: false,
        driver_list: [],

        loading: false,
        formData: {

        }
      }
    },
    created() {

      // 从调拨计划列表生成调拨单，此处需要获取调拨计划详情
      if (this.$props.type === 'add') {
        let formData = {...this.$props.item};
        this.$data.formData = {
          plan_id: Number(formData.id), // 接口需要调拨计划的id
          plan_code: formData.code,
          src_storehouse_id: formData.src_storehouse_id,
          src_storehouse_title: formData.src_storehouse && formData.src_storehouse.title || '-',
          tar_storehouse_id: formData.tar_storehouse_id,
          tar_storehouse_title: formData.tar_storehouse && formData.tar_storehouse.title || '-',
          available_date: formData.available_date,
          estimate_arrive_at: formData.estimate_arrive_at,
          driver_id: '',
          phone: '',
          driver_car_num: '',
          driver_car_type: '',
          fee: '',
          p_items: formData.p_items.map(item => ({
            id: Number(item.id),
            item_title: item.item_title,
            num: Number(item.num),
            is_active: item.distribute_order_num === 0 ? true : false,
          }))
        };
      }

      if (this.$props.type === 'modify') {
        let formData = {...this.$props.item};
        this.$data.formData = {
          id: Number(formData.id),
          plan_id: Number(formData.plan_id), // 接口需要调拨计划的id
          code: formData.code,
          plan_code: formData.plan_code,
          src_storehouse_id: Number(formData.src_storehouse_id),
          src_storehouse_title: formData.src_storehouse_title || '-',
          tar_storehouse_id: Number(formData.tar_storehouse_id),
          tar_storehouse_title: formData.tar_storehouse_title || '-',
          available_date: formData.available_date,
          estimate_arrive_at: formData.estimate_arrive_at,
          driver_id: Number(formData.driver_id),
          phone: formData.driver ? formData.driver.phone : '',
          driver_car_num: formData.driver ? formData.driver.driver_car_num : '',
          driver_car_type: formData.driver ? formData.driver.driver_car_type : '',
          fee: DataHandle.returnPrice(formData.fee),
          p_items: formData.p_items.map(item => {
            return {
              id: Number(item.id),
              item_title: item.item_title,
              num: Number(item.num),
              is_active: formData.distributes.some(d => d.plan_detail_id === item.id), // 如果该商品在调拨单中存在，则处于激活状态
            }
          })
        }

        if (formData.driver) {
          const {id, realname, phone, driver_car_num, driver_car_type} = formData.driver;
          this.$data.driver_list = [{
            value: id,
            label: realname,
            phone: phone,
            driver_car_num: driver_car_num,
            driver_car_type: driver_car_type,
          }];
        }
      }
    },
    methods: {

      async remoteDriver(keywords) {
        this.$data.remoting = true;
        // 查询当日 该调出仓可用的司机
        let res = await Http.get(Config.api.itemSupDistributeGetDriver, {
          delivery_date: DataHandle.formatDate(new Date(), 'yyyy-MM-dd'),
          condition: keywords,
        });
        this.$data.remoting = false;
        if (res.code !== 0) return;
        this.$data.driver_list = (res.data || []).map(item => ({
          value: item.id,
          label: item.realname,
          phone: item.phone,
          driver_car_num: item.driver_car_num,
          driver_car_type: item.driver_car_type,
        }));
      },

      changeDriver(item) {
        this.$data.formData.phone = item.phone;
        this.$data.formData.driver_car_num = item.driver_car_num;
        this.$data.formData.driver_car_type = item.driver_car_type;
      },

      validFee(rules, value, callback) {
        // if (Number(value) === 0) {
        //   return callback('运费必须是大于0的数字，且只能够保留2位小数');
        // }
        if (/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{0,2})))$/.test(value)) {
          return callback();
        }
        return callback('运费必须是大于0的数字，且只能够保留2位小数');
      },

      onSubmit() {
        this.$refs['ruleForm'] && this.$refs['ruleForm'].validate(async valid => {
          if (!valid) return;

          let formData = {...this.$data.formData};
          formData = {
            id: formData.id,
            plan_id: Number(formData.plan_id),
            plan_detail_ids: formData.p_items.filter(item => item.is_active).map(item => Number(item.id)),
            driver_id: Number(formData.driver_id),
            fee: DataHandle.handlePrice(formData.fee),
          };

          if (formData.plan_detail_ids.length <= 0) {
            Message.warning({ message: '请指定调拨商品！', offset: 100 });
            return;
          };

          const API = this.$props.type === 'add'
            ? Config.api.itemSupDistributeWaybillAdd
            : Config.api.itemSupDistributeWaybillModify;

          this.$data.loading = true;
          let res = await Http.post(API, formData);
          this.$data.loading = false;
          if (res.code === 0) {
            this.$message({message: `${this.$props.type === 'add' ? '新增' : '编辑'}成功`, type: 'success'});
            this.$emit('submit');
          } else {
            this.$message({title: '提示', message: res.message, type: 'error'});
          }

        });
      },

      onCancel() {
        this.$emit('cancel');
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
  .bg-grey {
    background-color: #EEE;
  }
  .px-20 {
    padding-left: 20px;
    padding-right: 20px;
  }
  .py-10 {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .m-0 {
    margin: 0;
  }
  .mt-10 {
    margin-top: 10px;
  }

  .mt-20 {
    margin-top: 20px;
  }

  .mt-30 {
    margin-top: 30px;
  }
</style>

<style lang="scss">
  @import '@/share/scss/table.global.scss';

</style>

<template>
  <div>
    <el-form label-position="right" label-width="120px" size="mini" class="px-20">
      <el-form-area class="bg-grey py-10">
        <el-row :gutter="32">
          <el-col :sm="10" :span="10">
            <el-form-item class="m-0" label="调拨计划单：">{{ formData.code || '-' }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="32">
          <el-col :sm="10" :span="10">
            <el-form-item class="m-0" label="调出仓：">
              {{ formData.src_storehouse && formData.src_storehouse.title || '-' }}
            </el-form-item>
          </el-col>
          <el-col :sm="10" :span="10">
            <el-form-item class="m-0" label="调入仓：">
              {{ formData.tar_storehouse && formData.tar_storehouse.title || '-' }}
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
              <el-select-driver filterable :createdGetData="false" v-model="formData.driver_id" placeholder="请搜索指定司机" @change="changeDriver" />
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
              stripe
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
  import { Form, FormItem, Row, Col, Button, Input, Table, TableColumn, Switch } from "element-ui";
  import {FormArea} from '@/common';
  import {SelectStorehouse, SelectGItem, SelectDriver} from '@/component';
  import {Http, Config, DataHandle} from '@/util';
  export default {
    name: "distribute-edit",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-input': Input,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-switch': Switch,
      'el-form-area': FormArea,
      'el-select-storehouse': SelectStorehouse,
      'el-select-g-item': SelectGItem,
      'el-select-driver': SelectDriver,
    },
    props: {
      type: { type: String, default: '' },
      item: { type: Object, default: () => ({}) },
    },
    data() {
      return {
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
          id: Number(formData.id), // 接口需要调拨计划的id
          code: formData.code,
          src_storehouse: formData.src_storehouse,
          tar_storehouse: formData.tar_storehouse,
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
            is_active: true,
          }))
        };
      }

      if (this.$props.type === 'modify') {
        let formData = {...this.$props.item};
        this.$data.formData = {
          id: Number(formData.id),
          available_date: formData.available_date,
          estimate_arrive_at: formData.estimate_arrive_at,
          src_storehouse_id: Number(formData.src_storehouse_id),
          tar_storehouse_id: Number(formData.tar_storehouse_id),
          p_items: formData.p_items.map(item => ({
            id: Number(item.id),
            item_title: item.item_title,
            num: Number(item.num)
          }))
        }
      }
    },
    methods: {

      handleDeleteItem(i) {

      },

      handleAddItem() {

      },

      changeDriver(item) {
        this.$data.formData.phone = item.phone;
        this.$data.formData.driver_car_num = item.driver_car_num;
        this.$data.formData.driver_car_type = item.driver_car_type;
      },

      validFee(rules, value, callback) {
        if (Number(value) === 0 || /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{0,2})))$/.test(value)) {
          return callback();
        }
        return callback('运费必须是数字，且只能够保留2位小数');
      },

      onSubmit() {
        this.$refs['ruleForm'] && this.$refs['ruleForm'].validate(async valid => {
          if (!valid) return;

          this.$data.loading = true;
          let formData = {...this.$data.formData};
          formData = {
            plan_id: Number(formData.id),
            plan_detail_ids: formData.p_items.map(item => Number(item.id)),
            driver_id: Number(formData.driver_id),
            fee: DataHandle.handlePrice(formData.fee),
          };

          const API = this.$props.type === 'add'
            ? Config.api.itemSupDistributeAdd
            : Config.api.itemSupDistributePlanModify;

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

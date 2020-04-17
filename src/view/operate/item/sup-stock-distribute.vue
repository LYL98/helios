<template>
  <el-form label-position="right" label-width="140px" :model="formData" ref="ruleForm" class="px-20">
    <el-form-area label="库存信息">
      <el-row :gutter="32">
        <el-col :sm="10" :span="10">
          <el-form-item class="m-0" label="商品编号/名称：">
            {{ formData.p_item.code || '-' }} / {{ formData.p_item.title }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :sm="10" :span="10">
          <el-form-item class="m-0" label="批次：">
            {{ formData.batch_code }}
          </el-form-item>
        </el-col>
        <el-col :sm="10" :span="10">
          <el-form-item class="m-0" label="场地库存：">
            {{ formData.num }}件
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-area>
    <el-form-area class="mt-20" label="调拨信息">
      <el-row :gutter="32">
        <el-col :sm="10" :span="10">
          <el-form-item class="m-0" label="调拨总量">
            <el-input disabled :value="formData.plan_num">
              <template slot="append">件</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="10" :span="10">
          <el-form-item class="m-0" label="已调拨装车">
            <el-input disabled :value="formData.dist_num">
              <template slot="append">件</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" class="mt-20">
        <el-col :sm="10" :span="10">
          <el-form-item
            label="司机"
            prop="distribute_id"
            :rules="[ { required: true, message: '预计到货不能为空', trigger: 'change' } ]"
          >
            <el-select
              v-model="formData.distribute_id"
              filterable
              placeholder="请搜索指定司机"
              style="width: 100%"
              no-match-text="没有符合条件的司机"
            >
              <el-option
                v-for="item in formData.distributes"
                :key="item.distribute_id"
                :label="item.driver_realname"
                :value="item.distribute_id"
                @click.native="changeDriver(item)"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="10" :span="10">
          <el-form-item
            label="调拨数量"
            prop="need_allocate_num"
            :rules="[
              { required: true, type: 'number', min: 1, message: '调拨数量必须是大于零的整数', trigger: 'change' },
              { validator: validLogic, trigger: 'blur' },
            ]"
          >
            <el-input
              v-model.number="formData.need_allocate_num"
              placeholder="请输入调拨数量"
            >
              <template slot="append">件</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-area>
    <el-form-item class="mt-20">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {Form, FormItem, Row, Col, Button, Input, DatePicker, Select, Option} from "element-ui";
  import {FormArea} from '@/common';
  import {Http, Config, DataHandle} from '@/util';
  export default {
    name: "sup-stock-distribute",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-input': Input,
      'el-select': Select,
      'el-option': Option,
      'el-date-picker': DatePicker,
      'el-form-area': FormArea,
    },
    props: {
      item: { type: Object, default: () => ({}) },
    },
    data() {
      return {
        loading: false,
        formData: {}
      }
    },
    created() {
      this.$data.formData = {
        batch_code: this.$props.item.code,
        num: this.$props.item.num,
        p_item: this.$props.item.p_item,
        distribute_id: '',
        distributes: this.$props.item.distributes.map(item => ({
          distribute_id: item.id,
          driver_realname: item.driver.realname,
          plan_num: item.plan_num,
          dist_num: item.dist_num,
        })),
        plan_num: '',
        dist_num: '',
        need_allocate_num: ''
      }
    },
    methods: {

      changeDriver(item) {
        this.$data.formData.plan_num = item.plan_num;
        this.$data.formData.dist_num = item.dist_num;
      },

      validLogic(rules, value, callback) {
        if (isNaN(value)) return;
        if (!this.$data.formData.distribute_id) return;
        if (value > this.$data.formData.num) {
          return callback('调拨数量不能大于商品库存数量');
        }
        if (value > this.$data.formData.plan_num - this.$data.formData.dist_num) {
          return callback('调拨数量不能大于调拨计划剩余数量');
        }
        callback();
      },

      onSubmit() {
        this.$refs['ruleForm'] && this.$refs['ruleForm'].validate(async valid => {
          if (!valid) return;

          this.$data.loading = true;
          let formData = {...this.$data.formData};
          formData = {
            batch_code: formData.batch_code,
            distribute_id: Number(formData.distribute_id),
            need_allocate_num: Number(formData.need_allocate_num)
          }

          let res = await Http.post(Config.api.operateItemSupStockDistribute, formData);
          this.$data.loading = false;
          if (res.code === 0) {
            this.$message({message: '调拨成功', type: 'success'});
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

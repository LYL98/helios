<template>
  <el-form label-position="right" label-width="120px" :model="formData" ref="ruleForm">
    <el-form-area label="调拨信息">
      <el-row :gutter="32">
        <el-col :sm="10" :span="10">
          <el-form-item
            label="调出仓"
            prop="src_storehouse_id"
            :rules="[ { required: true, message: '调出仓不能为空', trigger: 'change' } ]"
          >
            <el-select-storehouse v-model="formData.src_storehouse_id" placeholder="请选择调出仓" />
          </el-form-item>
        </el-col>
        <el-col :sm="10" :span="10">
          <el-form-item
            label="调入仓"
            prop="tar_storehouse_id"
            :rules="[ { required: true, message: '调入仓不能为空', trigger: 'change' } ]"
          >
            <el-select-storehouse v-model="formData.tar_storehouse_id" placeholder="请选择调入仓" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" class="mt-10">
        <el-col :sm="10" :span="10">
          <el-form-item
            label="销售日期"
            prop="available_date"
            :rules="[ { required: true, message: '配送日期不能为空', trigger: 'change' } ]"
          >
            <el-date-picker
              v-model="formData.available_date"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
              placeholder="请选择销售日期"
              :clearable="false"
            />
          </el-form-item>
        </el-col>
        <el-col :sm="10" :span="10">
          <el-form-item
            label="预计到货"
            prop="available_date"
            :rules="[ { required: true, message: '预计到货不能为空', trigger: 'change' } ]"
          >
            <el-date-picker
              v-model="formData.estimate_arrive_at"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
              placeholder="请你选择预计到货时间"
              :clearable="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-area>

    <el-form-area
      v-for="(item, index) in formData.p_items"
      :key="`item-${index + 1}`"
      :label="`调拨商品${index + 1}`"
    >
      <el-row :gutter="32">
        <el-col :sm="12" :span="10">
          <el-form-item
            label="商品编号/名称"
            :prop="'p_items.' + index + '.p_item_id'"
            :rules="[ { required: true, message: '商品编号/名称不能为空', trigger: 'change' } ]"
          >
            <el-select-g-item
              size="small"
              filterable
              clearable
              v-model="item.p_item_id"
              placeholder="请选择需要调出的商品"
            ></el-select-g-item>
          </el-form-item>
        </el-col>
        <el-col :sm="8" :span="10">
          <el-form-item
            label="调拨数量"
            :prop="'p_items.' + index + '.num'"
            :rules="[
              { required: true, message: '调拨数量不能为空' },
              { type: 'number', min: 1, message: '调拨数量必须是大于零的整数' },
            ]"
          >
            <el-input
              size="small"
              v-model.number="item.num"
              placeholder="请输入调拨数量"
            >
              <template slot="append">件</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="4" :span="10" v-if="index !== 0">
          <el-button type="text" icon="el-icon-delete" @click="handleDeleteItem(index)">移除</el-button>
        </el-col>
      </el-row>
    </el-form-area>

    <el-form-item>
      <el-button size="mini" @click="handleAddItem">新增调拨商品</el-button>
    </el-form-item>

    <el-form-item class="mt-30">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { Form, FormItem, Row, Col, Button, Input, DatePicker } from "element-ui";
  import {FormArea} from '@/common';
  import {SelectStorehouse, SelectGItem} from '@/component';
  import {Http, Config, DataHandle} from '@/util';
  export default {
    name: "distribute-plan-edit",
    components: {
      'el-form': Form,
      'el-form-item': FormItem,
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-input': Input,
      'el-date-picker': DatePicker,
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
        loading: false,
        formData: {
          available_date: '',
          estimate_arrive_at: '',
          src_storehouse_id: '',
          tar_storehouse_id: '',
          p_items: [
            { p_item_id: '', num: '' }
          ]
        }
      }
    },
    created() {
      if (this.$props.type === 'modify') {
        let formData = {...this.$props.item};
        this.$data.formData = {
          id: Number(formData.id),
          available_date: formData.available_date,
          estimate_arrive_at: formData.estimate_arrive_at,
          src_storehouse_id: Number(formData.src_storehouse_id),
          tar_storehouse_id: Number(formData.tar_storehouse_id),
          p_items: formData.p_items.map(item => ({
            p_item_id: Number(item.p_item_id),
            num: Number(item.num)
          }))
        }
      }
    },
    methods: {

      handleDeleteItem(i) {
        this.$data.formData.p_items = this.$data.formData.p_items.filter((item, index) => index !== i);
      },

      handleAddItem() {
        this.$data.formData.p_items = [
          ...this.$data.formData.p_items,
          { p_item_id: '', num: '' }
        ];
      },

      onSubmit() {
        this.$refs['ruleForm'] && this.$refs['ruleForm'].validate(async valid => {
          if (!valid) return;

          this.$data.loading = true;
          let formData = {...this.$data.formData};

          formData.src_storehouse_id = Number(formData.src_storehouse_id);
          formData.tar_storehouse_id = Number(formData.tar_storehouse_id);
          formData.p_items = formData.p_items.map(item => ({
            p_item_id: Number(item.p_item_id),
            num: Number(item.num),
          }))

          const API = this.$props.type === 'add'
            ? Config.api.itemSupDistributePlanAdd
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

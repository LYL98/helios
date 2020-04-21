<template>
  <div>
    <el-form class="custom-form" size="mini" label-position="right" label-width="140px" :model="addData" :rules="rules" ref="ruleForm">
      <h6 class="subtitle">商品信息</h6>
      <el-row>
        <el-form-item label="商品编号/名称">{{item.item_code}}/{{item.item_title}}</el-form-item>
        <el-col :span="12">
          <el-form-item label="批次">{{item.batch_code}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">{{item.supplier_title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓">{{item.storehouse && item.storehouse.title}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售数量">{{Math.abs(item.chg_num)}}件</el-form-item>
        </el-col>
      </el-row>
      <h6 class="subtitle">销售信息</h6>
      <el-row>
        <el-col :span="12">
          <el-form-item label="销售金额" prop="amount">
            <input-price size="medium" v-model="addData.amount" :min="0.01" placeholder="请输入销售金额"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="备注" prop="sale_remark">
            <el-input v-model="addData.sale_remark" type="textarea" :maxlength="20" placeholder="请输入20位以内的字符"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="margin-left: 140px; margin-top: 20px;">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="handleSubmit" :loading="loading">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { Button, Table, TableColumn, FormItem, Form, Row, Col, Input } from "element-ui";
  import { Http, Config } from '@/util';
  import { InputPrice } from '@/common';

  export default {
    name: "market",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-input': Input,
      'input-price': InputPrice,
    },
    props: {
      item: { type: Object, default: {} },
      loading: { type: Boolean, default: false }
    },
    data() {
      return {
        addData: {
          amount: '',
          sale_remark: ''
        },
        rules: {
          amount: [
            { required: true, message: '请输入销售金额', trigger: 'change' }
          ],
          sale_remark: [
            { required: true, message: '请输入备注', trigger: 'change' }
          ]
        }
      }
    },
    created() {
    },
    methods: {
      handleSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$emit('submit', this.addData);
          } else {
            return false;
          }
        });
      },

      handleCancel() {
        this.$emit('cancel');
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>

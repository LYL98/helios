<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="审核状态">
              <el-select size="small"
                         v-model="editQuery.status"
                         placeholder="请选择采购员"
                         clearable
                         class="query-item-select"
                         @change="changeQuery">
                <el-option label="全部" value=""></el-option>
                <el-option label="仓管待审" value="init"></el-option>
                <el-option label="财务待审" value="first_checked"></el-option>
                <el-option label="审核通过" value="second_checked"></el-option>
                <el-option label="驳回" value="declined"></el-option>
              </el-select>
            </my-query-item>
          </el-col>
          <el-col :xl="10" :lg="14" :span="14">
            <my-query-item label="搜索">
              <div style="display: flex">
                <el-input
                  size="small"
                  style="width: 150px;"
                  v-model="editQuery.supplier_name"
                  placeholder="输入供应商名称"
                  class="query-item-input"
                  clearable
                  @keyup.enter.native="changeQuery"
                  @clear="changeQuery"
                  ref="supplier_name"
                />
                <el-input
                  size="small"
                  class="query-item-input"
                  style="margin-left: 2px"
                  v-model="editQuery.item_condition"
                  placeholder="输入商品名称/编号"
                  clearable
                  @keyup.enter.native="changeQuery"
                  @clear="changeQuery"
                  ref="item_condition"
                />
                <el-button size="small"  style="margin-left: 4px" type="primary" icon="el-icon-search" @click="changeQuery"></el-button>
                <el-button v-if="!isExpand" size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>
              </div>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
      <template slot="expand">
        <el-row style="margin-top: 16px;">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="采购员">
              <my-select-buyer
                size="small"
                :isUseToQuery="true"
                v-model="editQuery.buyer_id"
                :provinceCode="province.code"
                @change="changeQuery"/>
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="付款时间">
              <el-date-picker
                size="small"
                v-model="pickerValue"
                type="daterange"
                align="right"
                value-format="yyyy-MM-dd"
                unlink-panels
                :picker-options="fixDateOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changePicker"
                class="query-item-date"
              />
              <el-button size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
    </my-collapse-query>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {Row, Col, Button, Input, DatePicker, Select, Option} from 'element-ui';
  import {ButtonGroup, QueryItem, CollapseQuery, SelectBuyer} from '@/common';
  import { queryMixin } from '@/mixins';
  import { DataHandle } from '@/util';

  export default {
    name: "QueryPurchaseItem",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-date-picker': DatePicker,
      'el-select': Select,
      'el-option': Option,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem,
      'my-select-buyer': SelectBuyer,
      'my-collapse-query': CollapseQuery
    },
    mixins: [queryMixin],
    data() {
      return {
        pickerValue: null,
      }
    },
    computed: {
      ...mapGetters({
        province: 'globalProvince'
      }),
    },
    methods: {
      //搜索日期
      changePicker(value){
        if(value && value.length === 2){
          this.editQuery = Object.assign({}, this.editQuery, {
            begin_date: value[0],
            end_date: value[1],
            page: 1
          })
        } else {
          this.editQuery = Object.assign({}, this.editQuery, {
            begin_date: '',
            end_date: '',
            page: 1
          })
        }
      },
      // 重置搜索
      resetQuery() {
        this.$data.pickerValue = null;
        this.$props.reset();
        this.$refs['supplier_name'].currentValue = '';
        this.$refs['item_condition'].currentValue = '';
      }
    }
  }
</script>

<style scoped>
  .wp-query {
    padding: 0 10px 15px;
    border-bottom: 1px solid #f3f4f6;
  }
</style>

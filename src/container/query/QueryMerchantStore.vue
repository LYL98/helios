<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="所在仓">
              <my-select-city
                size="small"
                :isUseToQuery="true"
                placeholder="所在仓"
                clearable
                v-model="editQuery.city_code"
                :provinceCode="editQuery.province_code"
                @change="changeQuery"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="10" :lg="14" :span="14">
            <my-query-item label="搜索">
              <div style="display: flex">
                <el-input
                  size="small"
                  class="query-item-input"
                  placeholder="门店名称、用户名称、电话"
                  v-model="editQuery.condition"
                  clearable
                  @keyup.enter.native="changeQuery"
                  @clear="changeQuery"
                  ref="condition"
                />
                <el-button size="small" type="primary" @click="changeQuery" style="margin-left: 4px" icon="el-icon-search"></el-button>
                <el-button v-if="!isExpand" size="small" class="query-item-reset" type="primary" plain @click="resetQuery">重置</el-button>
              </div>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
      <template slot="expand">
        <el-row style="margin-top: 16px;">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="审核状态">
              <my-button-group
                :options="{'全部': '', '待审核': 0, '已审核': 1}"
                v-model="editQuery.is_approve"
                @change="changeQuery"
                size="small"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="冻结状态">
              <my-button-group
                :options="{'全部': '', '未冻结': 0, '已冻结': 1}"
                v-model="editQuery.is_freeze"
                @change="changeQuery"
                size="small"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="商户性质">
              <my-button-group
                :options="{'全部': '', '非协议': 0, '协议': 1}"
                v-model="editQuery.is_post_pay"
                @change="changeQuery"
                size="small"
              />
            </my-query-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 16px;">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="创建时间">
              <el-date-picker
                size="small"
                v-model="pickerValue"
                class="query-item-date"
                type="daterange"
                align="right"
                value-format="yyyy-MM-dd"
                unlink-panels
                :picker-options="fixDateOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changePicker"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="团购门店">
              <my-button-group
                :options="{'全部': '', '非团购': 0, '团购': 1}"
                v-model="editQuery.gb_included"
                @change="changeQuery"
                size="small"
              />
              <el-button size="small" class="query-item-reset" type="primary" plain @click="resetQuery">重置</el-button>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
    </my-collapse-query>
  </div>
</template>

<script>
  import {Row, Col, Input, Button, DatePicker} from 'element-ui';
  import {ButtonGroup, QueryItem, CollapseQuery} from '@/common';
  import {SelectCity} from '@/container';
  import { queryMixin } from '@/mixins';

  export default {
    name: "QueryMerchantStore",
    components: {
      CollapseQuery,
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-date-picker': DatePicker,
      'my-query-item': QueryItem,
      'my-button-group': ButtonGroup,
      'my-select-city': SelectCity,
      'my-collapse-query': CollapseQuery
    },
    mixins: [queryMixin],
    data() {
      return {
        pickerValue: null,
      }
    },
    methods: {
      //搜索日期
      changePicker(value){
        if(value && value.length === 2){
          this.editQuery.begin_date = value[0];
          this.editQuery.end_date = value[1];
        }else{
          this.editQuery.begin_date = '';
          this.editQuery.end_date = '';
        }
        this.editQuery.page = 1;
        this.editQuery = Object.assign({}, this.editQuery);
      },
      resetQuery() {
        this.pickerValue = null;
        this.$props.reset();
        this.$refs['condition'].currentValue = '';
        // this.$refs['userinfo'].currentValue = '';
      }
    }
  }
</script>

<style scoped>
</style>

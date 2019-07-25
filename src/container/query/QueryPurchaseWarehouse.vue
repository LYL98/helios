<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="12" :lg="14" :span="14">
            <my-query-item label="搜索">
              <div style="display: flex">
                <el-input
                  size="small"
                  class="query-item-input"
                  v-model="editQuery.supplier_name"
                  placeholder="输入供应商名称"
                  clearable
                  @keyup.enter.native="changeQuery"
                  @clear="changeQuery"
                  ref="supplier_name"
                />
                <el-input
                  size="small"
                  class="query-item-input"
                  v-model="editQuery.item_condition"
                  placeholder="输入商品名称/编号"
                  clearable
                  style="margin-left: 2px"
                  @keyup.enter.native="changeQuery"
                  @clear="changeQuery"
                  ref="item_condition"
                />
                <el-button size="small" style="margin-left: 4px" type="primary" icon="el-icon-search" @click="changeQuery"></el-button>
                <!--<el-button v-if="!isExpand" size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>-->
              </div>
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="采购员">
              <my-select-buyer
                size="small"
                :isUseToQuery="true"
                v-model="editQuery.buyer_id"
                :provinceCode="province.code"
                @change="changeQuery"/>
              <el-button v-if="!isExpand" size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
      <template slot="expand">
        <el-row style="margin-top: 16px;">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="审核状态">
              <my-button-group
                :options="{'待审核': '', '已审核': 1}"
                v-model="editQuery.if_check_opt"
                size="small"
                @change="changeQuery"
              />
              <el-button v-if="editQuery.if_check_opt == ''" size="small" type="primary" class="query-item-reset-offset" plain @click="resetQuery">重置</el-button>
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7" v-if="editQuery.if_check_opt == 1">
            <my-query-item label="审核结果">
              <my-button-group
                :options="{'全部': '', '审核通过': 'first_check', '仓管驳回': 'first_decline'}"
                v-model="editQuery.opt_type"
                @change="changeQuery"
              />
              <el-button v-if="editQuery.if_check_opt == 1" size="small" type="primary" class="query-item-reset" plain @click="resetQuery">重置</el-button>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
    </my-collapse-query>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {Row, Col, Button, Input} from 'element-ui';
  import {ButtonGroup, QueryItem, CollapseQuery, SelectBuyer} from '@/common';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryPurchaseWarehouse",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem,
      'my-select-buyer': SelectBuyer,
      'my-collapse-query': CollapseQuery
    },
    mixins: [queryMixin],
    computed: {
      ...mapGetters({
        province: 'globalProvince'
      }),
    },
    methods: {
      changeQuery() {

        this.editQuery.if_check_opt == 1
          ? this.editQuery.status = ''
          : this.editQuery.status = 'init'

        // 更新editQuery
        this.editQuery = Object.assign(this.editQuery, { page: 1 });
      },
      resetQuery() {
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

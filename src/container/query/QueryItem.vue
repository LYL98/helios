<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="展示分类">
              <my-select-display-class
                size="small"
                :isUseToQuery="true"
                v-model="editQuery.display_class_code"
                v-on:change="changeQuery"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="10" :lg="14" :span="14">
            <my-query-item label="搜索">
              <div style="display: flex">
                <el-input
                  size="small"
                  placeholder="请输入商品编号、名称、标签"
                  clearable
                  class="query-item-input"
                  v-model="editQuery.condition"
                  @clear="changeQuery"
                  ref="search_condition"
                  @keyup.enter.native="changeQuery"
                />
                <el-input
                  size="small"
                  placeholder="请输入最大库存数"
                  clearable
                  @clear="changeQuery"
                  class="query-item-input"
                  style="margin-left: 2px"
                  v-model="editQuery.item_stock_lt"
                  @keyup.enter.native="changeQuery"
                  ref="search_stock"
                />
                <el-button size="small" style="margin-left: 4px" type="primary" @click="changeQuery" icon="el-icon-search"></el-button>
                <el-button v-if="!isExpand" size="small" class="query-item-reset"  type="primary" plain @click="resetQuery">重置</el-button>
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
                :isUseToQuery="true"
                size="small"
                class="query-item-input"
                :provinceCode="query.province_code"
                v-model="editQuery.buyer_id"
                v-on:change="changeQuery"/>
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="审核状态">
              <my-button-group
                :options="{'全部': '', '已审核': 1, '待审核': 0}"
                v-model="editQuery.is_audited"
                @change="changeQuery"
                size="small"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="上架状态">
              <my-button-group
                :options="{'全部': '', '已上架': 1, '未上架': 0}"
                v-model="editQuery.is_on_sale"
                @change="changeQuery"
                size="small"
              />
            </my-query-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 16px">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="活动类型">
              <my-button-group
                :options="{'全部': '', '预售': 1, '非预售': 0}"
                v-model="editQuery.is_presale"
                @change="changeQuery"
                size="small"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="是否赠品">
              <my-button-group
                :options="{'全部': '', '赠品': 1, '非赠品': 0}"
                v-model="editQuery.is_gift"
                @change="changeQuery"
                size="small"
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
  import {Row, Col, Input, Button, Collapse, CollapseItem} from 'element-ui';
  import {ButtonGroup, QueryItem, CollapseQuery, SelectBuyer, SelectDisplayClass} from '@/common';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryItem",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-collapse': Collapse,
      'el-collapse-item': CollapseItem,
      'my-select-buyer': SelectBuyer,
      'my-select-display-class': SelectDisplayClass,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem,
      'my-collapse-query': CollapseQuery
    },
    mixins: [queryMixin],
    methods: {
      // 重置按钮处理
      resetQuery() {
        this.$props.reset();
        this.$refs['search_condition'].currentValue = '';
        this.$refs['search_stock'].currentValue = '';
      },
    }
  }
</script>

<style scoped>

</style>

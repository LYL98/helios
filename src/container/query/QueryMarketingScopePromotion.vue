<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="活动类型">
              <my-button-group
                :options="{'全部': '', '全场满减': 'type_reduction', '全场满折': 'scope_discount'}"
                v-model="editQuery.promotion_type"
                @change="changeQuery"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="活动状态">

              <el-select size="small" v-model="editQuery.date_status" clearable class="query-item-select" @change="changeQuery">
                <el-option label="全部" value=""></el-option>
                <el-option label="未开展" value="date_before"></el-option>
                <el-option label="进行中" value="date_on"></el-option>
                <el-option label="已结束" value="date_out_of"></el-option>
              </el-select>
            </my-query-item>
          </el-col>
          <el-col :xl="8" :lg="10" :span="10">
            <my-query-item label="搜索">
              <div style="display: flex">
                <el-input
                  size="small"
                  class="query-item-input"
                  clearable
                  v-model="editQuery.topic"
                  placeholder="输入活动主题进行查询"
                  @keyup.enter.native="changeQuery"
                  @clear="changeQuery"
                  ref="topic"
                />
                <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px"
                           @click="changeQuery"></el-button>
                <el-button v-if="!isExpand" type="primary" size="small" class="query-item-reset" plain @click="resetQuery">重置</el-button>
              </div>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
      <template slot="expand">
        <el-row style="margin-top: 16px;">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="上架状态">
              <my-button-group
                :options="{'全部': '', '已上架': 'st_activated', '未上架': 'st_deactivated' }"
                v-model="editQuery.status"
                @change="changeQuery"
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
  import {Row, Col, Button, Input, DatePicker, Select, Option} from 'element-ui';
  import {ButtonGroup, QueryItem, CollapseQuery} from '@/common';
  import { queryMixin } from '@/mixins';

  export default {
    name: "QueryMarketingScopePromotion",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem,
      'my-collapse-query': CollapseQuery
    },
    mixins: [queryMixin],
    methods: {
      resetQuery() {
        this.$props.reset();
        this.$refs['topic'].currentValue = '';
      }
    }
  }
</script>

<style scoped>
</style>

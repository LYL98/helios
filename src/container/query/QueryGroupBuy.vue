<template>
  <div class="query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="团购状态">
          <el-select size="small" v-model="editQuery.progress_status" clearable class="query-item-select" @change="changeQuery">
            <el-option label="全部" value=""></el-option>
            <el-option label="未开展" value="pre"></el-option>
            <el-option label="团购中" value="ing"></el-option>
            <el-option label="已结束" value="post"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="上架状态">
          <my-button-group
            :options="{'全部': '', '已上架': 'activated', '未上架': 'deactivated'}"
            v-model="editQuery.status"
            @change="changeQuery"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="8" :lg="10" :span="10">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              class="query-item-input"
              clearable
              v-model="editQuery.condition"
              placeholder="请输入标题、编号"
              @keyup.enter.native="changeQuery"
              @clear="changeQuery"
              ref="condition"
            />
            <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px"
                       @click="changeQuery"></el-button>
            <el-button type="primary" size="small" class="query-item-reset" plain @click="resetQuery">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Row, Col, Button, Input, Select, Option } from 'element-ui';
  import { ButtonGroup, QueryItem } from '@/common';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryGroupBuy",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem
    },
    mixins: [queryMixin]
  }
</script>

<style scoped>
  .wp-tab-query {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 10px 15px 0;
    border-bottom: 1px solid #f3f4f6;
  }
</style>

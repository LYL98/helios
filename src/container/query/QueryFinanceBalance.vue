<template>
  <div class="query">
    <el-row>
      <el-col :xl="8" :lg="10" :span="10">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              style="width: 300px;"
              clearable
              class="query-item-input"
              v-model="editQuery.title"
              placeholder="输入商户名称"
              @clear="changeQuery"
              @keyup.enter.native="changeQuery"
              ref="merchant_title"
            />
            <el-button size="small" type="primary" style="margin-left: 4px" icon="el-icon-search" @click="changeQuery"></el-button>
            <el-button size="small" type="primary" plain @click="resetQuery" class="query-item-reset">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {Row, Col, Input, Button} from 'element-ui';
  import {QueryItem} from '@/common';
  import { queryMixin } from '@/mixins';
  export default {
    name: "QueryFinanceBalance",
    mixins: [queryMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'my-query-item': QueryItem
    },
    methods: {
      resetQuery() {
        this.$props.reset();
        this.$refs['merchant_title'].currentValue = '';
      }
    }
  }
</script>

<style scoped>

</style>

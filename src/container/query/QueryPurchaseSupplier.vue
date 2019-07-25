<template>
  <div class="query">
    <el-row>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="审核状态">
          <my-button-group
            :options="{'全部': '', '未审核': '0', '已审核': '1'}"
            v-model="editQuery.is_check"
            size="small"
            @change="changeQuery"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="冻结状态">
          <my-button-group
            :options="{'全部': '', '未冻结': '0', '已冻结': '1'}"
            v-model="editQuery.is_freeze"
            size="small"
            @change="changeQuery"
          />
        </my-query-item>
      </el-col>
      <el-col :xl="6" :lg="7" :span="7">
        <my-query-item label="搜索">
          <div style="display: flex">
            <el-input
              size="small"
              class="query-item-input"
              clearable
              v-model="editQuery.condition"
              placeholder="输入供应商名称/联系人"
              @keyup.enter.native="changeQuery"
              @clear="changeQuery"
              ref="condition"
            />
            <el-button size="small" type="primary" style="margin-left: 4px" icon="el-icon-search" @click="changeQuery"></el-button>
            <el-button size=small type="primary" plain class="query-item-reset" @click="resetQuery">重置</el-button>
          </div>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import { Row, Col, Button, Input } from 'element-ui';
  import { ButtonGroup, QueryItem } from '@/common';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryPurchaseSupplier",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem
    },
    mixins: [queryMixin],
    methods: {
      // 重置按钮处理
      resetQuery() {
        this.$props.reset();
        this.$refs['condition'].currentValue = '';
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>

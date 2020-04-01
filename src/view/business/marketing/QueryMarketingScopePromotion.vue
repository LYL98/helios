<template>
  <div class="container-query">
      <el-row :gutter="32">
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="上架状态">
            <select-option
              :options="{'全部': '', '已上架': 'st_activated', '未上架': 'st_deactivated' }"
              v-model="editQuery.status"
              @change="changeQuery"
              size="small"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="活动状态">
            <el-select size="small" v-model="editQuery.date_status" clearable style="width: 100%;" @change="changeQuery">
              <el-option label="全部" value=""></el-option>
              <el-option label="未开展" value="date_before"></el-option>
              <el-option label="进行中" value="date_on"></el-option>
              <el-option label="已结束" value="date_out_of"></el-option>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :xl="8" :lg="10" :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              placeholder="商品编号/名称"
              v-model="editQuery.topic"
              @search="changeQuery"
              @reset="resetQuery"
            />
          </my-query-item>
        </el-col>
      </el-row>
  </div>
</template>

<script>
  import {Row, Col, Button, Input, DatePicker, Select, Option} from 'element-ui';
  import {SelectOption, QueryItem} from '@/common';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryMarketingScopePromotion",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-select': Select,
      'el-option': Option,
      'select-option': SelectOption,
      'my-query-item': QueryItem
    },
    mixins: [queryMixin],
    methods: {
      resetQuery() {
        this.$props.reset();
      }
    }
  }
</script>

<style scoped>
</style>

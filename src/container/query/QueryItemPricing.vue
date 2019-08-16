<template>
  <!-- 头部start -->
    <div class="query">
      <my-collapse-query @expandChange="(isExpand) => onExpandChange(isExpand, 'TableItemPricing')" :defaultExpand="defaultExpand" :isShowExpandButton="isShowExpandButton">
        <template slot="header">
          <el-row>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '报价状态'">
                <button-group
                  :options="{'全部': '', '未报价': 0, '已报价': 1}"
                  v-model="query.is_quoted"
                  @change="handleQuery('TableItemPricing')"
                  size="small"
                />
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '审核状态'">
                <button-group
                  :options="{'全部': '', '未审核': 0, '已审核': 1}"
                  v-model="query.is_approve"
                  @change="handleQuery('TableItemPricing')"
                  size="small"
                />
              </my-query-item>
            </el-col>
            <el-col :xl="8" :lg="10" :span="10">
              <my-query-item label="搜索">
                <div style="display: flex">
                  <el-input
                    size="small"
                    placeholder="请输入商品名称或编号"
                    class="query-item-input"
                    clearable
                    @clear="handleQuery('TableItemPricing')"
                    v-model="query.condition"
                    @keyup.enter.native="handleQuery('TableItemPricing')"
                  />
                  <el-button size="small" type="primary" style="margin-left: 4px" @click="handleQuery('TableItemPricing')" icon="el-icon-search"></el-button>
                  <el-button v-if="!isExpand && !defaultExpand" size="small" type="primary" class="query-item-reset" plain @click="handleClearQuery('TableItemPricing')">重置</el-button>
                </div>
              </my-query-item>
            </el-col>
          </el-row>
        </template>
        <template slot="expand">
          <el-row style="margin-top: 16px;">
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '时间'">
                <el-date-picker
                  v-model="query.opt_date"
                  size="small"
                  type="date"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                  :editable="false"
                  class="query-item-date"
                  @change="handleQuery('TableItemPricing')"
                >
                </el-date-picker>
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item :label="!isPad && '展示分类'">
                <select-display-class
                  :isUseToQuery="true"
                  size="small"
                  :has-all-selection="true"
                  v-model="query.display_class_code"
                  v-on:change="handleQuery('TableItemPricing')"/>
                <el-button size="small" type="primary" class="query-item-reset" plain @click="handleClearQuery('TableItemPricing')">重置</el-button>
              </my-query-item>
            </el-col>
          </el-row>
        </template>
      </my-collapse-query>
    </div>
    <!-- 头部end -->
</template>

<script>
  import { ButtonGroup, SelectDisplayClass } from '@/common';
  import { DataHandle } from '@/util';
  import queryMixin from './query.mixin2';

  export default {
    name: "QueryItemPricing",
    components: {
      'select-display-class': SelectDisplayClass,
      'button-group': ButtonGroup
    },
    mixins: [queryMixin],
    computed: {
      isPad: {
        get() {
          return navigator.userAgent.indexOf('Android') > 0 || navigator.userAgent.indexOf('iPad') > 0;
        }
      }
    },
    created() {
    },
    data() {
      let d = DataHandle.returnDateStr();
      let nowDate = DataHandle.returnDateFormat(d, "yyyy-MM-dd");
      let initQuery = {
        province_code: this.$province.code,
        opt_date: nowDate,
        is_approve: '',
        is_quoted: '',
        display_class_code: '',
        sort: '',
        condition: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
        defaultExpand: false,
        isShowExpandButton: true
      }
    },
    methods: {
      
    }
  }
</script>

<style scoped>

</style>

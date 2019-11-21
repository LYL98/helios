<template>
  <!-- 头部start -->
    <div class="query container-query">
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
              <el-button size="small" type="primary" class="query-item-reset" plain @click="handleClearQuery('TableItemPricing')">重置</el-button>
            </div>
          </my-query-item>
        </el-col>
      </el-row>
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
          <my-query-item :label="!isPad && '科学分类'">
            <select-system-class size="small" v-model="query.system_class_codes" @change="selectSystemClass" style="width: 225px;"/>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <!-- 头部end -->
</template>

<script>
  import { ButtonGroup, SelectSystemClass } from '@/common';
  import { DataHandle } from '@/util';
  import queryMixin from './query.mixin2';

  export default {
    name: "QueryItemPricing",
    components: {
      'select-system-class': SelectSystemClass,
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
        system_class_code: '',
        system_class_codes: [],
        sort: '',
        condition: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
      //选择科学分类
      selectSystemClass(value){
        if(value.length === 0){
          this.$data.query.system_class_code = '';
        }else{
          this.$data.query.system_class_code = value[value.length - 1];
        }
        this.handleQuery('TableItemPricing');
      },
    }
  }
</script>

<style scoped>

</style>

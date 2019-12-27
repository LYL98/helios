<template>
  <!-- 头部start -->
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item :label="!isPad && '报价状态'">
            <select-option
              :options="{'全部': '', '未报价': 0, '已报价': 1}"
              v-model="query.is_quoted"
              @change="handleQuery('TableItemPricing')"
              size="small"
            />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item :label="!isPad && '审核状态'">
            <select-option
              :options="{'全部': '', '未审核': 0, '已审核': 1}"
              v-model="query.is_audited"
              @change="handleQuery('TableItemPricing')"
              size="small"
            />
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input v-model="query.condition" placeholder="请输入商品名称/编号" size="small" @search="handleQuery('TableItemPricing')" @reset="handleClearQuery('TableItemPricing')"/>
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">
        <el-col :span="7">
          <my-query-item :label="!isPad && '时间'">
            <el-date-picker
              v-model="query.opt_date"
              size="small"
              type="date"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :editable="false"
              style="width: 100%;"
              @change="handleQuery('TableItemPricing')"
            >
            </el-date-picker>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item :label="!isPad && '科学分类'">
            <select-system-class size="small" v-model="query.system_class_codes" @change="selectSystemClass"/>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <!-- 头部end -->
</template>

<script>
  import { SelectOption, SelectSystemClass } from '@/common';
  import { DataHandle } from '@/util';
  import queryMixin from './query.mixin';

  export default {
    name: "QueryItemPricing",
    components: {
      'select-system-class': SelectSystemClass,
      'select-option': SelectOption
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
        is_audited: '',
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

<template>
  <!-- 头部start -->
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="区域">
            <global-province type="select" isRequired @change="selectProvince"/>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="销售日期">
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
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input v-model="query.condition" placeholder="请输入商品名称/编号" size="small" @search="handleQuery('TableItemPricing')" @reset="handleClearQuery('TableItemPricing')"/>
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">
        <el-col :span="7">
          <my-query-item label="采购员">
            <select-buyer size="small" :provinceCode="query.province_code" v-model="query.buyer_id" @change="handleQuery('TableItemPricing')" />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="科学分类">
            <select-system-class v-model="query.system_class_codes" :clearable="true" size="small" @change="changeSystemClass" />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="加价率低于">
            <input-percent v-model="query.markup_rate" size="small" @keyup.enter.native="handleQuery('TableItemPricing')" />
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">
        <el-col :span="7">
          <my-query-item label="活动">
            <select-option
              :options="{'全部': '', '预售': 1, '非预售': 0}"
              v-model="query.is_presale"
              @change="handleQuery('TableItemPricing')"
              size="small"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <!-- 头部end -->
</template>

<script>
  import { SelectOption, InputPercent, SelectSystemClass } from '@/common';
  import { SelectBuyer, GlobalProvince } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "QueryItemPricing",
    components: {
      'select-option': SelectOption,
      'select-buyer': SelectBuyer,
      'input-percent': InputPercent,
      'select-system-class': SelectSystemClass,
      'global-province': GlobalProvince,
    },
    mixins: [queryMixin],
    created() {
      this.$data.initQuery.opt_date = this.today;
      this.$data.query.opt_date = this.today;
    },
    data() {
      let initQuery = {
        province_code: '',
        opt_date: '',
        buyer_id: '',
        sort: '',
        condition: '',
        markup_rate: '',
        is_presale: '',
        system_class_code: '',
        system_class_codes: [],
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
      //改变科学分类
      changeSystemClass(value, data) {
        this.$data.query.system_class_code = data.code || '';
        this.handleQuery('TableItemPricing');
      },
      //选择区域后【页面初始化】
      selectProvince(data){
        this.$data.initQuery.province_code = data.code;
        this.$data.query.province_code = data.code;
        this.handleQuery('TableItemPricing');
      }
    }
  }
</script>

<style scoped>

</style>

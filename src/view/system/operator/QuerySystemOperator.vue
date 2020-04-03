<template>
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="权限级别">
          <!--
            如果用户是local类型：
              1、只显示他所在权限级别的区域
              2、默认选中该区域
              3、不可清除
              4、重置时，也默认选中该区域
          -->
          <el-select
            :value="query.opt_type === '' ? '全部' : (query.opt_type === 'global' ? query.opt_type : provinceName)"
            placeholder="请选择"
            :clearable="query.opt_type === 'global' || !query.opt_type"
            style="width: 100%;"
            size="small"
            @change="handleChangeQuery"
          >
            <template v-if="query.opt_type !== 'local'">
              <el-option label="全部" value="">全部</el-option>
              <el-option label="总部" value="global">总部</el-option>
            </template>
            <el-option v-for="item in provinceList" :label="item.title" value="local" :key="item.code" @click.native="handleChangeProvince(item.code)"></el-option>
          </el-select>
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="角色">
          <select-role size="small" clearable showAll v-model="query.role_id" @change="handleQuery('TableSystemOperator')"></select-role>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="用户名/手机号"
            v-model="query.condition"
            @search="handleQuery('TableSystemOperator')"
            @reset="handleClearQuery('TableSystemOperator')"
          />
        </my-query-item>
      </el-col>
    </el-row>
    <el-row :gutter="32" style="margin-top: 16px;">
      <el-col :span="7">
        <my-query-item label="职务">
          <select-option
            :options="{'全部': '', ...operatorPost}"
            v-model="query.post"
            @change="handleQuery('TableSystemOperator')"
            size="small"
            clearable
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="状态">
          <select-option
            clearable
            :options="{'全部': '', '已冻结': 1, '未冻结': 0}"
            v-model="query.is_freeze"
            @change="handleQuery('TableSystemOperator')"
            size="small"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from '@/share/mixin/query.mixin';
  import { SelectOption } from '@/common';
  import { Constant } from '@/util';
  import { SelectRole } from '@/component';

  import { Http, Config } from '@/util';

  export default {
    name: "QuerySystemOperator",
    mixins: [queryMixin],
    components: {
      'select-role': SelectRole,
      'select-option': SelectOption,
    },
    props: {
    },
    computed: {
      provinceName: {
        get() {
          let find = this.provinceList.find(item => item.code === this.query.province_code);
          if (!find) return '';
          return find.title;
        }
      }
    },
    created() {
      this.baseProvinceList();
    },
    data() {
      let initQuery = {
        opt_type: this.$myInfo.opt_type === 'local' ? 'local' : '',
        province_code: this.$myInfo.opt_type === 'local' ? this.$myInfo.province_code : '',
        condition: '',
        is_freeze: '',
        post: '',
        role_id: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
        operatorPost: Constant.OPERATOR_POST('value_key'),
        provinceList: [],
      }
    },
    methods: {
      initQueryData() {
        this.$data.query = {
          opt_type: this.$myInfo.opt_type === 'local' ? 'local' : '',
          province_code: this.$myInfo.opt_type === 'local' ? this.$myInfo.province_code : '',
          condition: '',
          is_freeze: '',
          post: '',
          role_id: '',
          page: 1,
          page_size: Constant.PAGE_SIZE,
        };
      },
      async baseProvinceList(){
        let res = await Http.get(Config.api.baseProvinceList, {});
        if(res.code === 0) {
          let list = res.data || [];
          if (this.$myInfo.opt_type === 'local') {
            list = list.filter(item => item.code === this.$myInfo.province_code);
          }
          this.$data.provinceList = list;
        }
      },
      handleChangeQuery(type) {
        if (type === 'local') {
          this.query.opt_type = 'local';
          return;
        }
        this.query.opt_type = type;
        this.query.province_code = '';
        this.handleQuery('TableSystemOperator');
      },
      handleChangeProvince(province_code) {
        this.query.province_code = province_code;
        this.handleQuery('TableSystemOperator');
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/share/scss/query.scss';
</style>

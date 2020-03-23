<template>
  <!-- 头部start -->
  <div class="container-query">
    <el-row :gutter="32">
      <el-col :span="7">
        <my-query-item label="区域">
          <el-select size="small" v-model="query.province_code" clearable filterable placeholder="选择区域" style="width: 100%;" @change="changeProvince">
            <el-option
              v-for="item in provinceList"
              :key="item.code"
              :label="item.title"
              :value="item.code">
            </el-option>
          </el-select>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Http, Config } from '@/util';
  import queryMixin from '@/share/mixin/query.mixin';

  export default {
    name: "Query",
    mixins: [queryMixin],
    components: {
    },
    created() {
      this.baseProvinceList(); //获取区域
    },
    data() {
      let initQuery = {
        province_code: '',
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
        provinceList: [],
      }
    },
    methods: {
      //区域改变
      changeProvince(v, isInit) {
        if (!isInit) this.handleQuery('Table');
      },
      //获取所有区域
      async baseProvinceList(){
        let res = await Http.get(Config.api.baseProvinceList, {});
        if(res.code === 0){
          let rd = res.data;
          this.$data.provinceList = rd;
          //如果只有一个区域，默认选择，页面不显示
          // if(rd.length === 1){
          //   that.changeProvince(rd[0].code, true);
          // }
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  
</style>

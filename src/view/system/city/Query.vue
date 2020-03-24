<template>
  <div class="query">
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
      <el-col :span="7">
        <my-query-item label="片区">
          <el-select size="small" v-model="query.zone_ids" clearable filterable placeholder="选择片区" style="width: 100%;" @change="changeZone">
            <el-option
              v-for="item in zoneList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import queryMixin from '@/share/mixin/query.mixin';
  import { Http, Config } from '@/util';

  export default {
    name: "Query",
    mixins: [queryMixin],
    components: {
    },
    created() {
      this.baseProvinceList();
      this.baseZoneList();
    },
    data() {
      let initQuery = {
        province_code: '',
        zone_ids: ''
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
        provinceList: [],
        zoneList: []
      }
    },
    methods: {
      //区域改变
      changeProvince(v, isInit) {
        this.page = 1;
        this.$data.query.zone_ids = '';
        this.baseZoneList();
        if (!isInit) this.handleQuery('Table');
      },
      //获取所有区域
      async baseProvinceList(){
        let that = this;
        let res = await Http.get(Config.api.baseProvinceList, {});
        if(res.code === 0){
          let rd = res.data;
          that.$data.provinceList = rd;
          //如果只有一个区域，默认选择，页面不显示
          // if(rd.length === 1){
          //   that.changeProvince(rd[0].code, true);
          // }
        }else{
          MessageBox.alert(res.message, '提示');
        }
      },
      //片区改变
      changeZone(v, isInit) {
        this.page = 1;
        if (!isInit) this.handleQuery('Table');
      },
      //获取所有片区
      async baseZoneList(){
        let that = this;
        let { province_code } = that.query;
        let res = await Http.get(Config.api.baseZoneList, {
          province_code: province_code
        });
        if(res.code === 0){
          let rd = res.data;
          that.$data.zoneList = rd;
          //如果只有一个片区，默认选择，页面不显示
          // if(rd.length === 1){
          //   that.changeZone(rd[0].code, true);
          // }
        }else{
          MessageBox.alert(res.message, '提示');
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  
</style>

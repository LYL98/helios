<template>
  <div>
    <!-- type === defalut -->
    <el-dropdown trigger="click" placement="bottom" @command="changeProvince" class="select-province" v-if="type === 'default'">
      <div class="select-province-div">
        <template v-if="province.title">{{province.title}}</template>
        <template v-else-if="isRequired">选择区域</template>
        <template v-else>全部区域</template>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="{}" v-if="!isRequired" :style="!province.id && 'color: #00ADE7;'">全部区域</el-dropdown-item>
        <el-dropdown-item :command="item" v-for="(item, index) in dataItem" :key="index" :style="province.code === item.code && 'color: #00ADE7;'">{{item.title}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- type === select -->
    <el-select v-model="selectCode" filterable placeholder="全部" :size="size" :clearable="!isRequired" style="width:100%;" v-else-if="type === 'select'">
      <el-option v-for="(item, index) in dataItem" :key="index" :label="item.title" :value="item.code"/>
    </el-select>
    
    <!--选择区域-->
    <div v-if="isShow" class="province-item">
      <div v-if="dataItem.length > 0">
        <el-tag :type="province && province.code === item.code ? 'danger' : 'info'" v-for="(item, index) in dataItem" :key="index" style="margin: 10px 10px 0 0;cursor:pointer;" @click.native="changeProvince(item)">{{item.title}}</el-tag>
      </div>
      <div style="color: #999;font-size: 18px;" v-else>无权限访问</div>
    </div>
  </div>
</template>

<script>
import { Tag, Dropdown, DropdownMenu, DropdownItem, Select, Option } from 'element-ui';
import { Http, Config, Method } from '@/util';

export default {
  name: "GlobalProvince",
  components: {
    'el-tag': Tag,
    'el-dropdown': Dropdown,
    'el-dropdown-menu': DropdownMenu,
    'el-dropdown-item': DropdownItem,
    'el-select': Select,
    'el-option': Option
  },
  props: {
    type: { type: String, default: 'default' }, //类型
    size: { type: String, default: 'small' }, //type 为 select 时可用
    isRequired: { type: Boolean, default: false }, //必选一个区域
  },
  data() {
    return {
      province: this.$province || {},
      selectCode: '',
      isShow: false,
      dataItem: []
    };
  },
  created(){
    this.baseProvinceListMy();
  },
  methods: {
    //区域改变
    changeProvince(data){
      this.$data.province = data;
      this.$data.isShow = false;
      Method.setLocalStorage('heliosGlobalProvince', data);//缓存
      this.$emit('change', data);
    },
    //获取所有区域
    async baseProvinceListMy(){
      let { isRequired, province } = this;
      let res = await Http.get(Config.api.baseProvinceListMy, {});
      if(res.code === 0){
        let rd = res.data;
        this.$data.dataItem = rd;
        //如果只有一个区域，默认选择
        if(rd.length === 1 && province.id != rd[0].id){
          this.changeProvince(rd[0]);
        }else if((rd.length === 0 || !province.id) && isRequired){
          this.$data.isShow = true;
        }else{
          let con = rd.filter(item => item.id === province.id);
          if(con.length === 0 && isRequired){
            this.$data.isShow = true;
          }else{
            this.changeProvince(con[0]);
          }
        }
      }else{
        this.$message({ message: res.message, type: 'error' });
      }
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  /*type === defalut*/
  .select-province{
    height: 48px;
    line-height: 48px;
    cursor: pointer;
    .select-province-div{
      font-size: 14px;
      padding: 0 10px;
      color: #73767D;
      i{
        position: relative;
        top: 1px;
        font-size: #D1D4DB;
      }
    }
  }

  /*选择区域*/
  .province-item{
    background: #fff;
    position: fixed;
    z-index: 10;
    top: 16px;
    right: 16px;
    bottom: 16px;
    left: 194px;
  }
</style>

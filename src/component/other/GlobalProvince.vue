<template>
  <div>
    <!-- type === defalut -->
    <el-dropdown trigger="click" placement="bottom" @command="changeProvince" class="select-province" v-if="type === 'default'">
      <div class="select-province-div">
        <template v-if="province.title">{{province.title}}</template>
        <template v-else-if="isShowAll">选择区域</template>
        <template v-else>全部区域</template>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="{title: '', code: ''}" v-if="isShowAll" :style="!province.id && 'color: #00ADE7;'">全部区域</el-dropdown-item>
        <el-dropdown-item :command="item" v-for="(item, index) in dataItem" :key="index" :style="province.code === item.code && 'color: #00ADE7;'">{{item.title}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- type === select -->
    <el-select v-model="selectCode" :filterable="filterable" placeholder="全部" :size="size" :clearable="isShowAll" style="width:100%;" v-else-if="type === 'select'">
      <el-option v-if="isShowAll" label="全部" value=""/>
      <el-option v-for="(item, index) in dataItem" :key="index" :label="item.title" :value="item.code"/>
    </el-select>
    
    <!--选择区域-->
    <div v-if="isShow" class="province-item-body">
      <div class="province-item">
        <div class="title">选择区域</div>
        <template v-if="dataItem.length > 0">
          <div class="item" v-for="(item, index) in dataItem" :key="index" @click="changeProvince(item, 'init')">{{item.title}}</div>
        </template>
        <div class="no-hint" v-else>无权限访问</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
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
    value: { type: String | Object, default: null }, //如果 === null,没传值，类型 === String,已传值
    type: { type: String, default: 'default' }, //类型
    size: { type: String, default: 'small' }, //type 为 select 时可用
    filterable:  { type: Boolean, default: false }, //type 为 select 时可用
    isRequired: { type: Boolean, default: false }, //必选一个区域
    change: { type: Function }
  },
  data() {
    let province = Method.getLocalStorage('globalProvince');
    return {
      province: province || {},
      isShow: false,
      dataItem: []
    };
  },
  model: {
    prop: 'value',
    event: 'ev'
  },
  created(){
    this.baseProvinceListMy();
  },
  computed: {
    selectCode: {
      get(){
        if(typeof this.value === 'string') return this.value;
        return this.province.code;
      },
      set(code){
        let con = this.dataItem.filter(item => item.code === code);
        this.changeProvince(con[0]);
      }
    },
    //是否显示全部
    isShowAll(){
      if(this.isRequired || this.dataItem.length <= 1){
        return false;
      }
      return true;
    }
  },
  methods: {
    //区域改变 (data: {}, type: 'init')
    changeProvince(data, type){
      data = data || {title: '', code: ''};
      this.$data.province = data;
      this.$data.isShow = false;
      //如必选 或 只有一个区域
      if(!this.isShowAll){
        Method.setLocalStorage('globalProvince', data);//缓存
        //全局注册方法
        Vue.use({
          install(Vue){
            //全局区域
            Vue.prototype.$province = data;
          }
        });
      }
      this.$emit('ev', data.code); //先v-model
      this.$emit('change', data, type); //后change
    },
    //获取所有区域
    async baseProvinceListMy(){
      let { isRequired, province } = this;
      let res = await Http.get(Config.api.baseProvinceListMy, {});
      if(res.code === 0){
        let rd = res.data;
        this.$data.dataItem = rd;
        //如果必选 或者只有一个
        if(isRequired || rd.length === 1){
          if(rd.length === 1 && province.id != rd[0].id){
            this.changeProvince(rd[0], 'init');
          }else if(rd.length === 0 || !province.id){
            this.$data.isShow = true;
          }else{
            let con = rd.filter(item => item.id === province.id);
            if(con.length === 0){
              this.$data.isShow = true;
            }else{
              this.changeProvince(con[0], 'init');
            }
          }
        }
        //否则
        else{
          this.changeProvince({title: '', code: ''}, 'init'); //不必选
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
  .province-item-body{
    background: rgba(0, 0, 0, .3);
    position: fixed;
    z-index: 10;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    >.province-item{
      background: #fff;
      width: 520px;
      padding: 30px;
      >.title{
        margin-bottom: 10px;
      }
      >.item{
        margin: 10px 10px 0 0;
        height: 36px;
        line-height: 36px;
        padding: 0 30px;
        cursor:pointer;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 5px;
        display: inline-block;
        &:hover{
          opacity: .7;
        }
      }
      >.no-hint{
        color: #999;
        font-size: 18px;
      }
    }
  }
</style>

<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="上架状态">
              <button-group
                :options="{'已上架': 1, '未上架': 0}"
                v-model="query.is_on_sale"
                @change="handleQuery('TableItemList')"
                size="small"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="展示分类">
              <select-display-class
                size="small"
                :isUseToQuery="true"
                v-model="query.display_class_code"
                v-on:change="handleQuery('TableItemList')"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="搜索">
              <div style="display: flex">
                <el-input
                  size="small"
                  placeholder="外标签/商品编号/名称"
                  clearable
                  class="query-item-input"
                  v-model="query.condition"
                  @clear="handleQuery('TableItemList')"
                  ref="search_condition"
                  @keyup.enter.native="handleQuery('TableItemList')"
                />
                <el-button size="small" style="margin-left: 4px" type="primary" @click="handleQuery('TableItemList')" icon="el-icon-search"></el-button>
                <el-button v-if="!isExpand" size="small" class="query-item-reset"  type="primary" plain @click="handleClearQuery('TableItemList')">重置</el-button>
              </div>
            </my-query-item>
          </el-col>

        </el-row>
      </template>
      <template slot="expand">
        <el-row style="margin-top: 16px;">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="内标签">
              <select-inner-tag size="small" v-model="query.inner_tag_id" @change="handleQuery('TableItemList')" style="width: 225px;"/>
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="科学分类">
              <select-system-class size="small" v-model="query.system_class_codes" @change="selectSystemClass" style="width: 225px;"/>
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="活动类型">
              <button-group
                :options="{'全部': '', '预售': 1, '非预售': 0}"
                v-model="query.is_presale"
                @change="handleQuery('TableItemList')"
                size="small"
              />
            </my-query-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 16px">
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="是否赠品">
              <button-group
                :options="{'全部': '', '赠品': 1, '非赠品': 0}"
                v-model="query.is_gift"
                @change="handleQuery('TableItemList')"
                size="small"
              />
              <el-button size="small" type="primary" class="query-item-reset" plain @click="handleClearQuery('TableItemList')">重置</el-button>
            </my-query-item>
          </el-col>
        </el-row>
      </template>
    </my-collapse-query>
  </div>
</template>

<script>
  import { Collapse, CollapseItem } from 'element-ui';
  import { ButtonGroup, SelectDisplayClass, SelectInnerTag, SelectSystemClass } from '@/common';
  import queryMixin from './query.mixin2';

  export default {
    name: "QueryItem",
    components: {
      'el-collapse': Collapse,
      'el-collapse-item': CollapseItem,
      'select-display-class': SelectDisplayClass,
      'button-group': ButtonGroup,
      'select-inner-tag': SelectInnerTag,
      'select-system-class': SelectSystemClass
    },
    mixins: [queryMixin],
    created() {
      this.$data.initQuery.province_code = this.province.code;
      this.$data.query.province_code = this.province.code;
    },
    data() {
      let initQuery = {
        is_on_sale: 1,
        display_class_code: '',
        condition: '',
        inner_tag_id: '',
        is_presale: '',
        is_gift: '',
        system_class_code: '',
        system_class_codes: []
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
        console.log(query);
        this.handleQuery('TableItemList');
      },
    }
  }
</script>

<style scoped>

</style>

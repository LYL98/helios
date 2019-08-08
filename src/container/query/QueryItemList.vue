<template>
  <div class="query">
    <my-collapse-query @expandChange="onExpandChange">
      <template slot="header">
        <el-row>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="上架状态">
              <my-button-group
                :options="{'已上架': 1, '未上架': 0}"
                v-model="query.is_on_sale"
                @change="handleQuery('TableItemList')"
                size="small"
              />
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="展示分类">
              <my-select-display-class
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
              
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="科学分类">
              
            </my-query-item>
          </el-col>
          <el-col :xl="6" :lg="7" :span="7">
            <my-query-item label="活动类型">
              <my-button-group
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
              <my-button-group
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
  import { ButtonGroup, SelectBuyer, SelectDisplayClass } from '@/common';
  import queryMixin from './query.mixin2';

  export default {
    name: "QueryItem",
    components: {
      'el-collapse': Collapse,
      'el-collapse-item': CollapseItem,
      'my-select-buyer': SelectBuyer,
      'my-select-display-class': SelectDisplayClass,
      'my-button-group': ButtonGroup,
    },
    mixins: [queryMixin],
    created() {
      this.$data.initQuery.province_code = this.province.code;
      this.$data.query.province_code = this.province.code;
    },
    data() {
      let initQuery = {
        is_on_sale: 1
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>

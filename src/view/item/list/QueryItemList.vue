<template>
  <div class="container-query">
    <!--已上架-->
    <template v-if="query.is_on_sale === 1">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="科学分类">
            <select-system-class size="small" v-model="query.system_class_codes" @change="selectSystemClass"/>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="展示分类">
            <select-display-class
              size="small"
              v-model="query.display_class_id"
              v-on:change="handleQuery('TableItemList')"
            />
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              placeholder="商品编号/名称"
              v-model="query.condition"
              @search="handleQuery('TableItemList')"
              @reset="handleClearQuery('TableItemList')"
            />
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">
        <el-col :span="7">
          <my-query-item label="价格标签">
            <select-inner-tag clearable size="small" v-model="query.inner_tag_id" @change="handleQuery('TableItemList')"/>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="活动">
            <select-option
              :options="{'全部': '', '预售': 1, '非预售': 0}"
              v-model="query.is_presale"
              @change="handleQuery('TableItemList')"
              size="small"
            />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="是否赠品">
            <select-option
              :options="{'全部': '', '赠品': 1, '非赠品': 0}"
              v-model="query.is_gift"
              @change="handleQuery('TableItemList')"
              size="small"
            />
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">
        <el-col :span="7">
          <my-query-item label="采购员">
            <select-buyer size="small" :provinceCode="provinceCode" v-model="query.buyer_id" @change="handleQuery('TableItemList')" />
          </my-query-item>
        </el-col>
      </el-row>
    </template>

    <!--未上架-->
    <el-row :gutter="32" v-else>
      <el-col :span="7">
        <my-query-item label="科学分类">
          <select-system-class size="small" v-model="query.system_class_codes" @change="selectSystemClass"/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input
            size="small"
            placeholder="外标签/商品编号/名称"
            v-model="query.condition"
            @search="handleQuery('TableItemList')"
            @reset="handleClearQuery('TableItemList')"
          />
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Collapse, CollapseItem } from 'element-ui';
  import { SelectOption, SelectDisplayClass, SelectInnerTag, SelectSystemClass } from '@/common';
  import { SelectBuyer } from '@/component';
  import queryMixin from '@/share/mixin/query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QueryItem",
    components: {
      'el-collapse': Collapse,
      'el-collapse-item': CollapseItem,
      'select-display-class': SelectDisplayClass,
      'select-option': SelectOption,
      'select-inner-tag': SelectInnerTag,
      'select-system-class': SelectSystemClass,
      'select-buyer': SelectBuyer,
    },
    mixins: [queryMixin],
    props: {
      fromPage: { type: String, default: 'List' }, //List 在售商品， ListForSale 待售商品
      provinceCode: { type: String, default: '' }, //省code
    },
    data() {
      let initQuery = {
        is_on_sale: 1, //在售1、待售0
        display_class_id: '',
        condition: '',
        inner_tag_id: '',
        is_presale: '',
        is_gift: '',
        buyer_id: '',
        system_class_code: '',
        system_class_codes: []
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
      }
    },
    created() {
      let { initQuery, query, fromPage } = this;
      let isOnSale = fromPage === 'List' ? 1 : 0;
      initQuery.is_on_sale = isOnSale;
      query.is_on_sale = isOnSale;
      this.$data.initQuery = initQuery;
      this.$data.query = query;
    },
    methods: {
      //选择科学分类
      selectSystemClass(value){
        if(value.length === 0){
          this.$data.query.system_class_code = '';
        }else{
          this.$data.query.system_class_code = value[value.length - 1];
        }
        this.handleQuery('TableItemList');
      },
    }
  }
</script>

<style scoped>

</style>

<template>
  <div class="container-query">
    <!--已上架-->
    <template v-if="query.is_on_sale === 1">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="上架状态">
            <select-option
              :options="{'已上架': 1, '未上架': 0}"
              v-model="query.is_on_sale"
              @change="changeOnSale"
              size="small"
            />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="展示分类">
            <select-display-class
              size="small"
              v-model="query.display_class_code"
              v-on:change="handleQuery('TableItemList')"
            />
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input v-model="query.condition" placeholder="商品编号/名称" size="small" @search="handleQuery('TableItemList')" @reset="handleClearQuery('TableItemList')"/>
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">
        <el-col :span="7">
          <my-query-item label="内标签">
            <select-inner-tag clearable size="small" v-model="query.inner_tag_id" @change="handleQuery('TableItemList')"/>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="科学分类">
            <select-system-class size="small" v-model="query.system_class_codes" @change="selectSystemClass"/>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="活动类型">
            <select-option
              :options="{'全部': '', '预售': 1, '非预售': 0}"
              v-model="query.is_presale"
              @change="handleQuery('TableItemList')"
              size="small"
            />
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px">
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
        <el-col :span="7">
          <my-query-item label="供应商类型">
            <select-option
              :options="{'全部': '', ...supplierType}"
              v-model="query.sup_type"
              @change="handleQuery('TableItemList')"
              size="small"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </template>

    <!--未上架-->
    <el-row :gutter="32" v-else>
      <el-col :span="7">
        <my-query-item label="上架状态">
          <select-option
            :options="{'已上架': 1, '未上架': 0}"
            v-model="query.is_on_sale"
            @change="changeOnSale"
            size="small"
          />
        </my-query-item>
      </el-col>
      <el-col :span="7">
        <my-query-item label="科学分类">
          <select-system-class size="small" v-model="query.system_class_codes" @change="selectSystemClass"/>
        </my-query-item>
      </el-col>
      <el-col :span="10">
        <my-query-item label="搜索">
          <query-search-input v-model="query.condition" placeholder="外标签/商品编号/名称" size="small" @search="handleQuery('TableItemList')" @reset="handleClearQuery('TableItemList')"/>
        </my-query-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Collapse, CollapseItem } from 'element-ui';
  import { SelectOption, SelectDisplayClass, SelectInnerTag, SelectSystemClass } from '@/common';
  import queryMixin from './query.mixin';
  import { Constant } from '@/util';

  export default {
    name: "QueryItem",
    components: {
      'el-collapse': Collapse,
      'el-collapse-item': CollapseItem,
      'select-display-class': SelectDisplayClass,
      'select-option': SelectOption,
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
        sup_type: '',
        inner_tag_id: '',
        is_presale: '',
        is_gift: '',
        system_class_code: '',
        system_class_codes: []
      }
      return {
        initQuery: initQuery,
        query: Object.assign({}, initQuery), //只有一层，可以用Object.assign深拷贝
        supplierType: Constant.SUPPLIER_TYPE('value_key'),
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
        this.handleQuery('TableItemList');
      },
      //改变上下架
      changeOnSale(){
        let { isExpand, query } = this;
        if(query.is_on_sale === 0 && isExpand){
          this.onExpandChange(false, 'TableItemList');
        }
        this.handleQuery('TableItemList');
      }
    }
  }
</script>

<style scoped>

</style>

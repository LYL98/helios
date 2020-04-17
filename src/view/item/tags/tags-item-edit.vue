<template>
  <div class="px-30">
    <el-row :gutter="32" v-if="type === 'add'">
      <el-col :sm="6" :span="10">
        <my-select-system-class
          clearable
          :value="query.system_class_codes"
          size="small"
          @change="changeSystemClassCodes"
        />
      </el-col>
      <el-col :sm="6" :span="10">
        <my-select-display-class
          clearable
          v-model="query.display_class_id"
          size="small"
          @change="changeQuery"
        />
      </el-col>
      <el-col :sm="10" :span="10">
        <my-query-search-input
          v-model="query.condition"
          size="small"
          placeholder="商品名称/编号"
          @search="changeQuery"
          @reset="resetQuery"
        />
      </el-col>
    </el-row>

    <div class="d-flex algn-center mt-20">
      <el-table
        v-if="type === 'add'"
        class="table-border"
        :data="filterItems"
        style="max-width: 320px;"
        :height="windowHeight - 200"
        stripe
        empty-text="请筛选定价商品"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="45">
        </el-table-column>
        <el-table-column prop="title" label="商品名称" align="center"></el-table-column>
        <el-table-column label="定价" prop="price_sale" min-width="100" align="center">
          <template slot-scope="scope">
            {{ !!scope.row.price_sale ? '￥' + DataHandle.returnPrice(scope.row.price_sale) : '未报价' }}
             <!-- <input-weight size="medium"  unit="元" :placeholder="`${scope.row.price_sale}`" :disabled="true"/> -->
          </template>
        </el-table-column>

      </el-table>

      <div class="into-out" v-if="type === 'add'">
        <i class="el-icon-d-arrow-right" @click="intoEditList"></i>
        <i class="el-icon-d-arrow-left mt-20" @click="removeEditList"></i>
      </div>

      <el-table
        :data="editList"
        :height="windowHeight - 200"
        empty-text=" "
        stripe
        class="custom-el-table-append table-border"
        @selection-change="handleRemoveChange"
      >
        <el-table-column
          v-if="type === 'add'"
          type="selection"
          align="center"
          width="45">
        </el-table-column>
        <el-table-column width="50" v-if="type === 'add'">
          <template slot-scope="scope">
            <span
              class="font-size-12 color-primary cursor-pointer"
              @click="handleRemoveItem(scope.row.item_id)"
            >移除</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="title" min-width="240" align="center">
          <template slot-scope="scope">
            <!--  {{ scope.row.code }} /  -->
           {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="rank" min-width="80" align="center">
          <template slot-scope="scope">
            <!-- {{ !!scope.row.price_sale ? '￥' + DataHandle.returnPrice(scope.row.price_sale) : '未报价' }} -->
            <el-input size="small"  v-model="scope.row.rank"   @input="changeRank(scope.row)"/>
          </template>
        </el-table-column>
       
      </el-table>
    </div>

    <div class="mt-20 d-flex justify-end pr-40">
      <el-button @click="handleCancel">取消</el-button>
      <el-button class="ml-20" type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
  import { Row, Col, Form, FormItem, RadioGroup, Radio, Input, Button, Table, Message, TableColumn } from 'element-ui';
  import { QueryItem, QuerySearchInput, SelectSystemClass, SelectDisplayClass } from '@/common';
  import { Http, Config, DataHandle } from '@/util';
import { InputWeight ,InputNumber} from '@/common';

  export default {
    name: 'tags-item-edit',
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-radio-group': RadioGroup,
      'el-radio': Radio,
      'el-input': Input,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'my-query-item': QueryItem,
      'my-query-search-input': QuerySearchInput,
      'my-select-system-class': SelectSystemClass,
      'my-select-display-class': SelectDisplayClass,
      'input-weight': InputWeight,
      'input-number': InputNumber,

    },
    props: {
      tag: { type: Object, default: { id: '', title: '' } },
      type: { type: String, default: 'add' },
      items: { type: Array, default: [] },
      windowHeight: { type: Number | String, default: 300 }
    },
    data() {
      return {
        query: {
          system_class_codes: []
        },
        itemList: [],
        selectedList: [],
        editList: [],
        removeList: [],
        // allDiscount: '',
      };
    },

    computed: {
      filterItems() {
        return this.$data.itemList.filter(item => !this.editList.some(d => d.item_id === item.id));
      },
    },

    created() {
      this.DataHandle = DataHandle;
      console.log(this.$props.tag);
      
      
      
      if (this.$props.type === 'add') {
        this.initQuery();
        console.log(this.query);
        this.commonItemList();
      } else {

        this.$data.editList = [...this.$props.items].map(d => {
          return {
            id: d.id,
            item_id: d.item.id,
            code: d.item.code,
            title: d.item.title,
            item_tag_id: this.$props.tag.id,
            // city_title: this.$props.city.title,
            price_sale: d.item.price_sale,
            discount: DataHandle.returnDiscount(d.discount),
            rank_error: false,
          }
        });
      }
    },

    methods: {

//初始化请求参数
      initQuery() {
        this.$data.query = {
          province_code: this.$province.code,
          item_tag_id: this.$props.tag.id,
          is_all: 1,
          is_gift: 0,
          // city_or_level: 1,
          display_class_id: '',
          system_class_codes: [],
          condition: '',
          out_item_tag_id: this.$props.tag.id,
          is_deleted: 0,
          system_class_code:''
        };
      },

      changeSystemClassCodes(v, d) {
        this.$data.query.system_class_codes = v;
        this.commonItemList();
      },

      changeQuery(v, d) {
        this.commonItemList();
      },

      resetQuery() {
        this.initQuery();
        this.commonItemList();
      },

//获取新增商品列表
      async commonItemList() {
        let query = {...this.$data.query};
        if (query.system_class_codes.length > 0) {
          query.system_class_code = query.system_class_codes[query.system_class_codes.length - 1];
        }
        delete query.system_class_codes;
        let res = await Http.get(Config.api.baseItemList, query);
        if (res.code !== 0) return;
        this.$data.itemList = res.data;
      },

      handleSelectionChange(val) {
        this.$data.selectedList = val;
      },

//加入将要添加的列表
      intoEditList() {
        if (this.$data.selectedList.length <= 0 ) return;

        let list = [...this.$data.selectedList].map(item => {
          return {
            item_id: item.id,
            code: item.code,
            title: item.title,
            item_tag_id: this.$props.tag.id,
          
            price_sale: item.price_sale,
            // discount: this.$data.allDiscount,
            rank_error: false,
            rank: item.rank
          }
        });
        this.$data.editList = [...this.$data.editList, ...list];
        this.$data.selectedList = [];
      },

      handleRemoveChange(val) {
        this.$data.removeList = val;
      },

      removeEditList() {
        if (this.$data.removeList.length <= 0) return;
        this.$data.editList = this.$data.editList.filter(d => !this.$data.removeList.some(item => item.item_id === d.item_id));
        this.$data.removeList = [];
      },

      handleRemoveItem(item_id) {
        this.$data.editList = this.$data.editList.filter(d => d.item_id !== item_id);
      },

      changeRank(item) {
        item.rank_error = this.validRank(item.rank);
      },

      // changeAllDiscount(v) {
      //   this.$data.editList = this.$data.editList.map(item => {
      //     item.discount = v
      //     item.discount_error = this.validDiscount(v);
      //     return item;
      //   });
      // },
      validRank(rank) {
        // if (!rank) return true;
        if (isNaN(rank)) return true;
        if (rank < 0) return true;
        // if (rank >= 1000) return true;
        if (!/^-?\d+$/.test(rank)) return true;
        return false;
      },

//新增商品
      async handleSubmit() {
        if (this.$data.editList.length <= 0) {
          Message.warning({ message: '请先选择商品！', offset: 100 });
          return;
        };

        this.$data.editList = this.$data.editList.map(item => {
          item.rank_error = this.validRank(item.rank);
          return item;
        });

        if (this.$data.editList.some(item => item.rank_error)) {
          Message.error({ message: '请检查输入格式！', offset: 100 });
          return ;
        }

        let item_tag_records = this.$props.type === 'add'
            ? this.$data.editList.map(item => ({
                item_tag_id: item.item_tag_id,
                item_id: item.item_id,
                rank: item.rank
              }))
            : this.$data.editList.map(item => ({
                id: item.id,
                discount: DataHandle.handleDiscount(item.discount)
              }));

        let API = this.$props.type === 'add' ? Config.api.itemTagAdd : Config.api.businessMarketingStrategyCityModify;

        let res = await Http.post(API, { item_tag_records });
        if (res.code === 0) {
          this.$message({message: `${this.$props.type === 'add' ? '新增' : '编辑'}成功`, type: 'success'});
          this.$emit('submit');
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      handleCancel() {
        this.$emit('cancel');
      },
    }
  };
</script>

<style lang="scss" scoped>
  .d-flex {
    display: flex;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .algn-center {
    align-items: center;
  }

  .mt-20 {
    margin-top: 20px;
  }
  .ml-20 {
    margin-left: 20px;
  }

  .px-30 {
    padding-left: 30px;
    padding-right: 30px;
  }

  .pr-40 {
    padding-right: 40px;
  }

  .font-size-12 {
    font-size: 12px;
  }

  .color-primary {
    color: #00ADE7;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  .into-out {
    margin: 0 20px;

    .el-icon-d-arrow-right,
    .el-icon-d-arrow-left {
      display: block;
    }

    .el-icon-d-arrow-right:hover,
    .el-icon-d-arrow-left:hover {
      font-weight: 600;
      cursor: pointer;
    }
  }

  .table-border {
    border: 1px solid #EBEEF5;
  }

</style>

<style lang="scss">
  .custom-el-table-append {
    .el-input-group__append {
      padding: 0 10px;
    }
  }

  .custom-input-error,
  .custom-input-error.is-disabled {

    & > .el-input__inner,
    & > .el-input__inner[disabled] {
      border-color: #f56c6c;
    }

    & > .el-input-group__append {
      border-color: #f56c6c;
    }
  }
</style>

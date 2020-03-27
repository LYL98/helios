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
        height="500"
        stripe
        empty-text="请筛选定价商品"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="45">
        </el-table-column>
        <el-table-column prop="title" label="商品名称"></el-table-column>
      </el-table>

      <div class="into-out" v-if="type === 'add'">
        <i class="el-icon-d-arrow-right" @click="intoEditList"></i>
        <i class="el-icon-d-arrow-left mt-20" @click="removeEditList"></i>
      </div>

      <el-table
        :data="editList"
        height="500"
        stripe
        class="custom-el-table-append table-border"
        ref="editTable"
        @selection-change="handleRemoveChange"
      >
        <el-table-column
          v-if="type === 'add'"
          type="selection"
          align="center"
          width="45"
          fixed
        >
        </el-table-column>
        <el-table-column width="50" v-if="type === 'add'" fixed>
          <template slot-scope="scope">
            <span
              class="font-size-12 color-primary cursor-pointer"
              @click="handleRemoveItem(scope.row)"
            >移除</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="title" min-width="240" fixed>
          <template slot-scope="scope">
            {{ scope.row.code }} / {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="今日报价" prop="price_sale" width="90">
          <template slot-scope="scope">
            {{ !!scope.row.price_sale ? '￥' + DataHandle.returnPrice(scope.row.price_sale) : '未报价' }}
          </template>
        </el-table-column>

        <el-table-column label="阶梯一" width="120">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.step_prices[0].num"
              :class="scope.row.step_prices[0].num_error ? 'custom-input-error' : ''"
              @input="changeNum(scope.row.step_prices[0], 0)"
            >
              <template slot="append">件</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="折扣率" width="120">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.step_prices[0].discount"
              :class="scope.row.step_prices[0].discount_error ? 'custom-input-error' : ''"
              @input="changeDiscount(scope.row.step_prices[0], 0)"
            >
              <template slot="append">%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="优惠价格" min-width="100">
          <template slot-scope="scope">
            {{ !!scope.row.step_prices[0].discount && !!scope.row.price_sale
            ? '￥' + DataHandle.returnPrice(scope.row.price_sale * scope.row.step_prices[0].discount / 100)
            : ''
            }}
          </template>
        </el-table-column>

        <el-table-column label="阶梯二" width="120">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.step_prices[1].num"
              :class="scope.row.step_prices[1].num_error ? 'custom-input-error' : ''"
              @input="changeNum(scope.row.step_prices[1], 1)"
            >
              <template slot="append">件</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="折扣率" width="120">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.step_prices[1].discount"
              :class="scope.row.step_prices[1].discount_error ? 'custom-input-error' : ''"
              @input="changeDiscount(scope.row.step_prices[1], 1)"
            >
              <template slot="append">%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="优惠价格" min-width="100">
          <template slot-scope="scope">
            {{ !!scope.row.step_prices[1].discount && !!scope.row.price_sale
            ? '￥' + DataHandle.returnPrice(scope.row.price_sale * scope.row.step_prices[1].discount / 100)
            : ''
            }}
          </template>
        </el-table-column>

        <el-table-column label="阶梯三" width="120">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.step_prices[2].num"
              :class="scope.row.step_prices[2].num_error ? 'custom-input-error' : ''"
              @input="changeNum(scope.row.step_prices[2], 2)"
            >
              <template slot="append">件</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="折扣率" width="120">
          <template slot-scope="scope">
            <el-input
              size="mini"
              v-model="scope.row.step_prices[2].discount"
              :class="scope.row.step_prices[2].discount_error ? 'custom-input-error' : ''"
              @input="changeDiscount(scope.row.step_prices[2], 2)"
            >
              <template slot="append">%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="优惠价格" min-width="100">
          <template slot-scope="scope">
            {{ !!scope.row.step_prices[2].discount && !!scope.row.price_sale
            ? '￥' + DataHandle.returnPrice(scope.row.price_sale * scope.row.step_prices[2].discount / 100)
            : ''
            }}
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
  export default {
    name: 'step-price-add',
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
    },
    props: {
      type: { type: String, default: 'add' },
      items: { type: Array, default: [] },
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
      };
    },

    computed: {
      filterItems() {
        return this.$data.itemList.filter(item => !this.editList.some(d => d.item_id === item.id));
      },
    },

    created() {
      this.DataHandle = DataHandle;

      if (this.$props.type === 'add') {
        this.initQuery();
        this.commonItemList();
      } else {

        this.$data.editList = [...this.$props.items].map(d => {
          return {
            id: d.id,
            item_id: d.item.id,
            code: d.item.code,
            title: d.item.title,
            price_sale: d.item.price_sale,
            discount: DataHandle.returnDiscount(d.discount),
            discount_error: false,
          }
        });
      }
    },

    methods: {

      initQuery() {
        this.$data.query = {
          province_code: this.$province.code,
          is_all: 0,
          is_gift: 0,
          city_or_level: 1,
          display_class_id: '',
          system_class_codes: [],
          condition: '',
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

      intoEditList() {
        let list = [...this.$data.selectedList].map(item => {
          return {
            item_id: item.id,
            code: item.code,
            title: item.title,
            price_sale: item.price_sale,

            step_prices: [
              { num: '', num_error: false, discount: '', discount_error: false },
              { num: '', num_error: false, discount: '', discount_error: false },
              { num: '', num_error: false, discount: '', discount_error: false },
            ],
          }
        });
        this.$data.editList = [...this.$data.editList, ...list];
      },

      handleRemoveItem(item) {
        this.$data.editList = this.$data.editList.filter(d => d.item_id !== item.item_id);
      },

      handleRemoveChange(val) {
        this.$data.removeList = val;
      },

      removeEditList() {
        if (this.$data.removeList.length <= 0) return;
        this.$data.editList = this.$data.editList.filter(d => !this.$data.removeList.some(item => item.item_id === d.item_id));
        this.$data.removeList = [];
      },

      changeNum(step, index) {
        step.num_error = this.validNum(step.num);
      },

      changeDiscount(step, index) {
        step.discount_error = this.validDiscount(step.discount);
      },

      validNum(num) {
        if (!num) return true;
        if (isNaN(num)) return true;
        if (num <= 0) return true;
        if (num >= 10000) return true;
        if (!/^[1-9]\d*$/.test(num)) return true;
        return false;
      },

      validDiscount(discount) {
        if (!discount) return true;
        if (isNaN(discount)) return true;
        if (discount <= 0) return true;
        if (discount >= 10000) return true;
        if (!/^-?\d+\.?\d{0,1}$/.test(discount)) return true;
        return false;
      },

      async handleSubmit() {
        if (this.$data.editList.length <= 0) {
          Message.warning({ message: '请先选择商品！', offset: 100 });
          return;
        }

        this.$data.editList = this.$data.editList.map(item => {
          item.step_prices = item.step_prices.map(d => {
            return { num: d.num, num_error: this.validNum(d.num), discount: d.discount, discount_error: this.validDiscount(d.discount) };
          });
          return item;
        });

        if (this.$data.editList.some(item => item.step_prices.some(d => d.num_error || d.discount_error))) {
          Message.error({ message: '请检查输入格式！', offset: 100 });
          return;
        }

        let entries = this.$props.type === 'add'
            ? this.$data.editList.map(item => ({
              item_id: item.item_id,
              step_prices: item.step_prices.map(d => ({ num: Number(d.num), discount: DataHandle.handleDiscount(d.discount) })),
            }))
            : this.$data.editList.map(item => ({
              id: item.id,
              discount: DataHandle.handleDiscount(item.discount)
            }));

        let API = this.$props.type === 'add' ? Config.api.businessMarketingStrategyStepAdd : Config.api.businessMarketingStrategyStepModify;

        let res = await Http.post(API, { entries });
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

<template>
  <div>
    <el-row :gutter="32">
      <el-col :sm="8" :span="10">
        <my-select-system-class
          :value="query.system_class_codes"
          size="small"
          @change="changeSystemClassCodes"
        />
      </el-col>
      <el-col :sm="8" :span="10">
        <my-select-display-class
          v-model="query.display_class_id"
          size="small"
          @change="changeQuery"
        />
      </el-col>
      <el-col :sm="8" :span="10">
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
        :data="itemList"
        style="max-width: 330px;"
        height="500"
        stripe
        border
        empty-text="请筛选定价商品"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column prop="title" label="商品名称"></el-table-column>
      </el-table>

      <div class="into-out">
        <i class="el-icon-d-arrow-right" @click="intoEditList"></i>
      </div>

      <el-form>
        <el-table :data="editList" height="500" border stripe class="custom-el-table-append">
          <el-table-column width="50">移除</el-table-column>
          <el-table-column label="商品名称" prop="title" width="240">
            <template slot-scope="scope">
              {{ scope.row.code }} / {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column label="县域选择" width="120">
            <template slot="header">
              <my-select-city
                size="mini"
                :value="selectedCity.id"
                placeholder="县域选择"
                :provinceCode="$province.code"
                @select-item="changeCity"
              ></my-select-city>
            </template>
            <template slot-scope="scope">
              <el-input size="mini" disabled :value="scope.row.city_title" :class="scope.row.city_error ? 'custom-input-error' : ''"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="今日报价" prop="price_sale" width="100">
            <template slot-scope="scope">
              {{ DataHandle.returnPrice(scope.row.price_sale) }}
            </template>
          </el-table-column>
          <el-table-column label="浮动率" width="120">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-model="scope.row.discount"
                :class="scope.row.discount_error ? 'custom-input-error' : ''"
                @input="changeDiscount(scope.row.id)"
              >
                <template slot="append">%</template>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="浮动价格" width="100">
            <template slot-scope="scope">
              {{ !!scope.row.discount && !!scope.row.price_sale
                ? DataHandle.returnPrice(DataHandle.returnDiscount(scope.row.price_sale * scope.row.discount / 100))
                : ''
              }}
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>

    <div class="mt-20 d-flex justify-end pr-40">
      <el-button plain>取消</el-button>
      <el-button class="ml-20" type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
  import { Row, Col, Form, FormItem, RadioGroup, Radio, Input, Button, Table, TableColumn } from 'element-ui';
  import { QueryItem, QuerySearchInput, SelectSystemClass, SelectDisplayClass, SelectCity } from '@/common';
  import { Http, Config, Verification, DataHandle } from '@/util';
  export default {
    name: 'city-price-add',
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
      'my-select-city': SelectCity,
    },
    computed: {
      selectedCity() {
        if (!this.$data.editList || this.$data.editList.length === 0) return { id: '', title: '' };
        let item = this.$data.editList[0];
        return { id: item.city_id, title: item.city_title };
      },
    },
    data() {
      return {
        Verification: Verification,
        query: {
          system_class_codes: []
        },
        itemList: [],
        selectedList: [],
        editList: [],
        rules: [],
      };
    },

    created() {
      this.DataHandle = DataHandle;
      this.initQuery();
      this.commonItemList();
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
        this.$data.editList = [...this.$data.selectedList].map(item => {
          return {
            id: item.id,
            code: item.code,
            title: item.title,
            city_id: '',
            city_title: '',
            price_sale: item.price_sale,
            discount: '',
            discount_error: false,
            city_error: false,
          }
        });
        console.log('this.$data.editList: ', this.$data.editList);
      },

      changeCity(city) {
        this.$data.editList = this.$data.editList.map(item => {
          item.city_id = city.id;
          item.city_title = city.title;
          item.city_error = !city.id;
          return item;
        });
      },

      changeDiscount(id) {
        let item = this.$data.editList.find(item => item.id === id);
        if (!item) return;
        item.discount_error = this.validDiscount(item.discount);
        this.$data.editList = JSON.parse(JSON.stringify(this.$data.editList));
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
        this.$data.editList = this.$data.editList.map(item => {
          item.city_error = !item.city_id;
          item.discount_error = this.validDiscount(item.discount);
          return item;
        });
        this.$data.editList = JSON.parse(JSON.stringify(this.$data.editList));

        if (this.$data.editList.some(item => item.city_error || item.discount_error)) return;

        let entries = this.$data.editList.map(item => {
          return {
            city_id: item.city_id,
            item_id: item.id,
            discount: DataHandle.handleDiscount(item.discount),
          }
        });

        let res = await Http.post(Config.api.bussinessMarketingStrategyCityAdd, { entries });
        if (res.code === 0) {
          this.$message({message: '新增成功', type: 'success'});
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

  .pr-40 {
    padding-right: 40px;
  }

  .into-out {
    margin: 0 30px;

    .el-icon-d-arrow-right:hover {
      font-weight: 600;
      cursor: pointer;
    }
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

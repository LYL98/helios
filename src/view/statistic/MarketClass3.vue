<template>
  <sub-menu>
    <div class="breadcrumb" style="margin-bottom: 16px;">
      <el-breadcrumb separator="/" class="custom-breadcrumb">
        <el-breadcrumb-item :to="{ name: 'StatisticMarket', query: { province_code: query.province_code, begin_date: query.begin_date, end_date: query.end_date,totalItemTotalPrice:query.totalItemTotalPrice,item_tag_id: query.item_tag_id} }">
          商品销售统计
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'StatisticMarketClass2', query: { province_code: query.province_code, begin_date: query.begin_date, end_date: query.end_date, system_class1: query.system_class1, system_class_code1: query.system_class_code1,totalItemTotalPrice:query.totalItemTotalPrice,item_tag_id: query.item_tag_id} }">
          {{ query.system_class1 === '' ? '全部分类' : query.system_class1 }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ query.system_class === '' ? '全部分类' : query.system_class }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="query" style="margin-bottom: 20px;">
      <el-row>
        <el-col :span="6">
          <my-query-item label="时间">
            <el-date-picker
              size="small"
              v-model="pickerValue"
              type="daterange"
              align="right"
              value-format="yyyy-MM-dd"
              unlink-panels
              :picker-options="fixDateOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changePicker"
              class="query-item-date"
              :clearable="false"
            />
          </my-query-item>
        </el-col>
        <el-col :span="4">
          <my-query-item label="二级分类">
            <select-system-class-list
              v-model="query.system_class_code"
              @change="changeSystemClass"
              size="small"
              :clearable="false"
              :topCode="query.system_class_code1"
            />
          </my-query-item>
        </el-col>
        <el-col :span="4">
          <my-query-item label="运营专区">
            <el-select  v-model="query.item_tag_id"  @change="selectTagChange" placeholder="请选择" size="small" clearable>
              <el-option
                v-for="item in tagsOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </my-query-item>
        </el-col>
        <el-col :span="4">
          <el-button size="small" class="query-item-reset" type="primary" plain @click="resetQuery">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
        class="list-table"
        :data="dataItem"
        :row-class-name="highlightRowClassName"
        :height="viewWindowHeight - offsetHeight"
        :highlight-current-row="true"
        @sort-change="onSort"
      >
       <el-table-column
          type="index"
          :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
          label="序号"
          :index="indexMethod"
        />
        <el-table-column label="三级科学分类" prop="item_system_class">
          <template slot-scope="scope">
            <a href="javascript:void(0)"
              class="title"
              @click="handleShowClassDetail(scope.row)"
              v-if="!!scope.row.item_system_class && ( auth.isAdmin || auth.StatisticMarketClassItem )"
            >
              {{ scope.row.item_system_class || '其它' }}
            </a>
            <div v-else>
              {{ scope.row.item_system_class || '其它' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单商品金额" sortable="custom" prop="amount_real">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.amount_real) }}
          </template>
        </el-table-column>
        <el-table-column label="件数" sortable="custom" prop="count_real" />
        <el-table-column label="占比">
          <template slot-scope="scope">
            <!-- {{ returnPercentage(scope.row.amount_real, totalItemTotalPrice) }}% -->
            {{ scope.row.ratio }}%
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                {
                  title: '查看',
                  isDisplay: !!scope.row.item_system_class && ( auth.isAdmin || auth.StatisticMarketClassItem ),
                  command: () => handleShowClassDetail(scope.row)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </sub-menu>
</template>

<script>
  import { Row, Col, DatePicker, Table, TableColumn, Pagination, Breadcrumb, BreadcrumbItem, Button,Select,Option } from 'element-ui';
  import { QueryItem, TableOperate, SelectSystemClassList } from '@/common';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "MarketClass",
    mixins: [mainMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-breadcrumb': Breadcrumb,
      'el-breadcrumb-item': BreadcrumbItem,
      'el-date-picker': DatePicker,
      'el-table': Table,
      'el-button': Button,
      "el-select": Select,
      "el-option":Option,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'select-system-class-list': SelectSystemClassList
    },
    data() {
      return {
        fixDateOptions: Constant.FIX_DATE_RANGE,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_BREADCRUMB + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        totalItemTotalPrice: 0,
        pickerValue: [],
        breadcrumb: {},
        query: {},
        dataItem: [],
        tagsOptions:[],//运营专区数据

      }
    },
    created() {
      documentTitle("统计 - 商品销售统计");
      this.initQuery();
      this.getTagsOptions()
      this.statisticalOrderClassSum();
    },
    methods: {
      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },
      indexMethod(index) {
        return (this.$data.query.page - 1) * this.$data.query.page_size + index + 1;
      },
      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },
      //返回百分比
      returnPercentage(item_num, sun){
        return DataHandle.returnPercentage(item_num, sun);
      },
      //初始化参数
      initQuery() {
        let q = this.$route.query;
        this.$data.pickerValue = [q.begin_date, q.end_date];
        this.$data.query = {
          province_code: q.province_code,
          begin_date: q.begin_date,
          end_date: q.end_date,
          sort: '-amount_real',
          system_class1: q.system_class1,
          system_class_code1: q.system_class_code1,
          system_class: q.system_class2,
          system_class_code: q.system_class_code2,
          page: 1,
          page_size: Constant.PAGE_SIZE,
          item_tag_id:q.item_tag_id,
          totalItemTotalPrice:q.totalItemTotalPrice
        };
        this.$data.totalItemTotalPrice = q.totalItemTotalPrice
      },
      // 改变查询日期
      changePicker(value) {
        if(value && value.length === 2){
          this.$data.query.begin_date = value[0];
          this.$data.query.end_date = value[1];
        }else{
          this.$data.query.begin_date = '';
          this.$data.query.end_date = '';
        }
        this.$data.query.page = 1;
        this.statisticalOrderClassSum();
      },
      changePage(page) {
        this.$data.query.page = page;
        this.statisticalOrderClassSum();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.statisticalOrderClassSum();
      },
      onSort({ column, prop, order }) {
        if (order === 'ascending') {
          this.query.sort = prop;
        } else if (order === 'descending') {
          this.query.sort = '-' + prop
        } else {
          this.query.sort = ''
        }
        // this.$data.query.page = 1;
        this.statisticalOrderClassSum();
      },
      resetQuery() {
        this.initQuery();
        this.statisticalOrderClassSum();
      },
      //改变分类
      changeSystemClass(data){
        this.$data.query.system_class = data.title;
        this.statisticalOrderClassSum();
      },
      // 获取列表
      async statisticalOrderClassSum() {
        let { query } = this;
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalOrderClassSum, query);
        if(res.code === 0){
          let rd = res.data, totalItemTotalPrice = 0;
          // for (let i = 0; i < rd.length; i++) {
          //   //总数据
          //   totalItemTotalPrice += rd[i].amount_real;
          // }
          // this.$data.totalItemTotalPrice = totalItemTotalPrice;
          this.$data.dataItem = rd;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$loading({ isShow: false });
      },
      handleShowClassDetail(item) {
        this.$router.push({
          name: 'StatisticMarketClassItem',
          query: {
            item_id: item.id,
            system_class1: this.query.system_class1,
            system_class_code1: this.query.system_class_code1,
            system_class2: this.query.system_class,
            system_class_code2: this.query.system_class_code,
            system_class3: item.item_system_class,
            system_class_code3: item.system_class_code,
            begin_date: this.query.begin_date,
            end_date: this.query.end_date,
            province_code: this.$route.query.province_code,
            item_tag_id: this.query.item_tag_id,

            totalItemTotalPrice: this.$route.query.totalItemTotalPrice
          }
        });
      },

          //获取商品运营专区数据
   async getTagsOptions(){
      let that = this
       this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataItemTagsList, {
          province_code: that.$data.query.province_code
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.tagsOptions = res.data;
          // console.log(this.$data.tagsOptions);
          
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
    },
      //改变运营专区
      selectTagChange(value){
          let that = this;
      let { query } = that;
      query.item_tag_id = value
      that.statisticalOrderClassSum()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .title:hover {
    font-weight: 600;
  }
  .title-disable {
    color: inherit;
    padding: 5px 10px 5px 0;
  }
</style>

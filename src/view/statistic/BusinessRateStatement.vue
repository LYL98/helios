<!--
  业务四率表
-->
<template>
  <sub-menu>
    <query-business-four-rate
      v-model="query"
      @change="changeQuery"
      :reset="resetQuery"/>
    <div style="height: 0">
      <el-select style="position: relative; margin-top: 13px; margin-left: 25px; width: 80px; z-index: 100" size="small" v-model="selectArea" @change="onSelectArea">
        <el-option label="区域" value="zone"></el-option>
        <el-option label="县域" value="city"></el-option>
      </el-select>
    </div>
    <div class="statistics-table-list-container">
      <el-table
        :data="dataItem.items"
        :height="viewWindowHeight - offsetHeight"
        @sort-change="onSort"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        style="width: 100%;">
        <el-table-column
          :min-width="maxLabelWidth"
          fixed="left"
          prop="city_title">
          <template slot-scope="scope">
            <span>{{formatValue(selectArea === 'zone' ? scope.row.zone_title : scope.row.city_title)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cover_rate"
          label="覆盖率"
          align="left"
          sortable="custom"
          min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{formatRate(scope.row.cover_rate)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="convert_rate"
          label="转化率"
          align="left"
          sortable="custom"
          min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{formatRate(scope.row.convert_rate)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="repeat_rate"
          label="复购率"
          align="left"
          sortable="custom"
          min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{formatRate(scope.row.repeat_rate)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="aftersale_rate"
          label="退赔率"
          align="left"
          sortable="custom"
          min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{formatRate(scope.row.aftersale_rate)}}</div>
          </template>
        </el-table-column>
        <el-table-column
            prop="cust_price"
            label="平均客单价"
            align="left"
            sortable="custom"
            min-width="120">
            <template slot-scope="scope">
              <div :class="isEllipsis(scope.row)">{{returnPrice(scope.row.cust_price)}}</div>
            </template>
        </el-table-column>
        <el-table-column
          prop="store_num_pre"
          label="预计门店数"
          align="left"
          min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{formatValue(scope.row.store_num_pre)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="store_num_reg"
          label="注册门店数"
          align="left"
          min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{formatValue(scope.row.store_num_reg)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="store_num_ord"
          label="下单门店数"
          align="left"
          min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{formatValue(scope.row.store_num_ord)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="new_store_num"
          label="新增门店数"
          align="left"
          min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{formatValue(scope.row.new_store_num)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_num_store"
          label="门店下单次数"
          align="left"
          min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{formatValue(scope.row.order_num_store)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="gmv"
          label="GMV"
          align="left"
          min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{returnPrice(scope.row.gmv)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="real_price"
          label="订单应付金额"
          align="left"
          min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{returnPrice(scope.row.real_price)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="fram_total_price"
          label="筐金额"
          align="left"
          min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{returnPrice(scope.row.fram_total_price)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="bonus_promotion"
          label="优惠金额"
          align="left"
          min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{scope.row.bonus_promotion > 0 ? '-' : ''}}{{returnPrice(scope.row.bonus_promotion)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_num_sum"
          label="订单数量"
          align="left"
          min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{formatValue(scope.row.order_num_sum)}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-bottom" style="padding-bottom: 10px" v-if="dataItem.num > 0">
        <div class="table-pagination">
          <el-pagination
            background
            @size-change="changePageSize"
            @current-change="changePage"
            :current-page="query.page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="query.page_size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="dataItem.num">
          </el-pagination>
        </div>
      </div>
    </div>
  </sub-menu>
</template>

<script>
import { DatePicker, Button, Table, TableColumn, Pagination, Select, Option, Input, Message } from 'element-ui';
import { SelectZone } from '@/common';
import { QueryBusinessFourRate } from '@/container';
import { Http, Config, DataHandle, Constant } from '@/util';
import mainMixin from '@/share/mixin/main.mixin';

export default {
  name: "BusinessRateStatement",
  mixins: [mainMixin],
  components: {
    'el-button': Button,
    'el-date-picker': DatePicker,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-pagination': Pagination,
    'el-select': Select,
    'el-option': Option,
    'el-input': Input,
    'my-select-zone': SelectZone,
    'query-business-four-rate': QueryBusinessFourRate,
  },
  created() {
  },
  data() {
    return {
      dataItem: {},
      selectArea: 'zone',
      maxLabelWidth: 80,
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_TABS + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE,
      query: {
        page: 1,
        page_size: 20,
        province_code: '',
        zone_id: '',
        begin_date: '',
        end_date: '',
        sort: ''
      },
      currentRow: {}
    }
  },

  methods: {
    cellMouseEnter(row, column, cell, event) {
      if(row.id !== this.$data.currentRow.id) {
        this.$data.currentRow = row;
      }
    },

    cellMouseLeave(row, column, cell, event) {
      this.$data.currentRow = {};
    },

    isEllipsis(row) {
      return row.id != this.$data.currentRow.id ? 'add-dot' : ''
    },

    highlightRowClassName({row, rowIndex}) {
      if (rowIndex === 0 || rowIndex === 1) {
        //总计、平均值
        return 'highlight-row';
      } else if (rowIndex % 2 === 1) {
        return 'stripe-row'
      } else {
        return 'default-row';
      }
    },
    //格式化一般值
    formatValue(value) {
      return value || value === 0 ? value : '-'
    },
    //格式化百分比
    formatRate(value) {
      return value || value === 0 ? this.returnMarkup(value) + '%' : '-'
    },
    //返回价格
    returnPrice(price){
      if(price || price === 0){
        if(price < 0){
          return '-¥' + DataHandle.returnPrice(Math.abs(price));
        }else{
          return '¥' + DataHandle.returnPrice(price);
        }
      }else{
        return '-';
      }
    },
    //返回加价率
    returnMarkup(markup){
      return DataHandle.returnMarkup(markup);
    },
    changePageSize(pageSize) {
      this.query.page_size = pageSize;
      this.loadOrderFourRateListFirstPage()
    },
    //翻页
    changePage(page){
      window.scrollTo(0, 0);
      this.$data.query.page = page;
      this.loadOrderFourRateList();
    },
    //区域选择
    onSelectArea() {
      this.loadOrderFourRateListFirstPage();
    },
    onSort({ column, prop, order }) {
      if (order === 'ascending') {
          this.query.sort = prop;
        } else if (order === 'descending') {
          this.query.sort = '-' + prop
        } else {
          this.query.sort = ''
        }
      this.loadOrderFourRateListFirstPage()
    },
    changeQuery() {
      this.loadOrderFourRateListFirstPage()
    },
    resetQuery() {
      // this.$data.query = {
      //   page: 1,
      //   page_size: 20,
      //   zone_id: '',
      //   province_code: this.province.code,
      //   sort: this.$data.resetSort,
      //   begin_date: this.$data.resetBeginDate,
      //   end_date: this.$data.resetEndDate,
      // };
      // this.loadOrderFourRateListFirstPage()
    },
    //加载第一页数据
    loadOrderFourRateListFirstPage() {
      this.query.page = 1;
      this.loadOrderFourRateList();
    },
    loadOrderFourRateList() {
      this.orderFourRateList().catch(e => {console.error(e)});
    },
    async orderFourRateList(){
      let that = this;
      let { query, selectArea } = that;
      this.$loading({ isShow: true, isWhole: true });
      let res = selectArea === 'zone' ?
        await Http.get(Config.api.statisticalOrderFourRateZone, query):
        await Http.get(Config.api.statisticalOrderFourRateCity, query);
      if(res.code === 0){
        if (res.data.items && res.data.items.length > 0) {
          //插入平均值
          let average = res.data.average;
          if (selectArea === 'zone') {
            average.zone_title = '平均值'
          } else {
            average.city_title = '平均值'
          }
          res.data.items.unshift(average);

          //插入统计值
          let total = res.data.total;
          if (selectArea === 'zone') {
            total.zone_title = '总计'
          } else {
            total.city_title = '总计'
          }
          res.data.items.unshift(total);
        }
        // console.log('items origin: ', res.data.items)
        res.data.items.map((item, index) => item.id = index);
        // console.log('items: ', res.data.items)
        that.$data.dataItem = res.data;

        that.maxLabelWidth = DataHandle.computeTableLabelMinWidth(that.$data.dataItem.items,
          item => selectArea === 'zone' ? item.zone_title : item.city_title);
      }else{
        this.$message({title: '提示', message: res.message, type: 'error'});
      }
      this.$loading({ isShow: false });
    },
  }
}
</script>

<style scoped>

</style>

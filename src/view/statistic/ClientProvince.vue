<template>
  <sub-menu>
    <div class="breadcrumb" style="margin-bottom: 16px;">
      <el-breadcrumb separator="/" class="custom-breadcrumb">
        <el-breadcrumb-item
          :to="{ path: '/statistic/client', query: { begin_date: breadcrumb.begin_date, end_date: breadcrumb.end_date,total:breadcrumb.total } }"
        >
          客户订单统计
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ query.province_code === '' ? '全部省份' : query.province_title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="query" style="margin-bottom: 20px;">
      <el-row>
        <el-col :xl="6" :lg="7" :span="7">
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
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="区域">
            <my-select-province
              :value="query.province_code"
              @change="selectProvince"
              size="small"
              class="query-item-select"
            />
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="listItem"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        @sort-change="onSort"
      >
        <!-- 片区、订单金额、订单量、件数、占比、操作 -->
        <el-table-column
          type="index"
          :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
          label="序号"
          :index="indexMethod"
        />
        <el-table-column label="片区" prop="zone_title" min-width="120">
          <template slot-scope="scope">
            <a href="javascript:void(0)"
               class="title"
               @click="handleShowZoneDetail(scope.row)"
               v-if="!!scope.row.zone_title && ( auth.isAdmin || auth.StatisticClientZone )"
            >
              {{ scope.row.zone_title || '其它' }}
            </a>
            <div v-else>
              {{ scope.row.zone_title || '其它' }}
            </div>

            <!--{{ scope.row.zone_title || '其它' }}-->
          </template>
        </el-table-column>
        <el-table-column label="GMV" sortable="custom" prop="gmv" min-width="130">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.gmv) }}
          </template>
        </el-table-column>
        <el-table-column label="订单商品金额" sortable="custom" prop="amount_real" min-width="130">
          <template slot-scope="scope">
            ￥{{ returnPrice(scope.row.amount_real) }}
          </template>
        </el-table-column>
        <el-table-column label="下单门店数" sortable="custom" prop="store_num"  min-width="100"/>
        <el-table-column label="件数" sortable="custom" prop="piece_num" min-width="100"></el-table-column>
        <el-table-column label="占比" prop="percent">
          <template slot-scope="scope">
            <!-- {{returnPercentage(scope.row.gmv, total)}}% -->
            {{ scope.row.ratio }}%
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              :list="[
                  {
                    title: '查看',
                    isDisplay: !!scope.row.zone_title && ( auth.isAdmin || auth.StatisticClientZone ),
                    command: () => handleShowZoneDetail(scope.row)
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
  import { Row, Col, DatePicker, Table, TableColumn, Pagination, Breadcrumb, BreadcrumbItem } from 'element-ui';
  import { QueryItem, TableOperate, SelectZone, SelectProvince } from '@/common';
  import { Http, Config, DataHandle, Constant } from '@/util';
  import mainMixin from '@/share/mixin/main.mixin';
  import { GlobalProvince } from '@/component';

  export default {
    name: "ClientZone",
    mixins: [mainMixin],
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-breadcrumb': Breadcrumb,
      'el-breadcrumb-item': BreadcrumbItem,
      'el-date-picker': DatePicker,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'my-select-zone': SelectZone,
      'my-select-province': SelectProvince,
      'global-province': GlobalProvince,
    },
    data() {
      return {
        fixDateOptions: Constant.FIX_DATE_RANGE,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_BREADCRUMB + Constant.OFFSET_QUERY_CLOSE,
        pickerValue: [],
        breadcrumb: {},
        query: { },
        listItem: [],
        currentRow: {},
        total: 0,
      }
    },
    created() {
      documentTitle("统计 - 客户订单统计");
      this.initBreadcrumb();
      this.initQuery();
      this.zoneOrderList();
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

      onSort({ column, prop, order }) {
        if (order === 'ascending') {
          this.query.sort = prop;
        } else if (order === 'descending') {
          this.query.sort = '-' + prop
        } else {
          this.query.sort = ''
        }
        // this.$data.query.page = 1;
        this.zoneOrderList();
      },

      initBreadcrumb() {
        let province_code = this.$route.query.province_code;
        let province_title = this.$route.query.province_title;
        let begin_date = this.$route.query.begin_date;
        let end_date = this.$route.query.end_date;
        let total = this.$route.query.total
        this.$data.breadcrumb = Object.assign(this.$data.breadcrumb, {
          province_code: province_code,
          province_title: province_title,
          begin_date: begin_date,
          end_date: end_date,
          total: total
        })
      },

      initQuery() {
        // console.log("当前的请求参数", this.$route.query);
        let pickerValue = [];
        let begin_date = this.$route.query.begin_date;
        let end_date = this.$route.query.end_date;
        pickerValue.push(begin_date);
        pickerValue.push(end_date);
        this.$data.pickerValue = pickerValue;
        this.$data.query = Object.assign(this.$data.query, {
          begin_date: begin_date,
          end_date: end_date,
          sort: '-gmv',
          province_code: this.$route.query.province_code,
          province_title: this.$route.query.province_title,
          page: 1,
          page_size: Constant.PAGE_SIZE,
          total:this.$route.query.total
        });
        this.$data.total = this.$route.query.total

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
        this.zoneOrderList();
      },
      selectProvince(data){
        this.$data.query.province_code = data.code;
        this.zoneOrderList();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.zoneOrderList();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.zoneOrderList();
      },
      // 获取商品分类列表
      async zoneOrderList(callback) {
        let that = this;
        let { query } = that;
        this.$loading({ isShow: true, isWhole: true });
        let res = await Http.get(Config.api.statisticalOrderGradeSum, query);
        if(res.code === 0){
          // this.total = 0
          // res.data.map(item => {
          //   this.total += item.gmv
          // })
          that.$data.listItem = res.data;
          typeof callback === 'function' && callback();
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
        this.$loading({ isShow: false });
      },

      handleShowZoneDetail(item) {
        let zone_id = item.zone_id;
        let zone_title = item.zone_title;
        let province_code = this.$data.breadcrumb.province_code;
        let province_title = this.$data.breadcrumb.province_title;
        let total = 
        this.$router.push({
          path: '/statistic/client/zone',
          query: {
            zone_id: zone_id,
            zone_title: zone_title,
            province_code: province_code,
            province_title: province_title,
            begin_date: this.$data.query.begin_date,
            end_date: this.$data.query.end_date,
            total:this.$data.query.total

          }
        });
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

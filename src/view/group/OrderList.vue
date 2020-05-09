<template>
  <div>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="区域">
            <global-province v-model="query.province_code" isRequired type="select" @change="selectProvince"/>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="下单时间">
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
                style="width: 100%;"
              />
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <div style="display: flex">
              <el-input
                size="small"
                class="query-item-input"
                clearable
                v-model="query.condition"
                placeholder="订单编号、收货人姓名"
                @keyup.enter.native="changeQuery"
                @clear="changeQuery"
                ref="condition"
              />
              <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px"
                         @click="changeQuery"></el-button>
              <el-button type="primary" size="small" class="query-item-reset" plain @click="resetQuery">重置</el-button>
            </div>
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">
        <el-col :span="7">
          <my-query-item label="订单状态">
            <el-select
              v-model="query.status"
              @change="changeQuery"
              placeholder="全部"
              size="small"
              clearable
              style="width: 100%;"
            >
              <el-option
                v-for="(item, key) in groupOrderStatus"
                :key="key"
                :label="item"
                :value="key"
              ></el-option>
            </el-select>
          </my-query-item>
        </el-col>
      </el-row>
    </div>

    <div class="operate space-between">
      <el-button
        v-if="auth.isAdmin || auth.GroupOrderExport"
        plain
        size="mini"
        type="primary"
        @click.native="handleExport('groupOrderExport', query)"
        style="margin-left: auto;"
      >
        导出订单
      </el-button>
      <el-button
        v-if="auth.isAdmin || auth.GroupOrderDetailExport"
        plain
        size="mini"
        type="primary"
        @click.native="handleExport('groupOrderDetailExport', query)"
      >
        导出用户明细单
      </el-button>
    </div>

    <div>
      <el-table
        class="list-table my-table-float"
        :data="listItem.items"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column
          type="index"
          :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88"
          label="序号"
          :index="indexMethod"
        />
        <el-table-column label="订单编号" prop="code" min-width="130">
          <template slot-scope="scope">
            <span v-if="auth.isAdmin || auth.GroupOrderDetail">
              <a class="order-no"
                 href="javascript:void(0);"
                 @click.prevent="handleShowItemDetail(scope.row.id)"
              >
                {{scope.row.code}}
              </a>
            </span>
            <span v-else>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货人" prop="linkman" min-width="120">
          <template slot-scope="scope">
            <div>
              {{ scope.row.linkman || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品数量" prop="price_at_created" min-width="90">
          <template slot-scope="scope">
            <div>
              {{scope.row.item_num}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实付金额" prop="pay_amount" min-width="90">
          <template slot-scope="scope">
            <div>
              {{ scope.row.pay_amount ? '￥' : '' }}{{ returnPrice(scope.row.pay_amount) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="100">
          <template slot-scope="scope">
            <el-tag disable-transitions size="small" :type="statusTagType[scope.row.status]"
            >{{ groupOrderStatus[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="created" min-width="160">
          <template slot-scope="scope">
            <div>
              {{ scope.row.created || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              :list="[
                {
                  title: '取消',
                  isDisplay: (auth.isAdmin || auth.GroupOrderCancel) && (scope.row.status === 'init' || scope.row.status === 'paid'),
                  command: () => handleOrderCancel(scope.row.id)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="footer">
      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="listItem.num"
          :page-size="query.page_size"
          :current-page="query.page"
        />
      </div>
    </div>

  </div>
</template>

<script>

  /**
   * 初始化查询对象 query
   * 请求列表数据
   * changeQuery
   * resetQuery
   *
   */
  import { SelectOption, QueryItem, SelectCity, TableOperate, ImagePreview } from '@/common';
  import { Constant, Config, DataHandle, Http } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';
  import { GlobalProvince } from '@/component';

  export default {
    name: "OrderList",
    components: {
      'my-select-city': SelectCity,
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate,
      'my-image-preview': ImagePreview,
      'global-province': GlobalProvince,
    },
    mixins: [tableMixin],
    props: {
      showDetail: { type: Function, required: true }
    },
    data() {
      return {
        groupOrderStatus: Constant.GROUP_ORDER_STATUS,
        statusTagType: Constant.GROUP_ORDER_STATUS_TYPE,
        /*最近30天（以当天作为结尾，往前30天）
         本周
         上周
         本月（以本月作为选择）
         上月（以当前所在月的上一个月作为选择）
         本年
         上一年*/
        fixDateOptions: Constant.FIX_DATE_RANGE,
        pickerValue: null,
        query: {},
        listItem: {
          num: 0,
          items: []
        },
      }
    },
    created() {
      this.initQuery();
    },

    methods: {
      //查询选择区域后【初始化】
      selectProvince(data){
        this.$data.query.province_code = data.code;
        this.orderQuery();
      },
      initQuery() {
        this.$data.pickerValue = null;
        this.$data.query = {
          province_code: this.$province.code,
          status: '',
          condition: '',
          begin_date: '',
          end_date: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        }
      },
      resetQuery(){
        this.initQuery();
        this.orderQuery();
      },
      changeQuery() {
        this.$data.query = Object.assign(this.$data.query, { page: 1 });
        this.orderQuery();
      },
      //搜索日期
      changePicker(value){
        let { query } = this;
        if(value && value.length === 2){
          query.begin_date = value[0];
          query.end_date = value[1];
        }else{
          query.begin_date = '';
          query.end_date = '';
        }
        query.page = 1;
        this.$data.query = Object.assign({}, query);
        this.orderQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.orderQuery();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.orderQuery();
      },
      async orderQuery() {
        let res = await Http.get(Config.api.groupOrderQuery, this.query);
        if (res.code === 0) {
          this.$data.listItem = Object.assign(this.$data.listItem, {
            num: res.data.num,
            items: res.data.items
          });
        } else {
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },

      // 判断当前行是否可以被选中
      selectable(row) {
        return row.status === 'wait_delivery_customer';
      },

      //取消
      handleOrderCancel(id) {
        this.$messageBox.confirm('确认取消订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.groupOrderCancel, {id: id});
          if (res.code === 0) {
            this.$message({title: '提示', message: '订单取消成功', type: 'success'});
            this.orderQuery();
          } else {
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      handleShowItemDetail(id) {
        this.$props.showDetail(id);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .order-no {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }

  .order-no:hover {
    font-weight: 600;
  }
</style>

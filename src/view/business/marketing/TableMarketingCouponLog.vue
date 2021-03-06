<template>
  <div>
    <div class="wp-query">
      <el-button v-if="auth.isAdmin || auth.MarketingCouponDistributeLogExport" type="primary" size="mini" @click.native="listExport" plain>
        导出优惠券发放记录
      </el-button>
    </div>

    <el-table
      style="margin-top: -15px;"
      :data="dataItem.items"
      :row-class-name="highlightRowClassName"
      :highlight-current-row="true"
    >
      <el-table-column label="发放时间" prop="created" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.created }}
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column label="编号/名称" prop="coupon_code">-->
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.coupon_code }} / {{ scope.row.coupon_title }}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="发放方式" prop="dis_type" width="140">
        <template slot-scope="scope">
          <div>
            {{ disType[scope.row.dis_type] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="发放记录">
        <template slot-scope="scope">
          <div style="padding-right: 10px;">
            {{ scope.row.dis_scope_str || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="operator_name" width="130">
        <template slot-scope="scope">
          <div>
            {{ scope.row.operator_name }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40, 50]"
        @size-change="changePageSize"
        @current-change="changePage"
        :total="dataItem.num"
        :page-size="query.page_size"
        :current-page="query.page"
      />
    </div>
  </div>
</template>

<script>
  import { Input, Button, Table, TableColumn, Pagination, Message, Popover } from 'element-ui';
  import { OmissionText } from '@/common';
  import { Constant, Config, Http } from '@/util';

  export default {
    name: "TableMarketingCouponLog",
    components: {
      'el-input': Input,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'el-popover': Popover,
      'my-omission-text': OmissionText
    },
    props: {
      coupon_log: { type: Object, required: true }
    },
    data() {
      return {
        auth: this.$auth,
        query: { },
        dataItem: {
          items: [],
          num: 0
        },
        disType: Constant.ITEM_COUPON_DIS_TYPE
      }
    },
    created() {
      if (this.$props.coupon_log.id) {
        this.initQuery();
        this.queryLog();
      }
    },
    methods: {
      //列表导出
      async listExport() {
        let api = Config.api.itemCouponListExport;
        //判断是否可导出
        this.$loading({ isShow: true,  isWhole: true });
        let res = await Http.get(`${api}_check`, {
          province_code: this.$province.code,
          coupon_id: this.query.coupon_id
        });
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.$province.code}&coupon_id=${this.query.coupon_id}`;

          window.open(queryStr);
        }else{
          this.$message({ title: '提示', message: res.message, type: 'error' });
        }
        this.$loading({ isShow: false });
      },

      highlightRowClassName({row, rowIndex}) {
        if (rowIndex % 2 == 0) {
          return 'stripe-row';
        } else if (rowIndex % 2 != 0) {
          return 'default-row'
        }
        return '';
      },

      initQuery() {
        this.$data.query = Object.assign({}, this.$data.query, {
          province_code: this.$province.code,
          coupon_id: this.$props.coupon_log.id,
          condition: '',
          page: 1,
          page_size: 10
        })
      },
      handleQuery() {
        this.query.page = 1;
        this.queryLog();
      },
      resetQuery() {
        this.initQuery();
        this.queryLog();
      },
      changePage(page) {
        this.$data.query.page = page;
        this.queryLog();
      },
      changePageSize(size) {
        this.$data.query.page_size = size;
        this.queryLog();
      },
      async queryLog() {
        let res = await Http.get(Config.api.itemCouponDistributeLog, this.query);
        if (res.code === 0) {
          let items = res.data.items.map(item => {
            item.dis_scope_str = this.showDisLog(item);
            return item;
          });
          this.$data.dataItem = Object.assign({}, this.$data.dataItem, { num: res.data.num, items: items });
        } else {
          Message.warning(res.message);
        }
      },
      showDisLog(row) {
        let dis_scope_str = '';
        switch(row.dis_type) {
          case 'type_grade':
            dis_scope_str = (row.grades || []).map(item => item.title).join('、');
            break;
          case 'type_city_grade':
            dis_scope_str = (row.cities || []).map(item => item.title).join('、');
            if (Array.isArray(row.grades) && row.grades.length > 0) {
              dis_scope_str += '&';
              dis_scope_str += row.grades.map(item => item.title).join('、');
            }
            break;
          case 'type_city':
            dis_scope_str = (row.cities || []).map(item => item.title).join('、');
            break;
          case 'type_merchant':
          case 'type_auto':
            dis_scope_str = (row.merchants || []).map(item => item.title).join('、');
            break;
          default:
            break;
        }
        return dis_scope_str || '-';

      }
    }
  }
</script>

<style scoped>
  .wp-query {
    padding: 0 10px 25px;
    border-bottom: 1px solid #f3f4f6;
    text-align: right;
  }
  .table-footer {
    padding: 12px 10px 0;
    display: flex;
    justify-content: flex-end;
  }

</style>

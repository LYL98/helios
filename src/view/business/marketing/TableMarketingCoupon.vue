<template>
  <div @mousemove="handleTableMouseMove" class="table-conter">
    <el-table
      class="list-table my-table-float"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      :data="data"
      :row-class-name="highlightRowClassName"
      highlight-current-row="highlight-current-row"
      :row-key="rowIdentifier"
      :current-row-key="clickedRow[rowIdentifier]"
    >
      <el-table-column type="index" :width="(page - 1) * pageSize < 950 ? 48 : (page - 1) * pageSize <= 999950 ? 68 : 88" label="序号" :index="indexMethod"></el-table-column>
      <el-table-column label="编号/名称" prop="title" min-width="200">
        <template slot-scope="scope">
          <a href="javascript:void(0);" :class="`title`" @click="handleShowItem(scope.row.id)">
            {{ scope.row.code }} / {{ scope.row.title }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="coupon_type" min-width="70">
        <template slot-scope="scope">
          <div>
            {{ couponType[scope.row.coupon_type] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" min-width="100">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="isExpired(scope.row.time_start, scope.row.time_end) ? 'info' : 'primary'"
            disable-transitions
          >
            {{ isExpired(scope.row.time_start, scope.row.time_end) ? '已过期' : '未过期' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="自动发放" prop="is_auto_dis" min-width="80">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.is_auto_dis ? 'regular' : 'info'"
            disable-transitions
          >
            {{ scope.row.is_auto_dis ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="自动发放状态" prop="auto_dis_status" min-width="110">
        <template slot-scope="scope">
          <span v-if="!scope.row.is_auto_dis">-</span>
          <el-tag
            v-if="scope.row.is_auto_dis"
            size="small"
            :type="isExpired(scope.row.time_start, scope.row.time_end) ? 'info' : scope.row.auto_dis_status ? 'primary' : 'regular'"
            disable-transitions
          >
            {{ isExpired(scope.row.time_start, scope.row.time_end) ? '已结束' : scope.row.auto_dis_status ? '进行中' : '暂停中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="time_start" min-width="150">
        <template slot-scope="scope">
          <div>
            {{ scope.row.time_start }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="time_end" min-width="150">
        <template slot-scope="scope">
          <div>
            {{ scope.row.time_end }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <my-table-operate
            @command-click="handleCommandClick(scope.row)"
            @command-visible="handleCommandVisible"
            :list="[
            {
              title: '手动发放',
              isDisplay: (auth.isAdmin || auth.MarketingCouponDistribute) && !isExpired(scope.row.time_start, scope.row.time_end),
              command: () => handleSend(scope.row)
            },
            {
              title: '开始自动发放',
              isDisplay: (auth.isAdmin || auth.MarketingCouponAutoDisStart) && !isExpired(scope.row.time_start, scope.row.time_end) && scope.row.is_auto_dis && !scope.row.auto_dis_status,
              command: () => handleAutoDis(scope.row)
            },
            {
              title: '暂停自动发放',
              isDisplay: (auth.isAdmin || auth.MarketingCouponAutoDisStop) && !isExpired(scope.row.time_start, scope.row.time_end) && scope.row.is_auto_dis && scope.row.auto_dis_status,
              command: () => handleAutoDis(scope.row)
            },
            {
              title: '发放记录',
              isDisplay: auth.isAdmin || auth.MarketingCouponDistributeLog,
              command: () => handleShowLog(scope.row)
            }
          ]"
          />

        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { Table, TableColumn, MessageBox, Tag } from 'element-ui';
  import {TableOperate} from '@/common';
  import { Constant, DataHandle } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: "TableMarketingCoupon",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    props: {
      data: { type: Array, required: true },
      stripe: { type: Boolean, default: true },
      'highlight-current-row': { type: Boolean, default: true },
      page: { type: Number, required: true },
      pageSize: { type: Number, required: true },
      sendItem: { type: Function, required: true },
      autoDis: { type: Function, required: true },
      showItem: { type: Function, required: true },
      showLog: { type: Function, required: true }
    },
    computed: {
    },
    data() {
      return {
        couponType: Constant.ITEM_COUPON_TYPE,
        couponStatus: Constant.ITEM_COUPON_STATUS,
      }
    },
    methods: {

      indexMethod(index) {
        return (this.$props.page - 1) * this.$props.pageSize + index + 1;
      },
      isExpired(start, end) {
        return new Date().getTime() > new Date(end).getTime();
      },
      handleShowItem(id) {
        this.$props.showItem(id);
      },
      handleSend(item) {
        this.$props.sendItem(item);
      },
      handleAutoDis(item) {
        this.$props.autoDis(item);
      },
      handleShowLog(item) {
        this.$props.showLog(item);
      },
    }
  }
</script>
<style scoped>
  .title {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .title:hover {
    font-weight: 600;
  }
</style>

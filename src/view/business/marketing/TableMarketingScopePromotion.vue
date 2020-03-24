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
      <el-table-column type="index" :width="(page - 1) * pageSize < 950 ? 48 : (page - 1) * pageSize < 999950 ? 68 : 88" label="序号" :index="indexMethod"></el-table-column>
      <el-table-column label="活动主题" prop="topic" min-width="240">
        <template slot-scope="scope">
          <a href="javascript:void(0);" :class="`title ${isEllipsis(scope.row)}`" @click="handleShowDetail(scope.row.id)">
            {{ scope.row.topic }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="活动类型" prop="promotion_type" min-width="100">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ promotionType[scope.row.promotion_type] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" prop="date_status" min-width="100">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.date_status === 'date_before' ? 'regular' : scope.row.date_status === 'date_on' ? 'primary' : 'info'"
            disable-transitions
          >
            {{ promotionDateStatus[scope.row.date_status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" prop="status" min-width="100">
        <template slot-scope="scope">
          <el-tag
            size="small"
            :type="scope.row.status === 'st_activated' ? 'regular' : 'info'"
            disable-transitions
          >
            {{scope.row.status === 'st_activated' ? '已上架' : '未上架'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" prop="time_start" min-width="160">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.time_start }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="time_end" min-width="160">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.time_end }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <my-table-operate
            @command-click="handleCommandClick(scope.row)"
            @command-visible="handleCommandVisible"
            :list="[
              {
                title: '上架',
                isDisplay: (auth.isAdmin || auth.MarketingScopePromotionStart) && (scope.row.status === 'st_deactivated' && scope.row.date_status !== 'date_out_of'),
                command: () => handleStart(scope.row.id)
              },
              {
                title: '下架',
                isDisplay: (auth.isAdmin || auth.MarketingScopePromotionHalt) && (scope.row.status === 'st_activated' && scope.row.date_status !== 'date_out_of'),
                command: () => handleHalt(scope.row.id)
              }
            ]"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialog.isShow"
      :title="dialog.item && dialog.item.topic"
      width="680px"
      append-to-body
    >
      <el-form label-position="left" label-width="140px" style="margin-left: 30px; margin-top: -10px;">
        <el-form-item label="促销类型：">{{ dialog.item.promotion_type === 'type_reduction' ? '全场满减' : '全场满折' }}</el-form-item>
        <el-form-item label="活动时间：">{{ dialog.item.time_start }} ~ {{ dialog.item.time_end }}</el-form-item>
        <el-form-item label="创建人：">{{ dialog.item.operator && dialog.item.operator.realname }}</el-form-item>
        <el-form-item label="创建时间：">{{ dialog.item.created }}</el-form-item>
        <el-form-item label="活动内容：">
          <ul>
            <li v-for="(item, index) in dialog.item.rules" :key="index">
              全场满
              {{ returnPrice(item.full) }}
              元，
              {{ dialog.item.promotion_type === 'type_reduction' ? '减' : '打' }}
              {{ dialog.item.promotion_type === 'type_reduction' ? returnPrice(item.reduction) : returnDiscount(item.reduction) }}
              {{ dialog.item.promotion_type === 'type_reduction' ? '元' : '折' }}
            </li>
          </ul>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { Table, TableColumn, Dialog, Form, FormItem, MessageBox, Tag } from 'element-ui';
  import {TableOperate} from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';
  
  export default {
    name: "TableMarketingScopePromotion",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-dialog': Dialog,
      'el-form': Form,
      'el-tag': Tag,
      'el-form-item': FormItem,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    props: {
      data: { type: Array, required: true },
      stripe: { type: Boolean, default: true },
      'highlight-current-row': { type: Boolean, default: true },
      page: { type: Number, required: true },
      pageSize: { type: Number, required: true },
      start: { type: Function, required: true },
      end: { type: Function, required: true },
    },
    data() {
      return {
        promotionDateStatus: Constant.ITEM_PROMOTION_DATE_STATUS,
        dialog: {
          isShow: false,
          item: { }
        }
      }
    },
    computed: {
      promotionStatus: {
        get() {
          return Constant.ITEM_PROMOTION_STATUS;
        }
      },
      promotionType: {
        get() {
          return Constant.ITEM_PROMOTION_TYPE;
        }
      }
    },
    methods: {

      indexMethod(index) {
        return (this.$props.page - 1) * this.$props.pageSize + index + 1;
      },
      async handleShowDetail(id) {
        let res = await Http.get(Config.api.itemPromotionDetail, { promotion_id: id });
        if (res.code === 0) {
          this.$data.dialog.item = res.data;
          this.$data.dialog.isShow = true;
        } else {
          Message.warning(res.message);
        }
      },
      isShowStart(status, isHalt, start, end) {
        let now = new Date().getTime();
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        // 没有点击过上线、没有点击过结束、小于开始时间；则显示上线按钮
        return status === 'st_deactivated' && !isHalt && now < start;
      },
      isShowEnd(status, isHalt, start, end) {
        let now = new Date().getTime();
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        // 没有点击过结束、小于结束时间的；则显示结束按钮 （未激活的活动，也可以设置结束按钮）
        return !isHalt && now < end;
      },
      handleStart(id) {
        MessageBox.confirm('确认上架活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$props.start(id);
        }).catch(() => {
          // console.log('取消');
        });
      },
      handleHalt(id) {
        MessageBox.confirm('确认下架活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$props.end(id);
        }).catch(() => {
          // console.log('取消');
        });
      }
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

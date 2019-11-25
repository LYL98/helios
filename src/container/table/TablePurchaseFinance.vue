<template>
  <div class="table-body">
    <div class="table-top" v-if="auth.isAdmin || auth.PurchaseFinanceApprove">
      <div class="left">
        <el-button size="mini" type="primary" @click.native="handleApproveItem(multipleSelection)" :disabled="multipleSelection.length === 0 ? true : false">批量审核</el-button>
      </div>
      <div class="right"></div>
    </div>
    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="data"
        :height="windowHeight - offsetHeight"
        :row-class-name="highlightRowClassName"
        highlight-current-row="highlight-current-row"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="30" :selectable="selectable" v-if="auth.isAdmin || auth.PurchaseFinanceApprove"></el-table-column>
        <el-table-column type="index" :width="(page - 1) * pageSize < 950 ? 48 : (page - 1) * pageSize < 999950 ? 68 : 88" label="序号" :index="indexMethod"></el-table-column>
        <el-table-column label="编号/商品名" min-width="170">
          <template slot-scope="scope" >
            <div style="display: flex; align-items: center;">
              <my-image-preview v-if="scope.row.item.images.length > 0">
                <img
                  lazy-load
                  :src="scope.row.item.images.length > 0 ? tencentPath + scope.row.item.images[0] + '_min200x200' : ''"
                  width="48"
                  height="48"
                />
              </my-image-preview>
              <ul style="margin: 0 10px;" :class="isEllipsis(scope.row)">
                <li :class="isEllipsis(scope.row)">
                  {{ scope.row.item_code + ' / ' + scope.row.item_name }}
                </li>
                <li :class="isEllipsis(scope.row)">
                  &yen;{{returnPrice(scope.row.unit_price)}} / {{scope.row.item.sale_unit}}
                  {{scope.row.item && scope.row.item.frame_code ? '(含框)' : ''}}
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="采购员" prop="buyer" min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.buyer }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="供应商" prop="supplier" min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.supplier && scope.row.supplier.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="采购日期" prop="purchase_date" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.purchase_date || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="采购总额" prop="total_price" min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.total_price == 0 ? '' : '￥' }}{{ scope.row.total_price == 0 ? '-' : returnPrice(scope.row.total_price) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="采购件数" prop="number" min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.number || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="重量总计" prop="weight" min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.item.is_weigh ? returnWeight(scope.row.weight) : '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核结果" prop="status" min-width="110" v-if="query.if_check_opt === 1">
          <template slot-scope="scope">
            <el-tag disable-transitions size="small" :type="statusTagType[scope.row.status]"
            >{{ purchaseItemStatus[scope.row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created" min-width="90">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              <span>{{ returnDate(scope.row.created) }}</span><br><span>{{returnTime(scope.row.created)}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="付款时间" min-width="90" v-if="query.if_check_opt === 1">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.pay_date || '-' }}
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
                title: '审核',
                isDisplay: (auth.isAdmin || auth.PurchaseFinanceApprove) && scope.row.status === 'first_checked',
                command: () => handleApproveItem([scope.row])
              },
              {
                title: '操作日志',
                isDisplay: (auth.isAdmin || auth.PurchaseFinanceApproveLog) && (
                  scope.row.status === 'first_checked'
                    || scope.row.status === 'second_checked'
                    || scope.row.status === 'first_declined'
                    || scope.row.status === 'second_declined'
                    || scope.row.status === 'declined'
                    || scope.row.status === 'decline'
                ),
                command: () => handleApproveLog(scope.row.id)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :visible.sync="approveLog.isShow"
      :before-close="handleCloseApproveLog"
      title="操作日志"
      width="800px"
      append-to-body
    >
      <el-table
        style="margin-top: -15px;"
        :data="approveLog.items"
        @cell-mouse-enter="logCellMouseEnter"
        @cell-mouse-leave="logCellMouseLeave"
        :row-class-name="highlightRowClassName"
        highlight-current-row="highlight-current-row"
      >
        <el-table-column label="时间" prop="created" width="180">
          <template slot-scope="scope">
            <div :class="logIsEllipsis(scope.row)">
              {{ scope.row.created}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="log_type" width="160">
          <template slot-scope="scope">
            <div :class="logIsEllipsis(scope.row)">
              {{ purchaseItemLogType[scope.row.log_type] || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark">
          <template slot-scope="scope">
            <div :class="logIsEllipsis(scope.row)">
              {{ scope.row.remark}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="120" prop="operator.realname">
          <template slot-scope="scope">
            <div :class="logIsEllipsis(scope.row)">
              {{ scope.row.operator && scope.row.operator.realname }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :visible.sync="itemDetail.isShow"
      :before-close="handleCloseItemDetail"
      :title="itemDetail.detail.item_code + ' / ' + itemDetail.detail.item_name + ' 采购商品信息'"
      width="600px"
      append-to-body
    >
      <el-form label-position="left" label-width="100px" style="padding: 0 20px; margin-top: -10px;">
        <el-form-item label="商品名称：">{{ itemDetail.detail.item_name }}</el-form-item>
        <el-form-item label="供应商：">{{ itemDetail.detail.supplier && itemDetail.detail.supplier.name }}</el-form-item>
        <el-form-item label="采购日期：">{{itemDetail.detail.purchase_date || '-'}}</el-form-item>
        <el-form-item label="创建人：">{{ itemDetail.detail.operator && itemDetail.detail.operator.realname }}</el-form-item>
        <el-form-item label="采购员：">{{ itemDetail.detail.buyer && itemDetail.detail.buyer.realname }}</el-form-item>
        <el-form-item label="采购总额：">{{ returnPrice(itemDetail.detail.total_price) }} 元</el-form-item>
        <el-form-item label="采购件数：">{{ itemDetail.detail.number }} 件</el-form-item>
        <el-form-item label="重量总计：" v-if="itemDetail.detail.item && itemDetail.detail.item.sale_unit === '斤'">{{ returnWeight(itemDetail.detail.weight) }} 斤</el-form-item>
        <el-form-item label="是否含框：">
          {{ itemDetail.detail.frame && itemDetail.detail.frame.code && itemDetail.detail.frame.price ?
          `含 ( ${returnPrice(itemDetail.detail.frame.price)} 元 / 件 )` : '不含'
          }}
        </el-form-item>
        <el-form-item label="单价：">{{ returnPrice(itemDetail.detail.unit_price) }} 元 / {{ itemDetail.detail.item && itemDetail.detail.item.sale_unit }}</el-form-item>
        <el-form-item label="付款日期：" v-if="itemDetail.detail.pay_date">{{ itemDetail.detail.pay_date }}</el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions} from 'vuex';
  import { Table, TableColumn, Form, FormItem, Button, Popover, Dialog, Message, Tag } from 'element-ui';
  import {TableOperate, ToPrice, ImagePreview} from '@/common';
  import { Purchase } from '@/service';
  import { DataHandle, Constant, Config } from '@/util';
  import { tableMixin } from '@/mixins';

  export default {
    name: "TablePurchaseFinance",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-button': Button,
      'el-popover': Popover,
      'el-dialog': Dialog,
      'el-tag': Tag,
      'my-image-preview': ImagePreview,
      'my-table-operate': TableOperate,
      'my-to-price': ToPrice
    },
    mixins: [tableMixin],
    props: {
      data: { type: Array, required: true },
      query: { type: Object, default: {} },
      stripe: { type: Boolean, default: true },
      'highlight-current-row': { type: Boolean, default: true },
      approveItem: { type: Function, required: true },
      page: { type: Number, required: true },
      pageSize: { type: Number, required: true },
      offsetHeight: { type: Number, required: true}
    },
    data() {
      return {
        tencentPath: Config.tencentPath,
        purchaseItemStatus: Constant.PURCHASE_ITEM_STATUS,
        purchaseItemLogType: Constant.PURCHASE_ITEM_LOG_TYPE,
        // 审核日志
        approveLog: {
          isShow: false,
          items: []
        },
        itemDetail: {
          isShow: false,
          detail: {
            item: {}
          }
        },
        statusTagType: {
          init: 'warning',
          first_checked: 'primary',
          first_declined: 'info',
          second_checked: 'regular',
          second_declined: 'info',
          declined: 'info'
        },
        logCurrentRow: {}
      }
    },
    computed: {
      ...mapGetters({
        auth: 'globalAuth',
        windowHeight: 'windowHeight'
      })
    },
    methods: {
      // 判断当前行是否可以被选中
      selectable(row) {
        return row.status === 'first_checked';
      },
      logCellMouseEnter(row, column, cell, event) {
        if(row.id !== this.$data.logCurrentRow.id) {
          this.$data.logCurrentRow = row;
        }
      },

      logCellMouseLeave(row, column, cell, event) {
        this.$data.logCurrentRow = {};
      },

      logIsEllipsis(row) {
        return row.id != this.$data.logCurrentRow.id ? 'ellipsis' : ''
      },

      indexMethod(index) {
        return (this.$props.page - 1) * this.$props.pageSize + index + 1;
      },

      async handleShowItemDetail(item) {
        let res = await Purchase.itemDetail({id: item.id});

        if (res.code === 0) {
          this.$data.itemDetail.detail = Object.assign({}, item, res.data);
          this.$data.itemDetail.isShow = true;
        } else {
          Message.error(res.message);
        }
      },

      handleCloseItemDetail() {
        this.$data.itemDetail.detail = {};
        this.$data.itemDetail.isShow = false;
      },

      async handleApproveLog(id) {
        this.$data.approveLog.isShow = true;
        let res = await Purchase.itemApproveLog({id});
        if (res.code === 0) {
          this.$data.approveLog.items = res.data;
        }
      },

      handleCloseApproveLog() {
        this.$data.approveLog.items = [];
        this.$data.approveLog.isShow = false;
      },

      handleApproveItem(items) {
        this.$props.approveItem(items);
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import './table.scss';
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

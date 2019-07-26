import { DataHandle } from '@/util';

// 表格宽度： 860 / 830（带全选）

export default {
  data() {
    return {
      province: this.$province,
      auth: this.$auth,
      rowIdentifier: 'id',
      currentRow: {},
      currentRowLocked: false,
      clickedRow: {}
    }
  },
  methods: {
    /**
     * 当鼠标在表格中移动时，解除当前行的锁定状态。 如果仅仅是在操作按钮上移动，则不做响应
     */
    handleTableMouseMove(e) {
      if (e.target.alt === 'operate-icon') {
        return;
      }
      if (this.$data.currentRowLocked) {
        this.$data.currentRowLocked = false;
      }
    },

    /**
     * 当鼠标移动进入新的单元格时，并且当前行不是锁定状态。则设置新的当前行
     */
    cellMouseEnter(row, column, cell, event) {
      if(row[this.$data.rowIdentifier] !== this.$data.currentRow[this.$data.rowIdentifier] && !this.$data.currentRowLocked) {
        this.$data.currentRow = row;
      }
    },

    /**
     * 当鼠标离开单元格，并且当前行不是锁定状态，则清空当前行
     */
    cellMouseLeave(row, column, cell, event) {
      if (!this.$data.currentRowLocked) {
        this.$data.currentRow = {};
      }
    },

    /**
     * 展开操作弹层时，锁定当前行。
     */
    handleCommandVisible(visible) {
      this.$data.currentRowLocked = visible;
    },

    /**
     * 如果点击了操作选项，则锁定当前行。并且设置table的当前行
     */
    handleCommandClick(row) {
      this.$data.currentRowLocked = true;
      this.$data.clickedRow = row;
      // this.$refs['singleTable'] && this.$refs['singleTable'].setCurrentRow(row);
    },

    /**
     * 判断单元格是否缩略显示文本
     */
    isEllipsis(row) {
      return row[this.$data.rowIdentifier] != this.$data.currentRow[this.$data.rowIdentifier] ? 'ellipsis' : ''
    },

    /**
     * 斑马线的背景颜色样式
     */
    highlightRowClassName({row, rowIndex}) {
      if (rowIndex % 2 == 0) {
        return 'stripe-row';
      } else if (rowIndex % 2 != 0) {
        return 'default-row'
      }
      return '';
    },


    returnDateFormat(dateStr) {
      return DataHandle.returnDateFormat(dateStr, 'yyyy-MM-dd');
    },

    returnDate(dateStr) {
      return DataHandle.returnDateFormat(dateStr, 'yyyy-MM-dd')
    },
    returnTime(dateStr) {
      return DataHandle.returnDateFormat(dateStr, 'HH:mm:ss')
    },

    //返回价格
    returnPrice(price){
      return DataHandle.returnPrice(price);
    },
    //返回重量
    returnWeight(weight){
      return DataHandle.returnWeight(weight);
    },

    //处理重量
    handleWeight(data){
      return DataHandle.handleWeight(data);
    },

    // 返回折扣
    returnDiscount(discount) {
      return DataHandle.returnDiscount(discount);
    },

  }
}

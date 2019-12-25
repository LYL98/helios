import baseMixin from '@/container/base.mixin';
import { Constant, Method, Config, Http } from '@/util';
import { TableOperate } from '@/common';
import SettingColumnTitle from './SettingColumnTitle';
import Pagination from './Pagination';

// 表格宽度： 860 / 830（带全选）

export default {
  mixins: [baseMixin],
  components: {
    'my-table-operate': TableOperate,
    'setting-column-title': SettingColumnTitle,
    'pagination': Pagination
  },
  data() {
    return {
      rowIdentifier: 'id',
      currentRow: {},
      currentRowLocked: false,
      clickedRow: {},
      tableShowColumn: [],
      multipleSelection: [],
      isExpand: false, //是否展开搜索区
      query: {
        page: 1,
        page_size: Constant.PAGE_SIZE
      },
      dataItem: {
        items: [],
        num: 0
      },
    }
  },
  created() {
    this.isShowTableTitle(); //显示表头
  },
  methods: {
    //展开隐藏搜索(外部重写)
    onExpandChange(isExpand){
      //this.$data.isExpand = isExpand;
    },
    //返回表格序号
    indexMethod(index) {
      let { query } = this;
      return (query.page - 1) * query.page_size + index + 1;
    },
    //选择
    handleSelectionChange(val) {
      this.$data.multipleSelection = val;
    },
    //显示新增修改(新增组件，数据, add,edit,detail)
    handleShowAddEdit(pageComponents, data, type){
      let pc = this.getPageComponents(pageComponents);
      pc.showAddEdit(data, type);
    },
    //显示详情
    handleShowDetail(pageComponents, data){
      let pc = this.getPageComponents(pageComponents);
      pc.showDetail(data);
    },
    //显示form
    handleShowForm(pageComponents, data){
      let pc = this.getPageComponents(pageComponents);
      pc.showForm(data);
    },
    //删除
    handleDelete(data){
      this.$messageBox.confirm(`您确认要删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteData(data);
      }).catch(() => {
        //console.log('取消');
      });
    },
    // 设置每页显示数量
    changePageSize(pageSize) {
      this.$data.query.page_size = pageSize;
      this.$data.query.page = 1;
      this.getData(this.query);
    },
    //翻页
    changePage(page) {
      this.$data.query.page = page;
      this.getData(this.query);
      window.scrollTo(0, 0);
    },
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
      return row[this.$data.rowIdentifier] != this.$data.currentRow[this.$data.rowIdentifier] ? 'add-dot' : ''
    },

    //是否显示表头哪一项
    isShowTableTitle() {
      let { tableName, tableColumn, tableShowColumn } = this;
      if (tableName) {
        let ts = Method.getPageSetting('Table'); //获取页面设置
        //添加默认
        let fun = ()=>{
          tableColumn.forEach(item => {
            if(item.isShow) tableShowColumn.push(item.key);
          });
        }

        if (ts && Object.keys(ts).length > 0 && ts[tableName]) {
          if (ts[tableName].columnTitle) {
            let tsct = ts[tableName].columnTitle;
            tableShowColumn = [];
            tableColumn.forEach(item => {
              if (tsct[item.key]) {
                item.isShow = true;
                tableShowColumn.push(item.key);
              } else {
                item.isShow = false;
              }
            });
          }else{
            fun();
          }
        }else{
          fun();
        }
        this.$data.tableColumn = tableColumn;
        this.$data.tableShowColumn = tableShowColumn;
      }
    },
    //改变表头
    changeTableColumn(value) {
      let { tableName } = this;
      this.$data.tableShowColumn = value;
      let dataTepm = {};
      value.forEach(item => {
        dataTepm[item] = true;
      });
      let ts = Method.getPageSetting('Table'); //获取页面设置
      if (ts[tableName] && ts[tableName].columnTitle) {
        ts[tableName].columnTitle = dataTepm;
      } else {
        ts[tableName] = {
          columnTitle: dataTepm
        };
      }
      Method.setPageSetting('Table', ts);
      this.isShowTableTitle();//重新刷新表头
    },
    //列表导出
    async handleExport(apiStr, query) {
      let api = Config.api[apiStr];
      //判断是否可导出
      this.$loading({ isShow: true });
      let res = await Http.get(`${api}_check`, query);
      if(res.code === 0){
        let queryStr = `${api}?`;
        for(let item in query){
          queryStr += `${item}=${query[item]}&`;
        }
        queryStr = queryStr.substring(0, queryStr.length - 1);
        window.open(queryStr);
      }else{
        this.$message({ title: '提示', message: res.message, type: 'error' });
      }
      this.$loading({ isShow: false });
    },
  }
}

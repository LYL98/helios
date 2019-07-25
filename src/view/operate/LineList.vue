<template>
  <div class="province-list">
    <!-- 头部start -->
    <div class="query">
      <el-row>
        <el-col :xl="8" :lg="10" :span="10">
          <my-query-item label="搜索">
            <div style="display: flex">
              <el-input
                size="small"
                placeholder="请输入线路名称、编号"
                class="query-item-input"
                clearable
                v-model="query.condition"
                @keyup.enter.native="changeQuery(query)"
                @clear="changeQuery(query)"
                ref="condition"
              />
              <el-button size="small" style="margin-left: 4px" type="primary" @click="changeQuery(query)" icon="el-icon-search"></el-button>
              <el-button size="small" type="primary" class="query-item-reset" plain @click="clearQuery">重置</el-button>
            </div>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <!-- 头部end -->
    <div class="operate" v-if="auth.isAdmin || auth.OperateLineAdd">
      <el-button @click="operateLineShowHideAddEdit({
          isShow: true
      })" size="mini" type="primary">新增
      </el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        style="width: 100%"
        :highlight-current-row="true"
        :height="windowHeight - offsetHeight"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod"/>
        <el-table-column prop="title" label="线路编号 / 名称" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.code }} / {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属省份" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{scope.row.province && scope.row.province.title}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="包含县域" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)" v-for="(item, index) in scope.row.citys" :key="index">
              {{item.title}}{{'（' + item.item_num + '件）'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="配送员" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
            <span v-for="(item, index) in scope.row.distributors" :key="index">
              {{item.realname}}{{index === scope.row.distributors.length-1 ? '' : ', '}}
            </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="item_num" label="线路总件数" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.item_num }}
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column prop="created" label="创建时间" width="100"/>-->
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '编辑',
                isDisplay: auth.isAdmin || auth.OperateLineEdit,
                command: () => operateLineShowHideAddEdit({ isShow: true, data: scope.row })
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.OperateLineDelete,
                command: () => deleteLine(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
    <div class="footer">
      <div class="table-pagination">
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
    <my-line-add-edit :callback="myCallBack"/>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import {
    Row,
    Col,
    Form,
    FormItem,
    Button,
    Input,
    Table,
    TableColumn,
    Tag,
    Pagination,
    RadioGroup,
    RadioButton,
    MessageBox
  } from 'element-ui';
  import {TableOperate, QueryItem} from '@/common';
  import {Config, Constant} from '@/util';
  import LineAddEdit from './LineAddEdit';
  import tableMixin from '@/container/table/table.mixin';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'LineList',
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-input': Input,
      'el-radio-group': RadioGroup,
      'el-radio-button': RadioButton,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'el-pagination': Pagination,
      'my-line-add-edit': LineAddEdit,
      'my-table-operate': TableOperate,
      'my-query-item': QueryItem,
    },
    mixins: [tableMixin, viewMixin],
    computed: mapGetters({
      dataItem: 'operateLineListDataItem',
      province: 'globalProvince'
    }),
    created() {
      let that = this;
      documentTitle('配送 - 线路规划');
      let {query, province} = that;
      if (province.code) {
        query.province_code = province.code;
        that.$data.query = query;
        that.operateLineList(query);
      }

      if (!this.auth.isAdmin && !this.auth.OperateLineAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE;
      }
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_OPERATE,
        query: {
          condition: '',
          province_code: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        },
        rowIdentifier: 'code'
      }
    },
    methods: {

      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },

      // 设置每页显示数量
      changePageSize(pageSize) {
        window.scrollTo(0, 0);
        this.query.page_size = pageSize;
        this.query.page = 1;
        this.operateLineList(this.query);
      },

      //翻页
      changePage(page) {
        window.scrollTo(0, 0);
        this.$data.query.page = page;
        this.operateLineList(this.query);
      },
      changeQuery() {
        this.query.page = 1;
        this.operateLineList(this.query);
      },
      //清除条件
      clearQuery() {
        this.$data.query = {
          condition: '',
          province_code: this.query.province_code,
          page_size: Constant.PAGE_SIZE,
          page: 1,
        };
        this.operateLineList(this.query);
        this.$refs['condition'].currentValue = '';
      },
      //组件回调
      myCallBack(res) {
        this.operateLineList(this.query);
      },
      //删除
      deleteLine(data) {
        let that = this;
        MessageBox.confirm(`您确认要删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.operateLineDelete({
            data: {
              code: data.code
            },
            callback: () => {
              that.operateLineList(that.query);
            }
          });
        })
          .catch(() => {
            //console.log('取消');
          });
      },
      ...mapActions(['operateLineList', 'operateLineDelete', 'operateLineShowHideAddEdit'])
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
  }
</style>

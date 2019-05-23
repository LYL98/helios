<template>
  <div>
    <div class="query">
      <el-row>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="所在仓">
            <my-select-city
              size="small"
              :isUseToQuery="true"
              :provinceCode="province.code"
              v-model="query.city_code"
              clearable
              placeholder="所在仓"
              @change="changeQuery"
            ></my-select-city>
          </my-query-item>
        </el-col>
        <el-col :xl="6" :lg="7" :span="7">
          <my-query-item label="门店状态">
            <my-button-group
              :options="{'全部': '', '未冻结': 0, '已冻结': 1}"
              v-model="query.is_freeze_header"
              @change="changeQuery"
            />
          </my-query-item>
        </el-col>
        <el-col :xl="8" :lg="10" :span="10">
          <my-query-item label="搜索">
            <div style="display: flex">
              <el-input
                size="small"
                class="query-item-input"
                clearable
                v-model="query.condition"
                placeholder="门店名称"
                @keyup.enter.native="changeQuery"
                @clear="changeQuery"
                ref="condition"
              />
              <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 2px"
                         @click="changeQuery"></el-button>
              <el-button type="primary" size="small" class="query-item-reset" plain @click="initQuery">重置</el-button>
            </div>
          </my-query-item>
        </el-col>
      </el-row>
    </div>

    <div class="operate" v-if="auth.isAdmin || auth.GroupHeadAdd">
      <el-button size="mini" type="primary" @click="handleAddItem">新增</el-button>
    </div>

    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="listItem.items"
        :row-class-name="highlightRowClassName"
        :height="windowHeight - offsetHeight"
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
        <el-table-column label="门店名称" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              <a class="title" href="javascript:void(0);" @click="handleShowItemDetail(scope.row)">{{ scope.row.title }}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="门店地址" prop="store_address" min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.address }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" prop="phone" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.phone }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所在仓" prop="city_title" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.city_title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="is_freeze_header" min-width="80">
          <template slot-scope="scope">
            <el-tag disable-transitions size="small" :type="scope.row.is_freeze_header ? 'regular' : 'info'" style="width: 66px; text-align: center;"
            >{{ scope.row.is_freeze_header ? '已冻结' : '未冻结' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: scope.row.is_freeze_header ? '解冻' : '冻结',
                  isDisplay: (auth.isAdmin || auth.GroupStoreFreeze),
                  command: () => groupStoreFreeze(scope.row, scope.$index)
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

  import { mapGetters } from 'vuex';
  import { Row, Col, Button, Input, Table, TableColumn, Tag, Pagination, MessageBox } from 'element-ui';
  import { ButtonGroup, QueryItem, SelectCity, TableOperate } from '@/common';
  import { Constant, Http, Config } from '@/util';
  import { Group } from "@/service";
  import { tableMixin } from '@/mixins';

  export default {
    name: "HeadList",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-input': Input,
      'el-button': Button,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'el-pagination': Pagination,
      'my-select-city': SelectCity,
      'my-button-group': ButtonGroup,
      'my-query-item': QueryItem,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    props: {
      itemAdd: { type: Function, require: true }, //新增
      getPageComponents: { type: Function, require: true }, //获取页面组件
    },
    computed: {
      ...mapGetters({
        auth: 'globalAuth',
        province: 'globalProvince',
        windowHeight: 'windowHeight'
      })
    },
    data() {
      return {
        query: {},
        listItem: {
          num: 0,
          items: []
        },
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
      }
    },
    created() {
      this.initQuery();
      if (this.auth.isAdmin || this.auth.GroupHeadAdd) {
        this.$data.offsetHeight = this.$data.offsetHeight + Constant.OFFSET_OPERATE;
      }
    },

    methods: {
      initQuery() {
        this.$data.query = {
          province_code: this.province.code,
          city_code: '',
          is_freeze_header: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        }
        this.headQuery();
      },
      changeQuery() {
        this.$data.query = Object.assign(this.$data.query, { page: 1 });
        this.headQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.headQuery();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.headQuery();
      },
      async headQuery() {
        let res = await Group.headQuery(this.$data.query);
        if (res.code === 0) {
          //console.log("当前行", this.$data.currentRow[this.$data.rowIdentifier]);
          this.$data.listItem = Object.assign(this.$data.listItem, {
            num: res.data.num,
            items: res.data.items
          });
        } else {
          this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
        }
      },

      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },

      //冻结解冻门店
      async groupStoreFreeze(data, index){
        let str = data.is_freeze_header ? '解冻' : '冻结';
        MessageBox.confirm(`确认${str}该门店?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.groupStoreFreeze, {
            store_id: data.id,
            is_freeze_header: !data.is_freeze_header
          });
          if(res.code === 0){
            this.$store.dispatch('message', {
              title: '提示',
              message: `已${str}`,
              type: 'success'
            });
            //更新页面数据
            this.$data.listItem.items[index].is_freeze_header = !data.is_freeze_header;
          }else{
            this.$store.dispatch('message', {
              title: '提示',
              message: res.message,
              type: 'error'
            });
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      //新增
      handleAddItem() {
        let com = this.$props.getPageComponents('HeadEdit');
        if(com){
          com.showAddEdit();
        }
      },

      //显示详情
      handleShowItemDetail(data){
        let com = this.$props.getPageComponents('HeadDetail');
        if(com){
          com.showDetail(data);
        }
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
    &:hover {
      font-weight: 600;
    }
  }
</style>

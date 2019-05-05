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
          <my-query-item label="团长状态">
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
                placeholder="门店、团长名称"
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
      <el-button
        size="mini"
        type="primary"
        @click="handleAddItem"
      >
        新增
      </el-button>
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
        <el-table-column label="团长名称" prop="realname" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.realname }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="门店名称" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.store && scope.row.store.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="门店地址" prop="store_address" min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.store && scope.row.store.address }}
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
        <!--<el-table-column label="售出件数" prop="sale_num" min-width="80">-->
          <!--<template slot-scope="scope">-->
            <!--<div :class="isEllipsis(scope.row)">-->
              <!--{{ scope.row.sale_num || '-' }}-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="参团人次" prop="person_time" min-width="80">-->
          <!--<template slot-scope="scope">-->
            <!--<div :class="isEllipsis(scope.row)">-->
              <!--{{ scope.row.person_time || '-' }}-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
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
                  title: '冻结',
                  isDisplay: (auth.isAdmin || auth.GroupHeadFreeze) && !scope.row.is_freeze_header,
                  command: () => freezeItem(scope.row.id)
                },
                {
                  title: '解冻',
                  isDisplay: (auth.isAdmin || auth.GroupHeadUnFreeze) && scope.row.is_freeze_header,
                  command: () => unFreezeItem(scope.row.id)
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
  import { Constant } from '@/util';
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
      itemAdd: { type: Function, require: true }
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
          console.log("当前行", this.$data.currentRow[this.$data.rowIdentifier]);
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

      freezeItem(id) {
        MessageBox.confirm('确认冻结该团长?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Group.headFreeze({header_id: id});
          if (res.code === 0) {
            this.headQuery();
            this.$store.dispatch('message', {title: '提示', message: '冻结成功', type: 'success'});
          } else {
            this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });

      },

      async unFreezeItem(id) {
        MessageBox.confirm('确认解冻该团长?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Group.headUnFreeze({header_id: id});
          if (res.code === 0) {
            this.headQuery();
            this.$store.dispatch('message', {title: '提示', message: '解冻成功', type: 'success'});
          } else {
            this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });

      },

      handleAddItem() {
        this.$props.itemAdd();
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>

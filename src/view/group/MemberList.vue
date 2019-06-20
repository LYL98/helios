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
          <my-query-item label="团员状态">
            <my-button-group
              :options="{'全部': '', '未冻结': 0, '已冻结': 1}"
              v-model="query.is_freeze"
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
                placeholder="微信昵称、门店、团员名称"
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

    <div class="operate" v-if="auth.isAdmin || auth.GroupMemberExport">
      <el-button
        plain
        size="mini"
        type="primary"
        @click="handleMemberExport"
      >
        导出团员列表
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
        <el-table-column label="头像" prop="realname" min-width="60">
          <template slot-scope="scope">
            <div style="display: flex; align-items: center;">
              <my-image-preview>
                <img
                  style="border-radius: 50%"
                  height="32"
                  width="32"
                  :src="scope.row.avatar ? tencentPath + scope.row.avatar + '_min200x200' : defaultAvatar" alt=""
                  onerror="this.style.display='none'"
                >
              </my-image-preview>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="微信昵称" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.nickname || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属门店" prop="store_title" min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.store_title || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所在仓" prop="phone" min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.city_title || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="团员名" prop="realname" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.linkman || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" prop="phone" min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.phone || '-' }}
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column label="参团次数" prop="buy_time" min-width="80">-->
          <!--<template slot-scope="scope">-->
            <!--<div :class="isEllipsis(scope.row)">-->
              <!--{{ scope.row.buy_time || '-' }}-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="已消费" prop="total_pay" min-width="80">-->
          <!--<template slot-scope="scope">-->
            <!--<div :class="isEllipsis(scope.row)">-->
              <!--{{ scope.row.total_pay ? '￥' : '' }}{{ returnPrice(scope.row.total_pay) || '-' }}-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="状态" prop="is_freeze_header" min-width="80">
          <template slot-scope="scope">
            <el-tag disable-transitions size="small" :type="scope.row.is_freeze ? 'regular' : 'info'" style="width: 66px; text-align: center;"
            >{{ scope.row.is_freeze ? '已冻结' : '未冻结' }}</el-tag>
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
                  isDisplay: (auth.isAdmin || auth.GroupMemberFreeze) && !scope.row.is_freeze,
                  command: () => freezeItem(scope.row.id)
                },
                {
                  title: '解冻',
                  isDisplay: (auth.isAdmin || auth.GroupMemberUnFreeze) && scope.row.is_freeze,
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
  import { ButtonGroup, QueryItem, SelectCity, TableOperate, ImagePreview } from '@/common';
  import { Constant, Config, DataHandle, Http } from '@/util';
  import { Group } from "@/service";
  import { tableMixin } from "@/mixins";

  export default {
    name: "MemberList",
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
      'my-table-operate': TableOperate,
      'my-image-preview': ImagePreview
    },
    mixins: [tableMixin],
    computed: {
      ...mapGetters({
        auth: 'globalAuth',
        province: 'globalProvince',
        windowHeight: 'windowHeight'
      })
    },
    data() {
      return {
        tencentPath: Config.tencentPath,
        defaultAvatar: Constant.IMGS.defaultAvatar,
        query: {},
        listItem: {
          num: 0,
          items: []
        },
        currentRow: {},
        currentRowLocked: false,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_PAGINATION + Constant.OFFSET_QUERY_CLOSE
      }
    },
    created() {
      this.initQuery();
      if (this.auth.isAdmin || this.auth.GroupMemberExport) {
        this.$data.offsetHeight = this.$data.offsetHeight + Constant.OFFSET_OPERATE;
      }
    },

    methods: {
      initQuery() {
        this.$data.query = {
          province_code: this.province.code,
          city_code: '',
          is_freeze: '',
          condition: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        }
        this.memberQuery();
      },
      changeQuery() {
        this.$data.query = Object.assign(this.$data.query, { page: 1 });
        this.memberQuery();
      },

      changePage(page) {
        this.$data.query.page = page;
        this.memberQuery();
      },
      changePageSize(size) {
        this.$data.query.page = 1;
        this.$data.query.page_size = size;
        this.memberQuery();
      },
      async memberQuery() {
        let res = await Group.memberQuery(this.$data.query);
        if (res.code === 0) {
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

      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },

      freezeItem(id) {
        MessageBox.confirm('确认冻结该团员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Group.memberFreeze({gb_member_id: id});
          if (res.code === 0) {
            this.memberQuery();
            this.$store.dispatch('message', {title: '提示', message: '冻结成功', type: 'success'});
          } else {
            this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });

      },

      async unFreezeItem(id) {
        MessageBox.confirm('确认解冻该团员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Group.memberUnFreeze({gb_member_id: id});
          if (res.code === 0) {
            this.memberQuery();
            this.$store.dispatch('message', {title: '提示', message: '解冻成功', type: 'success'});
          } else {
            this.$store.dispatch('message', {title: '提示', message: res.message, type: 'error'});
          }
        }).catch(() => {
          // console.log('取消');
        });

      },

      //导出
      async handleMemberExport() {
        let api = Config.api.groupMemberExport;
        let { city_code, is_freeze, condition } = this.query;
        let query = { city_code, is_freeze, condition };
        //判断是否可导出
        this.$store.dispatch('loading', {isShow: true, isWhole: true});
        let res = await Http.get(`${api}_check?province_code=${this.province.code}`, query);
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.province.code}`;
          for (let item in query) {
            queryStr += `&${item}=${query[item]}`
          }
          window.open(queryStr);
        }else{
          this.$store.dispatch('message', { title: '提示', message: res.message, type: 'error' });
        }
        this.$store.dispatch('loading', {isShow: false});
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

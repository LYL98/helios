<template>
  <div class="user-list">
    <!-- 头部start -->
    <div class="query">
      <my-collapse-query @expandChange="onExpandChange">
        <template slot="header">
          <el-row>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item label="角色">
                <my-search-role size="small" style="width: 210px;" @onSelectRole="onSelectRole" :isUseToQuery="true" ref="mySearchRole"></my-search-role>
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item label="职务">
                <el-select v-model="query.post" placeholder="请选择" size="small" class="query-item-select" @change="loadSystemOperatorFirstPage()">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="业务员" value="salesman"></el-option>
                  <el-option label="采购员" value="buyer"></el-option>
                  <el-option label="配送员" value="distributor"></el-option>
                  <el-option label="其他" value="other"></el-option>
                </el-select>
              </my-query-item>
            </el-col>
            <el-col :xl="8" :lg="10" :span="10">
              <my-query-item label="搜索">
                <div style="display: flex">
                  <el-input
                    size="small"
                    placeholder="请输入用户名、手机号"
                    class="query-item-input"
                    v-model="query.condition"
                    clearable
                    @keyup.enter.native="loadSystemOperatorFirstPage"
                    @clear="loadSystemOperatorFirstPage"
                    ref="condition"
                  />
                  <el-button size="small" type="primary" @click="loadSystemOperatorFirstPage()" icon="el-icon-search" style="margin-left: 4px"></el-button>
                  <el-button v-if="!isExpand" size="small" type="primary" plain @click="clearQuery" class="query-item-reset">重置</el-button>
                </div>
              </my-query-item>
            </el-col>
          </el-row>
        </template>
        <template slot="expand">
          <el-row style="margin-top: 16px">
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item label="权限级别">
                <el-select v-model="query.data_level" placeholder="请选择" class="query-item-select" size="small" @change="loadSystemOperatorFirstPage()">
                  <el-option label="全部" value="">全部</el-option>
                  <el-option label="全国" :value="1">全国</el-option>
                  <el-option label="省级" :value="2"></el-option>
                  <el-option label="片区" :value="3"></el-option>
                  <el-option label="县域" :value="4"></el-option>
                  <el-option label="线路" :value="5"></el-option>
                </el-select>
              </my-query-item>
            </el-col>
            <el-col :xl="6" :lg="7" :span="7">
              <my-query-item label="状态">
                <my-button-group
                  :options="{'全部': '', '已冻结': 1, '未冻结': 0}"
                  v-model="query.is_freeze"
                  @change="loadSystemOperatorFirstPage"
                  size="small"
                />
                <el-button size="small" type="primary" plain @click="clearQuery" class="query-item-reset">重置</el-button>
              </my-query-item>
            </el-col>
          </el-row>
        </template>
      </my-collapse-query>
    </div>
    <!-- 头部end -->
    <div class="operate" v-if="auth.isAdmin || auth.SystemOperatorAdd">
      <el-button @click="systemOperatorShowHideAddEdit({
          isShow: true
      })" size="mini" type="primary">新增
      </el-button>
    </div>
    <!-- 表格start -->
    <div class="statistics-table-list-container">
      <div @mousemove="handleTableMouseMove">
        <el-table
          :data="dataItem.items"
          :row-class-name="highlightRowClassName"
          style="width: 100%"
          :height="windowHeight - offsetHeight"
          :highlight-current-row="true"
          @cell-mouse-enter="cellMouseEnter"
          @cell-mouse-leave="cellMouseLeave"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod">
          </el-table-column>
          <el-table-column label="姓名" prop="realname" min-width="130">
            <template slot-scope="scope">
              <a
                href="javascript:void(0);"
                :class="`title ${isEllipsis(scope.row)}`"
                @click.prevent="showOperatorDetail(scope.row)"
              >{{scope.row.realname}}</a>
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="phone" min-width="120"></el-table-column>
          <el-table-column label="职务" width="140">
            <template slot-scope="scope">
              <div>{{operatorPost[scope.row.post] || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="roles" label="角色" min-width="120">
            <template slot-scope="scope">
              <div :class="isEllipsis(scope.row)">{{formatRoles(scope.row.roles)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="data_level" label="权限级别" min-width="120">
            <template slot-scope="scope">
              <div :class="isEllipsis(scope.row)">{{formatDataLevel(scope.row.data_level)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" min-width="100">
            <template slot-scope="scope">
              <el-tag disable-transitions  size="mini" type="info" v-if="scope.row.is_freeze">已冻结</el-tag>
              <el-tag disable-transitions  size="mini" type="regular" v-else>正常</el-tag>
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
                      isDisplay: (auth.isAdmin || auth.SystemOperatorFreeze) && !scope.row.is_freeze,
                      command: () => freezeData(scope.row)
                    },
                    {
                      title: '解冻',
                      isDisplay: (auth.isAdmin || auth.SystemOperatorUnFreeze) && scope.row.is_freeze,
                      command: () => unFreezeData(scope.row)
                    },
                    {
                      title: '修改',
                      isDisplay: auth.isAdmin || auth.SystemOperatorEdit,
                      command: () => systemOperatorShowHideAddEdit({ isShow: true, data: scope.row })
                    },
                    {
                      title: '重置密码',
                      isDisplay: auth.isAdmin || auth.SystemOperatorPasswordReset,
                      command: () => systemOperatorShowHideResetPwd({ isShow: true, data: scope.row })
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
    </div>

    <el-dialog :title="operatorDetail.realname + '详情'" :visible="isShowDetail" width="600px" :before-close="cancelDialog">
      <el-form class="custom-form-detail" label-position="right" label-width="110px" style="width: 500px;">
        <el-form-item label="头像">
          <div class="img-div" style="flex: 1;">
            <my-image-preview><img style="width: 64px; height: 64px; margin-right: 10px" v-for="(item, index) in operatorDetail.images" :key="index" :src="tencentPath + item + '_min200x200'" alt=""/></my-image-preview>
          </div>
        </el-form-item>
        <el-form-item label="工号" prop="rank">
          <span class="detail">{{operatorDetail.employee_no}}</span>
        </el-form-item>
        <el-form-item label="备注" prop="rank">
          <span class="detail">{{operatorDetail.remark}}</span>
        </el-form-item>
        <el-form-item label="创建时间" prop="rank">
          <span class="detail">{{operatorDetail.created}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>

    <my-operator-add-edit :callback="myCallBack"/>
    <my-operator-reset-pwd/>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import {Row, Col, Button, Input, Table, Select, Option, TableColumn, Tag, Pagination, RadioGroup, RadioButton, MessageBox, Dialog, Form, FormItem} from 'element-ui';
  import {TableOperate, QueryItem, CollapseQuery, ButtonGroup} from '@/common';
  import {Config, Constant} from '@/util';
  import OperatorAddEdit from './OperatorAddEdit';
  import OperatorResetPwd from './OperatorResetPwd';
  import {SearchRole} from '@/container';
  import { ImagePreview } from  '@/common'
  import {DataHandle} from "../../util";
  import tableMixin from '@/container/table/table.mixin';
  import viewMixin from '@/view/view.mixin';
  export default {
    name: 'operatorList',
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-input': Input,
      'el-radio-group': RadioGroup,
      'el-radio-button': RadioButton,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'el-tag': Tag,
      'el-select': Select,
      'el-option': Option,
      'el-dialog': Dialog,
      'el-form': Form,
      'el-form-item': FormItem,
      'my-operator-add-edit': OperatorAddEdit,
      'my-operator-reset-pwd': OperatorResetPwd,
      'my-button-group': ButtonGroup,
      'my-table-operate': TableOperate,
      'my-search-role': SearchRole,
      'my-query-item': QueryItem,
      'my-collapse-query': CollapseQuery,
      'my-image-preview': ImagePreview,
    },
    mixins: [tableMixin, viewMixin],
    created() {
      let that = this;
      documentTitle("设置 - 运营人员列表");
      let {province, query} = that;
      if (province.code) {
        query.province_code = province.code;
        that.$data.query = query;
        that.systemOperatorList(query);
      }
    },
    computed: mapGetters({
      dataItem: 'systemOperatorListDataItem'
    }),
    data() {
      return {
        tencentPath: Config.tencentPath,
        defaultAvatar: Constant.IMGS.defaultAvatar,
        gender: Constant.USER_GENDER,
        source: Constant.USER_SOURCE,
        operatorPost: Constant.OPERATOR_POST,
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION + Constant.OFFSET_OPERATE,
        query: {
          province_code: '',
          condition: '',
          is_freeze: '',
          post: '',
          data_level: '',
          role_id: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        },
        isExpand: false,
        isShowDetail: false,
        operatorDetail: {}
      }
    },
    methods: {

      formatRoles(roles) {
        return roles.toString();
      },

      formatDataLevel(dataLevel) {
        return DataHandle.returnDataLevel(dataLevel);
      },

      showOperatorDetail(operator) {
        this.isShowDetail = true;
        operator.images = [operator.avatar];
        this.operatorDetail = operator;
      },

      cancelDialog() {
        this.isShowDetail = false;
        this.operatorDetail = {};
      },

      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },
      onExpandChange(isExpand) {
        if (isExpand) {
          this.offsetHeight += Constant.QUERY_OFFSET_LINE_HEIGHT;
        } else {
          this.offsetHeight -= Constant.QUERY_OFFSET_LINE_HEIGHT;
        }
        this.isExpand = isExpand;
      },
      onSelectRole(item) {
        this.query.role_id = item.id;
        this.loadSystemOperatorFirstPage()
      },
      //设置分页大小
      changePageSize(pageSize) {
        window.scrollTo(0, 0);
        this.$data.query.page_size = pageSize;
        this.loadSystemOperatorFirstPage()
      },
      //翻页
      changePage(page) {
        window.scrollTo(0, 0);
        this.$data.query.page = page;
        this.systemOperatorList(this.query);
      },
      //清除条件
      clearQuery() {
        this.$data.query = {
          condition: '',
          is_freeze: '',
          post: '',
          data_level: '',
          role_id: '',
          page_size: Constant.PAGE_SIZE,
          page: 1,
        };
        this.systemOperatorList(this.query);
        this.$refs.mySearchRole.clear();
        this.$refs['condition'].currentValue = '';
      },
      loadSystemOperatorFirstPage() {
        this.query.page = 1;
        this.systemOperatorList(this.query);
      },
      //类型改变
      isFreezeChange(v) {
        this.systemOperatorList(this.query);
      },
      //组件回调
      myCallBack(res) {
        this.systemOperatorList(this.query);
      },
      //冻结
      freezeData(data) {
        let that = this;
        MessageBox.confirm(`您确认要冻结？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.systemOperatorFreeze({
            data: {
              id: data.id
            },
            callback: () => {
              that.systemOperatorList(that.query);
            }
          });
        })
          .catch(() => {
            //console.log('取消');
          });
      },
      //解冻
      unFreezeData(data) {
        let that = this;
        MessageBox.confirm(`您确认要解冻？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.systemOperatorUnFreeze({
            data: {
              id: data.id
            },
            callback: () => {
              that.systemOperatorList(that.query);
            }
          });
        })
          .catch(() => {
            //console.log('取消');
          });
      },
      ...mapActions([
        'systemOperatorList',
        'systemOperatorFreeze',
        'systemOperatorUnFreeze',
        'systemOperatorShowHideAddEdit',
        'systemListShowHideResetPwd',
        'systemOperatorShowHideResetPwd'
      ])
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
  }

  .action {
    display: flex;

    li + li {
      margin-left: 10px;
    }

    a {
      font-size: 12px;
      text-decoration: underline;
    }

    a:hover {
      font-weight: 900;
    }

  }
  .title {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .title:hover {
    font-weight: 600;
  }
  .detail{
    color: #5A5D64;
    font-size: 14px
  }
</style>

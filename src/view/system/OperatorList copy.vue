<template>
  <div>
    
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

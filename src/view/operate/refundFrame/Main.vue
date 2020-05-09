<template>
  <sub-menu>
    <div class="container-query">
      <el-row :gutter="32">
        <el-col :span="7">
          <my-query-item label="区域">
            <global-province type="select" isRequired @change="selectProvince"/>
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="县域">
            <my-select-city
              clearable
              size="small"
              placeholder="县域"
              v-model="query.city_id"
              :provinceCode="query.province_code"
              @change="selectByCondition"
            />
          </my-query-item>
        </el-col>
        <el-col :span="10">
          <my-query-item label="搜索">
            <query-search-input
              size="small"
              placeholder="门店名称/电话"
              v-model="query.store_title"
              @search="selectByCondition"
              @reset="clearQueryCondition"
            />
          </my-query-item>
        </el-col>
      </el-row>
      <el-row :gutter="32" style="margin-top: 16px;">
        <el-col :span="7">
          <my-query-item label="线路">
            <my-select-line
              size="small"
              clearable
              :provinceCode="query.province_code"
              v-model="query.line_id"
              @change="selectByCondition"
            />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="录入时间">
            <el-date-picker
              size="small"
              v-model="pickerValue"
              type="daterange"
              align="right"
              value-format="yyyy-MM-dd"
              unlink-panels
              :picker-options="fixDateOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changePicker"
              style="width: 100%;"
            />
          </my-query-item>
        </el-col>
        <el-col :span="7">
          <my-query-item label="审核状态">
            <el-select v-model="query.status" size="small" clearable @change="selectByCondition" style="width: 100%;">
              <el-option label="全部" value=""></el-option>
              <el-option label="未审核" value="init"></el-option>
              <el-option label="审核通过" value="checked"></el-option>
              <el-option label="驳回" value="reject"></el-option>
            </el-select>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <div class="container-table">
      <div class="table-top" v-if="auth.isAdmin || auth.OperateRefundFrameApprove || auth.OperateRefundFrameExport || auth.OperateRefundStoreAdd">
        <div class="left">
          <el-button
            v-if="auth.isAdmin || auth.OperateRefundFrameApprove"
            @click="handleMultipleApprove"
            size="mini"
            type="primary"
            :disabled="multipleSelection.length <= 0"
          >批量审核
          </el-button>
        </div>
        <div class="right">
          <el-button
            v-if="auth.isAdmin || auth.OperateRefundFrameExport"
            @click.native="() => {returnFrameListExport();}"
            size="mini"
            type="primary"
            plain
          >导出退筐列表
          </el-button>
          <el-button
            v-if="auth.isAdmin || auth.OperateRefundStoreAdd"
            @click="showDialog = true"
            size="mini"
            type="primary"
          >新增
          </el-button>
        </div>
      </div>
      <div class="table-conter">
        <el-table
          class="list-table my-table-float"
          :data="listItem.items"
          :row-class-name="highlightRowClassName"
          :highlight-current-row="true"
          @selection-change="handleSelectionChange"
          :row-key="rowIdentifier"
          :current-row-key="clickedRow[rowIdentifier]"
        >
          <el-table-column
            type="selection"
            :selectable="selectable"
            width="45">
          </el-table-column>
          <el-table-column type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod">
          </el-table-column>
          <el-table-column label="门店" prop="store_title" min-width="100">
            <template slot-scope="scope">
              <div>
                {{ scope.row.store_title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="退筐" prop="return_num" min-width="80">
            <template slot-scope="scope">
              <div>
                {{ scope.row.return_num || '-' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="退筐金额" prop="return_amount" min-width="80">
            <template slot-scope="scope">
              <div>
                {{ scope.row.return_amount == 0 ? '' : '￥' }}{{ scope.row.return_amount == 0 ? '-' : returnPrice(scope.row.return_amount) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="录入员" prop="opt_name" min-width="80">
            <template slot-scope="scope">
              <div>
                {{ scope.row.opt_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="审核人" prop="auditor_name" min-width="80">
            <template slot-scope="scope">
              <div>
                {{ scope.row.auditor_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" min-width="120">
            <template slot-scope="scope">
              <div>
                {{ scope.row.remark || '-' }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" min-width="90">
            <template slot-scope="scope">
              <el-tag style="width: 66px; text-align: center;" disable-transitions size="small" :type="scope.row.status === 'init' ? 'primary' : scope.row.status === 'checked' ? 'regular' : 'info'">
                {{ refundFrameStatus[scope.row.status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="录入时间" prop="created" min-width="100">
            <template slot-scope="scope">
              <div>{{returnDate(scope.row.created)}}</div>
              <div>{{returnTime(scope.row.created)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" prop="done" min-width="100">
            <template slot-scope="scope">
              <div>{{returnDate(scope.row.done)}}</div>
              <div>{{returnTime(scope.row.done)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <my-table-operate
                @command-click="handleCommandClick(scope.row)"
                :list="[
                  {
                    title: '审核通过',
                    isDisplay: (auth.isAdmin || auth.OperateRefundFrameApprove) && scope.row.status === 'init',
                    command: () => affirmApprove(scope.row)
                  },
                  {
                    title: '驳回',
                    isDisplay: (auth.isAdmin || auth.OperateRefundFrameApprove) && scope.row.status === 'init',
                    command: () => affirmTurnDown(scope.row)
                  }
                ]"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="footer">
        <div style="margin-left: 20px; display: flex; align-items: center;" v-if="multipleSelection.length > 0">
          <span>总退筐个数：{{ multipleReturnNum }}</span>
          <span style="margin-left: 20px;">总退还金额：&yen;{{ returnPrice(multipleReturnAmount) }}</span>
        </div>
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

    <el-dialog title="新增退筐门店" :close-on-click-modal="false" :visible.sync="showDialog" width="1200px" append-to-body>
      <refund-add-store
        v-if="showDialog"
        :closeDialog="() => { showDialog = false}"
        :callback="listQuery"
      />
    </el-dialog>

  </sub-menu>
</template>

<script>
  import { Row, Col, Table, TableColumn, Popover, Pagination, Button, Input, Select, Option, DatePicker, Dialog, Tag, MessageBox, Message } from 'element-ui';
  import { SelectOption, QueryItem, TableOperate, OmissionText, QuerySearchInput } from '@/common';
  import { GlobalProvince, SelectLine, SelectCity } from '@/component';
  import { Config, Constant, DataHandle, Http } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';
  import RefundAddStore from './RefundAddStore';
  import mainMixin from '@/share/mixin/main.mixin';

  export default {
    name: "Main",
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-popover': Popover,
      'el-pagination': Pagination,
      'el-button': Button,
      'el-input': Input,
      'el-select': Select,
      'el-option': Option,
      'el-dialog': Dialog,
      'el-tag': Tag,
      'el-date-picker': DatePicker,
      'my-select-line': SelectLine,
      'my-select-city': SelectCity,
      'select-option': SelectOption,
      'my-query-item': QueryItem,
      'my-omission-text': OmissionText,
      'refund-add-store': RefundAddStore,
      'my-table-operate': TableOperate,
      'query-search-input': QuerySearchInput,
      'global-province': GlobalProvince
    },
    mixins: [tableMixin, mainMixin],
    computed: {
      multipleReturnNum: {
        get() {
          return this.multipleSelection.reduce((accumulator, currentValue) => accumulator + Number(currentValue.return_num), 0);
        }
      },
      multipleReturnAmount: {
        get() {
          return this.multipleSelection.reduce((accumulator, currentValue) => accumulator + Number(currentValue.return_amount), 0);
        }
      }
    },
    data() {
      return {
        pickerValue: null,
        query: {
          province_code: '',
          line_id: '',
          city_id: '',
          store_title: '',
          status: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        },
        refundFrameStatus: Constant.OPERATE_REFUND_FRAME_STATUS,
        listItem: [],
        multipleSelection: [],  // 多选列表
        showDialog: false, // 新增退筐门店弹窗
        /*最近30天（以当天作为结尾，往前30天）
         本周
         上周
         本月（以本月作为选择）
         上月（以当前所在月的上一个月作为选择）
         本年
         上一年*/
        fixDateOptions: Constant.FIX_DATE_RANGE,
      }
    },
    created() {
      documentTitle('场地 - 退筐');
    },
    methods: {
      //选择区域后【页面初始化】
      selectProvince(data){
        let { query } = this;
        query.line_id = '';
        query.province_code = 'city_id';
        query.province_code = data.code;
        this.$data.query = query;
        this.listQuery();
      },

      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },

      changePageSize(pageSize) {
        this.query.page_size = pageSize;
        this.query.page = 1;
        this.listQuery();
      },
      changePage(page) {
        this.query.page = page;
        this.listQuery();
      },
      //返回金额
      returnPrice(price) {
        return DataHandle.returnPrice(price);
      },
      //搜索日期
      changePicker(value) {
        let {query} = this;
        if (value && value.length === 2) {
          query.begin_date = value[0];
          query.end_date = value[1];
        } else {
          query.begin_date = '';
          query.end_date = '';
        }
        query.page = 1;
        this.$data.query = query;
        this.listQuery();
      },

      // 判断当前行是否可以被选中
      selectable(row) {
        return row.status === 'init';
      },

      selectByCondition() {
        this.listQuery();
      },

      clearQueryCondition() {
        this.$data.query = Object.assign({}, this.$data.query, {
          line_id: '',
          city_id: '',
          store_title: '',
          status: '',
          begin_date: '',
          end_date: '',
          page: 1,
          page_size: Constant.PAGE_SIZE
        })
        this.$data.query.province_code = this.query.province_code;
        this.$data.pickerValue = null;
        this.listQuery();
      },

      async returnFrameListExport() {
        let api = Config.api.operateRefundFrameExport;
        let {line_id, city_id, store_title, status, begin_date, end_date} = this.query;
        let query = {
          line_id,
          city_id,
          store_title,
          status,
          begin_date,
          end_date
        };
        if (!begin_date || !end_date) {
          query.begin_date = '';
          query.end_date = '';
        }
        
        //判断是否可导出
        this.$loading({ isShow: true,  isWhole: true });
        let res = await Http.get(`${api}_check`, {
          province_code: this.query.province_code,
          ...query
        });
        if(res.code === 0){
          let queryStr = `${api}?province_code=${this.query.province_code}`;
          for (let item in query) {
            queryStr += `&${item}=${query[item]}`
          }
          window.open(queryStr);
        }else{
          this.$message({ title: '提示', message: res.message, type: 'error' });
        }
        this.$loading({ isShow: false });
      },

      async listQuery() {
        let res = await Http.get(Config.api.operateRefundQuery, this.query);
        if (res.code === 0) {
          this.$data.listItem = res.data;
        } else {
          Message.warning(res.message);
        }
      },

      handleSelectionChange(items) {
        this.$data.multipleSelection = items;
      },

      handleMultipleApprove() {
        // 开始批量审核, 判断是否已经多选？
        if (this.$data.multipleSelection.length === 0) {
          Message.warning('请选择需要审核的门店！');
        } else {
          MessageBox.confirm('确认通过审核?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            let frame_return_ids = this.$data.multipleSelection.map(item => item.id);
            let res = await Http.post(Config.api.operateRefundFrameApprove, {
              frame_return_ids: frame_return_ids
            });
            if (res.code === 0) {
              Message.success('审核成功！');
              this.listQuery();
            } else {
              Message.warning(res.message);
            }
          }).catch(() => {
            // console.log('取消');
          });
        }
      },

      //确认审核
      affirmApprove(item) {
        MessageBox.confirm('确认通过审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.operateRefundFrameApprove, {
            frame_return_ids: [item.id]
          });
          if (res.code === 0) {
            Message.success('审核成功！');
            this.listQuery();
          } else {
            Message.warning(res.message);
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

      // 确认驳回
      affirmTurnDown(item) {
        MessageBox.confirm('确认驳回?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.operateRefundFrameReject, {
            frame_return_id: item.id
          });
          if (res.code === 0) {
            Message.success('您已驳回该退筐记录！');
            this.listQuery();
          } else {
            Message.warning(res.message);
          }
        }).catch(() => {
          // console.log('取消');
        });
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>

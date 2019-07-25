<template>
  <div class="frame-list">
    <div class="operate" v-if="auth.isAdmin || auth.BasicDataFrameListAdd">
      <el-button @click="basicDataFrameShowHideAddEdit({
          isShow: true
      })" size="mini" type="primary" v-if="auth.isAdmin || auth.BasicDataFrameListAdd">新增
      </el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove">
      <el-table
        :data="dataItem"
        :row-class-name="highlightRowClassName"
        style="width: 100%"
        :height="windowHeight - offsetHeight"
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column width="20"/>
        <el-table-column prop="code" label="编号" min-width="150">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.code }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" min-width="150">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="框重量" min-width="100">
          <template slot-scope="scope">
            {{returnWeight(scope.row.weight)}}
          </template>
        </el-table-column>
        <el-table-column label="框价格" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.price == 0 ? '' : '￥' }}{{scope.row.price == 0 ? '-' : returnPrice(scope.row.price)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{ scope.row.remark || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{ scope.row.created }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '编辑',
                isDisplay: auth.isAdmin || auth.BasicDataFrameListUpdate,
                command: () => basicDataFrameShowHideAddEdit({ isShow: true, data: scope.row })
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.BasicDataFrameListDelete,
                command: () => deleteFrame(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
    <my-frame-add-edit :callback="myCallBack"/>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import {
    Form,
    FormItem,
    Button,
    Input,
    Table,
    TableColumn,
    Tag,
    RadioGroup,
    RadioButton,
    MessageBox
  } from 'element-ui';
  import {TableOperate} from '@/common';
  import {Config, Constant, DataHandle} from '@/util';
  import FrameAddEdit from './FrameAddEdit';
  import tableMixin from '@/container/table/table.mixin';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'FrameList',
    components: {
      'el-button': Button,
      'el-input': Input,
      'el-radio-group': RadioGroup,
      'el-radio-button': RadioButton,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'my-frame-add-edit': FrameAddEdit,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin, viewMixin],
    created() {
      documentTitle("信息 - 框信息列表");
      this.basicDataFrameList(this.query);

      if (!this.auth.isAdmin && !this.auth.BasicDataFrameListAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT;
      }
    },
    computed: mapGetters({
      dataItem: 'basicDataFrameListDataItem'
    }),
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE,
        query: {
          province_code: ''
        },
        rowIdentifier: 'code'
      }
    },
    methods: {

      //组件回调
      myCallBack(res) {
        this.basicDataFrameList(this.query);
      },
      //删除
      deleteFrame(data) {
        let that = this;
        MessageBox.confirm(`您确认要删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.basicDataFrameDelete({
            data: {
              code: data.code
            },
            callback: () => {
              that.basicDataFrameList(that.query);
            }
          });
        })
          .catch(() => {
            //console.log('取消');
          });
      },
      ...mapActions(['basicDataFrameList', 'basicDataFrameDelete', 'basicDataFrameShowHideAddEdit'])
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

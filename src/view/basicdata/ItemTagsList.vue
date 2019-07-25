<template>
  <div class="item-tags-list">
    <div class="operate" v-if="auth.isAdmin || auth.BasicDataItemTagsListAdd">
      <el-button @click="basicDataItemTagsShowHideAddEdit({
          isShow: true
      })" size="mini" type="primary" v-if="auth.isAdmin || auth.BasicDataItemTagsListAdd">新增
      </el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove">
      <el-table :data="dataItem"
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
        <el-table-column prop="title" label="名称" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.rank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="200">
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
                isDisplay: auth.isAdmin || auth.BasicDataItemTagsListUpdate,
                command: () => basicDataItemTagsShowHideAddEdit({ isShow: true, data: scope.row })
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.BasicDataItemTagsListDelete,
                command: () => deleteItemTags(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
    <my-item-tags-add-edit :callback="myCallBack"/>
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
  import {Config, Constant} from '@/util';
  import ItemTagsAddEdit from './ItemTagsAddEdit';
  import tableMixin from '@/container/table/table.mixin';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ItemTagsList',
    components: {
      'el-button': Button,
      'el-input': Input,
      'el-radio-group': RadioGroup,
      'el-radio-button': RadioButton,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'my-item-tags-add-edit': ItemTagsAddEdit,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin, viewMixin],
    created() {
      documentTitle("信息 - 商品标签列表");
      this.basicDataItemTagsList();

      if (!this.auth.isAdmin && !this.auth.BasicDataItemTagsListAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT;
      }
    },
    computed: mapGetters({
      dataItem: 'basicDataItemTagsListDataItem'
    }),
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE,
      }
    },
    methods: {

      //省改变
      changeProvince(v, isInit) {
        if (!isInit) this.basicDataItemTagsList();
      },
      //组件回调
      myCallBack(res) {
        this.basicDataItemTagsList();
      },
      //删除
      deleteItemTags(data) {
        let that = this;
        MessageBox.confirm(`您确认要删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.basicDataItemTagsDelete({
            data: {
              id: data.id
            },
            callback: () => {
              that.basicDataItemTagsList();
            }
          });
        })
          .catch(() => {
            //console.log('取消');
          });
      },
      ...mapActions(['basicDataItemTagsList', 'basicDataItemTagsDelete', 'basicDataItemTagsShowHideAddEdit'])
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

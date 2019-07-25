<template>
  <div class="province-list">
    <div class="operate" v-if="auth.isAdmin || auth.BasicDataProvinceListAdd">
      <el-button @click="basicDataProvinceShowHideAddEdit({
          isShow: true
      })" size="mini" type="primary" v-if="auth.isAdmin || auth.BasicDataProvinceListAdd">新增</el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="dataItem"
        :row-class-name="highlightRowClassName"
        style="width: 100%"
        :height="windowHeight - offsetHeight"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column width="20"/>
        <el-table-column prop="code" label="编号" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.code }}
            </div>
          </template>
        </el-table-column>
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
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.created }}
            </div>
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
                isDisplay: auth.isAdmin || auth.BasicDataProvinceListUpdate,
                command: () => basicDataProvinceShowHideAddEdit({ isShow: true, data: scope.row })
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.BasicDataProvinceListDelete,
                command: () => deleteProvince(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
    <my-province-add-edit :callback="myCallBack"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Form, FormItem, Button, Input, Table, TableColumn, Tag, RadioGroup, RadioButton, MessageBox } from 'element-ui';
import {TableOperate} from '@/common';
import { Config, Constant } from '@/util';
import ProvinceAddEdit from './ProvinceAddEdit';
import tableMixin from '@/container/table/table.mixin';
import viewMixin from '@/view/view.mixin';

export default {
  name: 'ProvinceList',
  components: {
    'el-button': Button,
    'el-input': Input,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-tag': Tag,
    'my-province-add-edit': ProvinceAddEdit,
    'my-table-operate': TableOperate
  },
  mixins: [tableMixin, viewMixin],
  created(){
    documentTitle("信息 - 省列表");
    this.basicDataProvinceList();

    if (!this.auth.isAdmin && !this.auth.BasicDataProvinceListAdd) {
      this.offsetHeight = Constant.OFFSET_BASE_HEIGHT;
    }
  },
  computed: mapGetters({
    dataItem: 'basicDataProvinceListDataItem'
  }),
  data(){
    return {
      offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE,
      rowIdentifier: 'code'
    }
  },
  methods: {

    //组件回调
    myCallBack(res){
      this.basicDataProvinceList();
    },
    //删除
    deleteProvince(data) {
      let that = this;
      MessageBox.confirm(`您确认要删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         that.basicDataProvinceDelete({
            data: {
              code: data.code
            },
            callback: ()=>{
              that.basicDataProvinceList();
            }
          });
      })
      .catch(() => {
        //console.log('取消');
      });
    },
    ...mapActions(['basicDataProvinceList', 'basicDataProvinceDelete', 'basicDataProvinceShowHideAddEdit'])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .avatar{
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
  }
</style>

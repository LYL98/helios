<template>
  <div>
    <div class="operate" v-if="auth.isAdmin || auth.BasicDataFrameListAdd">
      <el-button @click="handleShowAddEdit('AddEditBasicDataFrame')" size="mini" type="primary" v-if="auth.isAdmin || auth.BasicDataFrameListAdd">新增
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
            {{ returnWeight(scope.row.weight) }}
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
                command: () => handleShowAddEdit('AddEditBasicDataFrame', scope.row)
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
  </div>
</template>

<script>
  import { TableOperate } from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'FrameList',
    components: {
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    created() {
      documentTitle("信息 - 框信息列表");
      this.getData();

      if (!this.auth.isAdmin && !this.auth.BasicDataFrameListAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT;
      }
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE,
        query: {
        },
        dataItem: [],
        rowIdentifier: 'code'
      }
    },
    methods: {
      //获取数据
      async getData(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataFrameList, {});
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //删除
      deleteFrame(data) {
        let that = this;
        this.$messageBox.confirm(`您确认要删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.basicDataFrameDelete({
            data: {
              code: data.code
            },
            callback: () => {
              that.getData();
            }
          });
        })
          .catch(() => {
            //console.log('取消');
          });
      },
      //...mapActions(['basicDataFrameDelete', 'basicDataFrameShowHideAddEdit'])
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

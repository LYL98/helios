<template>
  <div>
    <div class="operate" v-if="auth.isAdmin || auth.BasicDataCityListAdd">
      <el-button @click="handleShowAddEdit('AddEditBasicDataCity')" size="mini" type="primary" v-if="auth.isAdmin || auth.BasicDataCityListAdd">新增
      </el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="pageList"
        :row-class-name="highlightRowClassName"
        style="width: 100%;"
        :height="windowHeight - offsetHeight"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" min-width="140" label="序号" :index="indexMethod"/>
        <el-table-column prop="title" label="县域编号 / 名称" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.code }} / {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属省份" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.province && scope.row.province.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属片区" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.zone && scope.row.zone.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="线路" min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.line && scope.row.line.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.rank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="store_num_pre" label="预估门店数" min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.store_num_pre }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="160">
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
                title: '修改',
                isDisplay: auth.isAdmin || auth.BasicDataCityListUpdate,
                command: () => handleShowAddEdit('AddEditBasicDataCity', scope.row)
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.BasicDataCityListDelete,
                command: () => handleDelete(scope.row)
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
          :total="dataItem.length"
          :page-size="page_size"
          :current-page="page"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { TableOperate } from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableBasicDataCity',
    components: {
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    created() {
      if (!this.auth.isAdmin && !this.auth.BasicDataCityListAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION
      }
      let pc = this.getPageComponents('QueryBasicDataCity'); //获取query组件
      this.getData(pc.query);
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        rowIdentifier: 'code',
        page: 1,
        page_size: Constant.PAGE_SIZE,
        dataItem: []
      }
    },
    computed: {
      pageList: {
        get() {
          return this.dataItem.slice((this.page - 1) * this.page_size, this.page * this.page_size);
        }
      }
    },
    methods: {
      indexMethod(index) {
        return (this.page - 1) * this.page_size + index + 1;
      },
      // 设置每页显示数量
      changePageSize(pageSize) {
        window.scrollTo(0, 0);
        this.page_size = pageSize;
        this.page = 1;
      },

      //翻页
      changePage(page) {
        window.scrollTo(0, 0);
        this.page = page;
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataCityList, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //删除数据
      async deleteData(data) {
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.basicdataCityDelete, {
          code: data.code
        });
        this.$loading({ isShow: false });
        if(res.code === 0){
          this.getData(this.query);
          this.$message({message: '已删除', type: 'success'});
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

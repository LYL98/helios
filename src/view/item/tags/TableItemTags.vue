<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.ItemTagsAdd">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleShowAddEdit('AddEditItemTags')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <el-table :data="dataItem"
                :row-class-name="highlightRowClassName"
                class="list-table my-table-float"
                @cell-mouse-enter="cellMouseEnter"
                @cell-mouse-leave="cellMouseLeave"
                :highlight-current-row="true"
                :row-key="rowIdentifier"
                :current-row-key="clickedRow[rowIdentifier]"
      >
        <!-- <el-table-column width="20"/> -->
        <el-table-column prop="title" label="名称" min-width="200" align="center">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" min-width="200" align="center">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.rank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="200" align="center">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">{{ scope.row.created }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '查看商品',
                isDisplay: auth.isAdmin || auth.ItemQueryByItemTag,
                command: () => handleShowDetail('DetailItemTags', scope.row)
              },
              {
                title: '修改',
                isDisplay: auth.isAdmin || auth.ItemTagsEdit,
                command: () => handleShowAddEdit('AddEditItemTags', scope.row)
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.ItemTagsDelete,
                command: () => handleDelete(scope.row)
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
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'TableItemTags',
    components: {
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    props: {
      provinceCode: { type: String, default: '' }, //省code
    },
    created() {
      this.getData();
      console.log(this.auth);
      
    },
    data() {
      return {
        dataItem: [],
        rowIdentifier: 'code'
      }
    },
    methods: {
      //获取数据
      async getData(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataItemTagsList, {
          province_code: this.provinceCode
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },

      //重写删除数据提示
      handleDelete(data){
      this.$messageBox.confirm(`慎用：该专区内的运营商品会被全部删除`, '确定删除这项运营标签？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center:true
      }).then(() => {
        this.deleteData(data);
      }).catch(() => {
        //console.log('取消');
      });
    },
      //删除数据
      async deleteData(data) {
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.basicdataItemTagsDelete, {
          id: data.id
        });
        this.$loading({ isShow: false });
        if(res.code === 0){
          this.getData();
          this.$message({message: '已删除', type: 'success'});
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>

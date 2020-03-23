<template>
  <div class="container-table">
    <!-- 头部end -->
    <div class="table-top" v-if="auth.isAdmin || auth.WarehouseListAdd">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleShowAddEdit('AddEdit', null, 'add')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        class="list-table my-table-float"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--编号名称-->
              <template v-if="item.key === 'title'">
                <div class="td-item add-dot">
                  <div class="link-item add-dot" @click="handleShowDetail('Detail', scope.row)" v-if="auth.isAdmin || auth.WarehouseListDetail">
                    {{scope.row.title}}
                  </div>
                  <div class="add-dot" v-else>
                    {{scope.row.title}}
                  </div>
                </div>
              </template>
              <!--所属仓-->
              <div class="td-item" v-else-if="item.key === 'storehouse'">
                <span v-if="scope.row.storehouse_id">{{scope.row.storehouse.title}}</span>
                <span v-else>-</span>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.WarehouseListDetail,
                  command: () => handleShowDetail('Detail', scope.row)
                },
                {
                  title: '修改',
                  isDisplay: auth.isAdmin || auth.WarehouseListEdit,
                  command: () => handleShowAddEdit('AddEdit', scope.row, 'edit')
                },
                {
                  title: '删除',
                  isDisplay: auth.isAdmin || auth.WarehouseListDelete,
                  command: () => handleDelete(scope.row)
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left"></div>
      <div class="right">
        <pagination :pageComponent="this" />
      </div>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'Table',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('Query'); //获取query组件
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableWarehouse',
        tableColumn: [
          { label: '库', key: 'title', width: '2', isShow: true },
          { label: '所属仓', key: 'storehouse', width: '2', isShow: true },
          { label: '托盘数', key: 'tray_num', width: '1', isShow: true },
          { label: '创建时间', key: 'created', width: '1', isShow: true },
          { label: '更新时间', key: 'updated', width: '1', isShow: false },
        ]
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataWarehouseList, query);
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
        let res = await Http.post(Config.api.basicdataWarehouseDelete, {
          id: data.id
        });
        this.$loading({ isShow: false });
        if(res.code === 0){
          this.getData(this.query);
          this.$message({message: '已删除', type: 'success'});
          //如果详情显示
          let pc = this.getPageComponents('Detail');
          if(pc.isShow) pc.$data.isShow = false;
          
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

<template>
  <div class="container-table">
    <!-- 头部end -->
    <div class="table-top" v-if="auth.isAdmin || auth.StorehouseAdd">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleShowAddEdit('AddEdit', null, 'add')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div class="table-conter">
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
              <!--名称-->
              <template v-if="item.key === 'title'">
                <div class="td-item add-dot">
                  <div class="link-item add-dot" @click="handleShowAddEdit('AddEdit', scope.row, 'detail')" v-if="auth.isAdmin || auth.StorehouseDetail">
                    {{scope.row.title}}
                  </div>
                  <div class="add-dot" v-else>
                    {{scope.row.title}}
                  </div>
                </div>
              </template>
              <!--区域-->
              <div class="td-item" v-else-if="item.key === 'province'">
                <span v-if="scope.row.province_code === 'nationwide'">全国</span>
                <span v-else-if="scope.row.province_code">{{scope.row.province.title}}</span>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              :list="[
                {
                  title: '修改',
                  isDisplay: auth.isAdmin || auth.StorehouseEdit,
                  command: () => handleShowAddEdit('AddEdit', scope.row, 'edit')
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
        tableName: 'Storehouse',
        tableColumn: [
          { label: '仓', key: 'title', width: '2', isShow: true },
          { label: '所属区域', key: 'province', width: '2', isShow: true },
          { label: '地址', key: 'address', width: '3', isShow: true },
          { label: '创建时间', key: 'created', width: '2', isShow: true },
          { label: '更新时间', key: 'updated', width: '2', isShow: false },
        ]
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataStorehouseList, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
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

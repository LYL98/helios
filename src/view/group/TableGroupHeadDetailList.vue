<template>
  <el-table :data="memberDataItem" :row-class-name="highlightRowClassName" highlight-current-row="highlight-current-row">
    <el-table-column label="团长名称" min-width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.realname }}</div>
        </template>
      </el-table-column>
      <el-table-column label="登录手机" prop="phone" min-width="100">
        <template slot-scope="scope">
          <div>
            {{ scope.row.phone }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="is_freeze_header" min-width="80">
        <template slot-scope="scope">
          <el-tag disable-transitions size="small" :type="scope.row.is_freeze_header ? 'regular' : 'info'" style="width: 66px; text-align: center;"
          >{{ scope.row.is_freeze_header ? '已冻结' : '未冻结' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <my-table-operate
            @command-click="handleCommandClick(scope.row)"
            :list="[
              {
                title: scope.row.is_freeze_header ? '解冻' : '冻结',
                isDisplay: (auth.isAdmin || auth.GroupHeadFreeze),
                command: () => groupHeadFreeze(scope.row, scope.$index)
              }
            ]"
          />
        </template>
      </el-table-column>
  </el-table>
</template>

<script>
  import { Table, TableColumn, MessageBox, Tag } from 'element-ui';
  import { TableOperate } from '@/common';
  import { Config, Http } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: "TableGroupHeadDetailList",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    props: {
      memberDataItem: { type: Array, required: true, defalut: [] },
    },
    computed: {
    },
    data() {
      return {
        
      }
    },
    methods: {
      //冻结解决团长
      async groupHeadFreeze(data, index){
        let str = data.is_freeze_header ? '解冻' : '冻结';
        MessageBox.confirm(`确认${str}该团长?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.groupHeadFreeze, {
            header_id: data.id,
            is_freeze_header: !data.is_freeze_header
          });
          if(res.code === 0){
            this.$message({
              title: '提示',
              message: `已${str}`,
              type: 'success'
            });
            //更新父组件页面数据
            let com = this.$props.getPageComponents('HeadDetail');
            if(com && com.groupDetail && com.groupDetail.members && com.groupDetail.members.length > index){
              com.groupDetail.members2[index].is_freeze_header = !data.is_freeze_header;
              com.$data.groupDetail = this.copyJson(com.groupDetail);
            }
          }else{
            this.$message({
              title: '提示',
              message: res.message,
              type: 'error'
            });
          }
        }).catch(() => {
          // console.log('取消');
        });
      }
    }
  }
</script>

<style scoped>
  .title {
    color: inherit;
    padding: 5px 10px 5px 0;
    text-decoration: underline;
    cursor: pointer;
  }
  .title:hover {
    font-weight: 600;
  }
  .title-disable {
    color: inherit;
    padding: 5px 10px 5px 0;
  }
</style>

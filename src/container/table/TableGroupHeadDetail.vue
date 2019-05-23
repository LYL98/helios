<template>
  <el-table @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" :data="dataItem" :row-class-name="highlightRowClassName" highlight-current-row="highlight-current-row">
    <el-table-column label="门店名称" min-width="100">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">{{ scope.row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column label="门店地址" prop="store_address" min-width="120">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.address }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" prop="phone" min-width="80">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.phone }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所在仓" prop="city_title" min-width="80">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.city_title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="gb_included_time" min-width="100">
        <template slot-scope="scope">
          <div :class="isEllipsis(scope.row)">
            {{ scope.row.gb_included_time }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="is_freeze_header" min-width="80">
        <template slot-scope="scope">
          <el-tag disable-transitions size="small" :type="scope.row.is_freeze_header ? 'regular' : 'info'" style="width: 66px; text-align: center;"
          >{{ scope.row.is_freeze_header ? '已冻结' : '未冻结' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <my-table-operate
            @command-click="handleCommandClick(scope.row)"
            @command-visible="handleCommandVisible"
            :list="[
              {
                title: scope.row.is_freeze_header ? '解冻' : '冻结',
                isDisplay: (auth.isAdmin || auth.GroupStoreFreeze),
                command: () => groupStoreFreeze(scope.row)
              }
            ]"
          />
        </template>
      </el-table-column>
  </el-table>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { Table, TableColumn, MessageBox, Tag } from 'element-ui';
  import { TableOperate } from '@/common';
  import { Config, DataHandle, Http } from '@/util';
  import { tableMixin } from '@/mixins';

  export default {
    name: "TableGroupHeadDetail",
    components: {
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin],
    props: {
      dataItem: { type: Array, required: true},
      getPageComponents: { type: Function, require: true }, //获取页面组件
    },
    computed: {
      ...mapGetters({
        auth: 'globalAuth',
      }),
    },
    data() {
      return {
      }
    },
    methods: {
      //冻结解冻门店
      async groupStoreFreeze(data){
        let str = data.is_freeze_header ? '解冻' : '冻结';
        MessageBox.confirm(`确认${str}该门店?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await Http.post(Config.api.groupStoreFreeze, {
            store_id: data.id,
            is_freeze_header: !data.is_freeze_header
          });
          if(res.code === 0){
            this.$store.dispatch('message', {
              title: '提示',
              message: `已${str}`,
              type: 'success'
            });
            //更新父组件页面数据
            let com = this.$props.getPageComponents('HeadDetail');
            if(com && com.dataItem && com.dataItem.length > 0){
              com.$data.dataItem[0].is_freeze_header = !data.is_freeze_header;
            }
          }else{
            this.$store.dispatch('message', {
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

<template>
  <detail-layout title="签到司机" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <div style="padding: 0 16px;">
      <el-table :data="dataItem" :row-class-name="highlightRowClassName">
        <el-table-column label="姓名">
          <template slot-scope="scope">{{scope.row.deliver.realname}}</template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">{{scope.row.deliver.phone}}</template>
        </el-table-column>
        <el-table-column label="签到线路编号/名称">
          <template slot-scope="scope">{{scope.row.line.line_index}} / {{scope.row.line.title}}</template>
        </el-table-column>
        <el-table-column label="签到时间">
          <template slot-scope="scope">{{scope.row.created}}</template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="scope">
            <a href="javascript:void(0);" v-if="auth.isAdmin || auth.OperateLineDriverDelete" @click="operateLineDriverDelete(scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </detail-layout>
</template>

<script>
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';

  export default {
    name: "DetailOperateLineDriver",
    mixins: [detailMixin],
    components: {
    },
    data() {
      let initDetail = {
        line: {},
        city: {}
      }
      return {
        initDetail: initDetail,
        detail: this.copyJson(initDetail),
        dataItem: []
      }
    },
    methods: {
      //标题
      returnTitle(){
        let { detail } = this;
        let t = (detail.line.title || '') + '/';
        t += (detail.city.title || '') + '/';
        t += (detail.store_title || '') + '分配信息';
        return t;
      },
      //显示新增修改(重写mixin)
      showDetail(data){
        this.$data.dataItem = [];
        this.$data.detail = data;
        this.operateLineDriverList();
      },
      //获取签到司机列表
      async operateLineDriverList(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.operateLineDriverList, {
          province_code: this.$province.code,
          delivery_date: this.detail.delivery_date
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
          this.$data.isShow = true;
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //删除签到司机
      operateLineDriverDelete(data){
        this.$messageBox.confirm('确认删除签到司机？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({isShow: true});
            let res = await Http.post(Config.api.operateLineDriverDelete, {
              id: data.id
            });
            this.$loading({isShow: false});
            if(res.code === 0){
              this.$message({message: '已删除', type: 'success'});
              this.operateLineDriverList();
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        }).catch(() => {
          //console.log('取消');
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/share/scss/detail.scss";
</style>

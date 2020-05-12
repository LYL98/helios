<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.OperateLineAdd || auth.OperateLineConfirmDriver || auth.OperateLineDriver">
      <div class="left">
        <el-button v-if="auth.isAdmin || auth.OperateLineConfirmDriver" @click.native="operateLineConfirm" size="mini" type="primary" plain>一键分配司机</el-button>
      </div>
      <div class="right">
        <el-button v-if="auth.isAdmin || auth.OperateLineDriverExport" @click.native="handleExport('basicDataListDeliveryExport', query)" size="mini" type="primary" plain>导出司机信息</el-button>
        <el-button v-if="auth.isAdmin || auth.OperateLineDriver" @click.native="handleShowDetail('DetailOperateLineDriver', query)" size="mini" type="primary" plain>签到司机</el-button>
        <el-button v-if="auth.isAdmin || auth.OperateLineAdd" @click.native="handleShowAddEdit('AddEditOperateLine', null, 'add')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div class="table-conter">
      <el-table
        class="list-table my-table-float"
        :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column align="center" type="index" :width="(query.page - 1) * query.page_size < 950 ? 48 : (query.page - 1) * query.page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod"/>
        <el-table-column prop="title" label="线路编号 / 名称" min-width="200">
          <template slot-scope="scope">{{ scope.row.line_index }} / {{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column prop="item_num" label="线路总数量" min-width="100">
          <template slot-scope="scope">{{ scope.row.item_num }}件</template>
        </el-table-column>
        <el-table-column label="包含县域" min-width="200">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.citys" :key="index">
              {{item.title}}{{'（' + item.item_num + '件）'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="司机" min-width="200">
          <template slot-scope="scope">{{scope.row.deliver.realname || '-'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              :list="[
              {
                title: '解绑司机',
                isDisplay: query.delivery_date >= today && (auth.isAdmin || auth.OperateLineUnDriver) && scope.row.deliver.id,
                command: () => handleLineUnDriver(scope.row)
              },
               {
                title: '地图',
                isDisplay: query.delivery_date >= today && (auth.isAdmin || auth.OperateLineOrderedStoreInx),
                command: () => handleShowMap(scope.row,query.delivery_date)
              },
              {
                title: '修改',
                isDisplay: query.delivery_date >= today && (auth.isAdmin || auth.OperateLineEdit) && !scope.row.deliver.id,
                command: () => handleShowAddEdit('AddEditOperateLine', scope.row, 'edit')
              },
              {
                title: '打印',
                isDisplay: query.delivery_date >= today && (auth.isAdmin || auth.OperateLinePrint),
                command: () => handlePrint(scope.row)
              },
              {
                title: '打印预览',
                isDisplay: query.delivery_date >= today && (auth.isAdmin || auth.OperateLinePrint),
                command: () => handlePrintPreview(scope.row)
              },
              {
                title: '删除',
                isDisplay: query.delivery_date >= today && (auth.isAdmin || auth.OperateLineDelete) && !scope.row.deliver.id,
                command: () => handleDelete(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
    <div class="table-bottom">
      <div class="left"></div>
      <div class="right">
        <pagination :pageComponent="this" />
      </div>
    </div>
    <!-- 地图页面 -->
   <detail-layout
      title="县域门店地图"
      :isShow="location.visible"
      type="drawer"
      direction="ttb"
      :before-close="handleCancel"
    >
      <location-driving
        v-if="location.visible"
        :mapDatas="location.item"
        style="height:100%;padding:0 15px"
      />
    </detail-layout>

  </div>
</template>

<script>
  import { TableOperate } from '@/common';
  import { LocationDriving } from '@/common';

  import { Http, Config, Constant, DataHandle, Lodop } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';
  import detailLayout from "@/share/layout/Layout";

  export default {
    name: 'FrameList',
    components: {
      'my-table-operate': TableOperate,
      'detail-layout': detailLayout,
      'location-driving':LocationDriving
    },
    mixins: [tableMixin],
    created() {
      //在Query组件初始化
      //let pc = this.getPageComponents('QueryOperateLine'); //获取query组件
      //this.getData(pc.query);
    },
    data() {
      return {
        location: {
          visible: false,
          item: {},
          marker:[],//所有门店经纬度
        },
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.operateLineList, query);
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
        let res = await Http.post(Config.api.operateLineDelete, {
          line_id: data.line_id
        });
        this.$loading({ isShow: false });
        if(res.code === 0){
          this.getData(this.query);
          this.$message({message: '已删除', type: 'success'});
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //解绑司机
      handleLineUnDriver(data){
        this.$messageBox.confirm('您要解绑司机？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({isShow: true});
            let res = await Http.post(Config.api.operateLineUnDriver, {
              line_id: data.line_id,
              delivery_date: this.query.delivery_date
            });
            this.$loading({isShow: false});
            if(res.code === 0){
              this.getData(this.query);
              this.$message({message: '已解绑', type: 'success'});
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        }).catch(() => {
          //console.log('取消');
        });
      },
      //一键确认今日所有线路的司机
      operateLineConfirm(){
        this.$messageBox.confirm('系统已为所有线路自动匹配相对应的司机，确定后将完成。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({isShow: true});
            let res = await Http.post(Config.api.operateLineConfirm, {
              province_code: this.$province.code,
              delivery_date: this.query.delivery_date
            });
            this.$loading({isShow: false});
            if(res.code === 0){
              this.$message({message: '已分配', type: 'success'});
              this.getData(this.query);
            }else{
              this.$message({message: res.message, type: 'error'});
            }
          })();
        }).catch(() => {
          //console.log('取消');
        });
      },
      handlePrint(item) {
        let temp = Lodop.tempOperateLine(item);
        temp && temp.PRINT();
      },
      handlePrintPreview(item) {
        let temp = Lodop.tempOperateLine(item);
        temp && temp.PREVIEW();
      },
      //获取地图
     async handleShowMap(data,delivery_date){
        //  this.$data.location = {
        //     visible: true,
        //     item: {},
        //   };
        console.log(data,delivery_date);
        
          this.$loading({ isShow: true });
      //data.id
      let res = await Http.get(Config.api.operateLineOrderedStoreInx, {
           line_id: data.line_id,
           delivery_date:delivery_date
        });
        this.$loading({ isShow: false });
        if(res.code === 0){
            console.log(res.data);
            // let itemTemp = res.data.stores
            //需要将返回的数据进行处理
            let itemTemp = res.data
            this.$data.location = {
            visible: true,
            item: itemTemp,
          };
        }
      },
      //关闭地图
      handleCancel(){
        let that = this
        this.$data.location = {
            visible: false,
            item: [],
          };
      }
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

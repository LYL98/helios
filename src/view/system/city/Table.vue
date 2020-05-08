<template>
  <div class="container-table">
    <div class="table-top" v-if="auth.isAdmin || auth.CityAdd">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleShowAddEdit('AddEdit',null, 'add')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <el-table
        class="list-table my-table-float"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" min-width="140" label="序号" :index="indexMethod"/>
        <el-table-column prop="title" label="县域名称" min-width="200">
          <template slot-scope="scope">
            <div class="td-item">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属区域" min-width="100">
          <template slot-scope="scope">
            <div class="td-item">
              {{ scope.row.province && scope.row.province.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属片区" min-width="100">
          <template slot-scope="scope">
            <div class="td-item">
              {{ scope.row.zone && scope.row.zone.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="线路" min-width="120">
          <template slot-scope="scope">
            <div class="td-item">
              {{ scope.row.line && scope.row.line.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" min-width="80">
          <template slot-scope="scope">
            <div class="td-item">
              {{ scope.row.rank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="store_num_pre" label="预估门店数" min-width="120">
          <template slot-scope="scope">
            <div class="td-item">
              {{ scope.row.store_num_pre }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="160">
          <template slot-scope="scope">
            <div class="td-item">
              {{ scope.row.created }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '地图',
                isDisplay: auth.isAdmin || auth.CityEdit,
                command: () => handleShowLocationDrving( scope.row)
              },
              {
                title: '修改',
                isDisplay: auth.isAdmin || auth.CityEdit,
                command: () => handleShowAddEdit('AddEdit', scope.row,'edit')
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.CityDelete,
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
        <pagination :pageComponent='this'/>
      </div>
    </div>
    <!-- 表格end -->
       <detail-layout
      title="县域门店地图"
      :isShow="location.visible"
      type="drawer"
      direction="ttb"
      :before-close="handleCancel"
    >
        <!-- :center="location.item.storehouse.geo" -->
        <!-- :marker="location.marker" -->
      <location-driving
        v-if="location.visible"
        :center="location.item"
        :marker="location.marker"
        style="height:100%;padding:0 15px"
      />
    </detail-layout>
  </div>
</template>

<script>
  import { TableOperate } from '@/common';
    import { LocationDriving } from '@/common';
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';
  import detailLayout from "@/share/layout/Layout";
  export default {
    name: 'Table',
    components: {
      'my-table-operate': TableOperate,
      'detail-layout': detailLayout,
      'location-driving':LocationDriving
    },
    mixins: [tableMixin],
    created() {
      //在Query组件初始化
      //let pc = this.getPageComponents('Query'); //获取query组件
      //this.getData(pc.query);
    },
    data() {
      return {
        dataList: [],
        dataItem: {
          items: [],
          num: 0
        },
        location: {
          visible: false,
          item: {},
          marker:[],//所有门店经纬度
        },
      }
    },
    computed: {
      /*dataItem: {
        get() {
          let { dataList, query } = this;
          let d = {
            items: dataList.slice((query.page - 1) * query.page_size, query.page * query.page_size),
            num: dataList.length
          }
          return d;
        }
      }*/
    },
    methods: {
      indexMethod(index) {
        return (this.query.page - 1) * this.query.page_size + index + 1;
      },
      // 设置每页显示数量
      changePageSize(pageSize) {
        window.scrollTo(0, 0);
        this.query.page_size = pageSize;
        this.query.page = 1;
        this.handleDataItem(); //处理dataItem
      },

      //翻页
      changePage(page) {
        window.scrollTo(0, 0);
        this.query.page = page;
        this.handleDataItem(); //处理dataItem
      },
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.basicdataCityList, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataList = res.data;
          this.handleDataItem(); //处理dataItem
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //删除数据
      async deleteData(data) {
        this.$loading({ isShow: true });
        let res = await Http.post(Config.api.basicdataCityDelete, {
          id: data.id
        });
        this.$loading({ isShow: false });
        if(res.code === 0){
          this.getData(this.query);
          this.$message({message: '已删除', type: 'success'});
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
      //处理dataItem
      handleDataItem(){
        let { dataList, query } = this;
        let d = {
          items: dataList.slice((query.page - 1) * query.page_size, query.page * query.page_size),
          num: dataList.length
        }
        this.$data.dataItem = d;
      },
      //获取地图
      handleShowLocationDrving(){
         this.$data.location = {
            visible: true,
            item: {},
          };
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

<template>
  <div>
    <div class="table-top" v-if="auth.isAdmin || auth.ProvinceAdd">
      <div class="left"></div>
      <div class="right">
        <el-button @click="handleShowAddEdit('AddEdit')" size="mini" type="primary">新增</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div class="table-conter">
      <el-table
        class="list-table my-table-float"
        :data="dataItem"
        :row-class-name="highlightRowClassName"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column width="20" />
        <el-table-column prop="code" label="编号" min-width="200">
          <template slot-scope="scope">
            <div class="td-item">{{ scope.row.code }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="名称" min-width="200">
          <template slot-scope="scope">
            <div class="td-item">{{ scope.row.title }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" min-width="200">
          <template slot-scope="scope">
            <div class="td-item">{{ scope.row.rank }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="200">
          <template slot-scope="scope">
            <div class="td-item">{{ scope.row.created }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              :list="[
              {
                title: '地图',
                isDisplay: auth.isAdmin || auth.ProvinceStoreGeo,
                command: () => handleShowMap(scope.row)
              },
              {
                title: '修改',
                isDisplay: auth.isAdmin || auth.ProvinceEdit,
                command: () => handleShowAddEdit('AddEdit', scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
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
      <el-location
        v-if="location.visible"
        dark
        :center="location.center"
        :marker="location.marker"
        style="height:100%;padding:0 15px"
        :zoom="8"
        :showCenterIcon="false"
      />
    </detail-layout>
  </div>
</template>

<script>
import { TableOperate, Location } from "@/common";
import { Http, Config, Constant, DataHandle } from "@/util";
import tableMixin from "@/share/mixin/table.mixin";
import detailLayout from "@/share/layout/Layout";

export default {
  name: "Table",
  components: {
    "my-table-operate": TableOperate,
    "detail-layout": detailLayout,
    "el-location": Location
  },
  mixins: [tableMixin],
  created() {
    this.getData();
  },
  data() {
    return {
      dataItem: [],
      rowIdentifier: "code",
      location: {
        visible: false,
        marker: [],
        center: {}
      },
    };
  },
  methods: {
    //获取数据
    async getData() {
      this.$loading({ isShow: true, isWhole: true });
      let res = await Http.get(Config.api.basicdataProvinceList, {});
      this.$loading({ isShow: false });
      if (res.code === 0) {
        this.$data.dataItem = res.data;
      } else {
        this.$message({ title: "提示", message: res.message, type: "error" });
      }
    },

    //显示地图
    async handleShowMap(data) {
      let that = this
      this.$loading({ isShow: true });
      let tempCenter = {}
      //从常量表拿数据
      Constant.PROVINCE_CENTER.map((item,index)=>{
          if(data.title == item.value){
            tempCenter = item.key
          }
      })
      let res = await Http.get(Config.api.basicdataProvinceStoreGeo, {
        province_code: data.code
      });
      console.log(res.data);
      let tempDatas = res.data;
      let markerDatas = [];
      tempDatas.map((item, index) => {
        markerDatas.push({
          lng: item.geo.lng,
          lat: item.geo.lat
        });
      });
      this.$loading({ isShow: false });
      this.location = {
        visible: true,
        marker: markerDatas,
        center:tempCenter
      };
    },

    //关闭地图
    handleCancel() {
      this.location = {
        visible: false,
        marker:[],
        center:{}
      };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "@/share/scss/table.scss";
</style>
<style lang="scss">
@import "@/share/scss/table.global.scss";
</style>

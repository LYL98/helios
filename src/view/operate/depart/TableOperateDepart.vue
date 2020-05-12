<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="status" @change="changeTab" :tab-panes="statusOptions" />
      </div>
      <div class="right" v-if="auth.isAdmin || auth.OperateDepartStockout">
        <el-button
          @click="handleShowDetail('DetailOperateDepartStockout', { delivery_date: query.delivery_date })"
          size="mini"
          type="primary"
          plain
        >缺货记录</el-button>
      </div>
    </div>
    <!-- 表格start -->
    <div class="table-conter">
      <setting-column-title
        :columnList="tableColumn"
        :value="tableShowColumn"
        @change="changeTableColumn"
      />
      <el-table
        :data="dataItem"
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
              <!--线路-->
              <template v-if="item.key === 'line'">
                <div class="td-item add-dot">
                  <div
                    class="link-item add-dot"
                    @click="handleShowDetail('DetailOperateDepart', {
                    delivery_date: query.delivery_date,
                    line_id: scope.row.line.id,
                    ...scope.row
                  })"
                    v-if="(auth.isAdmin || auth.OperateDepartDetail) && scope.row.assign_confirm_time"
                  >{{scope.row.line.title}}</div>
                  <div class="add-dot" v-else>{{scope.row.line.title}}</div>
                </div>
              </template>
              <!--数量-->
              <div
                v-else-if="judgeOrs(item.key, ['count_real', 'allocate_num'])"
                class="td-item add-dot2"
              >{{scope.row[item.key] ? scope.row[item.key] + '件' : '-'}}</div>
              <!--缺货-->
              <div
                v-else-if="item.key === 'stockout'"
                class="td-item add-dot2"
              >{{scope.row.count_real - scope.row.allocate_num === 0 ? '-' : (scope.row.count_real - scope.row.allocate_num) + '件'}}</div>
              <!--状态-->
              <div v-else-if="item.key === 'status'" class="td-item add-dot2">
                <el-tag
                  size="small"
                  :type="departStatusType[scope.row.status]"
                  disable-transitions
                >{{departStatus[scope.row.status]}}</el-tag>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              :list="[
                {
                  title: '详情',
                  isDisplay: (auth.isAdmin || auth.OperateDepartDetail) && scope.row.assign_confirm_time,
                  command: () => handleShowDetail('DetailOperateDepart', {
                    delivery_date: query.delivery_date,
                    line_id: scope.row.line.id,
                    ...scope.row
                  })
                },{
                  title: '司机轨迹',
                  //&& scope.row.assign_confirm_time
                  isDisplay: (auth.isAdmin || auth.OperateDepartDriverTrack)&& (scope.row.status === 'delivering'),
                  //command: () => handleShowDetail('DetailOperateDepartDriverTrack', scope.row)
                  command: () => handleLocationItem(scope.row.line)

                },
                /*暂时替换打印，权限共用*/
                {
                  title: '导出',
                  isDisplay: (auth.isAdmin || auth.OperateDepartPrint) && scope.row.assign_confirm_time,
                  command: () => handleOrderExport(scope.row)
                }
                /*{
                  title: '打印',
                  isDisplay: (auth.isAdmin || auth.OperateDepartPrint) && scope.row.assign_confirm_time,
                  command: () => handleShowPrint('PrintOperateDepart', [scope.row])
                }*/
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->

    <!--  width="800px"-->
    <detail-layout
      title="司机轨迹"
      :isShow="location.visible"
      type="drawer"
      direction="ttb"
      :before-close="handleCancel"
    >
      <!-- :center="location.item.storehouse.geo" -->
      <!-- :marker="location.marker" -->
      <el-location
        v-if="location.visible"
        :center="location.item.deliver.last_geo.geo"
        :marker="location.marker"
        :person="location.person"
        style="height:100%;padding:0 15px"
      />
    </detail-layout>
  </div>
</template>

<script>
import { Dialog } from "element-ui";
import { Location } from "@/common";

import { Http, Config, Constant } from "@/util";
import tableMixin from "@/share/mixin/table.mixin";
import queryTabs from "@/share/layout/QueryTabs";
import detailLayout from "@/share/layout/Layout";

export default {
  name: "TableOperateDepart",
  components: {
    "query-tabs": queryTabs,
    "el-location": Location,
    "detail-layout": detailLayout
  },
  mixins: [tableMixin],
  created() {
    //在Query组件初始化
    //let pc = this.getPageComponents('QueryOperateDepart');
    //this.getData(pc.query);
  },
  data() {
    return {
      status: "",
      statusOptions: { 全部: "", ...Constant.DEPART_STATUS("value_key") },
      departStatus: Constant.DEPART_STATUS(),
      departStatusType: Constant.DEPART_STATUS_TYPE,
      tableName: "TableOperateDepart",
      tableColumn: [
        { label: "线路", key: "line", width: "4", isShow: true },
        { label: "应出库", key: "count_real", width: "2", isShow: true },
        { label: "实际出库", key: "allocate_num", width: "3", isShow: true },
        { label: "缺货", key: "stockout", width: "3", isShow: true },
        { label: "状态", key: "status", width: "2", isShow: true },
        { label: "创建时间", key: "created", width: "3", isShow: false },
        { label: "更新时间", key: "updated", width: "3", isShow: false }
      ],
      dataItem: [],
      location: {
        visible: false,
        item: {},
        marker: [], //所有门店经纬度
        person: [] //所有交接员位置经纬度
      }
    };
  },
  methods: {
    changeTab() {
      let pc = this.getPageComponents("QueryOperateDepart");
      this.getData(pc.query);
    },
    //返回是否可选中
    returnStatus(d) {
      if (d.assign_confirm_time) return true;
      return false;
    },
    //获取数据
    async getData(query, type) {
      if (type === "clear") {
        this.$data.status = "";
      }
      this.$data.query = query; //赋值，minxin用
      // console.log(this.$data.query);

      this.$loading({ isShow: true, isWhole: true });
      let res = await Http.get(Config.api.supConfirmWait, {
        ...query,
        status: this.$data.status
      });
      this.$loading({ isShow: false });
      if (res.code === 0) {
        this.$data.dataItem = res.data;
      } else {
        this.$message({ title: "提示", message: res.message, type: "error" });
      }
    },
    //导出
    handleOrderExport(data) {
      let url = Config.api.lineOrderExport + "?";
      url += `&date=${this.query.delivery_date}`;
      url += `&line_id=${data.line.id}`;
      window.open(url, "_blank");
    },
    //获取司机轨迹
    async handleLocationItem(item) {
      let delivery_date = this.$data.query.delivery_date;
      let line_id = item.id;
      // let line_id = 51
      let res = await Http.get(Config.api.supDeliveryDeliverLocus, {
        delivery_date: delivery_date,
        line_id: line_id
      });
      if (res.code === 0) {
        console.log(res.data);
        this.$data.location = {
          visible: true,
          item: res.data
        };
        let tempMaeker = [];
        res.data.stores.map(v => {
          return tempMaeker.push({
            lng: v.geo.lng,
            lat: v.geo.lat
          });
        });
        this.$data.location.marker = tempMaeker;

        let tempPerson = [];
        if (res.data.handovers.length == 0) return;
        res.data.handovers.map(v => {
          return tempPerson.push({
            lng: v.last_geo.geo.lng,
            lat: v.last_geo.geo.lat
          });
        });
        this.$data.location.person = tempPerson;
      } else {
        this.$message({ title: "提示", message: res.message, type: "error" });
      }
    },
    //关闭司机轨迹
    handleCancel() {
      let that = this;
      this.$data.location = {
        visible: false,
        item: [],
        marker: [], //所有门店经纬度
        person: [] //所有交接员位置经纬度
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

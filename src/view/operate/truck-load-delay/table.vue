<template>
  <div class="container-table">
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        row-class-name="stripe-row"
        class="list-table my-table-float"
        :highlight-current-row="true"
        :row-key="returnTableKey"
        :current-row-key="clickedRow[returnTableKey]"
      >
        <el-table-column type="index" width="80" align="center" label="序号" :index="indexMethod"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--商品名称-->
              <div v-if="item.key === 'item'" class="td-item add-dot2">{{scope.row.code}}/{{scope.row.title}}</div>
              <!--线路-->
              <div v-else-if="item.key === 'line'" class="td-item add-dot2">{{scope.row.line.title}}</div>
              <!--分配时间-->
              <div v-else-if="item.key === 'minutes'" class="td-item add-dot2">{{scope.row.minutes}}分钟前</div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left"></div>
      <div class="right">
        <pagination :pageComponent='this'/>
      </div>
    </div>
    <!-- 表格end -->
  </div>
</template>

<script>
  import { Http, Config, Constant } from '@/util';
  import tableMixin from '@/share/mixin/table.mixin';

  export default {
    name: 'TableOperateTruckLoadDelay',
    components: {
    },
    mixins: [tableMixin],
    props: {
      storehouseId: { type: String | Number, default: '' },
      deliveryDate: { type: String, default: '' }
    },
    data() {
      return {
        tableName: 'TableOperateTruckLoadDelay',
        tableColumn: [
          { label: '商品编号/名称', key: 'item', width: '3', isShow: true },
          { label: '线路', key: 'line', width: '2', isShow: true },
          { label: '分配时间', key: 'minutes', width: '1', isShow: true }
        ]
      }
    },
    created() {
      this.getData();
    },
    methods: {
      //返回tabile key
      returnTableKey(d){
        return `${d.id}${d.line.id}`;
      },
      //获取数据
      async getData(){
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supAllocateDelaySortQuery, {
          ...this.query,
          storehouse_id: this.storehouseId,
          delivery_date: this.deliveryDate
        });
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

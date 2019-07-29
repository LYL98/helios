<template>
  <div class="province-list">
    <!-- 头部start -->
    <div class="query">
      <my-query-item label="省份" align="left">
        <el-select size="small" v-model="query.province_code" clearable filterable placeholder="选择省份" style="width:210px;" @change="changeProvince">
          <el-option
            v-for="item in provinceList"
            :key="item.code"
            :label="item.title"
            :value="item.code">
          </el-option>
        </el-select>
      </my-query-item>
      <!--<my-select-province-query size="mini" v-model="query.province_code" @change="changeProvince"/>-->
    </div>
    <!-- 头部end -->
    <div class="operate" v-if="auth.isAdmin || auth.BasicDataZoneListAdd">
      <el-button @click="basicDataZoneShowHideAddEdit({
          isShow: true
      })" size="mini" type="primary" v-if="auth.isAdmin || auth.BasicDataZoneListAdd">新增
      </el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="dataItem"
        :row-class-name="highlightRowClassName"
        style="width: 100%"
        :height="windowHeight - offsetHeight"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column width="20"/>
        <el-table-column prop="code" label="编号" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.code }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属省份" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.province && scope.row.province.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="片区名称" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.rank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" min-width="160">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.created }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
              {
                title: '编辑',
                isDisplay: auth.isAdmin || auth.BasicDataZoneListUpdate,
                command: () => basicDataZoneShowHideAddEdit({ isShow: true, data: scope.row })
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.BasicDataZoneListDelete,
                command: () => deleteZone(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
    <my-zone-add-edit :callback="myCallBack"/>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import {
    Form,
    FormItem,
    Button,
    Input,
    Table,
    TableColumn,
    Tag,
    Select,
    Option,
    RadioGroup,
    RadioButton,
    MessageBox
  } from 'element-ui';
  import {TableOperate, QueryItem} from '@/common';
  import { Http, Config, Constant } from '@/util';
  import ZoneAddEdit from './ZoneAddEdit';
  import tableMixin from '@/container/table/table.mixin';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'ZoneList',
    components: {
      'el-button': Button,
      'el-input': Input,
      'el-radio-group': RadioGroup,
      'el-radio-button': RadioButton,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-tag': Tag,
      'el-select': Select,
      'el-option': Option,
      'my-query-item': QueryItem,
      'my-zone-add-edit': ZoneAddEdit,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin, viewMixin],
    created() {
      documentTitle("信息 - 片区列表");
      this.basicDataZoneList(this.query);
      this.baseProvinceList();

      if (!this.auth.isAdmin && !this.auth.BasicDataZoneListAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE
      }
    },
    computed: mapGetters({
      dataItem: 'basicDataZoneListDataItem'
    }),
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE,
        query: {
          province_code: ''
        },
        provinceList: [],
        rowIdentifier: 'code'
      }
    },
    methods: {

      //省改变
      changeProvince(v, isInit) {
        if (!isInit) this.basicDataZoneList(this.query);
      },
      //获取所有省
      async baseProvinceList(){
        let that = this;
        let res = await Http.get(Config.api.baseProvinceList, {});
        if(res.code === 0){
          let rd = res.data;
          that.$data.provinceList = rd;
          //如果只有一个省，默认选择，页面不显示
          // if(rd.length === 1){
          //   that.changeProvince(rd[0].code, true);
          // }
        }else{
          MessageBox.alert(res.message, '提示');
        }
      },
      //组件回调
      myCallBack(res) {
        this.basicDataZoneList(this.query);
      },
      //删除
      deleteZone(data) {
        let that = this;
        MessageBox.confirm(`您确认要删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.basicDataZoneDelete({
            data: {
              code: data.code
            },
            callback: () => {
              that.basicDataZoneList(that.query);
            }
          });
        })
          .catch(() => {
            //console.log('取消');
          });
      },
      ...mapActions(['basicDataZoneList', 'basicDataZoneDelete', 'basicDataZoneShowHideAddEdit'])
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
  }
</style>

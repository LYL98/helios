<template>
  <div class="province-list">
    <!-- 头部start -->
    <div class="query">
      <el-row>
        <el-col :span="6">
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
        </el-col>
        <el-col :span="6">
          <my-query-item label="片区">
            <el-select size="small" v-model="query.zone_codes" clearable filterable placeholder="选择片区" style="width:210px;" @change="changeZone">
              <el-option
                v-for="item in zoneList"
                :key="item.code"
                :label="item.title"
                :value="item.code">
              </el-option>
            </el-select>
          </my-query-item>
        </el-col>
      </el-row>
    </div>
    <!-- 头部end -->
    <div class="operate" v-if="auth.isAdmin || auth.BasicDataCityListAdd">
      <el-button @click="basicDataCityShowHideAddEdit({
          isShow: true
      })" size="mini" type="primary" v-if="auth.isAdmin || auth.BasicDataCityListAdd">新增
      </el-button>
    </div>
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove">
      <el-table
        class="list-table"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
        :data="pageList"
        :row-class-name="highlightRowClassName"
        style="width: 100%;"
        :height="windowHeight - offsetHeight"
        :highlight-current-row="true"
        :row-key="rowIdentifier"
        :current-row-key="clickedRow[rowIdentifier]"
      >
        <el-table-column type="index" :width="(page - 1) * page_size < 950 ? 48 : (page - 1) * page_size < 999950 ? 68 : 88" label="序号" :index="indexMethod"/>
        <el-table-column prop="title" label="县域编号 / 名称" min-width="200">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.code }} / {{ scope.row.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属省份" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.province && scope.row.province.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属片区" min-width="100">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.zone && scope.row.zone.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="线路" min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.line && scope.row.line.title }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排序" min-width="80">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.rank }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="store_num_pre" label="预估门店数" min-width="120">
          <template slot-scope="scope">
            <div :class="isEllipsis(scope.row)">
              {{ scope.row.store_num_pre }}
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
                isDisplay: auth.isAdmin || auth.BasicDataCityListUpdate,
                command: () => basicDataCityShowHideAddEdit({ isShow: true, data: scope.row })
              },
              {
                title: '删除',
                isDisplay: auth.isAdmin || auth.BasicDataCityListDelete,
                command: () => deleteCity(scope.row)
              }
            ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表格end -->
    <div class="footer">
      <div class="table-pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 30, 40, 50]"
          @size-change="changePageSize"
          @current-change="changePage"
          :total="dataItem.length"
          :page-size="page_size"
          :current-page="page"
        />
      </div>
    </div>
    <my-city-add-edit :callback="myCallBack"/>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapActions} from 'vuex';
  import {
    Row,
    Col,
    Form,
    FormItem,
    Button,
    Input,
    Table,
    TableColumn,
    Pagination,
    Tag,
    RadioGroup,
    RadioButton,
    MessageBox,
    Select,
    Option
  } from 'element-ui';
  import {TableOperate, QueryItem} from '@/common';
  import { Http, Config, Constant} from '@/util';
  import CityAddEdit from './CityAddEdit';
  import tableMixin from '@/container/table/table.mixin';
  import viewMixin from '@/view/view.mixin';

  export default {
    name: 'CityList',
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-button': Button,
      'el-input': Input,
      'el-radio-group': RadioGroup,
      'el-radio-button': RadioButton,
      'el-table': Table,
      'el-table-column': TableColumn,
      'el-pagination': Pagination,
      'el-tag': Tag,
      'el-select': Select,
      'el-option': Option,
      'my-query-item': QueryItem,
      'my-city-add-edit': CityAddEdit,
      'my-table-operate': TableOperate
    },
    mixins: [tableMixin, viewMixin],
    created() {
      documentTitle("信息 - 县域列表");
      this.basicDataCityList(this.query);
      this.baseProvinceList();
      this.baseZoneList();

      if (!this.auth.isAdmin && !this.auth.BasicDataCityListAdd) {
        this.offsetHeight = Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION
      }
    },
    computed: {
      ...mapGetters({
        dataItem: 'basicDataCityListDataItem'
      }),
      pageList: {
        get() {
          return this.dataItem.slice((this.page - 1) * this.page_size, this.page * this.page_size)
        }
      }
    },
    data() {
      return {
        offsetHeight: Constant.OFFSET_BASE_HEIGHT + Constant.OFFSET_OPERATE + Constant.OFFSET_QUERY_CLOSE + Constant.OFFSET_PAGINATION,
        query: {
          province_code: '',
          zone_codes: ''
        },
        page: 1,
        page_size: Constant.PAGE_SIZE,
        provinceList: [],
        zoneList: [],
        rowIdentifier: 'code'
      }
    },
    methods: {
      // cellMouseEnter(row, column, cell, event) {
      //   if(row.code !== this.$data.currentRow.code) {
      //     this.$data.currentRow = row;
      //   }
      // },
      //
      // cellMouseLeave(row, column, cell, event) {
      //   this.$data.currentRow = {};
      // },
      //
      // isEllipsis(row) {
      //   return row.code != this.$data.currentRow.code ? 'ellipsis' : ''
      // },
      // highlightRowClassName({row, rowIndex}) {
      //   if (rowIndex % 2 == 0) {
      //     return 'stripe-row';
      //   } else if (rowIndex % 2 != 0) {
      //     return 'default-row'
      //   }
      //   return '';
      // },
      indexMethod(index) {
        return (this.page - 1) * this.page_size + index + 1;
      },
      // 设置每页显示数量
      changePageSize(pageSize) {
        window.scrollTo(0, 0);
        this.page_size = pageSize;
        this.page = 1;
      },

      //翻页
      changePage(page) {
        window.scrollTo(0, 0);
        this.page = page;
      },
      //省改变
      changeProvince(v, isInit) {
        this.page = 1;
        this.$data.query.zone_codes = '';
        this.baseZoneList();
        if (!isInit) this.basicDataCityList(this.query);
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
      //片区改变
      changeZone(v, isInit) {
        this.page = 1;
        if (!isInit) this.basicDataCityList(this.query);
      },
      //获取所有片区
      async baseZoneList(){
        let that = this;
        let { province_code } = that.query;
        let res = await Http.get(Config.api.baseZoneList, {
          province_code: province_code
        });
        if(res.code === 0){
          let rd = res.data;
          that.$data.zoneList = rd;
          //如果只有一个片区，默认选择，页面不显示
          // if(rd.length === 1){
          //   that.changeZone(rd[0].code, true);
          // }
        }else{
          MessageBox.alert(res.message, '提示');
        }
      },
      //组件回调
      myCallBack(res) {
        this.basicDataCityList(this.query);
      },
      //删除
      deleteCity(data) {
        let that = this;
        MessageBox.confirm(`您确认要删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.basicDataCityDelete({
            data: {
              code: data.code
            },
            callback: () => {
              that.basicDataCityList(that.query);
            }
          });
        })
          .catch(() => {
            //console.log('取消');
          });
      },
      ...mapActions(['basicDataCityList', 'basicDataCityDelete', 'basicDataCityShowHideAddEdit'])
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
  }

  .action {
    display: flex;

    li + li {
      margin-left: 10px;
    }

    a {
      font-size: 12px;
      text-decoration: underline;
    }

    a:hover {
      font-weight: 900;
    }
  }
</style>

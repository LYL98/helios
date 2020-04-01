<template>
  <div class="container-table">
    <div class="table-top">
      <div class="left">
        <query-tabs v-model="status" @change="changeTab" :tab-panes="{ '全部': '', '待分配': 'unalloted', '已分配': 'alloted' }"/>
      </div>
    </div>

    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <!--全选-->
      <div class="all-select">
        <el-checkbox @change="changeAllSelect" :value="judgeAllSelect"></el-checkbox>
      </div>

      <el-table :data="dataItem.items"
        row-class-name="stripe-row"
        class="list-table my-table-float"
        :highlight-current-row="true"
        row-key="code"
        :current-row-key="clickedRow['code']"
        default-expand-all
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="out-stock">
              <div v-for="(item, i) in props.row.out_stocks" :key="item.id" class="out-stock-item">
                <div class="select">
                  <el-checkbox :disabled="item.allocated_time ? false : true" :value="judgeSelect(item)"
                    @change="(v)=>changeSelect(v, item)">批{{props.row.out_stocks.length - i}}</el-checkbox>
                </div>
                <div>入场：{{returnUnit(item.num, '件', '-')}}</div>
                <div>入场时间：{{returnDateFormat(item.created, 'HH:mm:ss')}}</div>
                <div>分配人：{{(item.allocator && item.allocator.realname) || '-'}}</div>
                <div>分配时间：{{returnDateFormat(item.allocated_time, 'HH:mm:ss') || '-'}}</div>
                <div>装车：{{returnUnit(item.sort_num, '件', '-')}}</div>
                <div class="option">
                  <my-table-operate
                    @command-click="handleCommandClick(item)"
                    @command-visible="handleCommandVisible"
                    :list="[
                      {
                        title: '分配',
                        isDisplay: (auth.isAdmin || auth.OperateSortAdd) && !item.allocated_time,
                        command: () => handleAllocate(item)
                      },{
                        title: '打印',
                        isDisplay: (auth.isAdmin || auth.OperateSortPrint) && item.allocated_time,
                        command: () => handleShowPrint('PrintOperateSort', {delivery_date: query.delivery_date, ids: [item.id]})
                      }
                    ]"
                  />
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <!--table-column start-->
        <template v-for="(item, index, key) in tableColumn">
          <el-table-column :key="key" :label="item.label" :minWidth="item.width" v-if="item.isShow">
            <div slot-scope="scope" class="my-td-item">
              <!--商品名称-->
              <div v-if="item.key === 'item'" class="td-item add-dot2">
                {{scope.row.code}}/{{scope.row.title}}
                <span class="label-hint" v-if="item.after">还会来货</span>
              </div>
              <!--数量-->
              <div v-else-if="judgeOrs(item.key, ['count_real', 'num', 'allocated_num', 'sort_num'])" class="td-item add-dot2">{{returnUnit(scope.row[item.key], '件', '-')}}</div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="96">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[{
                  title: '详情',
                  isDisplay: auth.isAdmin || auth.OperateSortDetail,
                  command: () => handleShowDetail('DetailOperateSort', {
                    ...scope.row,
                    delivery_date: query.delivery_date
                  })
                }
              ]"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-bottom">
      <div class="left">
        <el-button @click="handleShowPrint('PrintOperateSort', {delivery_date: query.delivery_date, ids: returnListKeyList('id', multipleSelection)})" size="mini" type="primary"
        :disabled="multipleSelection.length === 0 ? true : false" plain  v-if="auth.isAdmin || auth.OperateSortPrint">批量打印</el-button>
      </div>
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
  import queryTabs from '@/share/layout/QueryTabs';

  export default {
    name: 'TableOperateSort',
    components: {
      'query-tabs': queryTabs
    },
    mixins: [tableMixin],
    props: {
      provinceCode: { type: String, default: '' }, //省code
    },
    created() {
      let pc = this.getPageComponents('QueryOperateSort');
      this.getData(pc.query);
    },
    data() {
      return {
        status: '',
        tabValue: 'sort',
        tableName: 'TableOperateSort',
        tableColumn: [
          { label: '商品编号/名称', key: 'item', width: '4', isShow: true },
          { label: '应出', key: 'count_real', width: '1', isShow: true },
          { label: '入场', key: 'num', width: '1', isShow: true },
          { label: '分配', key: 'allocated_num', width: '1', isShow: true },
          { label: '装车', key: 'sort_num', width: '1', isShow: true },
        ]
      }
    },
    computed: {
      //判断是否全选
      judgeAllSelect(){
        let { multipleSelection, dataItem } = this;
        if(multipleSelection.length === 0) return false;
        let con = 0, disabled = 0;
        dataItem.items.forEach(item => {
          item.out_stocks.forEach(o => {
            con++;
            if(!o.allocated_time){
              disabled++;
            }
          });
        });
        if(multipleSelection.length >= con - disabled) return true;
        return false;
      },
    },
    methods: {
      changeTab() {
        let pc = this.getPageComponents('QueryOperateSort');
        this.getData(pc.query);
      },
      //获取数据
      async getData(query, type){
        if (type === 'clear') {
          this.$data.status = '';
        }
        //从MenuQuery组件取数据
        let pc = this.getPageComponents('MenuQuery');
        if(pc) query.delivery_date = pc.query.delivery_date;

        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.supOutAllocateQuery, {
          ...query,
          status: this.$data.status,
          province_code: this.provinceCode
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //判断单选是否已选择
      judgeSelect(data){
        let con = this.multipleSelection.filter(item => item.id === data.id);
        if(con.length > 0) return true;
        return false;
      },
      //全选
      changeAllSelect(v){
        let { multipleSelection, dataItem } = this;
        multipleSelection = [];
        if(v){
          dataItem.items.forEach(item => {
            item.out_stocks.forEach(o => {
              if(o.allocated_time){
                multipleSelection.push(o);
              }
            });
          });
        }
        this.$data.multipleSelection = this.copyJson(multipleSelection);
      },
      //单选
      changeSelect(v, data){
        let { multipleSelection } = this;
        if(v){
          multipleSelection.push(data);
        }else{
          for(let i = 0; i < multipleSelection.length; i++){
            if(multipleSelection[i].id === data.id){
              multipleSelection.remove(i);
              break;
            }
          }
        }
        this.$data.multipleSelection = this.copyJson(multipleSelection);
      },
      //分配
      handleAllocate(data){
        this.$messageBox.confirm(`是否确认该批商品分配数量为${data.num}件`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          (async ()=>{
            this.$loading({isShow: true});
            let res = await Http.post(Config.api.supAllocateAdd, {
              out_stock_id: data.id
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
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '@/share/scss/table.scss';
  .all-select{
    position: absolute;
    top: 14px;
    left: 20px;
    z-index: 3;
  }
  .label-hint{
    border: 1px solid #ff5252;
    color: #ff5252;
    border-radius: 3px;
    padding: 0 2px;
    font-size: 12px;
  }
  .out-stock{
    margin-bottom: 20px;
  }
  .out-stock-item{
    display: flex;
    align-items: center;
    padding: 4px;
    &:hover{
      background: #FBFBFD;
    }
    >div{
      flex: 1;
    }
    >.select{
      flex: initial !important;
      padding-right: 20px;
    }
    >.option{
      flex: initial !important;
    }
  }
</style>
<style lang="scss">
  @import '@/share/scss/table.global.scss';
</style>

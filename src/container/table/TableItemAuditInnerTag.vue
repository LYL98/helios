<template>
  <div class="container-table">
    <!-- 表格start -->
    <div @mousemove="handleTableMouseMove" class="table-conter">
      <setting-column-title :columnList="tableColumn" :value="tableShowColumn" @change="changeTableColumn"/>
      <el-table :data="dataItem.items"
        :row-class-name="highlightRowClassName"
        style="width: 100%"
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
              <!--编号名称-->
              <div class="td-item add-dot2" v-if="item.key === 'code_title'">
                {{scope.row.item.code}}<br/>{{scope.row.item.title}}
              </div>
              <!--修改人-->
              <div class="td-item add-dot2" v-else-if="item.key === 'realname'">
                {{scope.row.creator.realname}}
              </div>
              <!--原商品价格标签-->
              <div class="td-item add-dot2" v-else-if="item.key === 'cur_inner_tag'">
                <div class="add-dot">{{scope.row.cur_inner_tag.title}}</div>
                <div class="add-dot">加价率：{{returnPercent(scope.row.cur_inner_tag.rise_min)}}% - {{returnPercent(scope.row.cur_inner_tag.rise_max)}}%</div>
              </div>
              <!--现商品价格标签-->
              <div class="td-item add-dot2" v-else-if="item.key === 'inner_tag'">
                <div class="add-dot">{{scope.row.inner_tag.title}}</div>
                <div class="add-dot">加价率：{{returnPercent(scope.row.inner_tag.rise_min)}}% - {{returnPercent(scope.row.cur_inner_tag.rise_max)}}%</div>
              </div>
              <!--状态-->
              <div class="td-item" v-else-if="item.key === 'status'">
                <span v-if="!scope.row.is_audited">待审核</span>
                <span v-else-if="scope.row.is_declined">驳回</span>
                <span v-else>审核通过</span>
              </div>
              <!--正常情况-->
              <div class="td-item add-dot2" v-else>{{scope.row[item.key]}}</div>
            </div>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <my-table-operate
              @command-click="handleCommandClick(scope.row)"
              @command-visible="handleCommandVisible"
              :list="[
                {
                  title: '审核',
                  isDisplay: (auth.isAdmin || auth.ItemListEdit) && !scope.row.is_audited,
                  command: () => showHideAudit(scope.row)
                },
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
    <!--审核弹框-->
    <el-dialog title="审核内标签" :visible="isShowAudit" width="520px" :before-close="showHideAudit">
      <el-form>
        <el-form-item label="类型">
          <el-radio v-model="isDeclined" :label="false" border size="mini">审核通过</el-radio>
          <el-radio v-model="isDeclined" :label="true" border size="mini">驳回</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="showHideAudit">取 消</el-button>
        <el-button type="primary" @click.native="handleAudit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { Http, Config, Constant, DataHandle } from '@/util';
  import tableMixin from '@/container/table/table.mixin';

  export default {
    name: 'TableItemAuditInnerTag',
    components: {
    },
    mixins: [tableMixin],
    created() {
      let pc = this.getPageComponents('QueryItemAuditInnerTag');
      this.getData(pc.query);
    },
    data() {
      return {
        tableName: 'TableItemAuditInnerTag',
        tableColumn: [
          { label: '商品编号/名称', key: 'code_title', width: '3', isShow: true },
          { label: '原商品价格标签', key: 'cur_inner_tag', width: '3', isShow: true },
          { label: '现商品价格标签', key: 'inner_tag', width: '3', isShow: true },
          { label: '修改人', key: 'realname', width: '2', isShow: true },
          { label: '修改时间', key: 'created', width: '2', isShow: true },
          { label: '审核状态', key: 'status', width: '2', isShow: true }
        ],
        isShowAudit: false,
        isDeclined: false,
        auditId: ''
      }
    },
    methods: {
      //获取数据
      async getData(query){
        this.$data.query = query; //赋值，minxin用
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.get(Config.api.itemInnerTagLogQuery, query);
        this.$loading({isShow: false});
        if(res.code === 0){
          this.$data.dataItem = res.data;
        }else{
          this.$message({title: '提示', message: res.message, type: 'error'});
        }
      },
      //操作
      showHideAudit(data){
        this.$data.isShowAudit = !this.isShowAudit;
        if(data){
          this.$data.isDeclined = false;
          this.$data.auditId = data.id || '';
        }
      },
      //确认审核
      async handleAudit(){
        let { auditId, isDeclined } = this;
        this.$loading({isShow: true, isWhole: true});
        let res = await Http.post(Config.api.itemInnerTagAudit, {
          id: auditId,
          is_declined: isDeclined
        });
        this.$loading({isShow: false});
        if(res.code === 0){
          this.showHideAudit();
          this.getData(this.query);
        }else{
          this.$message({message: res.message, type: 'error'});
        }
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import './table.scss';
  .is-presale{
    color: #fff;
    background: #FFA349;
    font-size: 12px;
    display: inline-block;
    text-align: center;
    height: 18px;
    line-height: 18px;
    width: 18px;
    border-radius: 18px 0 18px 18px;
    position: relative;
    top: -2px;
  }
</style>
<style lang="scss">
  @import './table.global.scss';
</style>

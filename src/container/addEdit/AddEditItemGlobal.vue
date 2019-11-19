<template>
  <el-drawer :title="pageTitle" :visible.sync="isShow" direction="ttb" :before-close="handleCancel" size="100%" custom-class="my-drawer">
    <el-form class="custom-form" label-position="right" label-width="110px" style="width: 98%" :model="detail" :rules="rules" ref="ruleForm">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="商品图片" prop="images">
              <upload-img v-model="detail.images" module="item" :limit="5"></upload-img>
            </el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="商品名称" prop="title">
                  <el-input size="medium" v-model="detail.title" :maxLength="20" placeholder="请输入20位以内的字符"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="筐">
                  <select-frame v-model="detail.frame_code" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="包装规格" prop="package_spec">
                  <el-input size="medium" v-model="detail.package_spec" :maxLength="6" placeholder="请输入6位以内的字符"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规格" prop="item_spec">
                  <el-input size="medium" v-model="detail.item_spec" :maxLength="20" placeholder="请输入20位以内的字符"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="毛重" prop="gross_weight">
                  <input-weight size="medium" v-model="detail.gross_weight" placeholder="0.1 - 100000" unit="斤" style="width: 180px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产地" prop="origin_place">
                  <el-input size="medium" v-model="detail.origin_place" :maxLength="30" placeholder="请输入30位以内的字符"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="净重" prop="net_weight">
                  <input-weight size="medium" v-model="detail.net_weight" placeholder="0.1 - 100000" unit="斤" style="width: 180px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="科学分类" prop="system_class_code">
                  <select-system-class v-model="detail.system_class_codes" @change="selectSystemClass"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="创建人">{{detail.creater.realname}}</el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="创建时间">{{detail.created}}</el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-if="detail.updated && detail.last_updater.realname">
              <el-col :span="8">
                <el-form-item label="最后更新人">{{detail.last_updater.realname}}</el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="最后更新时间">{{detail.updated}}</el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" v-if="page === 'global' && (auth.isAdmin || auth.ItemGlobalEditRecord)">
              <el-button @click.native="handleShowEditRecord" class="f-r">修改明细</el-button>
            </el-form-item>
            <div style="margin-left: 110px;">
              <div style="color: #909399; font-size: 14px; margin-bottom: 8px;">商品详情</div>
              <quill-editor v-model="detail.content" module="item"></quill-editor>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="drawer-bottom">
        <el-button @click.native="handleCancel">取 消</el-button>
        <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
      </div>
  </el-drawer>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Verification } from '@/util';
import { QuillEditor, UploadImg, InputWeight, SelectFrame, SelectSystemClass } from '@/common';

export default {
  name: "AddEditItemGlobal",
  mixins: [addEditMixin],
  components: {
    'upload-img': UploadImg,
    'quill-editor': QuillEditor,
    'input-weight': InputWeight,
    'select-frame': SelectFrame,
    'select-system-class': SelectSystemClass
  },
  props: {
    page: { type: String, default: 'global' }, //页面global、recover
  },
  data(){
    //毛重
    let validGrossWeight = function (rules, value, callback) {
      if(value < 1){
        callback('毛重不能小于0.1斤');
      }else{
        callback();
      }
    };
    //净重
    let validNetWeight = function (rules, value, callback) {
      if(value < 1){
        callback('净重不能小于0.1斤');
      }else{
        callback();
      }
    };
    let initDetail = {
      title: '', //商品名称(必填项)
      images: [], //图片(必填项, 列表),
      package_spec: '', //包装规格
      item_spec: '', //商品规格
      origin_place: '', //产地
      gross_weight: '', //毛重
      net_weight: '', //净重
      system_class_code: '', //科学分类编号
      system_class_codes: [], //科学分类编号s
      frame_code: '', //筐code
      content: '', //详细信息
      creater: {},
      last_updater: {},
    }
    return{
      initDetail: initDetail,
      detail: JSON.parse(JSON.stringify(initDetail)),
      rules: {
        images: [
          { type: 'array', required: true, message: '至少要上传一张图片', trigger: 'change' }
        ],
        title: [
            { required: true, message: '商品名称不能为空', trigger: 'change' },
        ],
        package_spec: [
          { required: true, message: '包装规格不能为空', trigger: 'change' },
        ],
        origin_place: [
          { required: true, message: '产地不能为空', trigger: 'change' },
        ],
        gross_weight : [
          { required: true, message: '请输入毛重', trigger: 'change' },
          { validator: validGrossWeight, trigger: 'blur' },
        ],
        net_weight: [
          { required: true, message: '请输入净重', trigger: 'change' },
          { validator: validNetWeight, trigger: 'blur' },
        ],
        system_class_code: [
          { required: true, message: '请选择科学分类', trigger: 'blur' },
          { len: 8, message: '请选择至第三级分类', trigger: 'blur' }
        ],
      },
      pageTitle: '新增商品',
      pageType: 'add',
    }
  },
  methods: {
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      if(data){
        this.pItemDetail(data.id);
        if(type === 'detail'){
          this.$data.pageTitle = '商品详情';
          this.$data.pageType = 'detail';
        }else{
          this.$data.pageTitle = '修改商品';
          this.$data.pageType = 'edit';
        }
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
        this.$data.isShow = true;
        this.$data.pageTitle = '新增商品';
        this.$data.pageType = 'add';
      }
    },
    //获取详情
    async pItemDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.pItemDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        rd.system_class_codes = [];
        for(let i = 0; i < rd.system_classes.length; i++){
          rd.system_class_codes.push(rd.system_classes[i].code);
        }
        this.$data.detail = JSON.parse(JSON.stringify(rd));
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //选择科学分类
    selectSystemClass(value){
      if(value.length === 0){
        this.$data.detail.system_class_code = '';
      }else{
        this.$data.detail.system_class_code = value[value.length - 1];
      }
    },
    //提交数据
    async addEditData(){
      let { detail } = this;
      this.$loading({isShow: true});
      let res = await Http.post(Config.api[detail.id ? 'pItemEdit' : 'pItemAdd'], {
        ...detail,
        weight: this.handleWeight(detail.weight)
      });
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        //刷新数据(列表)
        let pc = this.getPageComponents('TableItemGlobal');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //显示修改明细
    handleShowEditRecord(){
      let pc = this.getPageComponents('DetailItemGlobalEditRecord');
      pc.showDetail(this.detail);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .my-drawer{
    left: 180px !important;
    top: 42px !important;
    width: calc(100% - 180px) !important;
    height: calc(100% - 42px) !important;
    >.el-drawer__header{
      font-size: 18px;
      border-bottom: 1px solid #ececec;
      margin: 0 !important;
      padding: 20px !important;
    }
    >.el-drawer__body{
      overflow-y: auto;
      padding: 15px 0;
    }
  }
  .drawer-bottom{
    margin: 50px 110px 0;
  }
</style>

<template>
  <add-edit-layout :title="returnPageTitles('商品')" :isShow="isShow" direction="ttb" :before-close="handleCancel" type="drawer">
    <el-form class="custom-form" size="mini" label-position="right" :disabled="pageType === 'detail'" label-width="140px" :model="detail" :rules="rules" ref="ruleForm">
      <h6 class="subtitle">基本信息</h6>
      <el-row>
        <el-col :span="4">
          <el-form-item label="商品视频" prop="video">
            <upload-video v-model="detail.video" module="item" :multiple="false" :disabled="!judgeOrs(pageType, ['add', 'edit'])"></upload-video>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="商品图片" prop="images">
            <image-preview v-if="pageType === 'detail'">
              <img style="width: 64px; height: 64px; margin-right: 10px" v-for="(item, index) in detail.images" :key="index" :src="tencentPath + item + '_min200x200'" alt=""/>
            </image-preview>
            <upload-img v-else v-model="detail.images" module="item" :limit="5" :disabled="!judgeOrs(pageType, ['add', 'edit'])"></upload-img>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="商品名称" prop="title">
        <el-input size="medium" v-model="detail.title" :maxLength="20" placeholder="请输入20位以内的字符"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="规格" prop="item_spec">
            <el-input size="medium" v-model="detail.item_spec" :maxLength="20" placeholder="请输入20位以内的字符"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="筐">
            <select-frame size="medium" v-model="detail.frame_id"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="包装规格" prop="package_spec">
            <el-input size="medium" v-model="detail.package_spec" :maxLength="6" placeholder="请输入6位以内的字符"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产地" prop="origin_place">
            <el-input size="medium" v-model="detail.origin_place" :maxLength="30" placeholder="请输入30位以内的字符"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="13">
              <el-form-item label="重量" prop="weight_s">
                <input-weight size="medium" v-model="detail.weight_s" placeholder="最小重量" unit="斤"/>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div style="text-align: center; padding-left: 10px; line-height: 30px;"> — </div>
            </el-col>
            <el-col :span="9">
              <el-form-item label-width="10px" prop="weight_e">
                <input-weight size="medium" v-model="detail.weight_e" placeholder="最大重量" unit="斤"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
<!--        <el-col :span="6">-->
<!--          <el-form-item prop="gross_weight">-->
<!--            <input-weight size="medium" v-model="detail.gross_weight" placeholder="0.1 - 100000" unit="斤"/>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="12">
          <el-form-item label="保质期" prop="shelf_life">
            <input-number size="medium" v-model="detail.shelf_life" :min="1" unit="天"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存期" prop="stock_life">
            <input-number size="medium" v-model="detail.stock_life" :min="1" unit="天"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="科学分类" prop="system_class_code">
            <select-system-class size="medium" v-model="detail.system_class_codes" @change="selectSystemClass" :disabled="pageType === 'add' ? false : true"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="商品详情">
        <quill-editor mainClass="item-g-quill-editor" v-model="detail.content" isUpVideo module="item" height="200" :disabled="pageType === 'detail' ? true : false"></quill-editor>
      </el-form-item>
      <template v-if="pageType === 'detail'">
        <h6 class="subtitle">操作记录</h6>
        <el-row v-if="detail.creator && detail.creator.id">
          <el-col :span="12">
            <el-form-item label="创建人">{{detail.creator.realname}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">{{detail.creator.created}}</el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="detail.updated && detail.updated.id">
          <el-col :span="12">
            <el-form-item label="最后更新人">{{detail.updated.realname}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后更新时间">{{detail.updated.created}}</el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <div style="margin-left: 140px; margin-top: 20px;">
      <template v-if="judgeOrs(pageType, ['add', 'edit'])">
        <el-button size="medium" @click.native="handleCancel">取 消</el-button>
        <el-button size="medium" type="primary" @click.native="handleAddEdit">确 定</el-button>
      </template>
      <template v-else>
        <el-button size="medium" type="text" style="margin-right: 20px;" @click.native="pageType = 'edit'" v-if="page !== 'recover' && (auth.isAdmin || auth.ItemGlobalEdit)">修 改</el-button>
        <el-button size="medium" @click.native="handleCancel">关 闭</el-button>
      </template>
    </div>
  </add-edit-layout>
</template>

<script>
import addEditMixin from '@/share/mixin/add.edit.mixin';
import { Http, Config, Verification, Constant } from '@/util';
import { ImagePreview, QuillEditor, InputWeight, InputNumber, SelectFrame, SelectSystemClass } from '@/common';
import { UploadImg, UploadVideo } from '@/component';

export default {
  name: "AddEditItemGlobal",
  mixins: [addEditMixin],
  components: {
    'image-preview': ImagePreview,
    'upload-img': UploadImg,
    'upload-video': UploadVideo,
    'quill-editor': QuillEditor,
    'input-weight': InputWeight,
    'input-number': InputNumber,
    'select-frame': SelectFrame,
    'select-system-class': SelectSystemClass
  },
  props: {
    page: { type: String, default: 'global' }, //页面global、recover
  },
  data(){
    let initDetail = {
      title: '', //商品名称(必填项)
      video: '', //视频
      images: [], //图片(必填项, 列表),
      package_spec: '', //包装规格
      item_spec: '', //商品规格
      origin_place: '', //产地
      weight_e: '', //最大重量
      weight_s: '', //最小重量
      system_class_code: '', //科学分类编号
      system_class_codes: [], //科学分类编号s
      supplier_ids: [], //供应商
      frame_id: '', //筐code
      content: '', //详细信息
      creator: {},
      last_updater: {},
    }
    return{
      supplierType: Constant.SUPPLIER_TYPE(),
      initDetail: initDetail,
      detail: JSON.parse(JSON.stringify(initDetail)),
      rules: {
        images: [
          { type: 'array', required: true, message: '至少要上传一张图片', trigger: 'change' }
        ],
        title: [
          { required: true, message: '商品名称不能为空', trigger: 'change' },
        ],
        shelf_life: [
          { required: true, message: '保质期不能为空', trigger: 'change' },
        ],
        stock_life: [
          { required: true, message: '库存期不能为空', trigger: 'change' },
        ],
        package_spec: [
          { required: true, message: '包装规格不能为空', trigger: 'change' },
        ],
        origin_place: [
          { required: true, message: '产地不能为空', trigger: 'change' },
        ],
        weight_s: [
          { required: true, message: '请输入净重', trigger: 'change' },
          { validator: this.validWeightS, trigger: 'blur' },
        ],
        weight_e : [
          { validator: this.validWeightE, trigger: 'change' },
        ],
        system_class_code: [
          { required: true, message: '请选择科学分类', trigger: 'blur' },
          { validator: this.validSystemClass, trigger: 'blur' }
        ],
      },
    }
  },
  methods: {
    validWeightS (rules, value, callback) {
      if(value < 1) {
        callback('重量不能小于0.1斤');
      } else {
        this.$data.detail.weight_e && this.$refs['ruleForm'].validateField('weight_e');
        callback();
      }
    },
    validWeightE (rules, value, callback) {
      if (!value) {
        return callback();
      }
      if(value < 1) {
        callback('重量不能小于0.1斤');
      } else if (value < this.$data.detail.weight_s) {
        callback('最大重量不能小于最小重量');
      } else{
        callback();
      }
    },
    validSystemClass (rules, value, callback) {
      if(value.length < 6){
        callback('请选择至第三级分类');
      }else{
        callback();
      }
    },
    //显示新增修改(重写) (数据，类型)
    showAddEdit(data, type){
      if(data){
        this.pItemDetail(data.id);
        if(type === 'detail'){
          this.$data.pageType = 'detail';
        }else{
          this.$data.pageType = 'edit';
        }
      }else{
        this.$data.detail = JSON.parse(JSON.stringify(this.initDetail));
        this.$data.isShow = true;
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
        if (!rd.weight_e) {
          rd.weight_e = '';
        }
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
    //显示操作日志
    handleShowEditRecord(){
      let pc = this.getPageComponents('DetailItemGlobalEditRecord');
      pc.showDetail(this.detail);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '@/share/scss/add.edit.scss';
  .hint{
    font-size: 12px;
    color: #ff0052;
  }
</style>
<style lang="scss">
  .item-g-quill-editor{
    .ql-container {
      height: 400px;
    }
    .ql-video{
      width: 100%;
    }
  }
</style>

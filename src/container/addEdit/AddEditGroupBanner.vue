<template>
  <el-dialog :close-on-click-modal="false" :title="`${detail.id?'编辑':'新增'}Banner`" :visible="isShow" width="840px" :before-close="handleCancel">
    <el-form label-position="right" label-width="120px" style="width: 700px;" :model="detail" :rules="rules" ref="ruleForm">
      <el-form-item label="图片" prop="images">
        <upload-img v-model="detail.images" module="group-banner" :limit="1"></upload-img>
        <span style="font-size: 12px; color: #999;">建议上传尺寸为690x280的图片</span>
      </el-form-item>
      <!--<el-form-item label="url">
        <el-input v-model="detail.url" placeholder="请输入绑定公众号发布的文章url"></el-input>
      </el-form-item>-->
      <el-form-item label="是否可用">
          <el-radio-group v-model="detail.is_usable">
          <el-radio :label="true">可用</el-radio>
          <el-radio :label="false">不可用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="rank">
        <el-input v-model="detail.rank" placeholder="0 - 999" :maxlength="3" style="width: 200px;"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="handleCancel">取 消</el-button>
      <el-button type="primary" @click.native="handleAddEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import addEditMixin from './add.edit.mixin';
import { Http, Config, Verification } from '@/util';
import { UploadImg } from '@/component';

export default {
  name: "AddEditGroupBanner",
  mixins: [addEditMixin],
  components: {
    'upload-img': UploadImg,
  },
  data(){
    let initDetail = {
      province_code: this.$province.code,
      image: '',
      images: [],
      is_usable: true,
      url: '',
      rank: ''
    }
    return{
      initDetail: initDetail,
      detail: this.copyJson(initDetail),
      rules: {
        images: [
          { type: 'array', required: true, message: '请上传图片', trigger: 'change' }
        ],
        rank: [
          { required: false},
          { pattern: Verification.testStrs.isNumber, message: '排序值必须为整数', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    //显示新增修改(重写)
    showAddEdit(data){
      if(data){
        this.groupBannerDetail(data.id);
      }else{
        this.$data.detail = this.copyJson(this.initDetail);
        this.$data.isShow = true;
      }
    },
    //获取详情
    async groupBannerDetail(id){
      this.$loading({isShow: true});
      let res = await Http.get(Config.api.groupBannerDetail, { id: id });
      this.$loading({isShow: false});
      if(res.code === 0){
        let rd = res.data;
        this.$data.detail = {
          ...rd,
          images: [rd.image],
        };
        this.$data.isShow = true;
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    },
    //提交数据
    async addEditData(){
      let { detail, page } = this;
      this.$loading({isShow: true});
      let data = {
        ...detail,
        image: detail.images[0],
      }
      let res = await Http.post(Config.api[detail.id ? 'groupBannerEdit' : 'groupBannerAdd'], data);
      this.$loading({isShow: false});
      if(res.code === 0){
        this.$message({message: `${detail.id ? '修改' : '新增'}成功`, type: 'success'});
        this.handleCancel(); //隐藏
        let pc = this.getPageComponents('TableGroupBanner');
        pc.getData(pc.query);
      }else{
        this.$message({message: res.message, type: 'error'});
      }
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

<template>
  <el-dialog :title="detail.realname + '详情'" :visible="isShow" width="600px" :before-close="handleCancel">
    <el-form class="custom-form-detail" label-position="right" label-width="110px" style="width: 500px;">
      <el-form-item label="头像">
        <div class="img-div" style="flex: 1;">
          <image-preview>
            <img style="width: 64px; height: 64px; margin-right: 10px" :src="tencentPath + detail.avatar + '_min200x200'" alt=""/>
          </image-preview>
        </div>
      </el-form-item>
      <el-form-item label="工号" prop="rank">
        <span class="detail">{{detail.employee_no}}</span>
      </el-form-item>
      <el-form-item label="备注" prop="rank">
        <span class="detail">{{detail.remark}}</span>
      </el-form-item>
      <el-form-item label="创建时间" prop="rank">
        <span class="detail">{{detail.created}}</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import detailMixin from '@/share/mixin/detail.mixin';
  import { Http, Config, Constant } from '@/util';
  import { ImagePreview } from '@/common';

  export default {
    name: "DetailSystemOperator",
    mixins: [detailMixin],
    components: {
      'image-preview': ImagePreview
    },
    data() {
      return {
        initDetail: {},
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/share/scss/detail.scss";
</style>

<template>
  <div @click="handlePreview" class="video">
    <i class="el-icon-video-camera video-icon"></i>
    <slot></slot>
    <el-dialog :visible.sync="isShow" append-to-body fullscreen :before-close="handleCloseDialog" style="background: #23241f;">
      <div class="video-wrapper" v-if="isShow">
        <video :src="src" controls autoplay/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { Dialog } from 'element-ui';

  export default {
    name: "VideoPreview",
    components: {
      'el-dialog': Dialog
    },
    props: {
      src: { type: String, default: '' }
    },
    data() {
      return {
        isShow: false
      }
    },
    computed: {
      
    },
    methods: {
      //查看视频
      handlePreview() {
        this.isShow = true;
      },

      //关闭视频
      handleCloseDialog() {
        this.isShow = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .video{
    display: inline-block;
    box-sizing: border-box;
    width: 64px;
    height: 64px;
    border: 1px solid #ddd;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    margin-right: 10px;
    &:last-child{
      margin-right: 0;
    }
    >.video-icon {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      font-size: 63px;
      color: #ddd;
    }
  }
  .video-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    >video{
      user-select: none;
      margin: 0 auto;
    }
  }
</style>

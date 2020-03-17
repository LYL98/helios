<template>
  <div :id="key" class="my-upload">
    <!--视频列表-->
    <draggable class="draggable" v-model="fileList" @end="onEndDraggable" :options="{group: 'people'}">
      <div class="avatar" v-for="item in fileList" :key="item.uid">
        <span class="float-layer">
          <i class="el-icon-delete" @click="handleRemove(item.url)" v-if="!disabled"></i>
          <i class="el-icon-search" @click="handlePreview(item.url)"></i>
        </span>
        <img :src="item.url + '_min200x200'">
      </div>
    </draggable>

    <!--上传视频-->
    <el-upload
      v-if="fileList.length < limit"
      :multiple="multiple"
      :limit="limit"
      :action="tencentUpPath"
      :http-request="httpRequestUpload"
      :data="uploadData"
      :show-file-list="false"
      list-type="picture-card"
      ref="myUpload"
      accept="video/mp4"
      :file-list="upFileList"
      :on-exceed="onFileExceed"
      :before-upload="onBeforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :disabled="disabled"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <!--查看视频-->
    <el-dialog :visible.sync="isShow" append-to-body fullscreen :before-close="handleCloseDialog" style="background: #23241f;">
      <div class="image-wrapper">
        <video src="https://www.w3school.com.cn/i/movie.ogg"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * 参数说明：
   * multiple: 多个
   * videos: 为数组类型，表示上传视频的队列。默认为'', 如果为list,多个，如果为string,单个
   * module: 指定需要上传至哪个模块，默认为item
   * limit：指定上传文件的数量限制，默认为1
   */
  import { Upload, Dialog, Message } from 'element-ui';
  import draggable from 'vuedraggable';
  import { Http, Config } from '@/util';

  export default {
    name: "UploadVideo",
    components: {
      'el-upload': Upload,
      'el-dialog': Dialog,
      'draggable': draggable
    },
    model: {
      prop: 'videos',
      event: 'change',
    },
    props: {
      multiple: { type: Boolean, default: true },
      videos: { type: Array | String, default: '' },
      module: { type: String, default: 'item_video' },
      limit: { type: Number, default: 1 },
      disabled: { type: Boolean, default: false }
    },
    data() {
      // 获取传递进来的默认值
      let fs = this.videos ? this.videos.map(item => {
        return {url: Config.tencentPath + item}
      }) : [];

      // 生成组件的id值，便于更新视频列表后，调用
      let key = `upload-${Math.random().toString(16).substring(2)}`;
      return {
        key: key,
        tencentPath: Config.tencentPath,
        tencentUpPath: Config.tencentUpPath,
        uploadData: {},
        upFileList: this.copyJson(fs), //上传的列表
        fileList: this.copyJson(fs), // 默认的视频列表
        isShow: false,
        size: 10,
        position: {
          x: window.innerWidth * 0.8 * 0.5,
          y: window.innerHeight * 0.8 * 0.5
        },
        drag: {
          isDraging: false,
          beginX: 0,
          beginY: 0,
          X: 0,
          Y: 0
        },
        imgRecord: new Set()
      }
    },
    computed: {
      fileListStart: function () {
        return this.fileList.length - 1;
      },
      fileListEnd: function () {
        return this.fileList[this.fileList.length - 1].url
      },
      transformScale: {
        get() {
          return this.$data.size / 10;
        }
      },
    },
    watch: {
      videos: {
        deep: true,
        handler: function (next, pre) {
          if (pre.length === 0) {
            let fs = next.map(item => {
              return {url: Config.tencentPath + item}
            });
            //数据列表
            this.fileList = this.copyJson(fs);
            //上传组件列表
            this.upFileList = this.copyJson(fs);
          }
        }
      },
    },
    methods: {
      //深拷贝json
      copyJson(json){
        return JSON.parse(JSON.stringify(json));
      },
      // 在开始上传之前的钩子函数，该函数返回结果为true 则开始进行上传
      onBeforeUpload(file) {
        return this.tencentPresignedUrl(file);
      },

      //获取腾讯Bucketpresigned_url
      tencentPresignedUrl(file) {
        let {module} = this;
        return Http.get(Config.api.tencentPresignedUrl, {module: module}).then(res => {
          this.uploadData = {
            file: file,
            key: res.data.key,
            presigned_url: res.data.presigned_url
          }

          //需要去重
          this.imgRecord.add({
            uid: file.uid,
            name: file.name,
            key: res.data.key,
            presigned_url: res.data.presigned_url
          })
        })
      },
      
      //自定义上传
      async httpRequestUpload(e){
        let data = e.data;
        let res = await Http.put(data.presigned_url, data);
        /**
         *  也可在此处理成功或失败后事件
         * if(res.code === 0){

            }else{

            }
         */
      },
      
      //上传成功
      onSuccess(res, file, fileList) {
        let fileRecord = {}
        this.imgRecord.forEach(function (value) {
          // console.log(value)
          if (value.uid === file.uid) {
            fileRecord = value
          }
        });

        this.fileList.push({url: Config.tencentPath + fileRecord.key});
        // 将缓存起来的视频地址进行截取 只保留key值，存放在videos列表中
        let videos = this.fileList.map(item => item.url.substring(Config.tencentPath.length));

        //判断是否全部上传完成
        let undones = fileList.filter(item => item.status !== 'success' && item.status !== 'error');
        if(undones.length === 0){
          this.$emit('change', videos);
        }
      },

      //上传失败
      onError(err, file, fileList) {
        //判断是否全部上传完成
        let undones = fileList.filter(item => item.status !== 'success' && item.status !== 'error');
        if(undones.length === 0){
          this.$emit('change', videos);
        }
      },

      //上传超数
      onFileExceed(file, fileList) {
        Message.error(`最多只能上传 ${this.$props.limit} 个视频`);
      },

      //删除
      handleRemove(url) {
        //let ufs = this.$refs['myUpload'].uploadFiles;
        let fs = this.fileList.filter(item => item.url !== url);
        this.fileList = this.copyJson(fs);
        this.upFileList = this.copyJson(fs);
        // 将缓存起来的视频地址进行截取 只保留key值，存放在videos列表中
        let videos = this.fileList.map(item => item.url.substring(Config.tencentPath.length));
        this.$emit('change', videos);
      },

      //拖动排序视频
      onEndDraggable(){
        // 将缓存起来的视频地址进行截取 只保留key值，存放在videos列表中
        let videos = this.fileList.map(item => item.url.substring(Config.tencentPath.length));
        this.$emit('change', videos);
      },

      //查看视频
      handlePreview(url) {
        this.isShow = true;
      },

      handleDragstart(e) {
        this.drag.beginX = e.clientX;
        this.drag.beginY = e.clientY;
        this.drag.X = 0;
        this.drag.Y = 0;
        this.drag.isDraging = true;
        return false;
      },

      handleDrag(e) {
        if (e.clientX === this.drag.X && e.clientY === this.drag.Y) return; // 表示没有移动
        if (e.clientX === 0 && e.clientY === 0) return; // 表示拖拽结束

        // 第一次的偏移量
        if (this.drag.X === 0 && this.drag.Y === 0) {
          this.position.x = this.position.x + (e.clientX - this.drag.beginX);
          this.position.y = this.position.y + (e.clientY - this.drag.beginY);
        } else {
          this.position.x = this.position.x + (e.clientX - this.drag.X);
          this.position.y = this.position.y + (e.clientY - this.drag.Y);
        }

        this.drag.X = e.clientX;
        this.drag.Y = e.clientY;

        return false;
      },

      // 初始化视频状态。在视频切换 和 关闭窗口时。
      initImageStatus() {
        this.size = 10;
        this.position = Object.assign({}, this.posistion, {
          x: window.innerWidth * 0.8 * 0.5,
          y: window.innerHeight * 0.8 * 0.5
        });
        this.drag = Object.assign({}, this.drag, {
          isDraging: false,
          beginX: 0,
          beginY: 0,
          x: 0,
          y: 0
        });
      },

      //关闭视频
      handleCloseDialog() {
        this.initImageStatus();
        this.isShow = false;
      }
    }
  }
</script>

<style lang="scss">
  .my-upload{
    display: flex;
    align-items: center;
    height: 64px;
    >.draggable {
      height: inherit;
      >.avatar{
        display: inline-block;
        margin-right: 10px;
        box-sizing: border-box;
        width: 64px;
        height: inherit;
        border: 1px solid #c0ccda;
        border-radius: 3px;
        cursor: pointer;
        position: relative;
        &:hover > .float-layer{
          display: flex;
        }
        &:active > .float-layer{
          opacity: 0.5;
        }
        >.float-layer {
          display: none;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background: rgba($color: #000000, $alpha: 0.8);
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 9;
          i {
            font-size: 18px;
            color: #fff;
          }
          i:hover {
            font-weight: 600;
            font-size: 20px;
          }
          i + i {
            margin-left: 5px;
          }
        }
        img {
          width: 100%;
          height: 100%;
          border-radius: inherit;
        }
        img+img {
          margin-left: 5px;
        }
      }
    }
    .el-upload--picture-card {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 64px;
    }
    .el-upload-list__item{
      width: 64px;
      height: 64px;
    }
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 2s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .el-dialog.is-fullscreen {
    background: #23241f;
    display: flex;
    flex-direction: column;

    .el-dialog__header {
      border-bottom: none;
    }

    .el-dialog__body{
      flex: 1;
    }

    .image-preview-wrapper {
      /*background: #5daf34;*/
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .icon-wrapper {
        width: 20px;

        i {
          color: lightgrey;
          font-size: 30px;
          font-weight: 50;
          cursor: pointer;
        }

        i:hover {
          color: red;
        }

      }

      .image-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80vh;
        width: 80vw;
        position: relative;
        overflow: hidden;
        img {
          cursor: move;
          position: absolute;
          max-height: 100%;
          max-width: 100%;
        }

      }

    }
  }
</style>

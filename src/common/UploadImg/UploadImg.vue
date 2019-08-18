<template>
  <div :id="key" class="my-upload">
    <draggable class="draggable" v-model="fileList" :options="{group:'people'}">
      <div
        class="avatar"
        v-for="element in fileList"
        :key="element.uid"
        @mouseleave="handleMouseleave"
        @mouseover="handleMouseover(element.url)"
      >
        <span class="float-layer" v-if="mouseoverItem === element.url">
          <i class="el-icon-delete" @click="handleRemove(element.url)"></i>
          <i class="el-icon-search" @click="handlePreview(element.url)"></i>
        </span>
        <img :src="element.url + '_min200x200'">
      </div>
    </draggable>
    <el-upload
      v-if="fileList.length < limit"
      multiple
      :limit="limit"
      :action="tencentUpPath"
      :http-request="httpRequestUpload"
      :data="uploadData"
      :show-file-list="false"
      list-type="picture-card"
      ref="upload"
      accept="image/gif, image/jpg, image/jpeg, image/png"
      :on-exceed="onFileExceed"
      :before-upload="beforeUpload"
      :on-success="upScuccess"
      :on-error="upError"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="isShow" append-to-body fullscreen :before-close="handleCloseDialog" style="background: #23241f;">
      <div class="control">
        <i class="el-icon-minus" @click="handleMinus"></i>
        <i class="el-icon-plus" @click="handlePlus"></i>
      </div>
      <div class="image-preview-wrapper">
        <div class="icon-wrapper">
          <i class="el-icon-arrow-left" v-if="fileList.length > 1 && currentPreviewImage !== fileList[0].url" @click="handleToLeft"></i>
        </div>
        <div class="image-wrapper">
          <img
            :src="currentPreviewImage"
            :style="`transform: translate(-50%, -50%) scale(${transformScale}); left: ${position.x}px; top: ${position.y}px;`"
            @dragstart="handleDragstart"
            @drag="handleDrag"
          >
        </div>
        <div class="icon-wrapper">
          <i class="el-icon-arrow-right" v-if="fileList.length > 1 && currentPreviewImage !== fileList[fileList.length - 1].url" @click="handleToRight"></i>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * 参数说明：
   * images: 为数组类型，表示上传图片的队列。默认为[]
   * module: 指定需要上传至哪个模块，默认为item
   * limit：指定上传文件的数量限制，默认为1
   */
  import { Upload, Dialog, Message } from 'element-ui';
  import draggable from 'vuedraggable';
  import { Http, Config } from '@/util';

  export default {
    name: "UploadImg",
    components: {
      'el-upload': Upload,
      'el-dialog': Dialog,
      'draggable': draggable
    },
    model: {
      prop: 'images',
      event: 'change',
    },
    props: {
      avatar: { type: Boolean },
      images: { type: Array, default: [] },
      module: {type: String, default: 'item'},
      limit: {type: Number, default: 1}
    },
    data() {
      // 获取传递进来的默认值
      let fileList = this.images ? this.images.map(item => {
        return {url: Config.tencentPath + item}
      }) : [];
      // 生成组件的id值，便于更新图片列表后，调用
      let key = `upload-${Math.random().toString(16).substring(2)}`;
      return {
        key: key,
        tencentPath: Config.tencentPath,
        tencentUpPath: Config.tencentUpPath,
        uploadData: {},
        fileList: fileList, // 默认的图片列表
        mouseoverItem: '',
        isShow: false,
        currentPreviewImage: '',
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
      images: {
        deep: true,
        handler: function (next, pre) {
          if (pre.length === 0) {
            this.fileList = next.map(item => {
              return {url: Config.tencentPath + item}
            });
          }
        }
      },
      // fileList: {
      //   handler: function (next, pre) {
      //     if (next.length === pre.length && next !== pre) {
      //       let images = this.fileList.map(item => item.url.substring(Config.tencentPath.length));
      //       this.$emit('change', images);
      //     }
      //   }
      // },
      imageUrl(a, b) {
        return a;
      }
    },
    methods: {
      // 在开始上传之前的钩子函数，该函数返回结果为true 则开始进行上传
      beforeUpload(file) {
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
      upScuccess(res, file, fileList) {

        let fileRecord = {}

        this.imgRecord.forEach(function (value) {
          // console.log(value)
          if (value.uid === file.uid) {
            fileRecord = value
          }
        })

        this.fileList.push({url: Config.tencentPath + fileRecord.key});
        // 将缓存起来的图片地址进行截取 只保留key值，存放在images列表中
        let images = this.fileList.map(item => item.url.substring(Config.tencentPath.length));
        this.$emit('change', images);
      },

      parentHandleclick(e) {
        this.imageUrl = ''
      },
      upError(err, file, fileList) {
        Message.error('图片上传失败！请重新尝试...');
      },

      onFileExceed(file, fileList) {
        Message.error(`最多只能上传 ${this.$props.limit} 张图片`);
      },

      handleMouseover(url) {
        if (this.mouseoverItem !== url) {
          this.mouseoverItem = url;
        }
      },

      handleMouseleave() {
        this.mouseoverItem = '';
      },

      handleRemove(url) {
        // console.log('handleRemove: ', url, this.fileList);

        let before = this.fileList;
        this.fileList = this.fileList.filter(item => item.url !== url);
        // 将缓存起来的图片地址进行截取 只保留key值，存放在images列表中
        let images = this.fileList.map(item => item.url.substring(Config.tencentPath.length));
        this.$emit('change', images);
      },

      handlePreview(url) {
        this.currentPreviewImage = url;
        this.isShow = true;
      },

      handleMinus() {
        if (this.$data.size <= 4) return;
        this.$data.size -= 2;
      },

      handlePlus() {
        if (this.$data.size >= 20) return;
        this.$data.size += 2;
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

      handleToLeft() {
        this.fileList.some((item, index) => {
          if (item.url === this.currentPreviewImage) {
            // 找到以后，判断是否是最小的位置了
            if (index <= 0) {
              // console.log('已经是第一张了');
            } else {
              this.initImageStatus();
              this.currentPreviewImage = this.fileList[index - 1].url
            }
            return true;
          }
        });
      },

      handleToRight() {
        this.fileList.some((item, index) => {
          if (item.url === this.currentPreviewImage) {
            // 找到以后，判断是否是最小的位置了
            if (index >= this.fileList.length - 1) {
              // console.log('已经是最后一张了');
            } else {
              this.initImageStatus();
              this.currentPreviewImage = this.fileList[index + 1].url
            }
            return true;
          }
        });
      },

      // 初始化图片状态。在图片切换 和 关闭窗口时。
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

      handleCloseDialog() {
        this.initImageStatus();
        this.currentPreviewImage = '';
        this.isShow = false;
      }
    }
  }
</script>

<style lang="scss">
  .my-upload {
    display: flex;
    align-items: center;
    height: 64px;
  }
  .my-upload .draggable {
    height: inherit;
  }
  .my-upload .avatar {
    display: inline-block;
    margin-right: 10px;
    box-sizing: border-box;
    width: 64px;
    height: inherit;
    border: 1px solid #c0ccda;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    .float-layer {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background-color: #000000;
      opacity: .8;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 9;
      i {
        font-size: 18px;
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
  .my-upload .el-upload--picture-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
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

    .control {
      display: flex;
      justify-content: center;

      i {
        font-size: 20px;
        cursor: pointer;
      }

      i:hover {
        color: #FFFFFF;
      }

      i + i {
        margin-left: 20px;
      }
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

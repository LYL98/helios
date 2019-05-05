<!--
  参数说明：
      images: 为数组类型，表示上传图片的队列。默认为[]
      module: 指定需要上传至哪个模块，默认为item
      limit：指定上传文件的数量限制，默认为1
-->
<template>
  <div :id="key" class="my-avatar-upload"  @mouseleave="handleMouseleave"
      @mouseover="handleMouseover">
    <el-upload
      class="avatar-uploader"
      v-if="avatar"
      :action="tencentUpPath"
      :http-request="httpRequestUpload"
      :data="uploadData"
      :show-file-list="false"
      list-type="picture"
      :on-error="upError"
      ref="upload"
      accept="image/gif, image/jpg, image/jpeg, image/png"
      :on-success="upScuccess"
      :on-remove="handleRemove"
      :before-upload="beforeUpload" >
      <i class="el-icon-circle-check" v-show="checked" ></i>
      <img v-if="imageUrl" :src="imageUrl" class="avatar" >
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <i class="el-icon-close" ></i>
      <span class="float-layer" v-if="imageUrl && mouseover">
        <i class="el-icon-delete del" v-bind:class="{ cen: notShowView }" @click.stop="handleRemove"></i>
        <i v-if="!notShowView" class="el-icon-search view" @click.stop="handlePreview"></i>
      </span>
    </el-upload>
    <el-upload
      v-else
      :action="tencentUpPath"
      :data="uploadData"
      :show-file-list="false"
      list-type="picture-card"
      :limit="limit"
      :file-list="defaultFileList"
      ref="upload"
      accept="image/gif, image/jpg, image/jpeg, image/png"
      :before-upload="beforeUpload"
      :on-success="upScuccess"
      :on-error="upError"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body fullscreen :before-close="handleCloseDialog" style="background: #23241f; z-index:9999;">
      <img width="100%" :src="imageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { Upload, Message ,Dialog} from 'element-ui';
  import { Base } from '@/service';
  import { Config } from '@/util';

  export default {
    name: "Avatar",
    components: {
      'el-upload': Upload,
      'el-dialog': Dialog,
    },
    model: {
      prop: 'images',
      event: 'change',
    },
    props: {
      avatar:{type:Boolean},
      checked:{type:Boolean},
      notShowView:{type:Boolean},
      images: { validator: function(value) { return (typeof value === 'string') || value instanceof Array }, default: [] },
      module: { type: String, default: 'item' },
      limit: { type: Number, default: 1 }
    },
    data() {
      let defaultFileList = this.images.map(item => {
        return { url: Config.tencentPath + item }
      });
      // 获取传递进来的默认值
      let fileList = this.images.map(item => {
        return { url: Config.tencentPath + item }
      });
      // 生成组件的id值，便于更新图片列表后，调用
      let key = `upload-${Math.random().toString(16).substring(2)}`;
      return {
        dialogVisible:false,
        mouseover:false,
        key: key,
        tencentPath: Config.tencentPath,
        tencentUpPath: Config.tencentUpPath,
        uploadData: {},
        imageUrl:'',
        defaultFileList: defaultFileList // 默认的图片列表
      }
    },
    watch: {
        images: {
            deep: true,
            handler: function(next, pre) {
                if (pre.length === 0) {
                    this.fileList = next && next.map(item => {
                        return { url: Config.tencentPath + item }
                    });
                }

                let vn =  (typeof next == 'string' ? next : next[0])
                if(this.avatar && vn) this.imageUrl = Config.tencentPath + vn;
                if (next.length === 0) {
                    this.$refs['upload'].clearFiles();
                    // console.log('this.$refs[\'upload\'].fileList', this.$refs['upload'].fileList);
                }
            }
        },
        imageUrl(a,b){
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
        return Base.tencentPresignedUrl({module: module}).then(res => {
          this.uploadData = {
            file: file,
            key: res.data.key,
            presigned_url: res.data.presigned_url
          }
        })
      },

      //自定义上传
      async httpRequestUpload(e){
        let { uploadData } = this;
        let res = await Base.uploadToTencent(e.data);
        /**
         *  也可在此处理成功或失败后事件
         * if(res.code === 0){

            }else{

            }
         */
      },

      //上传成功
      upScuccess(res, file, fileList) {
        file.url = Config.tencentPath + this.uploadData.key;

        // 将缓存起来的图片地址进行截取 只保留key值，存放在images列表中
        let images = fileList.map(item => item.url.substring(Config.tencentPath.length));
        this.$emit('change', images);
        if(this.avatar) this.imageUrl = Config.tencentPath + images[0];
        // 检查文件上传个数是否超过限制？
        if (fileList.length >= this.limit && !this.avatar) {
          document.querySelector(`#${this.key}`).querySelector('.el-upload--picture-card').style.display = 'none';
        }
      },
      parentHandleclick(e) {
        this.imageUrl = ''
      },
      upError(err, file, fileList) {
        Message.error('图片上传失败！请重新尝试...');
      },

      handleMouseover(url) {
        this.mouseover = true;
        this.mouseoverItem = url;
      },

      handleMouseleave() {
        this.mouseover = false;
        this.mouseoverItem = '';
      },

      handlePreview(url) {
        this.dialogVisible = true;
      },
       handleCloseDialog() {
        this.dialogVisible = false;
      },
      handleRemove() {
        if(!this.avatar) {
          let before = this.fileList;
          this.fileList = this.fileList.filter(item => item.url !== url);
          // 将缓存起来的图片地址进行截取 只保留key值，存放在images列表中
          let images = this.fileList.map(item => item.url.substring(Config.tencentPath.length));
          this.$emit('change', images);
          
          if (fileList.length < this.limit ) {
            document.querySelector(`#${this.key}`).querySelector('.el-upload--picture-card').style.display = 'inline-block';
          }
        } 
        this.imageUrl = '';
        this.$emit('change', this.imageUrl ? [this.imageUrl]: []);
       
    }
  }
  }
</script>

<style lang="scss">
  .my-avatar-upload {
    display: flex;
    align-items: center;
    width: 64px;
    .fade-enter-active, .fade-leave-active {
      transition: opacity 2s;
    }
    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      width: 64px;
      height: 64px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      .float-layer {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
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
          color: #8c939d;
          width: 30px;
          height: 64px;
          line-height: 64px;
        }
        i.del{
          text-align: right;
          margin-right:2px; 
        }
        i.del.cen{
          text-align: center;
        }
        i.view{
          text-align: left;
          margin-left:2px; 
        }
        i:hover {
          font-weight: 600;
          font-size: 20px;
          color: #8c939d;
        }
      }
    }
    .avatar-uploader .el-icon-circle-check{
      position: absolute;
      color: #0bf014;
      font-size: 24px;
      right: 0;
      z-index: 9;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      color: #8c939d;
      width: 64px;
      height: 64px;
      line-height: 64px;
      text-align: center;
    }
    .avatar {
      width: 64px;
      height: 64px;
      display: block;
       
    }
   
  }
  .my-avatar-upload .avatar {
    display: inline-block;
    margin-right: 10px;
    width: 62px;
    height: 62px;
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
  .my-avatar-upload .el-upload--picture-card {
    /*width: 64px;*/
    /*height: 64px;*/
    /*line-height: 76px;*/
    /*margin-top: -14px;*/
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
  }
 .el-dialog.is-fullscreen {
    background: #23241f;
    display: flex;
    flex-direction: column;
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

      img {
        max-width: 90%;
        max-height: 90%;
      }

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
  }


  
</style>

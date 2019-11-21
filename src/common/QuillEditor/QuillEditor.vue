<template>
  <div class="my-quill-editor">
    <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      :disabled="disabled"
      @focus="onEditorFocus($event)"
    >
      <template slot="toolbar">
        <el-collapse-transition name="fade">
          <div class="upload-control" v-if="isUploading"
               style="display: flex; flex-direction: column; border: 1px solid #ccc; border-bottom: none; padding: 10px 5px;">
            <i class="el-icon-close" @click="isUploading = false"
               style="cursor: pointer; align-self: flex-end; margin-bottom: 10px;"></i>
            <div style="display: flex">
              <el-input
                size="mini"
                v-model="mediaUrl"
                :placeholder="uploadType === 'image' ? '输入图片的网络地址' : '只支持腾讯视频'"
              >
              </el-input>
              <el-button
                size="mini"
                type="primary"
                style="margin-left: 10px;"
                @click="insertMediaUrl"
              >
                {{`插入${uploadType === 'image' ? '图片' : '视频'}`}}
              </el-button>
            </div>
            <el-upload
              style="margin-top: 10px;"
              :action="tencentUpPath"
              :http-request="httpRequestUpload"
              :data="uploadData"
              :accept="acceptType"
              :before-upload="beforeUpload"
              :on-success="upScuccess"
              :on-error="upError"
              ref="editor-upload"
            >
              <el-button
                id="inputBtn"
                size="mini"
                type="primary"
                icon="el-icon-upload"
                element-loading-text="上传中,请稍候..."
              >{{`本地${uploadType === 'image' ? '图片' : '视频'}上传`}}
              </el-button>
            </el-upload>
          </div>
        </el-collapse-transition>
      </template>
    </quill-editor>
  </div>
</template>

<script>
  import {Input, Upload, Button, Message} from 'element-ui';
  import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
  import {quillEditor, Quill} from "vue-quill-editor";
  import {Http, Config} from '@/util';

  import './quill.core.min.css';
  import './quill.snow.min.css';
  import './quill.bubble.min.css';


  export default {
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {type: String, default: ''},
      module: {type: String, default: 'item'},
      disabled: {type: Boolean, default: false}
    },
    components: {
      'quill-editor': quillEditor,
      'el-input': Input,
      'el-upload': Upload,
      'el-button': Button,
      'el-collapse-transition': CollapseTransition
    },
    mounted() {

      let toolbar = this.$refs.myQuillEditor.quill.getModule('toolbar');
      toolbar.addHandler('image', this.imgHandler)
      toolbar.addHandler('video', this.videoHandler)

    },
    data() {
      return {
        tencentPath: Config.tencentPath,
        tencentUpPath: Config.tencentUpPath,
        editorOption: {
          placeholder: '请输入内容...',
          modules: {
            /*toolbar: [
              [{'font': []}, {'size': ['small', false, 'large', 'huge']}, {'header': [false, 1, 2, 3, 4, 5, 6]}],
              [{'color': []}, {'background': []}, 'bold', 'italic', 'underline', 'strike'],
              [{'list': 'ordered'}, {'list': 'bullet'}, 'blockquote', {'script': 'sub'}, {'script': 'super'}],
              [{'indent': '-1'}, {'indent': '+1'}, {'align': ''}, {'align': 'center'}, {'align': 'right'}, {'align': 'justify'}],
              ['image', 'video'],
              ['clean']
            ]*/
            toolbar: [
              [{'size': ['small', false, 'large', 'huge']}],
              [{'color': []}, {'background': []}, 'bold', 'italic', 'underline', 'strike'],
              ['image']
            ]
          },
        },
        editorIndex: 0,
        editorRange: {
          index: 0,
          length: 0
        },
        mediaUrl: '',
        isUploading: false,
        uploadType: 'image',
        uploadData: {},
      }
    },
    computed: {
      quill: function () {
        return this.$refs.myQuillEditor.quill;
      },
      acceptType: function () {
        return this.uploadType === 'image' ? 'image/gif, image/jpg, image/jpeg, image/png' : 'video/mp4';
      },
      content: {
        get() {
          return this.$props.value;
        },
        set(v) {
          this.editorRange = Object.assign({}, this.editorRange, this.quill.getSelection());
          this.$emit('change', v);

        }
      }
    },
    methods: {

      // 图片上传前 获取腾讯Bucketpresigned_url
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

      upScuccess(res, file, fileList) {
        // 获取上传后的图片地址
        let url = this.tencentPath + this.uploadData.key;
        // 插入文件
        this.quill.insertEmbed(this.editorRange.index, this.uploadType, url);
        // 调整光标到最后
        this.quill.setSelection(this.editorRange.index + 1);
        this.$refs['editor-upload'].clearFiles();
      },

      insertMediaUrl() {
        if (this.mediaUrl === '') {
          return;
        }
        let insert = '';
        if (this.uploadType === 'video') {
          //截取Pc端视频ID
          let index = this.mediaUrl.lastIndexOf('.html');
          if (index === -1) {
            Message.error('请输入正确的视频地址格式！');
            return;
          }
          let Pc_Tx_Id_w = this.mediaUrl.substr(0, index);
          let video_id = Pc_Tx_Id_w.substr(Pc_Tx_Id_w.lastIndexOf('/') + 1, Pc_Tx_Id_w.length);
          insert = 'https://v.qq.com/iframe/player.html?vid=' + video_id;
        } else {
          insert = this.mediaUrl;
        }
        // 插入文件
        this.quill.insertEmbed(this.editorRange.index, this.uploadType, insert);
        // 调整光标到最后
        this.quill.setSelection(this.editorRange.index + 1);
      },

      onEditorFocus() {
        this.editorRange = this.quill.getSelection();
      },

      upError() {
        this.$refs['editor-upload'].clearFiles();
      },

      imgHandler(state) {
        if (state) {
          this.uploadType = 'image';
          this.isUploading = true;
          this.mediaUrl = '';
        }
      },

      videoHandler(state) {
        if (state) {
          this.uploadType = 'video';
          this.isUploading = true;
          this.mediaUrl = '';
        }
      }

    }
  }
</script>

<style lang="scss">


  .my-quill-editor {
    line-height: 24px;
    .ql-container {
      min-height: 200px;
    }

    .slot {
      background: red;
      display: flex;
      align-items: center;
    }

    .ql-snow .ql-picker.ql-font {
      width: 90px;
      font-size: 12px;
    }

    .ql-snow .ql-picker.ql-size {
      width: 90px;
      font-size: 12px;
    }

    .ql-snow .ql-picker.ql-header {
      width: 90px;
      font-size: 12px;
    }

    .ql-snow .ql-tooltip[data-mode=link]::before {
      content: "请输入链接地址:";
    }

    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
      border-right: 0px;
      content: '保存';
      padding-right: 0px;
    }

    .ql-snow .ql-tooltip[data-mode=video]::before {
      content: "请输入视频地址:";
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
      content: '14px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
      content: '10px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
      content: '18px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
      content: '32px';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
      content: '段落';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
      content: '标题1';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
      content: '标题2';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
      content: '标题3';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
      content: '标题4';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
      content: '标题5';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
      content: '标题6';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
      content: '标准字体';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
      content: '衬线字体';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
      content: '等宽字体';
    }
  }

</style>

<template>
  <div style="cursor: pointer; display: flex; align-items: center;" @click="handleClick">
    <slot></slot>
    <el-dialog :visible.sync="isShow" v-if="isShow" :before-close="handleCloseDialog" append-to-body fullscreen
               style="background: #23241f;">
      <div class="control">
        <i class="el-icon-minus" @click="handleMinus"></i>
        <i class="el-icon-plus" @click="handlePlus"></i>
      </div>
      <div class="image-preview-wrapper">
        <div class="icon-wrapper">
          <i class="el-icon-arrow-left" @click="handleToLeft"
             v-show="previewList.length > 1 && currentPreviewImage !== previewList[0].src"></i>
        </div>
        <div class="image-wrapper">
          <img
            :src="currentPreviewImage"
            :style="`transform: translate(-50%, -50%) scale(${transformScale}); left: ${position.x}px; top: ${position.y}px;`"
            @selectstart="handleSelectstart"
            @dragstart="handleDragstart"
            @drag="handleDrag"
          >
        </div>
        <div class="icon-wrapper">
          <i class="el-icon-arrow-right" @click="handleToRight"
             v-show="previewList.length > 1 && currentPreviewImage !== previewList[previewList.length - 1].src"></i>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {Dialog} from 'element-ui';

  export default {
    name: "ImagePreview",
    components: {
      'el-dialog': Dialog
    },
    data() {
      return {
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
        }
      }
    },
    computed: {
      previewList: function () {
        return this.$slots.default
          ? this.$slots.default.filter(item => item.tag === 'img').map(item => {
            let {src} = item.data.attrs;
            return {src: src.split('_min200x200')[0]}
          })
          : []
      },
      transformScale: {
        get() {
          return this.$data.size / 10;
        }
      }
    },
    methods: {
      handleClick(e) {
        let target = e.target;
        if (target.localName === 'img') {
          this.currentPreviewImage = target.src.split('_min200x200')[0];
          this.isShow = true;
        }
      },

      showImageManual(image) {
        this.currentPreviewImage = image;
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

      handleSelectstart() {
        return false;
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
        this.previewList.some((item, index) => {
          if (item.src === this.currentPreviewImage) {

            // 找到以后，判断是否是最小的位置了
            if (index <= 0) {
              // console.log('已经是第一张了');
            } else {
              this.initImageStatus();
              this.currentPreviewImage = this.previewList[index - 1].src
            }
            return true;
          }
        });
      },
      handleToRight() {
        this.previewList.some((item, index) => {
          if (item.src === this.currentPreviewImage) {
            // 找到以后，判断是否是最小的位置了
            if (index >= this.previewList.length - 1) {
              // console.log('已经是最后一张了');
            } else {
              this.initImageStatus();
              this.currentPreviewImage = this.previewList[index + 1].src
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
        this.$data.currentPreviewImage = '';
        this.$data.isShow = false;
      }
    }
  }
</script>

<style lang="scss">
  .el-dialog.is-fullscreen {
    background: #23241f;
    display: flex;
    flex-direction: column;

    .el-dialog__header {
      border-bottom: none;
    }

    .el-dialog__body {
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

<template>
  <div :id="qrcodeId"></div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "QrCode",
  //components: { QRCode },
  props: {
    content: { type: String, default: '' }, //二维码内容
    width: { type: Number, default: 124 },
    height: { type: Number, default: 124 },
    background: { type: String, default: '#fff' },
    foreground: { type: String, default: '#000' },
    render: { type: String, default: 'canvas' } //设置渲染方式（有两种方式 table和canvas，默认是canvas）
  },
  mounted(){
    this.$nextTick(function(){
      this.qrcode();
    });
  },
  data(){
    if(!window.qrcodeId){
      window.qrcodeId = 1;
    }else{
      window.qrcodeId++;
    }
    let qrcodeId = 'qrcode' + window.qrcodeId;
    return{
      qrcodeId: qrcodeId
    }
  },
  methods: {
    // 生成二维码
    qrcode() {
      let { qrcodeId, content, width, height, background, foreground, render } = this;
      let qrcode = new QRCode(qrcodeId, {
        width: width,
        height: height,
        text: content, // 二维码内容
        render: render,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        background: background,   // 背景色
        foreground: foreground    // 前景色
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

<template>
  <el-dialog title="" :visible="isShow" width="400px" :before-close="cancelKey">
    <div class="key-div">
      <div class="number-div">
        <a href="javascript:void(0);" @click="upDown('down')">-</a>
        <p @click="clickNum">
          <span :class="`span1 ${isSelect && 'select'}`">{{num}}</span>
          <span class="span2">&nbsp;</span>
        </p>
        <a href="javascript:void(0);" @click="upDown('up')">+</a>
      </div>
      <div class="key-a-div">
        <div>
          <a href="javascript:void(0);" @click="aClick('1')">1</a>
          <span></span>
          <a href="javascript:void(0);" @click="aClick('2')">2</a>
          <span></span>
          <a href="javascript:void(0);" @click="aClick('3')">3</a>
        </div>
        <div>
          <a href="javascript:void(0);" @click="aClick('4')">4</a>
          <span></span>
          <a href="javascript:void(0);" @click="aClick('5')">5</a>
          <span></span>
          <a href="javascript:void(0);" @click="aClick('6')">6</a>
        </div>
        <div>
          <a href="javascript:void(0);" @click="aClick('7')">7</a>
          <span></span>
          <a href="javascript:void(0);" @click="aClick('8')">8</a>
          <span></span>
          <a href="javascript:void(0);" @click="aClick('9')">9</a>
        </div>
        <div>
          <a href="javascript:void(0);" v-if="type === 'Number'"></a>
          <a href="javascript:void(0);" @click="aClick('.')" v-else>.</a>
          <span></span>
          <a href="javascript:void(0);" @click="aClick('0')">0</a>
          <span></span>
          <a href="javascript:void(0);" @click="aClick('delete')" class="iconfont">&#xe6e5;</a>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click.native="cancelKey">取 消</el-button>
      <el-button type="primary" @click.native="confirmKey">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Dialog, Button } from 'element-ui';
export default {
  name: "NumberKey",
  components: {
    'el-dialog': Dialog,
    'el-button': Button
  },
  data() {
    return {
      type: 'Number', //默认Number，有Number、Price、Weight
      num: null,
      isShow: false,
      isSelect: false,
      confirm: null,
      cancel: null
    };
  },
  methods: {
    //单击数量
    clickNum(){
      let { num } = this;
      if(num) this.$data.isSelect = true;
    },
    //加减
    upDown(type){
      let { num, isSelect } = this;
      let d = num ? Number(num) : 0;
      if(type === 'up'){
        d++;
      }else{
        d !== 0 && d--;
      }
      this.$data.isSelect = true;
      this.$data.num = d.toString();
    },
    //单击键位
    aClick(value) {
      let { num, isSelect, type } = this;
      let d = '';
      //
      if(isSelect){
         num = '';
         this.$data.isSelect = false;
      }

      //回退
      if(value === 'delete'){
        if(num.length > 0){
          d = num.substring(0, num.length - 1);
        }else{
          d = '';
        }
      }else{
        d = num + value;
      }

      //判断数据有效性
      if(d.indexOf('..') >= 0 || d.indexOf('.') === 0 || d.indexOf('00') === 0 || d > 1000000){
        return false;
      }

      //如果输入是重量(小数点后只能有一位)
      if(type === 'Weight' && d.indexOf('.') > 0 && d.indexOf('.') < d.length - 2){
        return false;
      }

      //如果输入的是金额(小数点后只能有两位)
      if(type === 'Price' &&  d.indexOf('.') > 0 && d.indexOf('.') < d.length - 3){
        return false;
      }

      this.$data.num = d;
    },

    //显示输入法
    show({ num, type = 'Number', confirm, cancel }){
      this.$data.num = (num || num === 0 ? num.toString() : '');
      if(num !== null){
        this.$data.isSelect = true;
      }else{
        this.$data.isSelect = false;
      }
      this.$data.type = type;
      this.$data.confirm = confirm;
      this.$data.cancel = cancel;
      this.$data.isShow = true;
    },
    //隐藏输入法
    hide(){
      this.$data.num = null;
      this.$data.isShow = false;
    },
    //取消
    cancelKey(){
      let cancel = this.cancel;
      typeof cancel === 'function' && cancel();
      this.hide();
    },
    //确定
    confirmKey(){
      let confirm = this.confirm;
      let n = this.num;
      if(!n) return;
      typeof confirm === 'function' && confirm(Number(n));
      this.hide();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.key-div {
  .number-div {
    display: flex;
    text-align: center;
    align-items: center;
    padding: 20px 0;
    > a {
      flex: 1;
      display: block;
      height: 38px;
      line-height: 38px;
      font-size: 24px;
      color: #666;
    }
    > p {
      border: 1px solid #f3f4f6;
      flex: 1;
      display: block;
      height: 36px;
      border-radius: 3px;
      font-size: 16px;
      .span1 {
        display: inline-block;
        height: 16px;
        line-height: 16px;
        margin-top: 10px;
      }
      .span1.select {
        padding: 0 5px;
        background: rgba($color: #000000, $alpha: 0.2);
      }
      .span2 {
        display: inline-block;
        width: 1px;
        height: 14px;
        background: #999;
        position: relative;
        top: 4px;
        left: -3px;
        animation: blink 1s infinite steps(1, start);
      }
    }
  }

  @keyframes blink {
    0%, 100% {
      background-color: #000;
    }
    50% {
      background-color: #fff;
    }
  }

  .key-a-div {
    border-top: 1px solid #f3f4f6;
    > div {
      display: flex;
      border-bottom: 1px solid #f3f4f6;
      a {
        flex: 1;
        display: block;
        text-align: center;
        height: 52px;
        line-height: 52px;
        font-size: 24px;
        color: #666;
      }
      a:active {
        background: #f3f4f6;
      }
      span {
        display: block;
        background: #f3f4f6;
        width: 1px;
        height: 52px;
      }
    }
  }
}
</style>

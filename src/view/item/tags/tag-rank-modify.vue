<template>
  <el-form :model="formData" ref="ruleForm" label-width="120px" class="pr-30">
    <el-form-item
      label="商品名称："
    >
      <span v-if="item">{{ item.title }}</span>
      <span v-else>-</span>
    </el-form-item>
    <el-form-item
      label="排序"
      prop="rank"
      :rules="[{ validator: validRunk, trigger: 'change'}]"
    >
      <el-input size="small"  v-model="formData.rank"   @keyup.enter.native="onSubmit"/>
    </el-form-item>
    
    <div class="display-flex justify-content-end">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onSubmit">确认</el-button>
    </div>
  </el-form>

</template>

<script>
  import { Row, Col, Form, FormItem, Input, Button } from 'element-ui';
  import { Http, Config, DataHandle } from '@/util';
  export default {
    name: 'tag-rank-modify',
    components: {
      'el-row': Row,
      'el-col': Col,
      'el-form': Form,
      'el-form-item': FormItem,
      'el-input': Input,
      'el-button': Button,
    },
    props: {
      item: { type: Object, default: {} }
    },
    data() {
      return {
        formData: {  rank: null ,}
      }
    },
    created() {
    //   this.DataHandle = DataHandle;
    // console.log(item);
    
      this.$data.formData = {
        item_id: this.$props.item.id,
        item_tag_id:this.$props.item.item_tag_id,
        rank: this.$props.item.rank

      };
      
      
    },
    methods: {
      validRunk(rules, value, callback) {
        let rank = this.$data.formData.rank;
        if (rank){
             if (isNaN(rank)) return callback(new Error('排序必须为数字'));
        if (rank < 0) return callback(new Error('排序必须大于零'));
        // if (rank >= 1000) return callback(new Error('排序不能超过1000'));
        if (!/^-?\d+$/.test(rank)) return callback(new Error('排序不支持小数'));
        callback();

        }
        callback();
       
      },

      onCancel() {
        this.$emit('cancel');
      },

      onSubmit() {
        this.$refs['ruleForm'].validate().then(async volid => {
          if (!volid) return;
            this.$data.formData.rank = Number(this.$data.formData.rank)
          let formData = this.$data.formData;
        //   formData.discount = DataHandle.handleDiscount(formData.discount);
        

          let res = await Http.post(Config.api.itemTagRankEdit,  formData );
          if (res.code === 0) {
            this.$message({message: '修改成功', type: 'success'});
            this.$emit('submit');
          } else {
            this.$message({title: '提示', message: res.message, type: 'error'});
          }
        });
      }
    }
  };
</script>

<style scoped>
  .pr-30 {
    padding-right: 30px;
  }
  .display-flex {
    display: flex;
  }
  .justify-content-end {
    justify-content: flex-end;
  }
</style>

<template>
  <div class="detailCustomer" :model="formData" >
    <el-form label-position="right" label-width="120px" style="width: 780px;" >
      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="门店名称:">
              {{formData.store.title}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="县域:">
              {{formData.city.title}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="展示分类:">
              {{formData.display_class.title}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="商品名称:">
              {{formData.title}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="品牌:">
              {{formData.brand}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="规格:">
              {{formData.item_spec}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="原进货渠道:">
              {{formData.purchase_channel}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="提报时间:">
              {{formData.created}}

          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item label="描述:">
              <div>{{formData.remark}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :span="10">
          <el-form-item >
              <div style="display: flex">
                  <img class="myImg" v-for="(item,index) in formData.images" :src="tencentPath + item + '_min200x200'" alt="" :key="index">
              </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {
  Form,
  FormItem,
  Button,
  Input,
  MessageBox,
  Message,
  Dialog,
  Radio,
  RadioGroup,
  DatePicker,
  Select,
  Option,
  Row,
  Col
} from "element-ui";
import { Http, Config, DataHandle, Verification } from "@/util";

export default {
  name: "DetailCustomer",
  components: {
    "el-form": Form,
    "el-form-item": FormItem,
    "el-row": Row,
    "el-col": Col
  },
  props:{
      formData:{
          type: Object
      }
  },
  data() {
    return {
        tencentPath: Config.tencentPath,
    };
  }
};
</script>
<style lang="scss" scoped>
.myImg {
  display:block;
  min-width: 64px; 
  height: 64px; 
  margin-right: 16px
}
</style>
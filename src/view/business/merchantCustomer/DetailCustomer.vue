<template>
  <div class="detailCustomer">
    <el-form>
      <div style="display:flex; ">
        <el-form-item label="门店名称">
        </el-form-item>
        <el-form-item label="县域"></el-form-item>
      </div>
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
  Option
} from "element-ui";
import { Http, Config, DataHandle, Verification } from "@/util";

export default {
  name: "DetailCustomer",
  components: {
    "el-form": Form,
    "el-form-item": FormItem
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
</style>

/*
* js验证模块
* xuxuepu edit 2016-3-13
*/

export default {
  testStrs: {
    isNull: /^[ ]+$/,
    isPrice: /^[0-9]*\.*[0-9]{0,2}$/,
    isWeight: /^[0-9]*\.*[0-9]{0,1}$/,
    isPercent: /^[-]{0,1}[0-9]*\.*[0-9]{0,1}$/,
    isInteger: /^[-]{0,1}[0-9]{1,}$/,
    checkMobile: /^1\d{10}$/, ///^1[3|4|5|7|8|9][0-9]{9}$/;
    isNumber: /^[0-9]+$/,
    isEmail: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    isNumberOrAlpha: /^[0-9a-zA-Z]+$/,
    isValidValue: /^[0-9]*\.*[0-9]+$/
  },
  /*
    * 用途：检查输入字符串是否为空或者全部都是空格 输入：str 返回： 如果全是空返回true,否则返回false
    */
  isNull: function (str) {
    if (str == "")
      return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
  },
  /**
   * 判断是否输入金额
   * @param str
   */
  isPrice: function (str) {
    // var regu=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    // var regu=/^[1-9]*\.*[0-9]{0,2}$/;
    var regu = /^[0-9]*\.*[0-9]{0,2}$/;
    return regu.test(str);
  },

  /**
   * 判断是否输入重量
   * @param str
   */
  isWeight: function (str) {
    // var regu=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    // var regu=/^[1-9]*\.*[0-9]{0,2}$/;
    var regu = /^[0-9]*\.*[0-9]{0,1}$/;
    return regu.test(str);
  },

  /**
   * 判断是否输入百分数
   * @param str
   */
  isPercent: function (str) {
    var regu = this.testStrs.isPercent;
    return regu.test(str);
  },

  /*
    * 用途：检查输入对象的值是否符合整数格式 输入：str 输入的字符串 返回：如果通过验证返回true,否则返回false
    *
    */
  isInteger: function (str) {
    var regu = /^[-]{0,1}[0-9]{1,}$/;
    return regu.test(str);
  },

  /*
    * 用途：检查输入手机号码是否正确 输入： s：字符串 返回： 如果通过验证返回true,否则返回false
    *
    */
  checkMobile: function (s) {
    var regu = /^1\d{10}$/; ///^1[3|4|5|7|8|9][0-9]{9}$/;
    var re = new RegExp(regu);
    if (re.test(s)) {
      return true;
    } else {
      return false;
    }
  },
  /*
    * 用途：检查输入字符串是否符合正整数格式 输入： s：字符串 返回： 如果通过验证返回true,否则返回false
    *
    */
  isNumber: function (s) {
    var regu = "^[0-9]+$";
    var re = new RegExp(regu);
    if (s.search(re) != -1) {
      return true;
    } else {
      return false;
    }
  },
  /*
    * 用途：检查输入字符串是否是带小数的数字格式,可以是负数 输入： s：字符串 返回： 如果通过验证返回true,否则返回false
    *
    */
  isDecimal: function (str) {
    if (isInteger(str))
      return true;
    var re = /^[-]{0,1}(\d+)[\.]+(\d+)$/;
    if (re.test(str)) {
      if (RegExp.$1 == 0 && RegExp.$2 == 0)
        return false;
      return true;
    } else {
      return false;
    }
  },

  /*
    * 用途：检查输入对象的值是否符合E-Mail格式 输入：str 输入的字符串 返回：如果通过验证返回true,否则返回false
    *
    */
  isEmail: function (str) {
    var myReg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    if (myReg.test(str))
      return true;
    return false;
  },
  /*
    * 用途：检查输入字符串是否只由英文字母和数字和下划线组成 输入： s：字符串 返回： 如果通过验证返回true,否则返回false
    *
    */
  isNumberOr_Letter: function (s) {// 判断是否是数字或字母
    var regu = "^[0-9a-zA-Z\_]+$";
    var re = new RegExp(regu);
    if (re.test(s)) {
      return true;
    } else {
      return false;
    }
  },
  /*
    * 用途：检查输入字符串是否只由英文字母和数字组成 输入： s：字符串 返回： 如果通过验证返回true,否则返回false
    *
    */
  isNumberOrLetter: function (s) {// 判断是否是数字或字母
    var regu = "^[0-9a-zA-Z]+$";
    var re = new RegExp(regu);
    if (re.test(s)) {
      return true;
    } else {
      return false;
    }
  },
  /*
    * 用途：检查输入字符串是否只由汉字、字母、数字组成 输入： value：字符串 返回： 如果通过验证返回true,否则返回false
    *
    */
  isChinaOrNumbOrLett: function (s) {// 判断是否是汉字、字母、数字组成
    var regu = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";
    var re = new RegExp(regu);
    if (re.test(s)) {
      return true;
    } else {
      return false;
    }
  },
  /*
  * 是否包含emoji 输入： value：字符串 返回： 如果通过验证返回true,否则返回false
  * */
  isLikeEmoji(s) {
    var regu = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
    var re = new RegExp(regu);
    if (re.test(s)) {
      return true;
    } else {
      return false;
    }
  },
  /*
    * 用途：检查输入的Email信箱格式是否正确 输入： strEmail：字符串 返回： 如果通过验证返回true,否则返回false
    *
    */
  checkEmail: function (strEmail) {
    // var emailReg = /^[_a-z0-9]+@([_a-z0-9]+\.)+[a-z0-9]{2,3}$/;
    var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    if (emailReg.test(strEmail)) {
      return true;
    } else {
      //alert("您输入的Email地址格式不正确！");
      return false;
    }
  }
}


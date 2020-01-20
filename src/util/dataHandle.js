/**
* 数据处理模块
* xuxuepu create 2016-3-16
*/

const dataHandle = {
  //滚动条在Y轴上的滚动距离
  getScrollTop() {
    var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
    if (document.body) {
      bodyScrollTop = document.body.scrollTop;
    }
    if (document.documentElement) {
      documentScrollTop = document.documentElement.scrollTop;
    }
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
    return scrollTop;
  },
  //文档的总高度
  getScrollHeight() {
    var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
    if (document.body) {
      bodyScrollHeight = document.body.scrollHeight;
    }
    if (document.documentElement) {
      documentScrollHeight = document.documentElement.scrollHeight;
    }
    scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
    return scrollHeight;
  },
  //浏览器视口的高度
  getWindowHeight() {
    var windowHeight = 0;
    if (document.compatMode == "CSS1Compat") {
      windowHeight = document.documentElement.clientHeight;
    } else {
      windowHeight = document.body.clientHeight;
    }
    return windowHeight;
  },
  //获取浏览器工作区域高度
  getWindowScreenHeight(){
    var windowHeight = 0;
    windowHeight = window.screen.availHeight;
    return windowHeight;
  },
  //分转元
  returnPrice(price) {
    if(!price) return 0;
    let v = price / 100;
    let p = v.toFixed(2);
    if(p.substring(p.length - 3, p.length) === '.00'){
      return p.substring(0, p.length - 3);
    }
    if(p.substring(p.length - 1, p.length) === '0'){
      return p.substring(0, p.length - 1);
    }
    return p;
  },
  //处理价格(元转为分)
  handlePrice(price){
    if(!price) return 0;
    let v = price * 100;
    return Math.round(v);
  },
  //折扣
  returnDiscount(discount) {
    if(!discount) return 0;
    let v = discount / 10;
    let p = v.toFixed(1);
    if(p.substring(p.length - 2, p.length) === '.0'){
      return p.substring(0, p.length - 2);
    }
    return p;
  },
  //处理折扣
  handleDiscount(discount) {
    if(!discount) return 0;
    let v = discount * 10;
    return Math.round(v);
  },
  /**
   * 接口返回的平均值转换，除以100
   * @param value
   * @returns {*|number|*|*}
   */
  returnAverage(value) {
    return this.returnPrice(value);
  },
  //返回重量
  returnWeight(data) {
    if(!data) return 0;
    return data / 10;
  },
  //处理重量
  handleWeight(data){
    if(!data) return 0;
    let v = data * 10;
    return Math.round(v);
  },
  //返回加价率
  returnMarkup(data){
    if(!data) return 0;
    let v = data / 10;
    let p = v.toFixed(1);
    if(p.substring(p.length - 2, p.length) === '.0'){
      return p.substring(0, p.length - 2);
    }
    return p;
  },
  //返回下单率
  returnLowerRate(data){
    if(!data) return 0;
    let v = data / 10;
    return v;
  },
  //处理加价率
  handleMarkup(data){
    if(!data) return 0;
    let v = data * 10;
    return Math.round(v);
  },
  //返回建议价(今日询价，加价率)
  returnSuggestPrice(priceBuy, markupRate){
    let v = priceBuy * (1 + markupRate / 1000);
    let p = v.toFixed(2);
    return this.returnPrice(p);
  },
  //返回百分比
  returnPercentage(item_num, sun){
    let d = item_num / sun * 100;
    d = d.toFixed(2);
    if(d.substring(d.length - 3, d.length) === '.00'){
      return d.substring(0, d.length - 3);
    }
    if(d.substring(d.length - 1, d.length) === '0'){
      return d.substring(0, d.length - 1);
    }
    return d;
  },
  //返回计算百分比
  returnPercent(data){
    if(!data) return 0;
    let v = data / 10;
    let p = v.toFixed(1);
    if(p.substring(p.length - 2, p.length) === '.0'){
      return p.substring(0, p.length - 2);
    }
    return p;
  },
  //处理百分比
  handlePercent(data){
    if(!data) return 0;
    let v = data * 10;
    return Math.round(v);
  },
  //返回要支付类型(微信额度，余额额度)
  returnPayType(weixin, balance) {
    if (balance === 0){
      return '微信';
    }else if(weixin === 0){
      return '余额';
    }else{
      return '微信+余额';
    }
  },
  //数字前面自动补零(num传入的数字，n需要的字符长度)
  prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  },
  //返回周几
  returnDay(dateStr) {
    let d = new Date(dateStr.replace(/-/g, "/"));
    let days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[d.getDay()];
  },
  //日期格式化
  /**
    *
    yyyy：年
    MM：月
    dd：日
    hh：1~12小时制(1-12)
    HH：24小时制(0-23)
    mm：分
    ss：秒
    S：毫秒
    E：星期几
    D：一年中的第几天
    F：一月中的第几个星期(会把这个月总共过的天数除以7)
    w：一年中的第几个星期
    W：一月中的第几星期(会根据实际情况来算)
    a：上下午标识
    k：和HH差不多，表示一天24小时制(1-24)。
    K：和hh差不多，表示一天12小时制(0-11)。
    z：表示时区
  */
  returnDateFormat(dateStr, format) {
    if (!dateStr){
      return ''
    }else if (format === 'yyyy-MM-dd') {
      return dateStr.substring(0, 10);
    } else if (format === 'MM-dd') {
      return dateStr.substring(5, 10);
    } else if (format === 'HH:mm:ss') {
      return dateStr.substring(11, 19);
    } else {
      return dateStr;
    }
  },

  /**
   * 对Date对象进行格式化
   * @param date 要格式化的Date对象
   * @param fmt 格式，例如 yyyy-MM-dd
   * @returns 格式化后的字符串
   */
  formatDate(date, fmt) {
    let o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  //计算日期
  returnDateCalc(dateStr, num) {
    var dd = new Date(dateStr.replace(/-/g, "/"));
    dd.setDate(dd.getDate() + num);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
    return y + "-" + m + "-" + d;
  },
  //返回date字符串
  returnDateStr(dateObj) {
    var t = this;
    var myDate = dateObj || (new Date());
    return (myDate.getFullYear() + ("-")
      + (t.prefixInteger(myDate.getMonth() + 1, 2)) + ("-")
      + (t.prefixInteger(myDate.getDate(), 2)) + " "
      + (t.prefixInteger(myDate.getHours(), 2)) + ":"
      + (t.prefixInteger(myDate.getMinutes(), 2)) + ":"
      + (t.prefixInteger(myDate.getSeconds(), 2)));
  },
  //计算相差天数
  dayDifferCalc(begintime, endtime) {
    var begintime_ms = new Date(begintime.replace(/-/g, "/")); //begintime 为开始时间
    var endtime_ms = new Date(endtime.replace(/-/g, "/"));   // endtime 为结束时间
    var difference = endtime_ms.getTime() - begintime_ms.getTime();//时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(difference / (24 * 3600 * 1000));
    return days;
  },

  /**
   * 初始化删除数组；删除数组重组数组
   * 用法：数组.remove(元素下标)
   */
  initArrayRemove: function () {
    Array.prototype.remove = function (dx) {
      if (isNaN(dx) || dx > this.length) { return false; }
      for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
          this[n++] = this[i];
        }
      }
      this.length -= 1;
    }
  },
  //返回日期字符串
  dataStr(str) {
    var dateStr = str || str != null || str != '' ? str.substring(0, 10) : '';
    return dateStr;
  },
  //数组去重
  arrayUnique(arr){
    var hash=[];
    for (var i = 0; i < arr.length; i++) {
      for (var j = i+1; j < arr.length; j++) {
        if(arr[i]===arr[j]){
          ++i;
        }
      }
      hash.push(arr[i]);
    }
    return hash;
  },
  /**
   * 最大保留两位小数
   * @param v
   * @returns {*}
   */
  keepTwoDecimal(v) {
    v = Number(v);
    let p = v.toFixed(2);
    if(p.substring(p.length - 3, p.length) === '.00'){
      return p.substring(0, p.length - 3);
    }
    if(p.substring(p.length - 1, p.length) === '0'){
      return p.substring(0, p.length - 1);
    }
    return p;
  },
  /**
   * 格式化数量，最大保留两位小数，一般用于平均值
   * @param v
   * @returns {*}
   */
  formatCount(v) {
    if (!v) return 0;
    let p = v.toFixed(2);
    if(p.substring(p.length - 3, p.length) === '.00'){
      return p.substring(0, p.length - 3);
    }
    if(p.substring(p.length - 1, p.length) === '0'){
      return p.substring(0, p.length - 1);
    }
    return p;
  },
  /**
   * 计算最大的title长度，使表头不换行
   * @param items 标题列表
   * @param titleCallback 生成标题的方法
   * @returns {number} 最大的标题长度，单位px
   */
  computeTableLabelMinWidth(items, titleCallback) {
    let labelWidths = Array();
    items.map(item => {
      let title = titleCallback(item);
      //统计汉字个数
      let chineseRegex = eval("/[\u4e00-\u9fa5（）]/ig");
      let chineseNum = title.match(chineseRegex) ? title.match(chineseRegex).length : 0;

      //统计数字字母个数
      let alphaRegex = eval("/[0-9a-zA-Z]/ig");
      let alphaNum = title.match(alphaRegex) ? title.match(alphaRegex).length : 0;

      //其他
      let otherNum = title.length - chineseNum - alphaNum;
      labelWidths.push(chineseNum * 14 + alphaNum * 12 + otherNum * 10);
    });
    return labelWidths.length > 0 ? Math.max(...labelWidths) + 20 : 100;
  },
  /**
   * 获取固定时间段选项
   * @param type 时间段类型
   * @returns {*[]} 返回的时间为Date类型
   */
  getFixDateRange(type) {
    let startDate, endDate;
    switch (type) {
      case 1: {
        //最近30天
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        startDate = start;
        endDate = end;
        break;
      }
      case 2: {
        //本周
        const today = new Date();
        const nowDay = today.getDate();
        const nowDayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
        startDate = new Date(today.getFullYear(), today.getMonth(), nowDay - nowDayOfWeek + 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), nowDay + (6 - nowDayOfWeek + 1));
        break;
      }
      case 3: {
        //上周
        const today = new Date();
        const nowDay = today.getDate();
        const nowDayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
        startDate = new Date(today.getFullYear(), today.getMonth(), nowDay - nowDayOfWeek - 7 + 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), nowDay - nowDayOfWeek - 1 + 1);
        break;
      }
      case 4: {
        //本月
        const today = new Date();
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const interval = (end.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        endDate = new Date(today.getFullYear(), today.getMonth(), interval);
        break;
      }
      case 5: {
        //上月
        const start = new Date();
        start.setDate(1);
        start.setMonth(start.getMonth() - 1);
        const endTime = new Date(start.getFullYear(), start.getMonth() + 1, 1);
        startDate = new Date(start.getFullYear(), start.getMonth(), 1);
        const interval = endTime.getTime() - startDate.getTime();
        endDate = new Date(start.getFullYear(), start.getMonth(), interval / (1000 * 60 * 60 * 24));
        break;
      }
      case 6: {
        //本年
        const today = new Date();
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      }
      case 7: {
        //上一年
        const today = new Date();
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear(), 0, 0);
        break;
      }
      case 8: {
        //今日
        let today = new Date();
        startDate = endDate = today;
        break;
      }
      case 9: {
        //昨日
        let today = new Date();
        let yesterday = new Date(today.setDate(today.getDate() - 1));
        startDate = endDate = yesterday;
        break;
      }
    }
    return [startDate, endDate];
  },
  /**
   * 格式化统计表头日期
   * @param date
   * @returns {string}
   */
  formatDateLabel(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return (month >= 10 ? month : '0' + month) + '-' + (day >= 10 ? day : '0' + day)
  },
  //数据权限级别(1-5)1:全国 2:省 3:片区 4:县市 5:线路
  returnDataLevel(level) {
    switch (level) {
      case '1': return '全国';
      case '2': return '省';
      case '3': return '片区';
      case '4': return '县市';
      case '5': return '线路';
      default: return '';
    }
  }
};

export default dataHandle;

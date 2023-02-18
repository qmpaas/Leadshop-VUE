class verify {
  /**
   * 判断是否存在小数
   * @param  {[type]}  val [description]
   * @return {Boolean}     [description]
   */
  isFloat(x) {
    var y = String(x).indexOf('.') + 1; //获取小数点的位置
    var count = String(x).length - y; //获取小数点后的个数
    if (y > 0) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 判断非负数
   * @param  {[type]}  val [description]
   * @return {Boolean}     [description]
   */
  isIntNum(val) {
    var regPos = / ^\d+$/; // 非负整数
    if (val < 0) {
      if (val === 0 || val === '0' || val === 0.0 || val === '0.00') {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  /**
   * 判断是否为数字
   * @param  {[type]}  val [description]
   * @return {Boolean}     [description]
   */
  isNumber(val) {
    if (val === 0 || val === '0' || val === 0.0 || val === '0.00') {
      return true;
    }
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 判断是否为价格
   * @param  {[type]}  num [description]
   * @return {Boolean}     [description]
   */
  isPrice(num) {
    if (num === 0 || num === '0' || num === 0.0 || num === '0.00') {
      return true;
    }
    var isNum = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    if (isNum.test(num)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 判断是否为空
   * @param  {[type]}  obj [description]
   * @return {Boolean}     [description]
   */
  isEmpty(obj) {
    if (typeof obj == 'undefined' || obj == null || obj == '') {
      if (obj === 0) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  /**
   * 判断大小限制
   * @param  {[type]}  val [description]
   * @param  {[type]}  num [description]
   * @return {Boolean}     [description]
   */
  isLimit(val, num) {
    if (val > num) {
      return true;
    } else {
      return false;
    }
  }
}

export default new verify();

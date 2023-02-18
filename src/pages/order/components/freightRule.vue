<!--
 * @Description: 
 * @Author: fjt
 * @Date: 2021-05-27 15:41:37
 * @LastEditTime: 2021-05-27 15:57:03
 * @LastEditors: fjt
-->
<script>
import img from './../image/freightRule.png';
export default {
  name: 'freightRule',
  render(createElement) {
    return createElement('el-scrollbar', {}, [
      createElement('img', {
        attrs: {
          src: img
        }
      })
    ]);
  }
};
</script>

<style scoped lang="scss">
.el-scrollbar {
  width: 600px;
  height: 480px;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>

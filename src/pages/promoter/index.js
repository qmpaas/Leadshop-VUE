/*
 * @Author: fjt
 * @Date: 2021-06-20 11:07:58
 * @LastEditors: fjt
 * @LastEditTime: 2021-06-20 11:09:29
 */
export default {
  data() {},
  methods: {
    //   路由参数替换
    replaceQuery: function () {
      let query = Object.assign({}, this.$route.query, this.form);
      this.$router.replace({
        query: query
      });
    },
    getQuery(isParseInt = ['page']) {
      let query = this.$route.query;
      Object.keys(query).forEach(item => {
        for (let i = 0; i < isParseInt.length; i++) {
          if (isParseInt[i] === item) {
            if (!isNaN(query[item])) {
              query[item] = parseInt(query[item]);
            } else {
              query[item] = 1;
            }
          }
        }
      });
      return Object.assign(this.form, query);
    },
    emptyStatus() {
      this.$router.replace({
        query: {}
      });
    }
  },
  filters: {}
};

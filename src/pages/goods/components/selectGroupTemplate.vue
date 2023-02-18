<!--
 * @Description:
 * @Author: fjt
 * @Date: 2021-05-25 16:34:55
 * @LastEditTime: 2021-05-27 17:27:42
 * @LastEditors: fjt
-->
<template>
  <div class="le-matter le-box flex" v-loading="loading">
    <div class="le-box-left">
      <div class="le-left-search">
        <el-autocomplete
          clearable
          :fetch-suggestions="querySearchAsync"
          :trigger-on-focus="false"
          placeholder="输入规格名搜索"
          v-model="search"
          @select="selectHandle"
          @clear="clearHandle"
        >
          <el-button icon="el-icon-search" slot="append"> </el-button>
        </el-autocomplete>
      </div>
      <el-scrollbar class="le-left-content">
        <div class="le-isNothing" v-if="isNothing">暂无数据</div>
        <div class="le-group-item flex align-center" v-for="(item, index) in select" :key="item.id">
          <el-radio v-model="radio" :label="index" :disabled="item.disabled" @change="changeIndex">
            <span class="le-label-span">{{ item.param_name }}</span>
          </el-radio>
        </div>
      </el-scrollbar>
    </div>
    <el-scrollbar class="le-box-right">
      <div class="le-right-title">
        <span>选择规格值</span>
        <span>最多选择20个规格值</span>
      </div>
      <div class="le-isNothing" v-if="isNothing">暂无数据</div>
      <div class="le-right-item flex align-center" v-for="item in paramData" :key="item.label">
        <el-checkbox
          :disabled="item.disabled"
          v-model="item.value"
          :label="item.label"
          @change="putCheckList($event, item)"
        >
          <span>{{ item.name }}</span>
        </el-checkbox>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      list: [],
      paramData: [],
      select: [],
      radio: 0,
      checkList: [],
      loading: true,
      paramName: '',
      isNothing: false,
      search: '',
      timeout: null
    };
  },
  methods: {
    selectHandle: function (e) {
      this.select = [e];
      this.radio = 0;
      this.checkList = [];
      this.changeIndex(0);
    },
    clearHandle: function () {
      this.select = this.list;
      this.radio = 0;
      this.checkList = [];
      this.changeIndex(0);
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.list;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 300 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    getList: function () {
      let _this = this;
      this.$heshop
        .goodstemplate('get')
        .then(function (response) {
          let list = response.data;
          for (let i = 0; i < _this.value.selectData.length; i++) {
            for (let j = 0; j < list.length; j++) {
              if (_this.value.selectData[i].name.trim() === list[j].param_name.trim()) {
                list[j].disabled = true;
              } else {
                // list[j].disabled = false;
              }
            }
          }
          list.forEach(function (item) {
            item.value = item.param_name;
          });
          let index = list.findIndex(item => !item.disabled);
          _this.list = list;
          _this.select = list;
          _this.isNothing = list.length === 0;

          if (index >= 0) {
            _this.getParamData(index);
            _this.radio = index;
          }
          _this.loading = false;
        })
        .catch(function (error) {
          _this.loading = false;
          _this.$message.error(error.data.message);
        });
    },
    changeIndex: function (index) {
      this.checkList = [];
      this.getParamData(index);
    },
    putCheckList: function (bool, item) {
      if (bool) {
        this.checkList.push(item);
      } else {
        this.checkList.splice(
          this.checkList.findIndex(str => str === item),
          1
        );
      }
      if (this.checkList.length >= 20) {
        this.paramData.forEach(item => {
          if (!item.value) {
            item.disabled = true;
          }
        });
      } else {
        this.paramData.forEach(item => {
          item.disabled = false;
        });
      }
    },
    getParamData: function (index) {
      this.paramData = [];
      let { param_data, param_name } = this.select[index];
      this.paramName = param_name;
      param_data.forEach(item => {
        this.paramData.push({
          name: item,
          label: item,
          value: false,
          disabled: false
        });
      });
    },
    affirm: function (e) {
      let { handleClose } = e;
      handleClose();
      this.value.result = {
        param_name: this.paramName,
        param_data: this.checkList
      };
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.le-box {
  height: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .le-isNothing {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #bfbfbf;
    line-height: 22px;
    text-align: center;
    margin-top: 21px;
  }
}
.le-box-left {
  width: 260px;
  border-right: 1px solid #dcdfe6;
}
.le-left-search {
  height: 63px;
  padding: 15px;
  /deep/ .el-input {
    width: 100%;
    .el-input-group__append {
      width: 45px;
    }
    .el-button {
      padding: 9px 15px;
    }
  }
}
.le-left-content {
  height: 337px;
  .le-group-item {
    height: 40px;
    width: 100%;
    padding-left: 15px;
    /deep/.el-radio {
      width: 100%;
    }
    .le-label-span {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      line-height: 22px;
    }
  }
}
.le-box-right {
  height: 400px;
  width: 360px;
}
.le-right-title {
  font-family: Microsoft YaHei;
  font-weight: 400;
  height: 24px;
  line-height: 24px;
  padding-left: 15px;
  margin-top: 12px;
  span:first-child {
    font-size: 14px;
    color: #595959;
  }
  span:last-child {
    color: #bfbfbf;
    font-size: 12px;
    margin-left: 8px;
  }
}
.le-right-item {
  height: 40px;
  padding-left: 15px;
  .el-checkbox {
    width: 100%;
  }
}
</style>

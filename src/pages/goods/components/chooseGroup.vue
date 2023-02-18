<template>
  <div class="le-matter le-chooseGroup" v-loading="loading">
    <div class="le-cat__head">
      <el-autocomplete
        placeholder="输入分类名称搜索"
        @select="getSelect"
        clearable
        @clear="getClear"
        ref="select"
        :fetch-suggestions="suggestions"
        v-model="state"
      >
        <el-button slot="append" icon="el-icon-search" @click="getClear"></el-button>
      </el-autocomplete>
    </div>
    <div class="le-cat__body flex">
      <div class="le-cat-item__first flex-sub">
        <div class="le-cat-item__search">
          <el-autocomplete
            placeholder="输入一级分类名称"
            :fetch-suggestions="suggestionsLeft"
            @select="getSelect"
            clearable
            @clear="getClear"
            v-model="stateLeft"
          >
            <el-button slot="append" icon="el-icon-search" @click="getClear"></el-button>
          </el-autocomplete>
        </div>
        <el-scrollbar class="le-cat-item-bar">
          <template v-for="(item, index) in leftList">
            <div
              class="le-cat-item flex"
              :key="index"
              v-show="item.show && item.type > 1"
              @click="setChecked(item, 'leftList', index)"
            >
              <div class="le-cat-item--check">
                <he-icon type="le-icon-tick" size="8px" v-if="item.checked"></he-icon>
              </div>
              <div class="flex-sub" :class="item.checked || item.listChecked ? 'le-cat-item-text' : ''">
                {{ item.name }}
              </div>
              <div class="le-item-arrow">
                <i v-if="item.list && item.type === 3" class="el-icon-arrow-right"></i>
              </div>
            </div>
          </template>
        </el-scrollbar>
      </div>
      <div class="le-cat-item__second flex-sub">
        <div class="le-cat-item__search">
          <el-autocomplete
            placeholder="输入二级分类名称"
            :fetch-suggestions="suggestionsRight"
            clearable
            @select="getSelectRight"
            @clear="getClear"
            v-model="stateRight"
          >
            <el-button slot="append" icon="el-icon-search" @click="getClear"></el-button>
          </el-autocomplete>
        </div>
        <el-scrollbar class="le-cat-item-bar">
          <template v-for="(item, index) in rightList">
            <div class="le-cat-item flex" :key="index" v-show="item.show" @click="setChecked(item, 'rightList')">
              <div class="le-cat-item--check">
                <he-icon type="le-icon-tick" size="8px" v-if="item.checked"></he-icon>
              </div>
              <div class="flex-sub" :class="item.checked ? 'le-cat-item-text' : ''">{{ item.name }}</div>
            </div>
          </template>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chooseGroup',
  props: {
    value: [Array, Object]
  },
  data() {
    return {
      list: [],
      allList: [],
      leftList: [],
      leftIndex: 0,
      rightList: [],
      searchList: [],
      mouseoutTime: null,
      loading: true,
      state: '',
      stateLeft: '',
      stateRight: ''
    };
  },
  async mounted() {
    await this.getList();
    this.loading = false;
  },
  methods: {
    getList: function () {
      let _this = this;
      return new Promise(function (resolve, reject) {
        _this.$heshop
          .group('get', { include: 'goods' })
          .then(function (res) {
            let list = [];
            for (let i = 0; i < res.length; i++) {
              let array = res[i].path.split('-');
              if (array.length < 3) {
                list.push(res[i]);
              }
            }
            list = _this.$heshop
              .toTree({
                parentKey: 'parent_id',
                idKey: 'id',
                parentId: 0,
                childrenKey: 'list'
              })
              .on(list)
              .get();
            list.forEach(function (one) {
              one.value = one.name;
              one.checked = false;
              one.listChecked = false;
              one.show = true;
              _this.searchList.push(one);
              if (one.list) {
                one.list.forEach(function (two) {
                  two.value = `${one.value}>${two.name}`;
                  two.checked = false;
                  two.show = true;
                  _this.searchList.push(two);
                });
              }
            });
            _this.list = list;
            _this.setList();
            resolve();
          })
          .catch(function (error) {
            _this.$message.error(error.data.message);
            reject();
          });
      });
    },
    setList: function () {
      this.leftList = this.list;
      this.rightList =
        this.list[this.leftIndex].list && this.list[this.leftIndex].type === 3 ? this.list[this.leftIndex].list : [];
    },
    setChecked: function (item, listKey) {
      for (let i = 0; i < this.list.length; i++) {
        let one = this.list[i];
        one.checked = false;
        one.listChecked = false;
        if (one.list) {
          for (let j = 0; j < one.list.length; j++) {
            let two = one.list[j];
            two.checked = false;
          }
        }
      }
      this.$set(item, 'checked', true);
      if (listKey === 'rightList') {
        for (let i = 0; i < this.list.length; i++) {
          let one = this.list[i];
          if (item.parent_id === one.id) {
            one.listChecked = true;
          }
        }
      } else {
        for (let i = 0; i < this.list.length; i++) {
          if (item.id === this.list[i].id) {
            this.leftIndex = i;
            this.setList();
          }
        }
      }
    },
    querySearch: function (queryString, cb, list) {
      let results = queryString
        ? list.filter(function (restaurant) {
            return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0;
          })
        : list;
      cb(results);
    },
    suggestions: function (str, cb) {
      const newList = this.searchList.filter(item => {
        return (
          (item.type > 1 && item.path.split('-').length === 1) || (item.type === 3 && item.path.split('-').length === 2)
        );
      });
      this.querySearch(str, cb, newList);
    },
    suggestionsLeft: function (str, cb) {
      const newList = this.leftList.filter(item => {
        return item.type > 1;
      });
      this.querySearch(str, cb, newList);
    },
    suggestionsRight: function (str, cb) {
      const newList = this.rightList.filter(item => {
        return item;
      });
      this.querySearch(str, cb, newList);
    },
    getSelect: function (item) {
      let _this = this;
      for (let i = 0; i < this.list.length; i++) {
        let one = this.list[i];
        this.$set(one, 'show', false);
        if (one.list) {
          for (let j = 0; j < one.list.length; j++) {
            this.$set(one.list[j], 'show', false);
          }
        }
      }
      item.show = true;
      if (item.list) {
        for (let i = 0; i < this.leftList.length; i++) {
          if (item.id === this.leftList[i].id) {
            this.leftIndex = i;
            _this.setList();
            break;
          }
        }
        item.list.forEach(function (two) {
          _this.$set(two, 'show', true);
        });
      } else {
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].id === item.parent_id) {
            this.$set(this.list[i], 'show', true);
          }
        }
      }
    },
    getSelectRight: function (item) {
      for (let i = 0; i < this.list.length; i++) {
        let one = this.list[i];
        this.$set(one, 'show', false);
        if (one.list) {
          for (let j = 0; j < one.list.length; j++) {
            this.$set(one.list[j], 'show', false);
          }
        }
      }
      item.show = true;
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id === item.parent_id) {
          this.$set(this.list[i], 'show', true);
        }
      }
    },
    getClear: function () {
      let num = 0;
      for (let i = 0; i < this.list.length; i++) {
        let one = this.list[i];
        one.show = true;
        if (one.checked || one.listChecked) {
          this.leftIndex = i;
          this.setList();
        } else {
          num++;
        }
        if (one.list) {
          for (let j = 0; j < one.list.length; j++) {
            let two = one.list[j];
            two.show = true;
          }
        }
      }
      if (num === this.list.length) {
        this.leftIndex = 0;
        this.setList();
      }
    },
    clickSelect: function () {},
    affirm(e) {
      let { handleClose } = e;
      let check = null;
      for (let i = 0; i < this.list.length; i++) {
        let one = this.list[i];
        if (one.checked) {
          check = one;
          break;
        }
        if (one.list) {
          for (let j = 0; j < one.list.length; j++) {
            let two = one.list[j];
            if (two.checked) {
              check = two;
              break;
            }
          }
        }
      }
      this.value.result = check;
      this.$emit('input', this.value);
      handleClose();
    }
  }
};
</script>

<style scoped lang="scss">
.le-chooseGroup {
  .le-cat__head /deep/ {
    .el-input {
      width: 367px;
    }

    .el-input-group__append {
      padding: 0 20px;

      .el-button {
        width: 45px;
        padding: 0;
        height: 32px;
      }
    }
  }

  .le-cat__body {
    width: 480px;
    height: 231px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-top: 16px;

    .le-cat-item__first {
      border-right: 1px solid #dcdfe6;
    }

    .le-cat-item__search {
      padding: 16px 16px 0 16px;

      .el-autocomplete /deep/ .el-input {
        width: 207px;
      }
    }

    .le-cat-item-bar {
      height: 183px;
      width: 239px;
      padding-top: 15px;

      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .le-cat-item:hover {
        background: #f3f5f7;
      }

      .le-cat-item {
        width: 239px;
        height: 32px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        line-height: 32px;
        padding: 0 11px 0 8px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.85);

        .le-cat-item--check {
          width: 28px;
          height: 32px;
          line-height: 32px;
          text-align: center;

          svg {
            color: #623ceb;
          }
        }

        .le-item-arrow {
          width: 7px;
          height: 32px;
        }

        .le-cat-item-text {
          color: #623ceb;
        }
      }
    }
  }
}
</style>

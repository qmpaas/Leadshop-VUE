<template>
  <el-dialog :visible.sync="showDialog" title="选择素材组" width="801px" top="20vh">
    <el-autocomplete
      class="le-cat__input"
      placeholder="输入素材分组名称搜索"
      v-model="search"
      @select="getSelect"
      clearable
      @clear="getClear"
      :fetch-suggestions="querySearchAsync"
    >
      <el-button icon="el-icon-search" @click="getSearchList" slot="append"></el-button>
    </el-autocomplete>
    <div class="le-box flex">
      <div class="flex-sub">
        <el-autocomplete
          class="le-input--208"
          clearable
          @clear="getClear"
          @select="getSelect"
          placeholder="输入一级分组名称搜索"
          v-model="searchFirst"
          :fetch-suggestions="getFirstSearchList"
        >
          <el-button icon="el-icon-search" slot="append"></el-button>
        </el-autocomplete>
        <el-scrollbar style="height: 167px">
          <template v-for="(item,key) in list">
            <div class="le-item flex justify-between align-center" v-if="item.show" :key="key">
              <div @click="firstChange(item, key)">
                <el-radio v-model="itemData" :label="item">&nbsp;</el-radio>
                <span :class="{'active' : first === key}">{{ item.name }}</span>
              </div>
              <i class="el-icon-arrow-right" :class="{'active' : first === key}" v-if="item.children"> </i>
            </div>
          </template>
        </el-scrollbar>
      </div>
      <div class="flex-sub">
        <el-autocomplete
          class="le-input--208"
          placeholder="输入二级分组名称搜索"
          v-model="searchSecond"
          @select="getSelectSecond"
          @clear="getClearSecond"
          clearable
          :fetch-suggestions="getSecondSearchList"
        >
          <el-button icon="el-icon-search" slot="append"></el-button>
        </el-autocomplete>
        <el-scrollbar style="height: 167px" v-if="list[first]">
          <template v-for="(item,key) in secondList">
            <div class="le-item flex justify-between align-center" v-show="item.show" :key="key">
              <div @click="secondChange(item, key)">
                <el-radio v-model="itemData" :label="item">&nbsp;</el-radio>
                <span :class="{'active' : second === key}">{{ item.name }}</span>
              </div>
              <i class="el-icon-arrow-right" :class="{'active' : second === key}" v-if="item.children"> </i>
            </div>
          </template>
        </el-scrollbar>
      </div>
      <div class="flex-sub">
        <el-autocomplete
          class="le-input--208"
          placeholder="输入三级分组名称搜索"
          v-model="searchThird"
          clearable
          @select="getSelectThird"
          @clear="getClearThird"
          :fetch-suggestions="getThirdSearchList"
        >
          <el-button icon="el-icon-search" slot="append"></el-button>
        </el-autocomplete>
        <el-scrollbar style="height: 167px" v-if="thirdList">
          <template v-for="(item,key) in  thirdList">
            <div v-show="item.show" class="le-item flex justify-between align-center"
                 :key="key">
              <div @click="thirdChange(item)">
                <el-radio v-model="itemData" :label="item">&nbsp;</el-radio>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </template>
        </el-scrollbar>
      </div>
    </div>
    <div slot="footer" class="le-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "index",
  props: {
    value: {
      type: Boolean
    },
    info: {
      type: Object
    }
  },
  data() {
    return {
      search: "",
      list: [],
      first: null,
      second: null,
      third: null,
      itemData: null,
      searchFirst: "",
      searchSecond: "",
      searchThird: "",
      secondList: [],
      thirdList: [],
      searchList: []
    }
  },
  computed: {
    showDialog: {
      get({value}) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    submit() {
      this.$emit('confirm', this.itemData);
      this.showDialog = false;
    },
    gitList(search) {
      this.searchList = [];
      this.$heshop.group("get", {
        include: "gallery",
        search: search,
        type: 1
      }).then((response) => {
        function replace(response) {
          response.forEach((item) => {
            item.value = item.name
            if (item.children) {
              replace(item.children);
            }
          })
        }


        replace(response);


        let data = this.$heshop.toTree({
          parentKey: 'parent_id',
          idKey: 'id',
          parentId: 0,
          childrenKey: 'children'
        }).on(response).get();
        data.forEach((item) => {
          item.value = item.name;
          item.show = true;
          this.searchList.push(item);
          if (item.children) {
            item.children.forEach((item1) => {
              item1.value = `${item.value}>${item1.value}`;
              item1.show = true;
              this.searchList.push(item1)
              if (item1.children) {
                item1.children.forEach((item2) => {
                  item2.value = `${item1.value}>${item2.value}`;
                  item2.show = true;
                  this.searchList.push(item2);
                });
              }
            });
          }
        });
        this.list = data;
      });
    },
    firstChange(item, index) {
      this.first = index;
      this.second = null;
      if (item.children) {
        this.itemData = null;
      } else {
        this.itemData = item;
      }
    },
    secondChange(item, index) {
      this.second = index;
      this.third = null;
      if (item.children) {
        this.itemData = null;
      } else {
        this.itemData = item;
      }
    },
    thirdChange(item) {
      this.itemData = item;
    },
    async querySearchAsync(queryString, cb) {
      let restaurants = this.searchList;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      };
    },
    getSelect(item) {
      this.secondList = [];
      this.thirdList = [];
      let parent_id = item.path.split("-");
      if (parent_id.length === 2) {
        let id = Number(parent_id[1]);
        this.list.forEach((item1, key) => {
          if (item1.id === id) {
            this.first = key;
          }
        });
        this.list[this.first].children.forEach((kley, index) => {
          if (kley.id === item.id) {
            this.$nextTick(() => {
              this.second = index;
            })
            this.itemData = kley;
          }
        });
      } else if (parent_id.length === 3) {
        let id = Number(parent_id[1]);
        this.list.forEach((item1, key) => {
          if (item1.id === id) {
            this.first = key;
          }
        });
        this.list[this.first].children.forEach((kley, index) => {
          if (kley.id === Number(parent_id[2])) {
            this.second = index;
          }
        });
        this.list[this.first]?.children[this.second]?.children.forEach((key, index) => {
          if (key.id === item.id) {
            this.itemData = key;
          }
        })
      } else {
        this.itemData = item;
      }

      for (let i = 0; i < this.list.length; i++) {
        this.$set(this.list[i], 'show', false);
      }
      item.show = true;
      for (let i = 0; i < this.list.length; i++) {


        if (parent_id.length > 1 && Number(parent_id[1]) === this.list[i].id) {
          this.$set(this.list[i], 'show', true);
        }
      }
    },
    getClear() {
      this.secondList = [];
      this.thirdList = [];
      for (let i = 0; i < this.list.length; i++) {
        let one = this.list[i];
        one.show = true;
        if (one.children) {
          for (let j = 0; j < one.children.length; j++) {
            let two = one.children[j];
            two.show = true;
          }
        }
      }
    },
    getSearchList() {
      this.gitList(this.search);
    },
    getFirstSearchList(queryString, cb) {
      let restaurants = this.list;
      let results = queryString ? restaurants.filter((state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase())>= 0)
      }) : restaurants;
      cb(results);
    },
    getSecondSearchList(queryString, cb) {
      let restaurants = this.secondList;
      let results = queryString ? restaurants.filter((state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0)
      }) : restaurants;
      cb(results);
    },
    getSelectSecond(item) {
      const parent = this.list.find((key) => {
        return key.id === item.parent_id;
      });
      parent.children.forEach((key) => {
        key.show = false;
        if (item.id === key.id) {
          item.show = true;
        }
      });
    },
    getClearSecond() {
      this.secondList.forEach((item) => {
        item.show = true;
      });
    },
    getThirdSearchList(queryString, cb) {
      let restaurants = this.thirdList;
      let results = queryString ? restaurants.filter((state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }) : restaurants;
      cb(results);
    },
    getClearThird() {
      this.thirdList.forEach((item) => {
        item.show = true;
      });
    },
    getSelectThird(item) {
      const parent = this.secondList.find((key) => {
        return key.id === item.parent_id;
      });
      parent.children.forEach((key) => {
        key.show = false;
        if (item.id === key.id) {
          item.show = true;
        }
      });
    }
  },
  mounted() {
    this.gitList(this.search);
  },
  watch: {
    first: {
      handler(val) {
        if (this.list[val].children) {
          this.secondList = this.list[val].children;
        } else {
          this.secondList = []
        }
      }
    },
    second: {
      handler(val) {
        if ((val === 0 || val)) {
          if (this.secondList[val].children) {
            this.thirdList = this.secondList[val].children;
          } else {
            this.thirdList = [];
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.le-box {
  width: 100%;
  height: 231px;
  border: 1px solid #DCDFE6;
  margin-top: 16px;
  border-radius: 4px;

  > .flex-sub {
    &:not(:last-child) {
      border-right: 1px solid #DCDFE6;
    }
  }

  .le-item {
    height: 28px;
    line-height: 28px;
    padding: 0 10px 0 15px;
    cursor: pointer;

    .el-radio {
      margin-right: 0;
    }

    .active {
      color: #623CEB;
    }
  }

  .le-input--208 {
    width: 208px;
    margin: 16px;

    /deep/ .el-input {
      width: 100%;

      .el-input__inner {
        padding-right: 5px !important;
      }
    }
  }
}
</style>

<template>
  <div class="le-chooseLabel flex" v-loading="loading">
    <div class="flex-sub">
      <div class="le-chooseLabel-header">
        <el-input
          class="le-chooseLabel-input"
          v-model="search"
          placeholder="输入标签名称搜索"
          @keyup.enter.native="getList"
        >
          <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
        </el-input>
      </div>
      <el-scrollbar class="le-scrollbar">
        <div class="le-label" v-for="(item, index) in list" :key="index">
          <el-checkbox-group @change="checkBoxChange" v-model="choose">
            <el-checkbox :label="item.id">
              <span class="le-label-name">{{ item.name }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-scrollbar>
    </div>
    <div class="flex-sub">
      <div class="le-chooseLabel-header">已选</div>
      <el-scrollbar class="le-scrollbar le-scroll-bar_right">
        <span class="le-tag" v-for="(item, index) in selected" :key="index"
          >{{ item.name }}
          <he-icon @click.native="deleteTag(item)" class="le-label-delete" size="10px" type="le-icon-fork"></he-icon>
        </span>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  name: 'chooseLabel',
  props: {
    value: Object
  },
  data() {
    return {
      loading: true,
      list: [],
      checkList: [],
      search: '',
      choose: [],
      disabled: false,
      selected: []
    };
  },
  computed: {},
  methods: {
    getList: function () {
      let _this = this;
      this.$heshop
        .userlabel('get', {
          type: this.value.type ? this.value.type : 0,
          name: this.search
        })
        .then(function (response) {
          _this.list = response;
          _this.loading = false;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    checkBoxChange: function (list) {
      this.choose = list;
      let data = [];
      let new_list = {};
      this.list.forEach(v => {
        new_list[v.id] = v;
      });
      let new_selected = {};
      this.selected.forEach(v => {
        new_selected[v.id] = v;
      });
      for (let i = 0; i < this.choose.length; i++) {
        if (typeof new_list[this.choose[i]] == 'undefined') {
          if (typeof new_selected[this.choose[i]] != 'undefined') {
            data.push(new_selected[this.choose[i]]);
          }
        } else {
          data.push(new_list[this.choose[i]]);
        }
        // for (let j = 0; j < this.list.length; j++) {
        //     if (this.choose[i] === this.list[j].id || this.choose[i]) {
        //         data.push(this.list[j]);
        //         break;
        //     }
        // }
      }
      this.selected = data;
    },
    deleteTag: function (item) {
      for (let i = 0; i < this.choose.length; i++) {
        if (this.choose[i] === item.id) {
          this.choose.splice(i, 1);
        }
      }
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i].id === item.id) {
          this.selected.splice(i, 1);
        }
      }
    },
    affirm: function (e) {
      let { handleClose } = e;
      this.value.label = this.selected;
      this.$emit('input', this.value);
      handleClose();
    }
  },
  mounted() {
    this.getList();
    this.selected = JSON.parse(JSON.stringify(this.value.label));
    for (let i = 0; i < this.selected.length; i++) {
      this.choose.push(this.selected[i].id);
    }
  }
};
</script>
<style scoped lang="scss">
.le-chooseLabel {
  width: 624px;
  height: 260px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  > .flex-sub:first-child {
    border-right: 1px solid #dcdfe6;
  }

  .le-chooseLabel-header {
    height: 63px;
    padding: 16px;
  }

  .le-scrollbar /deep/ {
    height: calc(100% - 63px);

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }

  .le-scroll-bar_right {
    padding-left: 17px;
  }

  .le-chooseLabel-input {
    width: 280px;

    .el-input-group__append {
      width: 46px;

      .el-button {
        padding: 10px 16px;
      }
    }
  }

  .le-label {
    height: 40px;
    line-height: 40px;
    padding-left: 15px;

    .el-checkbox {
      display: block;
      line-height: 40px;
    }
  }

  .le-label-name {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    line-height: 14px;
  }

  .le-tag {
    display: inline-block;
    border: 1px solid #bebebe;
    border-radius: 4px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #595959;
    padding: 10px 32px 10px 13px;
    margin: 0 8px 8px 0;
    cursor: pointer;
    position: relative;

    .le-label-delete {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>

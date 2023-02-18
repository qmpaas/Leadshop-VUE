<template>
  <el-dialog :visible.sync="showDialog" title="选择规格" width="562px" top="20vh">
    <el-radio-group ref="group" v-model="group" class="le-group" v-if="again">
      <el-radio class="le-group-item" @click.native="handlerClick(item)" v-for="(item, index) in list" :key="index" :label="item">{{ item }}</el-radio>
    </el-radio-group>
    <div slot="footer" class="le-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="submit"> 确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "choose-specifications",
  props: {
    value: {
      type: Boolean
    },
    info: {
      type: Object
    },
  },
  data() {
    return {
      list: [],
      group: this.info.group,
      again: true
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
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$heshop.plugin("get", {
        include: "evaluate",
        model: "goods",
        behavior: "params",
        goods_id: this.info.goods_id
      }).then((response) => {
        let paramData = response.param_data;
        let list = [];
        for (let i = 0; i < paramData.length; i++) {
          let value = paramData[i].value;
          if (list.length) {
            let new_list = [];
            for (let k = 0; k < list.length; k++) {
              for (let j = 0; j < value.length; j++) {
                new_list.push(`${list[k]} ${paramData[i].name}:${value[j].value}`)
              }
            }
            list = new_list;
          } else {
            for (let j = 0; j < value.length; j++) {
              if (paramData[i].name) {
                list.push(paramData[i].name + ' : ' + value[j].value);
              } else {
                list.push(value[j].value)
              }
            }
          }
        }
        this.list = list;
      });
    },
    submit() {
      this.$emit('confirm', this.group);
      this.showDialog = false;
    },
    handlerClick(item) {
      if (item === this.group) {
        this.group = "";
        this.again = false;
        this.$nextTick(() => {
          this.again = true;
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.le-group {
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  padding: 0 0 0 15px;
  height: 350px;
  overflow-y: auto;
  width: 100%;

  .le-group-item {
    min-height: 40px;
    display: flex;
    padding-top: 10px;
    /deep/ .el-radio__label {
      word-wrap: break-word;
      word-break: break-all;
      white-space: normal
    }
  }
}
</style>

<script>
export default {
  name: 'chooseParameterTemplate',
  props: {
    value: [Object]
  },
  data() {
    return {
      listIndex: -1,
      check: [],
      list: [],
      search: '',
      form: {
        title: '',
        content: []
      },
      showList: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    affirm(e) {
      let { handleClose } = e;
      let outputArray = [];
      for (let i = 0; i < this.check.length; i++) {
        for (let j = 0; j < this.list.length; j++) {
          if (this.check[i] === this.list[j].id) {
            outputArray.push(this.list[j]);
          }
        }
      }
      this.$emit('input', {
        result: outputArray
      });
      handleClose();
    },
    // 获取参数模板
    getList() {
      this.$heshop
        .goodsargs('get', {
          behavior: 'option'
        })
        .then(res => {
          this.list = res;
          this.showList = res;

          // this.listIndex = this.list.findIndex(item => !item.disabled);
          if (res.length) {
            // this.form = this.$_.cloneDeep(this.list[0]);
            // this.check = [this.list[0].id];
            // this.getChoose(this.listIndex);
          }
        })
        .catch(() => {
          this.$message.error('获取失败');
        });
    },
    // 删除参数
    deletionParameter(e) {
      this.$delete(this.form.content, e);
    },
    getChoose(e) {},
    querySearchAsync() {
      let restaurants = this.$_.cloneDeep(this.list);
      this.showList = this.search
        ? restaurants.filter(state => {
            return state.title.toLowerCase().indexOf(this.search.toLowerCase()) === 0;
          })
        : restaurants;
      if (this.showList.length > 0) {
        this.form = this.$_.cloneDeep(this.showList[0]);
      } else {
        this.form = {
          content: []
        };
      }
    }
  },
  render() {
    const self = this;
    return (
      <div class="le-main le-parameter--box flex">
        <div class="le-left">
          <el-input class="le-search" v-model={self.search} placeholder="输入参数模板名称搜索">
            <el-button slot="append" icon="el-icon-search" onClick={self.querySearchAsync} />
          </el-input>
          <el-scrollbar class="le-scrollbar">
            <el-checkbox-group v-model={self.check} on-change={self.getChoose}>
              {self.showList.map((item, index) => {
                return (
                  <el-checkbox
                    nativeOn={{
                      click() {
                        self.listIndex = index;
                        self.form = self.$_.cloneDeep(self.showList[index]);
                      }
                    }}
                    key={index}
                    class={['le-radio--item', { active: index === self.listIndex }]}
                    label={item.id}>
                    {item.title}
                  </el-checkbox>
                );
              })}
            </el-checkbox-group>
          </el-scrollbar>
        </div>
        <el-scrollbar class="le-scrollbar le-right flex-sub">
          {(() => {
            if (self.form.content.length === 0) {
              return <div style="text-align: center;margin-top: 28px;color: #BFBFBF;">{'暂无数据'}</div>;
            }
          })()}
          {self.form.content.map((item, index) => {
            return (
              <div class="le-parameter--item" key={index}>
                <div class="le-item--row flex align-center">
                  <div class="le-row--label">参数名</div>
                  <div class="le-row--value">{item.name}</div>
                </div>
                <div class="le-item--row flex ">
                  <div class="le-row--label">参数值</div>
                  <div class="le-row--value">{item.value}</div>
                </div>
              </div>
            );
          })}
        </el-scrollbar>
      </div>
    );
  }
};
</script>

<style scoped lang="scss">
.le-parameter--box {
  border: 1px solid #dcdfe6;
  width: 624px;
  height: 400px;
  border-radius: 4px;
  .le-left {
    width: 262px;
    border-right: 1px solid #dcdfe6;
    .le-search {
      margin: 15px;
      width: 231px !important;
      /deep/.el-input {
        width: 231px;
      }
      /deep/.el-input-group__append {
        padding: 0 10px;
      }
    }
    .le-scrollbar {
      height: 338px;
    }
  }
  .el-radio-group {
    width: 100%;
  }
  .le-radio--item {
    display: block;
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    margin: 0;
    &:hover {
      background: #f3f5f7;
    }
    &.is-checked {
      /deep/.el-checkbox__label {
        color: #262626;
      }
    }
    &.active {
      background: #efebfd;
      /deep/.el-checkbox__label {
        color: #623ceb;
      }
    }
  }
  .le-scrollbar {
    height: 400px;
    /deep/.el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .le-parameter--item {
    width: 330px;
    height: auto;
    background: #f3f5f7;
    border-radius: 4px;
    margin-bottom: 16px;
    padding: 16px 16px 16px 24px;
    position: relative;
    .le-deletion {
      height: auto;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      width: 16px;
      transform: translate(50%, -50%);
      opacity: 0;
    }
    &:hover {
      .le-deletion {
        opacity: 1;
      }
    }
    &:first-child {
      margin-top: 16px;
    }
    .le-item--row {
      &:first-child {
        margin-bottom: 24px;
      }
    }
    .le-row--label {
      width: 50px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      line-height: 20px;
      margin-right: 16px;
      flex-shrink: 0;
    }
    .le-row--value {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      line-height: 20px;
    }
  }
}
</style>

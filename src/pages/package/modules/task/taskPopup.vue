<template>
  <div class="taskPopup">
    <el-dialog
      title="选择积分任务"
      :visible.sync="dialogVisible"
      width="594px"
      :before-close="
        done => {
          done();
        }
      "
    >
      <div class="task-dialog">
        <el-radio-group v-model="select" @change="handleChange">
          <el-table ref="multipleTable" :data="taskData" empty-text="暂无数据，请选择添加积分任务">
            <el-table-column width="194">
              <template slot="header">
                <span style="padding-left: 30px">任务名称</span>
              </template>
              <template slot-scope="scope">
                <el-radio :label="scope.row"><span></span></el-radio>
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="任务内容" width="320" height="64">
              <template slot-scope="scope">
                <div
                  style="white-space: pre; height: 51px; line-height: 16px; display: table-cell; vertical-align: middle"
                >
                  {{ scope.row.remark }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm" v-if="taskData.length">确认</el-button>
        <el-button type="primary" @click="handleSkip" v-else>去添加</el-button>
      </span>
    </el-dialog>
    <slot name="empty" v-if="isEmpty"></slot>
    <slot name="task" v-else :data="value"></slot>
  </div>
</template>

<script type="text/javascript">
function sprintf() {
  let arg = arguments,
    str = arg[0] || '',
    i,
    n;
  for (i = 1, n = arg.length; i < n; i++) {
    str = str.replace(/%s/, arg[i]);
  }
  return str;
}

export default {
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: ''
    },
    visible: {
      type: [String, Number, Boolean, Object, Array],
      default: false
    }
  },
  data() {
    return {
      taskData: []
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    isEmpty() {
      if (this.value) {
        return Object.keys(this.value).length === 0;
      } else {
        return false;
      }
    },
    dialogVisible: {
      get({ visible }) {
        return visible;
      },
      set(value) {
        this.$emit('update:visible', value);
      }
    },
    select: {
      get({ value }) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.headleLoad();
  },
  methods: {
    handleSkip() {
      this.$router.push({ path: '/plugins/task/setting' });
    },
    /**
     * 执行任务列表
     * @return {[type]} [description]
     */
    headleLoad() {
      this.$heshop
        .plugin('get', { include: 'task', model: 'task' })
        .then(res => {
          let taskData = [];
          let sustain = '';
          let signin = -1;
          //手动进行分组处理
          for (let index in res) {
            let item = res[index];
            let key = item.keyword;
            if (key === 'signin') {
              signin = index;
            }
            //根据类型处理信息
            if (key === 'signin' || key === 'perfect' || key === 'binding') {
              let remark = sprintf(item.remark, item.maximum);
              item.remark = remark;
              taskData[index] = item;
              continue;
            }
            if (key === 'sustain') {
              if (item.status) {
                sustain = '\n' + sprintf(item.remark, item.total, item.acquire);
              }
              continue;
            }
            let remark = sprintf(item.remark, item.total, item.acquire);

            item.remark = remark;
            taskData[index] = item;
          }
          if (signin != -1) {
            taskData[signin]['remark'] += sustain;
          }
          let _list = [];
          //剔除状态为0的任务
          for (let index in res) {
            for (let i in taskData) {
              if (res[index].keyword == taskData[i].keyword) {
                if (res[index].status) {
                  _list.push(taskData[i]);
                }
              }
            }
          }
          this.taskData = _list;
        })
        .catch(() => {
          this.$message.error('加载配置信息失败，请检查网络');
        });
    },
    handleConfirm() {
      this.dialogVisible = false;
    },
    handleChange() {}
  }
};
</script>
<style lang="less" scoped="true"></style>

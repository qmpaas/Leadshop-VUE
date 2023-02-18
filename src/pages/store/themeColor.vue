<template>
  <div class="le-matter">
    <div class="le-form-card">
      <div class="le-theme-list">
        <div
          :class="[{ 'he-theme__active': active === item.key }]"
          :key="index"
          v-for="(item, index) in list"
          @click="setActive(item.key)"
        >
          <div class="he-theme__heart" :class="item.className"></div>
          <div class="he-active__box" v-if="active === item.key">
            <he-icon type="le-icon-shangse"></he-icon>
            <span class="he-active__text">使用中</span>
          </div>
        </div>
      </div>
      <div class="he-theme__preview">
        <template v-for="(item, index) in list">
          <template v-if="active === item.key">
            <img
              :key="index + '_goods'"
              class="he-preview__image"
              :src="require('./image/he-' + (index + 1) + '-goods.png')"
            />
            <img
              :key="index + '_user'"
              class="he-preview__image"
              :src="require('./image/he-' + (index + 1) + '-user.png')"
            />
            <img
              :key="index + '_order'"
              class="he-preview__image"
              :src="require('./image/he-' + (index + 1) + '-order.png')"
            />
          </template>
        </template>
      </div>
    </div>
    <div class="le-cardpin">
      <el-button @click="setTheme" type="primary">保存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'themeColor',
  data() {
    return {
      active: 'red_theme',
      list: [
        {
          key: 'red_theme',
          className: 'he-red__theme'
        },
        {
          key: 'purple_theme',
          className: 'he-purple__theme'
        },
        {
          key: 'blue_theme',
          className: 'he-blue__theme'
        },
        {
          key: 'green_theme',
          className: 'he-green__theme'
        },
        {
          key: 'orange_theme',
          className: 'he-orange__theme'
        },
        {
          key: 'golden_theme',
          className: 'he-golden__theme'
        }
      ]
    };
  },
  mounted() {
    this.getTheme();
  },
  methods: {
    setActive: function (active) {
      this.active = active;
    },
    setTheme: function () {
      this.$heshop
        .fitment('post', {
          keyword: 'themeColor',
          content: this.active
        })
        .then(() => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        })
        .catch(err => {
          console.error(err);
        });
    },
    getTheme: function () {
      this.$heshop
        .search(
          'post',
          { include: 'fitment' },
          {
            keyword: 'themeColor'
          }
        )
        .then(res => {
          this.active = res.content;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style scoped="">
.le-form-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 68px;
}
.le-theme-list {
  display: flex;
}

.le-theme-list > div {
  width: 56px;
  height: 56px;
  background: #f3f5f7;
  border-radius: 28px;
  margin-right: 32px;
  cursor: pointer;
  display: flex;
}

.he-theme__heart {
  width: 32px;
  border-radius: 16px;
  height: 32px;
  margin: 12px;
}

.he-active__box {
  display: flex;
  align-items: center;
}

.he-active__text {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #000000;
  opacity: 0.65;
  margin-left: 9px;
}

.le-theme-list .he-theme__active {
  width: 155px;
}

.he-red__theme {
  background: linear-gradient(-45deg, #e60b30 0%, rgba(230, 11, 48, 0.4) 100%);
}

.he-purple__theme {
  background: linear-gradient(-45deg, #8f2df3 0%, rgba(143, 45, 243, 0.4) 100%);
}

.he-blue__theme {
  background: linear-gradient(-45deg, #33a7ff 0%, rgba(51, 167, 255, 0.4) 100%);
}

.he-green__theme {
  background: linear-gradient(-45deg, #1fc551 0%, rgba(31, 197, 81, 0.4) 100%);
}

.he-orange__theme {
  background: linear-gradient(-45deg, #ff7f00 0%, rgba(255, 127, 0, 0.4) 100%);
}

.he-golden__theme {
  background: linear-gradient(-45deg, #caa45a 0%, rgba(202, 164, 90, 0.4) 100%);
}

.he-theme__preview {
  height: 498px;
  margin-top: 56px;
}

.he-preview__image {
  height: 498px;
  width: 280px;
  box-shadow: 0 0 16px 0 rgba(33, 34, 36, 0.12);
}

.he-preview__image:not(:last-child) {
  margin-right: 56px;
}
</style>

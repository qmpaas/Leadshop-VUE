<template>
  <div
    class="package"
    ref="mobile"
    id="min-page"
    @dragover="allowDrop($event)"
    @drop="drop"
    @dragover.prevent
    :draggable="false"
    :data-index="-2"
  >
    <div v-for="(item, index) in pages" :key="index + 1" role="widgetgroup">
      <Covermask v-if="dragActive(index, 'top')"></Covermask>
      <Search v-if="item.name === 'search'" :facade="item.facade" :content="item.content" :index="index"></Search>
      <Title v-if="item.name === 'title'" :facade="item.facade" :content="item.content" :index="index"></Title>
      <navigation
        v-if="item.name === 'navigation'"
        :facade="item.facade"
        :content="item.content"
        :index="index"
      ></navigation>
      <Video v-if="item.name === 'video'" :facade="item.facade" :content="item.content" :index="index"></Video>
      <Banner v-if="item.name === 'banner'" :facade="item.facade" :content="item.content" :index="index"></Banner>
      <Goods v-if="item.name === 'goods'" :facade="item.facade" :content="item.content" :index="index"></Goods>
      <Blank v-if="item.name === 'blank'" :facade="item.facade" :content="item.content" :index="index"></Blank>
      <Separate v-if="item.name === 'separate'" :facade="item.facade" :content="item.content" :index="index"></Separate>
      <Tabs v-if="item.name === 'tabs'" :facade="item.facade" :content="item.content" :index="index"></Tabs>
      <Wechat v-if="item.name === 'wechat'" :facade="item.facade" :content="item.content" :index="index"></Wechat>
      <Notice v-if="item.name === 'notice'" :facade="item.facade" :content="item.content" :index="index"></Notice>
      <Rubik v-if="item.name === 'rubik'" :facade="item.facade" :content="item.content" :index="index"></Rubik>
      <Coupon v-if="item.name === 'coupon'" :facade="item.facade" :content="item.content" :index="index"></Coupon>
      <template v-if="$manifest('task', 'status')">
        <Task v-if="item.name === 'task'" :facade="item.facade" :content="item.content" :index="index"></Task>
      </template>
      <WechatLive
        v-if="item.name === 'wechatLive'"
        :facade="item.facade"
        :content="item.content"
        :index="index"
      ></WechatLive>
      <Covermask v-if="dragActive(index, 'down')" />
    </div>
    <div class="package-empty" :data-index="-2">
      <Covermask v-if="dragActive(-2, 'down')" :data-index="-2"></Covermask>
    </div>
  </div>
</template>
<script type="text/javascript">
import modules from './modules';
// import vuedraggable from '../../lib/vuedraggable.js';
import Covermask from '../../components/covermask.vue';

export default {
  components: {
    Title: modules.title.widget,
    Video: modules.video.widget,
    Separate: modules.separate.widget,
    Blank: modules.blank.widget,
    Banner: modules.banner.widget,
    Search: modules.search.widget,
    Goods: modules.goods.widget,
    Navigation: modules.navigation.widget,
    Rubik: modules.rubik.widget,
    Tabs: modules.tabs.widget,
    Notice: modules.notice.widget,
    Wechat: modules.wechat.widget,
    Coupon: modules.coupon.widget,
    Task: modules.task.widget,
    WechatLive: modules.wechatLive.widget,
    // vuedraggable,
    Covermask
  },
  data() {
    return {
      is_empty: false
    };
  },
  /**
   * ????????????
   * @type {Object}
   */
  computed: {
    dragIndex: {
      get() {
        return this.$store.state.finish.dragIndex;
      },
      set(value) {
        this.$store.commit('finish/setDragIndex', value);
      }
    },
    position: {
      get() {
        return this.$store.state.finish.position;
      },
      set(value) {
        this.$store.commit('finish/setDragPosition', value);
      }
    },
    select() {
      return this.$store.state.finish.index;
    },
    pages: {
      get() {
        return this.$store.state.finish.pages;
      },
      set(value) {
        this.$store.commit('finish/setPagesData', value);
      }
    },
    coms() {
      return this.$store.state.finish.coms;
    }
  },
  mounted() {
    this.loadPageInfo();
  },
  methods: {
    /**
     * ??????????????????
     * @return {[type]} [description]
     */
    loadPageInfo() {
      let id = this.$route.query.id;
      this.$heshop
        .pages('get', parseInt(id))
        .then(data => {
          this.pages = JSON.parse(data.content);
          this.$store.commit('finish/setPageInfo', data);
        })
        .catch(error => {
          console.error('????????????', error);
        });
    },
    /**
     * ????????????
     * @param  {[type]} index    [description]
     * @param  {[type]} position [description]
     * @return {[type]}          [description]
     */
    dragActive(index, position) {
      if (this.dragIndex === index && this.position == position && this.coms) {
        return true;
      } else {
        return false;
      }
    },
    /**
     * ??????????????????
     * @return {[type]} [description]
     */
    allowDrop($event) {
      let index = parseInt($event.target.dataset.index);
      if (index || index === 0) {
        this.dragIndex = index;
        //???????????????????????????
        if ($event.type === 'dragover' && $event.target.dataset) {
          //???????????????????????????
          if ($event.target.dataset.type === 'widget') {
            //??????Y????????????
            let y = parseFloat($event.offsetY);
            //????????????50%?????????????????????
            let h = parseFloat($event.target.clientHeight / 4);
            if (y < h) {
              this.position = 'top';
            } else {
              this.position = 'down';
            }
          }
        }
      }
      if (index == -2) {
        this.dragIndex = index;
        this.position = 'down';
      }
      $event.preventDefault();
    },
    /**
     * ?????????????????????????????????
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    drop() {
      this.$store.dispatch('finish/pushPagesComs');
    },
    draggableStart() {
      this.$store.commit('finish/setLock', true);
    },
    draggableEnd() {
      this.$store.commit('finish/setLock', false);
    }
  }
};
</script>

<style lang="less" scoped>
@import './style.less';
</style>

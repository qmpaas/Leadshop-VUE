<template>
  <div class="le-matter">
    <el-tabs v-model="activeName" type="card" class="he-tabs">
      <el-tab-pane label="图片" name="image">
        <photoSelect></photoSelect>
      </el-tab-pane>
      <el-tab-pane label="视频" name="video">
        <videoSelect></videoSelect>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import photoSelect from '@/pages/gallery/photoSelect/index.vue';
import videoSelect from '@/pages/gallery/videoSelect/index.vue';

export default {
  components: {
    photoSelect,
    videoSelect
  },
  data() {
    return {
      activeName: 'image',
      config: {
        action: {
          newGroup: true,
          editGroup: true,
          upload: true,
          newDirectory: true,
          onDelete: true,
          onMove: true,
          onRename: true,
          checkall: true
        }
      }
    };
  }
};
</script>

<template>
    <div class="leadshop">
    	这里是公共的
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <!-- 不需要缓存的视图组件 -->
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<style lang="less">
.leadshop {
    height: 100%;
    width: 100%;
}
</style>
/*
 * @Author: qinuoyun
 * @Date:   2020-09-08 10:12:19
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2021-06-21 14:40:07
 */
import Heshop from "@/leadshop/index.js"

//加载页面
import gallery from "./gallery.vue";


//初始化变量
let modules = {};

modules.install = function() {
    //添加设置界面
    Heshop.component("gallery", "index", gallery);
};

export default modules;

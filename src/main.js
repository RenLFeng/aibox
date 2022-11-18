import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";
import "./styles/element-variables.scss";

import "@/styles/index.scss"; // global css
import "@/styles/admin.scss";

import VueCodemirror from "vue-codemirror";
import "codemirror/lib/codemirror.css";
Vue.use(VueCodemirror);

import App from "./App";
import store from "./store";
import router from "./router";
import permission from "./directive/permission";

import { getDicts } from "@/api/admin/dict/data";
import { getItems, setItems } from "@/api/table";
import { getConfigKey } from "@/api/admin/sys-config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  /* download,*/ selectItemsLabel,
} from "@/utils/costum";

import "./icons"; // icon
import "./permission"; // permission control
import "./utils/error-log"; // error log
// import '@/assets/static/js/adminlte.min.js'
// import '@/assets/static/js/index.js'
// import '@/assets/static/plugins/jquery/jquery.min.js'
// import '@/assets/static/plugins/bootstrap/js/bootstrap.bundle.min.js'
// import '@/assets/static/plugins/sweetalert2/sweetalert2.min.js'
import vuescroll from "vuescroll";
import Viser from "viser-vue";
Vue.use(Viser);

import * as filters from "./filters"; // global filters

import Pagination from "@/components/Pagination";
import BasicLayout from "@/layout/BasicLayout";

import VueParticles from "vue-particles";
Vue.use(VueParticles);

import "@/utils/dialog";

import JSONView from "vue-json-viewer";
Vue.use(JSONView);

import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);


import Image from '@/components/image'
Vue. component( 'my-image', Image)

import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
Vue.use(Viewer);
Viewer.setDefaults({
  // 需要配置的属性 注意属性并没有引号  在线演示链接：http://fengyuanchen.github.io/viewerjs/examples/custom-toolbar.html
  // inline	布尔值	false	启用 inline 模式
  // button	布尔值	true	显示右上角关闭按钮（jQuery 版本无效）
  // navbar	布尔值/整型	true	显示缩略图导航
  // title	布尔值/整型	true	显示当前图片的标题（现实 alt 属性及图片尺寸）
  // toolbar	布尔值/整型	true	显示工具栏
  // tooltip	布尔值	true	显示缩放百分比
  // movable	布尔值	true	图片是否可移动
  // zoomable	布尔值	true	图片是否可缩放
  // rotatable	布尔值	true	图片是否可旋转
  // scalable	布尔值	true	图片是否可翻转
  // transition	布尔值	true	使用 CSS3 过度
  // fullscreen	布尔值	true	播放时是否全屏
  // keyboard	布尔值	true	是否支持键盘
  // interval	整型	5000	播放间隔，单位为毫秒
  // zoomRatio	浮点型	0.1	鼠标滚动时的缩放比例
  // minZoomRatio	浮点型	0.01	最小缩放比例
  // maxZoomRatio	数字	100	最大缩放比例
  // zIndex	数字	2015	设置图片查看器 modal 模式时的 z-index
  // zIndexInline	数字	0	设置图片查看器 inline 模式时的 z-index
  // url	字符串/函数	src	设置大图片的 url
  // build	函数	null	回调函数，具体查看演示
  // built	函数	null	回调函数，具体查看演示
  // show	函数	null	回调函数，具体查看演示
  // shown	函数	null	回调函数，具体查看演示
  // hide	函数	null	回调函数，具体查看演示
  // hidden	函数	null	回调函数，具体查看演示
  // view	函数	null	回调函数，具体查看演示
  // viewed	函数	null	回调函数，具体查看演示
  navbar:false,
  zIndex: 9999,
});

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getItems = getItems;
Vue.prototype.setItems = setItems;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectItemsLabel = selectItemsLabel;
// Vue.prototype.download = download
// 全局组件挂载
Vue.component("Pagination", Pagination);
Vue.component("BasicLayout", BasicLayout);

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
};

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: "error" });
};

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg);
};

Vue.use(permission);

Vue.use(Element, {
  size: Cookies.get("size") || "medium", // set element-ui default size
});

import VueDND from "awe-dnd";
Vue.use(VueDND);

Vue.use(vuescroll, {
  ops: {
    rail: {
      background: "#878787",
      opacity: 0,
      border: "none",
      /** 导轨的宽度 */
      size: "2px",
      /** Specify rail's border-radius, or the border-radius of rail and bar will be equal to the rail's size. default -> false **/
      specifyBorderRadius: false,
      /** Rail the distance from the two ends of the X axis and Y axis. **/
      gutterOfEnds: null,
      /** 距离外边的距离 **/
      gutterOfSide: "2px",
      /** Whether to keep rail show or not, default -> false, event content height is not enough */
      keepShow: true,
    },
    bar: {
      /** How long to hide bar after mouseleave, default -> 500 */
      showDelay: 500,
      /** Specify bar's border-radius, or the border-radius of rail and bar will be equal to the rail's size. default -> false **/
      specifyBorderRadius: false,
      /** Whether to show bar on scrolling, default -> true */
      onlyShowBarOnScroll: false,
      /** Whether to keep show or not, default -> false */
      keepShow: false,
      // 滚动条背景色
      background: "#878787",
      /** Bar's opacity, default -> 1  */
      opacity: 1,
      /** Styles when you hover scrollbar, it will merge into the current style */
      hoverStyle: false,
      // Should be false or a number in a range of (0, 1),
      // such as 0.5, means 50%. 0.3 means 30%.
      minSize: false,
      /** bar's size(Height/Width) , default -> 6px */
      size: "6px",
    },
  }, // 在这里设置全局默认配置
  // name: 'myScroll' // 在这里自定义组件名字，默认是vueScroll
});

import "remixicon/fonts/remixicon.css";

// register global utility filters
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = true;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
import Video from "video.js";
import VideoPlayer from "vue-video-player";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
Vue.use(VideoPlayer);
Vue.prototype.$video = Video;
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
Vue.use(VueViewer);

import "./assets/iconfont/iconfont.css";

import dataV from "@jiaminghi/data-view";
Vue.use(dataV);

// 引入vue-awesome
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;
import "echarts-liquidfill";

/**
 * <p  v-auth.role="description" data-value="description" action="">新建</p>
 *
 * v-auth.<绑定的模态框>="<需要传入的值>"
 * data-value="<回调改变的值>"
 * data-title="设置标题"
 *
 * 添加 affirm 方法
 * @param  {[type]} option [description]
 * @return {[type]}        [description]
 */
let directives = {
  /**
   * 数据池
   * @type {Array}
   */
  store: {},
  /**
   * 弹出层
   * @type {Object}
   */
  auth: {
    bind(el, binding, vnode) {
      setTimeout(() => checkInject(el, binding, vnode), 10);
    },
    componentUpdated(el, binding, vnode) {
      setTimeout(() => checkInject(el, binding, vnode), 10);
    },
    unbind(el) {
      removeDisabled(el);
    }
  }
};

export default directives;

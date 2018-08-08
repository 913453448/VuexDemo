/**
 * @author YASIN
 * @version [React-Native Ocj V01, 2018/8/1]
 * @date 17/2/23
 * @description index
 */
import lazyDelegate from './LazyDelegate';

export default {
  install(Vue, options = {}) {
    let LazyClass = lazyDelegate(Vue);
    let lazy = new LazyClass(options);
    Vue.prototype.$Lazyload = lazy
    Vue.directive('lazy', {
      bind: lazy.add.bind(lazy),
      update: lazy.update.bind(lazy),
      componentUpdated: lazy.lazyLoadHandler.bind(lazy),
      unbind: lazy.remove.bind(lazy),
    })
  }
}

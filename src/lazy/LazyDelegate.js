/**
 * @author YASIN
 * @version [React-Native Ocj V01, 2018/8/1]
 * @date 17/2/23
 * @description LazyDelegate
 */
import LazyListener from './listener';

const DEFAULT_ERRO_URL = require('../components/error.png');
const DEFAULT_LOADING_URL = require('../components/loading.png');
const DEFAULT_EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
export default function (Vue) {
  return class Lazy {
    constructor({error, throttleWait, loading, attempt}) {
      //存放每一个元素的Listener加载类
      this.ListenerQueue = []
      this.options = {
        throttleWait: throttleWait || 200,//截流时间
        error: error || DEFAULT_ERRO_URL,//默认失败图片
        loading: loading || DEFAULT_LOADING_URL,//默认成功图片
        attempt: attempt || 3 //重试次数
      }
      this.lazyLoadHandler = throttle(this._lazyLoadHandler.bind(this), this.options.throttleWait)

    }

    /**
     * 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
     * @param el 指令所绑定的元素，可以用来直接操作 DOM 。
     * @param binding
     * @param vnode
     */
    add(el, binding, vnode) {
      console.log('add');
      let {src, loading, error} = this._valueFormatter(binding.value)

      Vue.nextTick(() => {
        const newListener = new LazyListener({
          el,
          loading,
          error,
          src,
          options: this.options,
          elRenderer: this._elRenderer.bind(this),
        })
        this.ListenerQueue.push(newListener)
        //获取滚动元素
        let $parent;
        if (!$parent) {
          $parent = scrollParent(el)
        }
        //给window添加监听
        this._addListenerTarget(window)
        //给父滚动元素添加监听
        this._addListenerTarget($parent)
        Vue.nextTick(() => {
          this.lazyLoadHandler()
        })
      })
    }

    /**
     * 添加监听
     * @param el
     * @private
     */
    _addListenerTarget(el) {
      if (!el) return
      DEFAULT_EVENTS.forEach((evt) => {
        el.addEventListener(evt, this.lazyLoadHandler.bind(this), false)
      })

    }

    update(el, binding) {
      console.log('update');
      let {src, loading, error} = this._valueFormatter(binding.value)
      //找出经纪人（listener）是否之前存在
      let exsit
      for (let i = 0; i < this.ListenerQueue.length; i++) {
        let listener = this.ListenerQueue[i]
        if (listener.el === el) {
          exsit = listener
          break
        }
      }
      //如果存在就调用listener的update方法
      if (!!exsit) exsit.update({src, loading, error})
      //重新加载图片
      Vue.nextTick(() => this.lazyLoadHandler())
    }

    /**
     * 移除listener
     * @param el
     */
    remove(el) {
      console.log('remove');
      let existItem
      for (let i = 0; i < this.ListenerQueue.length; i++) {
        let listener = this.ListenerQueue[i]
        if (listener.el === el) {
          existItem = listener
          break
        }
      }
      if (existItem) {
        remove(this.ListenerQueue, existItem) && existItem.destroy()
        existItem = null
      }
    }

    /**
     * 通知所有的listener该干活了
     * @private
     */
    _lazyLoadHandler() {
      //找出哪些是已经完成工作了的
      console.log('_lazyLoadHandler');
      const freeList = []
      this.ListenerQueue.forEach((listener, index) => {
        if (!listener.state.error && listener.state.loaded) {
          return freeList.push(listener)
        }
        //判断是否在窗体内，不在就不去加载图片了
        if (!listener.checkInView()) return;
        console.log(listener.src + '可以加载了');
        listener.load()
      })
      //把完成工作的listener剔除
      freeList.forEach(vm => remove(this.ListenerQueue, vm))
    }

    /**
     * 根据状态渲染src
     * @param listener 经纪人
     * @param state 状态
     * @private
     */
    _elRenderer(listener, state) {
      if (!listener.el) return
      const {el} = listener

      let src
      switch (state) {
        case 'loading':
          src = listener.loading
          break
        case 'error':
          src = listener.error
          break
        default:
          src = listener.src
          break
      }
      //通过js方法给el设置上src属性
      if (el.getAttribute('src') !== src) {
        el.setAttribute('src', src)
      }
      el.setAttribute('lazy', state)
    }

    _valueFormatter(value) {
      let src = value;
      let loading = this.options.loading;
      let error = this.options.error;

      // 如果value是一个object类型的时候
      if (value !== null && typeof value === 'object') {
        src = value.src;
        loading = value.loading || loading;
        error = value.error || error;
      }
      return {
        src,
        loading,
        error
      }
    }
  }
}

function throttle(action, delay) {
  let timeout = null
  let lastRun = 0
  return function () {
    if (timeout) {
      return
    }
    let elapsed = Date.now() - lastRun
    let context = this
    let args = arguments
    let runCallback = function () {
      lastRun = Date.now()
      timeout = false
      action.apply(context, args)
    }
    if (elapsed >= delay) {
      runCallback()
    } else {
      timeout = setTimeout(runCallback, delay)
    }
  }
}

function remove(arr, item) {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index > -1) return arr.splice(index, 1)
}

function scrollParent(el) {
  if (!(el instanceof HTMLElement)) {
    return window
  }
  let parent = el

  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      break
    }

    if (!parent.parentNode) {
      break
    }

    if (/(scroll|auto)/.test(overflow(parent))) {
      return parent
    }

    parent = parent.parentNode
  }

  return window
}

function overflow(el) {
  return style(el, 'overflow') + style(el, 'overflow-y') + style(el, 'overflow-x')
}

const style = (el, prop) => {
  return typeof getComputedStyle !== 'undefined'
    ? getComputedStyle(el, null).getPropertyValue(prop)
    : el.style[prop]
}

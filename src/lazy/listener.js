/**
 * @author YASIN
 * @version [React-Native Ocj V01, 2018/8/1]
 * @date 17/2/23
 * @description listener
 */
export default class LazyListener {
  constructor({el, src, error, loading, options, elRenderer}) {
    this.el = el
    this.src = src
    this.error = error
    this.loading = loading
    this.attempt = 0 //重试次数
    this.naturalHeight = 0
    this.naturalWidth = 0

    this.options = options
    //组件状态渲染方法
    this.elRenderer = elRenderer
    //初始化组件状态
    this.initState()
  }

  /**
   * 初始化组件状态
   */
  initState() {
    this.state = {
      error: false,
      loaded: false,
      rendered: false
    }
  }

  /**
   * 加载图片的方法
   * @param onFinish 完成回调
   */
  load(onFinish) {
    //如果重试的次数>我们设置的次数并且失败的时候我们直接不加载了
    if ((this.attempt > this.options.attempt - 1) && this.state.error) {
      onFinish && onFinish()
      return
    }
    //如果该组件已经加载完毕了直接结束
    if (this.state.loaded) {
      this.state.loaded = true
      onFinish && onFinish()
      //渲染src
      return this.render('loaded')
    }
    this.renderLoading(() => {
      this.attempt++
      loadImageAsync({
        src: this.src
      }, data => {
        this.naturalHeight = data.naturalHeight
        this.naturalWidth = data.naturalWidth
        this.state.loaded = true
        this.state.error = false
        this.render('loaded')
        onFinish && onFinish()
      }, err => {
        this.state.error = true
        this.state.loaded = false
        this.render('error')
      })
    })
  }

  update({src, loading, error}) {
    const oldSrc = this.src
    this.src = src
    this.loading = loading
    this.error = error
    if (oldSrc !== src) {
      //重置load状态
      this.initState()
      //重置重试次数
      this.attempt = 0
    }
  }

  /**
   * 渲染loading
   * @param cb 回调
   */
  renderLoading(cb) {
    loadImageAsync({
      src: this.loading
    }, data => {
      this.render('loading')
      cb()
    }, () => {
      cb()
    })
  }

  /**
   * 根据状态渲染src
   * @param state
   */
  render(state) {
    this.elRenderer(this, state)
  }

  /*
   * destroy
   * @return
   */
  destroy() {
    this.el = null
    this.src = null
    this.error = null
    this.loading = null
    this.attempt = 0
  }

  getRect() {
    this.rect = this.el.getBoundingClientRect()
  }

  checkInView() {
    this.getRect()
    return (this.rect.top < window.innerHeight && this.rect.bottom > 0
      && this.rect.left < window.innerWidth && this.rect.right > 0)
  }
}
const loadImageAsync = (item, resolve, reject) => {
  let image = new Image()
  image.src = item.src

  image.onload = function () {
    resolve({
      naturalHeight: image.naturalHeight,
      naturalWidth: image.naturalWidth,
      src: image.src
    })
  }

  image.onerror = function (e) {
    reject(e)
  }
}

<template>
  <div class="opt-container">
    <div v-for="(image,index) in images" v-bind:key="'image-'+index">
      <img v-lazy="{src: image}" width="100%" height="500px">
    </div>
  </div>
</template>

<script>
  const IMAGES = [
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533137283186&di=c136f7387cfe2b79161f2f93bff6cb96&imgtype=0&src=http%3A%2F%2Fpic1.cxtuku.com%2F00%2F09%2F65%2Fb3468db29cb1.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533137283186&di=de941561df3b6fd53b2df9bfd6c0b187&imgtype=0&src=http%3A%2F%2Fpic43.photophoto.cn%2F20170413%2F0008118236659168_b.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533137283185&di=aff7e8aa60813f6e36ebc6f6a961255c&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01d60f57e8a07d0000018c1bfa2564.JPG%403000w_1l_2o_100sh.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533726597165&di=198b9836a377021082281fcf0e5f3331&imgtype=0&src=http%3A%2F%2Fchongqing.sinaimg.cn%2Fiframe%2F159%2F2012%2F0531%2FU9278P1197T159D1F3057DT20140627094648.jpg',
    'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533726597167&di=e06fc5f74fac9bb61d229249219cbe4f&imgtype=0&src=http%3A%2F%2Fimg2.ph.126.net%2FuWKrNCkdBNBPzdjxCcUl-w%3D%3D%2F6630220042234317764.jpg'
  ]
  export default {
    name: 'Lazy',
    data() {
      return {
        images: IMAGES,
        showImage: true
      }
    },
    mounted(){
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .opt-container {
    font-size: 0px;
  }
</style>

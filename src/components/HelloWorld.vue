<template>
  <div class="hello">
    {{doneTodos}}
    <div class="opt-container">
      <div class="opt opt-increase" @click="increase">+</div>
      <span class="opt">{{count}}</span>
      <div class="opt opt-decrease" @click="decrease">-</div>
    </div>
    <div class="opt-container">
      <div class="opt opt-increase" @click="increaseA">+</div>
      <span class="opt">{{aCount}}</span>
      <div class="opt opt-decrease" @click="increaseA">-</div>
    </div>
  </div>
</template>

<script>
  import {mapState,mapActions} from 'vuex'
  export default {
    name: 'HelloWorld',
    computed: {
      count() {
        return this.$store.state.count
      },
      doneTodos(){
        return this.$store.getters.doneTodos
      },
      ...mapState('a',{
        aCount: 'count'
      })
    },
    methods: {
      increase() {
        this.$store.dispatch({type:'increase'}).then(()=>{
          alert('执行了一次加法');
        });
      },
      decrease() {
        this.$store.dispatch({type:'decrease'});
      },
      ...mapActions('a',{
        increaseA: {type:'increase'},
        decreaseA: {type:'decrease'}
      }),
//      increaseA(){
//        this.$store.dispatch({type:'a/increase'});
//      },
//      decreaseA() {
//        this.$store.dispatch({type:'a/decrease'});
//      },
    },
    mounted(){
      this.$store.subscribeAction((action,state)=>{
        alert('你正在操作action，type为:'+action.type);
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .opt-container {
    font-size: 0px;
  }

  .opt {
    display: inline-block;
    text-align: center;
    height: 40px;
    width: 40px;
    border-radius: 20px;
    background-color: #efefef;
    line-height: 40px;
    user-select: none;
    font-size: 20px;
    margin: 0 10px;
    vertical-align: middle;
  }
</style>

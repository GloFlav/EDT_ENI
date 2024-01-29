<template>
  <div>
    <HeaderPart/>
    <SideBar/>
    <main id="main" class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component"/>
          </transition>
        </router-view>
    </main>
  </div>
</template>

<script>
import HeaderPart from '@/components/mainComponent/HeaderPart.vue'
import SideBar from '@/components/mainComponent/SideBar.vue'
export default {
  components: {
    HeaderPart,
    SideBar
  },
  data() {
    return {
    }
  }
}
</script>
<style>

</style>

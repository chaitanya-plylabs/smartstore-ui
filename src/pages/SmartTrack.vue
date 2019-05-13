<template>
 <div class="smart-track">
   <div class="tab-section">
     <q-tabs v-model="tab">
       <q-tab name="about" slot="title" label="About"></q-tab>
       <q-tab name="run" slot="title" label="Run"></q-tab>
     </q-tabs>
     <div v-if="tab === 'about'" class="about">
       <div class="heading">Smart Track</div>
     </div>
   </div>
 </div>
</template>
<script>
export default {
  data () {
    return {
      tab: 'about'
    }
  }
}
</script>

<style>
.about {
  padding: 20px;
}

.about .heading {
  font-size: 17px;
  font-weight: 500;
}
</style>

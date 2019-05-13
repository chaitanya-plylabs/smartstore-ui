<template>
 <div class="smart-replenishment">
   <div class="tab-section">
     <q-tabs v-model="tab">
       <q-tab name="about" slot="title" label="About"></q-tab>
       <q-tab name="run" slot="title" label="Run"></q-tab>
     </q-tabs>
     <div v-if="tab === 'about'" class="about">
       <div class="heading">Smart Replenishment</div>
     </div>
     <div v-if="tab === 'run'">

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

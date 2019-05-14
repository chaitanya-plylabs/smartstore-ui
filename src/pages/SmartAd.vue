<template>
 <div class="smart-ad">
   <div class="tab-section">
     <q-tabs v-model="tab">
       <q-tab name="about" slot="title" label="About"></q-tab>
     </q-tabs>
     <div v-if="tab === 'about'" class="about">
       <div class="heading">Smart Ad</div>
       <div>
Smart Ad displays relevant ads and generates personalised offers based on individual’s purchase history, loyalty points and data collected from his/her network of IoT devices like smart refrigerators, smart cars, etc. It also does proximity marketing based on user's location in the store.

Example use cases can be:
- Display an ad related to vegetables if their quantity fell below a threshold in his/her refrigerator
- Display an ad related to sauces when the customer is around sauce rack and pasta is present in his/her cart       

It's future work...
       </div>
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

<style scoped>
.about {
  padding: 20px;
  font-family: inherit;
  font-size: inherit;
  line-height: 30px;
  margin-top: 2px;
  white-space: pre-wrap;
}

.about .heading {
  font-size: 17px;
  font-weight: 500;
  height: 20px;
}

.about .purpose {
  font-size: 16px;
  height: 30px;
}

.about .line-break {
  height: 10px;
}

.about .line-break-5 {
  height: 5px;
}

</style>

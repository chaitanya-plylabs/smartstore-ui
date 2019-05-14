<template>
 <div class="smart-replenishment">
   <div class="tab-section">
     <q-tabs v-model="tab">
       <q-tab name="about" slot="title" label="About"></q-tab>
       <q-tab name="run" slot="title" label="Run"></q-tab>
     </q-tabs>
     <div v-if="tab === 'about'" class="about">
       <div class="heading">Smart Replenishment</div>
<div>
Smart replenishment reduces operational cost & prevents stock outs through auto-generation of transfer orders/purchase orders based on demand forecast, inventory holding costs (store & warehouse), assortment plan, holding capacities (store & warehouse), transportation costs etc.
The demand for all the SKUs in a store will be forecasted periodically (every day).
A forecasting model can be picked based on its accuracy in predicting previous sales.
It can be any time series models like ARIMA, SARIMA, BSTS, random forests etc (or) Simple Moving Average(SMA) if data is found to be white noise (random)
Whenever the inventory in the store reaches critical point, the replenishment module will select the best days to replenish and the quantites to be replenished on those days.
After forecasting we can use DJRP - "Co-ordinated Deterministic Dynamic Demand Joint Replenishment" methods.

In DJRP, we will try to solve an optimization problem with objective of minimizing operational cost with various constraints. 
Its a Mixed Integer Linear Programming (MILP) problem.
Objective: Minimize Operational Cost
Input & Constraints:
- number of time periods
- ordering costs
- holding costs
- demand
- replenishment capacities
- max number of replenishment cycles
Output:
- optimal objective value
- replenishment dates
- replenishment quantities

Sometimes, finding an optimal solution takes long time (hours or even days) as solving a MILP problem is NP-Hard (exponential complexity). In such scenarios, we can set time limit for the run time of MILP solver and can try other heuristics methods - they can give a solution nearer to optimal in polynomial time complexity.

Tch Stack: Julia, CoinOptServices
</div>
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

.simulate {
  padding: 20px;
  font-family: inherit;
  font-size: inherit;
  line-height: 30px;
  margin-top: 2px;
}

.simulate .btn {
  margin-top: 37px;
  margin-bottom: 40px;
  margin-left:20px;
}

.simulate .no-of-visits {
  width: 200px;
  margin-top: 20px;
  float: left;
}
</style>

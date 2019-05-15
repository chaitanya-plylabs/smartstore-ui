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
It can be any models like ARIMA, SARIMA, BSTS, random forests, sma etc.
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

Tech Stack: Julia, CoinOptServices
</div>
     </div>
     <div v-if="tab === 'run'" class="simulate">
          Limit number of days/periods to 10-15 to get timely response. In production, these jobs will be excuted over night as it takes around 10 min to couple of hours.
          <br/>
          <br/>  
          <q-input v-model="constraints.numberOfTimePeriods" stack-label="Number of days/periods" />
          <q-input v-model="constraints.orderingCost" stack-label="Ordering cost" />
          <q-input v-model="constraints.maxReplenishmentCycles" stack-label="Maximum replenishment cycles" />
          <q-input v-model="constraints.itemHoldingCost" stack-label="Holding cost per item per day" />
          <q-btn @click="replenish();" color="primary" class="btn">Replenish</q-btn>
          <div class="processing" v-if="!!loading && !processed">Processing...</div>
          <div class="processing" v-if="!!error && !!processed">Please try again..</div>
          <div class="forecast" v-if="!!processed">
            <q-table
                title="Forecast Table (simulated demand)"
                :data="forecastTableData"
                :columns="forecastColumns"
                row-key="id"
                hide-header
                hide-bottom
                :pagination="pagination"
              />
          </div>
          <div class="objective" v-if="!!processed">
              optimal operational cost = {{objectiveValue}}
              <br/>
              number of replenishment maxReplenishmentCycles = {{numberOfReplenishmentCycles}}
          </div>
          <div class="replenish" v-if="!!processed">
            <q-table
                title="Replenish Quantity Table"
                :data="replenishTableData"
                :columns="replenishColumns"
                row-key="id"
                hide-header
                hide-bottom
                :pagination="pagination"
              />
          </div>
     </div>
   </div>
 </div>
</template>
<script>
import { SmartstoreApi } from  'src/api'
export default {
  data () {
    return {
      tab: 'about',
      constraints: {
          numberOfTimePeriods: 10,
          orderingCost: 10000,
          totalReplenishmentCapacity: 500000,
          maxReplenishmentCycles: 5,
          skuOrderingCostLookup: {},
          skuHoldingCostLookup: {},
          skuReplenishmentCapacity: {},
          itemHoldingCost: 3
      },
      forecastColumns: [],
      forecastTableData: [],
      pagination: {
          rowsPerPage: 12
      },
      replenishColumns: [],
      replenishTableData: [],
      objectiveValue: 0,
      numberOfReplenishmentCycles: 0,
      processed: false,
      loading: false,
      error: false
    }
  },
  methods: {
      replenish: function() {
          this.processed = false;
          this.loading = true;
          this.error = false;
          const skuHoldingCostLookup = {};
          for(let i = 1; i <= 10; i++) {
            let id = i !== 10 ? `SKU000000${i}` : `SKU0000010`;
            skuHoldingCostLookup[id] = this.constraints.itemHoldingCost;
          }
          this.constraints.skuHoldingCostLookup = skuHoldingCostLookup;
          SmartstoreApi.replenish("STORE00001", this.constraints)
          .then(response => {
              const forecast = response.data.forecast;
              const N = this.constraints.numberOfTimePeriods;
              const forecastTable = this.convertLookupToTable(N, forecast);
              this.forecastColumns = forecastTable.columns;
              this.forecastTableData = forecastTable.tableData;
              const replenish = response.data.replenishQuantity;
              const replenishTable = this.convertLookupToTable(N, replenish);
              this.replenishColumns = replenishTable.columns;
              this.replenishTableData = replenishTable.tableData;
              this.objectiveValue = response.data.objectiveValue;
              this.numberOfReplenishmentCycles = response.data.replenishFlags.filter(x => x === 1).length;
              this.processed = true;
          })
          .catch(error => {
            this.processed = true;
            this.error = true;
          });
      },
      convertLookupToTable: function(N, lookup) {
        let columns = [];
        columns.push({ field: "id", label: "sku"})
        for(let i = 0; i < N; i++) columns.push({ field: `day_${i}`, label: `day_${i}` });
        let tableData = [];
        for(let i = 1; i <= 10; i++) {
          let id = i !== 10 ? `SKU000000${i}` : `SKU0000010`;
          let row = {}
          row["id"] = id;
          for(let j = 0; j < N; j++) row[`day_${j}`] = lookup[id][j];
          tableData.push(row);
        }
        return { columns: columns, tableData: tableData }; 
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

.simulate {
  padding: 20px;
  font-family: inherit;
  font-size: inherit;
  line-height: 30px;
  margin-top: 2px;
  color: #555555
}

.simulate .q-input {
    margin-bottom:30px;
    max-width: 300px;
}

.simulate .btn {
  margin-top: 10px;
  margin-bottom: 40px;
}

.simulate .no-of-visits {
  width: 200px;
  margin-top: 20px;
  float: left;
}

.simulate .forecast{
    margin-bottom:30px;
    padding-left: 30px;
    padding-right: 30px;
}

.simulate .replenish {
    margin-bottom: 30px;
    margin-top: 30px;
    padding-left: 30px;
    padding-right: 30px;
}

.simulate .objective {
    padding-left: 40px;
}

.simulate .processing {
    margin-left: 8px
}

</style>

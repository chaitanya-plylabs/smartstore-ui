<template>
 <div class="smart-checkout">
   <div class="tab-section">
     <q-tabs v-model="tab">
       <q-tab name="about" slot="title" label="About"></q-tab>
       <q-tab name="run" slot="title" label="Run"></q-tab>
     </q-tabs>
     <div v-if="tab === 'about'" class="about">
       <div class="heading">Smart Checkout</div>
<div>
Smart checkout prevents long queues by removing the need for billing counters and enhances shopping experience by enabling customers to discover their products of choice.
The smartstore will be equipped with IOT sensors and a local wifi server which will be in constant communication with centralised cloud infrastructure for out of band processing.
The IOT devices can be following: 
1. Beaconstac's BLE Proximity Beacons to track user position 
2. AVIA Semiconductor's HX711 (with load cell) and to calculate weights of shopping cart and rack
3. Espressif System's ESP8266 to transmit cart information from physical cart to local wifi server
4. A smart phone attached to physical cart which can scan products using an app that publishes corresponding events 

A customer enters the store, picks one of the smart carts and scans the QR code present on smart phone attached to the cart.
An unique virtual cart id will be assigned to that transaction and the shopping begins. 
Customer can pick up an item, scan the bar code using the smart phone attached and place it in the cart.
The smart phone also captures the signals issued by BLE proxmity beacons and raise events to the local wifi server. These events will be used to predict the user's location using triangulation. 
The weights of both carts and racks will be frequently communicated to local wifi server.
Customer can pay through his any available payment modes and can take out his items.
Customer can view his past bills through smartstore mobile app.

The following commands/events can be published by the IOT devices
<b>CartCreatedEvent</b> { "storeId": "${storeId}", "userId": "${userId}", "cartId": "${cartId}" }
<b>UserEnteredBeaconProximityEvent</b> { "storeId": "${storeId}", "userId": "${userId}" }
<b>ItemAddedToCartEvent</b>: { "storeId": "${storeId}", "cartId": "${cartId}", "skuId": "${skuId}" }
<b>ItemRemovedFromCartEvent</b>: { "storeId": "${storeId}", "cartId": "${cartId}", "skuId": "${skuId}" }
<b>CartCheckedoutEvent</b>: { "storeId": "${storeId}", "cartId": "${cartId}" }
<b>PaymentProcessedEvent</b>: { "storeId": "${storeId}", "cartId": "${cartId}", "paymentId": "${paymentId}" }

The backend is based on Domain Driven Design(DDD) architecture with "Event Sourcing" & "CQRS(Command Query Responsibility Segregation)" patterns.
Initially introduced and made popular by programmer Eric Evans in his 2004 book, Domain-Driven Design: Tackling Complexity in the Heart of Software, domain-driven design is the expansion upon and application of the domain concept, as it applies to the development of software. It aims to ease the creation of complex applications by connecting the related pieces of the software into an ever-evolving model. DDD focuses on three core principles:
- placing the project's primary focus on the core domain and domain logic
- basing complex designs on a model of the domain
- initiating a creative collaboration between technical and domain experts to iteratively refine a conceptual model that addresses particular domain problems.

In event sourcing, every action on a domain object will result in an Immutable event which will be persisted in an event store and the state of any domain object is calculated by left folding all the events happened till that point.
The benefits of event sourcing are:
- consistences between transactional data and audit data is assured
- ability to analyze events stream and derive important business information through data analytics 
- improves write performance, since all types of events are simply appended to the data store (no updates and no deletes).
- event sourcing together with CQRS pattern can help us design massively scalable applications
Its best-fit for our smartstore usecase.

CQRS says - Instead of separating logic into separate layers, logic is separated based on whether it is changing an application's state or querying it. That means that executing commands (actions that potentially change an application's state) are executed by different components than those that query for the application's state. The most important reason for this separation is the fact that there are different technical and non-technical requirements for each of them. When commands are executed, the query components are (a)synchronously updated using events. This mechanism of updates through events, is what makes this architecture is extensible, scalable and ultimately more maintainable.

More can be found at - 
<a href="https://domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf" target="_blank">https://domainlanguage.com/wp-content/uploads/2016/05/DDD_Reference_2015-03.pdf</a>
<br/>
<a href="https://www.martinfowler.com/eaaDev/EventSourcing.html" target="_blank">https://www.martinfowler.com/eaaDev/EventSourcing.html</a>
<br/>
<a href="https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs" target="_blank">https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs</a>
<br/>
Tech Stack: Java 11, Spring Boot Webflux, Spring Boot JPA, Axon Framework, Axon Server, PosgreSQL 
</div>
     </div>
     <div v-if="tab === 'run'" class="simulate">
       <div>
         <b>Prototype data considerations:</b> <div class="line-break"></div>
         2 Stores - Store A and Store B <div class="line-break"></div>
         8 Users - Aarav, Vivaan, Aditya, Dhruv, Krishna, Keerthi, Naina, Oviya <div class="line-break"></div>
         10 SKUs - Steam Rice Kolam, Poha, Basmato Rice, Maida, Besan, Whole Wheat Atta, Multigrain Atta, Milk, Curd, Cheese <div class="line-break"></div>
       </div>
       <q-select class="no-of-visits" v-model="simultaneousVisits" :options="simultaneousVisitsOptions" :stack-label="`Number of users`"/>
       <q-btn @click="simulate();" color="primary" class="btn">Simulate Visit(s)</q-btn>
       <div class="events">
         <div :key="index" v-for="(event, index) in events">
           <span :style="{color: event.color}">{{event.data}}</span>
         </div>
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
      stores: [
       { id: "STORE00001", name: "Store A" },
       { id: "STORE00002", name: "Store B" }
      ],
      users: [
        { id: "USER000001", color: "#F44336", name: "Aarav" },
        { id: "USER000002", color: "#E91E63", name: "Vivaan" },
        { id: "USER000003", color: "#9C27B0", name: "Aditya" },
        { id: "USER000004", color: "#673AB7", name: "Dhruv" },
        { id: "USER000005", color: "#3F51B5", name: "Krishna" },
        { id: "USER000006", color: "#4CAF50", name: "Keerthi" },
        { id: "USER000007", color: "#03A9F4", name: "Naina" },
        { id: "USER000008", color: "#009688", name: "Oviya" }  
      ],
      skus: [
        { id: "SKU0000001", name: "Steam Rice - Kolam", price: 60, weight: 1000 },
        { id: "SKU0000002", name: "Poha", price: 49, weight: 1000 },
        { id: "SKU0000003", name: "Basmati Rice - Dubar", price: 156.50, weight: 1000 },
        { id: "SKU0000004", name: "Maida", price: 35, weight: 1000 },
        { id: "SKU0000005", name: "Besan", price: 85, weight: 1000 },
        { id: "SKU0000006", name: "Atta - Whole Wheat", price: 33.90, weight: 1000 },
        { id: "SKU0000007", name: "Atta - Multigrains", price: 38.50, weight: 1000 },
        { id: "SKU0000008", name: "Milk", price: 23.00, weight: 1000 },
        { id: "SKU0000009", name: "Curd", price: 33.36, weight: 500 },
        { id: "SKU0000010", name: "Cheese", price: 129.00, weight: 200 }
        ],
      events: [],
      simultaneousVisits: 1,
      simultaneousVisitsOptions: [
        {label: "1", value: 1},
        {label: "2", value: 2},
        {label: "3", value: 3},
        {label: "4", value: 4},
        {label: "5", value: 5},
        {label: "6", value: 6},
        {label: "7", value: 7},
        {label: "8", value: 8}
      ]
    }
  },
  methods: {
    simulate: function() {
      this.events =[];
      let availableUsers = this.users.slice(0);
      for(let v = 0; v < this.simultaneousVisits; v++) {
        setTimeout(()=> { 
        let user = availableUsers.splice(Math.floor(Math.random()*availableUsers.length), 1)[0];
        let store =  this.stores[Math.floor(Math.random()*this.stores.length)];
        SmartstoreApi.createCart(store.id, { "userId": user.id })
        .then(response => {
          let cartId = response.headers["x-resource-id"];
          this.events.push({ data: `${user.name} visited ${store.name} and the cart ${cartId} assigned to ${user.name}`, color: user.color});
          let cartSkus = []; 
          let actionBias = [1,1,1,1,1,1,1,1,0,0];
          let n = Math.floor(Math.random()*10) + 1;
          let weight = 0.0;
          let price = 0.0;
          let promises = [];
          for(let i = 0; i < n; i++) {
            let action = actionBias[Math.floor(Math.random()*actionBias.length)];
            let sku = this.skus[Math.floor(Math.random()*this.skus.length)];
            if(action === 1) {
              let promise = SmartstoreApi.addItem(store.id, cartId, sku.id).then(response => {  weight += sku.weight; price += sku.price; this.events.push({ data:`${sku.name} with price ${sku.price} added to ${user.name}'s cart, current weight: ${weight}, current price: ${Math.round(price*100)/100}`, color: user.color}); })
              promises.push(promise);
            } else if(action === 0) {
              let promise = SmartstoreApi.removeItem(store.id, cartId, sku.id).then(response => { weight -= sku.weight; price -= sku.price; this.events.push({ data: `${sku.name} with price ${sku.price} removed from ${user.name}'s cart, current weight: ${weight}, current price: ${Math.round(price*100)/100}`, color: user.color});  })
              promises.push(promise);
            }
          }
          Promise.all(promises.map(p => p.catch(e => e)))
          .then(results => {
              SmartstoreApi.checkout(store.id, cartId, { cartWeight: weight }).then(response => {
              this.events.push({ data: `The cart ${cartId} has been checkout by ${user.name} and total price is ${response.data.totalPrice}`, color: user.color});
              SmartstoreApi.processed(store.id, cartId, { amount: response.data.totalPrice} ).then(res => {
                this.events.push({ data: `The payment of ${response.data.totalPrice} for cart ${cartId} by ${user.name} has successfully processed`, color: user.color});
                this.events.push({ data: `${user.name} left ${store.name}`, color: user.color});
              })
            })
          });
        });
        }, Math.floor(Math.random()*100));

      }

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

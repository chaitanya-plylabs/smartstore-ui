<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-drawer
      class="side-menu"
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list no-border link inset-delimiter>
        <q-item @click.native="$router.push('/')">
          <q-item-side icon="add_shopping_cart" />
          <q-item-main label="Smart Checkout" />
        </q-item>
        <q-item @click.native="$router.push('/smart-replenishment')">
          <q-item-side icon="code" />
          <q-item-main label="Smart Replenishment" />
        </q-item>
        <q-item @click.native="$router.push('/smart-ad')">
          <q-item-side icon="movie" />
          <q-item-main label="Smart Ad"/>
        </q-item>
        <q-item @click.native="$router.push('/smart-track')">
          <q-item-side icon="track_changes" />
          <q-item-main label="Smart Track" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
.side-menu .q-layout-drawer {
  width: 250px !important;
}

.side-menu .q-layout-drawer .q-item {
  min-height: 50px;
}

.q-layout-page-container {
  padding-left: 250px !important;
}
</style>

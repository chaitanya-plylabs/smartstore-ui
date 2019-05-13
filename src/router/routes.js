
const routes = [
  {
    path: '/',
    component: () => import('layouts/Default.vue'),
    children: [
      { path: '', component: () => import('pages/SmartCheckout.vue') }
    ]
  },
  {
    path: '/smart-replenishment',
    component: () => import('layouts/Default.vue'),
    children: [
      { path: '', component: () => import('pages/SmartReplenishment.vue') }
    ]
  },
  {
    path: '/smart-ad',
    component: () => import('layouts/Default.vue'),
    children: [
      { path: '', component: () => import('pages/SmartAd.vue') }
    ]
  },
  {
    path: '/smart-track',
    component: () => import('layouts/Default.vue'),
    children: [
      { path: '', component: () => import('pages/SmartTrack.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

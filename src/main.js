import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'


import { library } from '@fortawesome/fontawesome-svg-core'
import { faTint, faTachometerAlt, faWind, faTrash, faEraser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTint, faTachometerAlt, faWind, faTrash, faEraser);

createApp(App).component('font-awesome-icon', FontAwesomeIcon).mount('#app')




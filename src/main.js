import Vue from 'vue'
import Router from 'vue-router'
import './cdn/test.js'
import IsobitUI from 'isobit-ui'
import Ionic from '@ionic/vue';
import App from './App.vue'
Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(IsobitUI);
Vue.use(Ionic);
var a=window.axios;
a.defaults.baseURL =process.env.VUE_APP_BASE_URL;
const  router  =  new  Router({
	mode: 'history',
	routes: [
		{
			path:'/admin',
			component:  r => require.ensure([], () => r(require('./Admin.vue')), 'big-pages'),
			children:[
				{
					path:  '',
					component:  r => require.ensure([], () => r(require('./Blank.vue')), 'big-pages')
				},
				{
					path:  'profile',
					component:  r => require.ensure([], () => r(require('./admin/Profile.vue')), 'big-pages')
				},
				{
					path:  'rh/marking/create',
					component:  r => require.ensure([], () => r(require('./admin/rh/marking/Create.vue')), 'marking-create')
				},
				{
					path:  'rh/marking/marking/:id/edit',
					component:  r => require.ensure([], () => r(require('./admin/rh/marking/Create.vue')), 'marking-create')
				},
				{
					path:  'rh/marking',
					component:  r => require.ensure([], () => r(require('./admin/rh/marking/List.vue')), 'big-pages')
				}
			]
		},
		{
			path:'/login',
			component:  r => require.ensure([], () => r(require('./Login.vue')), 'login')
		},
		{
			path:'/password',
			component:  r => require.ensure([], () => r(require('./Password.vue')), 'big-pages')
		}
	]
});
router.beforeEach((to, from, next) => {
	var session = localStorage.getItem('session');
	if(to.path=='/logout'){
		if(session){
			window.$app.session=null;
			window.axios.config={};
			localStorage.removeItem('session');
		}
		next('/');
		return;
	}
	
	if(session)session=JSON.parse(session);
	if (to.path == '/login' && session) {
		next('/admin');
	}else if (to.path !== '/login' && !session) {
		if (to.path == '/register'||to.path == '/password') {
			next();
		}else 
			next('/login');
	}else if (to.path == '/') {
		next('/admin');
	}else {
		next();
	}
});
new Vue({
	router,
	render: h => h(App),
	created(){window.$app=this;}
}).$mount('#app')

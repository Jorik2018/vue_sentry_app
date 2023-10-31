<template>
	<div id="app" style="position:relative">
		
			<div class="v-layout-north primary">
				<ul class="v-menubar" v-bind:style="{backgroundImage: 'url('+iconUrl+')'}">
					<li style="float:left" v-on:click="toggleMenu">
						<a href="#">
							<i class="fa fa-bars fa-lg"/>
						</a>
					</li>
				</ul>
			</div>
			<div class="v-layout-center">
				<router-view @updateStatus="updateStatus"></router-view>
			</div>
			<AppMenu ref="menu"></AppMenu>
			<v-popup ref="userMenu" style="max-width: 300px;right:0px;z-index: 10000;width:70%;">
				<ul style="width:-webkit-fill-available;" class="x-menu-list">
					<li v-if="session">
						<a  style="padding: 0px;" href="/admin/profile">
							<div  class="center" v-for="(o,i) in [session.people]" v-bind:key="i"
							style="color: white;
							padding: 20px 0px;
							background-color: #232323;">
								<template v-if="o">
									<div v-if="o.urlPerfil" style="margin:0px 40px;overflow-y: hidden; width: 160px; height: 160px; border-radius: 50%;">
									<img style="width:100%;" v-bind:src="'http://web.regionancash.gob.pe/apishami/api/archivos/imgperfil/'+o.urlPerfil">
									</div>
									<div>{{o.nombres}} {{o.apPaterno}} {{o.apMaterno}}</div>
								</template>
								<label>Usuario</label>
								<div>{{session.user}}</div>
							</div>
						</a>
					</li>
					<!--li><a href="/admin/change-password">Cambiar Contrase&ntilde;a</a></li-->
					<li><a href="/logout" class="v-action _" v-on:click.prevent="logout">Cerrar Sessi&oacute;n</a></li>
				</ul>
			</v-popup>
	</div>
</template>
<script>
	import '@fortawesome/fontawesome-free/css/all.css'
	import '@fortawesome/fontawesome-free/js/all.js'
	import AppMenu from './Menu.vue'
	//import { Plugins } from '@capacitor/core';
	//const { Network } = Plugins;
	window.Vue.config.ignoredElements = ['v-filter']
	var script = document.getElementsByTagName("script");
        var el = script[script.length - 1].previousSibling.previousSibling;
		console.log(el);
	export default window.ui({
		data(){return {
		showMenu:false,
		iconUrl: require('@/fs/images/logo2018.png'),
		showUser:false,overlay:null,cartItem:[],networkStatus:{}}},
		methods:{
			updateStatus(e){
				console.log('app.updateStatus '+e);
			},
			toggleMenu(){
				this.$refs.menu.toggle();
			},
			o(e){
				var t=e.target;
				var me=this;
				if(typeof e=='string'){
					t=e;
				}else{
					e.preventDefault();
					if(!t.pathname)t=t.parentNode;
					if(!t.pathname)t=t.parentNode;
					if(!t.pathname)t=t.parentNode;
					t=t.pathname;
				}
				if (me.$route.path!==t){
					me.$router.push(t);
				}
			},
			bindLinks(el,callback){
				var me=this;
				el=el?el:me.$el;
				if(el.querySelectorAll){
					var a=el.querySelectorAll('a:not(._)');
				
					var f=function(e){
						if(me.cccc){me.cccc()}
						if(callback)callback();
						me.o(e);
						var el=this;
						do{
							var event=new Event("close", {bubbles: true});
							el.dispatchEvent(event);
							el=el.parentNode;
						}while(el);
					};
					for(var i=0;i<a.length;i++){
						a[i].onclick=f;
						a[i].classList?a[i].classList.add('_'):a[i].className='_';
					}
				}
			},
		},
		updated(){
			//this.bindLinks();
			//this.$emit('updated');
		},
		
		mounted(){
			/*var me=this;
			window.o=this.o;
			me.$emit('mounted');
			me.bindLinks();
			var sf=function(status){
				me.networkStatus=status;
				me.$refs.menu.online=status.online;
			};
			Network.addListener('networkStatusChange',sf);
			Network.getStatus().then(sf);*/
			window.dispatchEvent(new Event('resize'));
		},
		components:{AppMenu}
	})
</script>
<style scope>
	.v-menubar{
		background-size: auto calc(100% - 10px);
		background-position: center;
		background-repeat: no-repeat;
	}
</style>
<style>
	* {
		margin: 0px;
		padding: 0px;
	}
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		margin-top: 0px;
	}
	#page-header{
		border: 1px solid gray;		
		min-height: 36px;
	}
	#page-header > *{	
		min-height: 36px;
	}
	.primary{
		background-color: #0f62ac;
	}
	.v-widget-header,.ui-state-default{
		border: 1px solid #a8a8a8;
		background: #c4c4c4 linear-gradient(top,rgba(255,255,255,0.8),rgba(255,255,255,0));
		background: #c4c4c4 -webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.8)),to(rgba(255,255,255,0)));
		background: #c4c4c4 -moz-linear-gradient(top,rgba(255,255,255,0.8),rgba(255,255,255,0));
		background: #c4c4c4 -webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.8)),to(rgba(255,255,255,0)));
		color: #333;
		font-weight: bold;
		text-shadow: 0 1px 0 rgba(255,255,255,0.7);
	}
	.v-button-text-icon-left i,.v-button-text-icon-left svg,.tre svg{
		margin-right: 10px;
	}
	.v-text-icon-left svg {
		margin-right: 10px;
	}
	.tre li a {
		border-bottom: 1px solid #5d4141;
		padding: 10px;
		font-weight: normal;
	}
	.tre ul {
	padding-left: 30px;
	}
	.tre i{
	margin-right: 10px;
	width: 26px;
	text-align: center;
	}
	#page-header > .v-header-button {
	min-height: 36px;
	padding: 0px 6px;
	display: inline-block;
	}
	.v-header-button{
	cursor:pointer;
	}
	.v-header-button:hover{
	background-color:#0e355a;
	}
	.v-header-button > svg {
	overflow: visible;
	height: 34px;
	width: 22px !important;
	color: white;
	}
	.ui-datatable thead th, .ui-datatable tbody td, .ui-datatable tfoot td, .ui-datatable tfoot th {
	padding: 4px 5px;
	border-color: #ccd0d4;
	overflow: hidden;
	border: 1px solid #ccd0d4;
	}
	body{
	overflow-y:unset;
	}
	.v-popup-2 svg{
	left:0px;
	top:0px;
	margin:10px;
	position:absolute;
	}
	.v-popup-2 li{
	position:relative;
	border: 1px solid #c1c1c1;
	cursor:pointer;
	padding: 7px 7px 7px 50px;
	}
	.v-popup-2 li:hover{
	font-weight:bold;
	background-color: #dae1e4;
	}
	.ui-dialog-content{
	background-color:white;
	}
	.v-popup-2{
		list-style-type: none;
	}
	@media (min-width: 700px){
		.v-mobil{
			visibility: hidden;
			display: none;
		}
	}
	@media (max-width: 700px){
		.v-popup-2{
			width:100% !important;
		}
		.ui-datatable-header{
			visibility: hidden;
			display: none;
		}
	}
	.ic-42 svg{
		height: 36px;
		width: 36px;
		-webkit-filter: brightness(10);
		filter: brightness(10);
		background-size: 34px 34px;
		background-position: 2px 2px;
		background-repeat: no-repeat;
	}
	.ui-user > a{
		display:inline-block;
		padding:5px;
	}
	.ui-user{
		min-height: 0px !important;
		float: right;
		color: white;
		padding: 7px 0px 7px 7px;
		margin: 0px;
	}
	.x-menu-list{
		z-index: 1005;
		width:-webkit-fill-available;
	}
	.x-menu-list > li > a {
		padding: 10px 20px;
		display: block !important;
		width:unset !important;
	}
	.x-menu-bar svg.fa-bars{
		padding: 5px !important;
	}
	.tre ul > li a > svg{
		width:24px;
		height:24px;
	}
	.ui-panel-titlebar{
		border-width:0px;
	}
	@media (max-width: 700px){
		*{
			font-size: 103%;
		}
	}
	.v-head-cloned{display-:none;}
	.v-menubar > li > a{
		padding:10px;
	}
</style>
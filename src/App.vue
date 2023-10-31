<template>
	<router-view></router-view>
</template>
<script>
	import './cdn/isobit.css'
	import '@fortawesome/fontawesome-free/css/all.css'
	import '@fortawesome/fontawesome-free/js/all.js'
	import { Plugins } from '@capacitor/core';
	const { Network } = Plugins;
	window.Vue.config.ignoredElements = ['v-filter']
	var a=window.axios;
	var session = localStorage.getItem('session');
	if(session){
		session=JSON.parse(session);
		a.defaults.headers.common['Authorization']=`Bearer ${session.token}`;
	}
	var script = document.getElementsByTagName("script");
        var el = script[script.length - 1].previousSibling.previousSibling;
		console.log(el);
	export default {
		data(){return {showMenu:false,showUser:false,session:session,overlay:null,cartItem:[],networkStatus:{}}},
		methods:{
			updateStatus(e){
				console.log('app.updateStatus '+e);
			},
			toggleMenu(){
				this.$refs.menu.toggle();
			},
			logout(){
				console.log('logout method');
				this.$router.push('/logout');
				this.session=null;
				window.axios.config={};
				
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
			async toast(msx,callback) {
				const toast = await this.$ionic.toastController.create({
					message: msx,
					duration: 2000
				});
				await toast.present();
				if(callback)callback();
			}
		},
		updated(){
			this.bindLinks();
			this.$emit('updated');
		},
		created(){
			window.app=this;
			var _=window._;
			_.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			_.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
			_.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
			if (!_.indexedDB) {
				window.alert("Your browser doesn't support a stable version of IndexedDB.")
			}else{
				var request = window.indexedDB.open("db", 1);
				request.onerror = function() {
					alert("error al crear db :/!");
				};
				request.onsuccess = function() {
					_.db = request.result;
				};
				request.onupgradeneeded = function(event) {
					var db = event.target.result;
					db.createObjectStore("employee", {keyPath: "id"});
				}
			}
		},
		mounted(){
			var me=this;
			window.o=this.o;
			me.$emit('mounted');
			me.bindLinks();
			var sf=function(status){
				me.networkStatus=status;
				//me.$refs.menu.online=status.online;
			};
			Network.addListener('networkStatusChange',sf);
			Network.getStatus().then(sf);
		}
	}
</script>
<style>
	@font-face {
		font-family: "PTSans";
		src: local("PTSans"),
		url(./cdn/fonts/ptsansnarrow-regular.ttf) format("truetype");
	}
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
	.tre > li > a {
		display: block;
	}
	.tre ul > li a {
		color:black;
	}
	.tre {
		background-color: #FFF;
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
	.body{
		background-color: white;
	}
	.v-layout-center > div > div{
		overflow-y: auto;
	}
	.loading{
		background:url(./cdn/images/loading.svg) no-repeat top center;
	}
	.v-widget-header > .v-panel-title {
		background-size: 25px !important;
		padding-left: 30px !important;
		background: url(./fs/images/favicon.png) no-repeat scroll 0 0 transparent;
	}
</style>
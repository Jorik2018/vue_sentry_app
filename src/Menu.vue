<template>
	<v-popup ref="menu" style="max-width: 300px;left:0px;z-index: 10000;width:70%;position:absolute;background-color: white;bottom:0px;overflow-y:auto">
		<ul class="tre" v-if="session">
			<li>
				<a href="/"><i class="fa fa-home"></i>Inicio</a>
				<a v-if="session" style="padding: 0px;" href="/admin/profile">
					<div  class="center" v-for="(o,i) in [session]" v-bind:key="i"
						style="color: white;
						padding: 20px 0px;
						background-color: #232323;">
						<template v-if="o.people">
						<div v-bind:class="'img'" style="margin:0px 40px;overflow-y: hidden; width: 160px; height: 160px; border-radius: 50%;
						float: none;margin: 0px auto;">
						<img style="width:100%;" onerror="this.parentNode.classList.add('error')" v-bind:src="baseURL+'/thumb/160/foto/'+o.people.id+'.jpg'">
						</div>
						<div>{{o.people.fullName}}</div>
						</template>
						<label>Usuario</label>
						<div>{{session.user}}</div>
						version: 2.94
					</div>
				</a>
				<ul>

					<li><a style="border-top: 1px solid #5d4141;border-bottom: 0px;" 
						v-if="can('admin/desarrollo-social/settings')"
						href="/admin/desarrollo-social/settings"><i class="fa fa-tools">
					</i>Configuraciòn Fuera de Linea</a>
					</li>
					<li v-if="can('admin/rh')"><a href="/admin/rh/marking"><i class="fa fa-table"></i>Ingreso</a>
						<ul>
							<li><a style="border-top: 1px solid #5d4141;border-bottom: 0px;" href="/admin/rh/marking/create">
								<i class="fa fa-plus"></i>Crear</a>
							</li>
						</ul>
					</li>
				</ul>
			</li>
			<li><a class="v-primary-dark" href="/logout" v-if="online"><i class="fa fa-key"></i>Cerrar Sessión</a></li>
			<li><a class="v-primary-dark alert" style="color:red !important" v-if="!online"><i class="fa fa-circle"></i>Equipo Desconectado</a></li>
			<template v-if="!session">
				<li><a class="v-primary-dark" href="/login"><i class="fa fa-key"></i>Iniciar Session</a></li>
				<li><a class="v-primary-dark" href="/register"><i class="fa fa-star"></i>Crear Cuenta</a></li>
				<li><a class="v-primary-dark" href="/password"><i class="fa fa-exclamation-triangle"></i>&iquest;Olvido su Contrase&ntilde;a?</a></li>
			</template>
		</ul>
	</v-popup>
</template>
<script>
import axios from 'axios';
export default window.ui({ 
	mounted(){
		this.app.bindLinks(this.$el,this.hide);
		console.log('menu mounted');
	},
	computed:{
		showMenu(){return this.app.showMenu;}
	},
	methods:{
		toggle(m){
			var me=this,h=document.querySelector('.v-layout-north');
			me.$el.style.top=h.offsetHeight+'px';
			me.$refs.menu.toggle(m)
		},
		sync(){
			axios.get('/api/siaf/sync').then((r)=>{
				console.log(r);
			});
		},
		opp(path){
			this.app.$router.push('/shami/'+path);
		},
		can(s){
			return s;//this.session.uid==1|this.perms[s];
		}
	}
});
</script>
<style scope>
	a{
		display:inline-block;
	}
	.controls a:not(:last-child){
		display:inline-block;
		margin-right:10px;
	}
	.alert{
		padding: 20px;
		background-color: #fff7a8;
		font-size: 20px;
		border: 1px solid #ffca69;
		border-radius: 5px;
		color:black;
	}
	.v-main{
		padding:0px;
		background-color:#FFF;
	}
	.contact svg{
		margin-right: 10px;
		color: orange;
		font-size: 25px;
	}
	.v-ss{
		background-color: #ffecbd;
		border-radius: 35px 35px 0 0;
		float: left;
	}
	li > a.v-primary-dark{
		width: -webkit-fill-available !important;
		margin:0px;
		border-radius: 0px;
		border-width:0px;
	}
</style>
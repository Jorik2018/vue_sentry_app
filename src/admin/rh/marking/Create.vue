<template>
	<v-form store="marking" style="height:-webkit-fill-available;" v-bind:header="(o.id?'Editar':'Registrar')+' Ingreso'" action="/admin/rh/marking/api/marking"> 
		<div class="v-form"> 
			<div style="margin-top: 10px"> 
				<v-button icon="fa-search" v-bind:disabled="!ccreate" value="Buscar persona" v-on:click.prevent="search2()"></v-button>
				<v-button icon="fa-plus" v-bind:disabled="ccreate" v-on:click.prevent="ccreatePeople()"></v-button> 
			</div> 
			<template v-if="!ccreate">
				<label>DNI:</label>
				<v-autocomplete placeholder="Ingrese mas de 2 letras y presione ENTER" 
					ref="peopleAutocomplete" v-bind:show-selection="true" 
					inputClass="center" store="employee" 
					v-on:input="inputPeople" minQueryLength="3" required="required" v-model="people" 
					v-on:complete="peopleComplete" 
					v-bind:params="params" 
					src="/admin/rh/marking/api/marking/people" label="2"> 
					<template v-slot="{row}"> 
						<table class="transparent"> 
							<tr> 
								<td>
									<a v-bind:href="'/admin/directorio/'+row[0]" onclick="return false"> <span v-bind:class="{yellow:row[4]}">{{row[2]}}</span> 
									<div v-bind:style="'color:'+ row.numeroPndid?'':'red'" v-bind:title="row[0]">
									{{row[1]}}
									</div>
									</a>
								</td> 
							</tr> 
						</table> 
					</template> 
				</v-autocomplete> 
				<div class="right" style="margin-top: 10px"> <v-button icon="fa-download" v-if="online" style="float:left" v-on:click.prevent="loadstore"></v-button> <v-button icon="fa-qrcode" v-if="qrcode" v-on:click.prevent="scanCode"></v-button> <v-button icon="fa-sync" v-on:click.prevent="$refs.peopleAutocomplete.search()"></v-button> 
				</div> 
			</template> 
			<v-fieldset class="v-form" legend="Informac&iacute;&oacute;n Personal" v-if="people&amp;&amp;!ccreate&amp;&amp;o.people&amp;&amp;o.people.id" 
				v-bind:class="people[10]?'red':(people[3]?'green':'yellow')"> 
				<img v-if="online" style="max-width: 200px;width:100%;max-height: 250px" v-bind:src="baseURL+'/thumb/160/foto/'+o.peopleId+'.jpg'" /> 
				<div>
					<label>Documento de Identidad:</label> 
					<div>
					{{people[1]}}
					</div> 
					<label>Nombre Completo:</label> 
					<div>
					{{people[2]}}
					</div> 
					<template v-if="people[4]">
						<label>Empresa:</label> 
						<div>
						{{people[4]}}: {{people[5]}}
						</div> 
					</template> 
					<template v-if="people[6]">
						<label>Dependencia:</label> 
						<div>
						{{people[7]}}
						</div> 
					</template> 
					<template v-if="people[8]">
						<label>Cargo:</label> 
						<div>
						{{people[9]}}
						</div> 
					</template> 
					<template v-if="people[10]"> <label>COVID:</label> 
						<div>
						{{people[10]}}
						</div> 
					</template> 
					<template v-if="people[11]"> <label>Regimen Laboral:</label> 
						<div>
						{{people[11]}}
						</div> 
					</template> 
				</div>
			</v-fieldset>
			<v-fieldset class="v-form" legend="Informac&iacute;&oacute;n Personal" v-if="ccreate&amp;&amp;o.people&amp;&amp;!o.people.id"> 
				<label>Documento de Identidad:</label> 
				<input type="tel" class="numeric center" required="true" maxlength="8" v-model="o.people.code" /> 
				<label>Nombres:</label> 
				<input type="text" required="true" maxlength="80" v-model="o.people.names" /> 
				<label>Apellidos:</label> 
				<input type="text" required="true" maxlength="80" v-model="o.ext.surnames" /> 
				<v-fieldset legend="Empresa" class="companyFieldset v-form" v-if="o.ext"> 
					<label>Búsqueda:</label> 
					<v-autocomplete queryEvent="enter" placeholder="Ingrese mas de 2 letras y presione ENTER" 
						minQueryLength="5" id="company" v-bind:disabled="o.company!=null&amp;&amp;!o.company.id"
						emptyMessage="Buscar por nombre (2 caracteres min.)" size="60" v-on:input="inputCompany" v-model="o.company" src="/admin/directory/api/company" label="businessName"> 
					<template v-slot="{row}"> 
						<table class="transparent"> 
							<tr> 
							<td style="width:50px; max-width: 50px" align="center"> <img id="foto" class="white" style="  width:100%;max-height: 60px" v-bind:src="baseURL+'/thumb/100/foto/'+row.id+'.jpg'" /> </td> 
							<td> <a vbind:href="'/admin/directorio/'+row.id" on_click="return _.o(this)" class="ui-link"> {{row.businessName}} <br />RUC: {{row.ruc}} </a> </td> 
							</tr> 
						</table> 
					</template> 
					</v-autocomplete> 
					<div class="right"> <v-button icon="fa-plus" style="margin-top:10px" value="Nueva Empresa" v-on:click.prevent="o.company={ruc:null,businessName:null};$forceUpdate()"></v-button> <v-button icon="fa-minus" v-bind:disabled="!o.company" style="margin-top:10px" v-on:click.prevent="o.company=null;$forceUpdate()"></v-button> 
					</div> 
					<div v-if="o.company!=null&amp;&amp;!o.company.id" class="v-panel v-form"> <label>RUC:</label> 
						<input v-model="o.company.ruc" type="tel" class="numeric" maxlength="11" /> <label>Nombre:</label> <v-textarea required="true" rows="1" id="businessName" maxlength="100" v-model="o.company.businessName"></v-textarea> 
					</div> 
				</v-fieldset> 
			</v-fieldset>
			<v-fieldset v-if="o.people" legend="Informaci&oacute;n del Ingreso" class="v-form"> 
				<label>Temperatura:</label> 
				<input type="number" required="true" class="numeric right" min="0" step=".1" max="200" v-model="o.temperature" title="Temperatura" /> 
				<div v-if="o.temperature>=38" class="v-panel yellow">
				Temperatura muy alta!, ingreso no Autorizado.
				</div> 
				<label>Placa Veh&iacute;culo:</label> 
				<input type="text" v-model="o.vehiclePlate" maxlength="12" title="Placa Veh&iacute;culo" /> 
				<label>Observaci&oacute;n:</label> 
				<v-textarea v-model="o.remark" maxlength="255"
					v-bind:required="!(people&amp;&amp;people[4])" rows="2" title="Observación"></v-textarea> 
			</v-fieldset> 
		</div> 
		<center v-if="o.people">
			<v-button value="Grabar" v-bind:disabled="!o.people" icon="fa-save" v-on:click.prevent="save"></v-button>
			<v-button value="Cancelar" icon="fa-ban" v-on:click.prevent="close"></v-button> 
		</center> 
	</v-form>
</template>
<style>
	.green{
		color:black;
	}
</style>
<script>
	import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
	export default window.ui({
		data(){return  {
			company:null,
			qrcode:true,
			people: null,
			ccreate: false,
			params:{
				laborRegime: 7
			},
			o: {}
		}},
		mounted() {
			if(this.$children[0])window.app.title=this.$children[0].header;
			this.render();
		},
		methods: {
			render(){
				this.$refs.peopleAutocomplete.loadStore();
			},
			loadstore(){
				var me=this;
				fetch(this.baseURL+'/admin/rh/marking/api/marking/people/0/0?only-employee=true').then(function(r){
					r.json().then(function(data){
						var db=window._.db,objectStore =db.transaction(["employee"], "readwrite").objectStore("employee");
						var objectStoreRequest = objectStore.clear();
						objectStoreRequest.onsuccess = function() {
							for (var i in data){
								data[i].id=i;
								objectStore.add(data[i]);
							}
							me.MsgBox(data.length+' registros almacenados en dispositivos');
							console.log(me.$refs.peopleAutocomplete);
							me.$refs.peopleAutocomplete.loadStore();
						};
					});
				});
			},
			scanCode(){
				var pa=this.$refs.peopleAutocomplete;
				new BarcodeScanner().scan().then(function(r){
					if(!r.cancelled){if(Number(r.text)){pa.query=r.text;pa.search();}else{window._.MsgBox('No se obtubo ningun numero');}}
				}).catch(err => {window._.MsgBox(err);});
			},
			peopleComplete(e) {
				var me=this,o=this.o;
				if (e.data&&e.data.length == 1) {
					e.target.setSelected(e.data[0]);
				} else if (e.data&&e.data.length == 0) {
					window.axios.post('/api/reniec/',{dni: e.query}).then(r=>{
						var d=r.data;
						d=d.datosPersona;
						o.people = {code:e.query,address:d.direccion,names:d.prenombres,ext: {}};
						o.ext = {surnames:d.apPrimer+' '+d.apSegundo};
						me.ccreate = true;
					});
					//e.setSelected(null, true);
				}
			},
			search2() {
				//console.lo
				//if (event.key == "Enter") event.preventDefault();
				this.o.people = null;
				this.ccreate = false;
			},
			ccreatePeople() {
				var o=this.o;
				o.people = {ext: {}};
				o.ext = {};
				this.ccreate = true;
			},
			inputPeople(v) {
				if(v){
					var o = this.o;
					o.people = {id: v[0], ext: {}};
					o.ext={0:null,1:v[1],2:v[2],3:v[5],4:v[6],5:v[7],dummy:0};
					o.peopleId = v[0];
					o.companyId = v[4];
					o.dependencyId = v[6];
					o.positionId = v[8];
				}else{
					this.people=null;
					this.$refs.peopleAutocomplete.query='';
					this.o.people=null;
					//this.$refs.peopleAutocomplete.focus();
				}
			},
			inputCompany() {
				this.$forceUpdate();
			},
			close(v){
				if(v){
					var me=this;
					me.o={};
					me.people=null;
					me.ccreate = false;
					if(me.$refs.peopleAutocomplete)
						me.$refs.peopleAutocomplete.query='';
				}
			},
			process(o) {
				o = JSON.parse(JSON.stringify(o));
				var user = this.user;
				if (user)
					o.userId = user.id;
				o.clientDate=new Date().getTime();
				if(o.company)delete o.company.fechaIng;
				return o;
			}
		}
	});
</script>
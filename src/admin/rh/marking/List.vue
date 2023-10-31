<template>
	<v-form id="MarkingList" header="Control de Ingreso" action="/admin/rh/marking"> 
		<v-table v-bind:selectable="true" v-bind:scrollable="true" rowKey="id" storage="marking" v-bind:pagination="20" 
			row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')" src="/admin/rh/marking/api/marking" v-bind:filters="filters"> 
			<template v-slot:header=""> 
				<v-button value="Crear" icon="fa-plus" v-if="CREATE_RH_MARKING||ADMIN_RH_MARKING" class="on" v-on:click.prevent="create"></v-button>
				<v-button value="Editar" icon="fa-pen" v-if="ADMIN_RH_MARKING" v-on:click.prevent="edit" 
				v-bind:disabled="!rowSelectedCount"></v-button>
				<v-button value="Eliminar" icon="fa-trash" v-if="ADMIN_RH_MARKING" v-on:click.prevent="destroy" v-bind:disabled="rowSelectedCount==0"></v-button>
				<v-button value="Descargar" icon="fa-download" class="on" v-if="ADMIN_RH_MARKING" v-on:click.prevent="open($refs.dlg)"></v-button>
				<v-button title="Enviar al Servidor" v-if="online" icon="fa-database" class="on" 
					v-bind:disabled="!rowSelectedCount||!canSync(getSelected()[0])" v-on:click.prevent="sync"></v-button> <v-button title="Refrescar" icon="fa-sync" class="on" v-on:click.prevent="refresh"></v-button> 
			</template> 
			<template v-slot:default="{row}"> 
				<td width="100" class="center" header="Fecha Creaci&oacute;n">
					<v-filter> 
						<input v-model="filters.date" /> 
					</v-filter>
					{{(row.clientDate?row.clientDate:row.createDate)|date}} 
				</td>
				<td width="100" class="center" header="DNI"> 
					<v-filter> 
						<input class="center" v-model="filters.people_code" /> 
					</v-filter>
					{{row.ext?row.ext[1]:''}}
				</td> 
				<td width="220" header="Nombre Completo">
					<v-filter> 
						<input v-model="filters.people" /> 
					</v-filter>
					{{row.ext?row.ext[2]:''}}
				</td> 
				<td width="220" header="Empresa">
					<v-filter> 
						<input v-model="filters.company" /> 
					</v-filter>
					<template v-if="row.companyId">
					{{row.companyId}}: {{row.ext?row.ext[3]:''}} 
					</template> 
				</td> 
				<td width="250" header="Dependencia">
					<v-filter> 
						<input v-model="filters.dependency" /> 
					</v-filter>
					<div>
					{{row.ext?row.ext[5]:''}}
					</div> {{row.ext?row.ext[7]:''}}
				</td> 
				<td width="80" class="right" header="Temperatura">
					<v-filter> 
						<input v-model="filters.temperature" /> 
					</v-filter>
					{{row.temperature}}
				</td> 
				<td width="100" class="center" header="Placa Veh&iacute;culo">
					<v-filter> 
						<input v-model="filters.vehiclePlate" /> 
					</v-filter>
					{{row.vehiclePlate}}
				</td> 
				<td width="200" header="Observaci&oacute;n">
					<v-filter> 
						<input v-model="filters.remark" /> 
					</v-filter>
					{{row.remark}}
				</td> 
			</template>
		</v-table> 
		<div ref="dlg" style="position: absolute;display: none"> <v-panel header="Descargar Reporte"> 
			<label>Formato de archivo:</label> 
			<v-radio-group v-model="type"> 
			<v-radio value="0" label="Ingreso de trabajadores"></v-radio> 
			<v-radio value="1" label="Resumen de Ingreso"></v-radio> 
			</v-radio-group> 
			<label>Formato de archivo:</label> 
			<v-radio-group v-model="format"> 
			<v-radio value="pdf" label="PDF"></v-radio> 
			<v-radio value="xls" label="Hoja de Calculo"></v-radio> 
			</v-radio-group> 
			<center> <v-button icon="fa-download" value="Descargar" v-on:click="download2"></v-button> <v-button icon="fa-ban" value="Cancelar" v-on:click.prevent="closeDlg"></v-button> 
			</center> 
			</v-panel> 
		</div> 
	</v-form>
</template>
<script>
	var _=window._;
        
        export default _.ui({
            data(){return{
                format:'pdf',type:0,
                dialog:null,
                ADMIN_RH_MARKING:true,
                CREATE_RH_MARKING:true,
                filters:{}
            }},
            mounted() {
                if(this.$children[0])window.app.title=this.$children[0].header;
                //this.render();
            },
            methods: {
                canSync(o){
                    //var me=this,user=me.user;
                    return o;//o&&o.user==user.id&&o.tmpId;
                },
                openDlg() {
                    if(!this.dialog)this.dialog=document.querySelector('#dlg').children[0];
                    _.open({data:this.dialog});
                },
                download2() {
                    window.location.href = "/admin/rh/marking/api/marking/download?format="+this.format+'&type='+this.type;
                }
            }
        });
</script>
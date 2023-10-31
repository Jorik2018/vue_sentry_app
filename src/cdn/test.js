import Vue from 'vue'
import axios from 'axios'
import Chart from 'chart.js'


import * as olProj from 'ol/proj';
import Map from 'ol/Map'
import View from 'ol/View'
import Collection from 'ol/Collection'
import {Fill, Stroke, Style, Circle, RegularShape} from 'ol/style'
import {Tile,Vector as VectorLayer} from 'ol/layer'
import {OSM,Vector} from 'ol/source'
import Point from 'ol/geom/Point'
import Control from 'ol/control/Control'
import FullScreen from 'ol/control/FullScreen'
import Overlay from 'ol/Overlay'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Translate from 'ol/interaction/Translate'
import Text from  'ol/style/Text'
if (typeof JSON.clone !== "function") {
    JSON.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}
Vue.directive('required', {
	bind(){
		var el=this.el;
		el.vrequired = document.createElement("DIV");
		el.vrequired.className = 'required__message';
		el.vrequired.innerHTML = this.expression;
	}
});
Vue.directive('error', {
	bind(){
		this.el.verror = document.createElement("DIV");
		this.el.verror.className = 'error__message';
		this.el.verror.innerHTML = this.expression;
	}
});
///^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

Vue.directive('valid', {
	bind(el, binding, vnode){
		var me=this;
		console.log(el);
		console.log(me);
		console.log(vnode);
		var validators = {email:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ };
console.log(binding.expression);
		var regex = validators[binding.expression];
		el.handler = function () {
			/*if(el.vrequired &&el.vrequired.parentNode !== null ){
				el.vrequired.parentNode.removeChild(el.vrequired );
			}
			if(el.verror&&el.verror.parentNode !== null ){
				el.verror.parentNode.removeChild(el.verror );
			}
			if(el.disabled)return;
			if(el.value === "" ){
				if(el.vrequired ){
					el.className = "required";
					el.parentNode.appendChild(el.vrequired);
				}
				return;
			}*/
			if(regex.test(el.value)){
				el.className = "success";
			}else{       
				if(el.verror){
					el.parentNode.appendChild(el.verror);
				}
				el.className = "error";
			}
			return;
		}.bind(me);
		el.addEventListener('input',el.handler);
		//me.vm.$on('hook:compiled',el.handler);
	},
	unbind(){
		//this.el.removeEventListener('input',this.handler);
	}
});

var ol={
	Overlay:Overlay,
	Feature:Feature,
	proj:olProj,
	interaction:{Translate:Translate},
	format:{GeoJSON:GeoJSON},
	geom:{Point:Point},
	control:{Control:Control,FullScreen:FullScreen},
	Map:Map,
	View:View,
	Collection:Collection,
	source:{OSM:OSM,Vector:Vector},
	layer:{Tile:Tile,Vector:VectorLayer},
	style:{Style:Style,Stroke:Stroke,Text:Text,Fill:Fill,Circle:Circle,RegularShape:RegularShape}
}
if (Window.instance == 'undefined'){
    Window.instance=axios;
}
if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
         }
         return to;
    };
}
if (typeof Window._ == 'undefined')Window._={};
var _=Window._;
var stack = [];
window.onpopstate = function (/*e*/) {
    console.log(stack.pop());
    console.log(history);
}
_.autosize = function (e) {
    var el = e ? (e.target ? e.target : e) : this;
    setTimeout(function () {
        el.style.height='auto';
        el.style.padding='0px';
        el.style.height=''+ (el.scrollHeight?el.scrollHeight:18) + 'px';
        el.style.padding='';
        //el.style.cssText = 'height:auto; padding:0';
        //el.style.cssText = 'height:' + el.scrollHeight + 'px';
        
    }, 0);
}
function getLayerById(m, id) {
    var ly;
    m.getLayers().forEach(function (l) {
        if (l.get("id") === id) {
            ly = l;
            return;
        }
    });
    return ly;
}
Vue.component('v-feature', {props: ['type'], abstract: true, 
    render: function () {
        var me = this;
        me.$parent.$on('build', function (m) {
            if (me.type === 'Point') {
                var f = new ol.Feature({
                    geometry: new ol.geom.Point(m.getView().getCenter())
                });
                f.setStyle(m.styleMap.default);
                var layer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [f]
                    })
                });
                var translateIteraction = new ol.interaction.Translate({
                        features: new ol.Collection([f])
                });
                translateIteraction.on('translateend', function (e) {
                        var c=ol.proj.toLonLat(e.coordinate);
                        me.$emit('moved',{coords: {latitude: c[0], longitude: c[1]}});
                });
                m.addInteraction(translateIteraction);
                m.addLayer(layer);
				var c=ol.proj.toLonLat(f.getGeometry().getCoordinates());
				me.$emit('moved',{coords: {latitude: c[0], longitude: c[1]}});
            }
        });
		return null
    }
});
Vue.component('v-layer', {props: ['src', 'maxZoom', 'minZoom','filters','name'], abstract: true,
    data: function () {
        return {
            loaded: null,map:null,layer:null
        }
    },
    methods: {
        reset(){
            this.loaded=false;
            this.show(this.map);
        },
        show:function(m) {
            var me = this;
            var layer = me.layer;
            if (!me.loaded){
                var params={zoom: parseInt(m.getView().getZoom(), 10)};
                if(me.filters)params=Vue.mergeDeep(params,me.filters);
                axios.get(me.src, {params:params}).then(function (r) {
                    var data = (r.data.data ? r.data.data : r.data);
                    var features = [];
                    var max = 1;
                    for (var i = 0; i < data.length; i++) {
                        var d = data[i];
                        if (d[2] > max)
                            max = d[2];
                    }
                    me.$emit('load',{target:me,features:features,data:data,map:m});
                    if(!layer){
                        var layerConfig = {
                            source: new ol.source.Vector({
                                features: features
                            }),
                            id:me.name
                        };
                        if (me.maxZoom)
                            layerConfig.maxZoom = me.maxZoom;
                        if (me.minZoom)
                            layerConfig.minZoom = me.minZoom;
                        layer = new ol.layer.Vector(layerConfig);
                        layer.onSelect=function(f){
                            me.$emit('select',f);
                        };
                        m.addLayer(me.layer=layer);
                        layer.on('change:visible', function () {
                            alert(1);
                            console.log(this);
                        });
                    }else{
                        layer.setSource(new ol.source.Vector({
                            features: features
                        }));
                    }                    
                    me.loaded = true;
                    me.layer=layer;
                }).catch(me.error);
            }
        }
    },
    render :function() {
        var me = this;
        me.$parent.$on('build', function (m) {
            var currZoom = false;
            me.map=m;
            var v = '';
            var fm = function () {
                var newZoom = parseInt(m.getView().getZoom(), 10);
                var minZoom = me.minZoom ? me.minZoom : 0;
                var maxZoom = me.maxZoom ? me.maxZoom : 10000;
                me.newZoom=null;
                if (currZoom != newZoom) {
                    var vv = minZoom <= newZoom && newZoom <= maxZoom;
                    if (vv !== v) {
                        if (vv)
                            me.show(m);
                        v = vv;
                    }
                    currZoom = newZoom;
                    me.newZoom=newZoom;
                }
                me.$emit('moveend',me);
            };
            m.on('moveend', fm);
        });
		return null;
    }});


Vue.component('v-chart', {
    props: {
        value: {
            type: String,
        },
        data: Object,
        type: String,
        source: String,
        dataFunc:Function
    },

    template: '<div style="border:1px solid gray"><canvas></canvas></div>',
    updated: function () {
        console.log(this.data.dataIndex);
        this.chart.update();
    },
    mounted: function () {
        var m = this;
		if(typeof Chart !== 'undefined'){
			m.Chart=Chart;m.build();
		}else
			_.loadScript('/cdn/Chart.min.js', function () {
				m.Chart=Chart;
				m.build();
			});
    },
    data: function () {
        return {dat: {},Chart:null}
    },
    methods: {
        build:function() {
            var me = this;
            var canvas = this.$el.querySelector("canvas");
            if (this.chart) {
                this.chart.destroy();
            }
            var _dat = me.dat;
            _dat.label = [];
            _dat.data = [];
//            axios.get(this.src, {params: null})
//                    .then(function (r) {
//                        var _dat = r.data.data ? r.data.data : r.data;
//                        for (i = 0; i < _dat.length; i++) {
//                            _data.label.push(_dat[i][0]);
//                            _data.data.push(_dat[i][1]);
//                        }
//                        me.chart.update();
//
//                        //me.$forceUpdate();
//                        //me.$parent.loaded(nou);
//                        //me.$emit('loaded', me);
//                        //Si lo encuentra despues de cargar los items debe marcarlo
//                        //if(me.$parent.$attrs.value)
//                        //me.$parent.onChange(me.$parent.$attrs.value);
//                    })
//                    .catch(function (r) {
//                        console.log(r);
//                        r = r.response;
//                        var e = me.$parent.$el;
//                        var error = document.createElement("div");
////                        error.innerHTML = r.config.method + ' ' + r.config.url + ' ' + r.status + ' (' + r.statusText + ')';
//                        error.classList.add("v-error");
//                        e.parentNode.insertBefore(error, e);
//                    });

//            if(me.data&&this.data.height){
//                canvas.height = this.data.height+'px';
//                canvas.parentNode.style.height = this.data.height+'px';
//            }
//            var din=this.data.dataIndexName;
//            var met=this.data.metaData;
//            if(din){
//                for(var i=0;i<din.length;i++){
//                    for(var j=0;j<met.length;j++){
//                        if(met[j].name==din[0])this.data.dataIndex=j;
//                    } 
//                }
//            }

            window.chartColors = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)',
                'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'];

//            var dataset=[];
//            
//            for(var i=0;i<this.data.data.length;i++){
//                dataset.push(this.data.data[i][this.data.dataIndex]);
//            }
//            for(var i=0;i<this.data.data.length;i++){
//                label.push(this.data.data[i][this.data.labelIndex]);
//            }
//            while(window.chartColors.length<label.length)window.chartColors.push('rgb('+(255*Math.random())+', '+(255*Math.random())+', '+(255*Math.random())+')');
            this.chart = new this.Chart(canvas, Vue.mergeDeep({
                type: this.type,
                data:{
                    datasets: [],
                    labels: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: true,
                        position: /*this.data.legendPosition?this.data.legendPosition:*/'top'
                    }
                }
            },me.dataFunc?me.dataFunc():{}));
        }
    }
});
var tinymce;
Vue.component('v-editor', {
    //template: '<div><div><textarea  class="tinymce hid textarea ui-inputfield ui-widget x-data" >ghg  jhblhl</textarea></div></div>',
    template: '<div><div><v-textarea  /></div></div>',
    mounted2: function () {
        var m = this;
        _.loadScript('/cdn/tinymce/tinymce.min.js', function () {
			m.tinymce=tinymce;
            m.build();
        });
    },
    updated3: function () {
        var m = this;
        m.build();
    },
    data: function () {
        return {editor: null,tinymce:null}
    },
    methods: {
        build:function() {
			var tinymce=this.tinymce;
            var id = _.id();
            this.$el.children[0].id = 'editor-' + id;
            this.editor = tinymce.init({
                selector: '.tinymce',
                plugins: ['code', 'help', 'link', 'pagebreak', 'image', 'textcolor', 'table', 'emoticons', 'imagetools', 'media', 'colorpicker', 'textcolor'],
                body_class: 'mce-content-body',
                media_live_embeds_: false,
                //menubar:#{MENU_BAR?'true':'false'},
                toolbar: "undo redo | forecolor backcolor | bold italic underline | list link code removeformat #{ALL?' | image table emoticons media ltr rtl pagebreak':''} ",
                content_css: '/cdn/isobit.css?v=1',
                extended_valid_elements: 'pre[*],script[*],style[*],link[*]',
                valid_children: "+body[style|script|link],pre[script|div|p|br|span|img|style|h1|h2|h3|h4|h5],*[*]",
                valid_elements: '*[*]',
                force_br_newlines: false,
                force_p_newlines: false,
                relative_urls: false,
                forced_root_block: '',
                init_instance_callback2: function (editor) {
                    //var m = $(editor.editorContainer);
//                    m.on('rsz', function (e, o) {
//                        var m = $(e.currentTarget);
//                        var he = o?o.height:null;
//                        if(!he){he=m.parent().height()-2;}
//                        else{he -= 20;}
//                        he -= m.find('.mce-top-part').outerHeight();
//                        he -= m.find('.mce-statusbar').outerHeight();
//                        m.find('.mce-edit-area').height(he);
//                        m.find('iframe').css('display','inline').height(he);
//                    });
                    var f = function (/*e*/) {
                        _.xsec = 3;
                    };
                    editor.on('keyUp', f).on('paste', f).on('undo', f).on('redo', f);
                    _.xsec = 0;
                    setInterval(function () {
                        if (_.xsec) {
                            _.xsec--;
                            if (!_.xsec) {
                                if (_.updateEditor)
                                    _.updateEditor();
                            }
                        }
                    }, 1000);
//                    var u = m.closest('.x-layout-unit');
//                    m.trigger("rsz", {height: u.height()});
//                    m.addClass('x-resize');
                }
            });
//            console.log('this.editor');
//            console.log(this.editor);
//            var script = $('#mce-script').last();
//            $(function () {
//                d = script.closest('form').data('preSubmit');
//                if (!d) {
//                    d = [];
//                    script.closest('form').data('preSubmit', d);
//                }
//                mce = script.parent().find();
//                d.push(function () {
//                    return _.try(function () {
//                        t = script.prev('textarea');
//                        console.log('============');
//                        console.log(t);
//                        console.log(t[0]);
//                        v=tinymce.get(t[0].id)/*activeEditor*/.getContent();
//                        t.val(v==''?'':v);
//                    });
//                });
//            })
        }
    }
});
Vue.component('v-checkbox-group', {
    props: {
        required: String,
        name: String
    },
    data: function () {
        return {
            value: [],options:[],nam:null
        }
    },
    created: function () {
        if (!this.nam) {
            this.nam = (this.$props.name?this.$props.name:'input_' + _.id());
        }
		this.update2();
		
    },
    
    updated:function() {
		this.update2();
    },
    mounted:function(){
        this.options= this.$el.querySelectorAll('input:not(.v-chk)');
        for (var i = 0; i < this.options.length; i++) {
            this.options[i].classList.add("v-chk");
        }
        this.update2();
    },
    methods: {
		update2(){
			var me=this;
			var rl = me.options;
			var va = me.$attrs.value;
			if((typeof va)=='string')va=va.split('|');
			for (var i = 0; i < rl.length; i++){
				rl[i].checked = false;
				for (var j = 0; va&&j < va.length; j++){
					if (rl[i].value == va[j]){
						rl[i].checked = true;
					}
				}
			}
		},
        onChange:function(v, c) {
            var me = this;
			var va=me.$attrs.value;
			if(typeof va === 'string' || va instanceof String){
				va=va.split('|');
			}
            if (c) {
                if (!va){
                    me.$attrs.value = (va=[])
				}
                va.push(v);
            } else {
				//console.log('buscar '+v+' en '+JSON.stringify(va));
				var ii=va.indexOf(v);
				if(ii>-1)va.splice(ii, 1);
				//console.log(va);
            }
            me.$emit('input', va);
        }
    },
    template: '<div><slot></slot></div>'
});

Vue.component('v-column', {
    template: '<td><slot></slot</td>'
});
Vue.component('v-filter-calendar', {
    template:'<div><v-button icon="fa-calendar" v-on:click.prevent="open"/>'+
            '<v-panel style="text-align:left;position:absolute;display:none" v-bind:header="\'Configurar Filtro []\'"><div style="padding:20px"><div class="v-form"><label>Desde:</label><v-calendar v-model="from"/><label>Hasta:</label><v-calendar v-model="to"/></div>'+
            '<center style="padding-top:20px"><v-button icon="fa-check" value="Aceptar"/><v-button icon="fa-ban" v-on:click.prevent="close" value="Cerrar"/></center></div>'+
            '</v-panel></div>',
    data:function(){return {el:null,mask:null}},
    methods:{
        open(){
            var el=this.el?this.el:(this.el=this.$el.children[1]);
            this.mask=_.mask(el, {backgroundColor: 'rgba(0,0,0,0.95)'});
            el.style.display='block';
        },
        close(){
            _.unmask(this.mask);
        }
    }
});
ol.getLayerById=getLayerById;
window.ol=ol;
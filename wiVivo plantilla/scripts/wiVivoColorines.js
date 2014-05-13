// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReadyColorines, false);

// PhoneGap is ready
function onDeviceReadyColorines() {
    document.addEventListener("menubutton", cerrarColorines, false);
    document.addEventListener("backbutton", cerrarColorines, false);
    //document.addEventListener("backbutton", exitAppPopupColorines, false);
    window.brightness = cordova.require("cordova.plugin.Brightness.Brightness");
    //brightness.setKeepScreenOn(true);
    brightness.getBrightness(function(status){brillo = status;},function(status){});
    brightness.setBrightness('1.0', function(status){},function(status){});
    window.plugins.powerManagement.acquire();
    startColorines();
};

//variables Globales
//CAMBIAR PARA COMPILAR RELEASE
var servidor_wivivoColorines = 'http://srv001.liveshowsync.local';
//var servidor_wivivoColorines = 'http://192.168.10.155';
//alert(servidor_wivivoColorines);
var webservice_wivivoColorines = servidor_wivivoColorines + '/liveshowsync/'; 
var servidor_leeColorines = webservice_wivivoColorines + 'lee.php';

//VARIABLES DE TIEMPO DE BUCLES
var startcolorinessettimeout = 10000;
var startcolorinessetinterval = 200;

//variables Colorines
var colorColorines = null;
var coloresColorines = null;
var colorseleccionadoColorines = null;
var intermitenciaColorines = null;
var repeColorines1Colorines = null;
var repeColorines2Colorines = null;
var brillo = -1;

var checkconexionColorines = 0;
var errordetectadoColorines = 0;
var errornotificacionesColorines = 0;
var alertasactivadasColorines = 1;
var primeravez = 1;

function leeConfiguracionColorines() {
    //aleatoriamente tendra color1 o color2
    var eleccion = "";
    var posibilidades = "01";
    eleccion = posibilidades.charAt(Math.floor(Math.random() * posibilidades.length));
    if (eleccion === "1") {colorColorines = 1} else {colorColorines = 0}
};

// Lanza Colorines
function startColorines(){
    if (primeravez !== 0) {leeConfiguracionColorines(); primeravez = 0;}
	$.getJSON(servidor_leeColorines)
		.done(function(data) {  
        	$.each(data, function(key, val) {
            	alertasactivadasColorines = val.alertasactivadas;
	        	intermitenciaColorines = val.intermitencia;
            	startcolorinessettimeout = val.startColorinessetTimeout;
            	startcolorinessetinterval = val.startColorinessetInterval;
    	    	//mostrará uno de los dos colores posibles
        		var colores_tmp = [val.color1,val.color2];
        		var tmp = colores_tmp[colorColorines];
                if (intermitenciaColorines === 0) {
	        		coloresColorines = tmp;    
    	            if (repeColorines1Colorines !== null) clearInterval(repeColorines1Colorines);
        	    	colorseleccionadoColorines = coloresColorines;
            		document.getElementById("pantalla_colorines").style.backgroundColor = colorseleccionadoColorines;
	        	}
    	    	if (intermitenciaColorines === 1) {
	    			coloresColorines = ["#FFFFFF",tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp];
        			repeColorines1Colorines = setInterval(function() {
        				var indice = Math.floor(Math.random() * coloresColorines.length);
            			colorseleccionadoColorines = coloresColorines[indice];
            			document.getElementById("pantalla_colorines").style.backgroundColor = colorseleccionadoColorines;
	        		}, startcolorinessetinterval);    
       	 		}
        		if (intermitenciaColorines === 2) {
        			coloresColorines = [val.color1,val.color2];
        			repeColorines1Colorines = setInterval(function() {
	        			var indice = Math.floor(Math.random() * coloresColorines.length);
    	        		colorseleccionadoColorines = coloresColorines[indice];
        	    		document.getElementById("pantalla_colorines").style.backgroundColor = colorseleccionadoColorines;
	        		}, startcolorinessetinterval);    
        		}
        		if (intermitenciaColorines === 3) {
                	if (repeColorines1Colorines !== null) clearInterval(repeColorines1Colorines);
            		colorseleccionadoColorines = "#000000";
            		document.getElementById("pantalla_colorines").style.backgroundColor = colorseleccionadoColorines;
                	//document.getElementById("pantalla_colorines").style.display = 'block';
                	document.getElementById("pantalla_colorines").style.backgroundPosition="top right";
                	document.getElementById("pantalla_colorines").style.backgroundRepeat="no-repeat";
                	document.getElementById("pantalla_colorines").style.backgroundSize="100%";
                	document.getElementById("pantalla_colorines").style.backgroundImage = "url('./imagenes/bengala.gif')";
        		}
    		});
        	errordetectadoColorines = 0;
		})
		.fail(function(jqxhr, textStatus, error){
			if (errordetectadoColorines === 0){
            	errordetectadoColorines = 1;
            	errornotificacionesColorines = 3;
        	}
        	if (alertasactivadasColorines === 1){
            	if (errornotificacionesColorines === 1){
	            	navigator.notification.alert("Parece que perdín a conexión... volve premer o botón",cerrarColorines(),"ERRO NA COMUNICACION", "OK");
	        	}
            errornotificacionesColorines = errornotificacionesColorines - 1;
        	}
		});
    repeColorines2Colorines = setTimeout(startColorines, startcolorinessettimeout);
}

// Cancela Colorines
function stopColorines(){
    if (repeColorines1Colorines !== null) {
        clearInterval(repeColorines1Colorines);
        repeColorines1Colorines = null;
    }
    if (repeColorines2Colorines !== null) {
        clearTimeout(repeColorines2Colorines);
        repeColorines2Colorines = null;
    }
}

function cerrarColorines(){
    stopColorines();
    brightness.setBrightness(brillo, function(status){},function(status){});
    //brightness.setKeepScreenOn(false);
    window.plugins.powerManagement.release();
	window.location.href='index.html#tabstrip-show';
}

// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReadyColorines, false);

// PhoneGap is ready
function onDeviceReadyColorines() {
    document.addEventListener("menubutton", exitAppPopupColorines, false);
    document.addEventListener("backbutton", atrasAppColorines, false);
    //document.addEventListener("backbutton", exitAppPopupColorines, false);
    //leeConfiguracionColorines();
};

//variables Globales
//CAMBIAR PARA COMPILAR RELEASE
//var servidor_wivivoColorines = 'http://srv001.liveshowsync.local';
var servidor_wivivoColorines = 'http://192.168.10.155';

var webservice_wivivoColorines = servidor_wivivoColorines + '/liveshowsync/'; 
var servidor_leeColorines = webservice_wivivoColorines + 'lee.php';

//variables Colorines
var colorColorines = null;
var coloresColorines = null;
var colorseleccionadoColorines = null;
var intermitenciaColorines = null;
var repeColorines1Colorines = null;
var repeColorines2Colorines = null;

var checkconexionColorines = 0;
var errordetectadoColorines = 0;
var alertasactivadasColorines = 0;

// Lanza Colorines
function startColorines(){
    leeConfiguracionColorines();
    window.plugins.powerManagement.acquire();
	$.getJSON(servidor_leeColorines)
    	.done(function(data) {  
	        $.each(data, function(key, val) {
                alertasactivadasColorines = val.alertasactivadas;
		        intermitenciaColorines = val.intermitencia;
        	    //mostrará uno de los dos colores posibles
            	var colores_tmp = [val.color1,val.color2];
            	var tmp = colores_tmp[colorColorines];
            	if (intermitenciaColorines === 0) {
            		coloresColorines = tmp;    
            	}
            	if (intermitenciaColorines === 1) {
    	    		coloresColorines = ["#FFFFFF",tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp,tmp];
           	 }
            	if (intermitenciaColorines === 2) {
            		coloresColorines = ["#FFFFFF",tmp];
            	}
            	if (intermitenciaColorines !== 0) {
            		repeColorines1Colorines = setInterval(function() {
            			var indice = Math.floor(Math.random() * coloresColorines.length);
                		colorseleccionadoColorines = coloresColorines[indice];
	            		document.getElementById("pantalla_colorines").style.backgroundColor = colorseleccionadoColorines;
    	        	}, 200);    
            	} else {
                	if (repeColorines1Colorines !== null) clearInterval(repeColorines1Colorines);
                	colorseleccionadoColorines = coloresColorines;
                	document.getElementById("pantalla_colorines").style.backgroundColor = colorseleccionadoColorines;
            	}
        	});
            errordetectadoColorines = 0;
    	})
    	.fail(function(jqxhr, textStatus, error){
    		if (errordetectadoColorines === 0){
                errordetectadoColorines = 1;
                if (alertasactivadasColorines === 1){
                    navigator.notification.alert("Proba de novo, ou sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi e volve a lanza-la App","ERRO NA COMUNICACION", "ERRO NA COMUNICACION");
            	}
            }
    	});
    repeColorines2Colorines = setTimeout(startColorines, 5000);
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
    window.plugins.powerManagement.release();
}

//opcion de Exit
function exitAppPopupColorines() {
    navigator.notification.confirm(
        "visita www.aerowi.es se queres saber como fixemos esta app"
        , function(button) {
              if (button === 2) {
                  stopColorines();
                  window.plugins.powerManagement.release();
                  navigator.app.exitApp();
              } 
          }
        , "¿Sair do Show?"
        , "Pois non, Pois si"
    );
    return false;
}

function atrasAppColorines(){
    stopColorines();
    window.location.href='index.html#tabstrip-show';
}
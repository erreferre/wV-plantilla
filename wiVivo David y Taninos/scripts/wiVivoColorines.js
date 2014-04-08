// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReadyColorines, false);

// PhoneGap is ready
function onDeviceReadyColorines() {
    document.addEventListener("menubutton", exitAppPopupColorines, false);
    document.addEventListener("backbutton", atrasAppColorines, false);
    //document.addEventListener("backbutton", exitAppPopupColorines, false);
    leeConfiguracionColorines();
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

// Consulta datos de configuracion y confirma si está correctamente
// conectado al espectaculo
function leeConfiguracionColorines() {
    //aleatoriamente tendra color1 o color2
    var eleccion = "";
    var posibilidades = "12";
    eleccion = posibilidades.charAt(Math.floor(Math.random() * posibilidades.length));
    if (eleccion === "1") {colorColorines = 1} else {colorColorines = 2} 
    //chequea conexion
    var data;
    var val;
    $.getJSON(servidor_leeColorines)
    	.done(function(data) {  
        	$.each(data, function(key, val) {
        		checkconexionColorines = val.checkconexion;
        	});        
        })
    	.fail(function(jqxhr, textStatus, error){
    		navigator.notification.alert("Proba de novo, ou sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi e volve a lanza-la App","ERRO NA COMUNICACION", "ERRO NA COMUNICACION");
    	});
};

// Lanza Colorines
function startColorines(){
    leeConfiguracionColorines();
    window.plugins.powerManagement.acquire();
	$.getJSON(servidor_leeColorines, function(data) {  
        $.each(data, function(key, val) {
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
    });
    repeColorines2Colorines = setTimeout(startColorines, 5000);
}
// Cancela Colorines
function stopColorines(){
    if (repeColorines1Colorines !== null) clearInterval(repeColorines1Colorines);
    if (repeColorines2Colorines !== null) clearTimeout(repeColorines2Colorines);
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
    window.location.href='index.html#tabstrip-show';
    stopColorines();
}
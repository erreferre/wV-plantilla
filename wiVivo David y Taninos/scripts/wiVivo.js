// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    //PONER SOLO menubutton EN LA VERSION RELEASE
    document.addEventListener("menubutton", exitAppPopup, false);
    document.addEventListener("backbutton", atrasApp, false);
    //document.addEventListener("backbutton", exitAppPopup, false);
    leeConfiguracion();
    //comienzaShow();
};

//variables Globales
//CAMBIAR PARA COMPILAR RELEASE
//var servidor_wivivo = 'http://srv001.liveshowsync.local';
var servidor_wivivo = 'http://192.168.10.155';

var webservice_wivivo = servidor_wivivo + '/liveshowsync/'; 
var servidor_lee = webservice_wivivo + 'lee.php';
var servidor_sube = webservice_wivivo + 'sube.php';
var servidor_selfie = webservice_wivivo + 'listaThumbs.php';
var servidor_imagenes = webservice_wivivo + 'subido/';
var servidor_thumbs = webservice_wivivo + 'subido/thumbs/';

//variables Aplauso
var archivo_pedo = 'sonidos/pedo1.mp3';
var archivo_aplauso = 'sonidos/aplauso.mp3';
var archivo_guapo = archivo_aplauso;//'sonidos/guapo.mp3';
var repeAplauso1 = null;
var aplausoechado = 0;
var aplausoactivado = 0;

//variables Loto
var servidor_leeLoto = webservice_wivivo + 'leeLoto.php';
var ganador = 0;
var lotoactivada = 0;
var loto = 0;
var repeLoto1 = null;

//variables Selfie
var repeSelfie1 = null;

var checkconexion = 0;
var comienzashow = 1;

// Consulta datos de configuracion y confirma si está correctamente
// conectado al espectaculo
function leeConfiguracion() {
    //chequea conexion
    var data;
    var val;
    $.getJSON(servidor_lee)
    	.done(function(data) {  
        	$.each(data, function(key, val) {
        		checkconexion = val.checkconexion;
        	});        
        })
    	.fail(function(jqxhr, textStatus, error){
    		navigator.notification.alert("Proba de novo, ou sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi e volve a lanza-la App","ERRO NA COMUNICACION", "ERRO NA COMUNICACION");
    	});
};

function cambiacomienzashow(){
	comienzashow = 0;    
}

//comienzaShow
function comienzaShow(){
    var newHTML1 = "";
	if (comienzashow === 0){
        newHTML1 = 'todavía non comezou o Show, permanece atento á megafonía';
        document.getElementById("comezaShow").innerHTML = newHTML1;
    } else {
        newHTML1 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" \
        	onclick="location.href=\'#tabstrip-show\'; cambiacomienzashow(); if(repeAplauso1===null) startAplauso();">\
               <h1 color="white">::::::::::::::::::::<br/><br/><br/>cando comece o <strong>Show...</strong> preme este botón!!!<br/><br/>\
               <br/>::::::::::::::::::::<br/></h1></button></p>';
		document.getElementById("comezaShow").innerHTML = newHTML1;
    }
}    
    

// muestra variables para depuracion
function mostrarVariables(){
    navigator.notification.alert("repeAplauso1:"+repeAplauso1+"\n aplausoechado:"+aplausoechado+"\n aplausoactivado:"+aplausoactivado+"\n ganador:"+
		ganador+"\n lotoactivada:"+lotoactivada+"\ loto:"+loto+"\n repeLoto1:"+repeLoto1+"\n color:"+color+"\n colores:"+
    	colores+"\n colorseleccionado:"+colorseleccionado+"\n intermitencia:"+intermitencia+"\ repeColorines1:"+repeColorines1+
    	"\n repeColorines2:"+repeColorines2+"\n checkconexion:"+checkconexion,"INFO","INFO");
}

// Lanza Aplausos
function startAplauso() {
    var data;
    var val;
    var archivo_sonido;
	window.plugins.powerManagement.acquire();
    //leeConfiguracion();
    //mostrarVariables();
    $.getJSON(servidor_lee, function(data) {  
        $.each(data, function(key, val) {
            aplausoactivado = val.aplausoactivado;
            if (aplausoechado === 0 && aplausoactivado === 1 ){
                //escoje aleatoriamente entre dos sonidos (1 de cada 20)
                var eleccion = "";
    			var posibilidades = "abcdefghij0123456789";
    			eleccion = posibilidades.charAt(Math.floor(Math.random() * posibilidades.length));
                if (eleccion === "0") {archivo_sonido = archivo_guapo;}
                	else {archivo_sonido = archivo_aplauso;} 
                playAudio(archivo_sonido);
                aplausoechado = 1;
            }
            if (aplausoactivado === 0) {aplausoechado = 0;}
        });
    });
    repeAplauso1 = setTimeout(startAplauso, 5000);
}
// Cancela Aplausos
function stopAplauso(){
    if (repeAplauso1 !== null) clearTimeout(repeAplauso1);
    //leeConfiguracion();
    //mostrarVariables();
}

// Lanza Selfie
function startSelfie(){
	var data;
    var val;
    leeConfiguracion();
    //mostrarVariables();
    $.getJSON(servidor_selfie)
    	.done(function(data) {
            var newHTML = "";
        	$.each(data, function(key, val) {
            	foto = val.foto;
                posicion = val.posicion;
                newHTML = newHTML+'<button class="boton-negro boton-centro boton-text-all-color" onclick="descargaImagen(\''+foto+'\');">';
                newHTML = newHTML+'<img src="'+servidor_thumbs+foto+'" /></button>';
        	});        
            document.getElementById("tabstrip-selfie-fotos").innerHTML = newHTML;
        });
    repeSelfie1 = setTimeout(startSelfie, 20000);
}

// Descarga Imagen
function descargaImagen(imagen){
//	var fileTransfer = new FileTransfer();
//	var uri = encodeURI(servidor_imagenes+imagen);
//	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onError);
//    var directorioImagenes = function onFileSystemSuccess(fileSystem) {
//    	var filePath = fileSystem.name;
//        return filePath;
//    }
//    fileTransfer.download(
//    	uri,
//    	directorioImagenes,
//    	function(entry) {
//        	alert("descarga completada: " + entry.fullPath);
//    	},
//    	function(error) {
//        	alert("descarga con erro: "+error.source+" destino: "+error.target+" codigo: " + error.code);
//    	}
//	);
//    function onError(error) {
//        console.log(error.code);
//    }
	navigator.notification.alert("PROXIMAMENTE SE PODRAN DESCARGAR LAS FOTOS...","INFO","INFO");
    
}

// Cancela Selfie
function stopSelfie(){
    //leeConfiguracion();
    //mostrarVariables();
    if (repeSelfie1 !== null) clearTimeout(repeSelfie1);
}

// Lanza Loto
function startLoto(){
	var data;
    var val;
    //leeConfiguracion();
    //mostrarVariables();
    $.getJSON(servidor_leeLoto, function(data) {  
        $.each(data, function(key, val) {
            lotoactivada = val.lotoactivada;
            loto = val.loto;
            if (ganador === 1 || (loto === 1 && lotoactivada === 1)){
            	ganador = 1;
                var lotoFoto = document.getElementById('tabstrip-lotoFoto');
	            lotoFoto.style.display = 'block';
           	 	lotoFoto.src = './imagenes/arale.jpg';
                if (lotoactivada === 1) playAudio(archivo_pedo);
            }
        });
    });
    repeLoto1 = setTimeout(startLoto, 5000);
}
// Cancela Loto
function stopLoto(){
    if (repeLoto1 !== null) clearTimeout(repeLoto1);
}

// Play sonidos
var mi_sonido = null;
function playAudio(src) {
  if (device.platform === 'Android') {
    src = '/android_asset/www/' + src;
  }
  mi_sonido = new Media(src, playSuccess, playError);
  //mi_sonido.setVolume(1.0);
  mi_sonido.play({ playAudioWhenScreenIsLocked : true });
  //mi_sonido.setVolume(0.0);
    //setTimeout(function() {
  	//mi_sonido.setVolume('1.0');
  //}, 10000);
}
function playSuccess() {
  console.log("playAudio():Audio Success");
}
function playError(error) {
  navigator.notification.alert("non se puido reproduci-la son","ERRO NA REPRODUCCION", "ERRO NA REPRODUCCION");
}

//opcion de Exit
function exitAppPopup() {
    navigator.notification.confirm(
        "visita www.aerowi.es se queres saber como fixemos esta app"
        , function(button) {
              if (button === 2) {
                  window.plugins.powerManagement.release();
                  navigator.app.exitApp();
              } 
          }
        , "¿Sair do Show?"
        , "Pois non, Pois si"
    );
    return false;
}

function atrasApp(){
    window.location.href='index.html#tabstrip-lar';
}

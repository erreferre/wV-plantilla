// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    //PONER SOLO menubutton EN LA VERSION RELEASE
    document.addEventListener("menubutton", exitAppPopup, false);
    //document.addEventListener("backbutton", atrasApp, false);
    document.addEventListener("backbutton", exitAppPopup, false);
};

//variables Globales
//CAMBIAR PARA COMPILAR RELEASE
//var servidor_wivivo = 'http://srv001.liveshowsync.local';
var servidor_wivivo = 'http://192.168.10.155';
//var servidor_streaming = null;
var servidor_streaming = 'http://192.168.10.140:8080/jsfs.html';

var webservice_wivivo = servidor_wivivo + '/liveshowsync/'; 
var servidor_lee = webservice_wivivo + 'lee.php';
var servidor_sube = webservice_wivivo + 'sube.php';
var servidor_selfie = webservice_wivivo + 'leeThumbs.php';
var servidor_imagenes = webservice_wivivo + 'subido/';
var servidor_thumbs = webservice_wivivo + 'subido/thumbs/';

var repestartConsultaServidor = null;

//variables Aplauso
var archivo_pedo = 'sonidos/pedo1.mp3';
var archivo_aplauso = 'sonidos/aplauso1.mp3';
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
var comienzashow = 0;
var primeravezcomienzashow = 1;
var errordetectado = 0;
var alertasactivadas = 1;
var streamingactivado = 0;


// muestra variables para depuracion
function mostrarVariables(){
    navigator.notification.alert("repeAplauso1:"+repeAplauso1+"\n aplausoechado:"+aplausoechado+"\n aplausoactivado:"+aplausoactivado+"\n ganador:"+
		ganador+"\n lotoactivada:"+lotoactivada+"\ loto:"+loto+"\n repeLoto1:"+repeLoto1+"\n color:"+color+"\n colores:"+
    	colores+"\n colorseleccionado:"+colorseleccionado+"\n intermitencia:"+intermitencia+"\ repeColorines1:"+repeColorines1+
    	"\n repeColorines2:"+repeColorines2+"\n checkconexion:"+checkconexion,"INFO","OK");
}


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
        		comienzashow = val.comienzashow;
                alertasactivadas = val.alertasactivadas;
                servidor_streaming = val.streaming;
                streamingactivado = val.streamingactivado;
        	});
            errordetectado = 0;
        })
    	.fail(function(jqxhr, textStatus, error){
    		if (errordetectado === 0){
                errordetectado = 1;
                if (alertasactivadas === 1){
                    navigator.notification.alert("Proba de novo, ou sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi e volve a lanza-la App",irFogar(),"ERRO NA COMUNICACION", "OK");
            	}
            }
    	});
};


// Se lanza al arrancar el Show
// chequea conexion
// habilita los botones, popup alerta indicando que empezamos
// (reproduce video "desde el camerino")
function startConsultaServidor()
{
    var newHTML1 = "";
    var newHTMLfogar = "";
    var newHTMLshow = "";
    var newHTMLselfie = "";
    var newHTMLloto = "";
    var data;
    var val;
    window.plugins.powerManagement.acquire();
    $.getJSON(servidor_lee)
    	.done(function(data) {  
        	$.each(data, function(key, val) {
        		comienzashow = val.comienzashow;
                alertasactivadas = val.alertasactivadas;
                servidor_streaming = val.streaming;
                streamingactivado = val.streamingactivado;
                aplausoactivado = val.aplausoactivado;
                if (aplausoechado === 0 && aplausoactivado === 1 ){
                	//escoje aleatoriamente entre dos sonidos (1 de cada 20)
                	var eleccion = "";
    				var posibilidades = "abcdefghij0123456789";
    				eleccion = posibilidades.charAt(Math.floor(Math.random() * posibilidades.length));
                    var archivo_sonido;
                	if (eleccion === "0") {archivo_sonido = archivo_guapo;}
                	else {archivo_sonido = archivo_aplauso;} 
                	playAudio(archivo_sonido);
                	aplausoechado = 1;
            	}
            	if (aplausoactivado === 0) {aplausoechado = 0;}
        	});
            errordetectado = 0; 
        })
    	.fail(function(jqxhr, textStatus, error){
    		if (errordetectado === 0){
                errordetectado = 1;
                if (alertasactivadas === 1){
                	navigator.notification.alert("Proba de novo, ou sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi e volve a lanza-la App",irFogar(),"ERRO NA COMUNICACION", "OK");
                }
            }
    	});
    if (comienzashow === 0){
        newHTML1 = '<font color="black"><h1><p>TODAVÍA NON COMEZOU O ESPECTÁCULO E A MAIORÍA DAS FUNCIÓNS DESTA APP ESTÁN DESHABILITADAS<p>\
			<p>PRESTA ATENCIÓN Á MEGAFONÍA</p></h1>';
        document.getElementById("div-comienzaShow-fogar").innerHTML = newHTML1;
        document.getElementById("div-comienzaShow-show").innerHTML = newHTML1;
        document.getElementById("div-comienzaShow-selfie").innerHTML = newHTML1;
        document.getElementById("div-comienzaShow-loto").innerHTML = newHTML1;
    } else {
        newHTMLfogar = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" \
        	onclick="location.href=\'#tabstrip-show\';">\
               <h1 color="white">::::::::::::::::::::<br/><br/><br/>cando comece o <strong>Show...</strong> preme este botón!!!<br/><br/>\
               <br/>::::::::::::::::::::<br/></h1></button></p>';
        newHTMLshow = '<p><button class="boton-negro boton-centro boton-text-all-color" type="button" onclick="location.href=\'#tabstrip-selfie\';if (repeSelfie1===null) startSelfie();">\
        	<h1>::::::::::::::::::::<br/><br/>cando chegue o momento  Selfie... <br/> preme este botón!!!<br/><br/>::::::::::::::::::::<br/></h1></button></p>\
        	<p><button class="boton-negro boton-centro boton-text-all-color" type="button" onclick="location.href=\'#tabstrip-loto\';if (repeLoto1===null) startLoto();">\
        	<h1>::::::::::::::::::::<br/><br/>cando chegue o momento   Loto... <br/> preme este botón!!!<br/><br/>::::::::::::::::::::<br/></h1></button></p>\
        	<p><button class="boton-negro boton-centro boton-text-all-color" type="button" onclick="window.open(\'colorines.html\');">\
        	<h1>::::::::::::::::::::<br/><br/>cando chegue o momento Colorines...<br/> preme este botón!!!<br/><br/>::::::::::::::::::::<br/></h1></button></p>';
        newHTMLselfie = '';
        newHTMLloto = '';
        document.getElementById("div-comienzaShow-fogar").innerHTML = newHTMLfogar;
        document.getElementById("div-comienzaShow-show").innerHTML = newHTMLshow;
        document.getElementById("div-comienzaShow-selfie").innerHTML = newHTMLselfie;
        document.getElementById("div-comienzaShow-loto").innerHTML = newHTMLloto;
        if (primeravezcomienzashow === 1){
            primeravezcomienzashow = 0;
	        navigator.notification.alert("Na primeira pestaña, preme o botón de abaixo de todo, que isto arrinca...",comienzaShow(),"COMEZA O ESPECTÁCULO!!!", "OK");
        }
    }
    repestartConsultaServidor = setTimeout(startConsultaServidor, 10000);
}    


// se lanza a comerzar el Show
function comienzaShow(){
    //var newHTML = "";
    //if (streamingactivado ===1) {
    //    newHTML = '<iframe src="'+servidor_streaming+'" width="100%" frameborder="0" scrolling="no"></iframe>';
    //	document.getElementById("div-comienzaShow-fogar-streaming").innerHTML = newHTML;
    //}
    window.location.href='index.html#tabstrip-fogar';
}    

// Lanza Aplausos
function startAplauso() {
    var data;
    var val;
    var archivo_sonido;
	window.plugins.powerManagement.acquire();
    //mostrarVariables();
    $.getJSON(servidor_lee)
    	.done(function(data) {  
        	$.each(data, function(key, val) {
                comienzashow = val.comienzashow;
                alertasactivadas = val.alertasactivadas;
                servidor_streaming = val.streaming;
            	aplausoactivado = val.aplausoactivado;
                streamingactivado = val.streamingactivado;
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
            errordetectado = 0;
    	})
    	.fail(function(jqxhr, textStatus, error){
    		if (errordetectado === 0){
                errordetectado = 1;
                if (alertasactivadas === 1){
                	navigator.notification.alert("Proba de novo, ou sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi e volve a lanza-la App",comienzaShow(),"ERRO NA COMUNICACION", "OK");
                }
            }
    	});    
    repeAplauso1 = setTimeout(startAplauso, 5000);
}
// Cancela Aplausos
function stopAplauso(){
    if (repeAplauso1 !== null) clearTimeout(repeAplauso1);
    repeAplauso1 = null;
    //mostrarVariables();
}

// Lanza Selfie
function startSelfie(){
	var data;
    var val;
	var newHTMLselfie2 = "";
    //mostrarVariables();
    newHTMLselfie2 = '<div class="view-content"><h2 width="100%" class="boton-negro boton-centro boton-text-all-color">\
            Pouco a pouco irás vendo as fotos que David faga dende o seu móbil.\
        	Poderás gardalas con alta calidade no teu móbil pulsando sobre as que che gusten</h2></div>';
	document.getElementById("div-comienzaShow-selfie2").innerHTML = newHTMLselfie2;        
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
            errordetectado = 0;
        })
	    .fail(function(jqxhr, textStatus, error){
    		if (errordetectado === 0){
                errordetectado = 1;
                if (alertasactivadas === 1){
                	navigator.notification.alert("Proba de novo, ou sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi e volve a lanza-la App",irFogar(),"ERRO NA COMUNICACION", "OK");
                }
            }
    	});
    repeSelfie1 = setTimeout(startSelfie, 20000);
}
// Cancela Selfie
function stopSelfie(){
    if (repeSelfie1 !== null) clearTimeout(repeSelfie1);
    repeSelfie1 = null;
    //mostrarVariables();
}
// Descarga Imagen
function descargaImagen(imagen){
	var fileTransfer = new FileTransfer();
	var uri = encodeURI(servidor_imagenes+imagen);
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onError);
    var directorioImagenes = function onFileSystemSuccess(fileSystem) {
    	var filePath = fileSystem.name;
        return filePath;
    }
    fileTransfer.download(
    	uri,
    	directorioImagenes,
    	function(entry) {
        	alert("descarga completada: " + entry.fullPath);
    	},
    	function(error) {
        	alert("descarga con erro: "+error.source+" destino: "+error.target+" codigo: " + error.code);
    	}
	);
    function onError(error) {
        console.log(error.code);
    }
	//navigator.notification.alert("PROXIMAMENTE SE PODRAN DESCARGAR LAS FOTOS...","INFO","OK");
}


// Lanza Loto
function startLoto(){
	var data;
    var val;
    var newHTMLloto = "";
    //mostrarVariables();
    newHTMLloto = '<div class="view-content"><h2 width="100%" class="boton-negro boton-centro boton-text-all-color">\
            ¿Quen será o afortunado...?</h2></div>';
	if (ganador === 0) document.getElementById("div-comienzaShow-loto2").innerHTML = newHTMLloto;        
    $.getJSON(servidor_leeLoto)
    	.done(function(data) {  
	        $.each(data, function(key, val) {
    	        comienzashow = val.comienzashow;
                alertasactivadas = val.alertasactivadas;
                servidor_streaming = val.streaming;
                streamingactivado = val.streamingactivado;
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
            errordetectado = 0;
    	})
	    .fail(function(jqxhr, textStatus, error){
    		if (errordetectado === 0){
                errordetectado = 1;
                if (alertasactivadas === 1){
                	navigator.notification.alert("Proba de novo, ou sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi e volve a lanza-la App",irFogar(),"ERRO NA COMUNICACION", "OK");
                }
            }
    	});
    repeLoto1 = setTimeout(startLoto, 5000);
}
// Cancela Loto
function stopLoto(){
    if (repeLoto1 !== null) clearTimeout(repeLoto1);
    repeLoto1 = null;
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
  navigator.notification.alert("non se puido reproduci-la son",irFogar(),"ERRO NA REPRODUCCION", "OK");
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

function irShow(){
    window.location.href='index.html#tabstrip-show';
}

function irFogar(){
    window.location.href='index.html#tabstrip-fogar';
}
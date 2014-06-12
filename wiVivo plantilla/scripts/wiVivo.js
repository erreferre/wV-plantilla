// JavaScript
// Wait for PhoneGap to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {
    //CAMBIAR SI HACE FALTA EN LA VERSION RELEASE
    document.addEventListener("menubutton", exitAppPopup, false);
    //document.addEventListener("backbutton", irShow, false);
    document.addEventListener("backbutton", exitAppPopup, false);
    window.plugins.powerManagement.acquire();
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemError);
    startConsultaServidor();
};

//variables Globales
//CAMBIAR EN LA VERSION RELEASE
var servidor_wivivo = 'http://srv001.liveshowsync.local';
//var servidor_wivivo = 'http://192.168.10.155';
//alert (servidor_wivivo);
var webservice_wivivo = servidor_wivivo + '/liveshowsync/'; 

//var servidor_streaming = null;
//var servidor_streaming = 'http://192.168.10.140:8080/jsfs.html';

var servidor_lee = webservice_wivivo + 'lee.php';
var servidor_sube = webservice_wivivo + 'sube.php';
var servidor_selfie = webservice_wivivo + 'leeThumbs.php';
var servidor_imagenes = webservice_wivivo + 'subido/';
var servidor_thumbs = webservice_wivivo + 'subido/thumbs/';

//tiempos iteracion de bucles
var repeConsultaServidor1 = null;
var startconsultaservidorsettimeout = 10000;
var startselfiesettimeout = 20000;
var startlotosettimeout = 20000;

//variables Guapo
var archivo_guapo = 'sonidos/guapo.mp3';
var guapoactivado = 0;
var guapoechado = 0;

//variables Aplauso
var archivo_aplauso = 'sonidos/aplauso1.mp3';
var aplausoactivado = 0;
var aplausoechado = 0;

//variables Pedo
var archivo_pedo = 'sonidos/pedo3.mp3';
var pedoactivado = 0;
var pedoechado = 0;

//variables Loto
var servidor_leeLoto = webservice_wivivo + 'leeLoto.php';
var ganador = 0;
var lotoactivada = 0;
var loto = 0;
var repeLoto1 = null;

//variables Selfie
var tiposelfie = 0;
var repeSelfie1 = null;
var filePath = null;

function onFileSystemSuccess(fileSystem) {
        if (device.platform === 'Android'){
        	filePath = fileSystem.root.fullPath+'\/'+'DavidAmorSelfie_';
    	} else {
			filePath = fileSystem.root.fullPath+"\/"+'DavidAmorSelfie_';
    	}
};

function onFileSystemError(error) {
    	console.log(error.code);
}; 

//otras variables
var checkconexion = 0;
var comienzashow = 0;
var primeravezcomienzashow = 1;
var showcomenzado = 0;
var errordetectado = 0;
var errornotificaciones = 0;
var alertasactivadas = 1;
//var streamingactivado = 0;

// muestra variables para depuracion
//function mostrarVariables(){
//    navigator.notification.alert("repeAplauso1:"+repeAplauso1+"\n aplausoechado:"+aplausoechado+"\n aplausoactivado:"+aplausoactivado+"\n ganador:"+
//		ganador+"\n lotoactivada:"+lotoactivada+"\ loto:"+loto+"\n repeLoto1:"+repeLoto1+"\n color:"+color+"\n colores:"+
//    	colores+"\n colorseleccionado:"+colorseleccionado+"\n intermitencia:"+intermitencia+"\ repeColorines1:"+repeColorines1+
//    	"\n repeColorines2:"+repeColorines2+"\n checkconexion:"+checkconexion,"INFO","INFO","OK");
//};

// Se lanza onDeviceready
// chequea conexion, habilita los botones, popup alerta indicando que empezamos, espera sonidos.
function startConsultaServidor(){
    var newHTML1;
    var newHTMLshow, newHTMLshowb1, newHTMLshowb2, newHTMLshowb3, newHTMLshowb4, newHTMLshowb5, newHTMLshowb6;
    var newHTMLselfie, newHTMLloto, newHTMLtwit;
    var data;
    var val;
    $.getJSON(servidor_lee)
    .done(function(data) {  
    	$.each(data, function(key, val) {
    		comienzashow = val.comienzashow;
            showcomenzado = val.showcomenzado;
            alertasactivadas = val.alertasactivadas;
            //servidor_streaming = val.streaming;
            //streamingactivado = val.streamingactivado;
            guapoactivado = val.guapoactivado;
            aplausoactivado = val.aplausoactivado;
            pedoactivado = val.pedoactivado;
            tiposelfie = val.tiposelfie;
            startconsultaservidorsettimeout = val.startConsultaServidorsetTimeout;
			startselfiesettimeout = val.startSelfiesetTimeout;
			startlotosettimeout = val.startLotosetTimeout;
		    if (comienzashow === 0) {
    			newHTML1 = '<font color="black"><h2><p>TODAVÍA NON COMEZOU O ESPECTÁCULO E A MAIORÍA DAS FUNCIÓNS DESTA APP ESTÁN DESHABILITADAS<p>\
					<p>PRESTA ATENCIÓN ÁS INSTRUCCIÓN QUE VOS IREMOS DANDO</p></h2></font>';
        		document.getElementById("div-comienzaShow-show").innerHTML = newHTML1;
        		document.getElementById("div-comienzaShow-selfie").innerHTML = newHTML1;
        		document.getElementById("div-comienzaShow-loto").innerHTML = newHTML1;
                document.getElementById("div-comienzaShow-twit").innerHTML = newHTML1;
    		} else {
        		newHTMLshow = '';
                newHTMLshowb1 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
        			onclick="mensajeGuapoActivado();if (repeConsultaServidor1===null) startConsultaServidor();">\
                	<h1>::::::::::::::::::::::::::<br/>lector de mentes<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
                newHTMLshowb2 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
        			onclick="mensajeAplausoActivado();if (repeConsultaServidor1===null) startConsultaServidor();">\
                	<h1>::::::::::::::::::::::::::<br/>momento comodidade<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
                newHTMLshowb3 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
        			onclick="mensajePedoActivado();if (repeConsultaServidor1===null) startConsultaServidor();">\
        			<h1>::::::::::::::::::::::::::<br/>momento incómodo<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
                newHTMLshowb4 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
        			onclick="window.location.href=\'#tabstrip-selfie\';if (repeSelfie1===null) startSelfie();">\
        			<h1>::::::::::::::::::::::::::<br/>momento selfie<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
                newHTMLshowb5 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
        			onclick="window.open(\'colorines.html\');">\
        			<h1>::::::::::::::::::::::::::<br/>momento colorines<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
                newHTMLshowb6 = '<p><button width="100%" class="boton-negro boton-centro boton-text-all-color" type="button" \
        			onclick="window.location.href=\'#tabstrip-twit\';if (repeTwit1===null) startTwit();">\
        			<h1>::::::::::::::::::::::::::<br/>momento twit<br/>::::::::::::::::::::::::::<br/></h1></button></p>';
        		newHTMLselfie = '';
        		newHTMLloto = '';
                newHTMLtwit = '';
        		document.getElementById("div-comienzaShow-show").innerHTML = newHTMLshow;
        		document.getElementById("div-comienzaShow-showb1").innerHTML = newHTMLshowb1;
                document.getElementById("div-comienzaShow-showb2").innerHTML = newHTMLshowb2;
                document.getElementById("div-comienzaShow-showb3").innerHTML = newHTMLshowb3;
                document.getElementById("div-comienzaShow-showb4").innerHTML = newHTMLshowb4;
                document.getElementById("div-comienzaShow-showb5").innerHTML = newHTMLshowb5;
                document.getElementById("div-comienzaShow-showb6").innerHTML = newHTMLshowb6;
                document.getElementById("div-comienzaShow-selfie").innerHTML = newHTMLselfie;
        		document.getElementById("div-comienzaShow-loto").innerHTML = newHTMLloto;
        		document.getElementById("div-comienzaShow-twit").innerHTML = newHTMLtwit;
        		if ((primeravezcomienzashow === 1)&&(showcomenzado === 0)){
        			primeravezcomienzashow = 0;
                    navigator.notification.beep(2);
                    navigator.notification.vibrate(4000)
	    			navigator.notification.alert("Isto arrinca... Agora podes ver uns botóns. Non te preocupes, irémosche dicindo cal pulsar...",comienzaShow(),"COMEZA O ESPECTÁCULO!!!", "OK");
        		}
    		}
            if ((guapoechado === 0) && (guapoactivado === 1)){
            	//solo uno de cada 20 sonaran
            	//var eleccion_g = "";
    			//var posibilidades_g = "abcdefghij01234";
                //eleccion_g = posibilidades_g.charAt(Math.floor(Math.random() * posibilidades_g.length));
            	//if (eleccion_g === "0") {playAudio(archivo_guapo);}
                
                //suena en todos
            	playAudio(archivo_guapo);
                
                guapoechado = 1;
        	} else if (guapoactivado === 0) {guapoechado = 0;}
            if ((aplausoechado === 0) && (aplausoactivado === 1)){
            	//en todos suena aplauso
            	playAudio(archivo_aplauso);
            	
                aplausoechado = 1;
        	} else if (aplausoactivado === 0) {aplausoechado = 0;}
            if ((pedoechado === 0) && (pedoactivado === 1)){
            	//solo uno de cada 20 sonaran
            	var eleccion_p = "";
    			var posibilidades_p = "abcdefghij01234";
    			//var posibilidades_p = "0";
                eleccion_p = posibilidades_p.charAt(Math.floor(Math.random() * posibilidades_p.length));
            	if (eleccion_p === "0") {playAudio(archivo_pedo);}
            	pedoechado = 1;
        	} else if (pedoactivado === 0) {pedoechado = 0;}            
        });
        if (errordetectado === 1){
            if (alertasactivadas === 1){
                navigator.notification.alert("Parece que xa vai...",irShow(),"COMUNICACION RECUPERADA", "OK");
        	}
        }
        errordetectado = 0; 
    })
	.fail(function(jqxhr, textStatus, error){
    	newHTML1 = '<font color="black"><h2><p>NON ESTÁS CORRECTAMENTE CONECTADO Ó ESPECTÁCULO.</p>\
        	<p>REVISA QUE TEÑAS A WIFI ACTIVADA NO TEU TELÉFONO E ESTÉS CONECTADO Á NOSA WIFI</p></h2></font>';
        		document.getElementById("div-comienzaShow-show").innerHTML = newHTML1;
        		document.getElementById("div-comienzaShow-selfie").innerHTML = newHTML1;
        		document.getElementById("div-comienzaShow-loto").innerHTML = newHTML1;
        		document.getElementById("div-comienzaShow-twit").innerHTML = newHTML1;
        if (errordetectado === 0){
            errordetectado = 1;
            errornotificaciones = 8;
		}
        if (alertasactivadas === 1){
            if (errornotificaciones === 5){
            	navigator.notification.alert("Proba de novo... parece que non dou conectado (recorda que tes que estar no espectáculo e conectado a súa WiFi)",irFogar(),"ERRO NA COMUNICACION", "OK");
            } else if (errornotificaciones === 1){
	            navigator.notification.alert("Sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi, e volve a lanza-la App",irFogar(),"ERRO NA COMUNICACION", "OK");
            }
            errornotificaciones = errornotificaciones - 1;
        }
	});
    repeConsultaServidor1 = setTimeout(startConsultaServidor, startconsultaservidorsettimeout);
};
    
//STOP startConsultaServidor()
function stopConsultaServidor(){
    if (repeConsultaServidor1 !== null) clearTimeout(repeConsultaServidor1);
    repeConsultaServidor1 = null;
};

// se lanza al comerzar el Show
// (reproduce video "desde el camerino")
function comienzaShow(){
    //var newHTML = "";
    //if (streamingactivado ===1) {
    //    newHTML = '<iframe src="'+servidor_streaming+'" width="100%" frameborder="0" scrolling="no"></iframe>';
    //	document.getElementById("").innerHTML = newHTML;
    //}
    window.location.href='index.html#tabstrip-show';
};

function mensajeGuapoActivado(){
    var newHTML = "<p>lector de mentes ACTIVADO!</p>"; 
    document.getElementById("div-comienzaShow-showb1-mensaje").innerHTML = newHTML;
    document.getElementById("div-comienzaShow-showb2-mensaje").innerHTML = '';
    document.getElementById("div-comienzaShow-showb3-mensaje").innerHTML = '';
}
function mensajeAplausoActivado(){
    var newHTML = "<p>comodidade ACTIVADA!</p>"; 
    document.getElementById("div-comienzaShow-showb2-mensaje").innerHTML = newHTML;
    document.getElementById("div-comienzaShow-showb3-mensaje").innerHTML = '';
    document.getElementById("div-comienzaShow-showb1-mensaje").innerHTML = '';
}
function mensajePedoActivado(){
    var newHTML = "<p>momento incómodo ACTIVADO!</p>"; 
    document.getElementById("div-comienzaShow-showb3-mensaje").innerHTML = newHTML;
    document.getElementById("div-comienzaShow-showb2-mensaje").innerHTML = '';
    document.getElementById("div-comienzaShow-showb1-mensaje").innerHTML = '';
}
function mensajeBotonesDesactivado(){
    document.getElementById("div-comienzaShow-showb3-mensaje").innerHTML = '';
    document.getElementById("div-comienzaShow-showb2-mensaje").innerHTML = '';
    document.getElementById("div-comienzaShow-showb1-mensaje").innerHTML = '';
}

// Lanza Selfie
function startSelfie(){
	var data;
    var val;
	var newHTMLselfie2;
    mensajeBotonesDesactivado();
    newHTMLselfie2 = '<button width="100%" class="boton-negro boton-centro boton-text-all-color"><h2>\
            Pouco a pouco irás vendo as fotos que David faga.\
        	Poderás gardalas con alta calidade no teu móbil pulsando sobre as que che gusten.</h2></button>';
	document.getElementById("div-comienzaShow-selfie2").innerHTML = newHTMLselfie2;
    if (tiposelfie === 1) {
        var newHTMLtmp1 = '<img src="./imagenes/lafoto.jpg" width="100%" />';
        document.getElementById("tabstrip-selfie-fotos").innerHTML = newHTMLtmp1;
    }else if (tiposelfie === 2) {
	    $.getJSON(servidor_selfie)
    	.done(function(data) {
            var newHTMLtmp2 = '';
        	$.each(data, function(key, val) {
        		foto = val.foto;
            	posicion = val.posicion;
            	newHTMLtmp2 = newHTMLtmp2+'<button class="boton-negro boton-centro boton-text-all-color" onclick="descargaImagen(\''+foto+'\');">';
            	newHTMLtmp2 = newHTMLtmp2+'<img src="'+servidor_thumbs+foto+'" /></button>';
        	});        
        	document.getElementById("tabstrip-selfie-fotos").innerHTML = newHTMLtmp2;
        	if (errordetectado === 1){
            	if (alertasactivadas === 1){
                	navigator.notification.alert("Parece que xa vai...",irSelfie(),"COMUNICACION RECUPERADA", "OK");
        		}
        	}
        	errordetectado = 0;
        })
	    .fail(function(jqxhr, textStatus, error){
    	if (errordetectado === 0){
            	errordetectado = 1;
            	errornotificaciones = 8;
			}
        	if (alertasactivadas === 1){
            	if (errornotificaciones === 5){
            		navigator.notification.alert("Proba de novo... parece que non dou conectado",irShow(),"ERRO NA COMUNICACION", "OK");
            	} else if (errornotificaciones === 1){
	            	navigator.notification.alert("Proba outra vez ou sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi, e volve a lanza-la App",irFogar(),"ERRO NA COMUNICACION", "OK");
            	}
            	errornotificaciones = errornotificaciones - 1;
        	}
    	});
    }
    repeSelfie1 = setTimeout(startSelfie, startselfiesettimeout);
};

// Cancela Selfie
function stopSelfie(){
    if (repeSelfie1 !== null) clearTimeout(repeSelfie1);
    repeSelfie1 = null;
};
   
// Descarga Imagen
function descargaImagen(imagen){
	var fileTransfer = new FileTransfer();
	var uri = encodeURI(servidor_imagenes+imagen);
    var rutaImagen = filePath+imagen;
    
    document.getElementById("div-resultado-descarga").innerHTML = 'Descargando a foto. Espera un intre...';
	fileTransfer.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 50);
            document.getElementById("div-progreso-descarga").innerHTML = perc + '% descargado...';
		} else {
            document.getElementById("div-progreso-descarga").innerHTML += '.';
		}
	};
    fileTransfer.download(
    	uri,
    	rutaImagen,
    	function(entry) {
            document.getElementById("div-resultado-descarga").innerHTML = '';
            document.getElementById("div-resultado-descarga-ruta").innerHTML += 'Foto gardada en: '+entry.fullPath+'<br/>';
    	},
    	function(error) {
        	document.getElementById("div-resultado-descarga").innerHTML = 'Houbo un erro, volve a descargala';
    	});
};

// Lanza Loto
//function startLoto(){
	var data;
    var val;
    var newHTMLloto2;
    newHTMLloto2 = '<button width="100%" class="boton-negro boton-centro boton-text-all-color"><h2>\
            ¿Quen será o afortunado...? Permanece atento á pantalla.</h2></button>';
	if (ganador === 0) {document.getElementById("div-comienzaShow-loto2").innerHTML = newHTMLloto2;        
    } else {
           document.getElementById("div-comienzaShow-loto2").innerHTML = ''; 
    }
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
            if (errordetectado === 1){
                if (alertasactivadas === 1){
                    navigator.notification.alert("Parece que xa vai...",irShow(),"COMUNICACION RECUPERADA", "OK");
            	}
            }
            errordetectado = 0;
    	})
	    .fail(function(jqxhr, textStatus, error){
    		if (errordetectado === 0){
                errordetectado = 1;
                errornotificaciones = 8;
			}
            if (alertasactivadas === 1){
                if (errornotificaciones === 5){
                	navigator.notification.alert("Proba de novo... parece que non dou conectado",irShow(),"ERRO NA COMUNICACION", "OK");
                } else if (errornotificaciones === 1){
	                navigator.notification.alert("Sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi, e volve a lanza-la App",irFogar(),"ERRO NA COMUNICACION", "OK");
                }
                errornotificaciones = errornotificaciones - 1;
            }
    	});
    repeLoto1 = setTimeout(startLoto, startlotosettimeout);
};

// Cancela Loto
function stopLoto(){
    if (repeLoto1 !== null) clearTimeout(repeLoto1);
    repeLoto1 = null;
};

// Play sonidos
var mi_sonido = null;
function playAudio(src) {
  if (device.platform === 'Android') {
    src = '/android_asset/www/' + src;
  }
  mi_sonido = new Media(src, playSuccess, playError);
  mi_sonido.setVolume('1.0');
  mi_sonido.play({ playAudioWhenScreenIsLocked : true });
  //window.setTimeout(function() {
  //	mi_sonido.setVolume('0.0');
  //}, 20000);
};

function playSuccess() {
  console.log("playAudio():Audio Success");
};

function playError(error) {
  navigator.notification.alert("non se puido reproduci-la son",irShow(),"ERRO NA REPRODUCCION", "OK");
};


//Fotos con "capture"
//function captureImage() {
    // Launch device camera application, 
//    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 1});
//}

//function captureSuccess(mediaFiles) {
//        var i, len;
//        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
//            var smallImage = document.getElementById('smallImage');
//            smallImage.style.display = 'block';
            // Show the captured photo.
//            smallImage.src = mediaFiles[i].fullPath;
//            rutafoto = document.getElementById("rutafoto");
//        	rutafoto.innerHTML = '<p>quédache a foto eiquí: ' + mediaFiles[i].fullPath + '</p>';
//		    rutasubida = document.getElementById("rutasubida");
//			rutasubida.innerHTML = '<p>espera uns segundos a que sexa subida...</p>';
//            uploadPhoto(mediaFiles[i]);
//        }       
//}
// Called if something bad happens.
//function captureError(error) {
//        alert('erro durante a captura: ' + error.code);
//        navigator.notification.alert(msg, null, 'Uh oh!');
//}

//SUBE FOTO
//function uploadPhoto(mediaFile) {
//            var options = new FileUploadOptions();
//    		options.fileKey = "file";        
//            options.fileName = makeId() + ".jpg";
//            options.mimeType = "image/jpeg";
//    		options.chunkedMode = false;
//    		options.headers = {Connection: "close"};
//            path = mediaFile.fullPath;
//            var params = {};
//            params.value1 = "Show David&Taninos";
//            params.value2 = "davytan";
//            options.params = params;
//            var ft = new FileTransfer();
//            ft.upload(path, servidor_sube, uploadSuccess, uploadError, options, true);
//}
//
//function uploadSuccess(r) {
//            console.log("Code = " + r.responseCode);
//            console.log("Response = " + r.response);
//            console.log("Sent = " + r.bytesSent);
//		    rutasubida = document.getElementById("rutasubida");
        	//rutasubida.innerHTML = '<p>foto subida OK!<br/>' + r.responseCode + '<br/>' + r.response + '<br/>' + r.bytesSent + '</p>'
//			rutasubida.innerHTML = '<p>foto subida OK!</p>';
//}
//
//function uploadError(error) {
//            alert("erro durante a subida: Code = " + error.code + ", source = " + error.source + ", target = " + error.target);
//            console.log("upload error source " + error.source);
//            console.log("upload error target " + error.target);
//}

//nombre de imagen aleatorio
//function makeId(){
//    var text = "";
//    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//    for( var i=0; i < 8; i++ )
//        text += possible.charAt(Math.floor(Math.random() * possible.length));
//    return text;
//}

//envio de tweet (y facebook,...)
//
//function enviaSMS(){
//var tweet = document.getElementById('tweet');    
//var message = {
//    text: hashtag + " " + tweet.value,
//    activityTypes: ["PostToTwitter"]
//};
//window.socialmessage.send(message);
//}


// Lanza Loto
//function startLoto(){
//	var data;
//    var val;
//   var newHTMLloto2;
    //mostrarVariables();
//    newHTMLloto2 = '<button width="100%" class="boton-negro boton-centro boton-text-all-color"><h2>\
//            ¿Quen será o afortunado...? Permanece atento á pantalla.</h2></button>';
//	if (ganador === 0) {document.getElementById("div-comienzaShow-loto2").innerHTML = newHTMLloto2;        
//    } else {
//           document.getElementById("div-comienzaShow-loto2").innerHTML = ''; 
//    }
//    $.getJSON(servidor_leeLoto)
//    	.done(function(data) {  
//	        $.each(data, function(key, val) {
//    	        comienzashow = val.comienzashow;
//                alertasactivadas = val.alertasactivadas;
//                servidor_streaming = val.streaming;
//                streamingactivado = val.streamingactivado;
//            	lotoactivada = val.lotoactivada;
//            	loto = val.loto;
//            	if (ganador === 1 || (loto === 1 && lotoactivada === 1)){
//            		ganador = 1;
//                	var lotoFoto = document.getElementById('tabstrip-lotoFoto');
//	            	lotoFoto.style.display = 'block';
//           	 	lotoFoto.src = './imagenes/arale.jpg';
//                	if (lotoactivada === 1) playAudio(archivo_pedo);
//            	}
//        	});
//            if (errordetectado === 1){
//                if (alertasactivadas === 1){
//                    navigator.notification.alert("Parece que xa vai...",irShow(),"COMUNICACION RECUPERADA", "OK");
//            	}
//            }
//            errordetectado = 0;
//    	})
//	    .fail(function(jqxhr, textStatus, error){
//    		if (errordetectado === 0){
//                errordetectado = 1;
//                errornotificaciones = 8;
//			}
//            if (alertasactivadas === 1){
//                if (errornotificaciones === 5){
//                	navigator.notification.alert("Proba de novo... parece que non dou conectado",irShow(),"ERRO NA COMUNICACION", "OK");
//                } else if (errornotificaciones === 1){
//	                navigator.notification.alert("Sae da App (pulsando o botón menú do teu móbil), conéctate á WiFi, e volve a lanza-la App",irFogar(),"ERRO NA COMUNICACION", "OK");
//                }
//                errornotificaciones = errornotificaciones - 1;
//            }
//    	});
//    repeLoto1 = setTimeout(startLoto, startlotosettimeout);
//};

// Cancela Loto
//function stopLoto(){
//    if (repeLoto1 !== null) clearTimeout(repeLoto1);
//    repeLoto1 = null;
//};


//opcion de Exit
function exitAppPopup() {
    navigator.notification.confirm(
        "visita www.aerowi.es se queres saber como fixemos esta app"
        , function(button) {
              if (button === 2) {
                  window.plugins.powerManagement.release();
                  stopConsultaServidor();stopSelfie();
                  navigator.app.exitApp();
              } 
          }
        , "¿Sair do Show?"
        , "Pois non, Pois si"
    );
    return false;
};

function irShow(){
    window.location.href='index.html#tabstrip-show';
};

function irFogar(){
    window.location.href='index.html#tabstrip-fogar';
};

function irSelfie(){
    window.location.href='index.html#tabstrip-selfie';
};

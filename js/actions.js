var ssi = 0;
var instance = null;
var step = 1;
var x1 = null;
var x2 = null;
var y1 = null;
var y2 = null;

var _defaults = {
  conector : "Bezier"
};

//Begin Socket
//Begin Socket
var mxm = setInterval(function(){ 
    
    try{
        var All = instance.selectEndpoints();
        for (var i = 0; i < All.length; i++) {
            var current = All.get(i);
            
            if(_defaults.conector=="Distante"){
                current.connector = "Focalizado";
                current.connectorStyle.dashstyle = "2 2";
            }else if(_defaults.conector=="Abuso_Sexual"){
                current.connector = "Abuso_Sexual";
                current.ConnectionOverlays = [
                        [ "Arrow", {
                            location: 1,
                            id: "arrow",
                            length: 14,
                            foldback: 0.8
                        } ],
                        [ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
                    ];
                 current.connectorStyle.dashstyle = "0 0";
            }else if(_defaults.conector=="Flowchart"){
                current.connector = "Flowchart";
            }else{
                current.connector = _defaults.conector;
                current.connectorStyle.dashstyle = "0 0";
            }
        
        }        
    }catch(e){
    }

}, 100);
//Begin Socket
//Begin Socket

var listDiv = document.getElementById("list");

var showConnectionInfo = function (s) {
    listDiv.innerHTML = s;
    listDiv.style.display = "block";
};
        
var hideConnectionInfo = function () {
    listDiv.style.display = "none";
};

var connections = [];

var updateConnections = function (conn, remove) {
    if (!remove) connections.push(conn);
    else {
        var idx = -1;
        for (var i = 0; i < connections.length; i++) {
            if (connections[i] == conn) {
                idx = i;
                break;
            }
        }
        if (idx != -1) connections.splice(idx, 1);
    }
    if (connections.length > 0) {
    } else
        hideConnectionInfo();
};

var isLine = false;

jsPlumb.ready(function(e){
    
    // Oculto el cargador
    setTimeout(function(){ $('.loader').addClass('closed'); },1000);
    setTimeout(function(){ $('.loader').css('z-index','-1'); },1500);
    
    // Cargo el tema que habia elegido previamente el usuario
    if(localStorage.getItem("theme") != null)
        $("body").addClass(localStorage.getItem("theme"));
    
    // Si recargo la pagina y quiere recuperar lo que estaba haciendo
    if(localStorage.getItem('autoload') != null){
        //Clear jsPlumb memory of connections/connectors & endpoints
        //sjsPlumb.reset();debugger

        //Clear DOM
       /* $("#canvas").empty();
        var elem = $("<div/>");
        elem.attr('class', "shape");
        $("#canvas").append(elem);*/

        //Load saved graph 
      /*  var v = localStorage.getItem('autoload');
        jsPlumb.load({
            savedObj:JSON.parse(v), 
            containerSelector:"#canvas"
        });*/
    }
    
    // Llamo la funcion que permite cambiar el tema
    theme_selector();
    
    // Evento que abre el contenedor para dibujar la linea
    $('.draw_line').unbind('click').click(function(){
        $('.overlay').addClass('open');
        
        document_click();
    });
    
    // Evento que cierra el contenedor para dibujar la linea
    $('.close_overlay').unbind('click').click(function(){
        step = 1;
        $('.wave').remove();
        $('.overlay').removeClass('open').attr('step', step);
    });
   
    // Evento que exporta el archivo aun formato .json
    $(".export_ico").unbind('click').click(function(e){
        e.preventDefault();
        
        // Si el contenedor tiene elementos
        if( $('#canvas').children().length > 2 ){
            
            var filename = "";
            var export_ = prompt("Nombre del archivo ", "diagram");
            
            if (export_ != null) 
                filename = export_;
            else
                filename = "diagram";

            const MIME_TYPE = 'text/plain';
            
            var Objs = [];
            
            $('.shape').each(function(i,e) {
                var element = $(e);
                
                Objs.push({
                    id: element.attr('id'), 
                    html: element.html(),
                    left: element.css('left'),
                    top: element.css('top'),
                    width: element.css('width'),
                    height: element.css('height'),
                    attrs: element.attr('type')
                });
            });
            
            console.log(Objs);
            
            var obj = JSON.stringify( jsPlumb.save({
                selector: '.shape'
            }) );
            
            var bb = new Blob([ obj ], { type: MIME_TYPE });
        
            var a = $(".descargar_");
                a.attr("download", filename + ".json");
                a.attr("href" , window.URL.createObjectURL(bb));
                a.text("Descarga Lista");
            $(".alert_ok").show();

        }else{
           alert("No hay datos");
        }


       /*
           localStorage.setItem('autoload', JSON.stringify(obj));
           var $html = $("#canvas").html();
           var name_file = prompt('Nombre del archivo');
           
           if(name_file != null){
            $(this).attr('download', name_file + '.html');
            $(this).attr('href', 'data:text/html;charset=UTF-8,' + $html);   
           }else{
                e.preventDefault();
               return;
           }
       }else{
           e.preventDefault();
       }*/
   });
    
    // Evento que exporta el archivo
    $(".import_ico").unbind('click').click(function(e){
        e.preventDefault();
        $("#files").click();
    });
   
    // Evento que limpia el contenedor
    $(".delete_icon").click(function(e){
       e.preventDefault();
       instance.remove();
       $('.jtk-demo-main').empty();
    });
   
    // Evento que selecciona el tipo de conector
    $(".icon-selector").unbind("click").click(function(){
        $(".icon-selector").removeClass("selected");
        $(this).toggleClass("selected");
        $("#image_type").parent().parent().removeClass('move');
        
        var src = $(this).attr("src") + "?ver=" + new Date();
        
        setTimeout(function() {
            $("#image_type").attr("src", src).parent().parent().removeClass('move');
        }, 300);
        
        setTimeout(function() {
            $("#image_type").parent().parent().addClass('move');
        }, 500);
        
        var type = $(this).attr("type");

        _defaults.conector = type;
        
    });
    
    // Evento que vuelve los items en acordion
    $( ".conectors" ).accordion({
      heightStyle: "content"
    });

    instance = jsPlumb.getInstance({
	    DragOptions: { cursor: 'pointer', zIndex: 100 },
	    PaintStyle: { strokeStyle: '#666' },
	    EndpointHoverStyle: { fillStyle: "orange" },
	    HoverPaintStyle: { strokeStyle: "orange" },
	    EndpointStyle: { width: 2, height: 2},
	    endpoint:"Rectangle",
	    Anchors: ["TopCenter", "TopCenter"],
	    Container: "#canvas",
	    connector:"Straight",
	    endpoint:[ "Image", { src:"http://morrisonpitt.com/jsPlumb/img/endpointTest1.png" } ],
	    overlays:[ 
        "Arrow", 
          [ "Label", { label:"foo", location:50, id:"myLabel" } ]
        ]
	});

    // Evento que elimina el conector
    instance.bind("dblclick", function(conn) {
       var $_conection = conn;
        
        $( "#settings_path" ).dialog( "open" );
        
        $('#btn_delete_path').unbind('click').click(function(){
            jsPlumb.detach($_conection);
	        $( "#settings_path" ).dialog( "close" );
	    });
	    
   });

	instance.setContainer($("#canvas"));

    var exampleDropOptions = {
        tolerance: "touch",
        hoverClass: "dropHover",
        activeClass: "dragActive"
    };
    var exampleColor = "#00f";
    
    // Points
    var exampleEndpoint = {
        paintStyle: { width: 2, height: 2, fillStyle: exampleColor },
        isSource: true,
        EndpointStyle: { width: 2, height: 2},
        reattach: true,
        scope: "blue",
        connectorStyle: {
            gradient: {stops: [
                [0, exampleColor],
                [0.5, "#09098e"],
                [1, exampleColor]
            ]},
            lineWidth: 1.3,
            strokeStyle: exampleColor,
        },
        isTarget: true,
        dropOptions: exampleDropOptions,
        anchor:"LeftMiddle",
        maxConnections: 10,
        overlays:[
           // [ "Label", { label:"foo", id:"label", location:[-0.5, -0.5] } ]
        ],
        connectorOverlays:[ 
            [ "Arrow", { width:15, length:30, location:1, id:"arrow" } ],
          //  [ "Label", { label:"foo", id:"label" } ]
        ]
    };
    var exampleEndpoint2 = {
        paintStyle: { width: 2, height: 2, fillStyle: exampleColor },
        isSource: true,
        EndpointStyle: { width: 2, height: 2},
        reattach: true,
        scope: "blue",
        connectorStyle: {
            gradient: {stops: [
                [0, exampleColor],
                [0.5, "#09098e"],
                [1, exampleColor]
            ]},
            lineWidth: 1.3,
            strokeStyle: exampleColor,
        },
        isTarget: true,
        dropOptions: exampleDropOptions,
        anchor:"RightMiddle",
        maxConnections: 10,
        overlays:[
          //  [ "Label", { label:"foo", id:"label", location:[-0.5, -0.5] } ]
        ],
        connectorOverlays:[ 
            [ "Arrow", { width:15, length:30, location:1, id:"arrow" } ],
          //  [ "Label", { label:"foo", id:"label" } ]
        ]
    };
    var exampleEndpoint3 = {
        paintStyle: { width: 25, height: 21, fillStyle: exampleColor },
        isSource: true,
        EndpointStyle: { width: 5, height: 5},
        reattach: true,
        scope: "blue",
        connectorStyle: {
            gradient: {stops: [
                [0, exampleColor],
                [0.5, "#09098e"],
                [1, exampleColor]
            ]},
            lineWidth: 1.3,
            strokeStyle: exampleColor,
        },
        isTarget: true,
        dropOptions: exampleDropOptions,
        anchor:"TopCenter",
        maxConnections: 10,
        overlays:[
          //  [ "Label", { label:"foo", id:"label", location:[-0.5, -0.5] } ]
        ],
        connectorOverlays:[ 
            [ "Arrow", { width:15, length:30, location:1, id:"arrow" } ],
            //[ "Label", { label:"foo", id:"label" } ]
        ]
    };
    var exampleEndpoint4 = {
        paintStyle: { width: 10, height: 8, fillStyle: exampleColor },
        EndpointStyle: { width: 2, height: 2},
        isSource: true,
        reattach: true,
        scope: "blue",
        connectorStyle: {
            gradient: {stops: [
                [0, exampleColor],
                [0.5, "#09098e"],
                [1, exampleColor]
            ]},
            lineWidth: 1.3,
            strokeStyle: exampleColor,
        },
        isTarget: true,
        dropOptions: exampleDropOptions,
        anchor:"BottomCenter",
        maxConnections: 10,
        overlays:[
           // [ "Label", { label:"foo", id:"label", location:[-0.5, -0.5] } ]
        ],
        connectorOverlays:[ 
           [ "Arrow", { width:15, length:30, location:1, id:"arrow" } ],
            //[ "Label", { label:"foo", id:"label" } ]
        ]
    };

    var anchors = [
            [0.4, 0.5, 0, 0.5],
            [0.4, 0.5, 0, 0.5],
            [0.4, 0.5, 0, 0.5],
            [0.4, 0.5, 0, 0.5],
    ],
    
    maxConnectionsCallback = function (info) {
        alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
    };
	
	// Evento del droppable
	$("#canvas").droppable({
		accept: '.icon-drag',
		containment: 'canvas',
		activeClass: 'drag',
		drop: function(e,ui){ // Evento que me lona un item en el canvas
			var droppedElement = ui.helper.clone();
            
            var $target = droppedElement.attr("type");
        
            $(droppedElement).removeAttr("class");
            $(droppedElement).addClass("shape");
			
			// Añado los items que me permitiran registrar la edad, la fecha etc
			$(droppedElement).append("<span class='age'></span>");
			$(droppedElement).append("<span class='date'></span>");
			$(droppedElement).append("<span class='name'></span>");
			$(droppedElement).append("<textarea class='text' readonly='true'></textarea>");
			$(droppedElement).append("<button type='button' style='display: none'></button>");
			
			// agrego el item al canvas con su posicion
			droppedElement.appendTo("#canvas").css({
			    "top": (e.pageY) - (parseInt($(".all").css("margin-top")) + 50 ) +"px",
			    "left": (e.pageX) - ($(".content.toolbox.row").width() + 40) +"px",
			});
            
            // Vuelvo draggable el item
			instance.draggable($(droppedElement),  {
               containment:true
            });
            
            // Le añado el evento resize para cambiarle el tamaño
            $(droppedElement).resizable({ 
                handles: 'se, sw, nw',
                resize : function(event, ui) {     
                    instance.repaintEverything();
                },
                maxWidth:110,
                minWidth:65,
                minHeight:65,
                maxHeight:110
            });

            // Le añado los 4 puntos para los conetores
			var a = instance.addEndpoint($(droppedElement), exampleEndpoint);
			var b = instance.addEndpoint($(droppedElement), exampleEndpoint2);
			var c = instance.addEndpoint($(droppedElement), exampleEndpoint3);
			var d = instance.addEndpoint($(droppedElement), exampleEndpoint4);
			
			a.addOverlay([ "Arrow", { width:10, height:10, id:"arrow" }]); 
			b.addOverlay([ "Arrow", { width:10, height:10, id:"arrow" }]); 
			c.addOverlay([ "Arrow", { width:10, height:10, id:"arrow" }]); 
			d.addOverlay([ "Arrow", { width:10, height:10, id:"arrow" }]); 
		
		    // llamo el evento que me permite hacer click en el item  
			event_shape();
		}
	});
	
	// Evento del Draggable
	$(".icon-drag").draggable({
		helper: 'clone',
		appendTo: 'body',
    	scroll: false,
		cursor: 'move',
		drag: function(ui,e){
		    var target = ui.target;
		    var type = target.getAttribute('type');
		    if(type == "pregnancy" || type == "ind_abortion"){
		        target.style.boxShadow    = "0";
		    }else{
		        target.style.boxShadow    = "0 0 20px 0px rgba(0, 0, 0, 0.83)";
		    }
		},
		stop: function(ui,e){
		    var target = ui.target;
		    
		    var type = target.getAttribute('type');
		    
		    if(type == "pregnancy" || type == "ind_abortion"){
		        target.style.boxShadow    = "0";
		    }else{
		        target.style.boxShadow    = "0 0 13px 0px rgba(0, 0, 0, 0.33)";
		    }
		    
		},
		tolerance: 'fit',
		revert: true,
		grid: [ 20, 20 ]
	});
	
	var timeout = null;
	
	// Evento que limpia el contenedor principal
    $(".delete_ico").click(function(e){
         e.preventDefault();
         instance.reset();
         $("#canvas").empty();
    });
    
    // Selecciono el item para los conectores
    setTimeout(function(){ 
        $(".icon-selector").eq(0).click(); 
    }, 1000);
    
    // Funciones a los popups de configuración
    setTimeout(function(){
        $( "#settings_path" ).dialog({ autoOpen: false });
        $( "#settings_item" ).dialog({ autoOpen: false });
        $( "#settings_line" ).dialog({ autoOpen: false });
    }, 1000);
    
    // Eventos de los conectores
    setInterval(function(){
        $( "svg path" ).unbind('dblclick').dblclick(function() {
            $( "#settings_path" ).dialog( "open" );
            functions_path($(this));
        });
    },1000);
	
	// Evento que abre el popup de la configuración de cada item haciendo doble clik
	function event_shape(){
	    $(".shape").unbind("dblclick").dblclick(function(){
	        
            delete_shape($(this));
            change_background($(this));
            text_shape($(this));
            die_obj($(this));
            
            if ($(this).hasClass("die"))
                $("#die_item").prop("checked", true);
            else
	            $("#die_item").prop("checked", false);
            
            if(
                $(this).find('.date').text() != "" || 
                $(this).find('.age').text() != "" ||
                $(this).find('.text').text() != "" ||
                $(this).find('.name').text() != ""){
                $("#txt_age").val($(this).find('.age').text()); 
                $("#txt_date").val($(this).find('.date').text());
                $("#txt_text").val($(this).find('.text').text());
                $("#txt_name").val($(this).find('.name').text());
                $("#txt_color_text").val($(this).css('background-color'));
            }else{
                $("#chb_die").prop("checked", false);
                $("#txt_age, #txt_date, #txt_name, #txt_text").val("");
                $("#txt_color_text").val($(this).css('background-color'));
            }
            
            $("#settings_item").dialog( "open" );
        });
	}
	
	// Evento que le pone la edad, el nombre, el texto, la fecha al item
	function text_shape(obj){
	    $("#txt_age").unbind('change').change(function(e){
            if(isNaN($(this).val()))
                $("#txt_age").val("");
            else
                obj.find('.age').text( $(this).val());
	    });
	    
	    $("#txt_name").unbind('keyup').keyup(function(e){
            obj.find('.name').text( $(this).val());
	    });
	    
	    $("#txt_text").unbind('keyup').keyup(function(e){
            obj.find('.text').text( $(this).val());
	    });
	    
	    $("#txt_date").unbind("change").change(function(){
	        obj.find('.date').text($("#txt_date").val());
	    });
	}
	
	// Evento que borra un item con sus conectores
	function delete_shape(obj){
	    $("#btn_delete").unbind('click').click(function(){
	        obj.next().remove();
	        obj.next().remove();
	        obj.next().remove();
	        obj.next().remove();
	        obj.remove();
	        $("#settings_item").dialog( "close" );
	    });
	}
	
	// Evento que cambia el color del item
	function change_background(obj){
	    $("#txt_color_text").unbind("change").change(function(){
	        obj.css("background", "#" + $(this).val());
	    });
	}
	
	// Evento que le agrega los tipos de aborto al item
	function die_obj(obj){
	    $("#die_item").unbind("change").change(function(){
	        obj.toggleClass("die");
	    });
	}
	
	// Evento que cambia el tema de la página
	function theme_selector(){
	    $('.settings li').unbind("click").click(function(){
	        localStorage.setItem("theme", $(this).attr("theme"));
	        $('body').removeClass("theme_2 theme_3 theme_4").addClass($(this).attr("theme"));
	    });
	}
    
    // Funcion de los conectores para cambiar el tamaño y color
    function functions_path(path){  
	    
	    $('#txt_size_path').unbind('change').change(function(){
	        path.css('stroke-width', $(this).val()+"px");
	    });
	    
	    $('#txt_color_path').unbind('change').change(function(){
	        path.css('stroke', "#" + $(this).val());
	    });
	}
});

function handleFileSelect(evt) {
    var files = evt.target.files;

    for (var i = 0, f; f = files[i]; i++) {
      var reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
            try {
                var compila = JSON.parse( e.target.result );
                
                instance.reset();
                $("#canvas").empty();
                
                jsPlumb.load({
                   savedObj: compila,
                   containerSelector: "#canvas"
                  }
                );
                
                event_shape();
                get_items();

            }catch (e) {
                alert("El archivo que desea importar no es valido! El archivo debe ser con extensión .json");
                return false;
            }

        };
    })(f);
      reader.readAsText(f);
    }
}

// Evento cuando se carga un archivo
document.getElementById('files').addEventListener('change', handleFileSelect, false);

// Evento que abre el popup de la configuración de cada item haciendo doble clik
function event_shape(){
    $(".shape").unbind("dblclick").dblclick(function(){
        console.log($(this));
        delete_shape($(this));
        change_background($(this));
        text_shape($(this));
        die_obj($(this));
        
        if ($(this).hasClass("ind_abortion")){
            $("#chb_ind_a").prop("checked", true);
        }else if($(this).hasClass("esp_abortion")){
            $("#chb_esp_a").prop("checked", true);
        }else{
            $("#chb_ind_a,#chb_esp_a").prop("checked", false);
            $("#chb_none + label").hide();
        }
        
        if(
            $(this).find('.date').text() != "" || 
            $(this).find('.age').text() != "" ||
            $(this).find('.text').text() != "" ||
            $(this).find('.name').text() != ""){
            $("#txt_age").val($(this).find('.age').text()); 
            $("#txt_date").val($(this).find('.date').text());
            $("#txt_text").val($(this).find('.text').text());
            $("#txt_name").val($(this).find('.name').text());
            $("#txt_color_text").val($(this).css('background-color'));
        }else{
            $("#chb_die").prop("checked", false);
            $("#txt_age, #txt_date, #txt_name, #txt_text").val("");
            $("#txt_color_text").val($(this).css('background-color'));
        }
        
        $("#settings_item").dialog( "open" );
    });
}

// Evento que le pone la edad, el nombre, el texto, la fecha al item
function text_shape(obj){
    $("#txt_age").unbind('change').change(function(e){
        if(isNaN($(this).val()))
            $("#txt_age").val("");
        else
            obj.find('.age').text( $(this).val());
    });
    
    $("#txt_name").unbind('keyup').keyup(function(e){
        obj.find('.name').text( $(this).val());
    });
    
    $("#txt_text").unbind('keyup').keyup(function(e){
        obj.find('.text').text( $(this).val());
    });
    
    $("#txt_date").unbind("change").change(function(){
        obj.find('.date').text($("#txt_date").val());
    });
}

// Evento que borra un item con sus conectores
function delete_shape(obj){debugger
    console.log(obj);
    $("#btn_delete").unbind('click').click(function(){
        obj.remove();
        $("#settings_item").dialog( "close" );
    });
}

// Evento que cambia el color del item
function change_background(obj){
    $("#txt_color_text").unbind("change").change(function(){
        obj.css("background", "#" + $(this).val());
    });
}

// Evento que le agrega los tipos de aborto al item
function die_obj(obj){
    $("#chb_ind_a").unbind("change").change(function(){
        obj.removeClass("ind_abortion").toggleClass("esp_abortion");
        $("#chb_none + label").show();
    });
    
    $("#chb_esp_a").unbind("change").change(function(){
        obj.removeClass("esp_abortion").toggleClass("ind_abortion");
        $("#chb_none + label").show();
    });
    
    $("#chb_none").unbind("change").change(function(){
        obj.removeClass("esp_abortion ind_abortion");
        $("#chb_none + label").hide();
    });
}

// Evento que recorre todos los items
function get_items(){
    debugger
    instance = jsPlumb.getInstance({
	    DragOptions: { cursor: 'pointer', zIndex: 100 },
	    PaintStyle: { strokeStyle: '#666' },
	    EndpointHoverStyle: { fillStyle: "orange" },
	    HoverPaintStyle: { strokeStyle: "orange" },
	    EndpointStyle: { width: 2, height: 2},
	    endpoint:"Rectangle",
	    Anchors: ["TopCenter", "TopCenter"],
	    Container: "#canvas",
	    connector:"Straight",
	    endpoint:[ "Image", { src:"http://morrisonpitt.com/jsPlumb/img/endpointTest1.png" } ],
	});

    console.log(instance);

    // Evento que elimina el conector
    instance.bind("dblclick", function(conn) {
       var $_conection = conn;
        
        $( "#settings_path" ).dialog( "open" );
        
        $('#btn_delete_path').unbind('click').click(function(){
            jsPlumb.detach($_conection);
	        $( "#settings_path" ).dialog( "close" );
	    });
	    
   });

	instance.setContainer($("#canvas"));

    var exampleDropOptions = {
        tolerance: "touch",
        hoverClass: "dropHover",
        activeClass: "dragActive"
    };
    var exampleColor = "#00f";
    
    // Points
    var exampleEndpoint = {
        paintStyle: { width: 2, height: 2, fillStyle: exampleColor },
        isSource: true,
        EndpointStyle: { width: 2, height: 2},
        reattach: true,
        scope: "blue",
        connectorStyle: {
            gradient: {stops: [
                [0, exampleColor],
                [0.5, "#09098e"],
                [1, exampleColor]
            ]},
            lineWidth: 1.3,
            strokeStyle: exampleColor,
        },
        isTarget: true,
        dropOptions: exampleDropOptions,
        anchor:"LeftMiddle",
        maxConnections: 10
    };
    var exampleEndpoint2 = {
        paintStyle: { width: 2, height: 2, fillStyle: exampleColor },
        isSource: true,
        EndpointStyle: { width: 2, height: 2},
        reattach: true,
        scope: "blue",
        connectorStyle: {
            gradient: {stops: [
                [0, exampleColor],
                [0.5, "#09098e"],
                [1, exampleColor]
            ]},
            lineWidth: 1.3,
            strokeStyle: exampleColor,
        },
        isTarget: true,
        dropOptions: exampleDropOptions,
        anchor:"RightMiddle",
        maxConnections: 10
    };
    var exampleEndpoint3 = {
        paintStyle: { width: 25, height: 21, fillStyle: exampleColor },
        isSource: true,
        EndpointStyle: { width: 5, height: 5},
        reattach: true,
        scope: "blue",
        connectorStyle: {
            gradient: {stops: [
                [0, exampleColor],
                [0.5, "#09098e"],
                [1, exampleColor]
            ]},
            lineWidth: 1.3,
            strokeStyle: exampleColor,
        },
        isTarget: true,
        dropOptions: exampleDropOptions,
        anchor:"TopCenter",
        maxConnections: 10
    };
    var exampleEndpoint4 = {
        paintStyle: { width: 10, height: 8, fillStyle: exampleColor },
        EndpointStyle: { width: 2, height: 2},
        isSource: true,
        reattach: true,
        scope: "blue",
        connectorStyle: {
            gradient: {stops: [
                [0, exampleColor],
                [0.5, "#09098e"],
                [1, exampleColor]
            ]},
            lineWidth: 1.3,
            strokeStyle: exampleColor,
        },
        isTarget: true,
        dropOptions: exampleDropOptions,
        anchor:"BottomCenter",
        maxConnections: 10
    };
    
    
    $('.shape').each(function(i,e){
        var $e = $(e);
        
        // Vuelvo draggable el item
    	instance.draggable($e,  {
           containment:true
        });
        
        // Le añado los 4 puntos para los conetores
		instance.addEndpoint($e, exampleEndpoint);
		instance.addEndpoint($e, exampleEndpoint2);
		instance.addEndpoint($e, exampleEndpoint3);
		instance.addEndpoint($e, exampleEndpoint4);
    });
}

function document_click(){
    var body = document.querySelector('.body');
    var canvas = document.querySelector('#canvas');
    var overlay = document.querySelector('.overlay');
    
    canvas.onclick = function(evt){
        
        if($('.overlay').hasClass('open')){
            
            var position_X = evt.clientX - 50;
            var position_Y = evt.clientY - 50;
            
            if(step == 1){
                x1 = position_X;
                y1 = position_Y;
            }
            
            step++;
            $('.overlay').attr('step', step);
            
            var wave = document.createElement('div');
            
            wave.style.left = position_X + 'px';
            wave.style.top = position_Y + 'px';
            wave.className = 'wave';
            
            body.appendChild(wave);
            
            setTimeout(function(){
                wave.className = 'wave effect';
                // setTimeout(function(){
                //     body.removeChild(wave);
                // },600);
            },10);
            
            if(step > 2){
                x2 = position_X;
                y2 = position_Y;
                step = 1;
                $('.overlay').removeClass('open').attr('step', step);
                $('#canvas').line((x1 - 233),y1,(x2 - 233),y2, {color:"#323232", stroke:3, zindex:10,cursor:'pointer'}, function(e){
                    var lines = $('#canvas > div:not(.shape,.overlay,.jsplumb-endpoint)');
                    lines.addClass('line');
                    $('.line').each(function(i,e){
                        $(e).attr('id', 'line'+i)
                    });
                    event_line();
                    lines.draggable();
                });
                $('.wave').remove();
            }
        }else{
            return;
        }
        
    };
}

function event_line(){
    $('.line').unbind('dblclick').dblclick(function(){
        $( "#settings_line" ).dialog( "open" );
        delete_line($(this));
        change_background_line($(this));
    });
}

// Funcion que elimina una linea
function delete_line(obj){
    $("#btn_delete_line").unbind('click').click(function(){
        obj.remove();
        $("#settings_line").dialog( "close" );
    });
}

// Funcion que le cambia el tamaño a la linea y el color
function change_background_line(obj){
    $('#txt_size_line').unbind('change').change(function(){
        obj.css('border-width', $(this).val()+"px");
    });
    
    $('#txt_color_line').unbind('change').change(function(){
        obj.css('border-color', "#" + $(this).val());
    });
}
var ssi = 0;
var instance = null;

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
                current.connector = "Fusionado";
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
       console.warn("Assing Error"); 
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
$(document).ready(function(){
    
   /* $("#canvas").click(function(e){
        if(isLine == true){
            var left = e.pageX;
            var top = e.pageY;
            var $pointone = "<div class='point' style='position:absolute;left:" + left + "px;top:" + top + "px;'>o</div>";
            $("body").append($pointone);            
        }else{
            
        }
    });
    
    $(".visors").click(function(){
        isLine = true;
    });*/
    
    
    if (typeof(FireShotAPI) != "undefined" && FireShotAPI.isAvailable()){
        $(".alert_i").hide();
        $(".alert_ok").show();
    }else{
        $(".alert_i").show();
        $(".alert_ok").hide();
    }
    
    $(".delete_ico").click(function(e){
         e.preventDefault();
         instance.reset();
         $("#canvas").empty();
    });
    
    
    setTimeout(function(){ 
        $(".icon-selector").eq(5).click(); 
    }, 2000);
    
    if(localStorage.getItem("theme") != null)
        $("body").addClass(localStorage.getItem("theme"));
    
    setTimeout(function(){
        $( "#settings_path" ).dialog({ autoOpen: false });
        $( "#settings_item" ).dialog({ autoOpen: false });
    }, 1000);
    
   setInterval(function(){
        $( "svg path" ).unbind('dblclick').dblclick(function() {
          $( "#settings_path" ).dialog( "open" );
          functions_path($(this));
        });
    },1000);
    
    function functions_path(path){  
	    
	    $('#txt_size_path').unbind('change').change(function(){
	        path.css('stroke-width', $(this).val()+"px");
	    });
	    
	    $('#txt_color_path').unbind('change').change(function(){
	        path.css('stroke', "#" + $(this).val());
	    });
	}
});

jsPlumb.ready(function(e){
    
    // Oculto el cargador
    setTimeout(function(){ $('.loader').addClass('closed'); },1000);
    setTimeout(function(){ $('.loader').css('z-index','-1'); },1500);
    
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
    
    theme_selector();
    
    $('.draw_line').unbind('click').click(function(){
        $('.overlay').toggleClass('open');
    });
    
    $('.close_overlay').unbind('click').click(function(){
        $('.overlay').removeClass('open');
        
    });
   
   $(".export_ico").unbind('click').click(function(e){
        var obj=jsPlumb.save({selector:".shape"});
        
       if($('#canvas').children().length > 2){
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
       }
   });
   
   $(".import_ico").unbind('click').click(function(e){
        e.preventDefault();
   });
   
   $(".delete_icon").click(function(e){
       e.preventDefault();
       instance.remove();
       $('.jtk-demo-main').empty();
   });
   
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
    
    $( ".conectors" ).accordion({
      heightStyle: "content"
    });

    instance = jsPlumb.getInstance({
	    DragOptions: { cursor: 'pointer', zIndex: 2000 },
	    PaintStyle: { strokeStyle: '#666' },
	    EndpointHoverStyle: { fillStyle: "orange" },
	    HoverPaintStyle: { strokeStyle: "orange" },
	    EndpointStyle: { width: 5, height: 5},
	    endpoint:"Rectangle",
	    Anchors: ["TopCenter", "TopCenter"],
	    Container: "#dropArea",
	    connector:"Straight",
	    endpoint:[ "Image", { src:"http://morrisonpitt.com/jsPlumb/img/endpointTest1.png" } ],
	});

   instance.bind("dblclick", function(conn) {
       var $_conection = conn;
        
        $( "#settings_path" ).dialog( "open" );
        
        $('#btn_delete_path').unbind('click').click(function(){
            jsPlumb.detach($_conection);
	        $( "#settings_path" ).dialog( "close" );
	    });
	    
   });

	instance.setContainer($("#dropArea"));
	
	$(".icon-drag").draggable({
		helper: 'clone',
		appendTo: 'body',
    	scroll: false,
		cursor: 'move',
		tolerance: 'fit',
		revert: true
	});

    var exampleDropOptions = {
        tolerance: "touch",
        hoverClass: "dropHover",
        activeClass: "dragActive"
    };
    
    
    var exampleColor = "#00f";
    
    var exampleEndpoint = {
       //connector:[ "TriangleWave", { spring:true, stub:[ 20, 20 ] } ],
       // endpoint:[ "Image", { src:"http://morrisonpitt.com/jsPlumb/img/endpointTest1.png" } ],
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
        isSource: true,
        maxConnections: 10,
        isTarget: true
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
        /*connectorOverlays:[ 
            [ "Arrow", { width:25, length:25, location:1, id:"arrow" } ],
        ]*/
        isTarget: true,
        // beforeDrop: function (params) {
        //     return confirm("Vincular " + params.sourceId + " to " + params.targetId + "?");
        // },
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
        // beforeDrop: function (params) {
        //     return confirm("Vincular " + params.sourceId + " to " + params.targetId + "?");
        // },
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
        // beforeDrop: function (params) {
        //     return confirm("Vincular " + params.sourceId + " to " + params.targetId + "?");
        // },
        dropOptions: exampleDropOptions,
        anchor:"BottomCenter",
        maxConnections: 10
    };

    var anchors = [
            [0.8, 1, 0, 1],
            [0.8, 1, 0, 1],
            [0.8, 1, 0, 1],
            [0.8, 1, 0, 1],
    ],
    maxConnectionsCallback = function (info) {
        alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
    };
	
	$("#canvas").droppable({
		accept: '.icon-drag',
		containment: 'canvas',
		drop: function(e,ui){
			droppedElement = ui.helper.clone();
            
            $target = droppedElement.attr("data-target");
        
            $(droppedElement).removeAttr("class");
            
            if($target == "man")
                $(droppedElement).addClass("shape man");
            else if($target == "woman")
                $(droppedElement).addClass("shape woman");
            else if($target == "lesbian")
                $(droppedElement).addClass("shape lesbian");
            else if($target == "homosex")
                $(droppedElement).addClass("shape homosex");
            else if($target == "pregnancy")
                $(droppedElement).addClass("shape pregnancy");
            else if($target == "woman studied")
                $(droppedElement).addClass("shape woman studied");
            else if($target == "man studied")
                $(droppedElement).addClass("shape man studied");
            else
                $(droppedElement).addClass("shape");
            
			
			$(droppedElement).append("<span class='age'></span>");
			$(droppedElement).append("<span class='date'></span>");
			$(droppedElement).append("<span class='name'></span>");
			$(droppedElement).append("<span class='text'></span>");
			$(droppedElement).append("<button type='button' style='display: none'></button>");
			
			droppedElement.appendTo("#canvas").css({
			    "top": (e.pageY) -(parseInt($(".all").css("margin-top")) + 50 ) +"px",
			    "left": (e.pageX) - ($(".content.toolbox.row").width() + 40) +"px",
			});
			
            /*var _top = anchors[0];
            var _left = anchors[1];
            var _bottom = anchors[2];
            var _right = anchors[3];*/
            
			instance.draggable($(droppedElement),  {
               containment:true
            });
            
            
            $(droppedElement).resizable({ 
                handles: 'se, sw, nw',
                resize : function(event, ui) {     
                    instance.repaintEverything();
                },
                maxWidth:110, // gets set once, but doesn't update! WHY?
                minWidth:65,
                minHeight:65,
                maxHeight:110
            });

			instance.addEndpoint($(droppedElement), exampleEndpoint);
			instance.addEndpoint($(droppedElement), exampleEndpoint2);
			instance.addEndpoint($(droppedElement), exampleEndpoint3);
			instance.addEndpoint($(droppedElement), exampleEndpoint4);
            
		
			event_shape();
		}
	});
	
	var timeout = null;
	
	function event_shape(){
	    $(".shape").unbind("dblclick").dblclick(function(){
	        
            $("#settings_item").dialog( "open" );debugger
            delete_shape($(this));
            change_background($(this));
            text_shape($(this));
            resize_obj($(this));
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
        });
	}
	
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
	}
	
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
	
	function change_background(obj){
	    $("#txt_color_text").unbind("change").change(function(){
	        obj.css("background", "#" + $(this).val());
	    });
	    
	    $("#txt_date").unbind("change").change(function(){
	        obj.find('.date').text($("#txt_date").val());
	    });
	}
	
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
	
	function resize_obj(obj){
	    $("#txt_size_width").unbind('keyup').keyup(function(e){
	        if($(this).val() == ""){
	            obj.css("width", "65px");
	            obj.css("height", "62px");
	        }else if($(this).val().length < 4){
	            if(isNaN($(this).val()))
	                $(this).val("");
	            else
	                obj.css("width", $(this).val() + "px");
	        }else{
                $(this).val("");
	        }
	    });
	    
	    $("#txt_size_height").unbind('keyup').keyup(function(e){
	        if($(this).val() == ""){
	            obj.css("width", "65px");
	            obj.css("height", "62px");
	        }else if($(this).val().length < 4){
	            if(isNaN($(this).val()))
	                $(this).val("");
	            else
	                obj.css("height", $(this).val()+ "px");
	        }else{
                $(this).val("");
	        }
	    });
	}
	
	function theme_selector(){
	    $('.settings li').unbind("click").click(function(){
	        localStorage.setItem("theme", $(this).attr("theme"));
	        $('body').removeClass("theme_2 theme_3 theme_4").addClass($(this).attr("theme"));
	    });
	}
});


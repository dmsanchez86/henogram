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

$(document).ready(function(){
    
    if (typeof(FireShotAPI) != "undefined" && FireShotAPI.isAvailable()){
        $(".alert_i").hide();
        $(".alert_ok").show();
    }else{
        $(".alert_i").show();
        $(".alert_ok").hide();
    }
    
    
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
        $( "svg path" ).click(function() {console.error(":P");
          $( "#settings_path" ).dialog( "open" );
          console.log($(this));
          functions_path($(this));
        });
    },1000);
    
    function functions_path(path){
	    $('#btn_delete_path').unbind('click').click(function(){
	        path.parent().remove();
	        $( "#settings_path" ).dialog( "close" );
	    });
	    
	    $('#txt_size_path').unbind('change').change(function(){
	        console.log($(this).val());
	        
	        path.css('stroke-width', $(this).val()+"px");
	    });
	    
	    $('#txt_color_path').unbind('change').change(function(){
	        console.log($(this).val());
	        
	        path.css('stroke', $(this).val());
	    });
	}
});

jsPlumb.ready(function(e){
    
    theme_selector();
   
   $(".down_ico").click(function(e){
       var $html = $("#canvas").html();
       $(this).attr('download', 'example.html');
       $(this).attr('href', 'data:text/html;charset=UTF-8,' + $html);
   });
   
    $(".icon-selector").unbind("click").click(function(){
        $(".icon-selector").removeClass("selected");
        $(this).toggleClass("selected");
        $("#image_type").attr("src",$(this).attr("src") + "?ver=" + new Date()).parent().parent().removeClass('move');
        
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
	
   /*instance.bind("click", function(conn) {
    instance.detach(conn);
   });*/



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
        anchor:"LeftMiddle"
    };
    
    var exampleEndpoint2 = {
    	//connector:[ "TriangleWave", { spring:true, stub:[ 20, 20 ] } ],
       // endpoint:[ "Image", { src:"http://morrisonpitt.com/jsPlumb/img/endpointTest1.png" } ],
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
        /*connectorOverlays:[ 
            [ "Arrow", { width:25, length:25, location:1, id:"arrow" } ],
        ]*/
        isTarget: true,
        // beforeDrop: function (params) {
        //     return confirm("Vincular " + params.sourceId + " to " + params.targetId + "?");
        // },
        dropOptions: exampleDropOptions,
        anchor:"RightMiddle"
    };
    
    var exampleEndpoint3 = {
    	//connector:[ "TriangleWave", { spring:true, stub:[ 20, 20 ] } ],
        //endpoint:[ "Image", { src:"http://morrisonpitt.com/jsPlumb/img/endpointTest1.png" } ],
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
        anchor:"TopCenter"
    };
    
    var exampleEndpoint4 = {
    	//connector:[ "TriangleWave", { spring:true, stub:[ 20, 20 ] } ],
        //endpoint:[ "Image", { src:"http://morrisonpitt.com/jsPlumb/img/endpointTest1.png" } ],
        paintStyle: { width: 10, height: 8, fillStyle: exampleColor },
        EndpointStyle: { width: 5, height: 5},
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
    };

   /* var anchors = [
            [1, 1, 1, 1],
            [0.8, 1, 0, 1],
            [0, 0.8, -1, 0],
            [0.2, 0, 0, -1]
    ];*/
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
            else
                $(droppedElement).addClass("shape");
            
			
			$(droppedElement).append("<span class='age'></span>");
			$(droppedElement).append("<span class='date'></span>");
			
			droppedElement.appendTo("#canvas").css({
			    "top": (e.clientY - 100)+"px",
			    "left": (e.clientX - 400)+"px"
			});
			
            /*var _top = anchors[0];
            var _left = anchors[1];
            var _bottom = anchors[2];
            var _right = anchors[3];*/
            
			instance.draggable($(droppedElement), {
               containment:true
            });
            
            
            $(droppedElement).resizable({ 
                handles: 'se, sw, nw',
                resize : function(event, ui) {     
                    instance.repaintEverything();
                },
                maxWidth:200, // gets set once, but doesn't update! WHY?
                minWidth:62,
                minHeight:65,
                maxHeight:200
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
	    
	    $(".shape").unbind("click").click(function(){
            $("#settings_item").dialog( "open" );
            text_shape($(this));
            delete_shape($(this));
            change_background($(this));
            resize_obj($(this));
            die_obj($(this));
            
            if ($(this).attr("class").indexOf("die")!=-1){
                $("#chb_die").prop("checked", true);
                $("#txt_age").val($(this).find('.age').text()); 
                $("#txt_date").val($(this).find('.date').text());
                $("#txt_color_text").val($(this).css('background-color'));
            }else{
                if($(this).find('.date').text() != "" || $(this).find('.age').text() != ""){
                    $("#txt_age").val($(this).find('.age').text()); 
                    $("#txt_date").val($(this).find('.date').text());
                    $("#txt_color_text").val($(this).css('background-color'));
                }else{
                    $("#chb_die").prop("checked", false);
                    $("#txt_age, #txt_date").val("");
                    $("#txt_color_text").val($(this).css('background-color'));
                }
            }
        });
        
        $(".panel_options").unbind('mouseenter').mouseenter(function(){
            clearTimeout(timeout);
        }).unbind('mouseleave').mouseleave(function(){
            setTimeout(function(){
                $(".panel_options").removeClass("open");
            },500);
        });
	}
	
	function text_shape(obj){
	    $("#txt_age").unbind('keyup').keyup(function(e){
	        if($(this).val().length < 3){
	            if(isNaN($(this).val()))
	                $("#txt_age").val("");
	            else
	                obj.find('.age').text( $(this).val());
	        }
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
	        obj.css("background", $("#txt_color_text").val());
	    });
	    
	    $("#txt_date").unbind("change").change(function(){
	        obj.find('.date').text($("#txt_date").val());
	    });
	}
	
	function die_obj(obj){
	    $("#chb_die").unbind("change").change(function(){
	        obj.toggleClass("die");
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


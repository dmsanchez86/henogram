$(document).ready(function(){

	setTimeout(function(){ 
		$(".loader-app").fadeOut();
	}, 3000);
	

	
});

jsPlumb.ready(function(e){
	jsPlumb.setContainer($("#dropArea"));
	
	$(".icon-drag").draggable({
		helper: 'clone',
		appendTo: 'body',
    	scroll: false,
		cursor: 'move',
		tolerance: 'fit',
		revert: true
	});
	
	$("#dropArea").droppable({
		accept: '.icon-drag',
		containment: 'dropArea',
		drop: function(e,ui){
			droppedElement = ui.helper.clone();
			$(droppedElement).removeAttr("class");
			$(droppedElement).addClass("shape");
			droppedElement.appendTo("#dropArea");
			jsPlumb.draggable($(droppedElement));

		}
	});
	


	var e0 = jsPlumb.addEndpoint("one"),
		e1 = jsPlumb.addEndpoint("two");
	
    
    jsPlumb.draggable("one");
    jsPlumb.draggable("two");
	
	var endpointOptions = { isSource:true, isTarget:true };
});

//Declare Global varioables

var connectorCounter	=	1;
var connectorArray		=	[];

//Create the controller for Drag and Drop features
syncApp.controller('diagramCtrl', function ($scope,$http,$rootScope) {
	
	//EjDiagram functions
	$scope.connectorTargetChange 		= 	"connectorTargetChange";
	$scope.connectorSourceChange 		= 	"connectorSourceChange";
	$scope.connectorCollectionChange 	= 	"connectorCollectionChange";
	$scope.textChange 					= 	"textChange";
	$scope.nodeCounter					=	1;
	
	//Add Node to Diagram on click
	$scope.NodeAdd	=	function()
	{
		$scope.diagram 					=  	angular.element("#diagram").ejDiagram("instance");
		var ports 						= 	[{name:"port1",offset:{x:0,y: 0.5},shape: "circle"},{name:"port2",offset:{x: 1,y: 0.5},shape: "circle"},{name:"port3",offset:{x:0.5,y:0},shape: "circle"},{name:"port4",offset:{x:0.5,y:1},shape: "circle"}];
		var name						=	"Event"+$scope.nodeCounter;
		var label						=	[{text:name ,offset:{x: 0.5,y: 0.1 }}];
		$rootScope.IDValue				=	'Event'+$scope.nodeCounter;
		$scope.diagram.model.drawType 	= 	{ 
												type		: 	"html", 
												name 		:	name,
												templateId	: 	"htmlTemplate",
												labels		:	label,
												label		:	'HELLO',
												ports		:	ports,
												text		: 	name,
												value		:	{
																	select 		:	$rootScope.IDValue
																}
											};
		var tool 						= 	$scope.diagram.tool();
		$scope.diagram.update({ tool: tool | ej.datavisualization.Diagram.Tool.DrawOnce });
		$scope.NodeId					=	name;
		$scope.nodeCounter++;
	}
	
	//Add connector to diagram on click
	$scope.ConnectorAdd			=	function(){
		var diagram 			= 	angular.element("#diagram").ejDiagram("instance");
		var name				=	'Connector'+connectorCounter;
		diagram.model.drawType 	= 	{
										name		:	name, 
										type		: 	"connector",
										addInfo		:	{name:name},
										labels		:	[{text:''}]
									}
									
		var tool 				= 	diagram.tool();
		diagram.update({ tool: tool | ej.datavisualization.Diagram.Tool.DrawOnce })
		connectorCounter++;
		var connectorObj		=	new Object();
		connectorObj.Name		=	name;
		connectorArray.push(connectorObj);
	}
	
	//Create the event on click of the submit button 
	$scope.submitEvents			=	function(){
		AllEventFinalArray		=	[];
		$scope.outputElements 	= 	true;
		$scope.inputElements 	= 	false;
		
		for(var con=0; con<connectorArray.length; con++)
		{
			var ConnectorSource		=	connectorArray[con].SourceNode;
			var ConnectorTarget		=	connectorArray[con].TargetNode;
				
			for(var e=0; e<$rootScope.AllEventsArray.length; e++)
			{
				if($rootScope.AllEventsArray[e].NodeID == ConnectorSource)
				{
					if (!AllEventFinalArray.find(o => o.NodeName == ConnectorSource))
					{
						var NodeObj				=	new Object();
						NodeObj.NodeName		=	$rootScope.AllEventsArray[e].NodeID;
						NodeObj.Type			=	"Source";
						NodeObj.Count			=	connectorArray[con].Count;
						NodeObj.Childrens		=	[];
						NodeObj.FormData		=	$rootScope.AllEventsArray[e];
						
						for(var e2=0; e2<$rootScope.AllEventsArray.length; e2++)
						{							
							if($rootScope.AllEventsArray[e2].NodeID == ConnectorTarget)
							{									
								var NodeChildren			=	new Object();
								NodeChildren.ChildNodeName	=	$rootScope.AllEventsArray[e2].NodeID;
								NodeChildren.Count			=	connectorArray[con].Count;
								NodeChildren.FormData		=	$rootScope.AllEventsArray[e2];
								NodeChildren.ChildType		=	"Target";
								NodeObj.Childrens.push(NodeChildren);
															
							}
						}
						AllEventFinalArray.push(NodeObj);
					}
					else
					{
						var index 	=	 AllEventFinalArray.findIndex(x => x.NodeName === ConnectorSource);
						
						for(var e3=0; e3<$rootScope.AllEventsArray.length; e3++)
						{
							if($rootScope.AllEventsArray[e3].NodeID == ConnectorTarget)
							{
								if (!AllEventFinalArray[index].Childrens.find(o => o.ChildNodeName == ConnectorSource))
								{
									var NodeChildren				=	new Object();
									NodeChildren.ChildNodeName		=	$rootScope.AllEventsArray[e3].NodeID;
									NodeChildren.FormData			=	$rootScope.AllEventsArray[e3];
									NodeChildren.Count				=	connectorArray[con].Count;
									NodeChildren.ChildType			=	"Target";
									AllEventFinalArray[index].Childrens.push(NodeChildren);
								}
							}
						}
					}						
				}
			}		
		}
		
		//Find the last event that does not have any connector source
		for (var l = 0; l<$rootScope.AllEventsArray.length;l++)
		{
			var NodeName 	=	$rootScope.AllEventsArray[l].NodeID;
			
			if (!AllEventFinalArray.find(o => o.NodeName == NodeName))
			{
				var NodeObj				=	new Object();
				NodeObj.NodeName		=	$rootScope.AllEventsArray[l].NodeID;
				NodeObj.FormData		=	$rootScope.AllEventsArray[l];
				NodeObj.Type			=	"Source";
				NodeObj.Childrens		=	[];
				AllEventFinalArray.push(NodeObj);
			}
			
		}	
		
		AllEventFinalArray.sort((a, b) => (a.NodeName > b.NodeName) ? 1 : -1);		
		console.log(AllEventFinalArray);
		
		var data	=	JSON.stringify({AllEventFinalArray:AllEventFinalArray});
		$http({
			url		:	"/CreateConfiguredXML",
			headers	: 	{'Content-Type': 'application/json'},
			method	:	"POST",
			data	:	data
		}).success(function(response) {
			$scope.xmldata 	=	response[0].XML;
		}).error(function(error) {
			console.log(error);
		});	
	}
	
	//On click of Back button show the input data with EJ Diagram
	$scope.showInputData	=	function(){
		$scope.outputElements 		= 	false;
		$scope.inputElements 		= 	true;
	}

});

//Collector Collection  
function connectorCollectionChange(args)
{
	//On addition note the source and tatget	
	if(args.changeType	==	"insert" && args.state == "changed")
	{			
		for(var c=0; c<connectorArray.length; c++)
		{
			if(connectorArray[c].Name == args.element.addInfo.name)
			{
				connectorArray[c].SourceNode	=	args.element.sourceNode;
				connectorArray[c].TargetNode	=	args.element.targetNode;
				break;
			}
		}		
	}
	
	//on remove remove the Connector from array
	if(args.changeType	==	"remove" && args.state == "changed")
	{
		var connectorName	=	args.element.addInfo.name;
		for(var r=0; r<connectorArray.length; r++)
		{
			if(connectorArray[r].Name == connectorName)
			{
				connectorArray.splice(r,1)
				break;
			}
		}
	}
}
     
//Connector Source change	 
function connectorSourceChange(args)
{
	if(args.dragState == "completed" && args.element.sourceNode != null)
	{
		var connectorName	=	args.element.addInfo.name;
		for(var t=0; t<connectorArray.length; t++)
		{
			if(connectorArray[t].Name == connectorName)
			{
				connectorArray[t].SourceNode	=	args.element.sourceNode;
				connectorArray[t].TargetNode	=	args.element.targetNode;
				break;
			}
		}
	}
}

//Get the target Node on change of the Connector 
function connectorTargetChange(args)
{
	if(args.dragState == "completed" && args.element.targetNode != null)
	{
		var connectorName	=	args.element.addInfo.name;
		for(var t=0; t<connectorArray.length; t++)
		{
			if(connectorArray[t].Name == connectorName)
			{
				connectorArray[t].SourceNode	=	args.element.sourceNode;
				connectorArray[t].TargetNode	=	args.element.targetNode;
				break;
			}
		}
	}
}

//Get the text for the connector after adding the count
function textChange(args) {
	
	if(args.elementType === "connector") {
		
		var connectorName	=	args.element.addInfo.name;
		
		for(var t=0; t<connectorArray.length; t++)
		{
			if(connectorArray[t].Name == connectorName)
			{
				connectorArray[t].Count		=	args.value;
				break;
			}
		}
	}
}
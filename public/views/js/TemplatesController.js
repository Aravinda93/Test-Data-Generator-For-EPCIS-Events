//Declare Global varioables

var connectorCounter	=	1;
var connectorArray		=	[];

//Create the controller for Drag and Drop features
syncApp.controller('diagramCtrl', function ($scope,$http,$rootScope,$copyToClipboard) {
	
	//EjDiagram functions
	$scope.connectorTargetChange 		= 	"connectorTargetChange";
	$scope.connectorSourceChange 		= 	"connectorSourceChange";
	$scope.connectorCollectionChange 	= 	"connectorCollectionChange";
	$scope.textChange 					= 	"textChange";
	$scope.nodeCounter					=	1;
	
	//Export the Nodes in the digaram
	$scope.ExportDiagram	=	function(){
		var diagram 		=  	angular.element("#diagram").ejDiagram("instance");
		var options 		= 	{
									fileName	:	"EventsDiagram",
									mode		: 	ej.datavisualization.Diagram.ExportModes.Download,
									format		: 	ej.datavisualization.Diagram.FileFormats.SVG,
									stretch		: 	"fill",
									margin		: 
													{
														left	: 30,
														right	: 30,
														top		: 30,
														bottom	: 30
													},
								};
		diagram.exportDiagram(options);
	}
	
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
												ports		:	ports,
												value		:	{
																	select 		:	$rootScope.IDValue
																}
											};
		var tool 						= 	$scope.diagram.tool();
		$scope.diagram.update({ tool: tool | ej.datavisualization.Diagram.Tool.DrawOnce });
		$scope.NodeId					=	name;
		$scope.nodeCounter++;
	}
	
	//Delete the Event info from Array if node is removed from diagram
	$scope.nodeCollectionChange			=	function(args){
		if(args.state == "changed" && args.changeType == "remove")
		{
			var removedNode		=	args.element.name;
			for(var r=0; r<$rootScope.AllEventsArray.length; r++)
			{
				var ArrayNodeId	=	$rootScope.AllEventsArray[r].NodeID;
				if(ArrayNodeId	==	removedNode)
				{
					$rootScope.AllEventsArray.splice(r,1);
					break;
				}
			}
		}
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
		diagram.update({ tool: tool | ej.datavisualization.Diagram.Tool.DrawOnce})
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
		var LastCounter			=	0;
		var ParentEPCsArray		=	[];		
		
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
						NodeObj.QuantityCount	=	connectorArray[con].QuantityCount;
						NodeObj.Childrens		=	[];
						NodeObj.FormData		=	$rootScope.AllEventsArray[e];
						
						//Find the child nodes
						for(var e2=0; e2<$rootScope.AllEventsArray.length; e2++)
						{							
							if($rootScope.AllEventsArray[e2].NodeID == ConnectorTarget)
							{	
								var NodeChildren			=	new Object();
								NodeChildren.ChildNodeName	=	$rootScope.AllEventsArray[e2].NodeID;
								NodeChildren.Count			=	connectorArray[con].Count;
								NodeChildren.QuantityCount	=	connectorArray[con].QuantityCount;
								NodeChildren.ChildType		=	"Target";								
								NodeChildren.FormData		=	$rootScope.AllEventsArray[e2];
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
									NodeChildren.Count				=	connectorArray[con].Count;
									NodeChildren.QuantityCount		=	connectorArray[con].QuantityCount;
									NodeChildren.ChildType			=	"Target";
									NodeChildren.FormData			=	$rootScope.AllEventsArray[e3];
									AllEventFinalArray[index].Childrens.push(NodeChildren);
								}
							}
						}
					}						
				}
			}

			//Find the last event that does not have any connector source
			if(con == connectorArray.length-1)
			{
				for (var l = 0; l<$rootScope.AllEventsArray.length;l++)
				{
					var NodeName 	=	$rootScope.AllEventsArray[l].NodeID;
					
					if (!AllEventFinalArray.find(o => o.NodeName == NodeName))
					{						
						var NodeObj				=	new Object();
						NodeObj.NodeName		=	$rootScope.AllEventsArray[l].NodeID;
						NodeObj.FormData		=	$rootScope.AllEventsArray[l];
						NodeObj.Count			=	connectorArray[con].Count;
						NodeObj.QuantityCount	=	connectorArray[con].QuantityCount;
						NodeObj.Type			=	"Source";
						NodeObj.Childrens		=	[];
						AllEventFinalArray.push(NodeObj);
					}
					
				}
			}
		}
		
		//Sort the events based on the name
		//AllEventFinalArray.sort((a, b) => (a.NodeName > b.NodeName) ? 1 : -1);		
		console.log(AllEventFinalArray);
		
		//Check if the Child count matches the parent Count
		for(var parentCount=0; parentCount<AllEventFinalArray.length; parentCount++)
		{
			var TotalParentEPCCount			=	parseInt(AllEventFinalArray[parentCount].Count, 10);
			var TotalParentQuantityCount	=	parseInt(AllEventFinalArray[parentCount].QuantityCount, 10);
			var TotalChildEPCCount			=	0;
			var TotalChildQuantityCount		=	0;
			
			for(var childCount=0; childCount<AllEventFinalArray[parentCount].Childrens.length; childCount++)
			{
				TotalChildEPCCount			=	TotalChildEPCCount		+ parseInt(AllEventFinalArray[parentCount].Childrens[childCount].Count, 10);
				TotalChildQuantityCount		=	TotalChildQuantityCount	+ parseInt(AllEventFinalArray[parentCount].Childrens[childCount].QuantityCount, 10);;
			}
			
			if(TotalParentEPCCount != TotalChildEPCCount || TotalParentQuantityCount != TotalChildQuantityCount)
			{
				console.log("Some Child Quantities/EPCs do not match: "+AllEventFinalArray[parentCount].NodeName)
				//alertify.alert(" Error during the split ",' Please check the count provided for EPCs/Quantities');
			}
			else
			{
				console.log("Eveything is correct");
				
			}
		}

		var data	=	JSON.stringify({AllEventFinalArray:AllEventFinalArray});
		$http({
			url		:	"/CreateConfiguredXML",
			headers	: 	{'Content-Type': 'application/json'},
			method	:	"POST",
			data	:	data
		}).success(function(response) {
			$scope.xmldata 		=	response[0].XML;			
			$scope.jsondata 	= 	response[1].JSON;			
		}).error(function(error) {
			console.log(error);
		});		
	}
	
	//On click of Back button show the input data with EJ Diagram
	$scope.showInputData	=	function(){
		$scope.outputElements 		= 	false;
		$scope.inputElements 		= 	true;
	}
	
	//Copy to Clipboard the XML and JSON data
	$scope.copytoclipboard = function(toCopy){
		if(toCopy == 'XML')
		{
			$copyToClipboard.copy($scope.xmldata).then(function(){
				alertify.alert(" Test Data Generator ",toCopy + ' content copied to clipboard');
			});
		}
		else if(toCopy == 'JSON')
		{
			$copyToClipboard.copy($scope.jsondata).then(function(){
				alertify.alert(" Test Data Generator ",toCopy + ' content copied to clipboard');
			});
		}
	}
		
	//Export the contents of XML to text file
	$scope.ExportData	=	function(Content, type)
	{
		var DateTime	= 	new Date().toISOString().replace('Z', ' ').replace('T', ' ');
		
		if(type == 'XML')
		{
			var FileName	=	"EPCIS_Events_"+DateTime+".xml";
			var blob 		= 	new Blob([Content], {type: "text/xml"});
			
			if (window.navigator && window.navigator.msSaveOrOpenBlob)
			{
				window.navigator.msSaveOrOpenBlob(blob, FileName);
			}
			else
			{
				var e 					= 	document.createEvent('MouseEvents'),
				a						= 	document.createElement('a');
				a.download 				= 	FileName;
				a.href 					= 	window.URL.createObjectURL(blob);
				a.dataset.downloadurl 	= 	['text/json', a.download, a.href].join(':');
				e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
			}			
		}
		else if(type == 'JSON')
		{
			var FileName	=	"EPCIS_Events_"+DateTime+".json";			
			var blob		= 	new Blob([Content], {type: "text/json"});
			
			if (window.navigator && window.navigator.msSaveOrOpenBlob)
			{
				window.navigator.msSaveOrOpenBlob(blob, FileName);
			}
			else
			{
				var e 					= 	document.createEvent('MouseEvents'),
				a						= 	document.createElement('a');
				a.download 				= 	FileName;
				a.href 					= 	window.URL.createObjectURL(blob);
				a.dataset.downloadurl 	= 	['text/json', a.download, a.href].join(':');
				e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
			}
		}		
	}

});

//Collector Collection  
function connectorCollectionChange(args)
{
	//On addition note the source and tatget	
	if(args.changeType	==	"insert" && args.state == "changed")
	{
		//Show the labels to the user
		var connectorName	=	args.element.addInfo.name;
		var diagram 		= 	$("#diagram").ejDiagram("instance");
        var connector 		= 	diagram.selectionList[0];
        diagram.insertLabel(connector.name, {name: "EPCsCount", 		fontColor:"red", 		text:"EPCs", 		alignment: "before",	segmentOffset: 0.1}, 0);
        diagram.insertLabel(connector.name, {name: "QuantitiesCount", 	fontColor:"green", 		text:"Quantity", 	alignment: "after", 	segmentOffset: 0.7}, 1);
       
	   
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
	
	if(args.elementType === "connector")
	{		
		var connectorName	=	args.element.addInfo.name;
		var EPCsCount, QuantitiesCount;
		
		//Check which Label got edited of the connector
		if(args.label.name == 'EPCsCount')
		{
			for(var t=0; t<connectorArray.length; t++)
			{
				if(connectorArray[t].Name == connectorName)
				{
					connectorArray[t].Count			=	args.value;
					break;
				}
			}
		}
		else if(args.label.name == 'QuantitiesCount')
		{			
			for(var t=0; t<connectorArray.length; t++)
			{
				if(connectorArray[t].Name == connectorName)
				{
					connectorArray[t].QuantityCount	=	args.value;
					break;
				}
			}
		}
		
		console.log(connectorArray)
	}
}
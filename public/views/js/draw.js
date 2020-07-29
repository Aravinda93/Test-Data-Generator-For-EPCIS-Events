var syncApp = angular.module("syncApp", ["ejangular"]);
var businessSteps		=	[];
var AllEventArray		=	[];
var count 				= 	0;
var connectorCounter	=	1;
var connectorArray		=	[];
//var nodeCounter		=	1;
//var node 				= 	{};

syncApp.controller('diagramCtrl', function ($scope,$http) { 

	//$scope.collectionChange 			= "collectionChanged";
	//$scope.selectionChange 			= "selectionChange";
	$scope.connectionChange				= "connectionChange";	
	$scope.connectorTargetChange 		= "connectorTargetChange";
	$scope.connectorSourceChange 		= "connectorSourceChange";
	$scope.connectorCollectionChange 	= "connectorCollectionChange";
	var node 							= 	{};
	var nodeCounter						=	1;

	//Get the values for BusinessStep
	$scope.init 	=	function () {
		$http({
		url: "/populateFields",
		method: "GET"
		}).success(function(response) {
		$scope.businessSteps 		=	response.businessStep;
		businessSteps				=	$scope.businessSteps;

		}).error(function(error) {
		console.log(error);
		});
	}
	
	//Node Collection  
	$scope.collectionChange		=	function(args){
		console.log("NODE COLLECTION CHANGE");
	}
	
	$scope.selectionChange 	=	function(args)
	{
		console.log("SELECTION CHANGE");
		if(args.state === 'changing' && args.changeType === 'remove')
		{
			node =  args.oldItems[0];
		}
		else if (args.state === 'changed' && args.changeType === 'remove')
		{
			var fieldValue	=	node.value.text;
			console.log(fieldValue);
			console.log($scope.fieldValue)
			node.addInfo.value 			= 	document.getElementById(node.value.text).value;
			var OptionsField			= 	document.getElementById(node.value.select);
			var OptionValue		 		= 	OptionsField.options[OptionsField.selectedIndex].value;
			node.addInfo.BusinessStep	=	OptionValue;
		}
	}
	
	//Add Connector to ejDiagram
	$scope.ConnectorAdd		=	function()
	{
		var diagram 			= 	$("#diagram").ejDiagram("instance");
		var name				=	'Connector'+connectorCounter;
		diagram.model.drawType 	= 	{name:name, type: "connector",addInfo:{name:name}};
		var tool 				= 	diagram.tool();
		diagram.update({ tool: tool | ej.datavisualization.Diagram.Tool.DrawOnce })
		connectorCounter++;
		var connectorObj		=	new Object();
		connectorObj.Name		=	name;
		connectorArray.push(connectorObj);
	}
	
	//Add NODE to ejDiagram
	$scope.NodeAdd			=	function()
	{
		var diagram 			= 	$("#diagram").ejDiagram("instance");
		var ports 				= 	[{name:"port1",offset:{x:0,y: 0.5},shape: "circle"},{name:"port2",offset:{x: 1,y: 0.5},shape: "circle"},{name:"port3",offset:{x:0.5,y:0},shape: "circle"},{name:"port4",offset:{x:0.5,y:1},shape: "circle"}];
		var name				=	"Event"+nodeCounter;
		var label				=	[{text:name ,offset:{x: 0.5,y: 0.1 }}];
		diagram.model.drawType 	= 	{ 
										type		: 	"html", 
										name 		:	name,
										templateId	: 	"htmlTemplate",
										labels		:	label,
										ports		:	ports,
										value		:	{
															text	:	"text"+Number(nodeCounter),
															select	:	"select"+Number(nodeCounter)
														}
									};
		var tool 				= diagram.tool();
		diagram.update({ tool: tool | ej.datavisualization.Diagram.Tool.DrawOnce });
		nodeCounter++;
	}

});
      
//var node 				= 	{};
var count 				= 	0;
var connectorCounter	=	1;
//var nodeCounter			=	1;
var connectorArray		=	[];

/*
//Call the function on click of the diagram
function selectionChange(args) {
	console.log("SELECTION CHANGE");
	if(args.state === 'changing' && args.changeType === 'remove')
	{
		node =  args.oldItems[0];
	}
	else if (args.state === 'changed' && args.changeType === 'remove')
	{	
		node.addInfo.value 			= 	document.getElementById(node.value.text).value;
		var OptionsField			= 	document.getElementById(node.value.select);
		var OptionValue		 		= 	OptionsField.options[OptionsField.selectedIndex].value;
		node.addInfo.BusinessStep	=	OptionValue;
	}
}
*/

document.getElementById('values').onclick = function() {
	var AllEventArray	=	[];
	var diagram 		=	 $("#diagram").ejDiagram("instance");
	
	for(var con=0; con<connectorArray.length; con++)
	{
		var ConnectorSource		=	connectorArray[con].SourceNode;
		var ConnectorTarget		=	connectorArray[con].TargetNode;
		
		for (var p = 0;p<diagram.model.nodes.length;p++)
		{
			if(diagram.model.nodes[p].name == ConnectorSource)
			{
				if (!AllEventArray.find(o => o.NodeName == ConnectorSource))
				{
					var NodeObj				=	new Object();
					NodeObj.NodeName		=	diagram.model.nodes[p].name;
					NodeObj.EventCount		=	diagram.model.nodes[p].addInfo.value;
					NodeObj.BusinessStep	=	diagram.model.nodes[p].addInfo.BusinessStep;
					NodeObj.Type			=	"Source";
					NodeObj.Childrens		=	[];
					
					for(var c2=0; c2<diagram.model.nodes.length; c2++)
					{
						if(diagram.model.nodes[c2].name == ConnectorTarget)
						{
							var NodeChildren				=	new Object();
							NodeChildren.ChildNodeName		=	diagram.model.nodes[c2].name;
							NodeChildren.ChildEventCount	=	diagram.model.nodes[c2].addInfo.value;
							NodeChildren.ChildBusinessStep	=	diagram.model.nodes[c2].addInfo.BusinessStep;
							NodeChildren.ChildType			=	"Target";
							NodeObj.Childrens.push(NodeChildren)
							AllEventArray.push(NodeObj);
						}
					}					
				}
				else
				{
					var index 	=	 AllEventArray.findIndex(x => x.NodeName === ConnectorSource);
					
					for(var c3=0; c3<diagram.model.nodes.length; c3++)
					{
						if(diagram.model.nodes[c3].name == ConnectorTarget)
						{
							if (!AllEventArray[index].Childrens.find(o => o.ChildNodeName == ConnectorSource))
							{
								var NodeChildren				=	new Object();
								NodeChildren.ChildNodeName		=	diagram.model.nodes[c3].name;
								NodeChildren.ChildEventCount	=	diagram.model.nodes[c3].addInfo.value;
								NodeChildren.ChildBusinessStep	=	diagram.model.nodes[c3].addInfo.BusinessStep;
								NodeChildren.ChildType			=	"Target";
								AllEventArray[index].Childrens.push(NodeChildren);
							}
						}
					}
				}
			}
		}
	}
	//Find the last event that does not have any connector source
	for (var l = 0; l<diagram.model.nodes.length;l++)
	{
		var NodeName 	=	diagram.model.nodes[l].name;
		
		if (!AllEventArray.find(o => o.NodeName == NodeName))
		{
			var NodeObj				=	new Object();
			NodeObj.NodeName		=	diagram.model.nodes[l].name;
			NodeObj.EventCount		=	diagram.model.nodes[l].addInfo.value;
			NodeObj.BusinessStep	=	diagram.model.nodes[l].addInfo.BusinessStep;
			NodeObj.Type			=	"Source";
			NodeObj.Childrens		=	[];
			AllEventArray.push(NodeObj);
		}
		
	}	
	console.log(AllEventArray);
}

//Collector Collection  
function connectorCollectionChange(args)
{
	console.log("CONNECTOR COLLECTION CHANGE");
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

/*   
//Add a new Connector on user click
document.getElementById('add').onclick = function() {
	var diagram 			= 	$("#diagram").ejDiagram("instance");
	var name				=	'Connector'+connectorCounter;
	diagram.model.drawType 	= 	{name:name, type: "connector",addInfo:{name:name}};
	var tool 				= 	diagram.tool();
	diagram.update({ tool: tool | ej.datavisualization.Diagram.Tool.DrawOnce })
	connectorCounter++;
	var connectorObj		=	new Object();
	connectorObj.Name		=	name;
	connectorArray.push(connectorObj);
}
 

document.getElementById('addNode').onclick = function() {
	var diagram 			= $("#diagram").ejDiagram("instance");
	var ports 				= 	[{name:"port1",offset:{x:0,y: 0.5},shape: "circle"},{name:"port2",offset:{x: 1,y: 0.5},shape: "circle"},{name:"port3",offset:{x:0.5,y:0},shape: "circle"},{name:"port4",offset:{x:0.5,y:1},shape: "circle"}];
	var name				=	"Event"+nodeCounter;
	var label				=	[{text:name ,offset:{x: 0.5,y: 0.1 }}];
	diagram.model.drawType 	= 	{ 
									type		: 	"html", 
									name 		:	name,
									templateId	: 	"htmlTemplate",
									labels		:	label,
									ports		:	ports,
									value		:	{
														text	:	"text"+Number(nodeCounter),
														select	:	"select"+Number(nodeCounter)
													}
								};
	var tool 				= diagram.tool();
	diagram.update({ tool: tool | ej.datavisualization.Diagram.Tool.DrawOnce });
	nodeCounter++;
}

/*
//Node Collection  
function collectionChanged(args) {
	console.log("NODE COLLECTION CHANGE");
}

*/

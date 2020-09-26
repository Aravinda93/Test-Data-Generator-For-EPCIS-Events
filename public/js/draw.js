var syncApp 			= 	angular.module("syncApp", ["ejangular"]);
var businessSteps		=	[];
var AllEventArray		=	[];
var node 				= 	{};
var connectorCounter	=	1;
var nodeCounter			=	1;
var connectorArray		=	[];

syncApp.controller('diagramCtrl', function ($scope,$http) { 

	$scope.collectionChange 			= "collectionChanged";
	$scope.connectionChange				= "connectionChange";
	$scope.selectionChange 				= "selectionChange";
	$scope.connectorTargetChange 		= "connectorTargetChange";
	$scope.connectorSourceChange 		= "connectorSourceChange";
	$scope.connectorCollectionChange 	= "connectorCollectionChange";
	
	/*
	$scope.NodeAdd	=	function()
	{
		$scope.diagram 			=  	angular.element("#diagram").ejDiagram("instance");
		var ports 				= 	[{name:"port1",offset:{x:0,y: 0.5},shape: "circle"},{name:"port2",offset:{x: 1,y: 0.5},shape: "circle"},{name:"port3",offset:{x:0.5,y:0},shape: "circle"},{name:"port4",offset:{x:0.5,y:1},shape: "circle"}];
		var name				=	"Event"+nodeCounter;
		var label				=	[{text:name ,offset:{x: 0.5,y: 0.1 }}];
		$scope.diagram .model.drawType 	= 	{ 
												type		: 	"html", 
												name 		:	name,
												templateId	: 	"htmlTemplate",
												labels		:	label,
												ports		:	ports,
												value		:	{
																	text	:	"text"+Number(nodeCounter),
																	select	:	"BusinessStep"+Number(nodeCounter)
																}
											};
		var tool 				= $scope.diagram.tool();
		$scope.diagram.update({ tool: tool | ej.datavisualization.Diagram.Tool.DrawOnce });
		nodeCounter++;
	}	
	
	//On change of the text field get the value
	$scope.change	=	function(){
		console.log('Within Text Change');
		var diagram 		= 	angular.element("#diagram").ejDiagram("instance"); 
		var node 			= 	diagram.selectionList[0];
		var text 			= 	diagram.model.drawType.value.text; 
		node.addInfo.value 	= 	text;
		console.log(node);
	}
	
	//on change of the Select fied get the values and populate in Node addinfo
	$scope.SelectField		=	function(){
		console.log('Within Select Change');
		var diagram 		= 	angular.element("#diagram").ejDiagram("instance"); 
		var node 			= 	diagram.selectionList[0];
		var select 			= 	diagram.model.drawType.value.select; 
		node.addInfo.value 	= 	select;
		console.log(node);
	}*/

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
	
	$scope.submitEvents		=	function()
	{
		AllEventArray		=	[];
		var diagram 		=	$("#diagram").ejDiagram("instance");
		
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
		
		AllEventArray.sort((a, b) => (a.NodeName > b.NodeName) ? 1 : -1)
		console.log(AllEventArray);
		/*var verifierCount	=	0;
		//Make sure that count of events in each child is equal to parent event count
		for(var v=0; v<AllEventArray.length; v++)
		{
			var parentCount	=	parseInt(AllEventArray[v].EventCount);
			var childCount	=	0;
			console.log(AllEventArray[v].NodeName)
			if(AllEventArray[v].Childrens.length > 0)
			{				
				for(var c=0; c<AllEventArray[v].Childrens.length; c++)
				{
					childCount	=	childCount + parseInt(AllEventArray[v].Childrens[c].ChildEventCount);
				}
				console.log(parentCount);
				console.log(childCount);
				if(childCount != parentCount)
				{
					verifierCount = verifierCount + 1;
					alertify.alert('Child Event Count Does not match for Event: '+ AllEventArray[v].NodeName);
				}
			}
		}*/
		
		//Call the function to create events	
		
		//Call the Nodejs function and create the events
		var data	=	JSON.stringify({AllEventArray:AllEventArray});
		$http({
			url		:	"/DrawFieldsData",
			headers	: 	{'Content-Type': 'application/json'},
			method	:	"POST",
			data	:	data
		}).success(function(response) {
			$scope.drawXMLData 	=	response[0].XML;
		}).error(function(error) {
			console.log(error);
		});	
		
	}
	
	//Export the diagram
	$scope.ExportDiagram	=	function(){
		console.log("WITHIN EXPORT FUNCTION")
		var diagram 	= 	angular.element("#diagram").ejDiagram("instance");
		var options 	= 	{
								fileName	:	"Test Data Generator",
								margin		: 	{
													left: 30,
													right: 30,
													top: 30,
													bottom: 30
												},
								mode		: 	ej.datavisualization.Diagram.ExportModes.Download,
								format		: 	ej.datavisualization.Diagram.FileFormats.SVG,
								stretch		: 	"fill",
								multiplePage: 	false
							}
		diagram.exportDiagram(options);
	}
	

});


//Call the function on click of the diagram
function selectionChange(args)
{
	if(args.state === 'changing' && args.changeType === 'remove')
	{
		node =  args.oldItems[0];
	}
	else if (args.state === 'changed' && args.changeType === 'remove')
	{	
		//node.addInfo.value 			= 	document.getElementById(node.value.text).value;
		//var OptionsField			= 	document.getElementById(node.value.select);
		//var OptionValue		 		= 	OptionsField.options[OptionsField.selectedIndex].value;
		//node.addInfo.BusinessStep	=	OptionValue;
		node.addInfo.EventName		=	"Event"+nodeCounter;
	}
}


//Fetch the value on change of Event count
function change() 
{ 
	var diagram 		= 	$("#diagram").ejDiagram("instance"); 
	var node 			= 	diagram.selectionList[0]; 
	var text 			= 	document.getElementById(node.value.text).value; 
	node.addInfo.value 	= 	text;
} 

//on change of the Select fied of BusinessStep get the values and populate in Node addinfo
document.addEventListener('input', function (event){
	if(!event.target.id.includes("BusinessStep")) 
		return;
	var diagram 				= 	$("#diagram").ejDiagram("instance"); 
	var OptionsField			= 	document.getElementById(event.target.id);
	var OptionValue				= 	OptionsField.options[OptionsField.selectedIndex].value;
	var node 					= 	diagram.selectionList[0]; 
	node.addInfo.BusinessStep	=	OptionValue;
}, false);

//On Drag and Drop add the NODE to the diagram
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
														select	:	"BusinessStep"+Number(nodeCounter)
													}
								};
	var tool 				= diagram.tool();
	diagram.update({ tool: tool | ej.datavisualization.Diagram.Tool.DrawOnce });
	nodeCounter++;
}


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
 
       
//Node Collection  
function collectionChanged(args) {
}

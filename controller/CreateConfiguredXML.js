var builder 			=	require('xmlbuilder');
var moment 				= 	require('moment-timezone');
var moment 				= 	require('moment');
var xml_json_functions	=	require('./XML_JSON_Functions');
const createXML			=	require('./createXML');
const createJSON		=	require("./createJSON");

exports.createXML	=	function(AllData,callback){
	var currentTime 	=	moment().format();
	var File 			=	'XML';
	var RecordTimeArray	=	[];
	var EventTimeArray	=	[];
	var ErrorTimeArray	=	[];
	var AddedEvents		=	[];
	var GlobalCount		=	0;
	var FinalXML		=	"";
	var FinalJSON		=	"";
	var itemProcessed	=	0;
	var AllEventsArray	=	AllData.AllEventFinalArray;	
	
	//Create the initial strucutre for the JSON data
	var JSONHeader		=	{
								"@context"		: 	"https://id.gs1.org/epcis-context.jsonld",
								"isA"			:	"EPCISDocument",
								"creationDate"	:	currentTime,
								"schemaVersion"	: 	2.0,
								"format"		: 	"application/ld+json",
								"epcisBody"		:	{}
							}
	
	//Create the header for XML	
	var root			= 	builder.create('epcis:EPCISDocument')
								root.att('xmlns:epcis', "urn:epcglobal:epcis:xsd:1")
								root.att('xmlns:gs1', "https://gs1.de")
								root.att('schemaVersion', "2.0")
								root.att('creationDate', currentTime)
	
	//Main loop based on the number of events/nodes in drag and drop
	for(var parent=0; parent<AllEventsArray.length; parent++)
	{
		var LastCounter			=	0;
		var QuantityLastCount	=	0;
		var EPCsArray			=	[];
		var QuantityArray		=	[];
		var ParentIDArray		=	[];
		var ParentData			=	AllEventsArray[parent];
		var OuterParentName		=	ParentData.NodeName;
		var ParentEventType		=	AllEventsArray[parent].FormData.input.eventtype1;
		
		for(var child=0; child<AllEventsArray[parent].Childrens.length; child++)
		{
			var ChildData		=	AllEventsArray[parent].Childrens[child];
			var ChildNodeName	=	ChildData.ChildNodeName;
			var EndCount		=	parseInt(AllEventsArray[parent].Childrens[child].Count);
			var EndQuantityCount=	parseInt(AllEventsArray[parent].Childrens[child].QuantityCount);
			var ChildEventType	=	AllEventsArray[parent].Childrens[child].FormData.input.eventtype1;
			
			//Check if the Child EPCs value is empty
			if(ChildData.FormData.EPCs.length == 0 && ParentData.FormData.EPCs.length > 0)
			{
				EPCsArray	=	ParentData.FormData.EPCs[0].slice(LastCounter,LastCounter+EndCount);
				ChildData.FormData.EPCs.push(EPCsArray)
				LastCounter	=	LastCounter + EndCount;	
							
				//Write the respective children data into the parent of same node
				for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
				{
					var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
					
					if(ChildNodeName	==	ParentNodeName)
					{
						if(AllEventsArray[ParentNode].FormData.EPCs.length == 0)
						{
							AllEventsArray[ParentNode].FormData.EPCs.push(EPCsArray);
						}
						else
						{
							AllEventsArray[ParentNode].FormData.EPCs[0].push.apply(AllEventsArray[ParentNode].FormData.EPCs[0],EPCsArray);
						}							
					}					
				}
			}
			
			//Check if the Quantity elements of the Children are empty
			if(ChildData.FormData.Quantities.length == 0 && ParentData.FormData.Quantities.length > 0)
			{
				QuantityArray	=	ParentData.FormData.Quantities[0].slice(QuantityLastCount,QuantityLastCount+EndQuantityCount);
				ChildData.FormData.Quantities.push(QuantityArray);
				QuantityLastCount	=	QuantityLastCount + EndQuantityCount;
				
				//Write the respective children data into the parent of same node
				for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
				{
					var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
					
					if(ChildNodeName	==	ParentNodeName)
					{
						if(AllEventsArray[ParentNode].FormData.Quantities.length == 0)
						{
							AllEventsArray[ParentNode].FormData.Quantities.push(QuantityArray);
						}
						else
						{
							AllEventsArray[ParentNode].FormData.Quantities[0].push.apply(AllEventsArray[ParentNode].FormData.Quantities[0],QuantityArray);
						}							
					}					
				}
			}
			
			//Check if ParentID of Child EPCS is empty for Association,Aggreagation and Transaction event
			if(ChildEventType == 'AggregationEvent' || ChildEventType == 'TransactionEvent' || ChildEventType == 'AssociationEvent')
			{
				//Check if the parent of the Event is Association,Aggreagation and Transaction event
				if(ParentEventType == 'AggregationEvent' || ParentEventType == 'TransactionEvent' || ParentEventType == 'AssociationEvent')
				{
					//Check if child Parent ID value is 0
					if(ChildData.FormData.ParentID.length == 0 && ParentData.FormData.ParentID.length != 0)
					{	
						ParentIDArray	=	ParentData.FormData.ParentID[0];
						ChildData.FormData.ParentID.push(ParentIDArray);
						
						//find the parent of the respective child and write the data into the same
						for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
						{
							var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
							
							if(ChildNodeName	==	ParentNodeName)
							{
								if(AllEventsArray[ParentNode].FormData.ParentID.length == 0)
								{
									AllEventsArray[ParentNode].FormData.ParentID.push(ParentIDArray);
								}
								else
								{
									AllEventsArray[ParentNode].FormData.ParentID[0].push.apply(AllEventsArray[ParentNode].FormData.ParentID[0],ParentIDArray);
								}							
							}					
						}
					}
				}			
			}
		}
	}

	//Loop through the the created array and create the XML
	for(var parent=0; parent<AllEventsArray.length; parent++)
	{
		XMLCreator(AllData, parent, 'Parent');
	
		//Loop through children for(var child=0; child<)
		for(child=0; child<AllData.AllEventFinalArray[parent].Childrens.length; child++)
		{
			XMLCreator(AllData, child, 'Child', parent);
		}
		
		//After all the loop has been completed then return the XML data to Text Area
		itemProcessed++;
		
		if(itemProcessed == AllEventsArray.length)
		{
			var Returndata 	=	[];
			Returndata.push({'XML':FinalXML});
			Returndata.push({'JSON':FinalJSON});
			callback(Returndata);
		}
	}
	
	function XMLCreator(AllData, loopcounter, type,parentCount)
	{
		var NodeName, EventCount, Query, input;		
		
		//Get the values of parent
		if(type == 'Parent')
		{
			NodeName	=	AllData.AllEventFinalArray[loopcounter].NodeName;
			EventCount	=	AllData.AllEventFinalArray[loopcounter].FormData.input.eventcount;
			Query		=	AllData.AllEventFinalArray[loopcounter].FormData;
			input		=	AllData.AllEventFinalArray[loopcounter].FormData.input;
		}
		else if(type == 'Child')
		{
			NodeName	=	AllData.AllEventFinalArray[parentCount].Childrens[loopcounter].ChildNodeName;
			EventCount	=	AllData.AllEventFinalArray[parentCount].Childrens[loopcounter].FormData.input.eventcount;
			input		=	AllData.AllEventFinalArray[parentCount].Childrens[loopcounter].FormData.input;
			//var Query		=	AllData.AllEventFinalArray[parentCount].Childrens[loopcounter].FormData;
			
			for(var ParentFinder=0; ParentFinder<AllData.AllEventFinalArray.length; ParentFinder++)
			{
				if(AllData.AllEventFinalArray[ParentFinder].NodeName == NodeName)
				{
					Query	=	AllData.AllEventFinalArray[ParentFinder].FormData;
					break;
				}
			}
		}
		
		//Check if the Node is already added to XML
		if(AddedEvents.includes(NodeName))
			return;
		
		//If not then add to Array and create XML
		AddedEvents.push(NodeName);
		
		//Call create XML function to create the XML
		createXML.createXMLData(Query,root,function(data){
			//FinalXML	=	FinalXML.concat(data);
			FinalXML	=	data;
		});
		
		//Call createJSON function to create JSON
		createJSON.createJSONData(Query,JSONHeader,function(JSONdata){
			FinalJSON	=	FinalJSON.concat(JSONdata);
			//FinalJSON = JSONdata;
		});
	}
}
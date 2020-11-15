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
	
	JSONHeader.epcisBody['eventList'] 	= 	[];
	
	//Create the header for XML	
	var root		= 	builder.create('epcis:EPCISDocument')
								root.att('xmlns:epcis', "urn:epcglobal:epcis:xsd:1")
								root.att('schemaVersion', "2.0")
								root.att('creationDate', moment().format())
								root.att('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance")
								root.att('xsi:schemaLocation',"urn:epcglobal:epcis:xsd:1 EPCglobal-epcis-2_0.xsd")
	root			=	root.ele('EPCISBody')
	root			=	root.ele('EventList')
	
	//Main loop based on the number of events/nodes in drag and drop
	for(var parent=0; parent<AllEventsArray.length; parent++)
	{
		var LastCounter			=	0;
		var QuantityLastCount	=	0;
		var LastParentCount		=	0;
		var EPCsArray			=	[];
		var QuantityArray		=	[];
		var ParentIDArray		=	[];
		var ChildParentIDarray	=	[];
		var ParentData			=	AllEventsArray[parent];
		var OuterParentName		=	ParentData.NodeName;
		var ParentEventType		=	AllEventsArray[parent].FormData.input.eventtype1;
		var ParentEPCs			=	[];
		var ParentQuantitiy		=	[];	
		var ParentDataAllEPCs	=	[];
		var QuantitiesDataAll	=	[];
		
		//For TransformationEvent chose the Output Quantities and EPCs and main element
		if(ParentEventType == 'TransformationEvent')
		{
			//Merge all the EPCs into single array list
			for(var merge=0; merge<ParentData.FormData.OutputEPCs.length; merge++)
			{
				ParentEPCs	=	ParentEPCs.concat(ParentData.FormData.OutputEPCs[merge]);
			}
			
			//Merge all the Quantities into a single Array
			for(var mergeQ=0;mergeQ<ParentData.FormData.OutputQuantities.length; mergeQ++)
			{
				ParentQuantitiy	=	ParentQuantitiy.concat(ParentData.FormData.OutputQuantities[mergeQ]);
			}
		}
		else
		{
			//Merge all the EPCs into single array list
			for(var merge=0; merge<ParentData.FormData.EPCs.length; merge++)
			{
				ParentEPCs	=	ParentEPCs.concat(ParentData.FormData.EPCs[merge]);
			}
			
			//Merge all the Quantities into a single Array
			for(var mergeQ=0;mergeQ<ParentData.FormData.Quantities.length; mergeQ++)
			{
				ParentQuantitiy	=	ParentQuantitiy.concat(ParentData.FormData.Quantities[mergeQ]);
			}
		}
		
		//Loop through child and split the EPCs and Quantities
		for(var child=0; child<AllEventsArray[parent].Childrens.length; child++)
		{
			var ChildData		=	AllEventsArray[parent].Childrens[child];
			var ChildNodeName	=	ChildData.ChildNodeName;
			var EndCount		=	parseInt(AllEventsArray[parent].Childrens[child].Count);
			var EndQuantityCount=	parseInt(AllEventsArray[parent].Childrens[child].QuantityCount);
			var ChildEventType	=	AllEventsArray[parent].Childrens[child].FormData.input.eventtype1;
			var EventCount		=	parseInt(AllEventsArray[parent].Childrens[child].FormData.input.eventcount);
				
			//Check if the Child EPCs value is empty
			if(ChildData.FormData.EPCs.length == 0 && ParentData.FormData.EPCs.length > 0)
			{
				//Obtain the complete list of EPCS belonging to particular Child EPCS
				EPCsArray		=	ParentEPCs.slice(LastCounter,LastCounter+(EndCount*EventCount));
				LastCounter		=	EndCount*EventCount;
				
				//Assign the EPCS based on number of events in Child NODE
				var EventStart	=	0;
				var EventEnd	=	0;
				var EventArray	=	[];
				
				for(var event=0; event<EventCount; event++)
				{
					EventArray	=	EPCsArray.slice(EventStart, EventStart + EndCount);
					EventStart	=	EventStart	+ EndCount;
					
					ChildData.FormData.EPCs.push(EventArray);
					
					//Write the respective children data into the parent of same node
					for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
					{	
						var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
						
						if(ChildNodeName	==	ParentNodeName)
						{
							if(AllEventsArray[ParentNode].FormData.EPCs.length > 0 && EventCount == 1)
							{
								AllEventsArray[ParentNode].FormData.EPCs[0] = AllEventsArray[ParentNode].FormData.EPCs[0].concat(EventArray);	
							}
							else
							{
								AllEventsArray[ParentNode].FormData.EPCs.push(EventArray);	
							}																			
						}	
					}
					
					
				}
			}
			
			//Check if the Quantity elements of the Children are empty
			if(ChildData.FormData.Quantities.length == 0 && ParentData.FormData.Quantities.length > 0)
			{
				QuantityArray		=	ParentQuantitiy.slice(QuantityLastCount,QuantityLastCount+(EndQuantityCount*EventCount));
				QuantityLastCount	=	EndQuantityCount * EventCount;
				
				//Assign the Quantities based on number of events in Child NODE
				var EventStart	=	0;
				var EventEnd	=	0;
				var EventArray	=	[];
				
				for(var event=0; event<EventCount; event++)
				{
					EventArray	=	QuantityArray.slice(EventStart, EventStart + EndQuantityCount);
					EventStart	=	EventStart	+ EndQuantityCount;
					ChildData.FormData.Quantities.push(EventArray);
					
					//Write the respective children data into the parent of same node
					for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
					{
						var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
						
						if(ChildNodeName	==	ParentNodeName)
						{
							if(AllEventsArray[ParentNode].FormData.Quantities.length > 0 && EventCount == 1)
							{
								AllEventsArray[ParentNode].FormData.Quantities[0] = AllEventsArray[ParentNode].FormData.Quantities[0].concat(EventArray);
							}
							else
							{
								AllEventsArray[ParentNode].FormData.Quantities.push(EventArray);
							}							
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
					//Merge all the Parent ID into a single Array
					for(var mergeP=0;mergeP<ParentData.FormData.ParentID.length; mergeP++)
					{
						ParentIDArray	=	ParentIDArray.concat(ParentData.FormData.ParentID[mergeP]);
					}
				
					//Check if child Parent ID value is 0
					if(ChildData.FormData.ParentID.length == 0 && ParentData.FormData.ParentID.length != 0)
					{	
						
						//Obtain the complete list of ParentIDs belonging to particular Child EPCS
						ChildParentIDarray	=	ParentIDArray.slice(LastParentCount,LastParentCount+EventCount);
						LastParentCount		=	LastParentCount + EventCount;

						for(var event=0; event<EventCount; event++)
						{
							var ParentIDChildArray	=	[];
							ParentIDChildArray.push(ChildParentIDarray[event]);
							
							//Push the Parent ID into the child Parent ID
							ChildData.FormData.ParentID.push(ParentIDChildArray);
							
							//find the parent of the respective child and write the data into the same
							for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
							{
								var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
								
								if(ChildNodeName	==	ParentNodeName)
								{
									AllEventsArray[ParentNode].FormData.ParentID.push(ParentIDChildArray);							
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
			Returndata.push({'JSON':FinalJSON});
			Returndata.push({'XML':FinalXML});
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
		
		//Call createJSON function to create JSON
		createJSON.createJSONData(Query,JSONHeader,function(JSONdata){
			FinalJSON	=	JSONdata;
		});
		
		//Call create XML function to create the XML
		createXML.createXMLData(Query,root,function(data){
			FinalXML	=	data;
		});
	}
}
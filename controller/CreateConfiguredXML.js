var builder 			=	require('xmlbuilder');
var moment 				= 	require('moment-timezone');
var moment 				= 	require('moment');
var xml_json_functions	=	require('./XML_JSON_Functions');
const createXML			=	require('./createXML');
const createJSON		=	require("./createJSON");

exports.createXML	=	function(AllData,callback){
	var currentTime 	=	moment().format();
	var AddedEvents		=	[];
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
		var ParentCounter		=	0;
		var LastCounter			=	0;
		var QuantityLastCount	=	0;
		var EPCsArray			=	[];
		var QuantityArray		=	[];
		var ParentIDArray		=	[];
		var ParentData			=	AllEventsArray[parent];
		var ParentEventType		=	AllEventsArray[parent].FormData.input.eventtype1;
		var ParentEPCs			=	[];
		var ParentQuantitiy		=	[];	
		
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
			if(ParentEventType == 'AggregationEvent' || ParentEventType == 'TransactionEvent' || ParentEventType == 'AssociationEvent')
			{
				//Check if the parent event is Association, Aggreagation and Transaction event if so collect Parent IDs
				//Merge all the Parent ID into a single Array
				for(var mergeP=0;mergeP<ParentData.FormData.ParentID.length; mergeP++)
				{
					ParentIDArray	=	ParentIDArray.concat(ParentData.FormData.ParentID[mergeP]);
				}

				//Merge all the EPCs into single array list
				for(var merge=0; merge<ParentData.FormData.EPCs.length; merge++)
				{
					ParentEPCs	=	ParentEPCs.concat(ParentData.FormData.EPCs[merge]);
				}
			}
			else if(ParentEventType == "ObjectEvent")
			{
				//Merge all the EPCs into single array list
				for(var merge=0; merge<ParentData.FormData.EPCs.length; merge++)
				{
					ParentEPCs	=	ParentEPCs.concat(ParentData.FormData.EPCs[merge]);
				}
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
			var EndParentCount	=	parseInt(AllEventsArray[parent].Childrens[child].ParentIdCount);
			var EndCount		=	parseInt(AllEventsArray[parent].Childrens[child].Count);
			var EndQuantityCount=	parseInt(AllEventsArray[parent].Childrens[child].QuantityCount);
			var EventCount		=	parseInt(AllEventsArray[parent].Childrens[child].FormData.input.eventcount);
			var ChildAction 	=	AllEventsArray[parent].Childrens[child].FormData.input.action;
			var ChildEventType	=	AllEventsArray[parent].Childrens[child].FormData.input.eventtype1;
			
			/*
				If ParentEvent is AggregationEvent/TransactionEvent/AssociationEvent then add the ParentID from ParentEvents to ChildEvents EPCs.
				If ParentEvent is ObjectEvent/TransformationEvent then add the EPCs from ParentEvent to ChildEvents EPCs.
			*/

			//If the ParentEvent is Aggregation/Transaction/Association and ChildEvent is also Aggregation/Transaction/Association with Action "Observe"
			// Then pass both the ParentID and ChildEPCs
			if(ParentEventType == 'AggregationEvent' || ParentEventType == 'TransactionEvent' || ParentEventType == 'AssociationEvent')
			{
				//Check if the ChildEvent is also Aggregation/Transaction/Association 
				if(ChildEventType == 'AggregationEvent' || ChildEventType == 'TransactionEvent' || ChildEventType == 'AssociationEvent')
				{
					//If ChildEvent Action is "OBSERVE" then add both ParentID and ChildEPCs to Children Events
					if(ChildAction == "OBSERVE")
					{
						//Addition of ParentID to Child Events

						//Check if ParentEvent has ParentID and ChildEvent does not have the EPCs
						if(ParentIDArray.length > 0 && ChildData.FormData.ParentID.length == 0)
						{
							//Obtain the complete list of EPCS belonging to particular Child EPCS from ParentIDArray
							ParentIDs			=	ParentIDArray.slice(ParentCounter,ParentCounter+EventCount);
							ParentCounter	 	= 	ParentCounter +  EventCount;

							//Assign the EPCS to each childNode based on the eventCount present in them
							var parentStart		=	0;
							var parentArray		=	[];

							for(var event=0; event<EventCount; event++)
							{
								parentArray	=	ParentIDs.slice(parentStart, parentStart + 1);
								parentStart	=	parentStart	+ 1;
					
								ChildData.FormData.ParentID.push(parentArray);
								
								//Write the respective children data into the parent of same node
								for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
								{	
									var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
									
									if(ChildNodeName	==	ParentNodeName)
									{
										if(AllEventsArray[ParentNode].FormData.ParentID.length > 0 && EventCount == 1)
										{
											AllEventsArray[ParentNode].FormData.ParentID[0] = AllEventsArray[ParentNode].FormData.ParentID[0].concat(parentArray);	
										}
										else
										{
											AllEventsArray[ParentNode].FormData.ParentID.push(parentArray);	
										}																			
									}
								}
							}
							
						}

						//Addition of ChildEPCs to Child Events

						//Check if the Child EPCs value is empty
						if(ChildData.FormData.EPCs.length == 0 && ParentEPCs.length > 0)
						{
							//Obtain the complete list of EPCS belonging to particular Child EPCS
							EPCsArray		=	ParentEPCs.slice(LastCounter,LastCounter+(EndCount*EventCount));
							LastCounter		=	EndCount*EventCount;
							//Assign the EPCS based on number of events in Child NODE
							var EventStart	=	0;
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
					}
					else if(ChildAction == "DELETE")
					{
						//If Action is "Delete" then only add the ParentIDs to child Events

						//Check if ParentEvent has ParentID and ChildEvent does not have the EPCs
						if(ParentIDArray.length > 0 && ChildData.FormData.EPCs.length == 0)
						{
							//Obtain the complete list of EPCS belonging to particular Child EPCS from ParentIDArray
							ParentIDs			=	ParentIDArray.slice(ParentCounter,ParentCounter+(EndParentCount*EventCount));
							ParentCounter	 	= 	EndParentCount *  EventCount;

							//Assign the EPCS to each childNode based on the eventCount present in them
							var parentStart		=	0;
							var parentArray		=	[];

							for(var event=0; event<EventCount; event++)
							{
								parentArray	=	ParentIDs.slice(parentStart, parentStart + EndParentCount);
								parentStart	=	parentStart	+ EndParentCount;
					
								ChildData.FormData.EPCs.push(parentArray);
								
								//Write the respective children data into the parent of same node
								for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
								{	
									var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
									
									if(ChildNodeName	==	ParentNodeName)
									{
										if(AllEventsArray[ParentNode].FormData.EPCs.length > 0 && EventCount == 1)
										{
											AllEventsArray[ParentNode].FormData.EPCs[0] = AllEventsArray[ParentNode].FormData.EPCs[0].concat(parentArray);	
										}
										else
										{
											AllEventsArray[ParentNode].FormData.EPCs.push(parentArray);	
										}																			
									}
								}
							}
						}
					}
				}
				else if(ChildEventType == "ObjectEvent" || ChildEventType == "TransformationEvent")
				{
					//Check if ParentEvent has ParentID and ChildEvent does not have the EPCs
					if(ParentIDArray.length > 0 && ChildData.FormData.EPCs.length == 0)
					{
						//Obtain the complete list of EPCS belonging to particular Child EPCS from ParentIDArray
						ParentIDs			=	ParentIDArray.slice(ParentCounter,ParentCounter+(EndParentCount*EventCount));
						ParentCounter	 	= 	EndParentCount *  EventCount;

						//Assign the EPCS to each childNode based on the eventCount present in them
						var parentStart		=	0;
						var parentArray		=	[];

						for(var event=0; event<EventCount; event++)
						{
							parentArray	=	ParentIDs.slice(parentStart, parentStart + EndParentCount);
							parentStart	=	parentStart	+ EndParentCount;
				
							ChildData.FormData.EPCs.push(parentArray);
							
							//Write the respective children data into the parent of same node
							for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
							{	
								var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
								
								if(ChildNodeName	==	ParentNodeName)
								{
									if(AllEventsArray[ParentNode].FormData.EPCs.length > 0 && EventCount == 1)
									{
										AllEventsArray[ParentNode].FormData.EPCs[0] = AllEventsArray[ParentNode].FormData.EPCs[0].concat(parentArray);	
									}
									else
									{
										AllEventsArray[ParentNode].FormData.EPCs.push(parentArray);	
									}																			
								}
							}
						}
					}
				}
			}
			else if(ParentEventType == "ObjectEvent" || ParentEventType == "TransformationEvent")
			{
				//If ParentEvent is Object/Transformation then only deal with EPCs

				//Check if the Child EPCs value is empty
				if(ChildData.FormData.EPCs.length == 0 && ParentData.FormData.EPCs.length > 0)
				{
					//Obtain the complete list of EPCS belonging to particular Child EPCS
					EPCsArray		=	ParentEPCs.slice(LastCounter,LastCounter+(EndCount*EventCount));
					LastCounter		=	EndCount*EventCount;

					//Assign the EPCS based on number of events in Child NODE
					var EventStart	=	0;
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
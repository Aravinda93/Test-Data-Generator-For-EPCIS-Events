var builder 			=	require('xmlbuilder');
var moment 				= 	require('moment-timezone');
var moment 				= 	require('moment');
var xml_json_functions	=	require('./XML_JSON_Functions');

exports.createXML	=	function(AllData,callback){
	var currentTime 	=	moment().format();
	var File 			=	'XML';
	var RecordTimeArray	=	[];
	var EventTimeArray	=	[];
	var ErrorTimeArray	=	[];
	var AddedEvents		=	[];
	var GlobalCount		=	0;
	var xml;
	var root 			= 	builder.create('epcis:EPCISDocument')
								root.att('xmlns:epcis', "urn:epcglobal:epcis:xsd:1")
								root.att('xmlns:gs1', "https://gs1.de")
								root.att('schemaVersion', "2.0")
								root.att('creationDate', currentTime)
								root.ele('EPCISBody')
								root.ele('EventList')
	
	var AllEventsArray	=	AllData.AllEventFinalArray;
	
	//Main loop based on the number of events/nodes in drag and drop
	for(var parent=0; parent<AllEventsArray.length; parent++)
	{
		var LastCounter		=	0;
		var Temparray		=	[];
		var ParentData		=	AllEventsArray[parent];
		var OuterParentName	=	ParentData.NodeName;
		var ParentEventType	=	AllEventsArray[parent].FormData.input.eventtype1;
		
		for(var child=0; child<AllEventsArray[parent].Childrens.length; child++)
		{
			var ChildData		=	AllEventsArray[parent].Childrens[child];
			var ChildNodeName	=	ChildData.ChildNodeName;
			var EndCount		=	parseInt(AllEventsArray[parent].Childrens[child].Count);
			var ChildEventType	=	AllEventsArray[parent].Childrens[child].FormData.input.eventtype1;
			
			if(ChildEventType == 'ObjectEvent')
			{
				if(ChildData.FormData.EPCs.length == 0)
				{											
					var Temparray		=	PreceedingEventFinder(ParentEventType,ParentData,LastCounter,EndCount);
					ChildData.FormData.EPCs.push(Temparray)
					LastCounter			=	LastCounter + EndCount;				
					
					//Write the respective children data into the parent of same node
					for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
					{
						var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
						
						if(ChildNodeName	==	ParentNodeName)
						{
							if(AllEventsArray[ParentNode].FormData.EPCs.length == 0)
							{
								AllEventsArray[ParentNode].FormData.EPCs.push(Temparray);
							}
							else
							{
								AllEventsArray[ParentNode].FormData.EPCs[0].push.apply(AllEventsArray[ParentNode].FormData.EPCs[0],Temparray);
							}							
						}					
					}
				}	
			}
			else if(ChildEventType == 'AggregationEvent')
			{
				var Temparray		=	PreceedingEventFinder(ParentEventType,ParentData,LastCounter,EndCount);
				ChildData.FormData.ChildEPCS.push(Temparray)
				LastCounter			=	LastCounter + EndCount;
					
				//Write the respective children data into the parent of same node
				for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
				{
					var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
					
					if(ChildNodeName	==	ParentNodeName)
					{
						if(AllEventsArray[ParentNode].FormData.ChildEPCS.length == 0)
						{
							AllEventsArray[ParentNode].FormData.ChildEPCS.push(Temparray);
						}
						else
						{
							AllEventsArray[ParentNode].FormData.ChildEPCS[0].push.apply(AllEventsArray[ParentNode].FormData.ChildEPCS[0],Temparray);
						}						
					}					
				}
			}
			else if(ChildEventType == 'TransactionEvent')
			{
				var Temparray		=	PreceedingEventFinder(ParentEventType,ParentData,LastCounter,EndCount);
				ChildData.FormData.EPCs.push(Temparray);
				LastCounter			=	LastCounter + EndCount;
				
				//Write the respective children data into the parent of same node
				for(var ParentNode=0; ParentNode<AllEventsArray.length; ParentNode++)
				{
					var ParentNodeName	=	AllEventsArray[ParentNode].NodeName;
					
					if(ChildNodeName	==	ParentNodeName)
					{
						if(AllEventsArray[ParentNode].FormData.EPCs.length == 0)
						{
							AllEventsArray[ParentNode].FormData.EPCs.push(Temparray);
						}
						else
						{
							AllEventsArray[ParentNode].FormData.EPCs[0].push.apply(AllEventsArray[ParentNode].FormData.EPCs[0],Temparray);
						}						
					}					
				}
			}
		}
	}
	
	//Function to check the preceeding event and populate the data into temparray
	function PreceedingEventFinder(ParentEventType,ParentData,LastCounter,EndCount)
	{
		var temparray	=	[];
		
		if(ParentEventType == 'ObjectEvent' || ParentEventType == 'TransactionEvent')
		{
			temparray	=	ParentData.FormData.EPCs[0].slice(LastCounter,LastCounter+EndCount);
		}
		else if(ParentEventType == 'AggregationEvent')
		{
			temparray	=	ParentData.FormData.ChildEPCS[0].slice(LastCounter,LastCounter+EndCount);
		}
		
		return temparray;
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
					console.log(NodeName);
					console.log(Query)
					break;
				}
			}
		}
		
		//Check if the Node is already added to XML
		if(AddedEvents.includes(NodeName))
			return;
		
		//If not then add to Array and create XML
		AddedEvents.push(NodeName);
		
		/*
		//Split the EPCS for the child based on parent
		if(type == 'Child')
		{			
			if(Query.EPCs.length == 0)
			{				
				var TempArray	=	[];
				var SplitCount	=	parseInt(AllData.AllEventFinalArray[parentCount].Childrens[loopcounter].Count,10);
				var ParentEPCs	=	AllData.AllEventFinalArray[parentCount].FormData.EPCs;
				if(ParentEPCs.length > 0)
				{
					TempArray		=	ParentEPCs[0].slice(GlobalCount,GlobalCount+SplitCount+1);
					console.log(TempArray)
					AllData.AllEventFinalArray[parentCount].Childrens[loopcounter].FormData.EPCs.push(TempArray);
					GlobalCount		=	GlobalCount + SplitCount+1;					
				}
				/*	else
				{
					var ParentEPCs	=	AllData.AllEventFinalArray[parentCount-1].FormData.EPCs;
					TempArray		=	ParentEPCs[0].slice(0,SplitCount+1);
					Query.EPCs.push(TempArray)
					GlobalCount		=	SplitCount+1;
				}
			}			
		}
		*/
		
		//Loop based on the number of events within each Node/Events
		for(var count=0; count<EventCount; count++)
		{		
			var ObjectEvent = root.ele(input.eventtype1)
			
			//IF the event type is Object event
			if(input.eventtype1 == 'ObjectEvent')
			{
				var epcList = ObjectEvent.ele('epcList')
				
				if(Query.EPCs.length > 0)
				{
					for(var o=0; o<Query.EPCs.length; o++)
					{
						var OEEPCS	=	Query.EPCs[o];
						
						for(var e=0; e<OEEPCS.length; e++)
						{
							epcList.ele('epc',OEEPCS[e]).up
						}	
					}
				}
			}
			else if(input.eventtype1 == "AggregationEvent")
			{
				//Add the parent of AggregationEvent
				if(Query.ParentID != null)
				{
					ObjectEvent.ele('parentID',Query.ParentID[0]).up()
				}
				//Add the CHILD EPCS of AggregationEvent
				if(Query.ChildEPCS != null)
				{
					var ChildEPCSURI	=	Query.ChildEPCS;
					var childEPCs		=	ObjectEvent.ele('childEPCs')
					
					for(var o=0; o<ChildEPCSURI.length; o++)
					{
						for(var c=0; c<ChildEPCSURI[o].length; c++)
						{
							childEPCs.ele('epc',ChildEPCSURI[o][c]).up()
						}
					}				
				}		
			}
			else if(input.eventtype1 == "TransactionEvent")
			{
				//TransactionEvent Parent ID
				if(Query.Parent.length >0)
				{
					ObjectEvent.ele('parentID',Query.Parent[0]).up()
				}
				//TransactionEvent EPCS
				if(Query.EPCs.length > 0)
				{
					var EPCs		=	Query.EPCs;
					var childEPCs	=	ObjectEvent.ele('epcList')
					
					for(var o=0; o<EPCs.length; o++)
					{
						for(var e=0; e<EPCs[o].length; e++)
						{						
							childEPCs.ele('epc',EPCs[o][e]).up()
						}
					}					
				}
			}
			
			
			var OuterExtension		=	ObjectEvent.ele('extension')
			var extension			= 	OuterExtension.ele('extension')		
			
			//Check for the Quantity element and add it to the XML		
			if(input.eventtype1 == "ObjectEvent")
			{			
				if(Query.Quantities.length > 0)
				{	
					
					var quantityList	= 	extension.ele('quantityList')				
					var QuantitiesURIs	=	Query.Quantities;			
					
					for(var o=0; o<QuantitiesURIs.length; o++)
					{
						for(var q=0; q<QuantitiesURIs[o].length; q++)
						{
							var quantityElement	=	quantityList.ele('quantityElement')
							quantityElement.ele('epcClass',QuantitiesURIs[o][q].URI).up()
							
							if(QuantitiesURIs[o][q].QuantityType == 'Fixed Measure Quantity')
							{
								quantityElement.ele('quantity',QuantitiesURIs[o][q].Quantity).up()
							}
							else if(QuantitiesURIs[o][q].QuantityType == 'Variable Measure Quantity')
							{
								quantityElement.ele('quantity',QuantitiesURIs[o][q].Quantity).up()
								quantityElement.ele('uom',QuantitiesURIs[o][q].QuantityUOM).up()
							}
						}
					}
						
				}	
			}
			else if(input.eventtype1 == "AggregationEvent")
			{	
				if(Query.ChildQuantities.length > 0)
				{
					var quantityList	= 	extension.ele('quantityList')				
					
					for(var o=0; o<Query.ChildQuantities.length; o++)
					{
						var ChildQuantitiesURI	=	Query.ChildQuantities[o];
						
						for(c=0; c<ChildQuantitiesURI.length;c++)
						{
							var quantityElement	=	quantityList.ele('quantityElement')
							quantityElement.ele('epcClass',ChildQuantitiesURI[c].URI).up()
							
							if(ChildQuantitiesURI[c].QuantityType == 'Fixed Measure Quantity')
							{
								quantityElement.ele('quantity',ChildQuantitiesURI[c].Quantity).up()
							}
							else if(ChildQuantitiesURI[c].QuantityType == 'Variable Measure Quantity')
							{
								quantityElement.ele('quantity',ChildQuantitiesURI[c].Quantity).up()
								quantityElement.ele('uom',ChildQuantitiesURI[c].QuantityUOM).up()
							}
						}	
					}				
				}
			}
			
			//Check for BUSINESS STEP
			if(input.businessStep != '' && input.businessStep != null && typeof input.businessStep != undefined)
			{
				if(input.businessStep == 'BusinessStepEnter')
				{
					ObjectEvent.ele('bizStep',input.EnterBusinessStepText)
				}
				else
				{
					ObjectEvent.ele('bizStep','urn:epcglobal:cbv:bizstep:'+input.businessStep)
				}
			}
			
			//Check for DISPOSITION
			if(input.disposition != '' && input.disposition != null && typeof input.disposition != undefined)
			{
				if(input.disposition == 'DispositionEnter')
				{
					ObjectEvent.ele('disposition',input.EnterDispositionText)
				}
				else
				{
					ObjectEvent.ele('disposition','urn:epcglobal:cbv:disp:'+input.disposition)
				}
			}
		}
	}
	xml = root.end({ pretty: true});
	callback(xml);
}
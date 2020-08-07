var builder 			=	require('xmlbuilder');
var moment 				= 	require('moment-timezone');
var moment 				= 	require('moment');
var xml_json_functions	=	require('./XML_JSON_Functions');

exports.createXMLData	=	function(Query,callback){
	var input			=	Query.input;
	var today 			= 	new Date();
	let date 			= 	today.toISOString().slice(0, 10).replace(/-/g,"-");
	var time 			= 	(today.getHours()+1) + ":" + today.getMinutes() + ":" + today.getSeconds()+'Z';
		time			= 	time.replace(/:/g,"_");
	var now 			=	date+"T"+time;
	var offset			= 	today.getTimezoneOffset()/60+':00';
	var itemProcessed 	=	0;
	var File 			= 	'XML';
	var RecordTimeArray	=	[];
	var EventTimeArray	=	[];
	var ErrorTimeArray	=	[];
	
	var xml;	
	var root 	= 	builder.create('epcis:EPCISDocument')
					root.att('xmlns:epcis', "urn:epcglobal:epcis:xsd:1")
					root.att('xmlns:gs1', "https://gs1.de")
					root.att('schemaVersion', "2.0")
					root.att('creationDate', now)
					root.ele('EPCISBody')
					root.ele('EventList')
	
	if(input.eventtype1 == "AssociationEvent")
	{
		var AEMainExtension = 	root.ele('extension')
		var AESubExtension	=	AEMainExtension.ele('extension')
	}
					
	for(var count=0; count<input.eventcount; count++)
	{	
		if(input.eventtype1 == "AssociationEvent")
		{
			var ObjectEvent	= AESubExtension.ele(input.eventtype1)
		}
		else
		{
			var ObjectEvent = root.ele(input.eventtype1)
		}
		
		//Check what type of EVENT TIME is required and fill the values accordingly
		if(input.EventTimeSelector != "" && input.EventTimeSelector != null && typeof input.EventTimeSelector != undefined)
		{
			//If Specific Event time has been selected
			if(input.EventTimeSelector == 'SpecificTime')
			{
				input.eventtimeSpecific 	= 	new Date(input.eventtimeSpecific);
				input.eventtimeSpecific		= 	moment(input.eventtimeSpecific).format();
				ObjectEvent.ele('eventTime', input.eventtimeSpecific).up()
				ObjectEvent.ele('eventTimeZoneOffset', offset).up()
			}
			else if(input.EventTimeSelector == 'TimeRange')
			{	
				var From			=	input.EventTimeFrom;
				var To				=	input.EventTimeTo;
				var EventCount		=	input.eventcount;
				
				if(count == 0)
				{
					EventTimeArray	=	[];
					xml_json_functions.RandomEventTimeGenerator(From,To,EventCount,File,function(ReturnEventTime){
						EventTimeArray	= ReturnEventTime;
					});	
				}
				
				ObjectEvent.ele('eventTime', EventTimeArray[count]).up()
				ObjectEvent.ele('eventTimeZoneOffset', offset).up()
			}

		}
		
		//Check what type of RECORD TIME is required and fill the values accordingly
		if(input.RecordTimeOption != "" && input.RecordTimeOption != null && typeof input.RecordTimeOption != undefined)
		{
			//Check if the Record Time Option is YES
			if(input.RecordTimeOption == 'yes')
			{
				//Check if Record Time Option is Same as Event TIME
				if(input.RecordTimeOptionType	== 'RecordTimeSameAsEventTime')
				{
					if(input.EventTimeSelector == 'TimeRange')
					{
						ObjectEvent.ele('recordTime', EventTimeArray[count]).up()
					}
					else if(input.EventTimeSelector == 'SpecificTime')
					{
						ObjectEvent.ele('recordTime', input.eventtimeSpecific).up()
					}					
				}
				else if(input.RecordTimeOptionType	== 'RecordTimeCurrentTime')
				{
					//If the current time is choosen
					var currentTime = moment().format()
					ObjectEvent.ele('recordTime',currentTime).up()
				}
			}
		}
		
		//If error declaration has been set then add the below tags
		if(input.eventtype2 == 'errordeclaration' || input.EventId != "")
		{
			//Add the error declaration if its populated
			if(input.EventId != "" && input.EventId != null && typeof input.EventId != undefined)
			{
				var baseExtension		=	ObjectEvent.ele('baseExtension')
				baseExtension.ele('eventID',input.EventId)
			}	
			
			//Add the error declaration if its populated
			if(input.eventtype2 == 'errordeclaration')
			{
				var baseExtension		=	ObjectEvent.ele('baseExtension')
				var errorDeclaration	=	baseExtension.ele('errorDeclaration')
				
				//Check what type of error declaration has been choosen
				if(input.ErrorDeclarationTimeSelector != '')
				{
					if(input.ErrorDeclarationTimeSelector == 'SpecificTime')
					{
						//Add Error Declaration Time
						input.ErrorDeclarationTime	=	moment(input.ErrorDeclarationTime).format();
						errorDeclaration.ele('declarationTime',input.ErrorDeclarationTime)
					}
					else if(input.ErrorDeclarationTimeSelector == 'TimeRange')
					{
						var From			=	input.ErrorDeclarationTimeFrom;
						var To				=	input.ErrorDeclarationTimeTo;
						var EventCount		=	input.eventcount;
						
						//Call the random function to generate the random date
						if(count == 0)
						{
							ErrorTimeArray	=	[];
							xml_json_functions.RandomEventTimeGenerator(From,To,EventCount,File,function(RandomErrorTime){
								ErrorTimeArray	= RandomErrorTime;
							});	
						}
						
						errorDeclaration.ele('declarationTime',ErrorTimeArray[count])	
					}
				}
				
				//Add Error Reason type if its populated
				if(input.ErrorReasonType != "" && input.ErrorReasonType != null && typeof input.ErrorReasonType != undefined)
				{
					if(input.ErrorReasonType == 'Other')
					{
						errorDeclaration.ele('reason',input.ErrorReasonOther)
					}
					else
					{
						errorDeclaration.ele('reason','urn:epcglobal:cbv:er:'+input.ErrorReasonType)
					}
				}
				
				//Loop and add the Corrective Event Ids
				if(Query.ErrorCorrection.length > 0)
				{
					var correctiveEventIDs	=	errorDeclaration.ele('correctiveEventIDs')
					for(var e=0; e<Query.ErrorCorrection.length; e++)
					{
						correctiveEventIDs.ele('correctiveEventID',Query.ErrorCorrection[e].CorrectiveText)
					}				
				}			
				
				//Loop and add the Extension for Error
				if(Query.ErrorExtension.length > 0)
				{
					var ErrorExtension	=	Query.ErrorExtension;
					
					for(var i=0; i<ErrorExtension.length; i++)
					{
						var NameSpace 	=	ErrorExtension[i].NameSpace;
						var LocalName 	=	ErrorExtension[i].LocalName;
						
						if(NameSpace.includes("http://") || NameSpace.includes("https://"))
						{
							NameSpace = NameSpace.split("/").slice(2);
							NameSpace = NameSpace[0].toString().substr(0, NameSpace[0].indexOf(".")); 
							errorDeclaration.ele(NameSpace+':'+LocalName,ErrorExtension[i].FreeText)
						}
						else
						{
							errorDeclaration.ele(NameSpace+':'+LocalName,ErrorExtension[i].FreeText)
						}
					}
				}
			}
			
		}
		
		//IF the event type is Object event
		if(input.eventtype1 == 'ObjectEvent')
		{			
			if(Query.EPCs.length > 0)
			{
				var epcList = ObjectEvent.ele('epcList')
				
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
		else if(input.eventtype1 == "TransformationEvent")
		{		
			//Add the Input EPCs
			if(Query.InputEPCs.length > 0)
			{
				var InputList	=	ObjectEvent.ele('inputEPCList')
				
				for(var o=0; o<Query.InputEPCs.length; o++)
				{
					for(var i=0; i<Query.InputEPCs[o].length; i++)
					{					
						InputList.ele('epc',Query.InputEPCs[o][i]).up()
					}
				}				
			}
			
			//Add the Input Quantities			
			if(Query.InputQuantities.length > 0)
			{
				var inputQuantityList	=	ObjectEvent.ele('inputQuantityList')				
				
				for(var i=0; i<Query.InputQuantities.length; i++)
				{
					var InputQuantities		=	Query.InputQuantities[i];
					
					for(var q=0; q<InputQuantities.length; q++)
					{	
						var quantityElement		=	inputQuantityList.ele('quantityElement').up()						
						
						if(InputQuantities[q].QuantityType == 'Fixed Measure Quantity')
						{
							quantityElement.ele('epcClass',InputQuantities[q].URI)
							quantityElement.ele('quantity',InputQuantities[q].Quantity)
						}
						else if(InputQuantities[q].QuantityType == 'Variable Measure Quantity')
						{
							quantityElement.ele('epcClass',InputQuantities[q].URI)
							quantityElement.ele('quantity',InputQuantities[q].Quantity)
							quantityElement.ele('uom',InputQuantities[q].QuantityUOM)
						}
					}
				}
				
			}
			
			//Add the Output EPC List			
			//Add the Output EPCs
			if(Query.OutputEPCs.length > 0)
			{
				var outputEPCList	=	ObjectEvent.ele('outputEPCList')
				
				for(var o=0; o<Query.OutputEPCs.length; o++)
				{
					for(var i=0; i<Query.OutputEPCs[o].length; i++)
					{					
						outputEPCList.ele('epc',Query.OutputEPCs[o][i]).up()
					}
				}				
			}
			
			//Add the Output Quantities			
			if(Query.OutputQuantities.length > 0)
			{
				var outputQuantityList	=	ObjectEvent.ele('outputQuantityList')
				var quantityElement		=	outputQuantityList.ele('quantityElement')
				
				
				for(var o=0; o<Query.OutputQuantities.length; o++)
				{
					var OutputQuantities	=	Query.OutputQuantities[o];
					
					for(var q=0; q<OutputQuantities.length; q++)
					{	
						quantityElement.ele('epcClass',OutputQuantities[q].URI).up()
						
						if(OutputQuantities[q].QuantityType == 'Fixed Measure Quantity')
						{
							quantityElement.ele('quantity',OutputQuantities[q].Quantity).up()
						}
						else if(OutputQuantities[q].QuantityType == 'Variable Measure Quantity')
						{
							quantityElement.ele('quantity',OutputQuantities[q].Quantity).up()
							quantityElement.ele('uom',OutputQuantities[q].QuantityUOM).up()
						}
					}	
				}				
			}
		}
		else if(input.eventtype1 == "AssociationEvent")
		{
			//Add the Parent for Association Event
			if(Query.ParentID != null)
			{
				ObjectEvent.ele('parentID',Query.ParentID[0]).up()
			}
			
			//Add the CHILD EPCS of AssociationEvent
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
			
			//Add the Child Quan of Association Event
			if(Query.ChildQuantities.length > 0)
			{
				var quantityList	= 	ObjectEvent.ele('quantityList')
				
				
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
		
		//If the OBJECT EVENT and EPCS is 	
		if(input.action != "" && input.action != null && typeof input.action != undefined)
		{
			ObjectEvent.ele('action', input.action)
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
		
		//Check for ReadPoint and based on that set the Readpoint 
		if(input.readpointselector != '' && input.readpointselector != null && typeof input.readpointselector != undefined)
		{
			if(input.readpointselector == 'manually')
			{
				var readPoint = ObjectEvent.ele('readPoint')
				readPoint.ele('id', input.readpoint).up()
			}
			else if(input.readpointselector == 'sgln')
			{
				xml_json_functions.ReadPointFormatter(input,File,function(data){
					var readPoint = ObjectEvent.ele('readPoint')
					//readPoint.ele('id', 'urn:epc:id:sgln:'+input.readpointsgln1+input.readpointsgln2).up()
					readPoint.ele('id', 'urn:epc:id:sgln:'+data).up()
				});				
			}
		}
		
		//Check for the Business Location and set the Business Location
		if(input.businesslocationselector != '' && input.businesslocationselector != null && typeof input.businesslocationselector != undefined)
		{
			if(input.businesslocationselector == 'manually')
			{
				var businesslocation = ObjectEvent.ele('bizLocation')
				businesslocation.ele('id', input.businesslocation).up()
			}
			else if(input.businesslocationselector == 'sgln')
			{
				xml_json_functions.BusinessLocationFormatter(input,File,function(data){
					var businesslocation = ObjectEvent.ele('bizLocation')
					businesslocation.ele('id', 'urn:epc:id:sgln:'+data).up()
				});					
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
		else if(input.eventtype1 == "TransactionEvent")
		{			
			if(Query.Quantities.length >0)
			{
				var quantityList	= 	extension.ele('quantityList')
				
				for(var o=0; o<Query.Quantities.length; o++)
				{
					var Quantities 		=	Query.Quantities[o];
				
					for(q=0; q<Quantities.length; q++)
					{
						var quantityElement	=	quantityList.ele('quantityElement')
						quantityElement.ele('epcClass',Quantities[q].URI).up()
						
						if(Quantities[q].QuantityType == 'Fixed Measure Quantity')
						{
							quantityElement.ele('quantity',Quantities[q].Quantity).up()
						}
						else if(Quantities[q].QuantityType == 'Variable Measure Quantity')
						{
							quantityElement.ele('quantity',Quantities[q].Quantity).up()
							quantityElement.ele('uom',Quantities[q].QuantityUOM).up()
						}
					}
				}
			}
		}
		
		//Populate The Business Transacation List
		if(Query.BTT.length > 0)
		{
			var bizTransactionList	=	extension.ele('bizTransactionList')
			
			for(var b=0; b<Query.BTT.length; b++)
			{
				var BTT 			=	Query.BTT[b]
				var bizTransaction 	=	bizTransactionList.ele('bizTransaction',BTT.BTT.Value)
				bizTransaction.att('type','urn:epcglobal:cbv:btt:'+BTT.BTT.Type)
			}			
		}
		
		//Check for the Source and Source type
		if(input.sourcesType != '' && input.sourcesType != null && input.sourcesType != undefined)
		{
			var sourceList 	= extension.ele('sourceList')			
			
			if(input.sourcesType == 'owning_party' || input.sourcesType == 'processing_party' || input.sourcesType == 'location')
			{
				var SourceGLN			=	input.SourceGLN;
				var SourceCompanyPrefix	=	input.SourcesCompanyPrefix;
				var FormattedData;
				
				xml_json_functions.SourceDestinationFormatter(SourceGLN,SourceCompanyPrefix,function(data)
				{	
					FormattedData	=	data;
				});

				if(input.sourcesType == 'owning_party' || input.sourcesType == 'processing_party')
				{
					//If PGLN then directly append
					if(input.SourceLNType == 'pgln')
					{
						var sources 	= 	sourceList.ele('source',FormattedData)
						sources.att('type','urn:epcglobal:cbv:sdt:'+input.sourcesType)						
					}
					else if(input.SourceLNType == 'sgln')
					{
						FormattedData	=	FormattedData + '.' + input.SourceGLNExtension;
						var sources 	= 	sourceList.ele('source',FormattedData)
						sources.att('type','urn:epcglobal:cbv:sdt:'+input.sourcesType)	
					}
				}
				
				if(input.sourcesType == 'location')
				{
					FormattedData	=	FormattedData + '.' + input.SourceGLNExtension;
					var sources 	= 	sourceList.ele('source',FormattedData)
					sources.att('type','urn:epcglobal:cbv:sdt:'+input.sourcesType)	
				}
				
				
			}
			else if(input.sourcesType == 'other')
			{
				var sources 	= sourceList.ele('source',input.OtherSourceURI2)
				sources.att('type',input.OtherSourceURI1)
			}
		}
		
		//Check for the Destination and Destination type
		if(input.destinationsType != '' && input.destinationsType != null && input.destinationsType != undefined)
		{
			var destinationList 	= 	extension.ele('destinationList')
			
			if(input.destinationsType == 'owning_party' || input.destinationsType == 'processing_party' || input.destinationsType == 'location')
			{
				var destinationGLN				=	input.DestinationGLN;
				var destinationCompanyPrefix	=	input.DestinationCompanyPrefix;
				var FormattedData;
				
				xml_json_functions.SourceDestinationFormatter(destinationGLN,destinationCompanyPrefix,function(data)
				{	
					FormattedData	=	data;
				});
				
				if(input.destinationsType == 'owning_party' || input.destinationsType == 'processing_party')
				{
					//If PGLN then directly append
					if(input.DestinationLNType == 'pgln')
					{
						var destinations 	=	destinationList.ele('destination', FormattedData)
						destinations.att('type','urn:epcglobal:cbv:sdt:'+input.destinationsType)						
					}
					else if(input.DestinationLNType == 'sgln')
					{
						FormattedData		=	FormattedData + '.' + input.DestinationGLNExtension;
						var destinations 	= 	destinationList.ele('destination',FormattedData)
						destinations.att('type','urn:epcglobal:cbv:sdt:'+input.destinationsType)	
					}
				}
				
				if(input.destinationsType == 'location')
				{
					FormattedData		=	FormattedData + '.' + input.DestinationGLNExtension;
					var destinations 	= 	destinationList.ele('destination',FormattedData)
					destinations.att('type','urn:epcglobal:cbv:sdt:'+input.destinationsType)
				}
			}
			else if(input.destinationsType == 'other')
			{
				var destinations 		=	destinationList.ele('destination', input.OtherDestinationURI2)
				destinations.att('type',input.OtherDestinationURI1)
			}
		}		
		
		//Sensor Information
		if(Query.SensorForm.length > 0)
		{
			var SensorForm			=	Query.SensorForm;
			var sensorElementList	=	extension.ele('sensorElementList')
			
			//Loop through the SensorForm and find the number of elements
			for(var sf=0; sf<SensorForm.length; sf++)
			{
				var sensorElement		=	sensorElementList.ele('sensorElement')	
				
				//Loop through Each sensor Element
				for(var t=0; t<SensorForm[sf].length; t++)
				{
					var sensorMetaData		=	sensorElement.ele('sensorMetaData')
					//sensorMetaData.att('time',moment(SensorForm[sf][t].Time).format())
					
					//Add the Sensor Metadata information if its populated
					SensorMetaDataChecker(SensorForm[sf][t].Time,'time',sensorMetaData)
					SensorMetaDataChecker(SensorForm[sf][t].StartTime,'startTime',sensorMetaData)
					SensorMetaDataChecker(SensorForm[sf][t].EndTime,'endTime',sensorMetaData)
					SensorMetaDataChecker(SensorForm[sf][t].DeviceID,'deviceID',sensorMetaData)
					SensorMetaDataChecker(SensorForm[sf][t].DeviceMetadata,'deviceMetaData',sensorMetaData)
					SensorMetaDataChecker(SensorForm[sf][t].RawData,'rawData',sensorMetaData)
					SensorMetaDataChecker(SensorForm[sf][t].DataProcessingMethod,'dataProcessingMethod',sensorMetaData)
					SensorMetaDataChecker(SensorForm[sf][t].BusinessRules,'bizRules',sensorMetaData)					
					
					var SensorElements		=	SensorForm[sf][t].SensorElements;
					console.log(SensorForm[sf][t]);
					//Loop through Each Sensor Report Data
					if(SensorElements != undefined)
					{						
						for(var e=0;e<SensorElements.length;e++)
						{
							//sensorReport.att('type','gs1:'+SensorType)
							var sensorReport	=	sensorElement.ele('sensorReport')
							
							var SensorType		=	SensorElements[e].SensorFields.Type;
							
							SensorMetaDataChecker(SensorElements[e].SensorFields.Time,'time',sensorReport)
							
							if(SensorType != '' && SensorType != null && SensorType != undefined){
								sensorReport.att('type','gs1:'+SensorType)
							}
							
							SensorMetaDataChecker(SensorElements[e].SensorFields.Value,'value',sensorReport)
							SensorMetaDataChecker(SensorElements[e].SensorFields.MinValue,'minValue',sensorReport)
							SensorMetaDataChecker(SensorElements[e].SensorFields.MaxValue,'maxValue',sensorReport)
							SensorMetaDataChecker(SensorElements[e].SensorFields.MeanValue,'meanValue',sensorReport)
							SensorMetaDataChecker(SensorElements[e].SensorFields.DeviceID,'deviceID',sensorReport)
							SensorMetaDataChecker(SensorElements[e].SensorFields.DeviceMetaData,'deviceMetaData',sensorReport)
							SensorMetaDataChecker(SensorElements[e].SensorFields.StandardDeviation,'sDev',sensorReport)							
							SensorMetaDataChecker(SensorElements[e].SensorFields.ChemicalSubstance,'chemicalSubstance',sensorReport)
							SensorMetaDataChecker(SensorElements[e].SensorFields.UOM,'uom',sensorReport)
							
						}
					}
				}
			}			
		}
		
		function SensorMetaDataChecker(field, attValue, sensorMetaData){
			if(field != '' && field != null && field != undefined)
			{
				sensorMetaData.att(attValue,field)
			}
		}
		
		
		//Check if the ILMD has been added then add them
		if(input.eventtype1 == "ObjectEvent" || input.eventtype1 == "TransformationEvent")
		{
			if(Query.ILMD.length > 0)
			{
				var ilmd 		= 	extension.ele('ilmd')
				var ilmdList	=	Query.ILMD;
				
				for(var i=0; i<Query.ILMD.length; i++)
				{
					var NameSpace 	=	ilmdList[i].NameSpace;
					var LocalName 	=	ilmdList[i].LocalName;
					
					if(NameSpace.includes("http://") || NameSpace.includes("https://"))
					{
						NameSpace = NameSpace.split("/").slice(2);
						NameSpace = NameSpace[0].toString().substr(0, NameSpace[0].indexOf(".")); 
						ilmd.ele(NameSpace+':'+LocalName,ilmdList[i].FreeText)
					}
					else
					{
						ilmd.ele(NameSpace+':'+LocalName,ilmdList[i].FreeText)
					}
				}
			}
		}
		
		//Check if the extension field is filled and add the XML tags
		var Extension			=	Query.Extension;
		if(Extension.length > 0)
		{
			for(var ex=0; ex<Extension.length; ex++)
			{
				var NameSpace 	=	Extension[ex].NameSpace; 
				var LocalName 	=	Extension[ex].LocalName;
					
				if(Extension[ex].NameSpace.includes("http://") || Extension[ex].NameSpace.includes("https://"))
				{			
					NameSpace = NameSpace.split("/").slice(2);
					NameSpace = NameSpace[0].toString().substr(0, NameSpace[0].indexOf("."));
					ObjectEvent.ele(NameSpace+':'+LocalName,Extension[ex].FreeText).up()
				}
				else
				{
					ObjectEvent.ele(Extension[ex].NameSpace+':'+Extension[ex].LocalName,Extension[ex].FreeText).up()
				}
			}
		}
			
		itemProcessed++;
		
		//After creation of all the XML events return the data to index.js
		if(itemProcessed == input.eventcount)
		{
			xml = root.end({ pretty: true});
			callback(xml);
		}
	}
	
}
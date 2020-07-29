//ReadExcelFile.js

const xlsxFile 					= 	require('read-excel-file/node');
const CreateAggregationEventURI	=	require("./CreateAggregationEventURI"); 
const builder 					=	require('xmlbuilder');
const moment 					= 	require('moment');

exports.ReadExcelFileContent	=	function(callback){
	
	var fileLocation	=	"C:\\Users\\baliga\\Desktop\\TestDataTemplate.xlsx";
	var BusinessSteps	=	[];
	var NumberOfEvents;
	var itemProcessed	=	0;
	var xml;
	var currentTime 	= 	moment().format()
	var root 			= 	builder.create('epcis:EPCISDocument')
							root.att('xmlns:epcis', "urn:epcglobal:epcis:xsd:1")
							root.att('xmlns:gs1', "https://gs1.de")
							root.att('schemaVersion', "1.2")
							root.att('creationDate', currentTime)
							root.ele('EPCISBody')
							root.ele('EventList')

	xlsxFile(fileLocation).then((rows) => {
		console.table(rows);
		BusinessSteps.push(rows[0]);
		NumberOfEvents	=	rows[3][1];
		eventCreator();
	});	
	
	function eventCreator(){
		BusinessSteps	= 	BusinessSteps[0];
		var obj			=	new Object();
		obj.AggregationEventParentID	=	'SGTIN (Al 01 + Al 21)';
		obj.sgtintype					=	'random';
		obj.radomMinLength				=	4;
		obj.randomMaxLength				=	6;
		obj.randomType					=	'numeric';
		obj.randomCount					=	NumberOfEvents;
		obj.AEPSGTIN1					=	'1234567678901234';
		obj.AEPCompanyPrefix			=	6;
		
		for(var bs=1; bs<BusinessSteps.length; bs++)
		{
			var reqData		=	JSON.stringify({input:obj,MultiValues:true});
			var ObjectEvent	= 	root.ele('objectEvent')
			var epcList 	= 	ObjectEvent.ele('epcList')
			CreateAggregationEventURI.CreateAggregationEventURI(reqData,function(data){
				for(var e=0; e<data.length; e++)
				{
					epcList.ele('epc',data[e]).up
				}
			});
			
			ObjectEvent.ele('bizStep','urn:epcglobal:cbv:bizstep:'+BusinessSteps[bs])
		}
		
		xml = root.end({ pretty: true});
		callback(xml);
	}
}



exports.DrawDataXML		=	function(Query,callback){
	var input						=	Query.input;
	var currentTime 				= 	moment().format();
	
	var root 						= 	builder.create('epcis:EPCISDocument')
											root.att('xmlns:epcis', "urn:epcglobal:epcis:xsd:1")
											root.att('xmlns:gs1', "https://gs1.de")
											root.att('schemaVersion', "1.2")
											root.att('creationDate', currentTime)
											root.ele('EPCISBody')
											root.ele('EventList')
											
	var obj							=	new Object();
	obj.AggregationEventParentID	=	'SGTIN (Al 01 + Al 21)';
	obj.sgtintype					=	'random';
	obj.radomMinLength				=	4;
	obj.randomMaxLength				=	6;
	obj.randomType					=	'numeric';
	obj.randomCount					=	input[0].Fields['NumberofElement'];
	obj.AEPSGTIN1					=	'1234567678901234';
	obj.AEPCompanyPrefix			=	6;		
	var reqData						=	JSON.stringify({input:obj,MultiValues:true});
	var GlobalCount					=	0;		
	var xml;	
	var ObjectPCSArray				=	[];
	var TotalCounter				=	0;
	
	//Call the function to get the SGTIN
	CreateAggregationEventURI.CreateAggregationEventURI(reqData,function(data){
		ObjectPCSArray	=	data;
	});
	
	//Loop through number of rectangular box and create events
	for(var i=0; i<input.length;i++)
	{
		var ObjectEvent	= 	root.ele('objectEvent')
		var epcList 	= 	ObjectEvent.ele('epcList')
		var CountNumber	=	parseInt(input[i].Fields['NumberofElement'], 10);
		CountNumber		=	GlobalCount	+ parseInt(input[i].Fields['NumberofElement']);
	
		for(var EventCount=GlobalCount; EventCount<CountNumber;EventCount++)
		{
			epcList.ele('epc',ObjectPCSArray[EventCount]).up
			GlobalCount++;	
			
			//if(GlobalCount == input[i].Fields['NumberofElement'] && TotalCounter == ObjectPCSArray.length)
			if(GlobalCount >= parseInt(input[i].Fields['NumberofElement'], 10) && GlobalCount == ObjectPCSArray.length)
			{				
				GlobalCount	=	0;
			}
		}

		ObjectEvent.ele('bizStep','urn:epcglobal:cbv:bizstep:'+input[i].Fields['BusinessStep'])		
	}
	
	xml = root.end({ pretty: true});
	callback(xml);
}
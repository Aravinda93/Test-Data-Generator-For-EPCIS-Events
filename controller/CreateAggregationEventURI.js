var randomArray = 	[];
var EpcLists 	= 	[];

//Based on the Selected Aggregation Event format the URI
exports.CreateAggregationEventURI	= function(Query,callback){
	//var Query		=	JSON.parse(Query);
	//CHANGE THIS AFTER ALL
	//var input		=	Query.input;
	var input		=	Query.input;
	var syntaxType	=	Query.formdata.syntaxType;
		EpcLists 	= 	[];
	console.log(input)
	var Domain		=	'https://id.gs1.org'

	//Execute this if Multiple values needs to be created
	if(Query.MultiValues)
	{
		if(input.AggregationEventParentID == 'SGTIN (Al 01 + Al 21)')
		{
			var companyPrefixInput	=	input.AEPSGTIN1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				
			if(syntaxType 	== 'urn')
			{
				companyPrefixInput 	=	companyPrefix(companyPrefixInput, companyPrefixPoint);
				
				if(input.sgtintype == 'none')
				{
					var epcID	=	'urn:epc:id:sgtin:'+companyPrefixInput+"."+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				if(input.sgtintype == 'range')
				{
					for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
					{				
						var epcID	=	'urn:epc:id:sgtin:'+companyPrefixInput+"."+id;
						EpcLists.push(epcID);
					}
					callback(EpcLists);
				}
				else if(input.sgtintype == 'random')
				{
					var min_Length	=	parseInt(input.radomMinLength, 10);
					var max_Length	=	parseInt(input.randomMaxLength, 10);
					var randomType	=	input.randomType;
					var randomCount	=	parseInt(input.randomCount, 10);
					//Call the function to generate the Random numbers then create XML elements
					var data 				= RandomGenerator(min_Length,max_Length,randomType,randomCount);
					
					for(var arrCount=0; arrCount<data.length; arrCount++)
					{			
						var epcID	=	'urn:epc:id:sgtin:'+companyPrefixInput+"."+data[arrCount];
						EpcLists.push(epcID);	
					}
					callback(EpcLists);
				}
			}
			else if(syntaxType == 'webURI')
			{
				if(input.sgtintype == 'none')
				{
					var epcID	=	Domain+'/01/'+companyPrefixInput+'/21/'+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				if(input.sgtintype == 'range')
				{
					for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
					{	
						var epcID	=	Domain+'/01/'+companyPrefixInput+'/21/'+id;
						EpcLists.push(epcID);
					}
					callback(EpcLists);
				}
				else if(input.sgtintype == 'random')
				{
					var min_Length	=	parseInt(input.radomMinLength, 10);
					var max_Length	=	parseInt(input.randomMaxLength, 10);
					var randomType	=	input.randomType;
					var randomCount	=	parseInt(input.randomCount, 10);
					//Call the function to generate the Random numbers then create XML elements
					var data 				= RandomGenerator(min_Length,max_Length,randomType,randomCount);
					
					for(var arrCount=0; arrCount<data.length; arrCount++)
					{	
						var epcID	=	Domain+'/01/'+companyPrefixInput+'/21/'+data[arrCount];
						EpcLists.push(epcID);	
					}
					callback(EpcLists);
				}
			}
			
		}
		else if(input.AggregationEventParentID == 'SSCC (Al 00)')
		{	
			var GCP			=	String(input.AEPSSCC);
			var Extension	=	String(input.AEPSSCCExtDigit);		
			var Count		=	input.AEPSSCCCount;	
			
			if(syntaxType 	== 'urn')
			{
				GCP			=	GCP +'.'+Extension;
				
				if(input.SSCCType == 'userCustomized')
				{				
					var Start	=	parseInt(input.AEPSSCCStartValue,10);
					
					for(var i=0; i<=Count; i++)
					{
						var EPCValue	=	GCP + Start;
						var EPCValueLen	=	EPCValue.length;
						var StartLen	=	String(Start).length;
						var AppendLen	=	18-EPCValueLen+StartLen;
						var AppendVal	=	Start.toString().padStart(AppendLen,'0');
						var FinalVal	=	GCP + AppendVal;
						FinalVal		=	FinalVal.substring(0,18)
						var epcID		=	'urn:epc:id:sscc:'+FinalVal;
						EpcLists.push(epcID);
						Start++;
					}
					callback(EpcLists);
				}
				else if(input.SSCCType == 'random')
				{
					var GCPLen			=	GCP.length;
					var RequiredLen		=	18-GCPLen;
					var min_Length		=	RequiredLen;
					var max_Length		=	RequiredLen;
					var randomType		=	'numeric';
					var randomCount		=	parseInt(Count, 10);
					var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
					
					for(var r=0; r<data.length; r++)
					{
						var epcID 	=	'urn:epc:id:sscc:'+GCP+companyPrefixNormal(data[r],input.SSCCCompanyPrefix);
						EpcLists.push(epcID);
					}
					callback(EpcLists);
				}
			}
			else if(syntaxType == 'webURI')
			{
				if(input.SSCCType == 'userCustomized')
				{				
					var Start	=	parseInt(input.AEPSSCCStartValue,10);
					
					for(var i=0; i<=Count; i++)
					{
						var EPCValue	=	GCP + Start;
						var EPCValueLen	=	EPCValue.length;
						var StartLen	=	String(Start).length;
						var AppendLen	=	18-EPCValueLen+StartLen;
						var AppendVal	=	Start.toString().padStart(AppendLen,'0');
						var FinalVal	=	GCP + AppendVal;
						FinalVal		=	FinalVal.substring(0,18)
						var epcID		=	Domain+'/sscc/'+FinalVal;
						EpcLists.push(epcID);
						Start++;
					}
					callback(EpcLists);
				}
				else if(input.SSCCType == 'random')
				{
					var GCPLen			=	GCP.length;
					var RequiredLen		=	18-GCPLen;
					var min_Length		=	RequiredLen;
					var max_Length		=	RequiredLen;
					var randomType		=	'numeric';
					var randomCount		=	parseInt(Count, 10);
					var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
					
					for(var r=0; r<data.length; r++)
					{
						var epcID 	=	Domain+'/sscc/'+GCP+companyPrefixNormal(data[r],input.SSCCCompanyPrefix);
						EpcLists.push(epcID);
					}
					callback(EpcLists);
				}
			}
		}
		else if(input.AggregationEventParentID == 'SGLN (Al 414 + Al 254)')
		{
			var companyPrefixInput	=	input.SingleSGLNValue1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				
			
			if(syntaxType 	== 'urn')
			{
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
				
				if(input.sgtintype == 'none')
				{
					var epcID	=	'urn:epc:id:sgln:'+companyPrefixInput+"."+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				if(input.sgtintype == 'range')
				{
					for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
					{				
						var epcID	=	'urn:epc:id:sgln:'+companyPrefixInput+"."+id;
						EpcLists.push(epcID);
					}
					callback(EpcLists);
				}
				else if(input.sgtintype == 'random')
				{
					var min_Length	=	parseInt(input.radomMinLength, 10);
					var max_Length	=	parseInt(input.randomMaxLength, 10);
					var randomType	=	input.randomType;
					var randomCount	=	parseInt(input.randomCount, 10);
					//Call the function to generate the Random numbers then create XML elements
					var data 				= RandomGenerator(min_Length,max_Length,randomType,randomCount);
					
					for(var arrCount=0; arrCount<data.length; arrCount++)
					{			
						var epcID	=	'urn:epc:id:sgln:'+companyPrefixInput+"."+data[arrCount];
						EpcLists.push(epcID);	
					}
					callback(EpcLists);
				}
			}
			else if(syntaxType == 'webURI')
			{
				if(input.sgtintype == 'none')
				{
					var epcID	=	Domain+'/414/'+companyPrefixInput+'/254/'+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				if(input.sgtintype == 'range')
				{
					for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
					{				
						var epcID	=	Domain+'/414/'+companyPrefixInput+'/254/'+id;
						EpcLists.push(epcID);
					}
					callback(EpcLists);
				}
				else if(input.sgtintype == 'random')
				{
					var min_Length	=	parseInt(input.radomMinLength, 10);
					var max_Length	=	parseInt(input.randomMaxLength, 10);
					var randomType	=	input.randomType;
					var randomCount	=	parseInt(input.randomCount, 10);
					//Call the function to generate the Random numbers then create XML elements
					var data 				= RandomGenerator(min_Length,max_Length,randomType,randomCount);
					
					for(var arrCount=0; arrCount<data.length; arrCount++)
					{			
						var epcID	=	Domain+'/414/'+companyPrefixInput+'/254/'+data[arrCount];
						EpcLists.push(epcID);	
					}
					callback(EpcLists);
				}
			}		
		}
		else if(input.AggregationEventParentID == 'GRAI (Al 8003)')
		{
			if(syntaxType 	== 'urn')
			{
				var companyPrefixInput		=	input.AEPGRAI.toString();
				var companyPrefixPoint		=	input.AEPCompanyPrefix;			
					companyPrefixInput		=	companyPrefixNormal(companyPrefixInput,companyPrefixPoint);
					companyPrefixInput		=	companyPrefixInput.substring(0, 13)+'.'+companyPrefixInput.substring(14);
					
				if(input.sgtintype == 'none')
				{
					var epcID	=	'urn:epc:id:grai:'+companyPrefixInput+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				else if(input.sgtintype == 'range')
				{
					for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
					{
						var appendValue	=	companyPrefixInput+id;
							appendValue	=	appendValue.substring(0,30)
						var epcID		=	'urn:epc:id:grai:'+appendValue;
						EpcLists.push(epcID);
					}
					callback(EpcLists);
				}
				else if(input.sgtintype == 'random')
				{
					var min_Length	=	parseInt(input.radomMinLength, 10);
					var max_Length	=	parseInt(input.randomMaxLength, 10);
					var randomType	=	input.randomType;
					var randomCount	=	parseInt(input.randomCount, 10);
					//Call the function to generate the Random numbers then create XML elements
					var data 				= RandomGenerator(min_Length,max_Length,randomType,randomCount);
					
					for(var arrCount=0; arrCount<data.length; arrCount++)
					{		
						var appendValue	=	companyPrefixInput+data[arrCount];
							appendValue	=	appendValue.substring(0,30)
						var epcID		=	'urn:epc:id:grai:'+appendValue;
						EpcLists.push(epcID);	
					}
					callback(EpcLists);
				}
			}
			else if(syntaxType == 'webURI')
			{
				var companyPrefixInput		=	input.AEPGRAI.toString();
				
				if(input.sgtintype == 'none')
				{
					var epcID	=	Domain+'/grai/'+companyPrefixInput+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				else if(input.sgtintype == 'range')
				{
					for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
					{
						var appendValue	=	companyPrefixInput+id;
							appendValue	=	appendValue.substring(0,30)
						var epcID		=	Domain+'/grai/'+appendValue;
						EpcLists.push(epcID);
					}
					callback(EpcLists);
				}
				else if(input.sgtintype == 'random')
				{
					var min_Length	=	parseInt(input.radomMinLength, 10);
					var max_Length	=	parseInt(input.randomMaxLength, 10);
					var randomType	=	input.randomType;
					var randomCount	=	parseInt(input.randomCount, 10);
					//Call the function to generate the Random numbers then create XML elements
					var data 				= RandomGenerator(min_Length,max_Length,randomType,randomCount);
					
					for(var arrCount=0; arrCount<data.length; arrCount++)
					{		
						var appendValue	=	companyPrefixInput+data[arrCount];
							appendValue	=	appendValue.substring(0,30)
						var epcID		=	Domain+'/grai/'+appendValue;
						EpcLists.push(epcID);	
					}
					callback(EpcLists);
				}
			}
		}
		else if(input.AggregationEventParentID === 'GIAI (Al 8004)')
		{
			var companyPrefixInput	=	input.AEPGIAI.toString();
			
			if(input.sgtintype == 'none')
			{
				if(syntaxType 	== 'urn')
				{
					var epcID	=	'urn:epc:id:giai:'+companyPrefixInput+'.'+input.singleObjectId;
				}
				else if(syntaxType == 'webURI')
				{
					var epcID	=	Domain+'/giai/'+companyPrefixInput+input.singleObjectId;
				}			
				
				EpcLists.push(epcID);
				callback(EpcLists);	
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue	=	companyPrefixInput+'.'+id;
						appendValue	=	appendValue.substring(0,30)
						
					if(syntaxType 	== 'urn')
					{
						var epcID	=	'urn:epc:id:giai:'+appendValue;
					}
					else if(syntaxType == 'webURI')
					{
						var epcID	=	Domain+'/giai/'+appendValue;
					}					
					EpcLists.push(epcID);
				}
				callback(EpcLists);
			}
			else if(input.sgtintype == 'random')
			{
				var min_Length	=	parseInt(input.radomMinLength, 10);
				var max_Length	=	parseInt(input.randomMaxLength, 10);
				var randomType	=	input.randomType;
				var randomCount	=	parseInt(input.randomCount, 10);
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{		
					var appendValue	=	companyPrefixInput+'.'+data[arrCount];
						appendValue	=	appendValue.substring(0,30)
					
					if(syntaxType 	== 'urn')
					{
						var epcID		=	'urn:epc:id:giai:'+appendValue;
					}
					else if(syntaxType == 'webURI')
					{
						var epcID	=	Domain+'/giai/'+appendValue;
					}					
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID == 'GSRN (Al 8018)')
		{
			var companyPrefixInput	=	input.AEPGSRNCompanyPrefix.toString();
			var Count				=	parseInt(input.AEPGSRNSCount, 10);
				
			if(input.SSCCType == 'random')
			{
				var RequiredLen		=	18-companyPrefixInput.length;
				var min_Length		=	RequiredLen;
				var max_Length		=	RequiredLen;
				var randomType		=	'numeric';
				var randomCount		=	parseInt(Count, 10);
				var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				for(var r=0; r<data.length; r++)
				{
					if(syntaxType == 'urn')
					{
						var Final	=	companyPrefixInput+'.'+data[r];
						Final		=	Final.substring(0,18)
						var epcID 	=	'urn:epc:id:gsrn:'+Final;						
					}
					else if(syntaxType == 'webURI')
					{
						var epcID 	=	Domain+'/gsrn/'+companyPrefixInput+data[r];
					}
					EpcLists.push(epcID);
				}
				callback(EpcLists);			
			}
			else if(input.SSCCType == 'userCustomized')
			{
				var Start	=	parseInt(input.AEPGSRNStartValue,10);
				
				for(var i=0; i<=Count; i++)
				{
					var EPCValue	=	companyPrefixInput + Start;
					var EPCValueLen	=	EPCValue.length;
					var StartLen	=	String(Start).length;
					
					if(syntaxType == 'urn')
					{
						var AppendLen	=	17-EPCValueLen+StartLen;
						var AppendVal	=	Start.toString().padStart(AppendLen,'0');
						var FinalVal	=	companyPrefixInput + AppendVal;					
						var epcID 		=	'urn:epc:id:gsrn:'+companyPrefixInput+'.'+AppendVal;	
					}
					else if(syntaxType == 'webURI')
					{
						var AppendLen	=	18-EPCValueLen+StartLen;
						var AppendVal	=	Start.toString().padStart(AppendLen,'0');
						var FinalVal	=	companyPrefixInput + AppendVal;	
						var epcID		=	Domain+'/gsrn/'+FinalVal;
					}					
					EpcLists.push(epcID);
					Start++;
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GSRNP (Al 8017)')
		{
			var companyPrefixInput	=	input.AEPGSRNPCompanyPrefix.toString();
			var Count				=	parseInt(input.AEPGSRNPCount, 10);
				
			if(input.SSCCType == 'random')
			{
				var RequiredLen		=	18-companyPrefixInput.length;
				var min_Length		=	RequiredLen;
				var max_Length		=	RequiredLen;
				var randomType		=	'numeric';
				var randomCount		=	parseInt(Count, 10);
				var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				for(var r=0; r<data.length; r++)
				{
					if(syntaxType == 'urn')
					{
						var Final	=	companyPrefixInput+'.'+data[r];
						Final		=	Final.substring(0,18)
						var epcID 	=	'urn:epc:id:gsrnp:'+Final;						
					}
					else if(syntaxType == 'webURI')
					{
						var epcID 	=	Domain+'/gsrnp/'+companyPrefixInput+data[r];
					}
					EpcLists.push(epcID);
				}
				callback(EpcLists);			
			}
			else if(input.SSCCType == 'userCustomized')
			{
				var Start	=	parseInt(input.AEPGSRNPStartValue,10);
				
				for(var i=0; i<=Count; i++)
				{
					var EPCValue	=	companyPrefixInput + Start;
					var EPCValueLen	=	EPCValue.length;
					var StartLen	=	String(Start).length;
					
					if(syntaxType == 'urn')
					{
						var AppendLen	=	17-EPCValueLen+StartLen;
						var AppendVal	=	Start.toString().padStart(AppendLen,'0');
						var FinalVal	=	companyPrefixInput + AppendVal;					
						var epcID 		=	'urn:epc:id:gsrnp:'+companyPrefixInput+'.'+AppendVal;	
					}
					else if(syntaxType == 'webURI')
					{
						var AppendLen	=	18-EPCValueLen+StartLen;
						var AppendVal	=	Start.toString().padStart(AppendLen,'0');
						var FinalVal	=	companyPrefixInput + AppendVal;	
						var epcID		=	Domain+'/gsrnp/'+FinalVal;
					}					
					EpcLists.push(epcID);
					Start++;
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GDTI (Al 253)')
		{
			var companyPrefixInput		=	input.AEPGDTI.toString();
			var companyPrefixPoint		=	input.AEPCompanyPrefix;
			var companyPrefixInputURN	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
				companyPrefixInputURN	=	companyPrefixInputURN.slice(0,13)+'.'+companyPrefixInputURN.slice(14);			
				
			if(input.sgtintype == 'none')
			{
				var Serial				=	"";
				
				if(input.singleObjectId != undefined)
				{
					Serial		=	input.singleObjectId;
				}
				
				if(syntaxType == 'urn')
				{
					var epcID	=	'urn:epc:id:gdti:'+companyPrefixInputURN+Serial;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				else if(syntaxType == 'webURI')
				{
					var epcID	=	Domain+'/gdti/'+companyPrefixInput+Serial;
					EpcLists.push(epcID);
					callback(EpcLists);
				}					
			}
			else if(input.sgtintype == 'range')
			{	
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					if(syntaxType == 'urn')
					{
						var epcID	=	'urn:epc:id:gdti:'+companyPrefixInputURN+id;
						EpcLists.push(epcID);
					}
					else if(syntaxType == 'webURI')
					{
						var epcID	=	Domain+'/gdti/'+companyPrefixInput+id;
						EpcLists.push(epcID);
					}					
				}
				callback(EpcLists);
			}
			else if(input.sgtintype == 'random')
			{
				var min_Length	=	parseInt(input.radomMinLength, 10);
				var max_Length	=	parseInt(input.randomMaxLength, 10);
				var randomType	=	input.randomType;
				var randomCount	=	parseInt(input.randomCount, 10);
				//Call the function to generate the Random numbers then create XML elements
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{	
					if(syntaxType == 'urn')
					{
						var epcID		=	'urn:epc:id:gdti:'+companyPrefixInputURN+data[arrCount];
						EpcLists.push(epcID);	
					}
					else if(syntaxType == 'webURI')
					{
						var epcID	=	Domain+'/gdti/'+companyPrefixInput+data[arrCount];
						EpcLists.push(epcID);
					}				
				}
				callback(EpcLists);
			}			
		}
		else if(input.AggregationEventParentID === 'GCN (Al 255)')
		{
			var companyPrefixInput		=	input.AEPGSN.toString();
			var companyPrefixPoint		=	input.AEPCompanyPrefix;
			var Count					=	parseInt(input.AEPGCNCount, 10);
			var companyPrefixInputURN	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);			
				companyPrefixInputURN	=	companyPrefixInputURN.slice(0,13)+'.'+companyPrefixInputURN.slice(14);				
				
			if(input.SSCCType == 'random')
			{
				var RequiredLen		=	23-companyPrefixInput.length;
				var min_Length		=	RequiredLen;
				var max_Length		=	RequiredLen;
				var randomType		=	'numeric';
				var randomCount		=	parseInt(Count, 10);
				var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var r=0; r<data.length; r++)
				{
					if(syntaxType == 'urn')
					{
						var Final	=	companyPrefixInputURN+data[r];
						Final		=	Final.substring(0,25)
						var epcID 	=	'urn:epc:id:sgcn:'+Final;						
					}
					else if(syntaxType == 'webURI')
					{
						var epcID 	=	Domain+'/gcn/'+companyPrefixInput+data[r];
					}
					EpcLists.push(epcID);
				}
				callback(EpcLists);			
			}
			else if(input.SSCCType == 'userCustomized')
			{
				var Start	=	parseInt(input.AEPGCNStartValue,10);
				
				for(var i=0; i<=Count; i++)
				{					
					if(syntaxType == 'urn')
					{
						var Final		=	companyPrefixInputURN + Start;
							Final		=	Final.substring(0,25)				
						var epcID 		=	'urn:epc:id:sgcn:'+Final;	
					}
					else if(syntaxType == 'webURI')
					{
						var FinalVal	=	companyPrefixInput + Start;
							FinalVal	=	FinalVal.substring(0,25)	
						var epcID		=	Domain+'/gcn/'+FinalVal;
					}					
					EpcLists.push(epcID);
					Start++;
				}
				callback(EpcLists);
			}
			
		}
		else if(input.AggregationEventParentID === 'CPI (Al 8010 8011)')
		{
			var companyPrefixInput		=	input.AEPCPI1.toString();
			var companyPrefixPoint		=	input.AEPCompanyPrefix;
			var Count					=	input.AEPCPICount;
			var companyPrefixInputURN	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);	
			
			if(input.SSCCType == 'random')
			{
				var RequiredLen		=	26-companyPrefixInput.length;
				var min_Length		=	RequiredLen;
				var max_Length		=	RequiredLen;
				var randomType		=	'numeric';
				var randomCount		=	parseInt(Count, 10);
				var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				for(var r=0; r<data.length; r++)
				{
					if(syntaxType == 'urn')
					{
						var Final	=	companyPrefixInputURN+'.'+data[r];
						Final		=	Final.substring(0,30)
						var epcID 	=	'urn:epc:id:cpi:'+Final;						
					}
					else if(syntaxType == 'webURI')
					{
						var epcID 	=	Domain+'/cpid/'+companyPrefixInput+data[r];
					}
					EpcLists.push(epcID);
				}
				callback(EpcLists);		
			}
			else if(input.SSCCType == 'userCustomized')
			{
				var Start	=	parseInt(input.AEPCPIStartValue,10);
				
				for(var i=0; i<=Count; i++)
				{					
					if(syntaxType == 'urn')
					{				
						var epcID 		=	'urn:epc:id:cpi:'+companyPrefixInputURN+'.'+Start;	
					}
					else if(syntaxType == 'webURI')
					{
						var epcID		=	Domain+'/cpid/'+companyPrefixInput+'/'+Start;
					}					
					EpcLists.push(epcID);
					Start++;
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GINC (Al 401)')
		{
			var companyPrefixInput	=	input.AECGINC.toString();
			
			if(input.sgtintype == 'none')
			{
				if(syntaxType == 'urn')
				{
					var epcID			=	'urn:epc:id:ginc:'+companyPrefixInput+'.'+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				else if(syntaxType == 'webURI')
				{
					var epcID			=	Domain+'/ginc/'+companyPrefixInput+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					if(syntaxType == 'urn')
					{
						var appendValue			=	companyPrefixInput+"."+id;
						var epcID				=	'urn:epc:id:ginc:'+appendValue;
						EpcLists.push(epcID);
					}
					else if(syntaxType == 'webURI')
					{
						var epcID			=	Domain+'/ginc/'+companyPrefixInput+id;
						EpcLists.push(epcID);
					}						
				}
				callback(EpcLists);
			}
			else if(input.sgtintype == 'random')
			{
				var min_Length	=	parseInt(input.radomMinLength, 10);
				var max_Length	=	parseInt(input.randomMaxLength, 10);
				var randomType	=	input.randomType;
				var randomCount	=	parseInt(input.randomCount, 10);
				//Call the function to generate the Random numbers then create XML elements
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{	
					if(syntaxType == 'urn')
					{
						var appendValue	=	companyPrefixInput+"."+data[arrCount];
						var epcID		=	'urn:epc:id:ginc:'+appendValue;
						EpcLists.push(epcID);		
					}
					else if(syntaxType == 'webURI')
					{
						var epcID		=	Domain+'/ginc/'+companyPrefixInput+data[arrCount];
						EpcLists.push(epcID);
					}					
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GSIN (Al 402)')
		{
			var companyPrefixInput		=	input.AEPGSIN.toString();
			var Count					=	input.AEPGSINCount;
			
			if(input.SSCCType == 'random')
			{
				var RequiredLen		=	17-companyPrefixInput.length;
				var min_Length		=	RequiredLen;
				var max_Length		=	RequiredLen;
				var randomType		=	'numeric';
				var randomCount		=	parseInt(Count, 10);
				var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				for(var r=0; r<data.length; r++)
				{
					if(syntaxType == 'urn')
					{
						var Final	=	companyPrefixInput+'.'+data[r];
						Final		=	Final.substring(0,17)
						var epcID 	=	'urn:epc:id:gsin:'+Final;						
					}
					else if(syntaxType == 'webURI')
					{
						var epcID 	=	Domain+'/gsin/'+companyPrefixInput+data[r];
					}
					EpcLists.push(epcID);
				}
				callback(EpcLists);		
			}
			else if(input.SSCCType == 'userCustomized')
			{
				var Start	=	parseInt(input.AEPGSINStartValue,10);						
				
				for(var i=0; i<=Count; i++)
				{		
					var EPCValue	=	companyPrefixInput + Start;
					var EPCValueLen	=	EPCValue.length;
					var StartLen	=	String(Start).length;
						
					if(syntaxType == 'urn')
					{						
						var AppendLen	=	16-EPCValueLen+StartLen;
						var AppendVal	=	Start.toString().padStart(AppendLen,'0');
						var FinalVal	=	companyPrefixInput + '.' + AppendVal;
						FinalVal		=	FinalVal.substring(0,17)
						var epcID 		=	'urn:epc:id:gsin:'+FinalVal;	
					}
					else if(syntaxType == 'webURI')
					{
						var AppendLen	=	17-EPCValueLen+StartLen;
						var AppendVal	=	Start.toString().padStart(AppendLen,'0');
						var FinalVal	=	companyPrefixInput + AppendVal;
						FinalVal		=	FinalVal.substring(0,17)
						var epcID		=	Domain+'/gsin/'+FinalVal;
					}					
					EpcLists.push(epcID);
					Start++;
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'ITIP (Al 8006 + Al 21)')
		{
			var companyPrefixInput	=	input.AEPITIP1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			
			if(syntaxType 	== 'urn')
			{
				for(var x=6; x<=12;x++)	
				{	
					if(x == companyPrefixPoint)
					{	var FirstChar		=	companyPrefixInput.charAt(0);
						companyPrefixInput 	= 	[companyPrefixInput.slice(1, x+1), "." , FirstChar , companyPrefixInput.slice(x+1,companyPrefixInput.length)].join('');
						break;
					}
				}				
				companyPrefixInput	=	companyPrefixInput.slice(0,14)+'.'+companyPrefixInput.slice(15,17)+'.'+companyPrefixInput.slice(17);
				
				if(input.sgtintype == 'none')
				{
					var epcID	=	'urn:epc:id:itip:'+companyPrefixInput+"."+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				if(input.sgtintype == 'range')
				{
					for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
					{				
						var epcID	=	'urn:epc:id:itip:'+companyPrefixInput+"."+id;
						EpcLists.push(epcID);
					}
					callback(EpcLists);
				}
				else if(input.sgtintype == 'random')
				{
					var min_Length	=	parseInt(input.radomMinLength, 10);
					var max_Length	=	parseInt(input.randomMaxLength, 10);
					var randomType	=	input.randomType;
					var randomCount	=	parseInt(input.randomCount, 10);
					//Call the function to generate the Random numbers then create XML elements
					var data 				= RandomGenerator(min_Length,max_Length,randomType,randomCount);
					
					for(var arrCount=0; arrCount<data.length; arrCount++)
					{			
						var epcID	=	'urn:epc:id:itip:'+companyPrefixInput+"."+data[arrCount];
						EpcLists.push(epcID);	
					}
					callback(EpcLists);
				}
			}
			else if(syntaxType == 'webURI')
			{
				if(input.sgtintype == 'none')
				{
					var epcID	=	Domain+'/itip/'+companyPrefixInput+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				if(input.sgtintype == 'range')
				{
					for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
					{	
						var epcID	=	Domain+'/itip/'+companyPrefixInput+id;
						EpcLists.push(epcID);
					}
					callback(EpcLists);
				}
				else if(input.sgtintype == 'random')
				{
					var min_Length	=	parseInt(input.radomMinLength, 10);
					var max_Length	=	parseInt(input.randomMaxLength, 10);
					var randomType	=	input.randomType;
					var randomCount	=	parseInt(input.randomCount, 10);
					//Call the function to generate the Random numbers then create XML elements
					var data 				= RandomGenerator(min_Length,max_Length,randomType,randomCount);
					
					for(var arrCount=0; arrCount<data.length; arrCount++)
					{	
						var epcID	=	Domain+'/itip/'+companyPrefixInput+data[arrCount];
						EpcLists.push(epcID);	
					}
					callback(EpcLists);
				}
			}
		}
		else if(input.AggregationEventParentID === 'UPI_UI (Al 01 + Al 235)')
		{
			var companyPrefixInput	=	input.AEPUPIUI1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			var CompanyPrefixURN	=	companyPrefix(companyPrefixInput, companyPrefixPoint);
			
			if(input.sgtintype == 'none')
			{
				if(syntaxType == 'urn')
				{
					var epcID			=	'urn:epc:id:upui:'+CompanyPrefixURN+'.'+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
				else if(syntaxType == 'webURI')
				{
					var epcID			=	Domain+'/upui/'+companyPrefixInput+input.singleObjectId;
					EpcLists.push(epcID);
					callback(EpcLists);
				}
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					if(syntaxType == 'urn')
					{
						var appendValue			=	CompanyPrefixURN+"."+id;
						var epcID				=	'urn:epc:id:upui:'+appendValue;
						EpcLists.push(epcID);
					}
					else if(syntaxType == 'webURI')
					{
						var epcID			=	Domain+'/upui/'+companyPrefixInput+id;
						EpcLists.push(epcID);
					}						
				}
				callback(EpcLists);
			}
			else if(input.sgtintype == 'random')
			{
				var min_Length	=	parseInt(input.radomMinLength, 10);
				var max_Length	=	parseInt(input.randomMaxLength, 10);
				var randomType	=	input.randomType;
				var randomCount	=	parseInt(input.randomCount, 10);
				//Call the function to generate the Random numbers then create XML elements
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{	
					if(syntaxType == 'urn')
					{
						var appendValue	=	CompanyPrefixURN+"."+data[arrCount];
						var epcID		=	'urn:epc:id:upui:'+appendValue;
						EpcLists.push(epcID);		
					}
					else if(syntaxType == 'webURI')
					{
						var epcID		=	Domain+'/upui/'+companyPrefixInput+data[arrCount];
						EpcLists.push(epcID);
					}					
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GID')
		{
			console.log("ONE");
			var Mgr		=	input.AEPGID1.toString();
			var Class	=	input.AEPGID2.toString();
			var Count	=	input.GIDCount;
			
			if(input.SSCCType == 'random')
			{
				var RequiredLen		=	11;
				var min_Length		=	RequiredLen;
				var max_Length		=	RequiredLen;
				var randomType		=	'numeric';
				var randomCount		=	parseInt(Count, 10);
				var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var r=0; r<data.length; r++)
				{
					if(syntaxType == 'urn')
					{
						var epcID 	=	'urn:epc:id:gid:' + Mgr +'.'+ Class+'.'+ data[r];						
					}
					else if(syntaxType == 'webURI')
					{
						var epcID 	=	Domain + '/gid/' + Mgr + Class + data[r];
					}
					EpcLists.push(epcID);
				}
				callback(EpcLists);		
			}
			else if(input.SSCCType == 'userCustomized')
			{
				var Start	=	parseInt(input.GIDStartValue,10);						
				
				for(var i=0; i<=Count; i++)
				{		
					var StartLen	=	String(Start).length;
					var AppendLen	=	11-StartLen;
					var AppendVal	=	Start.toString().padStart(AppendLen,'9');
					
					if(syntaxType == 'urn')
					{	
						var epcID 		=	'urn:epc:id:gid:'+Mgr+'.'+Class+'.'+AppendVal;	
					}
					else if(syntaxType == 'webURI')
					{
						var epcID		=	Domain+'/gid/' + Mgr + Class + AppendVal;
					}					
					EpcLists.push(epcID);
					Start++;
				}
				callback(EpcLists);
			}
			
		}
		else if(input.AggregationEventParentID == 'USDoD')
		{			
			var Cage	=	input.AEPDSDOD1.toString();
			var Count	=	input.USDoDCount;
			
			if(input.SSCCType == 'random')
			{
				var RequiredLen		=	11;
				var min_Length		=	RequiredLen;
				var max_Length		=	RequiredLen;
				var randomType		=	'numeric';
				var randomCount		=	parseInt(Count, 10);
				var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var r=0; r<data.length; r++)
				{
					if(syntaxType == 'urn')
					{
						var epcID 	=	'urn:epc:id:usdod:' + Cage + '.' + data[r];						
					}
					else if(syntaxType == 'webURI')
					{
						var epcID 	=	Domain + '/usdod/' + Cage + data[r];
					}
					EpcLists.push(epcID);
				}
				callback(EpcLists);		
			}
			else if(input.SSCCType == 'userCustomized')
			{
				var Start	=	parseInt(input.USDoDStartValue,10);						
				
				for(var i=0; i<=Count; i++)
				{		
					var StartLen	=	String(Start).length;
					var AppendLen	=	11-StartLen;
					var AppendVal	=	Start.toString().padStart(AppendLen,'9');
					
					if(syntaxType == 'urn')
					{	
						var epcID 		=	'urn:epc:id:usdod:' + Cage + '.'+ AppendVal;	
					}
					else if(syntaxType == 'webURI')
					{
						var epcID		=	Domain+'/usdod/' + Cage + AppendVal;
					}					
					EpcLists.push(epcID);
					Start++;
				}
				callback(EpcLists);
			}			
		}
		else if(input.AggregationEventParentID === 'ADI')
		{
			var Cage	=	input.AEPADI1.toString();
			var Count	=	input.ADICount;
			var PNO		=	""
			
			if(input.AEPADI2 != undefined)
			{
				PNO		=	input.AEPADI2.toString();
			}			
			
			if(input.SSCCType == 'random')
			{
				var RequiredLen		=	11;
				var min_Length		=	RequiredLen;
				var max_Length		=	RequiredLen;
				var randomType		=	'numeric';
				var randomCount		=	parseInt(Count, 10);
				var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var r=0; r<data.length; r++)
				{
					if(syntaxType == 'urn')
					{
						var epcID 	=	'urn:epc:id:adi:' + Cage + '.' + PNO + '.' + data[r];						
					}
					else if(syntaxType == 'webURI')
					{
						var epcID 	=	Domain + '/adi/' + Cage + PNO + data[r];	
					}
					EpcLists.push(epcID);
				}
				callback(EpcLists);		
			}
			else if(input.SSCCType == 'userCustomized')
			{
				var Start	=	parseInt(input.ADIStartValue,10);						
				
				for(var i=0; i<=Count; i++)
				{		
					var StartLen	=	String(Start).length;
					var AppendLen	=	11-StartLen;
					var AppendVal	=	Start.toString().padStart(AppendLen,'9');
					
					if(syntaxType == 'urn')
					{	
						var epcID 		=	'urn:epc:id:adi:' + Cage + '.' + PNO + '.' + AppendVal;	
					}
					else if(syntaxType == 'webURI')
					{
						var epcID		=	Domain+'/adi/' + Cage + PNO + AppendVal;
					}					
					EpcLists.push(epcID);
					Start++;
				}
				callback(EpcLists);
			}	
		}
		else if(input.AggregationEventParentID === 'BIC')
		{
			EpcLists.push(input.AEPBIC);
			callback(EpcLists);
		}
		else if(input.AggregationEventParentID === 'IMOVN')
		{
			var Count	=	input.IMOVCount;
			
			if(input.SSCCType == 'random')
			{
				var RequiredLen		=	7;
				var min_Length		=	RequiredLen;
				var max_Length		=	RequiredLen;
				var randomType		=	'numeric';
				var randomCount		=	parseInt(Count, 10);
				var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var r=0; r<data.length; r++)
				{
					if(syntaxType == 'urn')
					{
						var epcID 	=	'urn:epc:id:imovn:' + data[r];						
					}
					else if(syntaxType == 'webURI')
					{
						var epcID 	=	Domain + '/imovn/' + data[r];	
					}
					EpcLists.push(epcID);
				}
				callback(EpcLists);		
			}
			else if(input.SSCCType == 'userCustomized')
			{
				var Start	=	parseInt(input.IMOVStartValue,10);						
				
				for(var i=0; i<=Count; i++)
				{		
					var StartLen	=	String(Start).length;
					var AppendLen	=	7-StartLen;
					var AppendVal	=	Start.toString().padStart(StartLen+AppendLen,'9');
					
					if(syntaxType == 'urn')
					{	
						var epcID 		=	'urn:epc:id:imovn:'+ AppendVal;	
					}
					else if(syntaxType == 'webURI')
					{
						var epcID		=	Domain+'/imovn/' + AppendVal;
					}					
					EpcLists.push(epcID);
					Start++;
				}
				callback(EpcLists);
			}	
		}
		else if(input.ObjectEventEpcsType === 'Enter a URI Manually')
		{
			EpcLists.push(input.AEPManualURI);
			callback(EpcLists);
		}
	}
	else
	{
		//If single value needs to be created for the PARENT ID
		if(input.AggregationEventParentID === 'SGTIN (Al 01 + Al 21)')
		{
			var companyPrefixInput	=	input.AEPSGTIN1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			
			if(syntaxType 	== 'urn')
			{
				companyPrefixInput 	=	companyPrefix(companyPrefixInput, companyPrefixPoint);
				var epcID			=	'urn:epc:id:sgtin:'+companyPrefixInput+'.'+input.AEPSGTIN2;
				callback(epcID)
			}
			else if(syntaxType == 'webURI')
			{
				var epcID			=	Domain+'/01/'+companyPrefixInput+'/21/'+input.AEPSGTIN2;
				callback(epcID);
			}
			
		}
		else if(input.AggregationEventParentID === 'SSCC (Al 00)')
		{
			var GCP			=	String(input.AEPSSCC);
			var Extension	=	String(input.AEPSSCCExtDigit);
			var Serial		=	String(input.AEPSSCCSingleSerial);			
			
			if(syntaxType 	== 'urn')
			{
				var FinalValue	=	GCP + '.' + Extension + Serial;
				if(FinalValue.length >= 18)
				{					
					FinalValue		=	FinalValue.substring(0,18);
					var epcID		=	'urn:epc:id:sscc:'+FinalValue;
					callback(epcID);	
				}
				else
				{
					FinalValueLength	=	FinalValue.length;
					var appendLength	=	18-FinalValueLength;
						appendLength	=	appendLength + Serial.length;
					var AppendVal		=	Serial.toString().padStart(appendLength,'0');
					FinalValue			=	GCP + '.' + Extension + AppendVal;
					var epcID		=	'urn:epc:id:sscc:'+FinalValue;
					callback(epcID);
				}
			}
			else if(syntaxType == 'webURI')
			{
				var FinalValue	=	GCP + Extension + Serial;
				if(FinalValue.length >= 18)
				{					
					FinalValue		=	FinalValue.substring(0,18);
					var epcID		=	Domain+'/sscc/'+FinalValue;
					callback(epcID);	
				}
				else
				{
					FinalValueLength	=	FinalValue.length;
					var appendLength	=	18-FinalValueLength;
						appendLength	=	appendLength + Serial.length;
					var AppendVal		=	Serial.toString().padStart(appendLength,'0');
					FinalValue			=	GCP + Extension + AppendVal;
					var epcID			=	Domain+'/sscc/'+FinalValue;
					callback(epcID);
				}
			}				
		}
		else if(input.AggregationEventParentID == 'SGLN (Al 414 + Al 254)')
		{
			var companyPrefixInput	=	input.SingleSGLNValue1;
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			
			if(syntaxType 	== 'urn')
			{				
				companyPrefixInput	=	companyPrefixNormal(companyPrefixInput,companyPrefixPoint);
				var epcID			=	'urn:epc:id:sgln:'+companyPrefixInput+input.SingleSGLNValue2;
				callback(epcID);
			}
			else if(syntaxType == 'webURI')
			{
				var epcID			=	Domain+'/414/'+companyPrefixInput+'/254/'+input.SingleSGLNValue2;
				callback(epcID);
			}						
		}
		else if(input.AggregationEventParentID === 'GRAI (Al 8003)')
		{
			var companyPrefixInput	=	input.AEPGRAI.toString();
			var Serial				=	input.AEPGRAISerial;
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			
			if(syntaxType 	== 'urn')
			{				
				companyPrefixInput 		=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
				companyPrefixInput		=	companyPrefixInput.substring(0, 13)+'.'+companyPrefixInput.substring(14);				
				var epcID				=	'urn:epc:id:grai:'+companyPrefixInput+Serial;
				callback(epcID)
			}
			else if(syntaxType == 'webURI')
			{
				var epcID				=	Domain+'/grai/'+companyPrefixInput+Serial;
				callback(epcID)
			}			
		}
		else if(input.AggregationEventParentID === 'GIAI (Al 8004)')
		{
			var companyPrefixInput	=	input.AEPGIAI.toString();	
			
			if(syntaxType 	== 'urn')
			{				
				var epcID			=	'urn:epc:id:giai:'+companyPrefixInput+'.'+input.AEPGIAISERIAL;
				callback(epcID)
			}
			else if(syntaxType == 'webURI')
			{
				var epcID			=	Domain+'/giai/'+companyPrefixInput+input.AEPGIAISERIAL;
				callback(epcID);
			}				
		}
		else if(input.AggregationEventParentID === 'GSRN (Al 8018)')
		{					
			var companyPrefixInput	=	input.AEPGSRNCompanyPrefix.toString();
			var Serial				=	input.AEPGSRNSingleSerial.toString();
			
			if(syntaxType 	== 'urn')
			{
				var FinalValue		=	companyPrefixInput+'.'+Serial;
				FinalValueLength	=	FinalValue.length;
				
				if(FinalValueLength >= 18)
				{
					FinalValue		=	FinalValue.substring(0,18);
					var epcID		=	'urn:epc:id:gsrn:'+FinalValue;
					callback(epcID)
				}
				else
				{
					var appendLength=	18-FinalValueLength;
					appendLength	=	appendLength + Serial.length;
					var AppendVal	=	Serial.toString().padStart(appendLength,'0');
					var epcID		=	'urn:epc:id:gsrn:'+companyPrefixInput+'.'+AppendVal;
					callback(epcID)
				}				
			}
			else if(syntaxType == 'webURI')
			{
				var FinalValue		=	companyPrefixInput+Serial;
				FinalValueLength	=	FinalValue.length;
				
				if(FinalValueLength >= 18)
				{
					FinalValue		=	FinalValue.substring(0,18);
					var epcID		=	Domain+'/gsrn/'+FinalValue;
					callback(epcID);
				}
				else
				{
					var appendLength=	18-FinalValueLength;
					appendLength	=	appendLength + Serial.length;
					var AppendVal	=	Serial.toString().padStart(appendLength,'0');
					var epcID		=	Domain+'/gsrn/'+companyPrefixInput+AppendVal;
					callback(epcID);
				}				
			}			
		}	
		else if(input.AggregationEventParentID === 'GSRNP (Al 8017)')
		{
			var companyPrefixInput	=	input.AEPGSRNPCompanyPrefix.toString();
			var Serial				=	input.AEPGSRNPSingleSerial.toString();
			
			if(syntaxType 	== 'urn')
			{
				var FinalValue		=	companyPrefixInput+'.'+Serial;
				FinalValueLength	=	FinalValue.length;
				
				if(FinalValueLength >= 18)
				{
					FinalValue		=	FinalValue.substring(0,18);
					var epcID		=	'urn:epc:id:gsrnp:'+FinalValue;
					callback(epcID)
				}
				else
				{
					var appendLength=	18-FinalValueLength;
					appendLength	=	appendLength + Serial.length;
					var AppendVal	=	Serial.toString().padStart(appendLength,'0');
					var epcID		=	'urn:epc:id:gsrnp:'+companyPrefixInput+'.'+AppendVal;
					callback(epcID)
				}				
			}
			else if(syntaxType == 'webURI')
			{
				var FinalValue		=	companyPrefixInput+Serial;
				FinalValueLength	=	FinalValue.length;
				
				if(FinalValueLength >= 18)
				{
					FinalValue		=	FinalValue.substring(0,18);
					var epcID		=	Domain+'/gsrnp/'+FinalValue;
					callback(epcID);
				}
				else
				{
					var appendLength=	18-FinalValueLength;
					appendLength	=	appendLength + Serial.length;
					var AppendVal	=	Serial.toString().padStart(appendLength,'0');
					var epcID		=	Domain+'/gsrnp/'+companyPrefixInput+AppendVal;
					callback(epcID);
				}				
			}	
		}
		else if(input.AggregationEventParentID === 'GDTI (Al 253)')
		{
			var companyPrefixInput	=	input.AEPGDTI.toString();
			var Serial				=	"";
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			
			if(input.AEPGDTISerial != undefined)
			{
				Serial				=	input.AEPGDTISerial.toString();
			}
			
			if(syntaxType 	== 'urn')
			{
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
				companyPrefixInput	=	companyPrefixInput.slice(0,13)+'.'+companyPrefixInput.slice(14);
				var epcID		=	'urn:epc:id:gdti:'+companyPrefixInput+Serial;
				callback(epcID)
			}
			else if(syntaxType == 'webURI')
			{
				var epcID		=	Domain+'/gdti/'+companyPrefixInput+Serial;
				callback(epcID);
			}		
		}
		else if(input.AggregationEventParentID === 'GCN (Al 255)')
		{
			var companyPrefixInput	=	input.AEPGSN.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			var Serial				=	"";
			
			if(input.AEPGCNSerial != undefined)
			{
				Serial				=	input.AEPGCNSerial.toString();
			}
			
			if(syntaxType 	== 'urn')
			{
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
				companyPrefixInput	=	companyPrefixInput.slice(0,13)+'.'+companyPrefixInput.slice(14);
				var epcID			=	'urn:epc:id:sgcn:'+companyPrefixInput+Serial;
				callback(epcID)
			}
			else if(syntaxType == 'webURI')
			{
				var epcID			=	Domain+'/gcn/'+companyPrefixInput+Serial;
				callback(epcID);
			}	
			
		}
		else if(input.AggregationEventParentID === 'CPI (Al 8010 8011)')
		{
			var companyPrefixInput	=	input.AEPCPI1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			var Serial				=	input.AEPCPISingleValue;
				
			if(syntaxType 	== 'urn')
			{
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
				var epcID			=	'urn:epc:id:cpi:'+companyPrefixInput+'.'+Serial;
				callback(epcID)				
			}
			else if(syntaxType == 'webURI')
			{
				var epcID			=	Domain+'/cpid/'+companyPrefixInput+Serial;
				callback(epcID);
			}			
		}
		else if(input.AggregationEventParentID === 'GINC (Al 401)')
		{
			var companyPrefixInput	=	input.AECGINC.toString();
			var Serial				=	input.AECGINCSingleValue;
			
			if(syntaxType 	== 'urn')
			{
				var epcID			=	'urn:epc:id:ginc:'+companyPrefixInput+'.'+Serial;
				callback(epcID)				
			}
			else if(syntaxType == 'webURI')
			{
				var epcID			=	Domain+'/ginc/'+companyPrefixInput+Serial;
				callback(epcID);
			}
		}
		else if(input.AggregationEventParentID === 'GSIN (Al 402)')
		{
			var companyPrefixInput	=	input.AEPGSIN.toString();
			var Serial				=	input.AEPGSINSingleValue;
			
			if(syntaxType 	== 'urn')
			{
				var FinalValue		=	companyPrefixInput+'.'+Serial;
				FinalValueLength	=	FinalValue.length;
				
				if(FinalValueLength >= 17)
				{
					FinalValue		=	FinalValue.substring(0,17);
					var epcID		=	'urn:epc:id:gsin:'+FinalValue;
					callback(epcID)
				}
				else
				{
					var appendLength=	17-FinalValueLength;
					appendLength	=	appendLength + Serial.length;
					var AppendVal	=	Serial.toString().padStart(appendLength,'0');
					var epcID		=	'urn:epc:id:gsin:'+companyPrefixInput+'.'+AppendVal;
					callback(epcID)
				}		
			}
			else if(syntaxType == 'webURI')
			{
				var FinalValue		=	companyPrefixInput+Serial;
				FinalValueLength	=	FinalValue.length;
				
				if(FinalValueLength >= 17)
				{
					FinalValue		=	FinalValue.substring(0,17);
					var epcID		=	Domain+'/gsin/'+FinalValue;
					callback(epcID);
				}
				else
				{
					var appendLength=	17-FinalValueLength;
					appendLength	=	appendLength + Serial.length;
					var AppendVal	=	Serial.toString().padStart(appendLength,'0');
					var epcID		=	Domain+'/gsin/'+companyPrefixInput+AppendVal;
					callback(epcID);
				}
			}
		}
		else if(input.AggregationEventParentID === 'ITIP (Al 8006 + Al 21)')
		{
			var companyPrefixInput	=	input.AEPITIP1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			
			if(syntaxType 	== 'urn')
			{
				for(var x=6; x<=12;x++)	
				{	
					if(x == companyPrefixPoint)
					{	var FirstChar		=	companyPrefixInput.charAt(0);
						companyPrefixInput 	= 	[companyPrefixInput.slice(1, x+1), "." , FirstChar , companyPrefixInput.slice(x+1,companyPrefixInput.length)].join('');
						break;
					}
				}				
				companyPrefixInput	=	companyPrefixInput.slice(0,14)+'.'+companyPrefixInput.slice(15,17)+'.'+companyPrefixInput.slice(17);
				var epcID			=	'urn:epc:id:itip:'+companyPrefixInput+'.'+input.AEPITIP2;
				callback(epcID)
			}
			else if(syntaxType == 'webURI')
			{
				var epcID			=	Domain+'/itip/'+companyPrefixInput+input.AEPITIP2;
				callback(epcID);
			}
		}
		else if(input.AggregationEventParentID === 'UPI_UI (Al 01 + Al 235)')
		{
			var companyPrefixInput	=	input.AEPUPIUI1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			var Serial				=	input.AEPUPIUI2.toString();
			
			if(syntaxType 	== 'urn')
			{
				companyPrefixInput 	=	companyPrefix(companyPrefixInput, companyPrefixPoint);
				var epcID			=	'urn:epc:id:upui:'+companyPrefixInput+'.'+Serial;
				callback(epcID)
			}
			else if(syntaxType == 'webURI')
			{
				var epcID			=	Domain+'/upui/'+companyPrefixInput+Serial;
				callback(epcID)
			}
			
		}
		else if(input.AggregationEventParentID === 'GID')
		{
			if(syntaxType 	== 'urn')
			{
				var GIDEPCId	=	'urn:epc:id:gid:'+input.AEPGID1+'.'+input.AEPGID2+'.'+input.AEPGID3;
				callback(GIDEPCId);
			}
			else if(syntaxType == 'webURI')
			{
				var GIDEPCId	=	Domain+'/gid/'+input.AEPGID1+input.AEPGID2+input.AEPGID3;
				callback(GIDEPCId);
			}			
		}
		else if(input.AggregationEventParentID === 'USDoD')
		{
			if(syntaxType 	== 'urn')
			{
				var USDODEPCId	=	'urn:epc:id:usdod:'+input.AEPDSDOD1+'.'+input.AEPDSDOD2;
				callback(USDODEPCId);
			}
			else if(syntaxType == 'webURI')
			{
				var USDODEPCId	=	Domain+'/usdod/'+input.AEPDSDOD1+input.AEPDSDOD1;
				callback(USDODEPCId);
			}
		}
		else if(input.AggregationEventParentID === 'ADI')
		{
			var PNO		=	""
			
			if(input.AEPADI2 != undefined)
			{
				PNO		=	input.AEPADI2.toString();
			}	
			
			if(syntaxType 	== 'urn')
			{
				var ADIEPCId	=	'urn:epc:id:adi:'+input.AEPADI1+'.'+PNO+'.'+input.AEPADI3;
				callback(ADIEPCId);
			}
			else if(syntaxType == 'webURI')
			{
				var ADIEPCId	=	'urn:epc:id:adi:'+input.AEPADI1+PNO+input.AEPADI3;
				callback(ADIEPCId);
			}			
		}
		else if(input.AggregationEventParentID === 'BIC')
		{
			callback(input.AEPBIC);
		}
		else if(input.AggregationEventParentID === 'IMOVN')
		{
			if(syntaxType 	== 'urn')
			{
				var IMOVNEPCId	=	'urn:epc:id:imovn:'+input.AEPIMOVN;
				callback(IMOVNEPCId);
			}
			else if(syntaxType == 'webURI')
			{
				var IMOVNEPCId	=	'urn:epc:id:imovn:'+input.AEPIMOVN;
				callback(IMOVNEPCId);
			}
			
		}
		else if(input.ObjectEventEpcsType === 'Enter a URI Manually')
		{
			callback(input.AEPManualURI);
		}
	}
}

//Company Prefix append without switch of first character
function companyPrefixNormal(companyPrefixInput, companyPrefixPoint)
{
	for(var x=6; x<=12;x++)	
	{	
		if(x == companyPrefixPoint)
		{	
			companyPrefixInput = [companyPrefixInput.slice(0, x), ".", companyPrefixInput.slice(x)].join('');
			break;
		}
	}
	return companyPrefixInput;
}


//Function to calculate the Company prefix based on decimal point
function companyPrefix(companyPrefixInput, companyPrefixPoint)
{	
	for(var x=6; x<=12;x++)	
	{	
		if(x == companyPrefixPoint)
		{	var FirstChar		=	companyPrefixInput.charAt(0);
			companyPrefixInput 	= 	[companyPrefixInput.slice(1, x+1), "." , FirstChar , companyPrefixInput.slice(x+1,companyPrefixInput.length-1)].join('');
			break;
		}
	}
	return companyPrefixInput;
}

//This function is executed when the  call is made form XML or JSON file 
function RandomGenerator(min_Length,max_Length,randomType,randomCount){
	
	//If numeric then generate Numeric only Random Data
	randomArray = [];
	
	if(randomType	== 'numeric')
	{	
		var itemProcessed 	= 0;
		var charset     	= "123456789";
		
		for(var id=1;id<=randomCount;id++)
		{
			var charPicker  = Math.floor(Math.random() * (max_Length - min_Length + 1) + min_Length);
			var randomId    = '';
			
			for (var i = 0; i < charPicker; i++)
			{
				randomId += charset.charAt(Math.floor(Math.random() * charset.length));
			}
			
			randomArray.push(randomId);	
			itemProcessed++;
			
			if(itemProcessed == randomCount)
			{
				return randomArray;
			}
		}
	}
	else if(randomType	== 'alphaNumeric')
	{
		var itemProcessed 	= 0;
		var charset     	= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		
		for(var id=0;id<randomCount;id++)
		{
			var charPicker  = Math.floor(Math.random() * (max_Length - min_Length + 1) + min_Length);
			var randomId    = '';
			
			for (var i = 0; i < charPicker; i++)
			{
				randomId += charset.charAt(Math.floor(Math.random() * charset.length));
			}
			
			randomArray.push(randomId);
			itemProcessed++;
			
			if(itemProcessed == randomCount)
			{
				return randomArray;
			}
		}
	}
	else if(randomType	== 'alphaNumericwithSpecial')
	{
		var itemProcessed 	= 0;
		var charset     	= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
		
		for(var id=0;id<randomCount;id++)
		{
			var charPicker  = Math.floor(Math.random() * (max_Length - min_Length + 1) + min_Length);
			var randomId    = '';
			
			for (var i = 0; i < charPicker; i++)
			{
				randomId += charset.charAt(Math.floor(Math.random() * charset.length));
			}
			
			randomArray.push(randomId);
			itemProcessed++;
			
			if(itemProcessed == randomCount)
			{
				return randomArray;
			}
		}
	}	
}

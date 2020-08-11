var randomArray = [];

//Based on the Selected Aggregation Event format the URI
exports.CreateAggregationEventURI	= function(Query,callback){
	console.log(Query)
	//var Query		=	JSON.parse(Query);
	//CHANGE THIS AFTER ALL
	//var input		=	Query.input;
	var input		=	Query.input;
	var syntaxType	=	Query.formdata.syntaxType;
	var EpcLists 	= 	[];
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
			var companyPrefixInput	=	input.AEPGRAI.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
			
				companyPrefixInput	=	companyPrefixNormal(companyPrefixInput,companyPrefixPoint);
			
			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:grai:'+companyPrefixInput;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue	=	companyPrefixInput+"."+id;
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
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
						appendValue	=	appendValue.substring(0,30)
					var epcID		=	'urn:epc:id:grai:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GIAI (Al 8004)')
		{
			var companyPrefixInput	=	input.AEPGIAI.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput	=	companyPrefixNormal(companyPrefixInput,companyPrefixPoint);
				
			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:giai:'+companyPrefixInput;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue	=	companyPrefixInput+"."+id;
						appendValue	=	appendValue.substring(0,30)
					var epcID		=	'urn:epc:id:giai:'+appendValue;
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
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
						appendValue	=	appendValue.substring(0,30)
					var epcID		=	'urn:epc:id:giai:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID == 'GSRN (Al 8018)')
		{
			var companyPrefixInput	=	input.AEPGSRN.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
				
			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:gsrn:'+companyPrefixInput;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue	=	companyPrefixInput+"."+id;
						appendValue	=	appendValue.substring(0,18)
					var epcID		=	'urn:epc:id:gsrn:'+appendValue;
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
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
						appendValue	=	appendValue.substring(0,18)
					var epcID		=	'urn:epc:id:gsrn:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GSRNP (Al 8017)')
		{
			var companyPrefixInput	=	input.AEPGSRNP.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
				
			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:gsrnp:'+companyPrefixInput;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue			=	companyPrefixInput+"."+id;
						appendValue			=	appendValue.substring(0,18)
					var epcID				=	'urn:epc:id:gsrnp:'+appendValue;
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
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
						appendValue	=	appendValue.substring(0,18)
					var epcID		=	'urn:epc:id:gsrnp:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GDTI (Al 253)')
		{
			var companyPrefixInput	=	input.AEPGDTI.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:gdti:'+companyPrefixInput;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue			=	companyPrefixInput+"."+id;
						appendValue			=	appendValue.substring(0,18)
					var epcID				=	'urn:epc:id:gdti:'+appendValue;
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
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{		
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
						appendValue	=	appendValue.substring(0,18)
					var epcID		=	'urn:epc:id:gdti:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GCN (Al 255)')
		{
			var companyPrefixInput	=	input.AEPGSN.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:gcn:'+companyPrefixInput;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue			=	companyPrefixInput+"."+id;
					var epcID				=	'urn:epc:id:gcn:'+appendValue;
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
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{		
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
					var epcID		=	'urn:epc:id:gcn:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'CPI (Al 8010 8011)')
		{
			var companyPrefixInput	=	input.AEPCPI1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:cpi:'+companyPrefixInput+"."+input.singleObjectId;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue			=	companyPrefixInput+"."+id;
					var epcID				=	'urn:epc:id:cpi:'+appendValue;
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
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{		
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
					var epcID		=	'urn:epc:id:cpi:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GINC (Al 401)')
		{
			var companyPrefixInput	=	input.AECGINC.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);

			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:ginc:'+companyPrefixInput;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue			=	companyPrefixInput+"."+id;
					var epcID				=	'urn:epc:id:ginc:'+appendValue;
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
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{		
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
					var epcID		=	'urn:epc:id:ginc:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GSIN (Al 402)')
		{
			var companyPrefixInput	=	input.AEPGSIN.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
				
			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:gsin:'+companyPrefixInput;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue			=	companyPrefixInput+"."+id;
					var epcID				=	'urn:epc:id:gsin:'+appendValue;
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
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{		
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
					var epcID		=	'urn:epc:id:gsin:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'ITIP (Al 8006 + Al 21)')
		{
			var companyPrefixInput	=	input.AEPITIP1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:itip:'+companyPrefixInput+"."+input.singleObjectId;;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue			=	companyPrefixInput+"."+id;
					var epcID				=	'urn:epc:id:itip:'+appendValue;
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
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{		
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
					var epcID		=	'urn:epc:id:itip:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'UPI_UI (Al 01 + Al 235)')
		{
			var companyPrefixInput	=	input.AEPUPIUI1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefix(companyPrefixInput, companyPrefixPoint);
			
			if(input.sgtintype == 'none')
			{
				var epcID	=	'urn:epc:id:upiui:'+companyPrefixInput+"."+input.singleObjectId;
				EpcLists.push(epcID);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var appendValue			=	companyPrefixInput+"."+id;
					var epcID				=	'urn:epc:id:upiui:'+appendValue;
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
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{		
					var appendValue	=	companyPrefixInput+"."+data[arrCount];
					var epcID		=	'urn:epc:id:upiui:'+appendValue;
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'GID')
		{
			if(input.sgtintype == 'none')
			{
				var GIDEPCId	=	'urn:epc:id:gid:'+input.AEPGID1+'.'+input.AEPGID2+'.'+input.singleObjectId;
				EpcLists.push(GIDEPCId);
				callback(EpcLists);
			}
			else if(input.sgtintype == 'range')
			{
				for(var id=input.sgtnGTINFrom; id<=input.sgtnGTINTo; id++)
				{
					var epcID				=	'urn:epc:id:gid:'+input.AEPGID1+'.'+input.AEPGID2+'.'+id;
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
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{		
					var epcID		=	'urn:epc:id:gid:'+input.AEPGID1+'.'+input.AEPGID2+'.'+data[arrCount];
					EpcLists.push(epcID);	
				}
				callback(EpcLists);
			}
		}
		else if(input.AggregationEventParentID === 'USDoD')
		{
			var USDODEPCId	=	'urn:epc:id:usdod:'+input.AEPDSDOD1+'.'+input.AEPDSDOD2;
			EpcLists.push(USDODEPCId);
			callback(EpcLists);
		}
		else if(input.AggregationEventParentID === 'ADI')
		{
			var ADIEPCId	=	'urn:epc:id:adi:'+input.AEPADI1+'.'+input.AEPADI2+'.'+input.AEPADI3;
			EpcLists.push(ADIEPCId);
			callback(EpcLists);
		}
		else if(input.AggregationEventParentID === 'BIC')
		{
			EpcLists.push(input.AEPBIC);
			callback(EpcLists);
		}
		else if(input.AggregationEventParentID === 'IMOVN')
		{
			var IMOVNEPCId	=	'urn:epc:id:imovn:'+input.AEPIMOVN;
			EpcLists.push(IMOVNEPCId);
			callback(EpcLists);
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
			
			if(syntaxType 	== 'urn')
			{
				GCP			=	GCP +'.'+Extension;
				
				if(input.SSCCType == 'userCustomized')
				{				
					var Start			=	parseInt(input.AEPSSCCStartValue,10);				
					var EPCValue		=	GCP + Start;
					var EPCValueLen		=	EPCValue.length;
					var StartLen		=	String(Start).length;
					var AppendLen		=	18-EPCValueLen+StartLen;
					var AppendVal		=	Start.toString().padStart(AppendLen,'0');
					var FinalVal		=	GCP + AppendVal;
					FinalVal			=	FinalVal.substring(0,18)
					var epcID			=	'urn:epc:id:sscc:'+FinalVal;
					callback(epcID);
				}
				else if(input.SSCCType == 'random')
				{
					var GCPLen			=	GCP.length;
					var RequiredLen		=	18-GCPLen;
					var min_Length		=	RequiredLen;
					var max_Length		=	RequiredLen;
					var randomType		=	'numeric';
					var randomCount		=	1
					var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);						
					var epcID			=	'urn:epc:id:sscc:'+GCP+companyPrefixNormal(data,input.SSCCCompanyPrefix);
					callback(epcID);
				}
			}
			else if(syntaxType == 'webURI')
			{
				if(input.SSCCType == 'userCustomized')
				{				
					var Start			=	parseInt(input.AEPSSCCStartValue,10);				
					var EPCValue		=	GCP + Start;
					var EPCValueLen		=	EPCValue.length;
					var StartLen		=	String(Start).length;
					var AppendLen		=	18-EPCValueLen+StartLen;
					var AppendVal		=	Start.toString().padStart(AppendLen,'0');
					var FinalVal		=	GCP + AppendVal;
					FinalVal			=	FinalVal.substring(0,18)
					var epcID			=	Domain+'/sscc/'+FinalVal;
					callback(epcID);
				}
				else if(input.SSCCType == 'random')
				{
					var GCPLen			=	GCP.length;
					var RequiredLen		=	18-GCPLen;
					var min_Length		=	RequiredLen;
					var max_Length		=	RequiredLen;
					var randomType		=	'numeric';
					var randomCount		=	1
					var data 			= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);						
					var epcID			=	Domain+'/sscc/'+GCP+companyPrefixNormal(data,input.SSCCCompanyPrefix);
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
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			var epcID				=	'urn:epc:id:grai:'+companyPrefixInput;
			callback(epcID)
		}
		else if(input.AggregationEventParentID === 'GIAI (Al 8004)')
		{
			var companyPrefixInput	=	input.AEPGIAI.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefix(companyPrefixInput, companyPrefixPoint);
			
			var epcID				=	'urn:epc:id:giai:'+companyPrefixInput;
			callback(epcID)
		}
		else if(input.AggregationEventParentID === 'GSRN (Al 8018)')
		{
			var companyPrefixInput	=	input.AEPGSRN.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			var epcID				=	'urn:epc:id:gsrn:'+companyPrefixInput;
			callback(epcID)
		}	
		else if(input.AggregationEventParentID === 'GSRNP (Al 8017)')
		{
			var companyPrefixInput	=	input.AEPGSRNP.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			var epcID				=	'urn:epc:id:gsrnp:'+companyPrefixInput;
			callback(epcID)
		}
		else if(input.AggregationEventParentID === 'GDTI (Al 253)')
		{
			var companyPrefixInput	=	input.AEPGDTI.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			var epcID				=	'urn:epc:id:gdti:'+companyPrefixInput;
			callback(epcID)
		}
		else if(input.AggregationEventParentID === 'GCN (Al 255)')
		{
			var companyPrefixInput	=	input.AEPGSN.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			var epcID				=	'urn:epc:id:gcn:'+companyPrefixInput;
			callback(epcID)
		}
		else if(input.AggregationEventParentID === 'CPI (Al 8010 8011)')
		{
			var companyPrefixInput	=	input.AEPCPI1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);

			var epcID				=	'urn:epc:id:cpi:'+companyPrefixInput+"."+input.AEPCPI2;
			callback(epcID);
		}
		else if(input.AggregationEventParentID === 'GINC (Al 401)')
		{
			var companyPrefixInput	=	input.AECGINC.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			var epcID				=	'urn:epc:id:ginc:'+companyPrefixInput;
			callback(epcID);
		}
		else if(input.AggregationEventParentID === 'GSIN (Al 402)')
		{
			var companyPrefixInput	=	input.AEPGSIN.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			var epcID				=	'urn:epc:id:gsin:'+companyPrefixInput;
			callback(epcID);
		}
		else if(input.AggregationEventParentID === 'ITIP (Al 8006 + Al 21)')
		{
			var companyPrefixInput	=	input.AEPITIP1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefixNormal(companyPrefixInput, companyPrefixPoint);
			
			var epcID				=	'urn:epc:id:gsin:'+companyPrefixInput+'.'+input.AEPITIP2;
			callback(epcID);
		}
		else if(input.AggregationEventParentID === 'UPI_UI (Al 01 + Al 235)')
		{
			var companyPrefixInput	=	input.AEPUPIUI1.toString();
			var companyPrefixPoint	=	input.AEPCompanyPrefix;
				companyPrefixInput 	=	companyPrefix(companyPrefixInput, companyPrefixPoint);
			
			var epcID				=	'urn:epc:id:gsin:'+companyPrefixInput+'.'+input.AEPUPIUI2;
			callback(epcID);
		}
		else if(input.AggregationEventParentID === 'GID')
		{
			var GIDEPCId	=	'urn:epc:id:gid:'+input.AEPGID1+'.'+input.AEPGID2+'.'+input.AEPGID3;
			callback(GIDEPCId);
		}
		else if(input.AggregationEventParentID === 'USDoD')
		{
			var USDODEPCId	=	'urn:epc:id:usdod:'+input.AEPDSDOD1+'.'+input.AEPDSDOD2;
			callback(USDODEPCId);
		}
		else if(input.AggregationEventParentID === 'ADI')
		{
			var ADIEPCId	=	'urn:epc:id:adi:'+input.AEPADI1+'.'+input.AEPADI2+'.'+input.AEPADI3;
			callback(ADIEPCId);
		}
		else if(input.AggregationEventParentID === 'BIC')
		{
			callback(input.AEPBIC);
		}
		else if(input.AggregationEventParentID === 'IMOVN')
		{
			var IMOVNEPCId	=	'urn:epc:id:imovn:'+input.AEPIMOVN;
			callback(IMOVNEPCId);
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
		var charset     	= "0123456789";
		
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
		var charset     	= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~()'!*:@,;";
		
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
	else if(randomType == 'RandomNumbers')
	{
		var charset     	=	"1234567890";
		
		for(var id=0;id<randomCount;id++)
		{
			var randomId    	=	'';
			for(var len=1; len<=max_Length; len++)
			{
				randomId += charset.charAt(Math.floor(Math.random() * charset.length));
			}
			randomArray.push(randomId);
		}
		return randomArray;
	}	
}

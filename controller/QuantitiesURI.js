const gs1 		= require('gs1');

exports.QuantitiesURI	=	function(Query,callback){
	var input		=	Query.input;
	var EpcLists	=	[];
	var syntaxType	=	Query.formdata.ElementssyntaxType;
	var Domain		=	'';
	var eventCount	=	Query.formdata.eventcount;
	var allQuantity = 	[];
	
	//Check if user has provided their own WEB URI 
	if(syntaxType == 'webURI')
	{
		if(Query.formdata.UserDefinedURI != "" && Query.formdata.UserDefinedURI != null && typeof Query.formdata.UserDefinedURI != undefined)
		{
			Domain 	=	Query.formdata.UserDefinedURI;
			Domain	=	Domain.replace(/\/$/, "");
		}
		else
		{
			Domain	=	'https://id.gs1.org';
		}
	}

	for(epcCount = 0; epcCount<eventCount;epcCount++)
	{
		EpcLists = [];

		if(input.ObjectEventquantities == 'LGTIN (Al 01 + Al 10)')
		{
			var companyPrefixInput		=	input.OEQLGTIN1.toString();
			var companyPrefixPoint		=	input.OEQuantityCompanyPrefix;
				companyPrefixInput		=	companyPrefixInput.substring(0,13) + gs1.checkdigit(companyPrefixInput.substring(0,13));
			var companyPrefixInputURN	=	companyPrefix(companyPrefixInput, companyPrefixPoint);
				companyPrefixInputURN	=	companyPrefixInputURN.substring(0,14)
				
			if(input.Quantitysgtintype == 'none')
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:class:lgtin:'+companyPrefixInputURN+"."+input.singleObjectId;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/01/'+companyPrefixInput+'/10/'+input.singleObjectId;
				}			
				
				var obj 			= 	new Object();
				obj.URI				=	QuantityId;
				obj.QuantityType	=	input.ObjectEventQuantityType;
				obj.Quantity		=	input.ObjectEventQuantityQuantity;
				obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
				
			}
			if(input.Quantitysgtintype == 'range')
			{
				for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
				{	
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:class:lgtin:'+companyPrefixInputURN+"."+id;
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/01/'+companyPrefixInput+'/10/'+id;
					}				
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);
				}
			}
			else if(input.Quantitysgtintype == 'random')
			{
				var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
				var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
				var randomType	=	input.QuantityrandomType;
				var randomCount	=	parseInt(input.QuantityrandomCount, 10);
				//Call the function to generate the Random numbers then create XML elements
				var data 				= RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{		
					if(syntaxType 	== 'urn')
					{
						var QuantityId	=	'urn:epc:class:lgtin:'+companyPrefixInputURN+"."+data[arrCount];
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId	=	Domain+'/01/'+companyPrefixInput+'/10/'+data[arrCount];
					}			
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);	
				}
				
			}
		}
		else if(input.ObjectEventquantities == 'GTIN, no serial (Al 01)')
		{
			//If the selected OBJECT EVENT Quantity is GTIN, no serial (Al 01)
			var OEQuantityInput			=	input.OEQGTIN;
			var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
				OEQuantityInputURN		=	companyPrefix(OEQuantityInput, OEQuantityPreifxPoint);
				OEQuantityInputURN		=	OEQuantityInputURN.substring(0,14)
			
			if(input.Quantitysgtintype == 'none')
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:sgtin:'+OEQuantityInputURN+'.'+input.singleObjectId;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/sgtin/'+OEQuantityInput+input.singleObjectId;
				}
				
				var obj 			= 	new Object();
				obj.URI				=	QuantityId;
				obj.QuantityType	=	input.ObjectEventQuantityType;
				obj.Quantity		=	input.ObjectEventQuantityQuantity;
				obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
				
			}
			if(input.Quantitysgtintype == 'range')
			{
				for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
				{
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:sgtin:'+OEQuantityInputURN+"."+id;
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/sgtin/'+OEQuantityInput+id;
					}
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);
				}
				
			}
			else if(input.Quantitysgtintype == 'random')
			{
				var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
				var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
				var randomType	=	input.QuantityrandomType;
				var randomCount	=	parseInt(input.QuantityrandomCount, 10);
				
				//Call the function to generate the Random numbers then create XML elements
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:sgtin:'+OEQuantityInputURN+"."+data[arrCount];
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/sgtin/'+OEQuantityInput+data[arrCount];
					}
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);	
				}
				
			}
			
		}
		else if(input.ObjectEventquantities == 'GRAI, no serial (Al 8003)')
		{
			//If the selected OBJECT EVENT Quantity is GRAI, no serial (Al 8003)
			var OEQuantityInput			=	'0'+input.OEQGRAI;
			var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
			var OEQuantityInputURN		=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
				OEQuantityInputURN		=	OEQuantityInputURN.substring(0,13)
			
			if(input.Quantitysgtintype == 'none')
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:grai:'+OEQuantityInputURN+'.'+input.singleObjectId;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/8003/'+OEQuantityInput+input.singleObjectId;
				}			
				var obj 			= 	new Object();
				obj.URI				=	QuantityId;
				obj.QuantityType	=	input.ObjectEventQuantityType;
				obj.Quantity		=	input.ObjectEventQuantityQuantity;
				obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
				
			}
			if(input.Quantitysgtintype == 'range')
			{
				for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
				{	
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:grai:'+OEQuantityInputURN+'.'+id;
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/8003/'+OEQuantityInput+id;
					}	
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);
				}
				
			}
			else if(input.Quantitysgtintype == 'random')
			{
				var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
				var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
				var randomType	=	input.QuantityrandomType;
				var randomCount	=	parseInt(input.QuantityrandomCount, 10);
				
				//Call the function to generate the Random numbers then create XML elements
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:grai:'+OEQuantityInputURN+"."+data[arrCount];
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/8003/'+OEQuantityInput+data[arrCount];
					}				
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);	
				}
				
			}
		}
		else if(input.ObjectEventquantities == 'GDTI, no serial (Al 253)')
		{
			//If the selected OBJECT EVENT Quantity is GDTI, no serial (Al 253)
			
			var OEQuantityInput			=	input.OEQGDTI;
			var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
			var OEQuantityInputURN		=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
				OEQuantityInputURN		=	OEQuantityInputURN.substring(0,13)
				
			if(input.Quantitysgtintype == 'none')
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId	=	'urn:epc:idpat:gdti:'+OEQuantityInputURN+"."+input.singleObjectId;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId	=	Domain+'/gdti/'+OEQuantityInput+input.singleObjectId;
				}				
				
				var obj 			= 	new Object();
				obj.URI				=	QuantityId;
				obj.QuantityType	=	input.ObjectEventQuantityType;
				obj.Quantity		=	input.ObjectEventQuantityQuantity;
				obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
				
			}
			if(input.Quantitysgtintype == 'range')
			{
				for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
				{				
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:gdti:'+OEQuantityInputURN+'.'+id;
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/gdti/'+OEQuantityInput+id;
					}		
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);
				}
				
			}
			else if(input.Quantitysgtintype == 'random')
			{
				var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
				var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
				var randomType	=	input.QuantityrandomType;
				var randomCount	=	parseInt(input.QuantityrandomCount, 10);
				
				//Call the function to generate the Random numbers then create XML elements
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:gdti:'+OEQuantityInputURN+"."+data[arrCount];
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/gdti/'+OEQuantityInput+data[arrCount];
					}					
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);	
				}
				
			}
			
		}
		else if(input.ObjectEventquantities == 'GCN, no serial (Al 255)')
		{
			//If the selected OBJECT EVENT Quantity is GCN, no serial (Al 255)		
			var OEQuantityInput			=	input.OEQGCN;
			var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
			var OEQuantityInputURN		=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
				OEQuantityInputURN		=	OEQuantityInputURN.substring(0,13)
				
			if(input.Quantitysgtintype == 'none')
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:sgcn:'+OEQuantityInputURN+'.'+input.singleObjectId;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/gcn/'+OEQuantityInput+input.singleObjectId;
				}
				
				var obj 			= 	new Object();
				obj.URI				=	QuantityId;
				obj.QuantityType	=	input.ObjectEventQuantityType;
				obj.Quantity		=	input.ObjectEventQuantityQuantity;
				obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
				
			}
			if(input.Quantitysgtintype == 'range')
			{
				for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
				{
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:sgcn:'+OEQuantityInputURN+'.'+id;
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/gcn/'+OEQuantityInput+id;
					}			
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);
				}
				
			}
			else if(input.Quantitysgtintype == 'random')
			{
				var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
				var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
				var randomType	=	input.QuantityrandomType;
				var randomCount	=	parseInt(input.QuantityrandomCount, 10);
				
				//Call the function to generate the Random numbers then create XML elements
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:sgcn:'+OEQuantityInputURN+"."+data[arrCount];
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/gcn/'+OEQuantityInput+data[arrCount];
					}
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);	
				}
				
			}
		}
		else if(input.ObjectEventquantities == 'CPI, no serial (Al 801 0)')
		{
			//If the selected OBJECT EVENT Quantity is CPI, no serial (Al 801 0)
			var OEQuantityInput			=	input.OEQCPI;
			var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
			var OEQuantityInputURN		=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
			var count					=	input.QuantitiesCountNumber;
			
			for(var id=1; id<=count; id++)
			{	
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:cpi:'+OEQuantityInputURN+'.*';
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/8010/'+OEQuantityInput+'*';
				}
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
			}
				
		}
		else if(input.ObjectEventquantities == 'ITIP, no serial (Al 8006)')
		{
			//If the selected OBJECT EVENT Quantity is ITIP, no serial (Al 8006)
			var OEQuantityInput			=	input.OEQITIP;
			var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
			var OEQuantityInputURN		=	companyPrefix(OEQuantityInput, OEQuantityPreifxPoint);
			
			if(input.Quantitysgtintype == 'none')
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:itip:'+OEQuantityInputURN+'.'+input.singleObjectId;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/itip/'+OEQuantityInput+input.singleObjectId;
				}
				
				var obj 			= 	new Object();
				obj.URI				=	QuantityId;
				obj.QuantityType	=	input.ObjectEventQuantityType;
				obj.Quantity		=	input.ObjectEventQuantityQuantity;
				obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
				
			}
			if(input.Quantitysgtintype == 'range')
			{
				for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
				{
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:itip:'+OEQuantityInputURN+'.'+id;
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/itip/'+OEQuantityInput+id;
					}		
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);
				}
				
			}
			else if(input.Quantitysgtintype == 'random')
			{
				var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
				var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
				var randomType	=	input.QuantityrandomType;
				var randomCount	=	parseInt(input.QuantityrandomCount, 10);
				
				//Call the function to generate the Random numbers then create XML elements
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{	
					if(syntaxType 	== 'urn')
					{
						var QuantityId			=	'urn:epc:idpat:itip:'+OEQuantityInputURN+"."+data[arrCount];
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/itip/'+OEQuantityInput+data[arrCount];
					}	
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);	
				}
				
			}
		}
		else if(input.ObjectEventquantities == 'UPUI, no TPX (Al 01)')
		{
			//If the selected OBJECT EVENT Quantity is UPUI, no TPX (Al 01)
			var OEQuantityInput			=	input.OEQUPUI;
			var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
			var OEQuantityInputURN		=	companyPrefix(OEQuantityInput, OEQuantityPreifxPoint);
			
			if(input.Quantitysgtintype == 'none')
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:upui:'+OEQuantityInputURN+'.*';
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/upui/'+OEQuantityInput+'*';
				}
				
				var obj 			= 	new Object();
				obj.URI				=	QuantityId;
				obj.QuantityType	=	input.ObjectEventQuantityType;
				obj.Quantity		=	input.ObjectEventQuantityQuantity;
				obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
				
			}
			if(input.Quantitysgtintype == 'range')
			{
				for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
				{
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:upui:'+OEQuantityInputURN+'.*';
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/upui/'+OEQuantityInput+'*';
					}				
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);
				}
				
			}
			else if(input.Quantitysgtintype == 'random')
			{
				var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
				var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
				var randomType	=	input.QuantityrandomType;
				var randomCount	=	parseInt(input.QuantityrandomCount, 10);
				
				//Call the function to generate the Random numbers then create XML elements
				var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
				
				for(var arrCount=0; arrCount<data.length; arrCount++)
				{
					if(syntaxType 	== 'urn')
					{
						var QuantityId		=	'urn:epc:idpat:upui:'+OEQuantityInputURN+'.*';
					}
					else if(syntaxType == 'webURI')
					{
						var QuantityId		=	Domain+'/upui/'+OEQuantityInput+'*';
					}				
					
					var obj 				= 	new Object();
						obj.URI				=	QuantityId;
						obj.QuantityType	=	input.ObjectEventQuantityType;
						obj.Quantity		=	input.ObjectEventQuantityQuantity;
						obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
					EpcLists.push(obj);	
				}
				
			}	
		}
		else if(input.ObjectEventquantities == 'Enter a URI Manually')
		{
			//If the selected OBJECT EVENT Quantity is Enter a URI Manually
			var obj 				= 	new Object();
			obj.URI					=	input.OEQManualURI;
			obj.QuantityType		=	input.ObjectEventQuantityType;
			obj.Quantity			=	input.ObjectEventQuantityQuantity;
			obj.QuantityUOM			=	input.ObjectEventQuantityQuantityUOM;
			EpcLists.push(obj);	
		}
		allQuantity.push(EpcLists);
	}
	callback(allQuantity);
	
	/*
	if(input.ObjectEventquantities == 'LGTIN (Al 01 + Al 10)')
	{
		var companyPrefixInput		=	input.OEQLGTIN1.toString();
		var companyPrefixPoint		=	input.OEQuantityCompanyPrefix;
			companyPrefixInput		=	companyPrefixInput.substring(0,13) + gs1.checkdigit(companyPrefixInput.substring(0,13));
		var companyPrefixInputURN	=	companyPrefix(companyPrefixInput, companyPrefixPoint);
			companyPrefixInputURN	=	companyPrefixInputURN.substring(0,14)
			
		if(input.Quantitysgtintype == 'none')
		{
			if(syntaxType 	== 'urn')
			{
				var QuantityId		=	'urn:epc:class:lgtin:'+companyPrefixInputURN+"."+input.singleObjectId;
			}
			else if(syntaxType == 'webURI')
			{
				var QuantityId		=	Domain+'/01/'+companyPrefixInput+'/10/'+input.singleObjectId;
			}			
			
			var obj 			= 	new Object();
			obj.URI				=	QuantityId;
			obj.QuantityType	=	input.ObjectEventQuantityType;
			obj.Quantity		=	input.ObjectEventQuantityQuantity;
			obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
			EpcLists.push(obj);
			callback(EpcLists);
		}
		if(input.Quantitysgtintype == 'range')
		{
			for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
			{	
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:class:lgtin:'+companyPrefixInputURN+"."+id;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/01/'+companyPrefixInput+'/10/'+id;
				}				
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
			}
			callback(EpcLists);
		}
		else if(input.Quantitysgtintype == 'random')
		{
			var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
			var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
			var randomType	=	input.QuantityrandomType;
			var randomCount	=	parseInt(input.QuantityrandomCount, 10);
			//Call the function to generate the Random numbers then create XML elements
			var data 				= RandomGenerator(min_Length,max_Length,randomType,randomCount);
			
			for(var arrCount=0; arrCount<data.length; arrCount++)
			{		
				if(syntaxType 	== 'urn')
				{
					var QuantityId	=	'urn:epc:class:lgtin:'+companyPrefixInputURN+"."+data[arrCount];
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId	=	Domain+'/01/'+companyPrefixInput+'/10/'+data[arrCount];
				}			
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);	
			}
			callback(EpcLists);
		}
	}
	else if(input.ObjectEventquantities == 'GTIN, no serial (Al 01)')
	{
		//If the selected OBJECT EVENT Quantity is GTIN, no serial (Al 01)
		var OEQuantityInput			=	input.OEQGTIN;
		var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
			OEQuantityInputURN		=	companyPrefix(OEQuantityInput, OEQuantityPreifxPoint);
			OEQuantityInputURN		=	OEQuantityInputURN.substring(0,14)
		
		if(input.Quantitysgtintype == 'none')
		{
			if(syntaxType 	== 'urn')
			{
				var QuantityId		=	'urn:epc:idpat:sgtin:'+OEQuantityInputURN+'.'+input.singleObjectId;
			}
			else if(syntaxType == 'webURI')
			{
				var QuantityId		=	Domain+'/sgtin/'+OEQuantityInput+input.singleObjectId;
			}
			
			var obj 			= 	new Object();
			obj.URI				=	QuantityId;
			obj.QuantityType	=	input.ObjectEventQuantityType;
			obj.Quantity		=	input.ObjectEventQuantityQuantity;
			obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
			EpcLists.push(obj);
			callback(EpcLists);
		}
		if(input.Quantitysgtintype == 'range')
		{
			for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:sgtin:'+OEQuantityInputURN+"."+id;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/sgtin/'+OEQuantityInput+id;
				}
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
			}
			callback(EpcLists);
		}
		else if(input.Quantitysgtintype == 'random')
		{
			var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
			var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
			var randomType	=	input.QuantityrandomType;
			var randomCount	=	parseInt(input.QuantityrandomCount, 10);
			
			//Call the function to generate the Random numbers then create XML elements
			var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
			
			for(var arrCount=0; arrCount<data.length; arrCount++)
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:sgtin:'+OEQuantityInputURN+"."+data[arrCount];
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/sgtin/'+OEQuantityInput+data[arrCount];
				}
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);	
			}
			callback(EpcLists);
		}
		
	}
	else if(input.ObjectEventquantities == 'GRAI, no serial (Al 8003)')
	{
		//If the selected OBJECT EVENT Quantity is GRAI, no serial (Al 8003)
		var OEQuantityInput			=	'0'+input.OEQGRAI;
		var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
		var OEQuantityInputURN		=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
			OEQuantityInputURN		=	OEQuantityInputURN.substring(0,13)
		
		if(input.Quantitysgtintype == 'none')
		{
			if(syntaxType 	== 'urn')
			{
				var QuantityId		=	'urn:epc:idpat:grai:'+OEQuantityInputURN+'.'+input.singleObjectId;
			}
			else if(syntaxType == 'webURI')
			{
				var QuantityId		=	Domain+'/8003/'+OEQuantityInput+input.singleObjectId;
			}			
			var obj 			= 	new Object();
			obj.URI				=	QuantityId;
			obj.QuantityType	=	input.ObjectEventQuantityType;
			obj.Quantity		=	input.ObjectEventQuantityQuantity;
			obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
			EpcLists.push(obj);
			callback(EpcLists);
		}
		if(input.Quantitysgtintype == 'range')
		{
			for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
			{	
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:grai:'+OEQuantityInputURN+'.'+id;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/8003/'+OEQuantityInput+id;
				}	
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
			}
			callback(EpcLists);
		}
		else if(input.Quantitysgtintype == 'random')
		{
			var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
			var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
			var randomType	=	input.QuantityrandomType;
			var randomCount	=	parseInt(input.QuantityrandomCount, 10);
			
			//Call the function to generate the Random numbers then create XML elements
			var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
			
			for(var arrCount=0; arrCount<data.length; arrCount++)
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:grai:'+OEQuantityInputURN+"."+data[arrCount];
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/8003/'+OEQuantityInput+data[arrCount];
				}				
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);	
			}
			callback(EpcLists);
		}
	}
	else if(input.ObjectEventquantities == 'GDTI, no serial (Al 253)')
	{
		//If the selected OBJECT EVENT Quantity is GDTI, no serial (Al 253)
		
		var OEQuantityInput			=	input.OEQGDTI;
		var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
		var OEQuantityInputURN		=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
			OEQuantityInputURN		=	OEQuantityInputURN.substring(0,13)
			
		if(input.Quantitysgtintype == 'none')
		{
			if(syntaxType 	== 'urn')
			{
				var QuantityId	=	'urn:epc:idpat:gdti:'+OEQuantityInputURN+"."+input.singleObjectId;
			}
			else if(syntaxType == 'webURI')
			{
				var QuantityId	=	Domain+'/gdti/'+OEQuantityInput+input.singleObjectId;
			}				
			
			var obj 			= 	new Object();
			obj.URI				=	QuantityId;
			obj.QuantityType	=	input.ObjectEventQuantityType;
			obj.Quantity		=	input.ObjectEventQuantityQuantity;
			obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
			EpcLists.push(obj);
			callback(EpcLists);
		}
		if(input.Quantitysgtintype == 'range')
		{
			for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
			{				
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:gdti:'+OEQuantityInputURN+'.'+id;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/gdti/'+OEQuantityInput+id;
				}		
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
			}
			callback(EpcLists);
		}
		else if(input.Quantitysgtintype == 'random')
		{
			var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
			var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
			var randomType	=	input.QuantityrandomType;
			var randomCount	=	parseInt(input.QuantityrandomCount, 10);
			
			//Call the function to generate the Random numbers then create XML elements
			var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
			
			for(var arrCount=0; arrCount<data.length; arrCount++)
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:gdti:'+OEQuantityInputURN+"."+data[arrCount];
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/gdti/'+OEQuantityInput+data[arrCount];
				}					
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);	
			}
			callback(EpcLists);
		}
		
	}
	else if(input.ObjectEventquantities == 'GCN, no serial (Al 255)')
	{
		//If the selected OBJECT EVENT Quantity is GCN, no serial (Al 255)		
		var OEQuantityInput			=	input.OEQGCN;
		var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
		var OEQuantityInputURN		=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
			OEQuantityInputURN		=	OEQuantityInputURN.substring(0,13)
			
		if(input.Quantitysgtintype == 'none')
		{
			if(syntaxType 	== 'urn')
			{
				var QuantityId		=	'urn:epc:idpat:sgcn:'+OEQuantityInputURN+'.'+input.singleObjectId;
			}
			else if(syntaxType == 'webURI')
			{
				var QuantityId		=	Domain+'/gcn/'+OEQuantityInput+input.singleObjectId;
			}
			
			var obj 			= 	new Object();
			obj.URI				=	QuantityId;
			obj.QuantityType	=	input.ObjectEventQuantityType;
			obj.Quantity		=	input.ObjectEventQuantityQuantity;
			obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
			EpcLists.push(obj);
			callback(EpcLists);
		}
		if(input.Quantitysgtintype == 'range')
		{
			for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:sgcn:'+OEQuantityInputURN+'.'+id;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/gcn/'+OEQuantityInput+id;
				}			
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
			}
			callback(EpcLists);
		}
		else if(input.Quantitysgtintype == 'random')
		{
			var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
			var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
			var randomType	=	input.QuantityrandomType;
			var randomCount	=	parseInt(input.QuantityrandomCount, 10);
			
			//Call the function to generate the Random numbers then create XML elements
			var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
			
			for(var arrCount=0; arrCount<data.length; arrCount++)
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:sgcn:'+OEQuantityInputURN+"."+data[arrCount];
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/gcn/'+OEQuantityInput+data[arrCount];
				}
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);	
			}
			callback(EpcLists);
		}
	}
	else if(input.ObjectEventquantities == 'CPI, no serial (Al 801 0)')
	{
		//If the selected OBJECT EVENT Quantity is CPI, no serial (Al 801 0)
		var OEQuantityInput			=	input.OEQCPI;
		var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
		var OEQuantityInputURN		=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
		var count					=	input.QuantitiesCountNumber;
		
		for(var id=1; id<=count; id++)
		{	
			if(syntaxType 	== 'urn')
			{
				var QuantityId		=	'urn:epc:idpat:cpi:'+OEQuantityInputURN+'.*';
			}
			else if(syntaxType == 'webURI')
			{
				var QuantityId		=	Domain+'/8010/'+OEQuantityInput+'*';
			}
			var obj 				= 	new Object();
				obj.URI				=	QuantityId;
				obj.QuantityType	=	input.ObjectEventQuantityType;
				obj.Quantity		=	input.ObjectEventQuantityQuantity;
				obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
			EpcLists.push(obj);
		}
		callback(EpcLists);	
	}
	else if(input.ObjectEventquantities == 'ITIP, no serial (Al 8006)')
	{
		//If the selected OBJECT EVENT Quantity is ITIP, no serial (Al 8006)
		var OEQuantityInput			=	input.OEQITIP;
		var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
		var OEQuantityInputURN		=	companyPrefix(OEQuantityInput, OEQuantityPreifxPoint);
		
		if(input.Quantitysgtintype == 'none')
		{
			if(syntaxType 	== 'urn')
			{
				var QuantityId		=	'urn:epc:idpat:itip:'+OEQuantityInputURN+'.'+input.singleObjectId;
			}
			else if(syntaxType == 'webURI')
			{
				var QuantityId		=	Domain+'/itip/'+OEQuantityInput+input.singleObjectId;
			}
			
			var obj 			= 	new Object();
			obj.URI				=	QuantityId;
			obj.QuantityType	=	input.ObjectEventQuantityType;
			obj.Quantity		=	input.ObjectEventQuantityQuantity;
			obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
			EpcLists.push(obj);
			callback(EpcLists);
		}
		if(input.Quantitysgtintype == 'range')
		{
			for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:itip:'+OEQuantityInputURN+'.'+id;
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/itip/'+OEQuantityInput+id;
				}		
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
			}
			callback(EpcLists);
		}
		else if(input.Quantitysgtintype == 'random')
		{
			var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
			var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
			var randomType	=	input.QuantityrandomType;
			var randomCount	=	parseInt(input.QuantityrandomCount, 10);
			
			//Call the function to generate the Random numbers then create XML elements
			var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
			
			for(var arrCount=0; arrCount<data.length; arrCount++)
			{	
				if(syntaxType 	== 'urn')
				{
					var QuantityId			=	'urn:epc:idpat:itip:'+OEQuantityInputURN+"."+data[arrCount];
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/itip/'+OEQuantityInput+data[arrCount];
				}	
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);	
			}
			callback(EpcLists);
		}
	}
	else if(input.ObjectEventquantities == 'UPUI, no TPX (Al 01)')
	{
		//If the selected OBJECT EVENT Quantity is UPUI, no TPX (Al 01)
		var OEQuantityInput			=	input.OEQUPUI;
		var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
		var OEQuantityInputURN		=	companyPrefix(OEQuantityInput, OEQuantityPreifxPoint);
		
		if(input.Quantitysgtintype == 'none')
		{
			if(syntaxType 	== 'urn')
			{
				var QuantityId		=	'urn:epc:idpat:upui:'+OEQuantityInputURN+'.*';
			}
			else if(syntaxType == 'webURI')
			{
				var QuantityId		=	Domain+'/upui/'+OEQuantityInput+'*';
			}
			
			var obj 			= 	new Object();
			obj.URI				=	QuantityId;
			obj.QuantityType	=	input.ObjectEventQuantityType;
			obj.Quantity		=	input.ObjectEventQuantityQuantity;
			obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
			EpcLists.push(obj);
			callback(EpcLists);
		}
		if(input.Quantitysgtintype == 'range')
		{
			for(var id=input.QuantitysgtnGTINFrom; id<=input.QuantitysgtnGTINTo; id++)
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:upui:'+OEQuantityInputURN+'.*';
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/upui/'+OEQuantityInput+'*';
				}				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);
			}
			callback(EpcLists);
		}
		else if(input.Quantitysgtintype == 'random')
		{
			var min_Length	=	parseInt(input.QuantityradomMinLength, 10);
			var max_Length	=	parseInt(input.QuantityrandomMaxLength, 10);
			var randomType	=	input.QuantityrandomType;
			var randomCount	=	parseInt(input.QuantityrandomCount, 10);
			
			//Call the function to generate the Random numbers then create XML elements
			var data 		= 	RandomGenerator(min_Length,max_Length,randomType,randomCount);
			
			for(var arrCount=0; arrCount<data.length; arrCount++)
			{
				if(syntaxType 	== 'urn')
				{
					var QuantityId		=	'urn:epc:idpat:upui:'+OEQuantityInputURN+'.*';
				}
				else if(syntaxType == 'webURI')
				{
					var QuantityId		=	Domain+'/upui/'+OEQuantityInput+'*';
				}				
				
				var obj 				= 	new Object();
					obj.URI				=	QuantityId;
					obj.QuantityType	=	input.ObjectEventQuantityType;
					obj.Quantity		=	input.ObjectEventQuantityQuantity;
					obj.QuantityUOM		=	input.ObjectEventQuantityQuantityUOM;
				EpcLists.push(obj);	
			}
			callback(EpcLists);
		}	
	}
	else if(input.ObjectEventquantities == 'Enter a URI Manually')
	{
		//If the selected OBJECT EVENT Quantity is Enter a URI Manually
		var obj 				= 	new Object();
		obj.URI					=	input.OEQManualURI;
		obj.QuantityType		=	input.ObjectEventQuantityType;
		obj.Quantity			=	input.ObjectEventQuantityQuantity;
		obj.QuantityUOM			=	input.ObjectEventQuantityQuantityUOM;
		EpcLists.push(obj);
		callback(EpcLists)		
	}
}
*/

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
}

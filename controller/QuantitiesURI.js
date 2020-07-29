
exports.QuantitiesURI	=	function(Query,callback){
	var input		=	Query.input;
	var EpcLists	=	[];
	
	if(input.ObjectEventquantities == 'LGTIN (Al 01 + Al 10)')
	{
		var companyPrefixInput	=	input.OEQLGTIN1.toString();
		var companyPrefixPoint	=	input.OEQuantityCompanyPrefix;
			companyPrefixInput 	=	companyPrefix(companyPrefixInput, companyPrefixPoint);
			companyPrefixInput	=	companyPrefixInput.substring(0,14)
			
		if(input.Quantitysgtintype == 'none')
		{
			var QuantityId		=	'urn:epc:id:lgtin:'+companyPrefixInput+"."+input.singleObjectId;
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
				var QuantityId			=	'urn:epc:id:lgtin:'+companyPrefixInput+"."+id;
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
				var QuantityId			=	'urn:epc:id:lgtin:'+companyPrefixInput+"."+data[arrCount];
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
			OEQuantityInput			=	companyPrefix(OEQuantityInput, OEQuantityPreifxPoint);
			OEQuantityInput			=	OEQuantityInput.substring(0,14)
		
		if(input.Quantitysgtintype == 'none')
		{
			var QuantityId		=	'urn:epc:idpat:sgtin:'+OEQuantityInput+'.'+input.singleObjectId;
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
				var QuantityId			=	'urn:epc:id:sgtin:'+OEQuantityInput+"."+id;
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
				var QuantityId			=	'urn:epc:id:sgtin:'+OEQuantityInput+"."+data[arrCount];
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
		var OEQuantityInput			=	input.OEQGRAI;
		var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
			OEQuantityInput			=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
			OEQuantityInput			=	OEQuantityInput.substring(0,13)
		
		if(input.Quantitysgtintype == 'none')
		{
			var QuantityId		=	'urn:epc:idpat:grai:'+OEQuantityInput+'.'+input.singleObjectId;
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
				var QuantityId		=	'urn:epc:idpat:grai:'+OEQuantityInput+'.'+id;
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
				var QuantityId			=	'urn:epc:id:grai:'+OEQuantityInput+"."+data[arrCount];
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
			OEQuantityInput			=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
			OEQuantityInput			=	OEQuantityInput.substring(0,13)
			
		if(input.Quantitysgtintype == 'none')
		{
			var QuantityId		=	'urn:epc:idpat:gdti:'+OEQuantityInput+'.'+input.singleObjectId;
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
				var QuantityId		=	'urn:epc:idpat:gdti:'+OEQuantityInput+'.'+id;
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
				var QuantityId			=	'urn:epc:id:gdti:'+OEQuantityInput+"."+data[arrCount];
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
			OEQuantityInput			=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);
			OEQuantityInput			=	OEQuantityInput.substring(0,13)
			
		if(input.Quantitysgtintype == 'none')
		{
			var QuantityId		=	'urn:epc:idpat:gcn:'+OEQuantityInput+'.'+input.singleObjectId;
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
				var QuantityId		=	'urn:epc:idpat:gcn:'+OEQuantityInput+'.'+id;
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
				var QuantityId			=	'urn:epc:id:gcn:'+OEQuantityInput+"."+data[arrCount];
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
			OEQuantityInput			=	companyPrefixNormal(OEQuantityInput, OEQuantityPreifxPoint);		
		
		if(input.Quantitysgtintype == 'none')
		{
			var QuantityId		=	'urn:epc:idpat:cpi:'+OEQuantityInput+'.'+input.singleObjectId;
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
				var QuantityId		=	'urn:epc:idpat:cpi:'+OEQuantityInput+'.'+id;
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
				var QuantityId			=	'urn:epc:id:cpi:'+OEQuantityInput+"."+data[arrCount];
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
	else if(input.ObjectEventquantities == 'ITIP, no serial (Al 8006)')
	{
		//If the selected OBJECT EVENT Quantity is ITIP, no serial (Al 8006)
		var OEQuantityInput			=	input.OEQITIP;
		var OEQuantityPreifxPoint	=	input.OEQuantityCompanyPrefix;
			OEQuantityInput			=	companyPrefix(OEQuantityInput, OEQuantityPreifxPoint);
		
		if(input.Quantitysgtintype == 'none')
		{
			var QuantityId		=	'urn:epc:idpat:itip:'+OEQuantityInput+'.'+input.singleObjectId;
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
				var QuantityId		=	'urn:epc:idpat:itip:'+OEQuantityInput+'.'+id;
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
				var QuantityId			=	'urn:epc:id:itip:'+OEQuantityInput+"."+data[arrCount];
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
			OEQuantityInput			=	companyPrefix(OEQuantityInput, OEQuantityPreifxPoint);
		
		if(input.Quantitysgtintype == 'none')
		{
			var QuantityId		=	'urn:epc:idpat:upui:'+OEQuantityInput+'.'+input.singleObjectId;
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
				var QuantityId		=	'urn:epc:idpat:upui:'+OEQuantityInput+'.'+id;
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
				var QuantityId			=	'urn:epc:id:upui:'+OEQuantityInput+"."+data[arrCount];
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
		var OEQuantityInput			=	input.OEQManualURI;	
		callback(OEQuantityInput)		
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

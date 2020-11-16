const moment 				= 	require('moment');
const gs1 					= 	require('gs1');
const EPCsformatter			=	require('./URNtoURIEPCsformatter');
var EventIDArray			=	[];
const crypto        		= 	require('crypto');
const sha512 				= 	require('js-sha512').sha512;
const sha384 				= 	require('js-sha512').sha384;
const sha512_256 			= 	require('js-sha512').sha512_256;
const sha512_224 			= 	require('js-sha512').sha512_224;

exports.HashIDCreator		=	function(HashInput,HashInputDirect,File,EventIDArrayStore,callback)
{
	if(File == 'JSON')
	{		
		var Domain			=	'https://ns.gs1.org/';
		var Domain2			=	'https://id.gs1.org/';		
		var input			=	HashInputDirect;
		var HashIDString	=	"eventType=";
		var	hash			=	"";
		EventIDArray		=	EventIDArrayStore;
		var ExtensionArray	=	[];
		
		//Check for type of Event
		HashIDString		=	HashIDString 	+ 	HashInput.eventType;

		HashInput.eventTime	=	moment.utc(HashInput.eventTime).local().format('YYYY-MM-DDTHH:mm:SS.000');
		HashInput.eventTime	=	moment(HashInput.eventTime, 'YYYY-MM-DDTHH:mm:ss.000').subtract(HashInput.eventTimeZoneOffset).format('YYYY-MM-DDTHH:mm:ss.000') + 'Z';
		
		//Check for EventTime
		HashIDString		=	HashIDString	+ 	"\neventTime="	+ HashInput.eventTime;
		
		//Check for offset
		HashIDString		=	HashIDString	+ 	"\neventTimeZoneOffset="	+ HashInput.eventTimeZoneOffset;
		
		//Add the Error Declaration Elements to HashString
		if(HashInput.eventType2 == 'errordeclaration')
		{
			HashIDString	=	HashIDString	+ 	"\nerrorDeclaration";
			
			//Add declarationTime
			HashInput.declarationTime	=	moment.utc(HashInput.declarationTime).local().format('YYYY-MM-DDTHH:mm:SS.000');
			HashInput.declarationTime	=	moment(HashInput.declarationTime, 'YYYY-MM-DDTHH:mm:ss.000').subtract(HashInput.ErrorTimeZone).format('YYYY-MM-DDTHH:mm:ss.000') + 'Z';
			
			HashIDString	=	HashIDString	+ 	"\ndeclarationTime="	+ HashInput.declarationTime;
			
			//Add reason if undefined			
			if(HashInput.reason != undefined)
			{
				HashIDString	=	HashIDString	+ 	"\nreason="				+ HashInput.reason;
			}			
			
			//Add corrective Ids
			if(HashInput.correctiveEventIDs.length > 0 && typeof HashInput.correctiveEventIDs !== 'undefined')
			{
				HashIDString	=	HashIDString	+ 	"\ncorrectiveEventIDs";
				
				for(var cID=0; cID<HashInput.correctiveEventIDs.length; cID++)
				{
					HashIDString	=	HashIDString	+ 	"\ncorrectiveEventID="	+ HashInput.correctiveEventIDs[cID];
				}
			}						
		}
		
		//Based on Type of event type associate the EPC
		if(HashInput.eventType == 'ObjectEvent')
		{
			//If EPC elements are present then Loop through epc list and add EPC
			if(HashInput.epcList.length > 0)
			{
				HashIDString		=	HashIDString	+	'\nepcList';
				
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.URNtoURIEPCsformatter(HashInput.epcList,function(returnEPCs){
						//case-sensitive lexical ordering,
						returnEPCs	=	returnEPCs.sort();
						
						//Loop through and add all the EPCs
						for(var epc=0;epc<returnEPCs.length;epc++)
						{
							HashIDString	=	HashIDString	+ '\nepc=' + returnEPCs[epc]; 
						}
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{
					//case-sensitive lexical ordering,
					HashInput.epcList	=	HashInput.epcList.sort();
					
					//Loop through and add all the EPCs
					for(var epc=0; epc < HashInput.epcList.length; epc++)
					{
						HashIDString	=	HashIDString	+ '\nepc=' + HashInput.epcList[epc]; 
					}
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIFormatter(HashInput.epcList,function(returnEPCs){
						//case-sensitive lexical ordering,
						returnEPCs	=	returnEPCs.sort();
						
						//Loop through and add all the EPCs
						for(var epc=0;epc<returnEPCs.length;epc++)
						{
							HashIDString	=	HashIDString	+ '\nepc=' + returnEPCs[epc]; 
						}
					});
				}
			}
			
			//Check if Quantity has been added
			if(HashInput.quantityList.length > 0)
			{
				HashIDString			=	HashIDString	+	'\nquantityList';
				var QuantityArray		=	[];
				
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.QuantityURNtoURIEPCsformatter(HashInput.quantityList,function(returnQuantities)
					{					
						//Loop through and add all the EPCs
						for(var quantity=0;quantity<returnQuantities.length;quantity++)
						{					
							var QuantityString	=	"";
							
							QuantityString		=	QuantityString + '\nepcClass=' + returnQuantities[quantity].URI;
							
							if(returnQuantities[quantity].Quantity != '' && typeof returnQuantities[quantity].Quantity !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nquantity=' + parseFloat(returnQuantities[quantity].Quantity.toString());
							}
							
							if(returnQuantities[quantity].QuantityUOM != '' && typeof returnQuantities[quantity].QuantityUOM !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nuom='		 + returnQuantities[quantity].QuantityUOM;
							}
							
							QuantityArray.push(QuantityString);
						}				
						
						//case-sensitive lexical ordering,
						QuantityArray	=	QuantityArray.sort();
						
						//Loop through Quantity list and add all the quantities
						for(var quantity=0;quantity<QuantityArray.length;quantity++)
						{
							HashIDString	=	HashIDString	+	'\nquantityElement';
							HashIDString	=	HashIDString	+ 	QuantityArray[quantity];	
						}	
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{
					var QuantityArray			=	[];
				
					for(var quantity=0;quantity<HashInput.quantityList.length;quantity++)
					{
						var QuantityString		=	"";
						QuantityString			=	QuantityString	+ 	'epcClass=' + HashInput.quantityList[quantity].URI;
						
						if(HashInput.quantityList[quantity].Quantity != '' && typeof HashInput.quantityList[quantity].Quantity !== 'undefined')
						{
							QuantityString		=	QuantityString	+	'quantity=' 	+ parseFloat(HashInput.quantityList[quantity].Quantity);
						}
						
						if(HashInput.quantityList[quantity].QuantityUOM != '' && typeof HashInput.quantityList[quantity].QuantityUOM !== 'undefined')
						{
							QuantityString		=	QuantityString	+ 	'uom=' 		+ 	HashInput.quantityList[quantity].QuantityUOM;
						}
						
						QuantityArray.push(QuantityString)
					}
					
					//case-sensitive lexical ordering,
					QuantityArray	=	QuantityArray.sort();
					
					for(var quantity=0;quantity<QuantityArray.length;quantity++)
					{
						HashIDString	=	HashIDString	+	'\nquantityElement';
						
					}
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIQuantitiesFormatter(HashInput.quantityList,function(returnQuantities){
						//Loop through and add all the EPCs
						for(var quantity=0;quantity<returnQuantities.length;quantity++)
						{					
							var QuantityString	=	"";
							
							QuantityString		=	QuantityString + '\nepcClass=' + returnQuantities[quantity].URI;
							
							if(returnQuantities[quantity].Quantity != '' && typeof returnQuantities[quantity].Quantity !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nquantity=' + parseFloat(returnQuantities[quantity].Quantity.toString());
							}
							
							if(returnQuantities[quantity].QuantityUOM != '' && typeof returnQuantities[quantity].QuantityUOM !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nuom='		 + returnQuantities[quantity].QuantityUOM;
							}
							
							QuantityArray.push(QuantityString);
						}				
						
						//case-sensitive lexical ordering,
						QuantityArray	=	QuantityArray.sort();
						
						//Loop through Quantity list and add all the quantities
						for(var quantity=0;quantity<QuantityArray.length;quantity++)
						{
							HashIDString	=	HashIDString	+	'\nquantityElement';
							HashIDString	=	HashIDString	+ 	QuantityArray[quantity];	
						}	
					});
				}						
			}
		}
		else if(HashInput.eventType == 'AggregationEvent' || HashInput.eventType == 'AssociationEvent')
		{
			//Check if parent ID is added
			if(HashInput.parentID.length > 0)
			{
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.URNtoURIParentiDformatter(HashInput.parentID,function(returnEPCs){
						HashIDString	=	HashIDString	+ 	"\nparentID=" + returnEPCs;
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{	
					HashIDString	=	HashIDString	+ 	"\nparentID=" + HashInput.parentID;		
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIParentIDFormatter(HashInput.parentID,function(returnParentID){
						
						HashIDString	=	HashIDString	+ 	"\nparentID=" + returnParentID;	 
						
					});
				}			
			}
			
			//Check if Child EPCs is added
			if(HashInput.childEPCs.length > 0)
			{
				HashIDString	=	HashIDString	+ 	"\nchildEPCs";
				
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.URNtoURIEPCsformatter(HashInput.childEPCs,function(returnEPCs){
						//case-sensitive lexical ordering,
						returnEPCs	=	returnEPCs.sort();
						
						//Loop through and add all the EPCs
						for(var epc=0;epc<returnEPCs.length;epc++)
						{
							HashIDString	=	HashIDString	+ '\nepc=' + returnEPCs[epc]; 
						}
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{
					//case-sensitive lexical ordering,
					HashInput.childEPCs	=	HashInput.childEPCs.sort();
					
					for(var epc=0; epc<HashInput.childEPCs.length; epc++)
					{					
						HashIDString	=	HashIDString	+ '\nepc=' + HashInput.childEPCs[epc]; 					
					}
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIFormatter(HashInput.childEPCs,function(returnEPCs){
						//case-sensitive lexical ordering,
						returnEPCs	=	returnEPCs.sort();
						
						//Loop through and add all the EPCs
						for(var epc=0;epc<returnEPCs.length;epc++)
						{
							HashIDString	=	HashIDString	+ '\nepc=' + returnEPCs[epc]; 
						}
					});
				}				
			}
			
			//Check if Child Quantity has been added
			if(HashInput.childQuantityList.length > 0)
			{
				HashIDString				=	HashIDString	+	'\nchildQuantityList';
				var QuantityArray			=	[];
				
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.QuantityURNtoURIEPCsformatter(HashInput.childQuantityList,function(returnQuantities)
					{					
						//Loop through and add all the EPCs
						for(var quantity=0;quantity<returnQuantities.length;quantity++)
						{					
							var QuantityString	=	"";
							
							QuantityString		=	QuantityString + '\nepcClass=' + returnQuantities[quantity].URI;
							
							if(returnQuantities[quantity].Quantity != '' && typeof returnQuantities[quantity].Quantity !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nquantity=' + parseFloat(returnQuantities[quantity].Quantity.toString());
							}
							
							if(returnQuantities[quantity].QuantityUOM != '' && typeof returnQuantities[quantity].QuantityUOM !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nuom='		 + returnQuantities[quantity].QuantityUOM;
							}
							
							QuantityArray.push(QuantityString);
						}				
						
						//case-sensitive lexical ordering,
						QuantityArray	=	QuantityArray.sort();
						
						//Loop through Quantity list and add all the quantities
						for(var quantity=0;quantity<QuantityArray.length;quantity++)
						{
							HashIDString	=	HashIDString	+	'\nquantityElement';
							HashIDString	=	HashIDString	+ 	QuantityArray[quantity];	
						}	
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{
					var QuantityArray			=	[];
				
					for(var quantity=0;quantity<HashInput.childQuantityList.length;quantity++)
					{
						var QuantityString		=	"";
						QuantityString			=	QuantityString	+ 	'epcClass=' + HashInput.childQuantityList[quantity].URI;
						
						if(HashInput.childQuantityList[quantity].Quantity != '' && typeof HashInput.childQuantityList[quantity].Quantity !== 'undefined')
						{
							QuantityString		=	QuantityString	+	'quantity=' 	+ parseFloat(HashInput.childQuantityList[quantity].Quantity);
						}
						
						if(HashInput.childQuantityList[quantity].QuantityUOM != '' && typeof HashInput.childQuantityList[quantity].QuantityUOM !== 'undefined')
						{
							QuantityString		=	QuantityString	+ 	'uom=' 		+ 	HashInput.childQuantityList[quantity].QuantityUOM;
						}
						
						QuantityArray.push(QuantityString)
					}
					
					//case-sensitive lexical ordering,
					QuantityArray	=	QuantityArray.sort();
					
					for(var quantity=0;quantity<QuantityArray.length;quantity++)
					{
						HashIDString	=	HashIDString	+	'\nquantityElement';
						
					}
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIQuantitiesFormatter(HashInput.childQuantityList,function(returnQuantities){
						//Loop through and add all the EPCs
						for(var quantity=0;quantity<returnQuantities.length;quantity++)
						{					
							var QuantityString	=	"";
							
							QuantityString		=	QuantityString + '\nepcClass=' + returnQuantities[quantity].URI;
							
							if(returnQuantities[quantity].Quantity != '' && typeof returnQuantities[quantity].Quantity !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nquantity=' + parseFloat(returnQuantities[quantity].Quantity.toString());
							}
							
							if(returnQuantities[quantity].QuantityUOM != '' && typeof returnQuantities[quantity].QuantityUOM !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nuom='		 + returnQuantities[quantity].QuantityUOM;
							}
							
							QuantityArray.push(QuantityString);
						}				
						
						//case-sensitive lexical ordering,
						QuantityArray	=	QuantityArray.sort();
						
						//Loop through Quantity list and add all the quantities
						for(var quantity=0;quantity<QuantityArray.length;quantity++)
						{
							HashIDString	=	HashIDString	+	'\nquantityElement';
							HashIDString	=	HashIDString	+ 	QuantityArray[quantity];	
						}	
					});
				}				
			}
		}
		else if(HashInput.eventType == 'TransactionEvent')
		{			
			//Check if parent ID is added
			if(HashInput.parentID.length > 0)
			{
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.URNtoURIParentiDformatter(HashInput.parentID,function(returnEPCs){
						HashIDString	=	HashIDString	+ 	"\nparentID=" + returnEPCs;
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{	
					HashIDString	=	HashIDString	+ 	"\nparentID=" + HashInput.parentID;		
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIParentIDFormatter(HashInput.parentID,function(returnParentID){
						
						HashIDString	=	HashIDString	+ 	"\nparentID=" + returnParentID;	 
						
					});
				}			
			}
			
			//Check and add EPCs
			if(HashInput.EPCs.length > 0)
			{
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.URNtoURIEPCsformatter(HashInput.EPCs,function(returnEPCs){
						//case-sensitive lexical ordering,
						returnEPCs	=	returnEPCs.sort();
						
						//Loop through and add all the EPCs
						for(var epc=0;epc<returnEPCs.length;epc++)
						{
							HashIDString	=	HashIDString	+ '\nepc=' + returnEPCs[epc]; 
						}
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{
					//case-sensitive lexical ordering,
					HashInput.EPCs	=	HashInput.EPCs.sort();
					
					//Loop through and add all the EPCs
					for(var epc=0; epc < HashInput.EPCs.length; epc++)
					{
						HashIDString	=	HashIDString	+ '\nepc=' + HashInput.EPCs[epc]; 
					}
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIFormatter(HashInput.EPCs,function(returnEPCs){
						//case-sensitive lexical ordering,
						returnEPCs	=	returnEPCs.sort();
						
						//Loop through and add all the EPCs
						for(var epc=0;epc<returnEPCs.length;epc++)
						{
							HashIDString	=	HashIDString	+ '\nepc=' + returnEPCs[epc]; 
						}
					});
				}
			}
			
			//Check if Quantity has been added
			if(HashInput.quantityList.length > 0)
			{
				HashIDString			=	HashIDString	+	'\nquantityList';
				var QuantityArray		=	[];
				
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.QuantityURNtoURIEPCsformatter(HashInput.quantityList,function(returnQuantities)
					{					
						//Loop through and add all the EPCs
						for(var quantity=0;quantity<returnQuantities.length;quantity++)
						{					
							var QuantityString	=	"";
							
							QuantityString		=	QuantityString + '\nepcClass=' + returnQuantities[quantity].URI;
							
							if(returnQuantities[quantity].Quantity != '' && typeof returnQuantities[quantity].Quantity !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nquantity=' + parseFloat(returnQuantities[quantity].Quantity.toString());
							}
							
							if(returnQuantities[quantity].QuantityUOM != '' && typeof returnQuantities[quantity].QuantityUOM !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nuom='		 + returnQuantities[quantity].QuantityUOM;
							}
							
							QuantityArray.push(QuantityString);
						}				
						
						//case-sensitive lexical ordering,
						QuantityArray	=	QuantityArray.sort();
						
						//Loop through Quantity list and add all the quantities
						for(var quantity=0;quantity<QuantityArray.length;quantity++)
						{
							HashIDString	=	HashIDString	+	'\nquantityElement';
							HashIDString	=	HashIDString	+ 	QuantityArray[quantity];	
						}	
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{
					var QuantityArray			=	[];
				
					for(var quantity=0;quantity<HashInput.quantityList.length;quantity++)
					{
						var QuantityString		=	"";
						QuantityString			=	QuantityString	+ 	'epcClass=' + HashInput.quantityList[quantity].URI;
						
						if(HashInput.quantityList[quantity].Quantity != '' && typeof HashInput.quantityList[quantity].Quantity !== 'undefined')
						{
							QuantityString		=	QuantityString	+	'quantity=' 	+ parseFloat(HashInput.quantityList[quantity].Quantity);
						}
						
						if(HashInput.quantityList[quantity].QuantityUOM != '' && typeof HashInput.quantityList[quantity].QuantityUOM !== 'undefined')
						{
							QuantityString		=	QuantityString	+ 	'uom=' 		+ 	HashInput.quantityList[quantity].QuantityUOM;
						}
						
						QuantityArray.push(QuantityString)
					}
					
					//case-sensitive lexical ordering,
					QuantityArray	=	QuantityArray.sort();
					
					for(var quantity=0;quantity<QuantityArray.length;quantity++)
					{
						HashIDString	=	HashIDString	+	'\nquantityElement';
						
					}
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIQuantitiesFormatter(HashInput.quantityList,function(returnQuantities){
						
						//Loop through and add all the EPCs
						for(var quantity=0;quantity<returnQuantities.length;quantity++)
						{					
							var QuantityString	=	"";
							
							QuantityString		=	QuantityString + '\nepcClass=' + returnQuantities[quantity].URI;
							
							if(returnQuantities[quantity].Quantity != '' && typeof returnQuantities[quantity].Quantity !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nquantity=' + parseFloat(returnQuantities[quantity].Quantity.toString());
							}
							
							if(returnQuantities[quantity].QuantityUOM != '' && typeof returnQuantities[quantity].QuantityUOM !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nuom='		 + returnQuantities[quantity].QuantityUOM;
							}
							
							QuantityArray.push(QuantityString);
						}				
						
						//case-sensitive lexical ordering,
						QuantityArray	=	QuantityArray.sort();
						
						//Loop through Quantity list and add all the quantities
						for(var quantity=0;quantity<QuantityArray.length;quantity++)
						{
							HashIDString	=	HashIDString	+	'\nquantityElement';
							HashIDString	=	HashIDString	+ 	QuantityArray[quantity];	
						}	
					});
				}
			}
		}
		else if(HashInput.eventType == 'TransformationEvent')
		{			
			//Check if Input EPCs is populated
			if(HashInput.inputEPCs.length > 0)
			{
				HashIDString		=	HashIDString	+ 	"\ninputEPCList";
				
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.URNtoURIEPCsformatter(HashInput.inputEPCs,function(returnEPCs){
						//case-sensitive lexical ordering,
						returnEPCs	=	returnEPCs.sort();
						
						//Loop through and add all the EPCs
						for(var epc=0;epc<returnEPCs.length;epc++)
						{
							HashIDString	=	HashIDString	+ '\nepc=' + returnEPCs[epc]; 
						}
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{
					//case-sensitive lexical ordering,
					HashInput.inputEPCs	=	HashInput.inputEPCs.sort();
					
					//Loop through and add all the EPCs
					for(var epc=0; epc < HashInput.inputEPCs.length; epc++)
					{
						HashIDString	=	HashIDString	+ '\nepc=' + HashInput.inputEPCs[epc]; 
					}
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIFormatter(HashInput.inputEPCs,function(returnEPCs){
						//case-sensitive lexical ordering,
						returnEPCs	=	returnEPCs.sort();
						
						//Loop through and add all the EPCs
						for(var epc=0;epc<returnEPCs.length;epc++)
						{
							HashIDString	=	HashIDString	+ '\nepc=' + returnEPCs[epc]; 
						}
					});
				}
			}
			
			//Check if Input Quantity has been added
			if(HashInput.inputQuantityList.length > 0)
			{
				HashIDString			=	HashIDString	+	'\ninputQuantityList';				
				var QuantityArray		=	[];
				
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.QuantityURNtoURIEPCsformatter(HashInput.inputQuantityList,function(returnQuantities)
					{					
						//Loop through and add all the EPCs
						for(var quantity=0;quantity<returnQuantities.length;quantity++)
						{					
							var QuantityString	=	"";
							
							QuantityString		=	QuantityString + '\nepcClass=' + returnQuantities[quantity].URI;
							
							if(returnQuantities[quantity].Quantity != '' && typeof returnQuantities[quantity].Quantity !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nquantity=' + parseFloat(returnQuantities[quantity].Quantity.toString());
							}
							
							if(returnQuantities[quantity].QuantityUOM != '' && typeof returnQuantities[quantity].QuantityUOM !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nuom='		 + returnQuantities[quantity].QuantityUOM;
							}
							
							QuantityArray.push(QuantityString);
						}				
						
						//case-sensitive lexical ordering,
						QuantityArray	=	QuantityArray.sort();
						
						//Loop through Quantity list and add all the quantities
						for(var quantity=0;quantity<QuantityArray.length;quantity++)
						{
							HashIDString	=	HashIDString	+	'\nquantityElement';
							HashIDString	=	HashIDString	+ 	QuantityArray[quantity];	
						}	
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{
					var QuantityArray			=	[];
				
					for(var quantity=0;quantity<HashInput.inputQuantityList.length;quantity++)
					{
						var QuantityString		=	"";
						QuantityString			=	QuantityString	+ 	'epcClass=' + HashInput.inputQuantityList[quantity].URI;
						
						if(HashInput.inputQuantityList[quantity].Quantity != '' && typeof HashInput.inputQuantityList[quantity].Quantity !== 'undefined')
						{
							QuantityString		=	QuantityString	+	'quantity=' 	+ parseFloat(HashInput.inputQuantityList[quantity].Quantity);
						}
						
						if(HashInput.inputQuantityList[quantity].QuantityUOM != '' && typeof HashInput.inputQuantityList[quantity].QuantityUOM !== 'undefined')
						{
							QuantityString		=	QuantityString	+ 	'uom=' 		+ 	HashInput.inputQuantityList[quantity].QuantityUOM;
						}
						
						QuantityArray.push(QuantityString)
					}
					
					//case-sensitive lexical ordering,
					QuantityArray	=	QuantityArray.sort();
					
					for(var quantity=0;quantity<QuantityArray.length;quantity++)
					{
						HashIDString	=	HashIDString	+	'\nquantityElement';
						
					}
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIQuantitiesFormatter(HashInput.inputQuantityList,function(returnQuantities){
						
						//Loop through and add all the EPCs
						for(var quantity=0;quantity<returnQuantities.length;quantity++)
						{					
							var QuantityString	=	"";
							
							QuantityString		=	QuantityString + '\nepcClass=' + returnQuantities[quantity].URI;
							
							if(returnQuantities[quantity].Quantity != '' && typeof returnQuantities[quantity].Quantity !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nquantity=' + parseFloat(returnQuantities[quantity].Quantity.toString());
							}
							
							if(returnQuantities[quantity].QuantityUOM != '' && typeof returnQuantities[quantity].QuantityUOM !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nuom='		 + returnQuantities[quantity].QuantityUOM;
							}
							
							QuantityArray.push(QuantityString);
						}				
						
						//case-sensitive lexical ordering,
						QuantityArray	=	QuantityArray.sort();
						
						//Loop through Quantity list and add all the quantities
						for(var quantity=0;quantity<QuantityArray.length;quantity++)
						{
							HashIDString	=	HashIDString	+	'\nquantityElement';
							HashIDString	=	HashIDString	+ 	QuantityArray[quantity];	
						}	
					});
				}
			}
			
			//Check if Output EPCs is populated
			if(HashInput.outputEPCs.length > 0)
			{
				HashIDString			=	HashIDString	+ 	"\noutputEPCList";
				
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.URNtoURIEPCsformatter(HashInput.outputEPCs,function(returnEPCs){
						//case-sensitive lexical ordering,
						returnEPCs	=	returnEPCs.sort();
						
						//Loop through and add all the EPCs
						for(var epc=0;epc<returnEPCs.length;epc++)
						{
							HashIDString	=	HashIDString	+ '\nepc=' + returnEPCs[epc]; 
						}
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{
					//case-sensitive lexical ordering,
					HashInput.outputEPCs	=	HashInput.outputEPCs.sort();
					
					//Loop through and add all the EPCs
					for(var epc=0; epc < HashInput.outputEPCs.length; epc++)
					{
						HashIDString	=	HashIDString	+ '\nepc=' + HashInput.outputEPCs[epc]; 
					}
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIFormatter(HashInput.outputEPCs,function(returnEPCs){
						//case-sensitive lexical ordering,
						returnEPCs	=	returnEPCs.sort();
						
						//Loop through and add all the EPCs
						for(var epc=0;epc<returnEPCs.length;epc++)
						{
							HashIDString	=	HashIDString	+ '\nepc=' + returnEPCs[epc]; 
						}
					});
				}
			}
			
			//Check if Output Quantity has been added
			if(HashInput.outputQuantityList.length > 0)
			{
				HashIDString					=	HashIDString	+	'\noutputQuantityList';
				
				var QuantityArray		=	[];
				
				if(HashInputDirect.ElementssyntaxType == 'urn')
				{
					//Call the function to convert URN to Web URI
					EPCsformatter.QuantityURNtoURIEPCsformatter(HashInput.outputQuantityList,function(returnQuantities)
					{					
						//Loop through and add all the EPCs
						for(var quantity=0;quantity<returnQuantities.length;quantity++)
						{					
							var QuantityString	=	"";
							
							QuantityString		=	QuantityString + '\nepcClass=' + returnQuantities[quantity].URI;
							
							if(returnQuantities[quantity].Quantity != '' && typeof returnQuantities[quantity].Quantity !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nquantity=' + parseFloat(returnQuantities[quantity].Quantity.toString());
							}
							
							if(returnQuantities[quantity].QuantityUOM != '' && typeof returnQuantities[quantity].QuantityUOM !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nuom='		 + returnQuantities[quantity].QuantityUOM;
							}
							
							QuantityArray.push(QuantityString);
						}				
						
						//case-sensitive lexical ordering,
						QuantityArray	=	QuantityArray.sort();
						
						//Loop through Quantity list and add all the quantities
						for(var quantity=0;quantity<QuantityArray.length;quantity++)
						{
							HashIDString	=	HashIDString	+	'\nquantityElement';
							HashIDString	=	HashIDString	+ 	QuantityArray[quantity];	
						}	
					});
				}
				else if(HashInputDirect.ElementssyntaxType == 'webURI' && HashInputDirect.UserDefinedURI == '')
				{
					var QuantityArray			=	[];
				
					for(var quantity=0;quantity<HashInput.outputQuantityList.length;quantity++)
					{
						var QuantityString		=	"";
						QuantityString			=	QuantityString	+ 	'epcClass=' + HashInput.outputQuantityList[quantity].URI;
						
						if(HashInput.outputQuantityList[quantity].Quantity != '' && typeof HashInput.outputQuantityList[quantity].Quantity !== 'undefined')
						{
							QuantityString		=	QuantityString	+	'quantity=' 	+ parseFloat(HashInput.outputQuantityList[quantity].Quantity);
						}
						
						if(HashInput.outputQuantityList[quantity].QuantityUOM != '' && typeof HashInput.outputQuantityList[quantity].QuantityUOM !== 'undefined')
						{
							QuantityString		=	QuantityString	+ 	'uom=' 		+ 	HashInput.outputQuantityList[quantity].QuantityUOM;
						}
						
						QuantityArray.push(QuantityString)
					}
					
					//case-sensitive lexical ordering,
					QuantityArray	=	QuantityArray.sort();
					
					for(var quantity=0;quantity<QuantityArray.length;quantity++)
					{
						HashIDString	=	HashIDString	+	'\nquantityElement';
						
					}
				}
				else if(HashInputDirect.UserDefinedURI != '')
				{
					//Call the function to replace custom Web URI with GS1 web URI
					EPCsformatter.CustomWebURIQuantitiesFormatter(HashInput.outputQuantityList,function(returnQuantities){
						
						//Loop through and add all the EPCs
						for(var quantity=0;quantity<returnQuantities.length;quantity++)
						{					
							var QuantityString	=	"";
							
							QuantityString		=	QuantityString + '\nepcClass=' + returnQuantities[quantity].URI;
							
							if(returnQuantities[quantity].Quantity != '' && typeof returnQuantities[quantity].Quantity !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nquantity=' + parseFloat(returnQuantities[quantity].Quantity.toString());
							}
							
							if(returnQuantities[quantity].QuantityUOM != '' && typeof returnQuantities[quantity].QuantityUOM !== 'undefined')
							{
								QuantityString 	=	QuantityString + '\nuom='		 + returnQuantities[quantity].QuantityUOM;
							}
							
							QuantityArray.push(QuantityString);
						}				
						
						//case-sensitive lexical ordering,
						QuantityArray	=	QuantityArray.sort();
						
						//Loop through Quantity list and add all the quantities
						for(var quantity=0;quantity<QuantityArray.length;quantity++)
						{
							HashIDString	=	HashIDString	+	'\nquantityElement';
							HashIDString	=	HashIDString	+ 	QuantityArray[quantity];	
						}	
					});
				}				
			}
		}
		
		//Add the action property
		if(HashInput.action != '' && HashInput.eventType != "TransformationEvent" && typeof HashInput.action !== 'undefined')
		{
			HashIDString	=	HashIDString	+	'\naction=' + HashInput.action;
		}
		
		//Check if Transformation ID is populated for TransformationEvent
		if(HashInput.eventType == 'TransformationEvent' && typeof HashInput.transformationID !== 'undefined')
		{
			HashIDString	=	HashIDString	+	'\ntransformationID=' + HashInput.transformationID;
		}
		
		//Add the Business step to hashstring
		if(HashInput.bizStep != '' && typeof HashInput.bizStep !== 'undefined')
		{
			HashIDString	=	HashIDString	+	'\nbizStep=' + Domain + 'cbv/BizStep-' + input.businessStep;
		}
		
		//Add the Disposition to hashstring
		if(HashInput.disposition != '' && typeof HashInput.disposition !== 'undefined')
		{
			HashIDString	=	HashIDString	+	'\ndisposition=' 	+ Domain + 'cbv/Disp-' + input.disposition;
		}
		
		//Add the readPoint to HashString
		if(HashInput.ReadPointID != '' && typeof HashInput.ReadPointID !== 'undefined')
		{
			HashIDString	=	HashIDString	+ '\n' + 'readPoint';
			
			if(input.readpointselector == 'manually')
			{
				HashIDString	=	HashIDString	+ '\nid=' + HashInput.ReadPointID;
			}
			else if(input.readpointselector == 'sgln' && input.readpointsgln2 == 0)
			{
				HashIDString	=	HashIDString	+ '\nid=' + Domain2 + '414/'  + input.readpointsgln1;
			}
			else
			{
				HashIDString	=	HashIDString	+ '\nid=' + Domain2 + '414/'  + input.readpointsgln1 + '/254/' + input.readpointsgln2;
			}
		}
		
		//Add the BizLocation to HashString
		if(HashInput.bizLocationID != '' && typeof HashInput.bizLocationID !== 'undefined')
		{
			HashIDString	=	HashIDString	+ '\n' + 'bizLocation';
			
			if(input.businesslocationselector == 'manually')
			{
				HashIDString	=	HashIDString	+ '\nid=' + HashInput.bizLocationID;
			}
			else if(input.businesslocationselector == 'sgln' && input.businesspointsgln2  == 0)
			{
				HashIDString	=	HashIDString 	+ '\nid=' + Domain2 + '414/'  + input.businesspointsgln1;
			}
			else if(input.businesslocationselector == 'sgln')
			{
				HashIDString	=	HashIDString 	+ '\nid=' + Domain2 + '414/'  + input.businesspointsgln1 + '/254/' + input.businesspointsgln2;
			}				
		}
		
		//Check if bizTransactionList  is populated
		if(HashInput.BTT.length > 0)
		{			
			HashIDString					=	HashIDString	+ '\n' + 'bizTransactionList';
			var BusinessTransactionArray	=	[];
			
			//Add the business transactions to array with formatting
			for(var btt=0; btt<HashInput.BTT.length; btt++)
			{
				var BTTString	=	"";
				BTTString		=	BTTString	+ Domain +'BT-'+HashInput.BTT[btt].BTT.Value + Domain + 'BTT-' + HashInput.BTT[btt].BTT.Type;
				BusinessTransactionArray.push(BTTString); 
			}
			
			//Order the contents of Business Transaction
			BusinessTransactionArray		=	BusinessTransactionArray.sort();
			
			//Add the sorted Business Transaction to HashID
			for(var btt=0; btt<BusinessTransactionArray.length; btt++)
			{
				HashIDString	=	HashIDString	+ '\nbizTransaction=' + BusinessTransactionArray[btt];				
			}			
		}
		
		//Check if Source is populated
		if(input.sourcesType != '' && input.sourcesType != null && input.sourcesType != undefined)
		{
			HashIDString	=	HashIDString	+ '\n' 			+	'sourceList';
			
			if(input.sourcesType == 'owning_party' || input.sourcesType == 'processing_party' || input.sourcesType == 'location')
			{
				input.SourceGLN		=	input.SourceGLN.substring(0,12) + gs1.checkdigit(input.SourceGLN.substring(0,12));
				
				if(input.sourcesType == 'owning_party' || input.sourcesType == 'processing_party')
				{
					if(input.SourceLNType == 'pgln')
					{
						HashIDString	=	HashIDString	+ '\nsource=' + Domain + '417/' + input.SourceGLN + Domain + 'voc/SDT-'+input.sourcesType;	
					}
					else if(input.SourceLNType == 'sgln')
					{
						HashIDString	=	HashIDString	+ '\nsource='  + Domain + '417/' + input.SourceGLN +'/254/'+input.SourceGLNExtension + Domain + 'voc/SDT-'+input.sourcesType;
					}
				}
				else if(input.sourcesType == 'location')
				{
					HashIDString	=	HashIDString	+ '\nsource=' + Domain + '417/'+input.SourceGLN +'/254/'+input.SourceGLNExtension + Domain + 'voc/SDT-'+input.sourcesType;
				}
			}			
			else if(input.sourcesType == 'other')
			{
				HashIDString	=	HashIDString	+ '\nsource=' +	input.OtherSourceURI1 + input.OtherSourceURI2;
			}
		}
		
		//Check if Destination is populated
		if(input.destinationsType != '' && input.destinationsType != null && input.destinationsType != undefined)
		{
			HashIDString	=	HashIDString	+ '\n' 					+	'destinationList';
			
			if(input.destinationsType == 'owning_party' || input.destinationsType == 'processing_party' || input.destinationsType == 'location')
			{
				//Find the check digit in 13th place
				input.DestinationGLN	=	input.DestinationGLN.substring(0,12) + gs1.checkdigit(input.DestinationGLN.substring(0,12));
				
				if(input.destinationsType == 'owning_party' || input.destinationsType == 'processing_party')
				{
					//If PGLN then directly append
					if(input.DestinationLNType == 'pgln')
					{
						HashIDString	=	HashIDString	+ '\ndestination=' + Domain + '417/'+input.DestinationGLN + Domain + 'voc/SDT-'+input.destinationsType;	
					}
					else if(input.DestinationLNType == 'sgln')
					{
						HashIDString	=	HashIDString	+ '\ndestination=' + Domain + '414/' + input.DestinationGLN + '/254/' + input.DestinationGLNExtension + Domain + 'voc/SDT-'+input.destinationsType;
					}
				}
				else if(input.destinationsType == 'location')
				{
					HashIDString	=	HashIDString	+ '\ndestination=' + Domain + '414/' + input.DestinationGLN + '/254/' + input.DestinationGLNExtension + Domain + 'voc/SDT-'+input.destinationsType;
				}				
			}
			else if(input.destinationsType == 'other')
			{
				HashIDString	=	HashIDString	+ '\nsource=' +	input.OtherDestinationURI1 + input.OtherDestinationURI2;
			}			
		}
		
		//Add the sensor elements if present
		if(HashInput.Sensor.length > 0)
		{
			HashIDString	=	HashIDString	+ '\n' + 'sensorElementList';
			var SensorForm	=	HashInput.Sensor;
			
			for(var sf=0; sf<SensorForm.length; sf++)
			{
				HashIDString	=	HashIDString	+ '\n' + 'sensorElement';
				
				//Loop through Each sensor Element and write the meta data
				for(var t=0; t<SensorForm[sf].length; t++)
				{
					HashIDString =	HashIDString	+ '\n' + 'sensorMetaData';
					
					//Add the Sensor Metadata information if its populated
					SensorChecker(SensorForm[sf][t].Time,'time')
					SensorChecker(SensorForm[sf][t].StartTime,'startTime')
					SensorChecker(SensorForm[sf][t].EndTime,'endTime')
					SensorChecker(SensorForm[sf][t].DeviceID,'deviceID')
					SensorChecker(SensorForm[sf][t].DeviceMetadata,'deviceMetaData')
					SensorChecker(SensorForm[sf][t].RawData,'rawData')
					SensorChecker(SensorForm[sf][t].DataProcessingMethod,'dataProcessingMethod')
					SensorChecker(SensorForm[sf][t].BusinessRules,'bizRules')
					
					var SensorElements		=	SensorForm[sf][t].SensorElements;
					
					//Check if there are any sensor elements and add it to the HashID
					if(SensorElements.length > 0)
					{
						//Loop and add the sensor Elements
						for(var e=0;e<SensorElements.length;e++)
						{
							HashIDString	=	HashIDString	+ '\n' + 'sensorReport';
							
							var SensorType	=	SensorElements[e].SensorFields.Type;
							
							SensorChecker(SensorElements[e].SensorFields.Time,'time')
							
							if(SensorType != '' && SensorType != null && SensorType != undefined)
							{
								HashIDString	=	HashIDString + '\n' + 'gs1:'+SensorType;
							}
							
							//Check if the field is populated and add it to the sensor element list
						    SensorChecker(SensorElements[e].SensorFields.DeviceID,'deviceID')
						    SensorChecker(SensorElements[e].SensorFields.DeviceMetaData,'deviceMetaData')
						    SensorChecker(SensorElements[e].SensorFields.RawData,'rawData')
						    SensorChecker(SensorElements[e].SensorFields.DataProcessingMethod,'dataProcessingMethod')
						    SensorChecker(SensorElements[e].SensorFields.Time,'time')
						    SensorChecker(SensorElements[e].SensorFields.Microorganism,'microorganism')
						    SensorChecker(SensorElements[e].SensorFields.ChemicalSubstance,'chemicalSubstance')							
						    SensorChecker(SensorElements[e].SensorFields.Value,'value')
						    SensorChecker(SensorElements[e].SensorFields.Component,'component')
						    SensorChecker(SensorElements[e].SensorFields.StringValue,'stringValue')
						    SensorChecker(SensorElements[e].SensorFields.BooleanValue,'booleanValue')
						    SensorChecker(SensorElements[e].SensorFields.HexBinaryValue,'hexBinaryValue')
						    SensorChecker(SensorElements[e].SensorFields.URIValue,'uriValue')		
						    SensorChecker(SensorElements[e].SensorFields.MaxValue,'maxValue')							
						    SensorChecker(SensorElements[e].SensorFields.MinValue,'minValue')							
						    SensorChecker(SensorElements[e].SensorFields.MeanValue,'meanValue')						
						    SensorChecker(SensorElements[e].SensorFields.StandardDeviation,'sDev')	
						    SensorChecker(SensorElements[e].SensorFields.PercRank,'percRank')	
						    SensorChecker(SensorElements[e].SensorFields.PercValue,'percValue')								
						    SensorChecker(SensorElements[e].SensorFields.UOM,'uom')
						}
					}
				}
			}
			
		}
		
		//Function to check the sensorMetaData and Report and populate
		function SensorChecker(field, attValue)
		{
			if(field != '' && field != null && field != undefined)
			{
				HashIDString	=	HashIDString + '\n' + attValue + '=' + field;
			}
		}
		
		//Check and add ILMD elements
		if(HashInput.eventType == 'ObjectEvent' || HashInput.eventType == 'TransformationEvent')
		{
			//Check and add the ILMD
			if(HashInput.ILMD.length > 0)
			{				
				var ILMDArray		=	[];
				HashIDString		=	HashIDString + '\n' + 'ilmd';
				
				//Format and push the ILMD elements to an Array
				for(var ilmd=0; ilmd<HashInput.ILMD.length; ilmd++)
				{
					if(HashInput.ILMD[ilmd].ComplexILMD.length > 0)
					{
						var ComplexArray 	=	"";
						
						ComplexArray	=	'{https://ns.example.com/epcis}' + HashInput.ILMD[ilmd].LocalName;
						
						for(var Cex=0; Cex<HashInput.ILMD[ilmd].ComplexILMD.length;Cex++)
						{
							if(HashInput.ILMD[ilmd].ComplexILMD[Cex].FreeText == '')
							{
								ComplexArray = ComplexArray + '\n' + '{https://ns.example.com/epcis}' + HashInput.ILMD[ilmd].ComplexILMD[Cex].LocalName;
							}
							else
							{
								ComplexArray = ComplexArray + '\n' + '{https://ns.example.com/epcis}' + HashInput.ILMD[ilmd].ComplexILMD[Cex].LocalName + '=' + HashInput.ILMD[ilmd].ComplexILMD[Cex].FreeText;
							}
						}
						
						ILMDArray.push(ComplexArray)
					}
					else
					{
						if(HashInput.ILMD[ilmd].FreeText == '')
						{
							ILMDArray.push('{https://ns.example.com/epcis}' + HashInput.ILMD[ilmd].LocalName)
						}
						else
						{
							ILMDArray.push('{https://ns.example.com/epcis}' + HashInput.ILMD[ilmd].LocalName + '=' + HashInput.ILMD[ilmd].FreeText)
						}	
					}	
				}		
				
				//Sort the ILMD array 
				ILMDArray	=	ILMDArray.sort();
				
				//Add the ILMD to HashString
				for(var ilmd=0; ilmd<ILMDArray.length;ilmd++)
				{
					HashIDString		=	HashIDString + '\n' + ILMDArray[ilmd];
				}
				
			}
		}
		
		
		//Add the extension to HashString by ordering them
		if(HashInput.Extension.length > 0)
		{			
			//Format and add the elements to Extension Array
			if(HashInput.Extension.length > 0)
			{				
				//Format and add the elements to Extension Array
				for(var ex=0; ex<HashInput.Extension.length; ex++)
				{					
					if(HashInput.Extension[ex].ComplexExtension.length > 0)
					{
						var ComplexArray 	=	"";
						
						ComplexArray	=	'{https://ns.example.com/epcis}' + HashInput.Extension[ex].LocalName;
						
						for(var Cex=0; Cex<HashInput.Extension[ex].ComplexExtension.length;Cex++)
						{
							if(HashInput.Extension[ex].ComplexExtension[Cex].FreeText == '')
							{
								ComplexArray = ComplexArray + '\n' + '{https://ns.example.com/epcis}' + HashInput.Extension[ex].ComplexExtension[Cex].LocalName;
							}
							else
							{
								ComplexArray = ComplexArray + '\n' + '{https://ns.example.com/epcis}' + HashInput.Extension[ex].ComplexExtension[Cex].LocalName + '=' + HashInput.Extension[ex].ComplexExtension[Cex].FreeText;
							}
						}
						
						ExtensionArray.push(ComplexArray)
					}
					else
					{
						if(HashInput.Extension[ex].FreeText == '')
						{
							ExtensionArray.push('{https://ns.example.com/epcis}' + HashInput.Extension[ex].LocalName)
						}
						else
						{
							ExtensionArray.push('{https://ns.example.com/epcis}' + HashInput.Extension[ex].LocalName + '=' + HashInput.Extension[ex].FreeText)
						}	
					}		
				}
			}		
		}
		
		//Check if User extension for error event has been added
		if(HashInput.eventType2 == 'errordeclaration')
		{
			if(HashInput.errorExtension.length > 0)
			{				
				//Format and add the elements to Extension Array
				for(var ex=0; ex<HashInput.errorExtension.length; ex++)
				{					
					if(HashInput.errorExtension[ex].ComplexErrorExtension.length > 0)
					{
						var ComplexArray 	=	"";
						
						ComplexArray	=	'{https://ns.example.com/epcis}' + HashInput.errorExtension[ex].LocalName;
						
						for(var Cex=0; Cex<HashInput.errorExtension[ex].ComplexErrorExtension.length;Cex++)
						{
							if(HashInput.errorExtension[ex].ComplexErrorExtension[Cex].FreeText == '')
							{
								ComplexArray = ComplexArray + '\n' + '{https://ns.example.com/epcis}' + HashInput.errorExtension[ex].ComplexErrorExtension[Cex].LocalName;
							}
							else
							{
								ComplexArray = ComplexArray + '\n' + '{https://ns.example.com/epcis}' + HashInput.errorExtension[ex].ComplexErrorExtension[Cex].LocalName + '=' + HashInput.errorExtension[ex].ComplexErrorExtension[Cex].FreeText;
							}
						}
						
						ExtensionArray.push(ComplexArray)
					}
					else
					{
						if(HashInput.errorExtension[ex].FreeText == '')
						{
							ExtensionArray.push('{https://ns.example.com/epcis}' + HashInput.errorExtension[ex].LocalName)
						}
						else
						{
							ExtensionArray.push('{https://ns.example.com/epcis}' + HashInput.errorExtension[ex].LocalName + '=' + HashInput.errorExtension[ex].FreeText)
						}	
					}		
				}
			}
		}
		
		//Check if User extensions have been added if so add it to the Hash String
		if(ExtensionArray.length > 0)
		{
			//Sort the extension Array
			ExtensionArray		=	ExtensionArray.sort();
			
			//Loop and add the extension
			for(var ex=0; ex<ExtensionArray.length; ex++)
			{
				HashIDString	=	HashIDString + '\n' + ExtensionArray[ex];
			}
		}
		
		//console.log("**********************")
		//console.log(HashIDString);
		
		//Remove the Linebreaks
		HashIDString	=	HashIDString.replace(/(\r\n|\n|\r)/gm, "");
		
		//Based on user selection of HASH ID create the HASHING		
		if(input.HashIDType == 'SHA256')
		{
			hash	=	'ni:///sha-256;' + crypto.createHash('sha256').update(HashIDString).digest('hex') + '?ver=CBV2.0';
		}
		else if(input.HashIDType == 'SHA512')
		{
			hash	=	'ni:///sha-512;' + sha512(HashIDString) + '?ver=CBV2.0';
		}
		else if(input.HashIDType == 'SHA384')
		{
			hash	=	'ni:///sha-384;' + sha384(HashIDString) + '?ver=CBV2.0';
		}
		else if(input.HashIDType == 'SHA512_256')
		{
			hash	=	'ni:///sha-512_256;' + sha512_256(HashIDString) + '?ver=CBV2.0';
		}
		else if(input.HashIDType == 'SHA512_224')
		{
			hash	=	'ni:///sha-512_224;' + sha512_224(HashIDString) + '?ver=CBV2.0';
		}
		
		//console.log(HashIDString);
		//console.log(hash);
		//console.log("**********************");
		
		callback(hash);
	}
	else if(File == 'XML')
	{
		callback(EventIDArray);
	}
}
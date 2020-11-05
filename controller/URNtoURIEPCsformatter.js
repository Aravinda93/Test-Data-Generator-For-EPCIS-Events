gs1 			= 	require('gs1');

exports.URNtoURIEPCsformatter		=	function(EPCs,callback)
{
	var ReturnEPCsArray		=	[];
	//Check if the EPCs belong to SGTIN
	if(EPCs[0].includes('urn:epc:id:sgtin:'))
	{
		//Loop through the array and convert to WEB URI
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var lastIndex		=	EPCs[epc].lastIndexOf(":");
			var CompanyPrefix	=	EPCs[epc].charAt(EPCs[epc].indexOf('.')+1) + EPCs[epc].slice(lastIndex+1,EPCs[epc].indexOf('.'));
			var RemainingString	=	EPCs[epc].substring(EPCs[epc].indexOf('.')+2,EPCs[epc].length);
				CompanyPrefix	=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'))
				CompanyPrefix	=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber	=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.lenth)
			var FinalSGTIN		=	'https://id.gs1.org/01/' + CompanyPrefix + '/21/' + SerialNumber;
			ReturnEPCsArray.push(FinalSGTIN);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:sscc:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix	=	EPCs[epc].charAt(EPCs[epc].indexOf('.')+1) + EPCs[epc].substring(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			var FinalSSCC		=	'https://id.gs1.org/00/' + CompanyPrefix + EPCs[epc].substring(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
			ReturnEPCsArray.push(FinalSSCC);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:sgln:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			
			if(EPCs[epc].charAt(EPCs[epc].indexOf('.')+1) != '.')
			{
				CompanyPrefix		=	CompanyPrefix + EPCs[epc].charAt(EPCs[epc].indexOf('.')+1);
				var RemainingString	=	EPCs[epc].substring(EPCs[epc].indexOf('.')+2,EPCs[epc].length);
				CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'))
			}
			else
			{
				var RemainingString	=	EPCs[epc].substring(EPCs[epc].indexOf('.')+2,EPCs[epc].length);
			}			
			
			CompanyPrefix			=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.lenth);
			var FinalSGLN			=	'https://id.gs1.org/414/' + CompanyPrefix + '/254/' + SerialNumber;
			ReturnEPCsArray.push(FinalSGLN);
		}		
	}
	else if(EPCs[0].includes('urn:epc:id:grai:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			var RemainingString		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
				CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'))
				CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			var FinalGRAI			=	'https://id.gs1.org/8003/' + CompanyPrefix  + SerialNumber;
			ReturnEPCsArray.push(FinalGRAI);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:giai:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			var SerialNumber		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
			var FinalGIAI			=	'https://id.gs1.org/8004/' + CompanyPrefix  + SerialNumber;
			ReturnEPCsArray.push(FinalGIAI);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:gsrn:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
				CompanyPrefix		=	CompanyPrefix	+ gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
			var FinalGSRN			=	'https://id.gs1.org/8018/' + CompanyPrefix  + SerialNumber;
			ReturnEPCsArray.push(FinalGSRN);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:gsrnp:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
				CompanyPrefix		=	CompanyPrefix	+ gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
			var FinalGSRNP			=	'https://id.gs1.org/8017/' + CompanyPrefix  + SerialNumber;
			ReturnEPCsArray.push(FinalGSRNP);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:gdti:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			var RemainingString		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
				CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'));
				CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			var FinalGDTI			=	'https://id.gs1.org/253/' + CompanyPrefix + SerialNumber;
			ReturnEPCsArray.push(FinalGDTI);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:sgcn:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			var RemainingString		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
				CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'));
				CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			var FinalGCN			=	'https://id.gs1.org/255/' + CompanyPrefix + SerialNumber;
			ReturnEPCsArray.push(FinalGCN);			
		}
	}
	else if(EPCs[0].includes('urn:epc:id:cpi:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			var RemainingString		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
				CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'));
			var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			var FinalGCN			=	'https://id.gs1.org/8010/' + CompanyPrefix + '/8011/' + SerialNumber;
			ReturnEPCsArray.push(FinalGCN);			
		}
	}
	else if(EPCs[0].includes('urn:epc:id:ginc:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			var SerialNumber		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
			var FinalGCN			=	'https://id.gs1.org/401/' + CompanyPrefix + SerialNumber;
			ReturnEPCsArray.push(FinalGCN);			
		}
	}
	else if(EPCs[0].includes('urn:epc:id:gsin:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			var SerialNumber		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
			var FinalGSIN			=	'https://id.gs1.org/402/' + CompanyPrefix + '0' + SerialNumber;
			ReturnEPCsArray.push(FinalGSIN);			
		}
	}
	else if(EPCs[0].includes('urn:epc:id:itip:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].charAt(EPCs[epc].indexOf('.')+1) + 	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			var RemainingString		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+2,EPCs[epc].length);
				CompanyPrefix		=	CompanyPrefix + RemainingString.substring(0,RemainingString.indexOf('.'));
				CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix)
			var RemainingString2	=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
				CompanyPrefix		=	CompanyPrefix + RemainingString2.substring(0,RemainingString2.indexOf('.'));
			var RemainingString3	=	RemainingString2.slice(RemainingString2.indexOf('.')+1,RemainingString2.length);
				CompanyPrefix		=	CompanyPrefix + RemainingString3.substring(0,RemainingString3.indexOf('.'));
			var SerialNumber		=	RemainingString3.slice(RemainingString3.indexOf('.')+1,RemainingString3.length);
			var FinalITIP			=	'https://id.gs1.org/8006/' + CompanyPrefix + '/21/' + SerialNumber;
			ReturnEPCsArray.push(FinalITIP);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:upui:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var CompanyPrefix		=	EPCs[epc].charAt(EPCs[epc].indexOf('.')+1) + 	EPCs[epc].slice(EPCs[epc].lastIndexOf(":")+1,EPCs[epc].indexOf('.'));
			var RemainingString		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+2,EPCs[epc].length);
				CompanyPrefix		=	CompanyPrefix + RemainingString.substring(0,RemainingString.indexOf('.'));
				CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix)
			var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			var FinalUPUI			=	'https://id.gs1.org/01/' + CompanyPrefix + '/235/' + SerialNumber;
			ReturnEPCsArray.push(FinalUPUI);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:gid:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var Manager		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(':')+1,EPCs[epc].indexOf('.'));
			var Class		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].lastIndexOf('.'))
			var Serial		=	EPCs[epc].slice(EPCs[epc].lastIndexOf('.')+1,EPCs[epc].length)
			var FinalGID	=	'https://id.gs1.org/gid/' + Manager + Class + Serial;
			ReturnEPCsArray.push(FinalGID);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:usdod:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var Cage		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(':')+1,EPCs[epc].indexOf('.'));
			var Serial		=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
			var FinalUSDOD	=	'https://id.gs1.org/usdod/' + Cage + Serial;
			ReturnEPCsArray.push(FinalUSDOD);
		}
	}
	else if(EPCs[0].includes('urn:epc:id:adi:'))
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{
			var Cage		=	EPCs[epc].slice(EPCs[epc].lastIndexOf(':')+1,EPCs[epc].indexOf('.'));
			var Remaining	=	EPCs[epc].slice(EPCs[epc].indexOf('.')+1,EPCs[epc].length);
			var PNO			=	Remaining.slice(0,Remaining.indexOf('.'));
			var Serial		=	EPCs[epc].slice(EPCs[epc].lastIndexOf('.')+1,EPCs[epc].length);
			var FinalADI	=	'https://id.gs1.org/usdod/' + Cage + PNO + Serial;
			ReturnEPCsArray.push(FinalADI);
		}
	}
	else
	{
		for(var epc=0; epc<EPCs.length; epc++)
		{			
			var FinalURI	=	EPCs[epc].URI;	
			ReturnEPCsArray.push(FinalURI);
		}
	}
	
	callback(ReturnEPCsArray);
}

//Replace the Custom web URI with the GS1 default URI
exports.CustomWebURIFormatter		=	function(EPCs,callback)
{
	var GS1formattedURI			=	[];
	var GS1Domain				=	'https://id.gs1.org/';
	
	//Loop and replace all the custom domain of EPCs to GS1
	for(var epc=0; epc<EPCs.length; epc++)
	{
		var CustomEPC 	= 	EPCs[epc].replace(/([^\/]*\/){3}/, '');
			CustomEPC	=	GS1Domain	+  CustomEPC;
		GS1formattedURI.push(CustomEPC)
	}
	
	callback(GS1formattedURI)
}

//Format the Quantiteis to replace Custome WebURI with GS1 Default URI
exports.CustomWebURIQuantitiesFormatter	=	function(Quantities,callback)
{
	var GS1formattedQuantities	=	[];
	var GS1Domain				=	'https://id.gs1.org/';
	
	//Loop and replace all the custom domain of EPCs to GS1
	for(var q=0; q<Quantities.length; q++)
	{
		var CustomQuantity	= 	Quantities[q].URI.replace(/([^\/]*\/){3}/, '');
			CustomQuantity	=	GS1Domain	+  CustomQuantity;
			
		var Obj				=	new Object();
		Obj['URI']			=	CustomQuantity;
		Obj['QuantityType']	=	Quantities[q].QuantityType;
		Obj['Quantity']		=	Quantities[q].Quantity;
		Obj['QuantityUOM']	=	Quantities[q].QuantityUOM;
		GS1formattedQuantities.push(Obj);
	}
	
	callback(GS1formattedQuantities)
}

//Format the Quantity URI to Web URI
exports.QuantityURNtoURIEPCsformatter	=	function(Quantities,callback)
{
	var ReturnQuantityArray		=	[];

	if(Quantities[0].URI.includes('urn:epc:class:lgtin:'))
	{
		for(var q=0; q<Quantities.length; q++)
		{
			var CompanyPrefix	=	Quantities[q].URI.charAt(Quantities[q].URI.indexOf('.')+1) + Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf(':')+1,Quantities[q].URI.indexOf('.'));
				CompanyPrefix	=	CompanyPrefix + Quantities[q].URI.slice(Quantities[q].URI.indexOf('.')+2,Quantities[q].URI.lastIndexOf('.'));
				CompanyPrefix	=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber	=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf('.')+1,Quantities[q].URI.length);
			var FinalLGTIN		=	'https://id.gs1.org/01/' + CompanyPrefix + '/10/' + SerialNumber			
			
			var Obj				=	new Object();
			Obj['URI']			=	FinalLGTIN;
			Obj['QuantityType']	=	Quantities[q].QuantityType;
			Obj['Quantity']		=	Quantities[q].Quantity;
			Obj['QuantityUOM']	=	Quantities[q].QuantityUOM;
			ReturnQuantityArray.push(Obj);
		}		
	}
	else if(Quantities[0].URI.includes('urn:epc:idpat:sgtin:'))
	{
		for(var q=0; q<Quantities.length; q++)
		{
			var CompanyPrefix	=	Quantities[q].URI.charAt(Quantities[q].URI.indexOf('.')+1) + Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf(':')+1,Quantities[q].URI.indexOf('.'));
				CompanyPrefix	=	CompanyPrefix + Quantities[q].URI.slice(Quantities[q].URI.indexOf('.')+2,Quantities[q].URI.lastIndexOf('.'));
				CompanyPrefix	=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber	=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf('.')+1,Quantities[q].URI.length);
			var FinalGTIN		=	'https://id.gs1.org/01/' + CompanyPrefix + '/21/' + SerialNumber;			
			
			var Obj				=	new Object();
			Obj['URI']			=	FinalGTIN;
			Obj['QuantityType']	=	Quantities[q].QuantityType;
			Obj['Quantity']		=	Quantities[q].Quantity;
			Obj['QuantityUOM']	=	Quantities[q].QuantityUOM;
			ReturnQuantityArray.push(Obj);
		}		
	}
	else if(Quantities[0].URI.includes('urn:epc:idpat:grai:'))
	{
		for(var q=0; q<Quantities.length; q++)
		{
			var CompanyPrefix		=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf(":")+1,Quantities[q].URI.indexOf('.'));
			var RemainingString		=	Quantities[q].URI.slice(Quantities[q].URI.indexOf('.')+1,Quantities[q].URI.length);
				CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'))
				CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			var FinalGRAI			=	'https://id.gs1.org/8003/' + CompanyPrefix  + SerialNumber;
			
			var Obj					=	new Object();
			Obj['URI']				=	FinalGRAI;
			Obj['QuantityType']		=	Quantities[q].QuantityType;
			Obj['Quantity']			=	Quantities[q].Quantity;
			Obj['QuantityUOM']		=	Quantities[q].QuantityUOM;
			ReturnQuantityArray.push(Obj);
		}		
	}
	else if(Quantities[0].URI.includes('urn:epc:idpat:gdti:'))
	{
		for(var q=0; q<Quantities.length; q++)
		{
			var CompanyPrefix		=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf(":")+1,Quantities[q].URI.indexOf('.'));
				CompanyPrefix		=	CompanyPrefix + Quantities[q].URI.slice(Quantities[q].URI.indexOf('.')+1,Quantities[q].URI.lastIndexOf("."));
				CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf('.')+1,Quantities[q].URI.length);
			var FinalGDTI			=	'https://id.gs1.org/gdti/' + CompanyPrefix + SerialNumber;
			
			var Obj					=	new Object();
			Obj['URI']				=	FinalGDTI;
			Obj['QuantityType']		=	Quantities[q].QuantityType;
			Obj['Quantity']			=	Quantities[q].Quantity;
			Obj['QuantityUOM']		=	Quantities[q].QuantityUOM;
			ReturnQuantityArray.push(Obj);
		}
	}
	else if(Quantities[0].URI.includes('urn:epc:idpat:sgcn:'))
	{
		for(var q=0; q<Quantities.length; q++)
		{
			var CompanyPrefix		=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf(":")+1,Quantities[q].URI.indexOf('.'));
				CompanyPrefix		=	CompanyPrefix + Quantities[q].URI.slice(Quantities[q].URI.indexOf('.')+1,Quantities[q].URI.lastIndexOf('.'));
				CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf('.')+1,Quantities[q].URI.length);
			var FinalSGCN			=	'https://id.gs1.org/gcn/' + CompanyPrefix + SerialNumber;
			
			var Obj					=	new Object();
			Obj['URI']				=	FinalSGCN;
			Obj['QuantityType']		=	Quantities[q].QuantityType;
			Obj['Quantity']			=	Quantities[q].Quantity;
			Obj['QuantityUOM']		=	Quantities[q].QuantityUOM;
			ReturnQuantityArray.push(Obj);
		}
	}
	else if(Quantities[0].URI.includes('urn:epc:idpat:cpi:'))
	{
		for(var q=0; q<Quantities.length; q++)
		{
			var CompanyPrefix		=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf(":")+1,Quantities[q].URI.indexOf('.'));
				CompanyPrefix		=	CompanyPrefix + Quantities[q].URI.slice(Quantities[q].URI.indexOf('.')+1,Quantities[q].URI.lastIndexOf('.'));
			var SerialNumber		=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf('.')+1,Quantities[q].URI.length-1);
			var FinalCPI			=	'https://id.gs1.org/cpid/' + CompanyPrefix + SerialNumber;
			
			var Obj					=	new Object();
			Obj['URI']				=	FinalCPI;
			Obj['QuantityType']		=	Quantities[q].QuantityType;
			Obj['Quantity']			=	Quantities[q].Quantity;
			Obj['QuantityUOM']		=	Quantities[q].QuantityUOM;
			ReturnQuantityArray.push(Obj);
		}
	}
	else if(Quantities[0].URI.includes('urn:epc:idpat:itip:'))
	{
		for(var q=0; q<Quantities.length; q++)
		{
			var CompanyPrefix		=	Quantities[q].URI.charAt(Quantities[q].URI.indexOf('.')+1) + Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf(":")+1,Quantities[q].URI.indexOf('.'));
				CompanyPrefix		=	CompanyPrefix + Quantities[q].URI.slice(Quantities[q].URI.indexOf('.')+2,Quantities[q].URI.lastIndexOf('.'));
				CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf('.')+1,Quantities[q].URI.length);
			var FinalITIP			=	'https://id.gs1.org/itip/' + CompanyPrefix + '/' + SerialNumber;
			
			var Obj					=	new Object();
			Obj['URI']				=	FinalITIP;
			Obj['QuantityType']		=	Quantities[q].QuantityType;
			Obj['Quantity']			=	Quantities[q].Quantity;
			Obj['QuantityUOM']		=	Quantities[q].QuantityUOM;
			ReturnQuantityArray.push(Obj);
		}
	}
	else if(Quantities[0].URI.includes('urn:epc:idpat:upui:'))
	{
		for(var q=0; q<Quantities.length; q++)
		{
			var CompanyPrefix		=	Quantities[q].URI.charAt(Quantities[q].URI.indexOf('.')+1) + Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf(":")+1,Quantities[q].URI.indexOf('.'));
				CompanyPrefix		=	CompanyPrefix + Quantities[q].URI.slice(Quantities[q].URI.indexOf('.')+2,Quantities[q].URI.lastIndexOf('.'));
				CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
			var SerialNumber		=	Quantities[q].URI.slice(Quantities[q].URI.lastIndexOf('.')+1,Quantities[q].URI.length);
			var FinalUPUI			=	'https://id.gs1.org/upui/' + CompanyPrefix + SerialNumber;
			
			var Obj					=	new Object();
			Obj['URI']				=	FinalUPUI;
			Obj['QuantityType']		=	Quantities[q].QuantityType;
			Obj['Quantity']			=	Quantities[q].Quantity;
			Obj['QuantityUOM']		=	Quantities[q].QuantityUOM;
			ReturnQuantityArray.push(Obj);
		}
	}
	else
	{
		for(var q=0; q<Quantities.length; q++)
		{
			var Obj					=	new Object();
			Obj['URI']				=	Quantities[q].URI;
			Obj['QuantityType']		=	Quantities[q].QuantityType;
			Obj['Quantity']			=	Quantities[q].Quantity;
			Obj['QuantityUOM']		=	Quantities[q].QuantityUOM;
			ReturnQuantityArray.push(Obj);
		}
	}
	callback(ReturnQuantityArray);
}

//Replace the Custom web URI with the GS1 default URI
exports.CustomWebURIParentIDFormatter	=	function(EPCs,callback)
{
	var GS1Domain			=	'https://id.gs1.org/';	
	var CustomEPC 			= 	EPCs.replace(/([^\/]*\/){3}/, '');
		CustomEPC			=	GS1Domain	+  CustomEPC;
	callback(CustomEPC)
}

//Format Parent ID
exports.URNtoURIParentiDformatter	=	function(EPCs,callback)
{
	var FinalParentID		=	"";
	
	//Check if the EPCs belong to SGTIN
	if(EPCs.includes('urn:epc:id:sgtin:'))
	{
		var lastIndex		=	EPCs.lastIndexOf(":");
		var CompanyPrefix	=	EPCs.charAt(EPCs.indexOf('.')+1) + EPCs.slice(lastIndex+1,EPCs.indexOf('.'));
		var RemainingString	=	EPCs.substring(EPCs.indexOf('.')+2,EPCs.length);
			CompanyPrefix	=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'))
			CompanyPrefix	=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
		var SerialNumber	=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.lenth)
			FinalParentID	=	'https://id.gs1.org/01/' + CompanyPrefix + '/21/' + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:sscc:'))
	{
		var CompanyPrefix	=	EPCs.charAt(EPCs.indexOf('.')+1) + EPCs.substring(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
			FinalParentID	=	'https://id.gs1.org/00/' + CompanyPrefix + EPCs.substring(EPCs.indexOf('.')+1,EPCs.length);
	
	}
	else if(EPCs.includes('urn:epc:id:sgln:'))
	{
		
		var CompanyPrefix		=	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
		
		if(EPCs.charAt(EPCs.indexOf('.')+1) != '.')
		{
			CompanyPrefix		=	CompanyPrefix + EPCs.charAt(EPCs.indexOf('.')+1);
			var RemainingString	=	EPCs.substring(EPCs.indexOf('.')+2,EPCs.length);
			CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'))
		}
		else
		{
			var RemainingString	=	EPCs.substring(EPCs.indexOf('.')+2,EPCs.length);
		}			
		
		CompanyPrefix			=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
		var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.lenth);
			FinalParentID		=	'https://id.gs1.org/414/' + CompanyPrefix + '/254/' + SerialNumber;		
	}
	else if(EPCs.includes('urn:epc:id:grai:'))
	{
		
		var CompanyPrefix		=	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
		var RemainingString		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
			CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'))
			CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
		var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			FinalParentID		=	'https://id.gs1.org/8003/' + CompanyPrefix  + SerialNumber;		
	}
	else if(EPCs.includes('urn:epc:id:giai:'))
	{
		
		var CompanyPrefix		=	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
		var SerialNumber		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
			FinalParentID		=	'https://id.gs1.org/8004/' + CompanyPrefix  + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:gsrn:'))
	{
		
		var CompanyPrefix		=	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
			CompanyPrefix		=	CompanyPrefix	+ gs1.checkdigit(CompanyPrefix);
		var SerialNumber		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
			FinalParentID		=	'https://id.gs1.org/8018/' + CompanyPrefix  + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:gsrnp:'))
	{
		
		var CompanyPrefix		=	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
			CompanyPrefix		=	CompanyPrefix	+ gs1.checkdigit(CompanyPrefix);
		var SerialNumber		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
			FinalParentID		=	'https://id.gs1.org/8017/' + CompanyPrefix  + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:gdti:'))
	{	
		var CompanyPrefix		=	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
		var RemainingString		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
			CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'));
			CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
		var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			FinalParentID		=	'https://id.gs1.org/253/' + CompanyPrefix + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:sgcn:'))
	{
		
		var CompanyPrefix		=	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
		var RemainingString		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
			CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'));
			CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix);
		var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			FinalParentID		=	'https://id.gs1.org/255/' + CompanyPrefix + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:cpi:'))
	{
		
		var CompanyPrefix		=	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
		var RemainingString		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
			CompanyPrefix		=	CompanyPrefix + RemainingString.slice(0,RemainingString.indexOf('.'));
		var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			FinalParentID		=	'https://id.gs1.org/8010/' + CompanyPrefix + '/8011/' + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:ginc:'))
	{
		
		var CompanyPrefix		=	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
		var SerialNumber		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
			FinalParentID		=	'https://id.gs1.org/401/' + CompanyPrefix + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:gsin:'))
	{
		
		var CompanyPrefix		=	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
		var SerialNumber		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
			FinalParentID		=	'https://id.gs1.org/402/' + CompanyPrefix + '0' + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:itip:'))
	{
		
		var CompanyPrefix		=	EPCs.charAt(EPCs.indexOf('.')+1) + 	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
		var RemainingString		=	EPCs.slice(EPCs.indexOf('.')+2,EPCs.length);
			CompanyPrefix		=	CompanyPrefix + RemainingString.substring(0,RemainingString.indexOf('.'));
			CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix)
		var RemainingString2	=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			CompanyPrefix		=	CompanyPrefix + RemainingString2.substring(0,RemainingString2.indexOf('.'));
		var RemainingString3	=	RemainingString2.slice(RemainingString2.indexOf('.')+1,RemainingString2.length);
			CompanyPrefix		=	CompanyPrefix + RemainingString3.substring(0,RemainingString3.indexOf('.'));
		var SerialNumber		=	RemainingString3.slice(RemainingString3.indexOf('.')+1,RemainingString3.length);
			FinalParentID		=	'https://id.gs1.org/8006/' + CompanyPrefix + '/21/' + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:upui:'))
	{
		
		var CompanyPrefix		=	EPCs.charAt(EPCs.indexOf('.')+1) + 	EPCs.slice(EPCs.lastIndexOf(":")+1,EPCs.indexOf('.'));
		var RemainingString		=	EPCs.slice(EPCs.indexOf('.')+2,EPCs.length);
			CompanyPrefix		=	CompanyPrefix + RemainingString.substring(0,RemainingString.indexOf('.'));
			CompanyPrefix		=	CompanyPrefix + gs1.checkdigit(CompanyPrefix)
		var SerialNumber		=	RemainingString.slice(RemainingString.indexOf('.')+1,RemainingString.length);
			FinalParentID		=	'https://id.gs1.org/01/' + CompanyPrefix + '/235/' + SerialNumber;
	}
	else if(EPCs.includes('urn:epc:id:gid:'))
	{
	
		var Manager		=	EPCs.slice(EPCs.lastIndexOf(':')+1,EPCs.indexOf('.'));
		var Class		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.lastIndexOf('.'))
		var Serial		=	EPCs.slice(EPCs.lastIndexOf('.')+1,EPCs.length)
		FinalParentID	=	'https://id.gs1.org/gid/' + Manager + Class + Serial;
	}
	else if(EPCs.includes('urn:epc:id:usdod:'))
	{
		
		var Cage		=	EPCs.slice(EPCs.lastIndexOf(':')+1,EPCs.indexOf('.'));
		var Serial		=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
		FinalParentID	=	'https://id.gs1.org/usdod/' + Cage + Serial;
	}
	else if(EPCs.includes('urn:epc:id:adi:'))
	{
		
		var Cage		=	EPCs.slice(EPCs.lastIndexOf(':')+1,EPCs.indexOf('.'));
		var Remaining	=	EPCs.slice(EPCs.indexOf('.')+1,EPCs.length);
		var PNO			=	Remaining.slice(0,Remaining.indexOf('.'));
		var Serial		=	EPCs.slice(EPCs.lastIndexOf('.')+1,EPCs.length);
		FinalParentID	=	'https://id.gs1.org/usdod/' + Cage + PNO + Serial;
	}
	else
	{
		FinalParentID	=	EPCs.URI;
	}
	
	callback(FinalParentID);
}











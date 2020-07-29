var moment 				= 	require('moment-timezone');
var moment 				= 	require('moment');
var randomArray 		= 	[];
var RecordTimeArray		=	[];
var EventTimeArray		=	[];

//Format the readpoint
exports.ReadPointFormatter	=	function(input,File,callback){
	var ReadPointCompany	=	input.readpointsgln1;
	var ReadPointObject		=	input.readpointsgln2;
	var ReadPrefixPoint		=	input.ReadPointCompanyPrefix;
	
	var CompanyPrefix 		=	companyPrefixNormal(ReadPointCompany, ReadPrefixPoint);
	var ReadpointFinal 		=	CompanyPrefix+'.'+ReadPointObject;

	callback(ReadpointFinal);
}

//Format the Business Point
exports.BusinessLocationFormatter	=	function(input,File,callback){
	var BusinessPointCompany	=	input.businesspointsgln1;
	var BusinessPointObject		=	input.businesspointsgln2;
	var BusinessPrefixPoint		=	input.BusinessLocationPrefix;
	
	var CompanyPrefix 			=	companyPrefixNormal(BusinessPointCompany, BusinessPrefixPoint);
	var BusinesspointFinal 		=	CompanyPrefix+'.'+BusinessPointObject;
	callback(BusinesspointFinal);
}

//Source or Destination Fromatter
exports.SourceDestinationFormatter	=	function(GLN, companyPrefix,callback){
	var CompanyPrefix 			=	companyPrefixNormal(GLN, companyPrefix);
	callback(CompanyPrefix)
}


//Company Prefix append without switch of first character
function companyPrefixNormal(companyPrefixInput, companyPrefixPoint)
{
	for(var x=6; x<=12;x++)	
	{	
		if(x == companyPrefixPoint)
		{	
			companyPrefixInput = [companyPrefixInput.slice(0, x), ".", companyPrefixInput.slice(x,companyPrefixInput.length-1)].join('');
			break;
		}
	}
	return companyPrefixInput;
}

//Randome EVENT TIME Generator Based on the From and To date time
exports.RandomEventTimeGenerator	=	function(DateFrom,DateTo,Count,File,callback){
	var DateFrom			= 	new Date(DateFrom);
	var DateTo				= 	new Date(DateTo);
	
	if(File == 'XML')
	{
		EventTimeArray		=	[];
		
		for(var r=0; r<Count; r++)
		{
			var RandomEventTime		=	new Date(DateFrom.getTime() + Math.random() * (DateTo.getTime() - DateFrom.getTime()));
			RandomEventTime			= 	moment(RandomEventTime).format();	
			EventTimeArray.push(RandomEventTime)
		}
		callback(EventTimeArray);	
	}
	else if(File == 'JSON')
	{
		callback(EventTimeArray);
	}	
	
}

//Randome RECORD TIME Generator Based on the From and To date time
exports.RandomRecordTimeGenerator	=	function(DateFrom,DateTo,Count,File,callback){
	var DateFrom			= 	new Date(DateFrom);
	var DateTo				= 	new Date(DateTo);
	
	if(File == 'XML')
	{
		RecordTimeArray		=	[];
		
		for(var r=0; r<Count; r++)
		{
			var RandomRecordTime	=	new Date(DateFrom.getTime() + Math.random() * (DateTo.getTime() - DateFrom.getTime()));
			RandomRecordTime		= 	moment(RandomRecordTime).format();		
			RecordTimeArray.push(RandomRecordTime)
		}
		callback(RecordTimeArray);	
	}
	else if(File == 'JSON')
	{
		callback(RecordTimeArray);
	}	
}
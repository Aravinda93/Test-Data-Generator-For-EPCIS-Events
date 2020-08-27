const fs 		= 	require('fs');
const path 		= 	require('path');
const reqPath 	= 	path.join(__dirname, '../');

exports.exportfile		=	function(req,res,callback)
{	
	var ContentData		=	req.body.XMLContent;
	var DatasetName		=	req.body.DatasetName;
	var Type			=	req.body.type.toString();
	var FileName		=	"";
	
	if(DatasetName == '' || DatasetName == undefined || DatasetName == null)
	{
		FileName	=	"EPCIS_Events.xml";
	}
	else
	{
		FileName	=	DatasetName+".xml";
	}
	
	fs.appendFile(FileName, ContentData, function (err)
	{
	  if (err)
	  {
		console.log("Error During File Download");
		console.log(err);
	  }
	  else
	  {		
		const FilePath = reqPath+FileName;
		callback(FilePath);
	  }
	})
}
const 	express 		= 	require('express');
const   bodyParser 		= 	require('body-parser');
const 	path 			= 	require('path');
const 	fs				=	require('fs');
const	multer  		= 	require('multer');

//To get the HTML page
const	port			= 	3000;
const 	reqPath 		= 	__dirname;
const 	app 			= 	express();
var 	upload 			= 	multer({ dest: 'uploads/' });

const 	populateFields				=	require("./controller/populateFields");
const 	QuantitiesURI				=	require("./controller/QuantitiesURI");
const 	CreateAggregationEventURI	=	require("./controller/CreateAggregationEventURI");
const 	ReadExcelFile				=	require("./controller/ReadExcelFile");

const 	createXML					=	require("./controller/createXML");
const 	createJSON					=	require("./controller/createJSON");
const 	CreateConfiguredXML			=	require("./controller/CreateConfiguredXML");
const 	DataExporter				=	require("./controller/DataExporter");

//Create an XML and JSON document based on the user inputs


app.set('views', reqPath + "\\public\\views");
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(path.join(reqPath, '/public/views')));
//app.use(bodyParser.json()); 
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//Display the Index page when user hits the URL in browser
app.get('/', function(req,res){
	res.render('index.html');
});

//call function to popultae the fields
app.get('/populateFields', function(req,res){
	populateFields.BusinessStep(function(data){
		res.send(data);
	});
});

//Call the function for Object Event Qunatities
app.post('/CreateObjectEventQuantities', function(req,res){
	QuantitiesURI.QuantitiesURI(req.body,function(data){
		res.send(data);
	})
});

//call the function to create URI and display for Object Event
app.post('/CreateAggregationEventURI', function(req,res){
	CreateAggregationEventURI.CreateAggregationEventURI(req.body,function(data){
		res.send(data);
	});
});

//call functions to create XML and JSON
app.post('/createEvents', function(req,res){
	var data = [];
	createXML.createXMLData(req.body,'dummy',function(XMLdata){
		var xml = {'XML':XMLdata};
		data.push(xml);
		createJSON.createJSONData(req.body,'dummy',function(JSONdata){
			var json = {'JSON':JSONdata}
			data.push(json);
			res.send(data);
		});
	});
});

//Read the Excel File Data
app.post('/UploadFIle',function(req,res){
	ReadExcelFile.ReadExcelFileContent(function(data){
		
	});
});

//Read the Excel File Data
app.get('/UploadFIle',function(req,res){
	var data = [];
	ReadExcelFile.ReadExcelFileContent(function(XMLdata){
		var xml = {'XML':XMLdata};
		data.push(xml);
		res.send(data);
	});
});

app.post('/DrawFieldsData',function(req,res){
	var data = [];
	ReadExcelFile.DrawDataXML(req.body,function(XMLdata){
		var xml = {'XML':XMLdata};
		data.push(xml);
		res.send(data);
	});
});

//Create XML data for the drag and drop field
app.post('/CreateConfiguredXML',function(req,res){
	CreateConfiguredXML.createXML(req.body,function(data){
		res.send(data);
	});
});

//Export the Data into the Text file
app.post('/ExportData',function(req,res){
	DataExporter.exportfile(req,res,function(data){
		res.send(data);
	});
})

//Make NodeJS to Listen to a particular Port in Localhost
app.listen(port,'0.0.0.0', function(){
	console.log(`Test Data Generator Project running at : ${port}!`)
});
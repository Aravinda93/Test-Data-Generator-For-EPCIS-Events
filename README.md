# Test Data Generator for EPCIS Events

### Introduction
EPCIS (Electronic Product Code Information Services) is an ISO/IEC/GS1standard that helps to generate and exchange the visibility data within an organisation or across multiple organisations based on the business context. EPCIS standard has been adopted by various industry sectors such as automotive, food, healthcare, retail, and many more. Different suppliers and organisations currently face the problem of producing bulk test data which can be used for testing purposes (load tests, populating test databases, etc.). Hence, to tackle this issue, some companies have developed purpose-built solutions such as excel macros, use case-specific scripts and other proprietary software. However, they are neither publically available, nor do they provide an adequate level of flexibility for other EPCIS community members.

This open-source web application is capable of generating a significant number of EPCIS events efficiently and effectively. It provides a single solution for creating test events irrespective of the industry, use case or supply chain system. The generated EPCIS events conform to the current version of the EPCIS, i.e. EPCIS 2.0. Besides, using the tool events can be generated in both XML and JSON/JSON-LD format. 

### Set-up and Usage
This project has been developed using the mainly HTML, AngularJS and Node.js. Node.js creates the server and provides the local environment for running the web application. Hence, it needs to be installed for running this application locally. Node.js software can be downloaded and installed from the official website: https://nodejs.org/en/. The web application can be accessed using the three statements from the command line utility:
* Install all the necessary dependency which are required for the web application to run:
```sh
npm install
```
* To start the local server:
```sh
node index.js
```
* The web application can be accessed using the URL:
```sh
localhost:3000
```

### Project workflow
The web application consists of two different views. In the first view, the user can provide the required data and create the bulk EPCIS events directly. This view is beneficial for users when there are no specific requirements based on their organisation-specific supply chain. The following figure 1 provides the filled information in the view-1 of the application for the rail sector. It has been designed for the arriving events of the trains at a particular station. The generated events contain the unique GIAI and Event Time, indicating the different trains arrived at a station. However, other information such as Read Point, Business Location, Business Step, Disposition, etc. remain identical as they are captured at the same station and using the same device.

![Figure 1: View-1 of the application with information for the rail sector.](relative/images/Fig5.png?raw=true "Figure 1: View-1 of the application with information for the rail sector.")

After providing all the required details for the bulk test events when the user submits the information, then the test events are generated in both XML and JSON/JSON-LD format.

### Licence

![MIT Licence](relative/images/Fig5.png?raw=true "MIT Licence")
 
Copyright 2020 | Aravinda Baliga B aravindabaligab@gmail.com. 
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, and to permit persons to whom the software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.
THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
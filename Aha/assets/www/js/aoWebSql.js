 //-------------------------------------------Trackdetails Database Process----------------------------//
    //-------------------------------------------Start Process----------------------------//
//var db = openDatabase("AssetOperatorDB", "1.0", "Asset OperatorDB", 200000);  // Open SQLite Database 
var createStatement = "CREATE TABLE IF NOT EXISTS TRACKDETAILS (ID INTEGER PRIMARY KEY AUTOINCREMENT, ROUTE TEXT, VEHICLE TEXT,  LATITUDE TEXT, LONGITUDE TEXT, DAT TEXT, TIME TEXT, REMARKS TEXT, FLAG TEXT)"; 
var selectAllStatement = "SELECT * FROM TRACKDETAILS";	 
var insertStatement = "INSERT INTO TRACKDETAILS (ROUTE, VEHICLE, LATITUDE, LONGITUDE, DAT, TIME, REMARKS, FLAG) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";	 
var updateStatement = "UPDATE TRACKDETAILS SET ROUTE = ?, VEHICLE = ?, LATITUDE = ?, LONGITUDE = ?, DAT = ?, TIME = ?, REMARKS =?, FLAG = ? WHERE id=?";
var deleteStatement = "DELETE FROM TRACKDETAILS";
//--------------------------------------------Trackmaster database Process---------------------------------------//
var dropMasterStatement = "DROP TABLE TRACKMASTER";	
var createMasterStatement = "CREATE TABLE IF NOT EXISTS TRACKMASTER(ID INTEGER PRIMARY KEY AUTOINCREMENT, STARTDATE TEXT, STOPDATE TEXT)"; 
var selectAllMasterStatement = "SELECT * FROM TRACKMASTER"; 
var insertMasterStatement = "INSERT INTO TRACKMASTER (STARTDATE, STOPDATE) VALUES (?, ?)";
var updateMasterStatement = "UPDATE TRACKMASTER SET STARTDATE = ? WHERE id=?";
var selectAllLog = "SELECT * FROM LOGINDETAILS";	
//--------------------------------------------DropDownList database Process---------------------------------------//
var createDropdownlistSatement = "CREATE TABLE IF NOT EXISTS DROPDOWN(ID INTEGER PRIMARY KEY AUTOINCREMENT, ASSIGN TEXT, RESOUCE TEXT)"; 
var selectDropdownlistAllStatement = "SELECT * FROM DROPDOWN"; 
var insertDropdownlistAllStatement = "INSERT INTO DROPDOWN (ASSIGN, RESOUCE) VALUES (?, ?)";	 
var dataset;
var Flags;
var activeId;
var orgId;
var latitude;
var longitude;
var formatted_address
var Lat;
var Lon;
var assign;
var resouce;
var date;
var times;
var address;
var startDateTime;
var stopDateTime;
var process;
var status ;
	//--------------------------------End Process----------------------------//

	
	
	function createTable()  // Function for Create Table in SQLite.
	{
		assetLogDB.transaction(function (tx) { tx.executeSql(createStatement, []); });
	}
	function createTableDropdown()  // Function for Create Table in SQLite.
	{
		assetLogDB.transaction(function (tx) { tx.executeSql(createDropdownlistSatement, []); });
	}
	function createMasterDetails()  // Function for Create Table in SQLite.
	{
		assetLogDB.transaction(function (tx) { tx.executeSql(createMasterStatement, []); });
	}
	 function getAddressDetails(latitude, longitude) {
		 console.log("hit getAddressDetails function");
        var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+Latitude+","+Longitude+"&sensor=false";
        $.getJSON(url, function(data) {
            formatted_address = data['results'][0]['formatted_address'];
           
        });
    }
       
    function  insertlocDb()
	{
		console.log("step2: hit insertlocDb function");
		var d = new Date();
		var yy = d.getFullYear();
		var mm = d.getMonth() + 1;
		var dd = d.getDate();
		var hr = d.getHours();
		var mi = d.getMinutes();
		var se = d.getSeconds();
		  
		var tDate = yy+'-'+mm+'-'+dd; // Date 
		var tTime = hr+':'+mi+':'+se; // Time 
		
		var route = document.getElementById('selRouteId').value;  
    	var vehicle = document.getElementById('selVehicleId').value;
    //	var remarks = document.getElementById('txtRemarksId').value;    	
    	//alert(route +'\n'+ vehicle +'\n'+ tDate +'\n'+ tTime );
    	var latitude = Latitude;
		var longitude = Longitude;
		var remarks = formatted_address;
    	//alert(latitude +'\n'+ longitude +'\n'+ remarks);
    	console.log("step3: before insertStatement");
    	assetLogDB.transaction(function (tx) { tx.executeSql(insertStatement, [route, vehicle, latitude, longitude, tDate ,tTime, remarks,'I']);  });		
		console.log("step4: after insertStatement");		
		startUpload();		
	}
    function startUpload() //Function for uploading ...
	{   
		//Toast.longshow("hit startUpload function");
		 var networkState = navigator.connection.type;

	        var states = {};
	        states[Connection.NONE] = 'No network connection';

	        if (states[networkState] == 'No network connection') {
	            alert('Connection type: ' + states[networkState]);
	            Toast.longshow("No network connection");
	            //Toast.longshow('Connection type: ' + states[networkState]);		
	        }
	        else{
	        	
	        	assetLogDB.transaction(function (tx) 
						{   
						   
							tx.executeSql(selectAllLog, [], function (tx, result)
							{
								datasets = result.rows;
							
								for (var i = 0, item = null; i < datasets.length; i++) 
								{
					             		
									item = datasets.item(i);						   
									activeId = item['ACTIVE_ID'];
									orgId = item['USER_ORG_CODE'];
								}
					 
							});
					 
						});
	        	startDateTime=localStorage.getItem("startdate");
	        	//alert(startDateTime);
	        	assetLogDB.transaction(function (tx) 
				{   
	        		console.log("startUpload step1: hit selectAllStatement function");
					tx.executeSql(selectAllStatement, [], function (tx, result)
					{
						dataset = result.rows;
						console.log("startUpload step2: berfore for loop");
						for (var i = 0, item = null; i < dataset.length; i++) 
						{
			                console.log("startUpload step3: hit for loop");
			               // alert("step8: hit for loop");					
							item = dataset.item(i);
						   
							console.log("startUpload step4: after if statement");					    
							 assign = item['ROUTE'];
							 resouce = item['VEHICLE'];
							 latitude = item['LATITUDE'];
							 longitude = item['LONGITUDE'];
							 date = item['DAT'];
							 times = item['TIME'];
							 address = item['REMARKS'];
							 datetime = date+' '+times;
							 stopDateTime = "1";
							 status = "1";
							 process = "2";
							//alert(date+'-'+time+'-'+Latitude+'-'+Longitude+'-'+Route+'-'+vehicle);
							var setURl ="http://gaddieltech.fatcow.com/Aha/insertMasterDetails.php";
							console.log("startUpload step5: before post process");
							//alert("step10: before post process");
							$.ajax(
							{
								type: "POST",
								url: setURl,//you can get this values from php using $_POST['n1'], $_POST['n2'] and $_POST['add']
								data: {ActiveId:activeId,OrgId:orgId,Assign:assign,Resouce:resouce,StartDateTime:startDateTime,StopDateTime:stopDateTime,Status:status,Times:times,Latitude:latitude,Longitude:longitude,Address:address,Process:process}, 
								success: function(data)
								{
									
									console.log("startUpload step6: successfully process complete");								
								   if(data=="1"){
									   DeleteRow();
								   }
									
								}
							});                      
							
						}
			 
					});
			 
				});
	        }		   
	}
    function insertSDTSDT(){
    	var d = new Date();
		var yy = d.getFullYear();
		var mm = d.getMonth() + 1;
		var dd = d.getDate();
		var hr = d.getHours();
		var mi = d.getMinutes();
		var se = d.getSeconds();
		  
		var tDate = yy+'-'+mm+'-'+dd; // Date 
		var tTime = hr+':'+mi; // Time 	
		 var startdate= tDate+''+tTime;
		
		
		localStorage.setItem("startdate", startdate);
		
    	
    }

	function activateTrackStart() //Function for when press the start button...
	{   
		//Toast.longshow(" hit activateTrackStart function");
		 var networkState = navigator.connection.type;

	        var states = {};
	        states[Connection.NONE] = 'No network connection';

	        if (states[networkState] == 'No network connection') {
	            alert('Connection type: ' + states[networkState]);
	            Toast.longshow("No network connection");
	            //Toast.longshow('Connection type: ' + states[networkState]);		
	        }
	        else{
	        	
	        	assetLogDB.transaction(function (tx) 
						{   
						   
							tx.executeSql(selectAllLog, [], function (tx, result)
							{
								datasets = result.rows;
							
								for (var i = 0, item = null; i < datasets.length; i++) 
								{
					             		
									item = datasets.item(i);						   
									activeId = item['ACTIVE_ID'];
									orgId = item['USER_ORG_CODE'];
								}
					 
							});
					 
						});
	        	startDateTime=localStorage.getItem("startdate");
	        	
	        	assetLogDB.transaction(function (tx) 
				{   
	        		console.log("activateTrackStart step1: hit selectAllStatement function");
					tx.executeSql(selectAllStatement, [], function (tx, result)
					{
						//alert(result.rows.length);
						if(result.rows.length == 0)
						{
							 assign = document.getElementById('selRouteId').value;  
							 resouce = document.getElementById('selVehicleId').value;
							
					    	 latitude = 00;
							 longitude = 00;
							 remarks = formatted_address;
								var d = new Date();
								var yy = d.getFullYear();
								var mm = d.getMonth() + 1;
								var dd = d.getDate();
								var hr = d.getHours();
								var mi = d.getMinutes();
								var se = d.getSeconds();
								  
							
								times = hr+':'+mi+':'+se; // Time 
							 stopDateTime = "0";
							 status = "1";
							 process = "1";
							var setURl ="http://gaddieltech.fatcow.com/Aha/insertMasterDetails.php";							
							//alert("step10: before post process");
							$.ajax(
							{
								type: "POST",
								url: setURl,//you can get this values from php using $_POST['n1'], $_POST['n2'] and $_POST['add']
								data: {ActiveId:activeId,OrgId:orgId,Assign:assign,Resouce:resouce,StartDateTime:startDateTime,StopDateTime:stopDateTime,Status:status,Times:times,Latitude:latitude,Longitude:longitude,Address:address,Process:process}, 
								success: function(data)
								{
									//alert(data);								
								
								}
							});  
						}
						else
						{
							//Toast.longshow("hit else condition for  db");
							dataset = result.rows;
							console.log("activateTrackStart step2: berfore for loop");
							for (var i = 0, item = null; i < dataset.length; i++) 
							{
				                console.log("activateTrackStart step3: hit for loop");
				               // alert("step8: hit for loop");					
								item = dataset.item(i);
							   
								console.log("activateTrackStart step4: after if statement");					    
								var assign = item['ROUTE'];
								var resouce = item['VEHICLE'];
								var latitude = item['LATITUDE'];
								var longitude = item['LONGITUDE'];
								var date = item['DAT'];
								var times = item['TIME'];
								var address = item['REMARKS'];
								var datetime = date+''+times;
								var stopDateTime = "0";
								var status = "1";
								 process = "1";
								//alert(date+'-'+time+'-'+Latitude+'-'+Longitude+'-'+Route+'-'+vehicle);
								var setURl ="http://gaddieltech.fatcow.com/Aha/insertMasterDetails.php";
								console.log("activateTrackStart step5: before post process");
								//alert("step10: before post process");
								$.ajax(
								{
									type: "POST",
									url: setURl,//you can get this values from php using $_POST['n1'], $_POST['n2'] and $_POST['add']
									data: {ActiveId:activeId,OrgId:orgId,Assign:assign,Resouce:resouce,StartDateTime:startDateTime,StopDateTime:stopDateTime,Status:status,Times:times,Latitude:latitude,Longitude:longitude,Address:address,Process:process}, 
									success: function(data)
									{
										//alert(data);
										console.log("activateTrackStart step6: successfully process complete");								
									   if(data=="1"){
										   
										 DeleteRow();
									   }
										
									}
								});                      
								
							}
						}
					});
			 
				});
	        }		   
	}
	function savedropDownval()
	{
		
		var assign = document.getElementById('selRouteId').value;  
    	var resouce = document.getElementById('selVehicleId').value;
    	assetLogDB.transaction(function (tx) 
				{   
				  tx.executeSql(selectDropdownlistAllStatement, [], function (tx, result)
					{				
						if(result.rows.length == 0)
						 {
							
					    	assetLogDB.transaction(function (tx) { tx.executeSql(insertDropdownlistAllStatement, [assign, resouce]);  });		
						 }

					});
					 
				});
	}
	function activateTrackStop() //Function for when press the stop button...
	{   
		//Toast.longshow("hit activateTrackStop function");
		 var networkState = navigator.connection.type;

	        var states = {};
	        states[Connection.NONE] = 'No network connection';

	        if (states[networkState] == 'No network connection') {
	           // alert('Connection type: ' + states[networkState]);
	            Toast.longshow("No network connection");
	            //Toast.longshow('Connection type: ' + states[networkState]);		
	        }
	        else{
	        	
	        	assetLogDB.transaction(function (tx) 
						{   
						   
							tx.executeSql(selectAllLog, [], function (tx, result)
							{
								datasets = result.rows;
								for (var i = 0, item = null; i < datasets.length; i++) 
								{	
									item = datasets.item(i);						   
									activeId = item['ACTIVE_ID'];
									orgId = item['USER_ORG_CODE'];
								}
					 
							});
					 
						});
	        	startDateTime=localStorage.getItem("startdate");
	        	//alert("2"+startDateTime);
	        	assetLogDB.transaction(function (tx) 
				{   
	        		console.log("activateTrackStop step1: hit selectAllStatement function");
					tx.executeSql(selectAllStatement, [], function (tx, result)
					{
						dataset = result.rows;
						if(result.rows.length == 0)
						{
							//Toast.longshow("hit if condition for empty db");
							navigator.geolocation.getCurrentPosition(onSuccess, onError);
							 function onSuccess(position) {
								    Lat = position.coords.latitude;
								    Lon = position.coords.longitude;	   
								   
								 }
							var d = new Date();
							var yy = d.getFullYear();
							var mm = d.getMonth() + 1;
							var dd = d.getDate();
							var hr = d.getHours();
							var mi = d.getMinutes();
							var se = d.getSeconds();
							  
							var tDate = yy+'-'+mm+'-'+dd; // Date 
							var tTime = hr+':'+mi+':'+se; // Time 
							
							 assign = document.getElementById('selRouteId').value;  
							 resouce = document.getElementById('selVehicleId').value;					 
							 if(Lat=="" && Lon==""){
								 latitude = 00;
								 longitude = 00;
							 }else{
					    	 latitude = Lat;
							 longitude = Lon;
							 }
							 remarks = formatted_address;
							 var datetime = tDate+''+tTime;
							 status = "0";
							 process = "0";
							var setURl ="http://gaddieltech.fatcow.com/Aha/insertMasterDetails.php";							
							//alert("step10: before post process");
							$.ajax(
							{
								type: "POST",
								url: setURl,//you can get this values from php using $_POST['n1'], $_POST['n2'] and $_POST['add']
								data: {ActiveId:activeId,OrgId:orgId,Assign:assign,Resouce:resouce,StartDateTime:startDateTime,StopDateTime:datetime,Status:status,Times:tTime,Latitude:latitude,Longitude:longitude,Address:address,Process:process}, 
								success: function(data)
								{
									//alert(data);
									//alert("3"+data);
									console.log("activateTrackStop step6: successfully process complete");								
									 if(data=="1"){
										 DeleteRow();
										 DeleteMasterDetails();
									   }
								}
							});  
						}
						else
						{
							//Toast.longshow("hit else condition for db");
							
							console.log("activateTrackStop step2: berfore for loop");
							for (var i = 0, item = null; i < dataset.length; i++) 
							{
				                console.log("activateTrackStop step3: hit for loop");
				               // alert("step8: hit for loop");					
								item = dataset.item(i);
							   
								console.log("activateTrackStop step4: after if statement");					    
								 assign = item['ROUTE'];
								 resouce = item['VEHICLE'];
								 latitude = item['LATITUDE'];
								 longitude = item['LONGITUDE'];
								 date = item['DAT'];
								 times = item['TIME'];
								 address = item['REMARKS'];
								 datetime = date+''+times;						
								 status = "0";
								 process = "0";
								//alert(date+'-'+time+'-'+Latitude+'-'+Longitude+'-'+Route+'-'+vehicle);
								var setURl ="http://gaddieltech.fatcow.com/Aha/insertMasterDetails.php";
								console.log("activateTrackStop step5: before post process");
								//alert("step10: before post process");
								$.ajax(
								{
									type: "POST",
									url: setURl,//you can get this values from php using $_POST['n1'], $_POST['n2'] and $_POST['add']
									data: {ActiveId:activeId,OrgId:orgId,Assign:assign,Resouce:resouce,StartDateTime:startDateTime,StopDateTime:datetime,Status:status,Times:times,Latitude:latitude,Longitude:longitude,Address:address,Process:process}, 
									success: function(data)
									{
										//alert(data);
										console.log("activateTrackStop step6: successfully process complete");								
									   if(data=="1"){
										   DeleteRow();
										   DeleteMasterDetails();
									   }
										
									}
								});                      
								
							}
						}
					});
			 
				});
	        }
	      
	}
	function DeleteMasterDetails()
	{
		
		localStorage.removeItem("startdate");
		 Toast.longshow("Delete Successfully");
		
	}
	function DeleteRow()
	{
		
		assetLogDB.transaction(function (tx) { tx.executeSql(deleteStatement); 
		// Toast.longshow("Delete Successfully");
		});	
	}	
	function onError(tx, error) // Function for Handling Error...
	{   
	    console.log("step5: hit onError function");
		alert(error.message);
	}    
	
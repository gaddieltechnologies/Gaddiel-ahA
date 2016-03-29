var assetLogDB = openDatabase("AssetLogDB", "1.0", "Asset LogDB", 200000);  // Open SQLite Database 
var createLog = "CREATE TABLE IF NOT EXISTS LOGINDETAILS (ID INTEGER PRIMARY KEY AUTOINCREMENT, ACTIVE_ID TEXT, ACTIVATION_CODE TEXT, USER_ORG_CODE TEXT)"; 
var selectAllLog = "SELECT * FROM LOGINDETAILS";	 
var insertLog = "INSERT INTO LOGINDETAILS (ACTIVE_ID ,ACTIVATION_CODE ,USER_ORG_CODE) VALUES (?, ?, ?)";	 
var deleteLog = "DELETE FROM LOGINDETAILS";	 
var dropLog = "DROP TABLE LOGINDETAILS";	 
var datasets;
//var activeCode;
//var orgcode;
//var activeId;
function initDatabase()  // Function Call When Page is ready.
	{ 
		try 
		{	 
			if (!window.openDatabase)  // Check browser is supported SQLite or not.	 
			{	 
				alert("Databases are not supported in this browser.");
			}	 
			else {	 
				
				createTable();  // If supported then call Function for create table in SQLite	 
			} 
		} 
		catch (e)
		{
			if (e == 2) {	 
				// Version number mismatch. 	 
				//console.log("Invalid database version.");
				alert("Invalid database version.");	 
			} else {
			
				console.log("Unknown error " + e + ".");
				alert("Unknown error " + e + ".");	 
			}
			return;
		}
	}
	function dropTable() // Function Call when Drop Button Click.. Talbe will be dropped from database.
	
	{
	 
		assetLogDB.transaction(function (tx) { tx.executeSql(dropLog, []); }); 
	} 
	function createTable()  // Function for Create Table in SQLite.
	{
		assetLogDB.transaction(function (tx) { tx.executeSql(createLog, []); });
	}
	
	function insertlocDb(activeCode, orgcode, activeId){		
		assetLogDB.transaction(function (tx) { tx.executeSql(insertLog, [activeId, activeCode, orgcode]);  });
		window.location = "home.html";
	}
	
	function getActiveData(){
		
    	assetLogDB.transaction(function (tx) 
				{   
				   
					tx.executeSql(selectAllLog, [], function (tx, result)
					{
						//datasets = result.rows;
						//result.rows.length = "1";					
						 if(result.rows.length == 0){
							 window.location = "login.html";
							
		                  } else {		                	 
		                	  window.location = "home.html";
		                }                  
							
						
			 
					});
			 
				});
   
	}
	
	function checkActivateCode(){
		
		assetLogDB.transaction(function (tx) 
					{   
					   
						tx.executeSql(selectAllLog, [], function (tx, result)
						{
							datasets = result.rows;
						
							for (var i = 0, item = null; i < datasets.length; i++) 
							{
				             		
								item = datasets.item(i);						   
								
								var activeCode = item['ACTIVATION_CODE'];
								var setURl ="http://gaddieltech.fatcow.com/Aha2/get_activateCode_App2.php";
							
								$.ajax(
								{
									type: "POST",
									url: setURl,//you can get this values from php using $_POST['n1'], $_POST['n2'] and $_POST['add']
									data: {activation_Code:activeCode}, 
									success: function(data)
									{					
										if(data=="")
										{
											
											Toast.longshow("Please contact System Administrator.");	
											deleteRow();
										}else
										{
											fetchMasterData();
											fetchOrgAddress();
										}
										
									}
								});                      
								
							}
				 
						});
				 
					});
	}
	

	function deleteRow()
	{
		assetLogDB.transaction(function (tx) { tx.executeSql(deleteLog); 
		console.log("Delete Successfully");
		 window.location = "login.html";
		});	
	}
    function fetchMasterData(){
    	assetLogDB.transaction(function (tx) 
				{   
				   
					tx.executeSql(selectAllLog, [], function (tx, result)
					{
						datasets = result.rows;
					
						for (var i = 0, item = null; i < datasets.length; i++) 
						{
			             		
							item = datasets.item(i);						   
							var orgCode = item['USER_ORG_CODE'];
                          
							var setURl ="http://gaddieltech.fatcow.com/Aha2/get_masterData.php";
						
							$.ajax(
							{
								type: "POST",
								url: setURl,//you can get this values from php using $_POST['n1'], $_POST['n2'] and $_POST['add']
								data: {org_Code:orgCode},
								success: function(data)
								{					
									
									 var i=0;
									   for(i=0; i<data.length;i++){
										
										   //localStorage.setItem("address", data[i].org_address);
										   $('#showList').append('<li><a href="listView.html?id=' + data[i].master_id + '">' +'<p> Area='+ data[i].assign_desc + '</p><span>Vehicle  No=' + data[i].resource_ref + '</span>&nbsp;&nbsp;&nbsp;<span>StartDateTime=' + data[i].start_datetime+
											  '</span></li>');	
										}
								   }
	
							});                      
							
						}
			 
					});
			 
				});
    }
	
    function fetchOrgAddress(){
    	assetLogDB.transaction(function (tx) 
				{   
				   
					tx.executeSql(selectAllLog, [], function (tx, result)
					{
						datasets = result.rows;
					
						for (var i = 0, item = null; i < datasets.length; i++) 
						{
			             		
							item = datasets.item(i);						   
							var orgCode = item['USER_ORG_CODE'];
                           
							var setURl ="http://gaddieltech.fatcow.com/Aha2/get_orgAddress.php";
						
							$.ajax(
							{
								type: "POST",
								url: setURl,//you can get this values from php using $_POST['n1'], $_POST['n2'] and $_POST['add']
								data: {org_Code:orgCode},
								success: function(data)
								{					
									 var i=0;
									   for(i=0; i<data.length;i++){
										   localStorage.setItem("address", data[i].org_address);
										   
										}
								   }
	
							});                      
							
						}
			 
					});
			 
				});
    }
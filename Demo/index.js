const LJsDB = IntailizeJsDB();

LJsDB.CreateTable("CanditateDetails",["id","name","email","mobileNo","age","address"]);

function AddFormData(FormData){
	
	let LValues = [];
	let LFieldName = ["id","name","email","mobileNo","age","address"];
	LValues.push(FormData.id.value);
	LValues.push(FormData.name.value);
	LValues.push(FormData.email.value);
	LValues.push(FormData.mobileNo.value);
	LValues.push(FormData.age.value);
	LValues.push(FormData.address.value);
	
	LJsDB.Insert("CanditateDetails", LFieldName, LValues);
	updateDetailsTable();
	return false;
}
function updateDetailsTable(){
	
	let LFieldName = ["id","name","email","mobileNo","age","address"];
	let LFetchedValues = LJsDB.Select("CanditateDetails", LFieldName);
	let LTableBodyEle = document.getElementById("TableBody");
	LTableBodyEle.innerHTML = "";
	for(let DataObj of LFetchedValues)
	{
		let LRow = "<tr><td>" + DataObj.id +"</td><td>" + DataObj.name + "</td><td>" + DataObj.email + "</td><td>" + DataObj.mobileNo + "</td><td>" + DataObj.age + "</td><td>" + DataObj.address + "</td></tr>";
	    LTableBodyEle.innerHTML += LRow;
	}
}

function Update(FormData){
	
	let LValues = [];
	let LFieldName = ["name","email","mobileNo","age","address"];
	LValues.push(FormData.name.value);
	LValues.push(FormData.email.value);
	LValues.push(FormData.mobileNo.value);
	LValues.push(FormData.age.value);
	LValues.push(FormData.address.value);
	
	let LWhereCondition = "id=" + FormData.id.value;
    
	LJsDB.Update("CanditateDetails", LFieldName, LValues, LWhereCondition);
	updateDetailsTable();
	return false;
}

function DeleteRow(FormData){
	
	let LWhereCondition = "id=" + FormData.id.value;
    
	LJsDB.Delete("CanditateDetails",LWhereCondition);
	updateDetailsTable();
	return false;
}
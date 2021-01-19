/***
 * JsDB is simple javascript database.which allows to a user to create a client side database.
 
 * It a sql type database who follow javascript style. It saves data in tabular form which consist of fields.
 
 * Like sql user can create table, delete table, and insert, select, update, delete data in table.
 
 * It also allows user to perform selete, update, delete, operations based on condtions simply like sql.
 
 * User just need to call methods with all vaild parameters.
 
 * It Also has error handling system which perfectly checks all parameters passed to a particular method. 
 
 * Please check API documentation in README for better understanding
*/

class JsDB {
	
	constructor(){		
	    this.JsDB = {
			tablesMetaData : {},
			tableActualData : []
		};
		this.CurrentTableIndex = 0;
		this.ErrorHandlingCls = new ErrorHandling(this.JsDB);
	}

	CreateTable = (p_StrTableName, p_ArrTableFieldNames) =>{
		
		let LCheckQuery = this.ErrorHandlingCls.CheckQueryData("createTable", [p_StrTableName, p_ArrTableFieldNames]);
		
		if(LCheckQuery === false)
		{
			return false;
		}

		this.JsDB.tablesMetaData[p_StrTableName] = this.CurrentTableIndex;
	    this.CurrentTableIndex++;
		
		let LArrTableStruct = {
			fields : {},
			fieldValues : []
		};
		let LLoopCount = 0;
		for(let LFieldName of p_ArrTableFieldNames){			
			LArrTableStruct.fields[LFieldName] = LLoopCount;
            LLoopCount++;			
		}
		LArrTableStruct.fieldValues = [];
		
		this.JsDB.tableActualData.push(LArrTableStruct);
	}
	
	DeleteTable = (p_StrTableName) =>{
	 let LCheckQuery = this.ErrorHandlingCls.CheckQueryData("deleteTable", [p_StrTableName]);
		
	 if(LCheckQuery === false)
	 {
			return false;
	 }		
	 let LTableIndex = this.JsDB.tablesMetaData[p_StrTableName];
	 delete this.JsDB.tablesMetaData[p_StrTableName];
	 this.JsDB.tableActualData.splice(LTableIndex, 1);
     	 
	}
	Insert = (p_StrTableName, p_ArrTableFieldNames, p_ArrTableFieldValues) =>{
		
		let LCheckQuery = this.ErrorHandlingCls.CheckQueryData("insert", [p_StrTableName, p_ArrTableFieldNames, p_ArrTableFieldValues]);
		
		if(LCheckQuery === false)
		{
			return false;
		}
		
		let LTableIndex = this.JsDB.tablesMetaData[p_StrTableName];
		
		let LLoopCount = 0;
		let LFieldValuesCurrentIndex = this.JsDB.tableActualData[LTableIndex].fieldValues.length;
		this.JsDB.tableActualData[LTableIndex].fieldValues[LFieldValuesCurrentIndex] = [];
		
		for(let LFieldName of p_ArrTableFieldNames){
		 let LFieldIndex = this.JsDB.tableActualData[LTableIndex].fields[LFieldName]; 
		 this.JsDB.tableActualData[LTableIndex].fieldValues[LFieldValuesCurrentIndex][LFieldIndex]	= p_ArrTableFieldValues[LLoopCount];
		 LLoopCount++;
		}
	}
    
    Select = (p_StrTableName, p_ArrTableFieldNames, p_StrCondition) =>{
		
		let LCheckQuery = this.ErrorHandlingCls.CheckQueryData("select", [p_StrTableName, p_ArrTableFieldNames, p_StrCondition]);		
		if(LCheckQuery === false)
		{
			return false;
		}		
		let LTableIndex = this.JsDB.tablesMetaData[p_StrTableName];
		let LSeletedData = [];
	    
		let LLoopCounter = 0;
		for(let fieldValues of this.JsDB.tableActualData[LTableIndex].fieldValues)
		{
		 if(typeof(p_StrCondition) !== "undefined"){
         let LContionStatus = this.CheckConditions(fieldValues, LTableIndex, p_StrCondition);
		 
		 if(LContionStatus !== true)
		 {
			 continue;
		 }
		 }
	     LSeletedData[LLoopCounter] = {};
		 for(let LFieldName of p_ArrTableFieldNames) 
		 {
		  let LFieldIndex = this.JsDB.tableActualData[LTableIndex].fields[LFieldName];
		  LSeletedData[LLoopCounter][LFieldName] = fieldValues[LFieldIndex];	
		 }
		 LLoopCounter++;
		}
		return LSeletedData;		
	}
	
	Update = (p_StrTableName, p_ArrTableFieldNames, p_ArrTableFieldValues, p_StrCondition) =>{
		
		let LCheckQuery = this.ErrorHandlingCls.CheckQueryData("update", [p_StrTableName, p_ArrTableFieldNames, p_ArrTableFieldValues, p_StrCondition]);		
		if(LCheckQuery === false)
		{
			return false;
		}				
		let LTableIndex = this.JsDB.tablesMetaData[p_StrTableName];
		
		let LLoopCounter = 0;
		for(let fieldValues of this.JsDB.tableActualData[LTableIndex].fieldValues)
		{
		 if(typeof(p_StrCondition) !== "undefined"){
		 
          let LContionStatus = this.CheckConditions(fieldValues, LTableIndex, p_StrCondition);
		 
		  if(LContionStatus !== true)
		  {
			 LLoopCounter++;
			 continue;
		  }
		 }
	     let LInnerLoopCount = 0;
		 for(let LFieldName of p_ArrTableFieldNames) 
		 {
		  let LFieldIndex = this.JsDB.tableActualData[LTableIndex].fields[LFieldName];
		  this.JsDB.tableActualData[LTableIndex].fieldValues[LLoopCounter][LFieldIndex]	= p_ArrTableFieldValues[LInnerLoopCount];		 	
		  LInnerLoopCount++;
		 }
		 LLoopCounter++;
		}
	}
	
	Delete = (p_StrTableName, p_StrCondition) =>{
		
		let LCheckQuery = this.ErrorHandlingCls.CheckQueryData("delete", [p_StrTableName, p_StrCondition]);		
		if(LCheckQuery === false)
		{
			return false;
		}		
		let LTableIndex = this.JsDB.tablesMetaData[p_StrTableName];
		
        let LLengthofFieldValues = this.JsDB.tableActualData[LTableIndex].fieldValues.length;
		
		if(typeof(p_StrCondition) === "undefined"){		 
	       this.JsDB.tableActualData[LTableIndex].fieldValues.splice(0, LLengthofFieldValues);
		   return;
		}
		
		let LArrNewFieldValues = [];
        for(let LLoopCounter = 0; LLoopCounter < LLengthofFieldValues; LLoopCounter++){
			
	      let LfieldValues = this.JsDB.tableActualData[LTableIndex].fieldValues[LLoopCounter];
		  
          if(typeof(p_StrCondition) !== "undefined"){		 
		  let LContionStatus = this.CheckConditions(LfieldValues, LTableIndex, p_StrCondition);
		  
		  if(LContionStatus === false)
		  {
			 LArrNewFieldValues.push(LfieldValues);
		  }		  
		 }	 
		}
		
        this.JsDB.tableActualData[LTableIndex].fieldValues = [];
		if(LArrNewFieldValues.length > 0){
		  for(let LRow of LArrNewFieldValues){			
	   	   this.JsDB.tableActualData[LTableIndex].fieldValues.push(LRow);
		  }
		}	
	}
	
    CheckConditions = (p_ArrFieldValues, p_NumTableIndex, p_StrCondition) =>{
        p_StrCondition = p_StrCondition.trim();
		let LConditionStr = "";
		let LCondtionTokes = p_StrCondition.split(" ");
		for(let LTokens of LCondtionTokes)
        {
          if(LTokens === "AND" || LTokens === "OR"){
            if(LTokens === "AND")
	        {
	         LConditionStr += "&&";
	        }
	        else{
	        LConditionStr += "||";
	        }
         }
         else{
			 
             let LSubTokens = LTokens.split("=");

             let LFieldIndex = this.JsDB.tableActualData[p_NumTableIndex].fields[LSubTokens[0]];
			 let LFieldValue = p_ArrFieldValues[LFieldIndex];
			 
             if(LFieldValue == LSubTokens[1]){
	           LConditionStr += "true";		
	         }
	         else{
	           LConditionStr += "false";
	         }
          }
        }
		if(eval(LConditionStr)){
			return true;
		}
		else{
			return false;
		}		
	}	
}

class ErrorHandling{
	
	constructor(p_objJsDB){
		this.JsDBRefrence = p_objJsDB;
		this.Digits = "0123456789";
		this.AllowedChars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_";
		this.JsReversedKeywords = [
 "abstract",
 "arguments",
 "await",
 "boolean",
 "break",
 "byte",
 "case",
 "catch",
 "char",
 "class",
 "const",
 "continue",
 "debugger",
 "default",
 "delete",
 "do",
 "double",
 "else",
 "enum",
 "eval",
 "export",
 "extends",
 "false",
 "final",
 "finally",
 "float",
 "for",
 "function",
 "goto",
 "if",
 "implements",
 "import",
 "in",
 "instanceof",
 "int",
 "interface",
 "let",
 "long",
 "native",
 "new",
 "null",
 "package",
 "private",
 "protected",
 "public",
 "return",
 "short",
 "static",
 "super",
 "switch",
 "synchronized",
 "this",
 "throw",
 "throws",
 "transient",
 "true",
 "try",
 "typeof",
 "var",
 "void",
 "volatile",
 "while",
 "with",	
 "yield",
 "undefined" ];			 
	}
	CheckQueryData = (p_strQueryName, p_QueryData) =>{
		
		switch(p_strQueryName)
		{
			case "createTable" : 
			{
			let LTableName = p_QueryData[0],
			    LTableFieldNames = p_QueryData[1];
				try{
					if(typeof(LTableName) !== "string"){						
					throw "Error while createing table  : Table name should be specified and should be a string.";
					}
					if(LTableName.length === 0){						
					throw "Error while createing table  : Table name should not be blank.";
					}
                    if(Array.isArray(LTableFieldNames) === false){
					throw "Error while createing table  : Field names should be passed with a array.";	
					}
					let LNamingRulesFollowed = this.CheckForNamingRules(LTableName)
					if(LNamingRulesFollowed !== true)
					{
					 throw	"Error while createing table '" + LTableName + "' : " + LNamingRulesFollowed;
					}
					if(typeof(this.JsDBRefrence.tablesMetaData[LTableName]) !== "undefined"){
					 throw	"Error while createing table '" + LTableName + "' : Table already exits.";					
					}
					for(let LFieldName of LTableFieldNames){
						
					   if(typeof(LFieldName) !== "string")						
					      throw "Error while createing table "+LTableName+" : Field name should be a string";
					
					   if(LFieldName.length === 0)
						 throw "Error while createing table "+LTableName+" : Field name should not be blank";
					   
					   let LNamingRulesFollowed = this.CheckForNamingRules(LFieldName)
					   if(LNamingRulesFollowed !== true)
					
					    throw "Error while createing table '" + LTableName + "' : " + LNamingRulesFollowed;
					
					}
			    }
				catch(p_Expection){
					console.error(p_Expection);
					return false;
				}
			}
			break;
			
			case "deleteTable" :
			{
			 let LTableName = p_QueryData[0];
             
             try{
				if(typeof(LTableName) !== "string"){						
					 throw	"Error while deletting table '" + LTableName + "' : Table name should be a STRING.";					
				}
				if(typeof(this.JsDBRefrence.tablesMetaData[LTableName]) === "undefined"){
				throw	"Error while deletting  table '" + LTableName + "' : Table not found.";					
				}				 
			 }	
			 catch(p_Expection){
				console.error(p_Expection);
				return false;
			  }
			}
			break;
			
			case "insert" : 
			{
			let LTableName = p_QueryData[0],
			    LTableFieldNames = p_QueryData[1],
				LTableFieldValues = p_QueryData[2];
				
				try{
					if(typeof(LTableName) !== "string"){						
					 throw	"Error while inserting data in table '" + LTableName + "' : Table name should be a STRING.";					
					}
					if(typeof(this.JsDBRefrence.tablesMetaData[LTableName]) === "undefined"){
					 throw	"Error while inserting data in table '" + LTableName + "' : Table not found.";					
					}
					if(Array.isArray(LTableFieldNames) === false){
					throw "Error while inserting data in table '" + LTableName + "'  : Field names should be passed with a array.";	
					}
					if(Array.isArray(LTableFieldValues) === false){
					throw "Error while inserting data in table '" + LTableName + "'  : Field values should be passed with a array.";	
					}
					
                   	if(LTableFieldNames.length !== LTableFieldValues.length){
					 throw "Error while inserting data in table '" + LTableName + "' : Length of Fields and Values is not same.";																	
					}		
					
					let LTableIndex = this.JsDBRefrence.tablesMetaData[LTableName];
                    for(let LFieldName of LTableFieldNames){
						if(typeof(LFieldName) !== "string" || LFieldName.length === 0){							
					      throw "Error while inserting data in table '" + LTableName + "'  : Field name should be a string and should not be blank.";
					    }
						if(typeof(this.JsDBRefrence.tableActualData[LTableIndex].fields[LFieldName]) === "undefined"){
						 throw	"Error while inserting data in table '" + LTableName + "' : '" + LFieldName + "' field not found in table.";											
						}						
					}					
				}
				catch(p_Expection){
					console.error(p_Expection);
					return false;
				}				
			}
			break;
	
	        case "select" : 
			{
			let LTableName = p_QueryData[0],
			    LTableFieldNames = p_QueryData[1],
				LQueryCondition = p_QueryData[2];

             try{
				if(typeof(LTableName) !== "string"){						
					 throw	"Error while seleting data in table '" + LTableName + "' : Table name should be a STRING.";					
				} 
				if(typeof(this.JsDBRefrence.tablesMetaData[LTableName]) === "undefined"){
				   throw "Error while seleting data in table '" + LTableName + "' : Table not found.";					
				} 
				if(Array.isArray(LTableFieldNames) === false){
					throw "Error while seleting data in table '" + LTableName + "'  : Field names should be passed with a array.";	
			    }				
				let LTableIndex = this.JsDBRefrence.tablesMetaData[LTableName];
                for(let LFieldName of LTableFieldNames){
					if(typeof(LFieldName) !== "string" || LFieldName.length === 0){							
					      throw "Error while selecting data in table '" + LTableName + "'  : Field name should be a string and should not be blank.";
					}
					if(typeof(this.JsDBRefrence.tableActualData[LTableIndex].fields[LFieldName]) === "undefined"){
						throw	"Error while selecting data in table '" + LTableName + "' : '" + LFieldName + "' field not found in table.";											
				   }						
				}
				if(typeof(LQueryCondition) !== "undefined"){
					
				let LQueryConditionStatus = this.CheckConditionOfQuery(LQueryCondition, LTableIndex);
				if(LQueryConditionStatus !== true){					
				 throw	"Error while selecting data in table '" + LTableName + "' : " + LQueryConditionStatus;															  
				 }
				}				
				 
			 }	
		     catch(p_Expection){
			   console.error(p_Expection);
				return false;
				}			 
			}
			break;
			
			case "update" :
			{
			 let LTableName = p_QueryData[0],
			     LTableFieldNames = p_QueryData[1],
				 LTableFieldValues = p_QueryData[2],
				 LQueryCondition = p_QueryData[3];
				 
             try{
				 if(typeof(LTableName) !== "string"){						
					 throw	"Error while updating data in table '" + LTableName + "' : Table name should be a STRING.";					
				 } 
				 if(typeof(this.JsDBRefrence.tablesMetaData[LTableName]) === "undefined"){
				   throw "Error while updating data in table '" + LTableName + "' : Table not found.";					
				 } 
				 if(Array.isArray(LTableFieldNames) === false){
					throw "Error while updating data in table '" + LTableName + "'  : Field names should be passed with a array.";	
			     }	
				 if(Array.isArray(LTableFieldValues) === false){
					throw "Error while updating data in table '" + LTableName + "'  : Field values should be passed with a array.";	
			     }
                 if(LTableFieldNames.length !== LTableFieldValues.length){
					 throw "Error while updating data in table '" + LTableName + "' : Length of Fields and Values is not same.";																	
				 }	
				 let LTableIndex = this.JsDBRefrence.tablesMetaData[LTableName];
 				 for(let LFieldName of LTableFieldNames){
					if(typeof(LFieldName) !== "string" || LFieldName.length === 0){							
					      throw "Error while updating data in table '" + LTableName + "'  : Field name should be a string and should not be blank.";
					}
					if(typeof(this.JsDBRefrence.tableActualData[LTableIndex].fields[LFieldName]) === "undefined"){
						throw	"Error while updating data in table '" + LTableName + "' : '" + LFieldName + "' field not found in table.";											
				   }						
				 }
				 
				 if(typeof(LQueryCondition) !== "undefined"){	
				 let LQueryConditionStatus = this.CheckConditionOfQuery(LQueryCondition, LTableIndex);
				 if(LQueryConditionStatus !== true){					
				  throw	"Error while updating data in table '" + LTableName + "' : " + LQueryConditionStatus;															  
				  }
				 }
				 
				}
		     catch(p_Expection){
			   console.error(p_Expection);
				return false;
			 }
			}			
			break;
			
			case "delete" : 
			{
			 let LTableName = p_QueryData[0],
				 LQueryCondition = p_QueryData[1];	
             try{
				 if(typeof(LTableName) !== "string"){						
					 throw	"Error while deleting data in table '" + LTableName + "' : Table name should be a STRING.";					
				 } 
				 if(typeof(this.JsDBRefrence.tablesMetaData[LTableName]) === "undefined"){
				   throw "Error while deleting data in table '" + LTableName + "' : Table not found.";					
				 }
				 
				 let LTableIndex = this.JsDBRefrence.tablesMetaData[LTableName];
				 
				 if(typeof(LQueryCondition) !== "undefined"){
					 
				  let LQueryConditionStatus = this.CheckConditionOfQuery(LQueryCondition, LTableIndex);
				  if(LQueryConditionStatus !== true){					
				  throw	"Error while deleting data in table '" + LTableName + "' : " + LQueryConditionStatus;															  
				  }
				 } 				 
			 }
		     catch(p_Expection){
			   console.error(p_Expection);
				return false;
			 }			 
			}
			break;
			
			default : 
			break
		}
	}
	CheckForNamingRules = (p_Name) =>{
				
		let LArrOfString = p_Name.split("");
		try{			
		   if(this.JsReversedKeywords.includes(p_Name) === true){
			throw (p_Name + " is a javascript reverse keyword");
		   }
		   let LDigits = this.Digits;
		   if(LDigits.includes(LArrOfString[0]) === true)
		   {
			 throw ("'" + p_Name + "' name is incorect as per javascript naming conventions, First letter should not be a digit."); 
		   }
		   for(let LCharsOfName of LArrOfString){
			   if(this.AllowedChars.includes(LCharsOfName) !== true)
			   {
				throw ("'"+ p_Name + "' name is incorect as per javascript naming conventions, '" +LCharsOfName+"' is not allowed to use."); 
			    continue;
			   }  
		   }
		}
		catch(p_Expection){
			
			return p_Expection;
		}
     return true;
	}
 
    CheckConditionOfQuery = (p_strCondition, p_intTableIndex) =>{
		
        if(p_strCondition === "" || typeof(p_strCondition) !== "string"){		
			return "Invaild condition in query - Query condition should be of type STRING and should not be blank.";		    
		}
		p_strCondition = p_strCondition.trim();
		let LTableIndex = p_intTableIndex;
		let LCondtionTokes = p_strCondition.split(" ");

        if(LCondtionTokes[0] === "AND" || LCondtionTokes[0] === "OR"){		
			return "Invaild condition in query - AND or OR should not be at first place.";
		    
		}
		let LTokensArrLength = LCondtionTokes.length-1;
		if(LCondtionTokes[LTokensArrLength] === "AND" || LCondtionTokes[LTokensArrLength] === "OR"){		
			return "Invaild condition in query - AND or OR should not be at last place.";
		    
		}
		let LisToken = true;
		
		for(let LTokens of LCondtionTokes)
        {
          if(LisToken === false ){
           if(LTokens !== "AND" && LTokens !== "OR")
		   {			   
           	return "Invaild condition in query - condition should be a proper conditional statement, only conditions, AND and OR are allowed to inject.";	
           }
		   LisToken = true;
		 }
         else{
			 
             let LSubTokens = LTokens.split("=");
			 if(LSubTokens.length > 2){
				  return "Invaild condition in query : '" + LTokens +"' is not a viald token.";	  
			 }
			 if(typeof(LSubTokens[1]) === "undefined"){		
			   return "Invaild condition in query : '" + LTokens +"' is not a viald token.";	 

			 }            
			 if(typeof(this.JsDBRefrence.tableActualData[LTableIndex].fields[LSubTokens[0]]) === "undefined"){
				 return "Invaild condition in query : '" + LSubTokens[0] +"' field not found in table.";	 			  
			  }						
			 LisToken = false;
          }
        }
        return true;		
	} 
}
function IntailizeJsDB(){
	return JsD = new JsDB();
}
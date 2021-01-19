# JsDB

# Introduction : 

JsDB is simple javascript database.which allows to a user to create a client side database.
It a sql type database who follow javascript style. It saves data in tabular form which consist of fields.
Like sql user can create table, delete table, and insert, select, update, delete data in table.
It also allows user to perform selete, update, delete, operations based on condtions simply like sql.
User just need to call methods with all vaild parameters.
It Also has error handling system which perfectly checks all parameters passed to a particular method. 

# API Documentation :

Important Notes : 

 * Table Name - should be a string.
 * Fields Names :  Should be passed with an array. 
 * Fields Values : Should be passed with an array. 
 
 * When passing Field Names and Field Values. they should be of same lenght.
 
 * Condition : Should be a string.
   use "AND", "OR" to make a conditional statement. it should be a proper conditional statement.
   example : "id=146 AND name=tonny OR age=14".
   
IntailizeJsDB() : 
To create a new instance of JsDB. this function returns new instance of JsDB.

CreateTable(p1, p2) :  p1 - Table Name [String], p2 = Fields Name[Array].

DeleteTable(p1) : p1 - Table Name [String].

Insert(p1, p2, p3) : p1 - Table Name [String], p2 - Fields Name[Array], p2  - Fields Values[Array].

Select(p1, p2 , p3) : p1 - Table Name [String], p2 - Fields Name[Array], p3 - Condtions[string].

Update(p1, p2 , p3, p4) : p1 - Table Name [String], p2 - Fields Name[Array], p3 - Fields Values[Array], p4 - Condtions[string].

Delete(p1, p2) : p1 - Table Name [String], p2 - Condtions[string].

# Usages : 

Simply include JsDB.js file in your application.

Following is a example of  use all methods of JsDB or one can visit Demo folder for a perfect UI example.

const LJsDB = IntailizeJsDB();

LJsDB.CreateTable("CanditateDetails",["id","name","email","mobileNo","age","address"]);

let LFieldName = ["id","name","email","mobileNo","age","address"];
let LValues = [146,"jonny","Jonny@mymail.com","85632152","14","New Col"];
LJsDB.Insert("CanditateDetails", LFieldName, LValues);

let LFieldName = ["id","name","email","mobileNo","age","address"];
LFetchedValues = LJsDB.Select("CanditateDetails", LFieldName);

LFieldName = ["name","email","mobileNo"];
LValues = ["tonny","tonny@mymail.com","2546935"];
LJsDB.Update("CanditateDetails", LFieldName, LValues, "id=146 AND age=14");

LJsDB.Delete("CanditateDetails", "id=146 AND name=tonny OR age=14");

LJsDB.DeleteTable("CanditateDetails");

# Upcoming Features in Next Release : 

 * Table Altering
 * Import and Export
 * Types for Fields
 * Enhencement in Conditions
 * Default auto increment field for tables
 * Working with Nodejs
 * Binding in ReactJs
 * Binding in AngularJs

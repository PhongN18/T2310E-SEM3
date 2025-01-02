// Create a database named 'Employee' and a collection named 'Employee_detail'
use Employee
db.createCollection('Employee_detail')

// Insert documents into 'Employee_detail' collection
db.Employee_detail.insertMany([
    {
        Emp_name: "Oliver Smith",
        Age: 23,
        Desination: "Manager"
    },{
        Emp_name: "David Michael",
        Age: 32,
        Designation: "Software Engineer"
    }
])

// Update the 'designation' of 'Oliver Smith' to 'Accountant'
db.Employee_detail.updateOne(
    { Emp_name: "Oliver Smith" },
    { $set: { Designation: "Accountant" } }
)

// Delete the document in 'Employee_detail' collection where the name of the employee is 'David Michael'
db.Employee_detail.deleteOne({ Emp_name: 'David Michael' })

// Drop the collection 'Employee_detail'
db.Employee_detail.drop()

// Drop the database 'Employee'
db.dropDatabase()

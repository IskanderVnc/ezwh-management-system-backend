 #Requirements Document 

Date: 11 april 2022

Version: 1.1

 
| Version number | Change |
| ----------------- |:-----------|
| 1.0 | Create requirements document | 
| 1.1 | Update Non Functional| 
| 1.2 | Update overall (links, fixed errors, fixed diagrams) | 


# Contents

- [Informal description](#informal-description)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	+ [Functional Requirements](#functional-requirements)
	+ [Non functional requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	+ [Use case diagram](#use-case-diagram)
	+ [Use cases](#use-cases)
    	+ [Relevant scenarios](#relevant-scenarios)
- [Glossary](#glossary)
- [System design](#system-design)
- [Deployment diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Description | 
| ----------------- |:-----------:|
|  Medium Company or Retailer |  The company itself, the main buyer           | 
|  Supplier |  The vendor, the one who sells items to the company      	  | 
|  Company Manager |  Handles human resources  | 
|  Warehouse Manager |  Handles warehouse space and warehouse employees and submits orders to suppliers | 
| Quality office employee | Tests items acquired from suppliers| 
|  Warehouse Employee |  Main Worker in the warehouse, he uses the software to manage the warehouse  |
|  Organizational Unit Supply Manager | The manager that asks for the internal orders in the company  |
|  Pick-up Area | Destinations of the internal orders |
|  Company accounting section |  The part of the company that manages the physical payment  of the resources |
|  Bank |  The structure that is affected by the transaction of money in the external orders  |
|  Payment Service |  Service that allows user to interact with the bank  |
 |  Cybersecurity Manager |  Responsible for the sensitive information inside the company   |
 |  EzWh developing company |  The company that develops the software itself  |
 |  Warehouse(enviroment) |  The physical space in which items are stored, removed or more in general handled |        
|  Competitors |  Other companies that want to develop similar softwares for the same purpose | 

# Context Diagram and interfaces

## Context Diagram

![context_diagram](/requirements_images/Context_Diagram.png)


## Interfaces

| Actor | Logical Interface | Physical Interface |
| ------------- |:-------------|:-----|
| Company manager | GUI | Screen, keyboard |
| Warehouse manager | GUI | Screen, keyboard |
| Warehouse employee | GUI | Screen, keyboard |
| OU Supply manager | GUI | Screen, keyboard |
| Quality office employee | GUI | Screen, keyboard |


# Stories and personas

The following personas and stories are meant to cover different profiles of the User actor.

- Mauro is 29 y/o, he works as employee for a company in the city close to his small town. His role is to manage the company's warehouse and relocate the huge quantity of items that arrives every day and he would like to have a software to handle this procedure better and faster. He has two children and sometimes his manager lets him bring at home some defective items for his children.

- Emma is 35 y/o, and she is the warehouse manager in a big company. She has been working every day with great efficiency and constancy to reach this position. She always complains with her employees because they often forget to update the position of the items after having relocated them.

- Michele is 42 y/o and after many years of hard work he succeded to become the manager of the company that he has always been dreaming about. His main role is to manage the staff and he does this work very well beacuse every employee considers him a kind and human person. An important appointment that he has established is going out for a dinner every wednesday to make the group more cohesive and nobody in the group ever misses it.

- Anna is a 25 y/o student who lives alone because she wants to be independent. She works for a small organizational unit inside a shoes' company and everyday Anna argues with the warehouse manager of the company because he never answers her calls and she does not know if he has received her orders.

- Luigi is a 40 y/o man who works as employee and loves his job. He has to check the quality of the items that arrive from the suppliers and he really enjoys it. Sometimes he discovers that some suppliers try to trick him by adjusting some items in order to hide some defects, but he is able to figure it out and sends the items back. Then he is proud to make the manager know that no one can trick him.

# Functional and non functional requirements

## Functional Requirements


| ID        | Description  |
| ------------- |:-------------:| 
|   FR1     | Manage users |
|   FR1.1   | Create user (Name, Surname, Username, Password, Role) |
|   FR1.2   | Modify user |
|   FR1.3   | Delete user |
|   FR2     | User authorization and authentication |
|   FR3     | Manage supplier |
|  	FR3.1   | List all suppliers |
|	FR3.2	| Define new supplier |
|	FR3.3 	| Delete supplier |
|	FR3.4	| Modify supplier |
|	FR3.5   | List supplier catalogue |
|	FR3.6	| Add new item to the catalogue |
|	FR3.7	| Remove item from the catalogue |
|	FR3.8   | Modify item in the catalogue |
|	FR4 |Handle items quality checks|
|	FR4.1	|Notify to warehouse manager the positive outcome of checks on items|
|	FR4.2|	Notify to warehouse manager the negative outcome of checks on items and the need to reject|
|	FR5		| Manage warehouse space |
|	FR5.1 	| Add an item to a specific slot |
|	FR5.2 	| Remove an item from a specific slot |
|	FR5.3 	| Move an item from a specific slot to another |
|	FR5.4	| List all available slots |
|	FR5.5	| List all unavailable slots |
|	FR5.6	| List all warehouse items |
|	FR5.7	| Add a new warehouse slot |
|	FR5.8	| Modify a warehouse slot |
|	FR5.9	| Remove a warehouse slot |
|	FR6		| Manage orders |
|	FR6.1	| Select items to order |
|	FR6.2   | Select desired supplier |
|	FR6.3	| Request an order (submit)|
|	FR6.4	| Handle rejections of items/orders	|			
|	FR7 	| Manage internal orders |
|	FR7.1	| Request items to the warehouse |
|	FR7.2	| Accept internal orders |
|	FR7.3	| Decline internal orders |
|	FR8     | Delivery internal orders |
|	FR8.1	| Show all the accepted internal orders |
|	FR8.2	| Confirm the actual delivery |

### Access right, actor vs function

| Function | Company manager | Warehouse manager | Warehouse employee | OU Supply manager | Quality office employee |
| -------- | :-----: | :------------: | :-------: |  :-------: |  :-------: |
| FR1 | yes | only warehouse employees | no | no  | no  |
| FR2|  yes | yes | yes  | yes  | yes  |
| FR3|  yes | no | no  | no | no  |
| FR4 | no | no | no | no  | yes  |
| FR5 | no  | yes | yes (excluded: slots create/modify/delete functions) |no   | no  |
| FR6 | no  | yes | no | no | no  |
| FR7 | no | yes | no  | yes | no  |
| FR8 | no | no | yes  | no  | no  |

## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     | Usability  |Application should be used with no specific training for the users  |  All FR|
|  NFR2     |Performance | All functions should complete in < 0.5 sec |All FR |
|  NFR3     |Privacy |Employees and company private data should not be disclosed outside the application | All FR|
| NFR4|Security | Employees and managers passwords should be encrypted when saved on the database| FR1 - FR2 | 
| NFR5|Domain | External Order Numbers should be EZWHxxxx where the 'x's are digits| FR6 | 
| NFR6|Domain |External Orders could be in the state: Pending, Accepted, Arrived | FR6 | 
| NFR7|Domain | Internal Order Numbers should be EZxxxx where the 'x's are digits| FR7 | 
| NFR8|Domain |Internal Orders could be in the state: Pending, Accepted, Delivered | FR7 | 
| NFR9| Domain|Item codes should be Ixxxxxx where the 'x's are 	digits| FR3 - FR5 - FR6 - FR7 | 
| NFR10|Portability |Deployable on different operating systems | ALL FR| 
| NFR11| Size| Manage a maximum of 500 item slots| ALL FR| 
| NFR12| Size| Manage a maximum of 250 employees| ALL FR | 
| NFR13|Availability |Availability of the service at least 95% (should manage well the communication with the local server) | ALL FR | 
| NFR14| Robustness| The time to restart the application after a failure should be under 5 minutes| ALL FR | 


# Use case diagram and use cases

## Use case diagram

![use_case_diagram](/requirements_images/usecasediagram.png)


## Use cases

# Use case 1, Manage Users (FR1)

| Actors Involved        | Company manager or Warehouse manager  |
| ------------- |:-------------:| 
|  Precondition     | Company manager or warehouse manager profiles are defined and are logged in the application |
|  Post condition     | A user U is added |
|                     | A user U is modified |
|                     | A user U is deleted |
|  Nominal Scenario(s)     | S1.1, S1.3, S1.5 |
|  Variants     | / |
| Exceptions | S1.2, S1.4, S1.6 |

## Relevant scenarios

## Relevant scenarios for UC1:

### Scenario 1 [NOMINAL] 

| Scenario ID: S1.1         | Corresponds to UC1  |
| ------------- |:-------------| 
| Description | Application lets the manager add a new user (the role is defined only by the company manager) |
| Precondition | The user U does not exist |
| Postcondition | The user U exists  |
| Step#        |  Step description   |
|  1           | Manager asks to create a new user |  
|  2           | Application asks for name, surname, username, password and role (this last one only if the manager has company manager rights) |
|  3           | Manager enters name, surname, username, password and role (this last one only if the manager has company manager rights) |
|  4           | Application checks if username already exists - not exist |
|  5           | User U is added |

### Scenario 2 [EXCEPTION] 

| Scenario ID: S1.2         | Corresponds to UC1  |
| ------------- |:-------------| 
| Description | Application does not let manager add a new user because it already exists (the role is defined only by the company manager)  |
| Precondition | The user U already exists |
| Postcondition | The user U is not created, no changes  |
| Step#        |  Step description   |
|  1           | Manager asks to create a new user |  
|  2           | Application asks for name, surname, username, password and role (this last one only if the manager has company manager rights) |
|  3           | Manager enters name, surname, username, password and role (this last one only if the manager has company manager rights) |
|  4           | Application checks if username already exists - already exists |
|  5           | User U is not added |

### Scenario 3 [NOMINAL]

 Scenario ID: S1.3         | Corresponds to UC1  |
| ------------- |:-------------| 
| Description | Application lets the manager modify an existing user (the role can be modified only by the company manager) |
| Precondition | The user U exists |
| Postcondition | The user U is modified  |
| Step#        |  Step description   |
|  1           | Manager asks to modify an existing user |  
|  2           | Application asks to modify name, surname, username, password and role (this last one only if the manager has company manager rights) |
|  3           | Manager modify name, surname, username, password or role (this last one only if the manager has company manager rights) |
|  4           | Application checks if the new username already exists - not exist |
|  5           | User U is modified |

### Scenario 4 [EXCEPTION]   

 Scenario ID: S1.4         | Corresponds to UC1  |
| ------------- |:-------------| 
| Description | Application does not let manager modify an existing user because the new username already exists (the role can be modified only by the company manager) |
| Precondition | The user U exists |
| Postcondition | The user U is not modified, no changes  |
| Step#        |  Step description   |
|  1           | Manager asks to modify an existing user |  
|  2           | Application asks to modify name, surname, username, password and role (this last one only if the manager has company manager rights) |
|  3           | Manager modify name, surname, username, password or role (this last one only if the manager has company manager rights) |
|  4           | Application checks if the new username already exists - already exists |
|  5           | User U is not modified |

###  Scenario 5 [NOMINAL]   

 Scenario ID: S1.5         | Corresponds to UC1  |
| ------------- |:-------------| 
| Description | Application lets the manager delete an existing user (warehouse manager can only delete warehouse empolyees) |
| Precondition | The user U exists |
| Postcondition | The user U is deleted  |
| Step#        |  Step description   |
|  1           | Manager asks to delete an existing user |  
|  4           | Application checks if no constraints are violated - no violations |
|  5           | User U is deleted |

###  Scenario 6 [EXCEPTION]   

 Scenario ID: S1.6         | Corresponds to UC1  |
| ------------- |:-------------| 
| Description | Application does not let manager delete an existing high-role user (company manager only) |
| Precondition | The user U exists |
| Postcondition | The user U is not deleted  |
| Step#        |  Step description   |
|  1           | Manager asks to delete an existing user |  
|  4           | Application checks if no constraints are violated - you can't delete the warehouse manager, only modify it  |
|  5           | User U is not deleted |


# Use case 2, Authorize and authenticate user (FR2)

| Actors Involved        | User (any)  |
| ------------- |:-------------:| 
|  Precondition     | User U is not logged |
|  Post condition     | User U is authorized and authenticate |
|  Nominal Scenario(s)     | S2.1  |
|  Variants     | /  |
|  Exceptions | S2.2 |

## Relevant scenarios for UC2:

### Scenario 1 [NOMINAL] 

 Scenario ID: S2.1         | Corresponds to UC2  |
| ------------- |:-------------| 
| Description | Application let the user log in |
| Precondition | The user U exists |
| Postcondition | The user U is logged in  |
| Step#        |  Step description   |
|  1           | User asks to login |  
|  2           | Application asks to insert username and password |
|  3           | User enters username and password  |
|  4           | Application checks if the U exists - exists |
|  5           | User U is authorized and authenticated |

### Scenario 2 [EXCEPTION]

| Scenario ID: S2.2         | Corresponds to UC2  |
| ------------- |:-------------| 
| Description | Application does not let the user log in |
| Precondition | The user U does not exists |
| Postcondition | The user U is not logged in  |
| Step#        |  Step description   |
|  1           | User asks to login |  
|  2           | Application asks to insert username and password |
|  3           | User enters username and password  |
|  4           | Application checks if the U exists - not exist |
|  5           | User U is not authorized and authenticated |


# Use case 3, Manage supplier (FR3)

| Actors Involved        | Company manager |
| ------------- |:-------------:| 
|  Precondition     |  User is logged in as Company manager |  
|  Post condition     |  A list of all suppliers is displayed   |
|                     |  A new supplier is added  |
|                     |  A supplier is removed   |
|                     |  A supplier is modified |
|                     |  Supplier's catalogue is displayed  |
|                     |  An item is added in the catalogue  |
|                     |  An item is removed from the catalogue |
|                     |  An item is modified in the catalogue |
|  Nominal Scenario(s)     |  S3.1 , S3.3 , S3.5 , S3.6 , S3.8 , S3.10 , S3.12 , S3.13 |
|  Variants     | S3.2 , S3.9  |
| Exceptions | S3.4 , S3.7 , S3.11 , S3.14 |


## Relevant scenarios for UC3:

### Scenario 1 [NOMINAL] 

| Scenario ID: S3.1         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application shows the list of all suppliers |
| Precondition | User is logged in as Company manager |
| Postcondition |  List of all suppliers is shown  |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" |  
|  2           | The list of all suppliers is shown |

### Scenario 2 [VARIANT] 

| Scenario ID: S3.2         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application shows an empty list for suppliers |
| Precondition | User is logged in as Company manager |
| Postcondition | List is empty because no suppliers were added |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" |  
|  2           | Application shows an empty list |

### Scenario 3 [NOMINAL]

 Scenario ID: S3.3         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application lets the company manager add a new supplier|
| Precondition | User is logged in as Company manager |
| Postcondition |  New supplier is added correctly and is shown in the list |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" | 
|  2           | Company manager asks to add a new supplier |
|  3           | Application asks to add the supplier name |
|  4           | Company manager enters the new supplier name |
|  5           | Application shows a message of correct insertion |
|  6           | Supplier is shown in the table |

###  Scenario 4 [EXECPTION]

 Scenario ID: S3.4         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application does not let company manager add a new supplier|
| Precondition | User is logged in as Company manager |
| Postcondition | Application shows an error message due to a wrong input |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" | 
|  2           | Company manager asks to add a new supplier |
|  3           | Application asks to add the supplier name |
|  4           | Company manager enters the new supplier name |
|  5           | Application shows an error message of wrong input |

### Scenario 5 [NOMINAL]

 Scenario ID: S3.5         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application lets the company manager remove a supplier|
| Precondition | User is logged in as Company manager and the supplier is already added |
| Postcondition |  The supplier is removed from the list |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" | 
|  2           | Selects the trash icon for the supplier |
|  3           | Application shows a message of correct cancellation |
|  4           | Supplier is removed from the table |

### Scenario 6 [NOMINAL]

 Scenario ID: S3.6         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application lets the company manager modify a supplier|
| Precondition | User is logged in as Company manager and a supplier is already added |
| Postcondition |  The supplier is modified |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" | 
|  2           | Selects the edit icon for the supplier |
|  3           | Edit the pre-filled form that appears |
|  4           | Application shows a message of correct modification |
|  5           | The supplier is updated |

### Scenario 7 [EXECPTION]

 Scenario ID: S3.7          | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application does not let company manager modify a supplier |
| Precondition | User is logged in as Company manager and a supplier is already added |
| Postcondition |  Application shows an error message due to a wrong input |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" | 
|  2           | Selects the edit icon for the supplier |
|  3           | Edit the pre-filled form that appears |
|  4           | Application shows an error message |

### Scenario 8 [NOMINAL] 

| Scenario ID: S3.8         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application shows the supplier's catalogue  |
| Precondition | User is logged in as Company manager and a supplier is already added |
| Postcondition |  Catalogue is shown  |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" |  
|  2           | Selects the catalogue icon for the supplier |
|  3           | Catalogue is shown |

### Scenario 9 [VARIANT] 

| Scenario ID: S3.9         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application shows the supplier's catalogue  |
| Precondition | User is logged in as Company manager and a supplier is already added |
| Postcondition |  Catalogue shows an empty list  |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" |  
|  2           | Selects the catalogue icon for the supplier |
|  3           | Catalogue shows an empty list |

### Scenario 10 [NOMINAL] 

| Scenario ID: S3.10         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application lets the company manager add a new item in the supplier's catalogue  |
| Precondition | User is logged in as Company manager and a supplier is already added |
| Postcondition |  Item is correctly inserted and is shown in the catalogue |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" |  
|  2           | Selects the catalogue icon for the supplier |
|  3           | When catalogue is displayed, selects add item |
|  4           | Fill in the form that appears to add a new item |
|  5           | Application shows a message of correct insertion |
|  6           | Item is shown in the catalogue |


### Scenario 11 [EXECPTION] 

| Scenario ID: S3.11         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application does not let company manager add a new item in the supplier's catalogue  |
| Precondition | User is logged in as Company manager and a supplier is already added |
| Postcondition |  Application shows an error message due to a wrong input |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" |  
|  2           | Selects the catalogue icon for the supplier |
|  3           | When catalogue is displayed, selects add item |
|  4           | Fill in the form that appears to add a new item |
|  5           | Application shows an error message due to a wrong input |

### Scenario 12 [NOMINAL] 

| Scenario ID: S3.12         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application lets the company manager remove an item from the supplier's catalogue  |
| Precondition | User is logged in as Company manager, a supplier and an item are already added |
| Postcondition |  Item is removed from the catalogue |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" |  
|  2           | Selects the catalogue icon for the supplier |
|  3           | When catalogue is displayed, selects trash icon for the item |
|  4           | Application shows a message of correct cancellation |
|  5           | Item is removed from the catalogue |

### Scenario 13 [NOMINAL] 

| Scenario ID: S3.13         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application lets the company manager modify an item from the supplier's catalogue  |
| Precondition | User is logged in as Company manager, a supplier and an item are already added |
| Postcondition |  Catalogue is updated |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" |  
|  2           | Selects the catalogue icon for the supplier |
|  3           | When catalogue is displayed, selects edit icon for the item |
|  4           | Edit the pre-filled form that appears |
|  5           | Application shows a message of correct modification |
|  6           | Catalogue is updated |

### Scenario 14 [EXECPTION] 

| Scenario ID: S3.14         | Corresponds to UC3  |
| ------------- |:-------------| 
| Description | Application does not let company manager modify an item from the supplier's catalogue  |
| Precondition | User is logged in as Company manager, a supplier and an item are already added |
| Postcondition |  Application shows an error message due to a wrong input |
| Step#        |  Step description   |
|  1           | Company manager selects "Manage Supplier" |  
|  2           | Selects the catalogue icon for the supplier |
|  3           | When catalogue is displayed, selects edit icon for the item |
|  4           | Edit the pre-filled form that appears |
|  5           | Application shows an error message |

# Use case 4, Handle items quality checks (FR4)

| Actors Involved        | Quality office employee  |
| ------------- |:-------------:| 
|  Precondition     | Quality office employee profile is defined and is logged in the application |
|                   | Items/orders are available to be checked |
|  Post condition     | Items/order tests result is notified to the warehouse manager with positive outcome |
|                     | Items/order tests result is notified to the warehouse manager with negative outcome (need to be rejected) |
|  Nominal Scenario(s)     | S4.1, S4.2 |
|  Variants     | / |
| Exceptions | S4.3 |

### Scenario 1 [NOMINAL]

| Scenario ID: S4.1         | Corresponds to UC4  |
| ------------- |:-------------| 
| Description | The quality office employee notify to the warehouse manager the positive outcome of the tests, with a description of them |
| Precondition | Items/order is available to be checked |
| Postcondition | The warehouse manager is notified of positive outcome  |
| Step#        |  Step description   |
|  1           | User asks to report the positive outcome of tests on items/order |  
|  2           | Application asks to insert a description of tests in the positive outcome report |
|  3           | User enters tests description |
|  4           | Application sends a positive outcome notification to the warehouse manager |

### Scenario 2 [NOMINAL]

| Scenario ID: S4.2         | Corresponds to UC4  |
| ------------- |:-------------| 
| Description | The quality office employee notify to the warehouse manager the negative outcome of the tests, with a description of them |
| Precondition | Items/order is available to be checked |
| Postcondition | The warehouse manager is notified of negative outcome  |
| Step#        |  Step description   |
|  1           | User asks to report the negative outcome of tests on items/order |  
|  2           | Application asks to insert a description of tests in the negative outcome report |
|  3           | User enters tests description |
|  4           | Application sends a negative outcome notification to the warehouse manager |

###  Scenario 3 [EXCEPTION]

| Scenario ID: S4.3         | Corresponds to UC4  |
| ------------- |:-------------| 
| Description | The quality office employee notify the outcome of the tests, without a description |
| Precondition | Items/order is available to be checked |
| Postcondition | The warehouse manager is not notified  |
| Step#        |  Step description   |
|  1           | User asks to report the outcome of tests on items/order |  
|  2           | Application asks to insert a description of tests in the negative outcome report |
|  3           | User does not enter tests description and try to send the report |
|  4           | Application does not allow to send the report because of the empty description |

# Use case 5, Manage Warehouse Space (FR5)

| Actors Involved        | Warehouse manager and employee  |
| ------------- |:-------------:| 
|  Precondition     | Warehouse and warehouse manager and employees profiles are defined |  
|  Post condition     | An item is added into a specific warehouse slot |
|                     | An item is removed from a specific warehouse slot |
|                     | An item is moved from a slot to another one |
|                     | A list of all slots is displayed |
|                     | A list of all available slots is displayed |
|                     | A list of all unavailable places is displayed |
|                     | The complete warehouse inventory is displayed |
|                     | A new warehouse slot is added |
|                     | A warehoue slot is modified |
|                     | A warehouse slot is removed |
|  Nominal Scenario(s)     |  S5.1 , S5.3 , S5.4 , S5.6 , S5.8 , S5.9 , S5.10 , S5.11 |
|  Variants     | S5.7  |
| Exceptions | S5.2 , S5.5, S5.12, S5.13 |

## Relevant scenarios for UC5:

###  Scenario 1 [NOMINAL] 

| Scenario ID: S5.1         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description | Application lets the user add an item to a specific warehouse slot |
| Precondition | The specified slot has enough free space in it to store the item/items |
| Postcondition |  The item/items selected are placed into the slot and free space is updated  |
| Step#        |  Step description   |
|  1           | User selects the wanted slot |  
|  2           | Application shows the details about the slot ( free space, id...) and possible operations |
|  3           | User selects option "Add items to slot" |
|  4           | Application lets the user create a list of items to be placed into the slot |
|  5           | User submits the placement of items and confirms the operation |
|  6           | Application adds items and updates free space of the slot |

###  Scenario 2 [EXCEPTION] 

| Scenario ID: S5.2         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description | Application does not user add an item to a specific warehouse slot |
| Precondition | The specified slot does not have enough free space in it to store the item/items |
| Postcondition |  The item/items selected are not placed into the slot and free space remains unvaried |
| Step#        |  Step description   |
|  1           | User selects the wanted slot |  
|  2           | Application shows the details about the slot ( free space, id...) and possible operations |
|  3           | User selects option "Add items to slot" |
|  4           | Application lets the user create a list of items to be placed into the slot |
|  5           | Application notifies the impossibility to confirm the operation due to a lack of free space |

###  Scenario 3 [NOMINAL]

 Scenario ID: S5.3         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description | Application lets the user remove an item from a specific warehouse slot |
| Precondition | The specified slot contains some items |
| Postcondition |  The item/items selected are removed from the slot and free space is updated. Items are now unassigned |
| Step#        |  Step description   |
|  1           | User selects the wanted slot |  
|  2           | Application shows the details about the slot ( free space, id...) and possible operations |
|  3           | User selects option "Remove items from slot" |
|  4           | Application lets the user create a list of items to be removed from the slot |
|  5           | User submits the removal of items and confirms the operation |
|  6           | Application removes item/items and updates free space of the slot |

###  Scenario 4 [NOMINAL]

 Scenario ID: S5.4         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description | Application lets the user move an item from a specific warehouse slot to another one |
| Precondition | The specified slot contains some items and destination slot has enough free space |
| Postcondition |  The item/items selected are removed from the slot and free space is updated. Items are now assigned to the destiantion slot |
| Step#        |  Step description   |
|  1           | User selects the wanted slot |  
|  2           | Application shows the details about the slot ( free space, id...) and possible operations |
|  3           | User selects option "Reposition items to new slot" |
|  4           | Application lets the user create a list of items to be removed from the selected slot and moved into another one |
|  5           | User submits the removal of items and confirms the operation |
|  6           | Application moves item/items and updates free space of both specified slots |

###  Scenario 5 [EXCEPTION]

 Scenario ID: S5.5         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description | Application does not let user move an item from a specific warehouse slot to another one |
| Precondition | The specified slot contains some items and destination slot does not have enough free space |
| Postcondition |  The selected item/items position remains unvaried |
| Step#        |  Step description   |
|  1           | User selects the wanted slot |  
|  2           | Application shows the details about the slot (free space, id...) and possible operations |
|  3           | User selects option "Reposition items to new slot" |
|  4           | Application lets the user create a list of items to be removed from the selected slot and moved into another one |
|  5           | Application notifies the impossibility to confirm the operation due to a lack of free space in the destination slot |

###  Scenario 6 [NOMINAL] 

| Scenario ID: S5.6         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description  | Application lets the user see all slots  |
| Precondition | Warehouse manager or employee are autheticated |
| Postcondition | Applications shows the list of all warehouse slots |
| Step#        |  Step description   |
|  1           | User selects option "Warehouse slots" |  
|  2           | Application displays the complete list of warehouse slots |

###  Scenario 7 [VARIANT]

| Scenario ID: S5.7         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description  | Application lets the user select some filters to see only certain slots |
| Precondition | Warehouse manager or employee are autheticated |
| Postcondition | Applications shows the list of all warehouse slots with the applied filters |
| Step#        |  Step description   |
|  1           | User selects option "Warehouse slots" |  
|  2           | Application displays the complete list of warehouse slots |
|  3           | User selects the desired filter ( Available slots / Unavailable slots ) |
|  4           | Application displays the list of slots satisfying such filters |

###  Scenario 8 [NOMINAL] 

| Scenario ID: S5.8         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description  | Application lets the user see the complete inventory of the warehouse |
| Precondition | Warehouse manager or employee are autheticated |
| Postcondition | List of all items in the warehouse is displayed   |
| Step#        |  Step description   |
|  1           | User selects the option "Inventory"  |  
|  2           | Application displays the full inventory of the warehouse |

###  Scenario 9 [NOMINAL]

| Scenario ID: S5.9         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description  | Applicaiton lets the user create a new warehouse slot |
| Precondition | Warehouse manager and warehouse are defined |
| Postcondition | A new slot is added to the warehouse |
| Step#        |  Step description   |
|  1           | User navigates to "Manage warehouse" section |  
|  2           | User fills in the form with the new slot details (max volume, max weight, slot number) and submits it |
|  3           | The application adds the new slot to the warehouse and the slot is now displayed |

###  Scenario 10 [NOMINAL]

| Scenario ID: S5.10         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description  | Application lets the user modify warehouse slot |
| Precondition | Warehouse manager and warehouse are defined and valid data is entered in the modification form |
| Postcondition | The selected slot is modified |
| Step#        |  Step description   |
|  1           | User navigates to "Manage warehouse" section |  
|  2           | User selects a slot to be modified |
|  3           | The application lets the user modify slot details (max volume, max weight, slot number) |
|  4           | The slot is now modified |

###  Scenario 11 [NOMINAL]

| Scenario ID: S5.11         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description  | Application lets the user remove a warehouse slot |
| Precondition | Warehouse manager and warehouse are defined |
| Postcondition | The selected slot is removed |
| Step#        |  Step description   |
|  1           | User navigates to "Manage warehouse" section |  
|  2           | User selects a slot to be removed |
|  3           | The application lets the user remove the slot through a specific option |
|  4           | The slot is now removed |

### Scenario 12 [EXCEPTION]

| Scenario ID: S5.12         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description  | Applicaiton does not allow the user to create a new slot  |
| Precondition | Warehouse manager and warehouse are defined |
| Postcondition | The new slot is not added and the operation is aborted |
| Step#        |  Step description   |
|  1           | User navigates to "Manage warehouse" section |  
|  2           | User fills in the form with the new slot details (max volume, max weight, slot number) and submits it |
|  3           | The application notifies the user that the entered data is not valid and the operation cannot be completed |

### Scenario 13 [EXCEPTION]

| Scenario ID: S5.13         | Corresponds to UC5  |
| ------------- |:-------------| 
| Description  | Applicaiton does not allow the user to modify the selected slot |
| Precondition | Warehouse manager and warehouse are defined |
| Postcondition | The slot is not modified and the operation is aborted |
| Step#        |  Step description   |
|  1           | User navigates to "Manage warehouse" section |  
|  2           | User selects a slot to be modified |
|  3           | The application let the user modify slot details (max volume, max weight, slot number) |
|  4           | The application notifies the user that the data entered is not valid and the operation cannot be completed |

# Use case 6, Manage Orders (FR6)

| Actors Involved        | Warehouse manager |
| ------------- |:-------------:| 
|  Precondition     | Warehouse and Warehouse manager profile are defined |  
|  Post condition     | An order is submitted to a specific supplier |
|                     | The rejection of items/orders is submitted to the supplier |
|  Nominal Scenario(s)     | S6.1 , S6.4 |
|  Variants     | S6.2 |
| Exceptions | S6.3 |

## Relevant scenarios for UC6:

###  Scenario 1 [NOMINAL] 

| Scenario ID: S6.1         | Corresponds to UC6  |
| ------------- |:-------------| 
| Description  | Application lets the user create a new order to a specific supplier |
| Precondition | Warehouse and warehouse manager profile are defined and enough free space is available |
| Postcondition | A new order is submitted to a supplier   |
| Step#        |  Step description   |
|  1           | User navigates to the "New order" section of the application |  
|  2           | Application shows to the user a list of searched items and relative suppliers |
|  3           | User defines the content of the order and the desired supplier and proceeds to pay |
|  4           | Application submits the order to the supplier |

###  Scenario 2 [VARIANT] 

| Scenario ID: S6.2         | Corresponds to UC6  |
| ------------- |:-------------| 
| Description  | Application aborts the new order to a specific supplier |
| Precondition | Warehouse and warehouse manager profile are defined and enough free space is available |
| Postcondition | A new order is not submitted to a supplier   |
| Step#        |  Step description   |
|  1           | User navigates to the "New order" section of the application |  
|  2           | Application shows to the user a list of searched items and relative suppliers |
|  3           | User defines the content of the order and the desired supplier |
|  4           | User decides to abort the order request |
|  5           | Application does not submit the order to the supplier |

###  Scenario 3 [EXCEPTION]

| Scenario ID: S6.3         | Corresponds to UC6  |
| ------------- |:-------------| 
| Description  | Application does not let the user create a new order to a specific supplier |
| Precondition | Warehouse and warehouse manager profile are defined but not enough free space is available |
| Postcondition | A new order is not submitted to a supplier |
| Step#        |  Step description   |
|  1           | User navigates to the "New order" section of the application |  
|  2           | Application shows to the user a list of searched items and relative suppliers |
|  3           | User defines the content of the order and the desired supplier and proceeds to pay |
|  4           | Application notifies the impossibility to make the order because not enough free space is available  |

###  Scenario 4 [NOMINAL] 

| Scenario ID: S6.4         | Corresponds to UC6  |
| ------------- |:-------------| 
| Description  | Application gives to the warehouse manager the possibility to handle rejections of items/orders notified by the quality office |
| Precondition | Warehouse and warehouse manager profile are defined |
|              | A set of items / an order is rejected by the quality office |
| Postcondition | Application submits the rejection to the supplier |
| Step#        |  Step description   |
|  1           | User navigates to the notifications section |  
|  2           | Application displays a list of the tests outcomes |
|  3           | User clicks to the reject button |
|  4           | Application submits the rejection request to the supplier |

# Use case 7, Manage internal orders (FR7)

| Actors Involved     | OU supply manager, warehouse manager, warehouse employee |
| -------------       |        :-------------:			| 
|  Precondition       | The OU supply manager is able to see the items held in the warehouse through the application |
|  Post condition     | The internal order is sent             |
|		              |	The order is accepted 		 	|
|		              |	The order is declined 		 	|
|  Nominal Scenario(s)   |7.1, 7.2, 7.3,                        |
| Variants            |7.4, 7.5	7.6				|
| Execptions	      |	/		| 
		      
## Relevant scenarios for UC7:

###  Scenario 1 [NOMINAL]
| Scenario ID: S7.1         | Corresponds to UC7  |
| ------------- |:-------------| 
| Description 	| OU supply manager requests an order to the warehouse manager|
| Precondition 	| The OU supply manager needs some items |
| Postcondition | Warehouse manager receives an internal order |
| Step#         | Step description |
|  1            | The OU supply manager navigates to the Manage orders section and adds an order |  
|  2            | The list of available items in the warehouse is shown |
|  3	        | Items that needs to be added to the order are selected |
|  4 	        | The OU supply manager submits the order |
|  5            | A notification that an internal order has been received is sent to the warehouse manager |

###  Scenario 2 [NOMINAL]
| Scenario ID: S7.2         | Corresponds to UC7  |
| ------------- | :-------------| 
| Description 	| Order is accepted |
| Precondition 	| An Internal Order has been received by the warehouse manager  |
| Postcondition | Order Status changes from "Pending" to "Accepted" |
| Step#         |  Step description   |
|  1            | The warehouse manager opens the notifications section |  
|  2            | The list of pending orders is shown |
|  3 	        | The order is accepted by clicking in the "accept order" button |
|  4 	        | The warehouse manager selects the destination pick up area |
|  5            | A notification that an internal order has to be delivered is sent to the warehouse employee |

###  Scenario 3 [NOMINAL]
| Scenario ID: S7.3         | Corresponds to UC7  |
| ------------- | :-------------| 
| Description 	| Order is declined |
| Precondition 	| An Internal Order has been received by the warehouse manager  |
| Postcondition | Order Status changes from "Pending" to "Declined" |
| Step#         |  Step description   |
|  1            | The warehouse manager opens the notifications section |  
|  2            | The list of pending orders is shown |
|  3 	        | The order is accepted by clicking in the "decline order" button |
|  5            | A notification is sent to the OU supply manager with the reason of the rejection |

###  Scenario 4 [VARIANT]
| Scenario ID: S7.4         | Corresponds to UC7  |
| ------------- | :-------------| 
| Description 	| Order is accepted by the warehouse manager, but not actually delivered (by the warehouse employee) for too long |
| Precondition 	| An Internal Order has been accepted by the warehouse manager  |
| Postcondition | The delivery order is resent to the warehouse employee |
| Step#         |  Step description   |
|  1            | The warehouse manager opens the notifications section |
|  2            | The order that exceeded the timeout threshold (accepted but not delivered for too long) |
|  3	        | The warehouse manager resends the delivery task to the warehouse employee |

###  Scenario 5 [VARIANT]
| Scenario ID: S7.5         | Corresponds to UC7  |
| ------------- | :-------------| 
| Description 	| Order is accepted by the warehouse manager, but due to internal issues items involved are no longer available |
| Precondition 	| An Internal Order has been accepted by the warehouse manager  |
| Postcondition | The order is cancelled |
| Step#         |  Step description   |
|  1            | The warehouse manager opens the notifications section |  
|  2	        | The warehouse manager manually deletes the order if issues occurred |
|  3            | A notification is sent to the OU supply manager with the reason of the rejection |

###  Scenario 6 [VARIANT]
| Scenario ID: S7.6         | Corresponds to UC7  |
| ------------- | :-------------| 
| Description 	| Application lets the OU supply manager modify a pending order|
| Precondition 	| An Internal Order has been sent to the warehouse manager but not accepted or declined yet |
| Postcondition | The order is modified |
| Step#         | Step description |
|  1            | The OU supply manager open the orders list |
|  2	        | The OU clicks on "edit order" button |
|  4            | Adds new items and removes items not needed anymore |
|  5            | Changes are saved by clicking on the "Modify" button |

# Use case 8, Delivery internal orders (FR8)

| Actors Involved     | Warehouse employee	|
| -------------       |        :-------------:			| 
|  Precondition       | There is an internal order to be delivered |
|  Post condition     | List of internal orders is shown  |
|		              |	An order is completed    |
|		              |	An order is removed from the list ?	|
|  Nominal Scenario(s)   |  8.1, 8.2				|
| Variants            | 8.3|
| Exceptions | / |

## Relevant scenarios for UC8:		      

###  Scenario 1 [NOMINAL]
| Scenario ID: S8.1         | Corresponds to UC8  |
| ------------- |:-------------| 
| Description 	| The list of internal orders is shown to the warehouse employee |
| Precondition 	| User is logged in as warehouse employee |
| Postcondition |  List of all orders is shown  |
| Step#         |  Step description   |
|  1            | The warehouse employee clicks to visualize the internal orders|  
|  2            | The list of internal orders is shown |

###  Scenario 2  [NOMINAL]
| Scenario ID: S8.2         | Corresponds to UC8  |
| ------------- |:-------------| 
| Description | An order delivery is confirmed |
| Precondition| User is logged in as warehouse employee|
| Postcondition| The selected delivery status changes from accepted to delivered  |
| Step#        | Step description   |
|  1           | The warehouse employee clicks to visualize the internal orders|  
|  2           | The list of internal orders is shown |
|  3	       | The warehouse employee selects the order to be delivered |
|  4 	       | The order becomes marked as delivered |

###  Scenario 3  [VARIANT]
| Scenario ID: S8.3         | Corresponds to UC8  |
| ------------- |:-------------| 
| Description | The warehouse employee tries to visualize the internal orders but the list is empty |
| Precondition| User is logged in as warehouse employee but there are no orders in the list|
| Postcondition| Application shows an empty list or only previously delivered orders |
| Step#        |  Step description   |
|  1           | The warehouse employee clicks to visualize the internal orders |  
|  2           | Application shows an empty list or only previously delivered orders |



# Glossary

![context_diagram](/requirements_images/glossary.PNG)

# System Design

Not really meaningful in this case.  Only software components are needed.

# Deployment Diagram 

The EzWh Software is installed on company PCs that are clients which reach the local company server through the company intranet to retrieve the data, thanks to an EzWh DB saved on the local server.

![context_diagram](/requirements_images/Deployment_Diagram_EzWH.png)








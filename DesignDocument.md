# Design Document 


Authors: Simone Mascali, Alessandro Vancini, Alessandro Giaccaglini, Benito Marra

Date: 27/04/2022

Version: 1.0


# Contents

- [High level design](#high-level-design)
- [Low level design](#low-level-design)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs

# High level design 

Architectural pattern: MVC

```plantuml
package EZWh <<Folder>>{

}
package EZWhGUI <<Folder>>{

}
package EZWhData <<Folder>>{


}
package EZWhExceptions <<Folder>>{

}
EZWh <|-- EZWhData
EZWh <|-- EZWhGUI
EZWh <|-- EZWhExceptions
```


# Low level design


![low_level_diagram](/design_images/LowLevelDesign.PNG)




# Verification traceability matrix

| FR  | EZWarehouse | User  | Position | Restock Order | Return Order | Internal Order | RestockOrderService, ReturnOrderService, InternalOrderService | SkuService, SkuItemService, PositionService, ItemService | TestDescriptorService, TestResultService | UserService |  Sku  | Sku item | Supplier Item | Test Result | Test Descriptor |
| --- | :---------: | :---: | :------: | :-----------: | :----------: | :------------: | :--------------: | :------------------: | :--------------------------------------: | :-------------: | :---: | :------: | :-----------: | :---------: | :-------------: |
| FR1 |      x      |   x   |          |               |              |                |                  |                      |                                          |        x        |       |          |               |             |                 |
| FR2 |      x      |       |    x     |               |              |                |                  |          x           |                                          |                 |   x   |          |               |             |        x        |
| FR3 |      x      |       |    x     |               |              |                |                  |          x           |        x                                 |                 |   x   |          |               |             |        x        |
| FR4 |      x      |   x   |          |               |              |                |                  |                      |                                          |                 |       |          |               |             |                 |
| FR5 |      x      |       |          |       x       |       x      |                |        x         |                      |                                          |                 |   x   |     x    |       x       |      x      |        x        |
| FR6 |      x      |   x   |          |               |              |       x        |                  |                      |                                          |                 |   x   |     x    |               |             |                 |
| FR7 |      x      |   x   |          |               |              |                |                  |                      |                                          |                 |       |          |       x       |             |                 |









# Verification sequence diagrams 

- Scenario 1-1

```plantuml

actor Manager
Manager --> EzWarehouse  : API CALL(/api/sku)


EzWarehouse  -> SkuService: createSKU()

SkuService  -> SkuDB : createSKU()

SkuDB -> EzWhDB.sqlite : QUERY CREATE SKU

```
- Scenario 2-2

```plantuml


actor Manager
Manager --> EzWarehouse  : API CALL(/api/position)


EzWarehouse  -> PositionService: createPosition()

PositionService-> PositionDB : createPosition()

PositionDB -> EzWhDB.sqlite : QUERY CREATE POSITION

```

- Scenario 4-1

```plantuml
actor Manager
Manager --> EzWarehouse  : API CALL(/api/newUser)


EzWarehouse  -> UserService: createUser()

UserService-> UserDB : createUser()

UserDB -> EzWhDB.sqlite : QUERY CREATE USER

```


- Scenario 7-1

```plantuml

actor User
User--> EzWarehouse  : API CALL(/api/customerSession)


EzWarehouse  -> UserService: getUserByEmailAndPassword()

UserService-> UserDB : getUserByEmailAndPassword()

UserDB -> EzWhDB.sqlite : QUERY SELECT USER

UserDB <- EzWhDB.sqlite : return User (if found)

UserDB -> UserService: return User (if found)

UserService -> EzWarehouse : return user (if found)


```


- Scenario 11-1

```plantuml

actor Supplier
Supplier --> EzWarehouse  : API CALL(/api/item)


EzWarehouse  -> ItemService: createItem()

ItemService -> ItemDB : createItem()

ItemDB -> EzWhDB.sqlite : QUERY CREATE ITEM

```

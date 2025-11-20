# Integration and API Test Report

Date: 25/05/2022

Version: 1.0

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

```plantuml
digraph dependencyGraph {
 GUI -> API ;
 API -> ReturnOrderService;
 API -> InternalOrderService ;
 API -> UserService ;
 API -> RestockOrderService ;
 API -> ItemService ;
 API -> SkuService;
 API -> SkuItemService;
 API -> PositionService;
 API -> TestResultService;
 API -> TestDescriptorService;

 ReturnOrderService -> ReturnOrderDB ;
 InternalOrderService -> InternalOrderDB ;
 UserService -> UserDB;
 RestockOrderService -> RestockOrderDB;
 ItemService -> ItemDB;
 SkuService -> SkuDB ;
 SkuItemService -> SkuItemDB ;
 PositionService -> PositionDB;
 TestResultService -> TestResultDB;
 TestDescriptorService -> TestDescriptorDB ;

ReturnOrderDB -> ReturnOrder;
ReturnOrderDB -> Product_Return;
InternalOrderDB -> InternalOrder;
InternalOrderDB -> Product;
InternalOrderDB -> Product_Return;
UserDB -> User;
UserDB -> User_mapped;
RestockOrderDB -> RestockOrder;
RestockOrderDB -> Product;
RestockOrderDB -> Sku_Item_RestockOrder;
ItemDB -> Item;
SkuDB -> SKu;
SkuItemDB -> SkuItem;
PositionDB -> Position;
TestResultDB -> TestResult;
TestDescriptorDB -> TestDescriptor;
 
}
```
     
# Integration approach

    
    
We adopted a bottom up approach following the steps reported below:

Step 1 - We implemented the unit tests on the DB functions

Step 2 - We implemented the integration tests of the Service functions directly using the previously unit tested DB functions, because
	the application logic was initially implemented mostly in the APIs, hence making the mocking of the DB for services unit tests unnecessary.

Step 3 - We implemented the API tests integrating the entire modules

#  Integration Tests

## Step 1
| Classes |Jest test cases |
|--|--|
| InternalOrderDB | db_internalOrder.test.js -> Internal Order - DB test (testCreateInternalOrder(), testCreateSkuItemToInternal(), testAddSkuItemToSkuInternalTable(), testGetInternalOrderList(), testGetInternalOrderbyID(), testGetsingleProductsCompletedtoInternalOrder(), testGetProductsIssuedtoInternalOrder(), testGetProductsCompletedtoInternalOrder(), testUpdateInternalOrderState(), testDeleteInternalOrderByID(), testDeleteSkuToInternalItem()) |
| ItemDB | db_item.test.js -> Item - DB test (testNewItem(), testGetItemList(), testGetSpecific(), testGetSpecific2(), testUpdateItem(), testDeleteItem()) |
| PositionDB | db_position.test.js -> Position - DB test (testNewPosition(), testGetPositions(), testUpdatePosition(), testUpdatePositionOccupiedValues(), testDeletePosition()) |
| RestockOrderDB | db_restockOrder.test.js -> Restock Order - DB test (getRestockOrderList(), testNewRestockOrder(), testGetRestockOrderByID(), testAddSkuItemToskuRestockTable(), testAddSkuItemToSkuItemToRestockTable(), testAddProductsToOrder(), testNumberGetSkuItemsToRestockOrder(), testContentGetSkuItemsToRestockOrder(), testUpdateRestockOrderState(), testUpdateRestockOrderTransportNote(), testDeleteRestockOrderByID()) |
| ReturnOrderDB | db_returnOrder.test.js -> Return Order - DB test (testNewReturnOrder(), testAddSkuItemToskuReturnTable(), testGetReturnOrderByID(), testNumberGetProductsToReturnOrderByID(), testContentGetProductsToReturnOrderByID(), testDeleteReturnOrderByID()) |
| SkuDB | db_sku.test.js -> SKU  - DB test (testCreateSku(), testGetSkuList(), testGetSkuByID(), testUpdateSku(), testUpdateSkuPosition(), testDeleteSkuByID()) |
| SkuItemDB | db_skuItem.test.js -> SKU Item - DB test (testCreateSkuItem(), testGetSkuItemList(), testGetSkuItemListBySkuID(), testGetSkuItemByRFID() testUpdateSkuItem(), testDeleteSkuItemByRFID) |
| TestDescriptorDB | db_testDescriptor.test.js -> Test Descriptor - DB test (testNewTestDescriptor(), testGetTestDescriptorByID(), testGetTestDescriptorListBySKUId(), testUpdateTestDescriptor(), testDeleteTestDescriptor()) |
| TestResultDB | db_testResult.test.js -> Test Result - DB test (testNewTestResult(), testGetTestResultByIDandRFID(), testGetTestResultListByRFID(), testUpdateTestResult(), testDeleteTestResult()) |
| UserDB | db_user.test.js -> USER - DB test (testCreateUser(), testGetUserInfo(), testSupplierList(), testUserList(), testGetUserByEmailAndPassword(), testGetUserByEmailAndType(), testUpdateUser(), testDeleteUser()) |


## Step 2
| Classes |Jest test cases |
|--|--|
| InternalOrderService | dbreal_internalOrderService.test.js -> Internal Order Service - DB test (testCreateInternalOrder(), testCreateSkuItemToInternal(), testAddSkuItemToSkuInternalTable(), testGetInternalOrderList(), testGetInternalOrderbyID(), testGetsingleProductsCompletedtoInternalOrder(), testGetProductsIssuedtoInternalOrder(), testGetProductsCompletedtoInternalOrder(), testUpdateInternalOrderState(), testDeleteInternalOrderByID(), testDeleteSkuToInternalItem()) |
| ItemService | dbreal_itemService.test.js -> Item Service - DB test (testNewItem(), testGetItemList(), testGetSpecific(), testGetSpecific2(), testUpdateItem(), testDeleteItem()) |
| PositionService | dbreal_positionService.test.js -> Position Service - DB test (testNewPosition(), testGetPositions(), testUpdatePosition(), testUpdatePositionOccupiedValues(), testDeletePosition()) |
| RestockOrderService | dbreal_restockOrderService.test.js -> Restock Order Service - DB test (getRestockOrderList(), testNewRestockOrder(), testGetRestockOrderByID(), testAddSkuItemToskuRestockTable(), testAddSkuItemToSkuItemToRestockTable(), testAddProductsToOrder(), testNumberGetSkuItemsToRestockOrder(), testContentGetSkuItemsToRestockOrder(), testUpdateRestockOrderState(), testUpdateRestockOrderTransportNote(), testDeleteRestockOrderByID()) |
| ReturnOrderService | dbreal_returnOrderService.test.js -> Return Order Service - DB test (testNewReturnOrder(), testAddSkuItemToskuReturnTable(), testGetReturnOrderByID(), testNumberGetProductsToReturnOrderByID(), testContentGetProductsToReturnOrderByID(), testDeleteReturnOrderByID()) |
| SkuService | dbreal_skuService.test.js -> SKU Service - DB test (testCreateSku(), testGetSkuList(), testGetSkuByID(), testUpdateSku(), testUpdateSkuPosition(), testDeleteSkuByID()) |
| SkuItemService | dbreal_skuItemService.test.js -> SKU Item Service - DB test (testCreateSkuItem(), testGetSkuItemList(), testGetSkuItemListBySkuID(), testGetSkuItemByRFID() testUpdateSkuItem(), testDeleteSkuItemByRFID) |
| TestDescriptorService | dbreal_testDescriptorService.test.js -> Test Descriptor Service - DB test (testNewTestDescriptor(), testGetTestDescriptorByID(), testGetTestDescriptorListBySKUId(), testUpdateTestDescriptor(), testDeleteTestDescriptor()) |
| TestResultService | dbreal_testResultService.test.js -> Test Result Service - DB test (testNewTestResult(), testGetTestResultByIDandRFID(), testGetTestResultListByRFID(), testUpdateTestResult(), testDeleteTestResult()) |
| UserService | dbreal_userService.test.js -> USER Service - DB test (testCreateUser(), testGetUserInfo(), testSupplierList(), testUserList(), testGetUserByEmailAndPassword(), testGetUserByEmailAndType(), testUpdateUser(), testDeleteUser()) |


## Step 3
| Classes | Mocha test cases |
|--|--|
| internalOrderAPIs | testInternalOrderRouter.js -> Test InternalOrder Api (newInternalOrder(), updateInternalOrderState(), getInternalOrderList(), getInternalOrderIssued(), getInternalOrderAccepted(), getInternalOrderByID(), deleteInternalOrder()) |
| itemAPIs          | testItemRouter.js -> Test Item Api (newItem(), getItemList(), getItemByID(), updateItem(), deleteItem()) |
| posistionAPIs     | testPositionRouter.js -> Test Position Api (newPosition(), getPositionList(), updatePosition(), updatePositionID(), deletePosition()) |
| restockOrderAPIs  | testRestockOrderRouter.js -> Test RestockOrder Api (newRestockOrder(), updateRestockOrderState(), updateRestockOrderTransportNote(), updateRestockOrderSkuItems(), getRestockOrderList(), getRestockOrderIssued(), getRestockOrderByID(), deleteRestockOrder()) |
| returnOrderAPIs   | testReturnOrderRouter.js -> Test ReturnOrder Api (newReturnOrder(), getReturnOrderList(), getReturnOrderByID(), deleteReturnOrder())|
| skuAPIs           | testSkuRouter.js -> Test SkuItem Apis (newSkuItem(), getSkuItemList(), getSkuItemByRFID(), getSkuItemBySkuID(), updateSkuItem(), deleteSkuItem()) |
| skuItemAPIs       | testSkuItemRouter.js -> Test SKUs Api (newSku(), getSkuList(), getSkuByID(), updateSku(), updateSkuPosition(), deleteSku())|
| testDescriptorAPIs| testTestDescriptorRouter.js -> Test TestDescriptor Api (newTestDescriptor(), getTestDescriptorList(), getTestDescriptorByID(), updateTestDescriptor(), deleteTestDescriptor())|
| testResultAPIs    | testTestResultRouter.js -> Test TestResult Api (newTestResult(), getTestResultList(), getTesResultByID(), updateTestResult(), deleteTestResult()) |
| userAPIs          | testUserRouter.js -> Test User Api (newUser(), getUserList(), getSupplierList(), updateUser(), deleteUser()) |



# Coverage of Scenarios and FR




| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
|  1.1        | FR2.1                                       | newSku() |
|  1.2        | FR2.1                                       | updateSkuPosition(), updateSku() |
|  1.3        | FR2.1                                       | updateSku()            |             
|  2.1        | FR3.1.1,FR3.1.4                             | newPosition()            |             
|  2.2        | FR3.1.1,FR3.1.4                             | updatePosition()            |             
|  2.3        | FR3.1.1,FR3.1.4                             | updatePosition()           |           
|  2.4        | FR3.1.1,FR3.1.4                             | updatePosition()            |
|  2.5        | FR3.1.2                                     | deletePosition()           |
|  3.1        | FR5.1,FR5.3,FR5.5,FR5.6,FR5.5               | newRestockOrder()            |
|  3.2        | FR5.1,FR5.3,FR5.5,FR5.6,FR5.5               | newRestockOrder()             |
|  4.1        | FR1.1,FR1.5                                 | newUser()            |
|  4.2        | FR1.4,FR1.5                                 | updateUser()            |
|  4.3        | FR1.2,FR1.4                                 | deleteUser()            |             
|  5.1.1      | FR5.8.1,FR5.8.3,FR5.7                       | updateRestockOrderSkuItems(),updateRestockOrderState()           |
|  5.2.1      | FR5.7,FR5.8.2,FR3.2.1                       | newTestResult(),updateRestockOrderState()          |
|  5.2.2      | FR5.7,FR5.8.2,FR3.2.1                       | newTestResult(),updateRestockOrderState()           |
|  5.2.3      | FR5.7,FR5.8.2,FR3.2.1                       | newTestResult(),updateRestockOrderState()           |    
|  5.3.1      | FR5.10,FR3.1.4,FR2.1,FR5.7                  | updateRestockOrderSkuItems(),updateSku(),updatePosition(),updateRestockOrderState()              |    
|  5.3.2      | FR5.10,FR5.7                                | updateRestockOrderState()            |    
|  5.3.3      | FR5.10,FR3.1.4,FR2.1,FR5.7                  | updateRestockOrderSkuItems(),updateSku(),updatePosition(),updateRestockOrderState()            |    
|  6.1        | FR5.9,FR5.10,FR5.11                         |  newReturnOrder(),addSkuItemToSkuReturnTable()           |    
|  6.2        | FR5.9,FR5.10,FR5.11,FR2.1,FR3.1.4           |  newReturnOrder(),addSkuItemToSkuReturnTable(),updateSku(),updatePosition()            |            
|  7.1        | FR1.5                                       | loginUser()            |
|  7.2        | FR1.5                                       | logout()            |
|  9.1        | FR6.1,FR6.2,FR6.3,FR6.5,FR6.7,FR2.1,FR3.1.4,FR6.6                | newInternalOrder(),updateInternalOrderState(),, updateSku(),updatePosition()           |
|  9.2        | FR6.1,FR6.2,FR6.3,FR6.5,FR6.7,FR2.1,FR3.1.4,FR6.6                |  newInternalOrder(),updateInternalOrderState(),, updateSku(),updatePosition()           |
|  9.3        | FR6.1,FR6.2,FR6.3,FR6.5,FR6.7,FR2.1,FR3.1.4,FR6.6                |   newInternalOrder(),updateInternalOrderState(), updateSku(),updatePosition(),deleteInternalOrder()          |
|  10.1       | FR6.7,FR6.8,FR6.9,FR6.10                                         | updateInternalOrderState()          |
|  11.1       | FR7                                         |  newItem();           |
|  11.2       | FR7                                         |  updateItem();           | 
|  12.1       | FR3.2                                       |  newTestDescriptor();           | 
|  12.2       | FR3.2                                       |  updateTestDescriptor();          |
|  12.3       | FR3.2                                       |  deleteTestDescriptor();           |                  



# Coverage of Non Functional Requirements


### 

| Non Functional Requirement | Jest Test name |
| ----------- | ------------------------------- |
|       NFR4                     |     test_is_position_valid(), test_is_position_id_valid()      |
| NFR6 | test_is_RFID_valid(); |
|     NFR9                       |   test_validate_date()        |



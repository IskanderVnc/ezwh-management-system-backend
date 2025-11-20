# Unit Testing Report

Date: 25/05/2022

Version: 1.0

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

 ### **Class *UserDB* - method *getUserList***

**Criteria for method *getUserList*:**

 -  Users presence 

**Predicates for method *getUserList*:**

| Criteria | Predicate |
| -------- | --------- |
|  Users presence  |    users are present    |
|                  |     users are not present      |

**Combination of predicates**:

| Users presence | Valid / Invalid | Description of the test case | Jest test case |
|----------------|-----------------|------------------------------|----------------|
| users are present | V | T1() -> list of users | db_user.test.js -> testUserList() |
| users are not present| V | T2() -> empty list of users | db_user.test.js -> testUserList() |

 ### **Class *UserDB* - method *getSupplierList***

**Criteria for method *getSupplierList*:**

 -  Suppliers presence 

**Predicates for method *getSupplierList*:**

| Criteria | Predicate |
| -------- | --------- |
|  Suppliers presence    |     suppliers are present      |
|                        |     suppliers are not present      |

**Combination of predicates**:

| Suppliers presence | Valid / Invalid | Description of the test case | Jest test case |
|----------------|-----------------|------------------------------|----------------|
| suppliers are present | V | T1() -> list of suppliers | db_user.test.js -> testSupplierList() |
| suppliers are not present| V | T2() -> empty list of suppliers | db_user.test.js -> testSupplierList() |

 ### **Class *UserDB* - method *getUserInfo***

**Criteria for method *getUserInfo*:**

 - username is a valid username

**Predicates for method *getUserInfo*:**

| Criteria | Predicate |
| -------- | --------- |
| username is a valid username  |     username exists      |
|                               |      username doesn't exist      |
**Combination of predicates**:

| username is a valid username | Valid / Invalid | Description of the test case | Jest test case |
|------------------------------|-----------------|------------------------------|----------------|
| username exists              | V               | T1("john@gmail.com") -> return userInfo (1, "john", "doe", "john@gmail.com", customer) | db_user.test.js -> testGetUserInfo() |
| username doesn't exists      | I               | T2("nonexisting@gmail.com") -> return undefined | db_user.test.js -> testGetUserInfo() |

 ### **Class *UserDB* - method *createUser***

**Criteria for method *createUser*:**

 - Validity of the user parameters

**Predicates for method *createUser*:**

| Criteria | Predicate |
| -------- | --------- |
|   Validity of the user parameters   |     valid parameters      |
|          |   invalid parameters   |

**Combination of predicates**:

| Validity of the user parameters | Valid / Invalid | Description of the test case | Jest test case |
|---------------------------------|-----------------|------------------------------|----------------|
| valid parameters                | V               | T1(new User(1, 'Marco', 'Rossi', 'mrossi@ezwh.com', 'testpassword', 'clerk')) -> return true | db_user.test.js -> testCreateUser() |
| invalid parameters                | I               | T2(new User(1, 'Marco', 'Rossi', undefined, 'testpassword', 'clerk')) -> return false | db_user.test.js -> testCreateUser() |

 ### **Class *UserDB* - method *deleteUser***

**Criteria for method *deleteUser*:**

 - User exists

**Predicates for method *deleteUser*:**

| Criteria | Predicate |
| -------- | --------- |
| User exists   |    user is present in the db     |
|               |  user is not present in the db   |

**Combination of predicates**:

| User exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|  user is present in the db | V | T1("mrossi@ezwh.com", "clerk") -> return true | db_user.test.js -> testDeleteUser() |
|  user is not present in the db | I | T2("notPresent@ezwh.com", "manager") -> return false | db_user.test.js -> testDeleteUser() |

 ### **Class *UserDB* - method *updateUser***

**Criteria for method *updateUser*:**

 - Update info are valid

**Predicates for method *updateUser*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update info are valid   |    valid new user info   |
|          |   invalid new user info        |

**Combination of predicates**:

| Update info are valid| Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid new user info | V | T1("mrossi@ezwh.com", "deliveryEmployee") -> return true | db_user.test.js -> testUpdateUser() |
| invalid new user info | I | T2("mrossi@ezwh.com", undefined) -> return false | db_user.test.js -> testUpdateUser() |

 ### **Class *UserDB* - method *getUserByEmailAndType***

**Criteria for method *getUserByEmailAndType*:**

 - Email and type are valid

**Predicates for method *getUserByEmailAndType*:**

| Criteria | Predicate |
| -------- | --------- |
|  Email and type are valid  |  valid email and type    |
|          |  invalid email and type   |

**Combination of predicates**:

| Email and type are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid email and type  | V | T1("lverdi@ezwh.com", "supplier") -> return true | db_user.test.js -> testGetUserByEmailAndType() |
| invalid email and type  | I | T2("mrossi@ezwh.com", undefined) -> return false | db_user.test.js -> testGetUserByEmailAndType() |

 ### **Class *UserDB* - method *getUserByEmailAndPassword***

**Criteria for method *getUserByEmailAndPassword*:**

 - Email and password are correct

**Predicates for method *getUserByEmailAndPassword*:**

| Criteria | Predicate |
| -------- | --------- |
|  Email and password are correct  |  valid email and password   |
|          |    invalid email and password   |

**Combination of predicates**:

| Email and password are correct | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid email and password  | V | T1("lverdi@ezwh.com", "testpassword") -> return true | db_user.test.js -> testGetUserByEmailAndPassword() |
| invalid email and password  | I | T2("mrossi@ezwh.com", "wrongpassword") -> return false | db_user.test.js -> testGetUserByEmailAndPassword() |

 ### **Class *TestResultDB* - method *createTestResult***

**Criteria for method *createTestResult*:**

 - New test result prameters

**Predicates for method *createTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
|  New test result prameters  |  valid parameters  |
|          |    invalid parameters   |

**Combination of predicates**:

| New test result prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters                | V               | T1(new Test_Result(1, 1, "2022/08/15", true), RFID: "12345678901234567890123456789016") -> return true | db_testResult.test.js -> testNewTestResult() |
| invalid parameters                | I               | T2(new Test_Result(1, 1, "2022/08/15", true), RFID: undefined) -> return false | db_testResult.test.js -> testNewTestResult() |

 ### **Class *TestResultDB* - method *getTestResultByIdAndRFID***

**Criteria for method *getTestResultByIdAndRFID*:**

 - id and rfid are valid

**Predicates for method *getTestResultByIdAndRFID*:**

| Criteria | Predicate |
| -------- | --------- |
|  id and rfid are valid  |  valid id and rfid  |
|          |    invalid id but valid rfid   |
|          |    invalid rfid but valid id    |
|          |    invalid id and rfid   |

**Combination of predicates**:

| New test result prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid id and rfid               | V               | T1(1, "12345678901234567890123456789016") -> return { id: 1, idTestDescriptor : 1, Date : "2022/08/15", Result : true} | db_testResult.test.js -> testGetTestResultByIDandRFID() |
| invalid id but valid rfid       | I               | T2(4, "12345678901234567890123456789022") -> return undefined | db_testResult.test.js -> testGetTestResultByIDandRFID() |
| invalid rfid but valid id       | I               |  T3(2, "12345678901234567890123456789444") -> return undefined | db_testResult.test.js -> testGetTestResultByIDandRFID() |
| invalid id and rfid             | I               |  T4(4, "12345678901234567890123456789555") -> return undefined | db_testResult.test.js -> testGetTestResultByIDandRFID() |

 ### **Class *TestResultDB* - method *getTestResultListByRFID***

**Criteria for method *getTestResultListByRFID*:**

 - rfid is valid

**Predicates for method *getTestResultListByRFID*:**

| Criteria | Predicate |
| -------- | --------- |
|   rfid is valid  |  valid rfid  |
|                 |  invalid rfid  |

**Combination of predicates**:

|  rfid is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid rfid              | V               | T1("12345678901234567890123456789016") -> return testResultList | db_testResult.test.js -> testGetTestResultListByRFID() |
| invalid rfid       | V              | T2("12345678901234567890123456789444") -> return testResultList (but empty) | db_testResult.test.js -> testGetTestResultListByRFID() |

 ### **Class *TestResultDB* - method *deleteTestResult***

**Criteria for method *deleteTestResult*:**

 - Test result exists

**Predicates for method *deleteTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
| Test result exists   |    test result id exists     |
|               |  test result id doesn't exist   |

**Combination of predicates**:

| Test result exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|  test result id exists | V | T1(1) -> return true | db_testResult.test.js -> testDeleteTestResult() |
|  test result id doesn't exist | I | T2(72) -> return false | db_testResult.test.js -> testDeleteTestResult() |

 ### **Class *TestResultDB* - method *updateTestResult***

**Criteria for method *updateTestResult*:**

 - Update info are valid

**Predicates for method *updateTestResult*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update test result info are valid   |    valid update test info   |
|          |   invalid update test info        |

**Combination of predicates**:

|  Update test result info are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid update test info | V | T1(new Test_Result(1, 2, "2022/08/15", false), 1) -> return true | db_testResult.test.js -> testUpdateTestResult() |
| invalid update test info | I | T2(new Test_Result(3, 1, "2022/09/17", undefined), 4) -> return false | db_testResult.test.js -> testUpdateTestResult() |

 ### **Class *TestDescriptorDB* - method *createTestDescriptor***

**Criteria for method *createTestDescriptor*:**

 - New test descriptor prameters

**Predicates for method *createTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
|  New test descriptor prameters  |  valid parameters  |
|          |    invalid parameters   |

**Combination of predicates**:

| New test descriptor prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters                | V               | T1(new Test_Descriptor(1, "Test Descriptor 1", "Fake description of test", 1) -> return true | db_testDescriptor.test.js -> testNewTestDescriptor() |
| invalid parameters                | I               | T2(new Test_Descriptor(4, "Test Descriptor 3", "Fake description of test", undefined) -> catch error | db_testDescriptor.test.js -> testNewTestDescriptor() |

 ### **Class *TestDescriptorDB* - method *deleteTestDescriptor***

**Criteria for method *deleteTestDescriptor*:**

 - Test descriptor exists

**Predicates for method *deleteTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
| Test descriptor exists   |    test descriptor id exists     |
|               |  test descriptor id doesn't exist   |

**Combination of predicates**:

| Test result exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|  test descriptor id exists | V | T1(1) -> return true | db_testDescriptor.test.js -> testDeleteTestDescriptor() |
|  test descriptor id doesn't exist | I | T2(72) -> return false | db_testDescriptor.test.js -> testDeleteTestDescriptor() |

 ### **Class *TestDescriptorDB* - method *getTestDescriptorsListBySKUId***

**Criteria for method *getTestDescriptorsListBySKUId*:**

 - sku id is valid

**Predicates for method *getTestDescriptorsListBySKUId*:**

| Criteria | Predicate |
| -------- | --------- |
|   sku id is valid |  valid  sku id  |
|                 |  invalid  sku id  |

**Combination of predicates**:

|  sku id is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid  sku id              | V               | T1(1) -> return testDescriptorList | db_testDescriptor.test.js -> testGetTestDescriptorListBySKUId() |
| invalid  sku id      | V             | T2(43) -> return testDescriptorList (but empty) | db_testDescriptor.test.js -> testGetTestDescriptorListBySKUId() |

 ### **Class *TestDescriptorDB* - method *updateTestDescriptor***

**Criteria for method *updateTestDescriptor*:**

 - Update info are valid

**Predicates for method *updateTestDescriptor*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update test descriptor info are valid   |    valid update test info   |
|          |   invalid update test info        |

**Combination of predicates**:

|  Update test descriptor info are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid update test info | V | T1(new Test_Descriptor(1, "Modified Test Descriptor 1", "Fake description of test", 2) -> return true | db_testDescriptor.test.js -> testUpdateTestDescriptor() |
| invalid update test info | I | T2(new Test_Descriptor(3, "Modified Test Descriptor 3", "Fake description of test", undefined) -> return false | db_testDescriptor.test.js -> testUpdateTestDescriptor() |

 ### **Class *SkuItemDB* - method *createSkuItem***

**Criteria for method *createSkuItem*:**

 - New sku item prameters

**Predicates for method *createSkuItem*:**

| Criteria | Predicate |
| -------- | --------- |
|  New sku item prameters  |  valid parameters  |
|          |    invalid parameters   |

**Combination of predicates**:

| New sku item prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters                | V               | T1(new SkuItem("12345678901234567890123456789011", "3", "2021/11/28 11:45")) -> return true | db_skuItem.test.js -> testCreateSkuItem() |
| invalid parameters                | I               | T2(new SkuItem("12345678901234567890123456789013", undefined, "2021/11/29 16:42")) -> catch error | db_skuItem.test.js -> testCreateSkuItem() |

 ### **Class *SkuItemDB* - method *getSkuItemList***

**Criteria for method *getSkuItemList*:**

 -  Sku items presence 

**Predicates for method *getSkuItemList*:**

| Criteria | Predicate |
| -------- | --------- |
|  Sku items presence  |    Sku items are present    |
|                  |     Sku items are not present      |

**Combination of predicates**:

| Sku items presence | Valid / Invalid | Description of the test case | Jest test case |
|----------------|-----------------|------------------------------|----------------|
| Sku items are present | V | T1() -> list of sku items | db_skuItem.test.js -> testGetSkuItemList() |
| Sku items are not present| V | T2() -> empty list of sku items | db_skuItem.test.js -> testGetSkuItemList() |

 ### **Class *SkuItemDB* - method *getSkuItemListBySkuID***

**Criteria for method *getSkuItemListBySkuID*:**

 - sku id is valid

**Predicates for method *getSkuItemListBySkuID*:**

| Criteria | Predicate |
| -------- | --------- |
|   sku id is valid |  valid  sku id  |
|                 |  invalid  sku id  |

**Combination of predicates**:

|  sku id is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid  sku id              | V               | T1(1) -> return [{RFID: "12345678901234567890123456789012", SKUId: 1, Available: 0, DateOfStock: "2021/11/29 16:45",}, {...}, ...] | db_skuItem.test.js -> testGetSkuItemListBySkuID() |
| invalid  sku id      | V             | T2(43) -> return [] | db_skuItem.test.js -> testGetSkuItemListBySkuID() |

 ### **Class *SkuItemDB* - method *getSkuItemByRFID***

**Criteria for method *getSkuItemByRFID*:**

 - rfid is valid

**Predicates for method *getSkuItemByRFID*:**

| Criteria | Predicate |
| -------- | --------- |
|   rfid is valid |  valid  rfid  |
|                 |  invalid  rfid  |

**Combination of predicates**:

|  rfid is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid  rfid              | V               | T1('12345678901234567890123456789012') -> return { RFID: "12345678901234567890123456789012", SKUId: 1, Available: 0, DateOfStock: "2021/11/29 16:45" } | db_skuItem.test.js -> testGetSkuItemByRFID() |
| invalid  rfid      | I             | T2('12345678901234567890129856789018') -> return undefined | db_skuItem.test.js -> testGetSkuItemByRFID() |

 ### **Class *SkuItemDB* - method *updateSkuItem***

**Criteria for method *updateSkuItem*:**

 - Update info are valid

**Predicates for method *updateSkuItem*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update sku item info are valid   |    valid update sku item info   |
|          |   invalid update sku item info        |

**Combination of predicates**:

|  Update sku item info are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid update sku item info | V | T1(new SkuItem("12345678901234567890123456789012", '1', "2021/11/29 16:45", "12345678901234567890123456789012") -> return true | db_skuItem.test.js -> testUpdateSkuItem() |
| invalid update sku item info | I | T2(new SkuItem("12345678901234567890123456789013", undefined, "2021/11/29 16:42"), "12345678901234567890123456789013") -> return false | db_skuItem.test.js -> testUpdateSkuItem() |

 ### **Class *SkuItemDB* - method *deleteSkuItemByRFID***

**Criteria for method *deleteSkuItemByRFID*:**

 - Sku item exists

**Predicates for method *deleteSkuItemByRFID*:**

| Criteria | Predicate |
| -------- | --------- |
| Sku item exists   |   rfid exists     |
|               | rfid doesn't exist   |

**Combination of predicates**:

| Sku item exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|  rfid exists | V | T1('12345678901234567890123456789012') -> return true | db_skuItem.test.js -> testDeleteSkuItemByRFID() |
| rfid doesn't exist | I | T2('12345678901234567890129856789018') -> return false | db_skuItem.test.js -> testDeleteSkuItemByRFID() |

### **Class *SkuDB* - method *createSku***

**Criteria for method *createSku*:**

 - New sku prameters

**Predicates for method *createSku*:**

| Criteria | Predicate |
| -------- | --------- |
|  New sku prameters  |  valid parameters  |
|          |    invalid parameters   |

**Combination of predicates**:

| New sku prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters                | V               | T1(new Sku(undefined, "a sku", 90, 75, "first SKU", 30, 5.99)) -> return true | db_sku.test.js -> testCreateSku() |
| invalid parameters                | I               | T2(new Sku(undefined, "another sku", undefined, 55, "third SKU", 20, 14.99)) -> catch error | db_sku.test.js -> testCreateSku() |

### **Class *SkuDB* - method *getSkuList***

**Criteria for method *getSkuList*:**

 - skus presence

**Predicates for method *getSkuList*:**

| Criteria | Predicate |
| -------- | --------- |
|   skus presence |  skus are present  |
|                 |  skus are not present |

**Combination of predicates**:

|  skus presence  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| skus are present             | V               | T1() -> return [{id: 1, description: "a sku", weight: 90, volume: 75, notes: "first SKU", position: null, availableQuantity: 30, price: 5.99, testDescriptors: []}, {...}, ...] | db_sku.test.js -> testGetSkuList() |
| skus are not present    | V             | T2() -> return [] | db_sku.test.js -> testGetSkuList() |

 ### **Class *SkuDB* - method *getSkuByID***

**Criteria for method *getSkuByID*:**

 - sku id is valid

**Predicates for method *getSkuByID*:**

| Criteria | Predicate |
| -------- | --------- |
|  sku id is valid |  valid sku id  |
|                 |  invalid sku id  |

**Combination of predicates**:

| sku id is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid sku id              | V               | T1(1) -> return {id: 1, description: "a sku", weight: 90, volume: 75, notes: "first SKU", position: null, availableQuantity: 30, price: 5.99, testDescriptors: []} | db_sku.test.js -> testGetSkuByID() |
| invalid  sku id      | I             | T2(69) -> return undefined | db_sku.test.js -> testGetSkuByID() |

### **Class *SkuDB* - method *deleteSkuByID***

**Criteria for method *deleteSkuByID*:**

 - Sku item exists

**Predicates for method *deleteSkuByID*:**

| Criteria | Predicate |
| -------- | --------- |
|  sku id is valid |  valid sku id  |
|                 |  invalid sku id  |

**Combination of predicates**:

| Sku item exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|   valid sku id    | V | T1(1) -> return true | db_sku.test.js -> testDeleteSkuByID() |
| invalid  sku id  | I | T2(64) -> return false | db_sku.test.js -> testDeleteSkuByID() |

### **Class *SkuDB* - method *updateSku***

**Criteria for method *updateSku*:**

 - Update info are valid

**Predicates for method *updateSku*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update sku info are valid   |    valid update sku info   |
|          |   invalid update sku info        |

**Combination of predicates**:

|  Update sku info are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid update sku info | V | T1(new Sku(undefined, "a sku", 12, 98, "first SKU", 30, 5.99), 1) -> return true | db_sku.test.js -> testUpdateSku() |
| invalid update sku info | I | T2(new Sku(undefined, "a sku", undefined, 75, "first SKU", 30, 5.99), 2) -> catch error (not null field violated) | db_sku.test.js -> testUpdateSku() |

### **Class *SkuDB* - method *updateSkuPosition***

**Criteria for method *updateSkuPosition*:**

 - Update position is valid
 - Target sku id is valid

**Predicates for method *updateSkuPosition*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update position is valid   |    valid position   |
|          |   invalid position        |
|  Target sku id is valid  |    valid sku id   |
|          |   invalid sku id        |

**Combination of predicates**:

|  Update position is valid |  Target sku id is valid  | Valid / Invalid | Description of the test case | Jest test case |
|---------------------------|--------------------------|-----------------|------------------------------|----------------|
| valid position            |  invalid sku id          |      I          | T1(704, '800234523412') -> catch error (sku not found) | db_sku.test.js -> testUpdateSkuPosition() |
| valid position            |  valid sku id            |      V          | T2(1, '800234523412') -> return true | db_sku.test.js -> testUpdateSkuPosition() |
| invalid position          |  invalid sku id          |      I          | T3(704, undefined) -> catch error (invalid position, invalid sku id) | db_sku.test.js -> testUpdateSkuPosition() |
| invalid position          |  valid sku id            |      I          | T3(1, '999999999999') -> catch error (position not found) | db_sku.test.js -> testUpdateSkuPosition() |

### **Class *PositionDB* - method *createPosition***

**Criteria for method *createPosition*:**

 - New position prameters

**Predicates for method *createPosition*:**

| Criteria | Predicate |
| -------- | --------- |
|  New position prameters  |  valid parameters  |
|          |    invalid parameters   |

**Combination of predicates**:

| New position prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters                | V               | T1(new Position("800534543412", "8005", "3464", "3412", 1000, 1000, 120, 150)) -> return true | db_position.test.js -> testNewPosition() |
| invalid parameters                | I               | T2(new Position(undefined, "8012", "3454", "3416", 1000, 1000, 360, 500)) -> catch error (invalid position id) | db_position.test.js -> testNewPosition() |

### **Class *PositionDB* - method *getPositions***

**Criteria for method *getPositions*:**

 - positions presence

**Predicates for method *getPositions*:**

| Criteria | Predicate |
| -------- | --------- |
|   positions presence |  positions are present  |
|                 |  positions are not present |

**Combination of predicates**:

|  positions presence  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| positions are present             | V               | T1() -> return [{positionID: '800534543412', aisleID: '8005', row : '3454', col : '3412', maxWeight : 100, maxVolume : 100, occupiedWeight : 20,occupiedVolume : 20 }, {...}, ...] | db_position.test.js -> testGetPositions() |
| positions are not present    | V             | T2() -> return [] | db_position.test.js -> testGetPositions() |

### **Class *PositionDB* - method *deletePositionById***

**Criteria for method *deletePositionById*:**

 - Position exists

**Predicates for method *deletePositionById*:**

| Criteria | Predicate |
| -------- | --------- |
|  Position exists |  valid position id  |
|                 |  invalid position id  |

**Combination of predicates**:

| Position exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|   valid position id    | V | T1("800534643419") -> return true | db_position.test.js -> testDeletePosition() |
|  invalid  position id  | I | T2("999999999999") -> return false | db_position.test.js -> testDeletePosition() |

### **Class *PositionDB* - method *updatePosition***

**Criteria for method *updatePosition*:**

 - Update info are valid

**Predicates for method *updatePosition*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update info are valid   |    valid update position info   |
|          |   invalid update position info        |

**Combination of predicates**:

|  Update position info are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid update position info | V | T1(ew Position("800534643419", "8005", "3464", "3419", 1000, 1000, 120, 150), "800534543412") -> return true | db_position.test.js -> testUpdatePosition() |
| invalid update position info | I | T2(new Position("800534643442", "8005", "3464", "3442", 1000, 1000, 120, undefined), "") -> return false | db_position.test.js -> testUpdatePosition() |

### **Class *PositionDB* - method *updatePositionOccupiedValues***

**Criteria for method *updatePositionOccupiedValues*:**

 - Update values are valid

**Predicates for method *updatePositionOccupiedValues*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update values are valid   |    valid update position values   |
|          |   invalid update position values        |

**Combination of predicates**:

|  Update position values are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid update position values | V | T1(100, 100, "800534643419") -> return true | db_position.test.js -> testUpdatePositionOccupiedValues() |
| invalid update position values | I | T2(100, 100, "800534547777") -> return false | db_position.test.js -> testUpdatePositionOccupiedValues() |

### **Class *ItemDB* - method *createItem***

**Criteria for method *createItem*:**

 - New item prameters

**Predicates for method *createItem*:**

| Criteria | Predicate |
| -------- | --------- |
|  New item prameters  |  valid parameters  |
|          |    invalid parameters   |

**Combination of predicates**:

| New item prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters                | V               | T1(new Item(undefined, "desc1", 10.99, 1, 2)) -> return true | db_item.test.js -> testNewItem() |
| invalid parameters                | I               | T2(new Item(undefined, undefined, 13.99, 3, 2)) -> catch error (invalid field) | db_item.test.js -> testNewItem() |

### **Class *ItemDB* - method *getItemList***

**Criteria for method *getItemList*:**

 - items presence

**Predicates for method *getItemList*:**

| Criteria | Predicate |
| -------- | --------- |
|   items presence |  items are present  |
|                 |  items are not present |

**Combination of predicates**:

|  items presence  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| items are present             | V        | T1() -> return [{id: 1, description: "an item", price : 20.99, SKUId : 1, supplierID : 2}, {...}, ...] | db_item.test.js -> testGetItemList() |
| items are not present    | V             | T2() -> return [] | db_item.test.js -> testGetItemList() |

### **Class *ItemDB* - method *deleteItemByID***

**Criteria for method *deleteItemByID*:**

 - item exists

**Predicates for method *deleteItemByID*:**

| Criteria | Predicate |
| -------- | --------- |
|  item exists |  valid item id  |
|                 |  invalid item id  |

**Combination of predicates**:

| item exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|   valid item id    | V | T1(1) -> return true | db_item.test.js -> testDeleteItem() |
|  invalid  item id  | I | T2(74) -> return false | db_item.test.js -> testDeleteItem() |

### **Class *ItemDB* - method *updateItem***

**Criteria for method *updateItem*:**

 - Update info are valid

**Predicates for method *updateItem*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update info are valid   |    valid update item info   |
|          |   invalid update item info        |

**Combination of predicates**:

|  Update item info are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid update item info | V | T1(new Item(undefined, "desc1 modificata", 210.99, 1, 2), 1) -> return true | db_item.test.js -> testUpdateItem() |
| invalid update item info | I | T2(new Item(undefined, undefined, 13.99, 3, 2), 2) -> return false | db_item.test.js -> testUpdateItem() |

### **Class *ItemDB* - method *getIfSupplierSellItem***

**Criteria for method *getIfSupplierSellItem*:**

 - Sku id and supplierID are valid

**Predicates for method *getIfSupplierSellItem*:**

| Criteria | Predicate |
| -------- | --------- |
|  Sku id and supplierID are valid   |    valid Sku id and supplierID   |
|          |   invalid Sku id and supplierID        |

**Combination of predicates**:

|  Sku id and supplierID are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Sku id and supplierID | V | T1(2, 1) -> return true | db_item.test.js -> testGetSpecific() |
| invalid Sku id and supplierID | I | T2(2, 754) -> return false | db_item.test.js -> testGetSpecific() |

### **Class *ItemDB* - method *getIfSupplierSellItem2***

**Criteria for method *getIfSupplierSellItem2*:**

 - Item id and supplierID are valid

**Predicates for method *getIfSupplierSellItem2*:**

| Criteria | Predicate |
| -------- | --------- |
|  Item id and supplierID are valid   |    valid Item id and supplierID   |
|          |   invalid Item id and supplierID        |

**Combination of predicates**:

|  Item id and supplierID are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Item id and supplierID | V | T1(2, 1) -> return true | db_item.test.js -> testGetSpecific2() |
| invalid Item id and supplierID | I | T2(2, 754) -> return false | db_item.test.js -> testGetSpecific2() |

### **Class *ReturnOrderDB* - method *createReturnOrder***

**Criteria for method *createReturnOrder*:**

 - New return order prameters

**Predicates for method *createReturnOrder*:**

| Criteria | Predicate |
| -------- | --------- |
|  New return order prameters  |  valid parameters  |
|          |    invalid parameters   |

**Combination of predicates**:

| New return order prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters                | V         | T1(new Return_Order(1, "2022/03/29 09:30", 1, [])) -> return true | db_returnOrder.test.js -> testNewReturnOrder() |
| invalid parameters                | I       | T2(new Return_Order(4, "2022/06/05 18:23", undefined, undefined)) -> catch error (invalid field/s) | db_returnOrder.test.js -> testNewReturnOrder() |

### **Class *ReturnOrderDB* - method *deleteReturnOrderById***

**Criteria for method *deleteReturnOrderById*:**

 - Return order exists

**Predicates for method *deleteReturnOrderById*:**

| Criteria | Predicate |
| -------- | --------- |
|  Return order exists |  valid Return order id  |
|                 |  invalid Return order id  |

**Combination of predicates**:

| Return order exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|   valid Return order id    | V | T1(1) -> return true | db_returnOrder.test.js -> testDeleteReturnOrderByID() |
|  invalid  Return order id  | I | T2(753) -> return false | db_returnOrder.test.js -> testDeleteReturnOrderByID() |

 ### **Class *ReturnOrderDB* - method *getReturnOrderbyId***

**Criteria for method *getReturnOrderbyId*:**

 - Return order id is valid

**Predicates for method *getReturnOrderbyId*:**

| Criteria | Predicate |
| -------- | --------- |
|  Return order id is valid |  valid Return order id  |
|                 |  invalid Return order id  |

**Combination of predicates**:

| Return order id is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Return order id              | V        | T1(1) -> return {id: 1, returnDate: "2022/04/15 11:46", products: [], restockOrderId: 3 } | db_returnOrder.test.js -> testGetReturnOrderByID() |
| invalid  Return order id      | I             | T2(69) -> return undefined | db_returnOrder.test.js -> testGetReturnOrderByID() |

### **Class *ReturnOrderDB* - method *getReturnOrderList***

**Criteria for method *getReturnOrderList*:**

 - Return orders presence

**Predicates for method *getReturnOrderList*:**

| Criteria | Predicate |
| -------- | --------- |
|   Return orders presence |  Return orders are present  |
|                 |  Return orders are not present |

**Combination of predicates**:

|  Return orders presence  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| Return orders are present        | V        | T1() -> return [{id: 1, description: "an item", price : 20.99, SKUId : 1, supplierID : 2}, {...}, ...] | db_returnOrder.test.js |
| Return orders are not present    | V             | T2() -> return [] | db_returnOrder.test.js |

### **Class *ReturnOrderDB* - method *getProductstoReturnOrder***

**Criteria for method *getProductstoReturnOrder*:**

 - Return order id is valid

**Predicates for method *getProductstoReturnOrder*:**

| Criteria | Predicate |
| -------- | --------- |
|  Return order id is valid |  valid Return order id  |
|                 |  invalid Return order id  |

**Combination of predicates**:

|  Return order id is valid  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Return order id        | V        | T1(returnOrderID: 1, expectedNumberOfProducts: 2) -> return list of 2 products | db_returnOrder.test.js -> testNumberGetProductsToReturnOrderByID() |
| valid Return order id   | V             | T2(returnOrderID: 3, expectedNumberOfProducts: 0) -> return empty list | db_returnOrder.test.js -> testNumberGetProductsToReturnOrderByID() |
| invalid Return order id    | V          | T3(returnOrderID: 476, expectedNumberOfProducts: 0) -> return empty list | db_returnOrder.test.js -> testNumberGetProductsToReturnOrderByID() |

### **Class *ReturnOrderDB* - method *addSkuItemToSkuReturnTable***

**Criteria for method *addSkuItemToSkuReturnTable*:**

 - Product RFID is valid

**Predicates for method *addSkuItemToSkuReturnTable*:**

| Criteria | Predicate |
| -------- | --------- |
|   Product RFID is valid | valid product RFID  |
|                 |  invalid product RFID |

**Combination of predicates**:

|  Product RFID is valid  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid product RFID  | V | T1(new Product_Return(1, "product 1", 9.99, "12345678901234567890123456789011"), returnOrderID : 1) -> return true | db_returnOrder.test.js -> testAddSkuItemToskuReturnTable() |
| valid product RFID  | V | T2(new Product_Return(2, "product 2", 13.99, "12345678901234567890123456789012"), returnOrderID : 1) -> return true | db_returnOrder.test.js -> testAddSkuItemToskuReturnTable() |
| valid product RFID  | V | T3(new Product_Return(2, "product 3", 16.99, "12345678901234567890123456789013"), returnOrderID : 2) -> return true | db_returnOrder.test.js -> testAddSkuItemToskuReturnTable() |
| invalid product RFID | I | T2(new Product_Return(4, "product 5", 12.99, "12345678901234567890123456789013"), returnOrderID : 2) -> catch error (invalid product RFID (duplicated)) | db_returnOrder.test.js -> testAddSkuItemToskuReturnTable() |

### **Class *RestockOrderDB* - method *createRestockOrder***

**Criteria for method *createRestockOrder*:**

 - New restock order prameters

**Predicates for method *createRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
|  New restock order prameters  |  valid parameters  |
|          |    invalid parameters   |

**Combination of predicates**:

| New restock order prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters                | V         | T1(new Restock_Order(1, "2022/03/29 09:30", "DELIVERED", 1, "Transport Note")) -> return restock order id | db_restockOrder.test.js -> testNewRestockOrder() |
| invalid parameters                | I       | T2(new Restock_Order(3, "2022/06/05 18:23", undefined, 3, "Transport Note")) -> catch error (invalid field/s) | db_restockOrder.test.js -> testNewRestockOrder() |

### **Class *RestockOrderDB* - method *getRestockOrderList***

**Criteria for method *getRestockOrderList*:**

 - Restock orders presence

**Predicates for method *getRestockOrderList*:**

| Criteria | Predicate |
| -------- | --------- |
|   Restock orders presence |  Restock orders are present  |
|                 |  Restock orders are not present |

**Combination of predicates**:

|  Restock orders presence  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| Restock orders are present        | V        | T1() -> return [{id: 1, issueDate: "2022/03/29 09:30", state: "DELIVERED", products: [], supplierId: 1, transportNote: "Transport Note", skuItems: []}, {...}, ...] | db_restockOrder.test.js |
| Restock orders are not present    | V             | T2() -> return [] | db_restockOrder.test.js |

 ### **Class *RestockOrderDB* - method *getRestockOrderbyId***

**Criteria for method *getRestockOrderbyId*:**

 - Restock order id is valid

**Predicates for method *getRestockOrderbyId*:**

| Criteria | Predicate |
| -------- | --------- |
|  Restock order id is valid |  valid Restock order id  |
|                 |  invalid Restock order id  |

**Combination of predicates**:

| Restock order id is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Restock order id              | V        | T1(1) -> return {id: 1, issueDate: "2022/03/29 09:30", state: "DELIVERED", products: [], supplierId: 1, transportNote: "Transport Note", skuItems: []} | db_restockOrder.test.js -> testGetRestockOrderByID() |
| invalid  Restock order id      | I             | T2(69) -> return undefined | db_restockOrder.test.js -> testGetRestockOrderByID() |

### **Class *RestockOrderDB* - method *deleteRestockOrderById***

**Criteria for method *deleteRestockOrderById*:**

 - Restock order exists

**Predicates for method *deleteRestockOrderById*:**

| Criteria | Predicate |
| -------- | --------- |
|  Restock order exists |  valid Restock order id  |
|                 |  invalid Restock order id  |

**Combination of predicates**:

| Restock order exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|   valid Restock order id    | V | T1(1) -> return true | db_restockOrder.test.js -> testDeleteRestockOrderByID() |
|  invalid  Restock order id  | I | T2(753) -> return false | db_restockOrder.test.js -> testDeleteRestockOrderByID() |

### **Class *RestockOrderDB* - method *updateRestockOrderState***

**Criteria for method *updateRestockOrderState*:**

 - Update info are valid

**Predicates for method *updateRestockOrderState*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update info are valid   |    valid update order state info   |
|          |   invalid update order state info        |

**Combination of predicates**:

|  Update info are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid update order state info | V | T1(new Restock_Order(undefined, "", "COMPLETED", undefined, ""), 1) -> return true | db_restockOrder.test.js -> testUpdateRestockOrderState() |
| invalid update order state info | I | T2(new Restock_Order(undefined, "", undefined, undefined, ""), 2) -> catch error(invalid state field) | db_restockOrder.test.js -> testUpdateRestockOrderState() |
|                                 | I | T3(new Restock_Order(undefined, "", "DELIVERED", undefined, ""), 795) -> return false | db_restockOrder.test.js -> testUpdateRestockOrderState() |

### **Class *RestockOrderDB* - method *updateRestockOrderTransportNote***

**Criteria for method *updateRestockOrderTransportNote*:**

 - Update info are valid

**Predicates for method *updateRestockOrderTransportNote*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update info are valid   |    valid update order transport note info   |
|          |   invalid update order transport note info        |

**Combination of predicates**:

|  Update info are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid update order transport note info | V | T1(new Restock_Order(undefined, "", "COMPLETED", undefined, "Updated Transport note"), 1) -> return true | db_restockOrder.test.js -> testUpdateRestockOrderTransportNote() |
| invalid update order transport note info | I | T2(new Restock_Order(undefined, "", undefined, undefined, undefined), 2) -> catch error(invalid transport note field) | db_restockOrder.test.js -> testUpdateRestockOrderTransportNote() |
|                                 | I | T3(new Restock_Order(undefined, "", "DELIVERED", undefined, ""), 3) -> return false | db_restockOrder.test.js -> testUpdateRestockOrderTransportNote() |

### **Class *RestockOrderDB* - method *addProductstoOrder***

**Criteria for method *addProductstoOrder*:**

 - Restock order id is valid

**Predicates for method *addProductstoOrder*:**

| Criteria | Predicate |
| -------- | --------- |
|  Restock order id is valid |  valid Restock order id  |
|                 |  invalid Restock order id  |

**Combination of predicates**:

|  Restock order id is valid  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Restock order id  | V | T1(1) -> return list of products | db_restockOrder.test.js -> testAddProductsToOrder() |
| invalid Restock order id   | I | T2(759) -> return empty list of products | db_restockOrder.test.js -> testAddProductsToOrder() |

### **Class *RestockOrderDB* - method *addSkuItemsToSkuItemToRestock***

**Criteria for method *addSkuItemsToSkuItemToRestock*:**

 - Sku item is valid

**Predicates for method *addSkuItemsToSkuItemToRestock*:**

| Criteria | Predicate |
| -------- | --------- |
|  Sku item is valid |  valid Sku item  |
|                 |  invalid Sku item  |

**Combination of predicates**:

|  Sku item is valid  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Sku item   | V | T1(new Sku_Item_RestockOrder("12345678901234567890123456789011", 1), restockOrderID : 1) -> return true | db_restockOrder.test.js -> testAddSkuItemToSkuItemToRestockTable() |
| invalid Sku item  | I | T2(new Sku_Item_RestockOrder("12345678901234567890123456789015", undefined), restockOrderID : 2) -> catch error | db_restockOrder.test.js -> testAddSkuItemToSkuItemToRestockTable() |
|                   | I | T3(new Sku_Item_RestockOrder("12345678901234567890123456789014", 3), restockOrderID : 2) -> catch error | db_restockOrder.test.js -> testAddSkuItemToSkuItemToRestockTable() |

### **Class *RestockOrderDB* - method *addProductToSKURestockTable***

**Criteria for method *addProductToSKURestockTable*:**

 - Product is valid

**Predicates for method *addProductToSKURestockTable*:**

| Criteria | Predicate |
| -------- | --------- |
|  Product is valid |  valid Product  |
|                 |  invalid Product  |

**Combination of predicates**:

|  Product is valid  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Product   | V | T1(new Product(1, "product 1", 9.99, 24), restockOrderID : 1) -> return true | db_restockOrder.test.js -> testAddSkuItemToskuRestockTable() |
| invalid Product | I | T2(new Product(undefined, "product 5", 12.99, 96), restockOrderID : 2) -> catch error | db_restockOrder.test.js -> testAddSkuItemToskuRestockTable() |
|                 | I | T3(new Product(3, "product 6", 6.99, 67), restockOrderID : 2) -> catch error | db_restockOrder.test.js -> testAddSkuItemToskuRestockTable() |

 ### **Class *RestockOrderDB* - method *getSkuItemstoOrder***

**Criteria for method *getSkuItemstoOrder*:**

 - Restock order id is valid

**Predicates for method *getSkuItemstoOrder*:**

| Criteria | Predicate |
| -------- | --------- |
|  Restock order id is valid |  valid Restock order id  |
|                 |  invalid Restock order id  |

**Combination of predicates**:

| Restock order id is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Restock order id              | V        | T1(1) -> return list of sku items | db_restockOrder.test.js -> testNumberGetSkuItemsToRestockOrder() |
| invalid  Restock order id      | I             | T2(69) -> return empty list | db_restockOrder.test.js -> testNumberGetSkuItemsToRestockOrder() |

### **Class *RestockOrderDB* - method *createRestockOrder***

**Criteria for method *createRestockOrder*:**

 - New restock order prameters

**Predicates for method *createRestockOrder*:**

| Criteria | Predicate |
| -------- | --------- |
|  New restock order prameters  |  valid parameters  |
|          |    invalid parameters   |

**Combination of predicates**:

| New restock order prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters                | V         | T1(new Restock_Order(1, "2022/03/29 09:30", "DELIVERED", 1, "Transport Note")) -> return restock order id | db_restockOrder.test.js -> testNewRestockOrder() |
| invalid parameters                | I       | T2(new Restock_Order(3, "2022/06/05 18:23", undefined, 3, "Transport Note")) -> catch error (invalid field/s) | db_restockOrder.test.js -> testNewRestockOrder() |

### **Class *InternalOrderDB* - method *createInternalOrder***

**Criteria for method *createInternalOrder*:**

 - New internal order prameters

**Predicates for method *createInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
|  New internal order prameters  |  valid parameters     |
|                                |  invalid parameters   |

**Combination of predicates**:

| New internal order prameters | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters    | V | T1(new InternalOrder(undefined, '2021/11/29 09:33', 1)) -> return internal order id | db_internalOrder.test.js -> testCreateInternalOrder() |
| invalid parameters  | I | T2(new InternalOrder(undefined, '2021/11/29 09:23', undefined)) -> return false | db_internalOrder.test.js -> testCreateInternalOrder() |

### **Class *InternalOrderDB* - method *updateInternalOrderState***

**Criteria for method *updateInternalOrderState*:**

 - Update info are valid

**Predicates for method *updateInternalOrderState*:**

| Criteria | Predicate |
| -------- | --------- |
|  Update info are valid   |    valid update order state info   |
|                          |   invalid update order state info  |

**Combination of predicates**:

|  Update info are valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid update order state info   | V | T1("COMPLETED", 1) -> return true | db_internalOrder.test.js -> testUpdateInternalOrderState() |
| invalid update order state info | I | T2("COMPLETED", 496) -> return false (order id not found) | db_restockOrder.test.js -> testUpdateInternalOrderState() |
|                                 | I | T3(undefined, 1) -> catch error (invalid field) | db_restockOrder.test.js -> testUpdateInternalOrderState() |

### **Class *InternalOrderDB* - method *createSkuItemToInternal***

**Criteria for method *createSkuItemToInternal*:**

 - New product return prameters

**Predicates for method *createSkuItemToInternal*:**

| Criteria | Predicate |
| -------- | --------- |
|  New product return  |  valid parameters     |
|                                |  invalid parameters   |

**Combination of predicates**:

| New product return | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid parameters    | V | T1(new Product_Return('12', "a product1", 11.99, '12345678901234567890123456789016'), 1) -> return true | db_internalOrder.test.js -> testCreateSkuItemToInternal() |
| invalid parameters  | I | T2(new Product_Return('2', "a product4", undefined, '12345678901234567890123456789019'), 1) -> return false | db_internalOrder.test.js -> testCreateSkuItemToInternal() |

 ### **Class *InternalOrderDB* - method *getInternalOrderbyID***

**Criteria for method *getInternalOrderbyID*:**

 - Internal order id is valid

**Predicates for method *getInternalOrderbyID*:**

| Criteria | Predicate |
| -------- | --------- |
|  Internal order id is valid |  valid Internal order id  |
|                 |  invalid Internal order id  |

**Combination of predicates**:

| Internal order id is valid | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Internal order id         | V   | T1(1) -> return {id: 1, issueDate: '2021/11/29 09:33', state: 'ISSUED', customerId: 1, products: []} | db_internalOrder.test.js -> testGetInternalOrderbyID() |
| invalid  Internal order id      | I   | T2(69) -> return undefined | db_internalOrder.test.js -> testGetInternalOrderbyID() |


### **Class *InternalOrderDB* - method *getInternalOrderList***

**Criteria for method *getInternalOrderList*:**

 - Restock orders presence

**Predicates for method *getInternalOrderList*:**

| Criteria | Predicate |
| -------- | --------- |
|   Restock orders presence |  Restock orders are present  |
|                 |  Restock orders are not present |

**Combination of predicates**:

|  Restock orders presence  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| Restock orders are present        | V        | T1() -> return [{id: 1, issueDate: "2022/03/29 09:30", state: "DELIVERED", products: [], supplierId: 1, transportNote: "Transport Note", skuItems: []}, {...}, ...] | db_internalOrder.test.js -> testGetInternalOrderList() |
| Restock orders are not present    | V             | T2() -> return [] | db_internalOrder.test.js -> testGetInternalOrderList() |

### **Class *InternalOrderDB* - method *deleteInternalOrderById***

**Criteria for method *deleteInternalOrderById*:**

 - Internal order exists

**Predicates for method *deleteInternalOrderById*:**

| Criteria | Predicate |
| -------- | --------- |
|  Internal order exists |  valid Internal order id  |
|                 |  invalid Internal order id  |

**Combination of predicates**:

| Internal order exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|   valid Internal order id    | V | T1(1) -> return true | db_internalOrder.test.js -> testDeleteInternalOrderByID() |
|  invalid  Internal order id  | I | T2(753) -> return false | db_internalOrder.test.js -> testDeleteInternalOrderByID() |

### **Class *InternalOrderDB* - method *deleteSkuToInternalItem***

**Criteria for method *deleteSkuToInternalItem*:**

 - Internal order exists

**Predicates for method *deleteSkuToInternalItem*:**

| Criteria | Predicate |
| -------- | --------- |
|  Internal order exists |  valid Internal order id  |
|                 |  invalid Internal order id  |

**Combination of predicates**:

| Internal order exists | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
|   valid Internal order id    | V | T1(1) -> return true | db_internalOrder.test.js -> testDeleteSkuToInternalItem() |
|  invalid  Internal order id  | I | T2(753) -> return false | db_internalOrder.test.js -> testDeleteSkuToInternalItem() |

### **Class *InternalOrderDB* - method *addSkuItemToSkuInternalTable***

**Criteria for method *addSkuItemToSkuInternalTable*:**

 - Product is valid

**Predicates for method *addSkuItemToSkuInternalTable*:**

| Criteria | Predicate |
| -------- | --------- |
|  Product is valid |  valid Product  |
|                 |  invalid Product  |

**Combination of predicates**:

|  Product is valid  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid Product   | V | T1(new Product("12", "a product1", 11.99, 2), 1) -> return true | db_internalOrder.test.js -> testAddSkuItemToSkuInternalTable() |
| invalid Product | I | T2(new Product(undefined, "a product4", 10.45, 6), 1) -> catch error | db_internalOrder.test.js -> testAddSkuItemToSkuInternalTable() |

### **Class *InternalOrderDB* - method *getInternalOrderList***

**Criteria for method *getInternalOrderList*:**

 - Issued products presence

**Predicates for method *getInternalOrderList*:**

| Criteria | Predicate |
| -------- | --------- |
|   Issued products presence |  Issued products are present  |
|                 |  Issued products are not present |

**Combination of predicates**:

|  Issued products presence  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| Issued products are present        | V        | T1() -> return [{price: 11.99, SKUId: 12, qty: 2, description: 'a product1'}, {...}, ...] | db_internalOrder.test.js -> testGetProductsIssuedtoInternalOrder() |
| Issued products are not present    | V             | T2() -> return [] | db_internalOrder.test.js -> testGetProductsIssuedtoInternalOrder() |

### **Class *InternalOrderDB* - method *getProductsCompletedtoInternalOrder***

**Criteria for method *getProductsCompletedtoInternalOrder*:**

 - Completed products presence

**Predicates for method *getProductsCompletedtoInternalOrder*:**

| Criteria | Predicate |
| -------- | --------- |
|   Completed products presence |  Completed products are present  |
|                 |  Completed products are not present |

**Combination of predicates**:

|  Completed products presence  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| Completed products are present        | V        | T1() -> return [{price: 11.99, SKUId: 12, qty: 2, description: 'a product1'}, {...}, ...] | db_internalOrder.test.js -> testGetProductsCompletedtoInternalOrder() |
| Completed products are not present    | V             | T2() -> return [] | db_internalOrder.test.js -> testGetProductsCompletedtoInternalOrder() |

### **Class *validationUtils* - method *is_position_valid***

**Criteria for method *is_position_valid*:**

 - aisle or col or row id is valid (4 characters)

**Predicates for method *is_position_valid*:**

| Criteria | Predicate |
| -------- | --------- |
|  aisle or col or row id is valid |  valid id  |
|                 |  invalid id |

**Combination of predicates**:

|  aisle or col or row id is valid  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid id   | V        | T1("1234") -> return true | validation_utils.test.js -> test_is_position_valid() |
| invalid id | I        | T2("a2bc") -> return false | validation_utils.test.js -> test_is_position_valid() |
|            | I        | T3("2") -> return false | validation_utils.test.js -> test_is_position_valid() |
|            | I        | T4("12345") -> return false | validation_utils.test.js -> test_is_position_valid() |
|            | I        | T5(undefined) -> return false | validation_utils.test.js -> test_is_position_valid() |

### **Class *validationUtils* - method *is_position_id_valid***

**Criteria for method *is_position_id_valid*:**

 - position id is valid (4 characters)

**Predicates for method *is_position_id_valid*:**

| Criteria | Predicate |
| -------- | --------- |
|  position id is valid |  valid id  |
|                 |  invalid id |

**Combination of predicates**:

|  position id is valid  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid id   | V        | T1("123456789123") -> return true | validation_utils.test.js -> test_is_position_id_valid() |
| invalid id | I        | T2("123456789") -> return false | validation_utils.test.js -> test_is_position_id_valid() |
|            | I        | T3("123a123b123c") -> return false | validation_utils.test.js -> test_is_position_id_valid() |
|            | I        | T4(undefined) -> return false | validation_utils.test.js -> test_is_position_id_valid() |

### **Class *validationUtils* - method *is_RFID_valid***

**Criteria for method *is_RFID_valid*:**

 - rfid is valid (4 characters)

**Predicates for method *is_RFID_valid*:**

| Criteria | Predicate |
| -------- | --------- |
|  rfid is valid |  valid id  |
|                 |  invalid id |

**Combination of predicates**:

|  rfid is valid  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| valid rfid   | V        | T1("12345678901234567890123456789011") -> return true | validation_utils.test.js -> test_is_RFID_valid() |
| invalid rfid | I        | T2("1234567890123456789012345678901") -> return false | validation_utils.test.js -> test_is_RFID_valid() |
|            | I          | T3("123456789012345678901234567890112") -> return false | validation_utils.test.js -> test_is_RFID_valid() |
|            | I          | T4("aaaaaa789012345678vbc01456789011") -> return false | validation_utils.test.js -> test_is_RFID_valid() |
|            | I        | T5(undefined) -> return false | validation_utils.test.js -> test_is_RFID_valid() |

### **Class *validationUtils* - method *validate_date***

**Criteria for method *validate_date*:**

 - date is valid (4 characters)

**Predicates for method *validate_date*:**

| Criteria | Predicate |
| -------- | --------- |
|  date is valid  |  valid date  |
|                 |  invalid date |

**Combination of predicates**:

|  date is valid  | Valid / Invalid | Description of the test case | Jest test case |
|-------------|-----------------|------------------------------|----------------|
| date valid     | V          | T1("2022/04/22") -> return true | validation_utils.test.js -> test_validate_date() |
|                | V          | T2("2022/04/22 17:07") -> return true | validation_utils.test.js -> test_validate_date() |
|                | V          | T3(undefined) -> return true | validation_utils.test.js -> test_validate_date() |
|                | V          | T4(null) -> return true | validation_utils.test.js -> test_validate_date() |
| date invalid   | I          | T5("2022/25/266") -> return false | validation_utils.test.js -> test_validate_date() |
|                | I          | T6("2022/04/22 42:04") -> return false | validation_utils.test.js -> test_validate_date() |
|                | I          | T7("7") -> return false | validation_utils.test.js -> test_validate_date() |
|                | I          | T8("abc") -> return false | validation_utils.test.js -> test_validate_date() |

# White Box Unit Tests

### Test cases definition

| Unit name | Jest test case |
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
| validationUtils | validation_utils.test.js -> Validation utils - test (test_OnlyDigits(), test_is_position_valid(), test_is_position_id_valid(), test_is_RFID_valid(), test_validate_number_value(), test_validate_integer_value(), test_validate_date(), test_validate_string_value(), test_validate_available_value(), test_validate_params_value(), test_validate_user_type(), validate_password_value(), validate_string_user_value()) |
| Models' functions | functions_models.test.js -> Models functions - Test (testItemFunctions(), testInternalOrderFunctions(), testReturnOrderFunctions(), testRestockOrderFunctions()) |

### Code coverage report

![coverage1](/coverage_images/unit_test_coverage.PNG)

### Loop coverage analysis

We did not have significant loops in our code, our methods mainly do single and direct tasks.




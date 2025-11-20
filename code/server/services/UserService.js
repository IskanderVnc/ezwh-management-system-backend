'use strict';


class UserService {
    dao;
    constructor(dao) {
        this.dao = dao;
    }

    getSupplierList = async () => {
        const list = await this.dao.getSupplierList();
        return list;
    };

    getUserList = async () => {
        const list = await this.dao.getUserList();
        return list;
    };

    getUserInfo = async (username) => {
        const userInfo = await this.dao.getUserInfo(username);
        if (userInfo === undefined)
            return undefined;
        return userInfo;
    };

    createUser = async (user) => {
        const res = await this.dao.createUser(user);
        return res;
    };

    updateUser = async (username, newType) => {
        const res = await this.dao.updateUser(username, newType);
        return res;
    };

    getUserByEmailAndType = async (username, type) => {
        let user = await this.dao.getUserByEmailAndType(username, type);
        return user;
    };

    getUserByEmailAndPassword = async (email, password) => {
        let user = await this.dao.getUserByEmailAndPassword(email, password);
        return user;
    };

    deleteUser = async (username, type) => {
        let res = await this.dao.deleteUser(username, type);
        if (res) {
            return true;
        }
        else {
            return false;
        }
    };

    deleteUserData = async () => {
        let res = await this.dao.deleteUserData();
        if (res) {
            return true;
        }
        else {
            return false;
        }
    };


}

module.exports = UserService;
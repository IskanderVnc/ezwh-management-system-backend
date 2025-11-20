'use strict';

class PositionService {
    dao;
    constructor(dao) {
        this.dao = dao;
    }

    updatePosition = async (position, positionID) => {
        const res = await this.dao.updatePosition(position, positionID);
        return res;
    };

    deletePositionById = async (id) => {
        const res = await this.dao.deletePositionById(id);
        return res;
    };

    deletePositionData = async () => {
        const res = await this.dao.deletePositionData();
        return res;
    };

    getPositions = async () => {
        const list = await this.dao.getPositions();
        return list;
    };

    createPosition = async (position) => {
        const pos = await this.dao.createPosition(position);
        return pos;
    };

    updatePositionOccupiedValues = async (newPositionID, newOccupiedWeight, newOccupiedVolume) => {
        const res = await this.dao.updatePositionOccupiedValues(newPositionID, newOccupiedWeight, newOccupiedVolume);
        return res;
    };

}

module.exports = PositionService;
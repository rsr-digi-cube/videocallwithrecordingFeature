'use strict';

function saveData(model,data) {
    return new Promise((resolve, reject) => {
        try {
            let saveData = new model(data).save();
            return resolve(saveData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getData(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.find(query, projection, options);
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

function getDataOne(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.findOne(query, projection, options);
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

function findOneAndUpdate(model, query, projection, options) {
    return new Promise((resolve, reject) => {
        try {
            let findData = model.findOneAndUpdate(query, projection, options);
            return resolve(findData);
        } catch (err) {
            return reject(err);
        }
    });
}

module.exports = {
    saveData : saveData,
    getData : getData,
    getDataOne : getDataOne,
    findOneAndUpdate:findOneAndUpdate
};
const AppConstraints  = require('../config/AppConstraints');
const Models          = require('../models/index');
const DAO             = require('../DAOManager/queries');

exports.invalidAccessTokenError = function (statusCode, language, message, res) {
    let lang = language ? language : 'en';
    console.log( message.customMessage, message.customMessage[lang] )
    var successData = {
        status: AppConstraints.STATUSCODE.UNAUTHORIZE,
        data: {},
        msg: message.customMessage ? message.customMessage[lang] : AppConstraints.ERROR_MESSAGE.DEFAULT.customMessage[lang]
    };
    sendData(successData, statusCode, res);
};

exports.parameterMissingError = function (res) {

    var errorMsg = constants.responseErrors.MANDATORY_FIELDS;
    sendData(errorMsg, res);
};

exports.somethingWentWrongError = function (statusCode, language, message, res) {

    let lang = language ? language : 'en';
    console.log( message.customMessage, message.customMessage[lang] )
    var successData = {
        status: AppConstraints.STATUSCODE.INTERNAL_SERVER_ERROR,
        data: {},
        msg: message.customMessage ? message.customMessage[lang] : AppConstraints.ERROR_MESSAGE.DEFAULT.customMessage[lang]
    };
    sendData(successData, statusCode, res);
};


exports.accountBlockedOrDeleted = function (statusCode, language, message, res) {

    let lang = language ? language : 'en';
    console.log( message.customMessage, message.customMessage[lang] )
    var successData = {
        status: (statusCode === 402 ? AppConstraints.STATUSCODE.APP_ERROR : AppConstraints.STATUSCODE.ROLE_CHANGE),
        data: {},
        msg: message.customMessage ? message.customMessage[lang] : AppConstraints.ERROR_MESSAGE.DEFAULT.customMessage[lang]
    };
    sendData(successData, statusCode, res);
};



exports.sendSuccessData = function (data, statusCode, language, message, res) {

    let lang = language ? language : 'en';

    var successData = {
        statusCode: AppConstraints.STATUSCODE.SUCCESS,
        data: data,
        msg:  message.customMessage ? message.customMessage[lang] : AppConstraints.ERROR_MESSAGE.DEFAULT.customMessage[lang]
    };
    sendData(successData, statusCode, res);
};

exports.sendSuccessMessage = function (message, language, res) {

    var successData = {status: "true", message: message,flag:104};
    sendData(successData, res);
};

exports.sendErrorMessage = function (statusCode, language, message, res) {

    let lang = language ? language : 'en';
    console.log( message.customMessage )
    var successData = {
        statusCode: AppConstraints.STATUSCODE.BAD_REQUEST,
        data: {},
        msg: message.customMessage ? message.customMessage[lang] : AppConstraints.ERROR_MESSAGE.DEFAULT.customMessage[lang]
    };
    sendData(successData, statusCode, res);
};

exports.sendErrorMessagePrevious = function (statusCode, language, message, res) {

    let lang = language ? language : 'en';
    var successData = {
        status: AppConstraints.STATUSCODE.BAD_REQUEST,
        data: {},
        msg: message.customMessage ? message.customMessage[lang] : AppConstraints.ERROR_MESSAGE.DEFAULT.customMessage[lang]
    };
    sendData(successData, statusCode, res);
};


exports.sendError = function (statusCode, error, language, res) {

    let lang = language ? language : 'en';
    var errorMessage = {
        statusCode: AppConstraints.STATUSCODE.BAD_REQUEST,
        data: {},
        msg: error
    };
    console.log(statusCode);
    sendData(errorMessage, statusCode, res);
};


exports.successStatusMsg = function (res) {

    var successMsg = {"status": "true"};
    sendData(successMsg, res);
};


async function sendData(data, statusCode, res) {
    if (res.socket.parser.incoming.originalMethod !== 'GET' && res.socket.parser.incoming.route &&
        res.socket.parser.incoming.credentials) {
        await DAO.saveData(Models.ApiUpdateLogs, {
            apiName:  res.socket.parser.incoming.route ? res.socket.parser.incoming.route.path : '',
            updatedBy:{
                _id: res.socket.parser.incoming.credentials ? res.socket.parser.incoming.credentials._id : '',
                type: res.socket.parser.incoming.credentials ? res.socket.parser.incoming.credentials.user : 'user'
            },
            statusCode : res.statusCode,
            message: data.msg,
            payload: res.socket.parser.incoming.body,
            headers: res.socket.parser.incoming.headers,
            ipInfo:res.socket.parser.incoming.rawHeaders});
    }
    res.status(statusCode).json(data);
}


exports.sendData = async function (data, statusCode, res) {
    if (res.socket.parser.incoming.originalMethod !== 'GET') {
        await DAO.saveData(Models.ApiUpdateLogs, {
            apiName: res.socket.parser.incoming.route ? res.socket.parser.incoming.route.path : '',
            updatedBy:{
                _id: res.socket.parser.incoming.credentials ? res.socket.parser.incoming.credentials._id : '',
                type:  res.socket.parser.incoming.credentials ? res.socket.parser.incoming.credentials.user : ''
            },
            statusCode : res.statusCode,
            message:  data.msg,
            payload: res.socket.parser.incoming.body,
            headers: res.socket.parser.incoming.headers,
            ipInfo:res.socket.parser.incoming.rawHeaders});
    }
    res.status(statusCode).json(data);
};

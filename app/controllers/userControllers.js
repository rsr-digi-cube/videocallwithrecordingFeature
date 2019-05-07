const Models = require('../models/index'),
    ObjectId = require('mongodb').ObjectID,
    UnivershalFunction = require('../UnivershalFunctions/Univershalfunctions'),
    sendResponse = require('./sendResponse'),
    AppConstraints = require('../config/AppConstraints'),
     Item=require('../models/item'),
    DAO = require('../DAOManager/queries');
exports.register = async (request, response) => {
    let language = request.headers.language || 'en';
    try {


        console.log(request.body,'hghghghghghg')


        let schema = Joi.object().keys({
            fullName: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().required(),
        });

        let data = await UnivershalFunction.validateSchema(request.body, schema, {presence: "required"});
        let checkPhone = await Models.User.findOne({email: data.email});
        if (checkPhone) throw AppConstraints.ERROR_MESSAGE.EMAIL_ALREADY_EXIST;
        let user = new Models.User();
        user.fullName = data.fullName
        user.password = await bcrypt.hashSync(data.password, AppConstraints.SERVER.SALT);
        user.deviceToken = data.deviceToken;
        user.deviceType = data.deviceType;
        user.email = data.email;
        let saveUser = await user.save();
        saveUser.password = undefined;
        let loginTime = (new Date()).getTime();
        let tokenData = {
            scope: 'user',
            _id: saveUser._id,
            loginTime: loginTime
        };
        let token = await UnivershalFunction.GenerateToken(tokenData);
        saveUser.accessToken = token;
        return sendResponse.sendSuccessData(saveUser,
            AppConstraints.STATUSCODE.SUCCESS,
           language, AppConstraints.SUCCESS_MESSAGE.DEFAULT, response);


    } catch (err) {

        console.log(err,'=========')

        if (err.isJoi) {
            return sendResponse.sendError(AppConstraints.STATUSCODE.BAD_REQUEST, err.message, language, response);
        }
        else {
            return sendResponse.sendErrorMessage(AppConstraints.STATUSCODE.BAD_REQUEST, language, err, response);
        }
    }
}



exports.login = async (request, response) => {
    let language = request.headers.language || 'en';
    try {
        let schema = Joi.object().keys({
            password: Joi.string().required(),
            email: Joi.string().required()
        });

        let data = await UnivershalFunction.validateSchema(request.body, schema, {presence: "required"});

        let criteria = {
            email: data.email
        };



        let findUser = await DAO.getDataOne(Models.User, criteria, {}, { lean: true });
        if (!findUser)
             throw AppConstraints.ERROR_MESSAGE.INVALID_EMAIL_PROVIDED;

        let checkPassword = bcrypt.compareSync(data.password, findUser.password);
        if (!checkPassword) {
            throw AppConstraints.ERROR_MESSAGE.INVALID_PHONE_NUMBER_PASSWORD;
        }
        let loginTime = (new Date()).getTime();

        let dataToSet = {
            $set: {
                deviceType: data.deviceType,
                deviceToken: data.deviceToken,
                isOnline:true
            }
        }

        let userData = await DAO.findOneAndUpdate(Models.User, criteria, dataToSet, {new: true, lean: true});

        let tokenData = {
            scope: 'user',
            _id: userData._id,
            loginTime: loginTime
        }

        let token = await UnivershalFunction.GenerateToken(tokenData);
        userData.accessToken = token;
        delete userData.password;

        return sendResponse.sendSuccessData(userData,
                 AppConstraints.STATUSCODE.SUCCESS,
                language, AppConstraints.SUCCESS_MESSAGE.DEFAULT, response);
    }
    catch (err) {
        console.log(err)
        if (err.isJoi) {
            return sendResponse.sendError(AppConstraints.STATUSCODE.BAD_REQUEST, err.message, language, response);
        }
        else {
            return sendResponse.sendErrorMessage(AppConstraints.STATUSCODE.BAD_REQUEST, language, err, response);
        }
    }
}

exports.addItem=async(request,response)=>{
    let language = request.headers.language || 'en';
    try {

        console.log(request.body,'============')

        let schema = Joi.object().keys({
            pair:Joi.string().required(),
            type:Joi.string().required(),
            price:Joi.number().required(),
            qty:Joi.number().required(),
            side:Joi.string().required(),
            status:Joi.string().required(),
            filled:Joi.string().required()
        });

        let data = await UnivershalFunction.validateSchema(request.body, schema, {presence: "required"});
        let itemData=new Item()
        itemData.pair=data.pair;
        itemData.type=data.type
        itemData.price=data.price;
        itemData.qty=data.qty;
        itemData.side=data.side;
        itemData.status=data.status;
        itemData.filled=data.filled;
        let saveData=await itemData.save();
        return sendResponse.sendSuccessData(saveData,
            AppConstraints.STATUSCODE.SUCCESS,
            language, AppConstraints.SUCCESS_MESSAGE.DEFAULT, response);
    }
    catch (err) {
        console.log(err)
        if (err.isJoi) {
            return sendResponse.sendError(AppConstraints.STATUSCODE.BAD_REQUEST, err.message, language, response);
        }
        else {
            return sendResponse.sendErrorMessage(AppConstraints.STATUSCODE.BAD_REQUEST, language, err, response);
        }
    }
}
exports.getItem=async(request,response)=>{
    let language = request.headers.language || 'en';
    try {
        let dataToSend=await Item.find();
        return sendResponse.sendSuccessData(dataToSend,
            AppConstraints.STATUSCODE.SUCCESS,
            language, AppConstraints.SUCCESS_MESSAGE.DEFAULT, response);
    }
    catch (err) {
        console.log(err)
        if (err.isJoi) {
            return sendResponse.sendError(AppConstraints.STATUSCODE.BAD_REQUEST, err.message, language, response);
        }
        else {
            return sendResponse.sendErrorMessage(AppConstraints.STATUSCODE.BAD_REQUEST, language, err, response);
        }
    }
}
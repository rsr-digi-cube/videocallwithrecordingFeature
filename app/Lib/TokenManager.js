const Models          =       require('../models/index'),
      sendResponse    =       require('../controllers/sendResponse')
      AppConstraints  =       require('../config/AppConstraints');

const tokenVerification =  (request, response, next) =>{
    console.log(" ************ tokenVerification *****************");
    const token = request.headers['authorization'];
    const role = request.headers['role'];
    let language = request.headers.language || 'en';

    console.log(token,role,'rolerolerolerolerolerolerolerolerolerolerolerole')


	if (!token||!role) {
        return sendResponse.sendErrorMessagePrevious(AppConstraints.STATUSCODE.BAD_REQUEST,
            language, AppConstraints.ERROR_MESSAGE.NO_ACCESS_TOKEN, response);
    } else {
        let accessToken = token.split(" ");
        if (!accessToken[1]) {
            return sendResponse.invalidAccessTokenError(AppConstraints.STATUSCODE.UNAUTHORIZE,
                language, AppConstraints.ERROR_MESSAGE.INVALID_ACCESSTOKEN, response);
        } else {
            jwt.verify(accessToken[1], process.env.JWT_SECRET_USER, function (err, decoded) {
                if (err) {
                    return sendResponse.invalidAccessTokenError(AppConstraints.STATUSCODE.UNAUTHORIZE,
                        language, AppConstraints.ERROR_MESSAGE.INVALID_ACCESSTOKEN, response);
                } else {

                    console.log(decoded,'bbnbnbn')



                    Models.User.findOne({_id: decoded.data._id}, {password: 0}, function (err, result) {
                        if (err) {
                            return sendResponse.invalidAccessTokenError(AppConstraints.STATUSCODE.INTERNAL_SERVER_ERROR,
                                language, AppConstraints.ERROR_MESSAGE.INTERNAL_SERVER_ERROR, response);
                        } else if (result) {
                            console.log(result,'===========')
                            next()
                        } else {
                            return sendResponse.invalidAccessTokenError(AppConstraints.STATUSCODE.UNAUTHORIZE,
                                language, AppConstraints.ERROR_MESSAGE.INVALID_ACCESSTOKEN, response);
                        }
                    })
                }
            });
        }
    }
};

module.exports=tokenVerification;
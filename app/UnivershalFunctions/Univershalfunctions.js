const AppConstraints = require('../config/AppConstraints');
const GenerateToken= (val)=>{
    return new Promise((resolve, reject) => {
        try {
            let key = process.env.JWT_SECRET_USER;
            let token = jwt.sign({ "data": val }, key,{
                algorithm: 'HS256'
            });
            resolve(token);
        }
        catch(err) {
            throw err;
        }
    });
}
exports.EncryptPassword=async(password)=>{
    try{
        let createPassword=await md5(password);
        return createPassword;
    }catch(err){
        console.log(err,'error data');
    }
}
exports.DecryptToken=async(val)=>{
    try{
        let decryptValue=await jwt.verify(val,process.env.JWT_SECRET);
        if(!decryptValue)
        return false;
        return decryptValue;
    }catch(err){
        console.log(err,'error decrypt');
        return false;
    }
}
exports.ValidateUserAccessToken=async(token)=>{
    try{
        let tokenData=token.split(" ");

        let findAccessToken=await User.findOne({accessToken:tokenData[1]});
        if(!findAccessToken)
        return false;       
        return findAccessToken;
       
   }catch(err){
        console.log(err,'error decrypt');
        return false;
    }
}



exports.validateAdminAccessToken=async(token)=>{
    try{
        let tokenData=token.split(" ");
        let findAccessToken=await Admin.findOne({accessToken:tokenData[1]});
        if(!findAccessToken)
        return false;
        return findAccessToken;  
    }
    catch(err){
        console.log(err,'error decrypt');
        return false;
    }
}


const validateSchema = (data, schema, options) => {
    return new Promise((resolve, reject) => {
        Joi.validate(data, schema, options, (err, value) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(value);
            }
        });
    });
}




module.exports = {
    validateSchema: validateSchema,
    GenerateToken: GenerateToken
};

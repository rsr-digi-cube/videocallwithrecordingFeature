const mongoose=require('mongoose'),
AppConstraints=require('../config/AppConstraints'),
      Schema=mongoose.Schema;
let user=  Schema({
    password               :    { type:String, index:true },
    fullName               :    { type:String, require:true },
    email                  :    { type:String, required:true },
    deviceToken            :    { type:String, default:"" },
    deviceType             :    { type:String, default:"ANDROID",enum:["ANDROID","IOS","WEB"]},
    accessToken            :    { type:String, default:"" },
    isBlocked              :    { type:Boolean,default:false },
});
module.exports=mongoose.model('user', user);
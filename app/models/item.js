const mongoose=require('mongoose'),
    Schema=mongoose.Schema;
let item=  Schema({
    pair:{type:String,required:true},
    type:{type:String,required:true},
    price:{type:Number,required:true},
    qty:{type:Number,required:true},
    side:{type:String,required:true},
    status:{type:String,required:true},
    filled:{type:String,required:true},
    createAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model('item', item);
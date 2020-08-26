const mongoose = require('mongoose')

const item = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    url:{type:String},
    name:{type:String},
    Description:{type:String},
    bigDescription:{type:String},
    nameEng:{type:String},
    DescriptionEng:{type:String},
    bigDescriptionEng:{type:String},
    tier1id:{type:mongoose.Schema.Types.ObjectId,ref:'tier1'},
    Vu:{type:String,default:0},
    ECD:{type:String},
    type:{type:String}

})
module.exports=mongoose.model('item',item)
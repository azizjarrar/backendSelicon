const mongoose = require('mongoose')

const item = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String},
    url:{type:String},
    Description:{type:String},
    tier1id:{type:mongoose.Schema.Types.ObjectId,ref:'tier1'},
    tier2id:{type:mongoose.Schema.Types.ObjectId,ref:'tier2'},
    table:{type:Object,default:{}}
})
module.exports=mongoose.model('item',item)
const mongoose = require('mongoose')

const tier1 = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String},
    nameEng:{type:String},
    type:{type:String},
    tier2:[{type:mongoose.Schema.Types.ObjectId,ref:'tier2'}]
    
})
module.exports=mongoose.model('tier1',tier1)
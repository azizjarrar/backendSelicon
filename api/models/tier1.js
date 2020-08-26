const mongoose = require('mongoose')

const tier1 = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String},
    nameEng:{type:String},
    type:{type:String},
    ECD:{type:String}
})
module.exports=mongoose.model('tier1',tier1)
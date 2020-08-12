const mongoose = require('mongoose')

const tier2 = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String},
    nameEng:{type:String},
})
module.exports=mongoose.model('tier2',tier2)
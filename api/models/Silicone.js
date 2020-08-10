const mongoose = require('mongoose')

const Silicone = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String},
    tier1id:[{type:mongoose.Schema.Types.ObjectId,ref:'tier1'}],

})
module.exports=mongoose.model('Silicone',Silicone)
const mongoose = require('mongoose')
const tier1   = require('../models/tier1')
const tier2   = require('../models/tier2')
const item =require('../models/item')
const silicon = require('../models/silicon')
const plastic = require('../models/plastic')
const fs = require('fs')

exports.Itemadd=(req,res)=>{
    var itemClass 
    if(req.body.tier2id=="None"){
         itemClass = new item({
            _id:new mongoose.Types.ObjectId,
            name:req.body.name,
            url:req.file.path,
            tier1id:req.body.tier1id,
            tier2id:null,
            Description:req.body.Description
        })
    }else{
        itemClass = new item({
            _id:new mongoose.Types.ObjectId,
            name:req.body.name,
            url:req.file.path,
            tier1id:req.body.tier1id,
            tier2id:req.body.tier2id,
            Description:req.body.Description
        })
    }

    itemClass.save().then((result)=>{
        res.status(res.statusCode).json({
            data: result,
        })
    })
}
exports.getItemsSelection=async (req,res)=>{
    if(req.body.tier1id===undefined || req.body.tier1id.length===0){
        res.status(res.statusCode).json({
            message:"no data given"
        })
    }else{
        if(req.body.tier2id===undefined || req.body.tier2id==="None"){
            console.log("raw d5al i lawej")
            const data = await item.find({tier1id:req.body.tier1id,tier2id:null}).exec().then((result)=>{
                console.log("data ray="+result)
                res.status(res.statusCode).json({
                    data: result,
                })
            })
        }else{

            const data = await item.find({tier1id:req.body.tier1id,tier2id:req.body.tier2id}).exec().then((result)=>{
                res.status(res.statusCode).json({
                    data: result,
                })
            })
        }
    }


}
exports.Itemdelete=(req,res)=>{
    const silicon = require('../models/silicon')
    const plastic = require('../models/plastic')
    if(req.body.tier1id===undefined || req.body.tier1id.length===0){
        res.status(res.statusCode).json({
            message:"no data given"
        })
    }else{
        if(req.body.tier2id===undefined || req.body.tier2id==="None"){
                tier1.findByIdAndRemove({_id:req.body.tier1id}).then(async (result)=>{
                    if(result==null){
                        res.status(res.statusCode).json({
                            message:" data not found"
                        })
                    }else{
                        if(result.type=="silicon"){
                            silicon.findOneAndUpdate({name:'silicon'},{$pull:{tier1id:req.body.tier1id}}).exec()
                        }else{
                            plastic.findOneAndUpdate({name:'plastic'},{$pull:{tier1id:req.body.tier1id}}).exec()
                        }
                        var tier2remove =  await result.tier2.map((e)=>{
                            return tier2.findByIdAndRemove({_id:e._id}).then(()=>{
                            })
                        })
                        Promise.all(tier2remove).then(async ()=>{
                            const itemsdata = await item.find({tier1id:req.body.tier1id}).exec()
                            itemsdata.map((e)=>{
                                console.log(e.url)
                                try {
                                    fs.unlinkSync(e.url)
                                  } catch(err) {
                                    console.error(err)
                                  }
                            })
                            //            
                            item.deleteMany({tier1id:req.body.tier1id}).exec().then((result)=>{
                                res.status(res.statusCode).json({
                                    message:"deleted data given"
                                })
                            })
                        })
                    }
  
                })
        }else{

//            const data = await item.find({tier1id:req.body.tier1id,tier2id:req.body.tier2id}).exec().then((result)=>{
      
            //})
        }
    }
}
exports.searchByword=async (req,res)=>{
    const data = await item.find({name:{ $regex: `.*${req.body.word}.*` }}).exec().then((result)=>{
        res.status(res.statusCode).json({
            data: result,
        })
    })
}
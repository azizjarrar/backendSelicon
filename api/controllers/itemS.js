const mongoose = require('mongoose')
const tier1   = require('../models/tier1')
const item =require('../models/item')
const fs = require('fs')
try{
    exports.Itemadd=(req,res)=>{
      
        var itemClass 
      
             itemClass = new item({
                _id:new mongoose.Types.ObjectId,
                name:req.body.name.toUpperCase(),
                url:req.file.path,
                tier1id:req.body.tier1id,
                Description:req.body.Description,
                bigDescription:req.body.bigDescription,
                nameEng:req.body.nameEng.toUpperCase(),
                DescriptionEng:req.body.DescriptionEng,
                bigDescriptionEng:req.body.bigDescriptionEng,
                ECD:req.body.ECD,
                type:req.body.type
            })
        itemClass.save().then((result)=>{
            res.status(res.statusCode).json({
                data: result,
            })
        })
    }
    exports.getItemsSelection=async (req,res)=>{
        if(req.body.tier1id===undefined){
            res.status(res.statusCode).json({
                message:"no data given"
            })
        }else{

                const data = await item.find({tier1id:req.body.tier1id}).exec().then((result)=>{

                    res.status(res.statusCode).json({
                        data: result,
                    })
                }).catch((e)=>{
                    res.status(res.statusCode).json({
                        error:e.message
                    })
                })
            }
    }
    exports.Itemdelete=(req,res)=>{
        const Silicone = require('../models/Silicone')
        const Caoutchouc = require('../models/Caoutchouc')
        if(req.body.tier1id===undefined || req.body.tier1id.length===0){
            
            res.status(res.statusCode).json({
                message:"no data given"
            })
        }else{
            
                    tier1.findByIdAndRemove({_id:req.body.tier1id}).then(async (result)=>{
                        if(result==null){
                            res.status(res.statusCode).json({
                                message:" data not found"
                            })
                        }else{
                            if(result.type=="Silicone"){
                                Silicone.findOneAndUpdate({name:'Silicone'},{$pull:{tier1id:req.body.tier1id}}).exec()
                            }else{
                                Caoutchouc.findOneAndUpdate({name:'Caoutchouc'},{$pull:{tier1id:req.body.tier1id}}).exec()
                            }
        
                                const itemsdata = await item.find({tier1id:req.body.tier1id}).exec()
                                itemsdata.map((e)=>{
                                    console.log("haha")
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
          
                        }
      
                    }).catch((e)=>{
                        res.status(res.statusCode).json({
                            error:e.message
                        })
                    })
            
        }
    }

    exports.searchOneItem=(req,res)=>{
        item.findOne({_id:req.body.id}).exec().then((result)=>{
            res.status(res.statusCode).json({
                data: result,
            })
        }).catch((e)=>{
            res.status(res.statusCode).json({
                error:e.message
            })
        })
    }
}catch(e){
  
        res.status(res.statusCode).json({
            error:e.message
        })

}

exports.deleteOneItem=(req,res)=>{
    item.findOneAndRemove({_id:req.body.id}).exec().then((result)=>{
        fs.unlinkSync(result.url)
        res.status(res.statusCode).json({
            data: 'element supprime',
        })
    }).catch((e)=>{
        res.status(res.statusCode).json({
            error:e.message
        })
    })
}
exports.UpdateVu=(req,res)=>{
    item.findOne({_id:req.body.id}).exec().then((result)=>{
        item.findOneAndUpdate({_id:req.body.id},{$set:{Vu:(result.Vu*1)+1}}).exec().then((result)=>{
            res.status(res.statusCode).json({
                message:'Vu update'
            })
        })
    })
}
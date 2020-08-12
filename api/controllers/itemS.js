const mongoose = require('mongoose')
const tier1   = require('../models/tier1')
const tier2   = require('../models/tier2')
const item =require('../models/item')
const fs = require('fs')
try{
    exports.Itemadd=(req,res)=>{
      
        var itemClass 
        if(req.body.tier2id=="None"){
             itemClass = new item({
                _id:new mongoose.Types.ObjectId,
                name:req.body.name.toUpperCase(),
                url:req.file.path,
                tier1id:req.body.tier1id,
                tier2id:null,
                Description:req.body.Description,
                bigDescription:req.body.bigDescription,
                nameEng:req.body.nameEng.toUpperCase(),
                DescriptionEng:req.body.DescriptionEng,
                bigDescriptionEng:req.body.bigDescriptionEng,
            })
        }else{
            itemClass = new item({
                _id:new mongoose.Types.ObjectId,
                url:req.file.path,
                tier1id:req.body.tier1id,
                tier2id:req.body.tier2id,
                Description:req.body.Description,
                name:req.body.name.toUpperCase(),
                bigDescription:req.body.bigDescription,
                nameEng:req.body.nameEng.toUpperCase(),
                DescriptionEng:req.body.DescriptionEng,
                bigDescriptionEng:req.body.bigDescriptionEng,

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
      
                const data = await item.find({tier1id:req.body.tier1id,tier2id:null}).exec().then((result)=>{
                    res.status(res.statusCode).json({
                        data: result,
                    })
                }).catch((e)=>{
                    res.status(res.statusCode).json({
                        error:e.message
                    })
                })
            }else{
    
                const data = await item.find({tier1id:req.body.tier1id,tier2id:req.body.tier2id}).exec().then((result)=>{
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
    
    
    }
    exports.Itemdelete=(req,res)=>{
        const Silicone = require('../models/Silicone')
        const Caoutchouc = require('../models/Caoutchouc')
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
                            if(result.type=="Silicone"){
                                Silicone.findOneAndUpdate({name:'Silicone'},{$pull:{tier1id:req.body.tier1id}}).exec()
                            }else{
                                Caoutchouc.findOneAndUpdate({name:'Caoutchouc'},{$pull:{tier1id:req.body.tier1id}}).exec()
                            }
                            var tier2remove =  await result.tier2.map((e)=>{
                                return tier2.findByIdAndRemove({_id:e._id}).then(()=>{
                                })
                            })
                            Promise.all(tier2remove).then(async ()=>{
                                const itemsdata = await item.find({tier1id:req.body.tier1id}).exec()
                                itemsdata.map((e)=>{
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
      
                    }).catch((e)=>{
                        res.status(res.statusCode).json({
                            error:e.message
                        })
                    })
            }else{
             
                tier1.findOneAndUpdate({_id:req.body.tier1id},{$pull:{tier2:req.body.tier2id}}).then(async (result)=>{
                    if(result==null){
                        res.status(res.statusCode).json({
                            message:" data not found"
                        })
                    }else{
                             await  tier2.findOneAndRemove({_id:req.body.tier2id}).then( (result)=>{})
    
                            const itemsdata = await item.find({tier2id:req.body.tier2id}).exec()
                            itemsdata.map((e)=>{
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
    }
    exports.searchByword=async (req,res)=>{
        const data = await item.find({$or:[{name:req.body.word.toUpperCase()},{nameEng:req.body.word.toUpperCase()}]}).exec().then((result)=>{
            res.status(res.statusCode).json({
                data: result,
            })
        }).catch((e)=>{
            res.status(res.statusCode).json({
                error:e.message
            })
        })
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
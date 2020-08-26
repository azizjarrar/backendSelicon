const tier1   = require('../models/tier1')
const Silicone = require('../models/Silicone')
const Caoutchouc = require('../models/Caoutchouc')
const mongoose = require('mongoose')
try{


exports.getTier1=(req,res)=>{


  
    tier1.find({type:req.body.section,ECD:req.body.ECD}).exec().then((result)=>{
        res.status(res.statusCode).json({
            data:result,
            message: "all tier" +req.body.section,
        })
    })
}

exports.AaddTier1=async (req,res)=>{
    const name=req.body.name
    const section = req.body.section
    const nameEng=req.body.nameEng
    const ECD=req.body.ECD
    const TierClass = new tier1({
        _id: new mongoose.Types.ObjectId(),
        name,
        type:section,
        nameEng,
        ECD
    })
    if(section=="Silicone"){
      const check =  await Silicone.findOne({name:'Silicone'}).exec().catch((e)=>{
        res.status(res.statusCode).json({
            error:e.message
        })
    })
      if(check==null){
          const siliconeClass = new Silicone({
              _id:new mongoose.Types.ObjectId,
              name:'Silicone',
              tier1id:[TierClass._id],
          })
          TierClass.save().then((result)=>{
            res.status(res.statusCode).json({
                message: "tier saved",
            })
        }).catch((e)=>{
            res.status(res.statusCode).json({
                error:e.message
            })
        })
          const createSiclion = await siliconeClass.save().then()

      }else{
        let aaa = Silicone.findOneAndUpdate({name:'Silicone'},{$push:{tier1id:TierClass._id}},{new: true}).exec().catch((e)=>{
            res.status(res.statusCode).json({
                error:e.message
            })
        })
  
        TierClass.save().then((result)=>{
            res.status(res.statusCode).json({
                message: "tier saved",
            })
        }).catch((e)=>{
            res.status(res.statusCode).json({
                error:e.message
            })
        })
      }
    }else{
        const check =  await Caoutchouc.findOne({name:'Caoutchouc'}).then().catch((e)=>{
            res.status(res.statusCode).json({
                error:e.message
            })
        })
        if(check==null){
            const CaoutchoucClass = new Caoutchouc({
                _id:new mongoose.Types.ObjectId,
                name:'Caoutchouc',
                tier1id:[TierClass._id],
            })
            TierClass.save().then((result)=>{
                res.status(res.statusCode).json({
                    message: "tier saved",
                })
            }).catch((e)=>{
                res.status(res.statusCode).json({
                    error:e.message
                })
            })
            const createCaoutchouc = await CaoutchoucClass.save().then()
 
    }else{
        Caoutchouc.findOneAndUpdate({name:'Caoutchouc'},{$push:{tier1id:TierClass._id}},{new: true}).exec().catch((e)=>{
            res.status(res.statusCode).json({
                error:e.message
            })
        })
        TierClass.save().then((result)=>{
            res.status(res.statusCode).json({
                message: "tier saved",
            })
        }).catch((e)=>{
            res.status(res.statusCode).json({
                error:e.message
            })
        })
    }

}
}
exports.MaddTier1=(req,res)=>{
    
    const id=req.body.id
    tier1.findOneAndUpdate({_id:id},{$set:{name:req.body.newname}},{new: true}).exec().catch((e)=>{
        res.status(res.statusCode).json({
            error:e.message
        })
    })
    res.status(res.statusCode).json({
        message: "tier name changed",
    })
    
}
exports.DaddTier1=(req,res)=>{
    const id=req.body.id
    tier1.findOneAndRemove({_id:id}).then((result)=>{
        if(result.type=="Caoutchouc"){
             Caoutchouc.findOneAndUpdate({name:'Caoutchouc'},{$pull:{tier1id:result._id}},{new: true}).exec().catch((e)=>{
                res.status(res.statusCode).json({
                    error:e.message
                })
            })
             res.status(res.statusCode).json({
                message: "deleted",
            })
        }else{
             Silicone.findOneAndUpdate({name:'Silicone'},{$pull:{tier1id:result._id}},{new: true}).exec().catch((e)=>{
                res.status(res.statusCode).json({
                    error:e.message
                })
            })
             res.status(res.statusCode).json({
                message: "deleted",
            })
        }
    }).catch((e)=>{
        res.status(res.statusCode).json({
            error:e.message
        })
    })

    
}
exports.AaddTier2=async (req,res)=>{
    const nameEng=req.body.nameEng
    const name=req.body.name
    const tier1id=req.body.tier1id
    const TierClass = new tier2({
        _id: new mongoose.Types.ObjectId(),
        name,
        nameEng
    })
    TierClass.save().then((result)=>{

    })
    tier1.findOneAndUpdate({_id:tier1id},{$push:{tier2:TierClass._id}}).then((result)=>{
        res.status(res.statusCode).json({
            message: "was updated saved",
        })
    }).catch((e)=>{
        res.status(res.statusCode).json({
            error:e.message
        })
    })

}
exports.MaddTier2=(req,res)=>{
    const id=req.body.id
    tier2.findOneAndUpdate({_id:id},{$set:{name:req.body.newname}},{new: true}).exec().catch((e)=>{
        res.status(res.statusCode).json({
            error:e.message
        })
    })
    res.status(res.statusCode).json({
        message: "tier name changed",
    })
    
}
exports.DaddTier2=(req,res)=>{
    const name=req.body.name
    tier2.findOneAndRemove({name:name}).then((result)=>{
        if(result.type=="Caoutchouc"){
             Caoutchouc.findOneAndUpdate({name:'Caoutchouc'},{$pull:{tier2id:result._id}},{new: true}).exec().catch((e)=>console.log(e.message))
             res.status(res.statusCode).json({
                message: "deleted",
            })
        }else{
             Silicone.findOneAndUpdate({name:'Silicone'},{$pull:{tier2id:result._id}},{new: true}).exec().catch((e)=>console.log(e.message))
             res.status(res.statusCode).json({
                message: "deleted",
            })
        }
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
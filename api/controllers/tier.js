const tier1   = require('../models/tier1')
const tier2   = require('../models/tier2')
const silicon = require('../models/silicon')
const plastic = require('../models/plastic')
const mongoose = require('mongoose')
exports.getTier1=(req,res)=>{
    console.log("/*************************/")

    console.log(req.body.section)
    tier1.find({type:req.body.section}).exec().then((result)=>{
        res.status(200).json({
            data:result,
            message: "all tier" +req.body.section,
        })
    })
}
exports.getTier2=(req,res)=>{
    tier1.find({_id:req.body.id}).populate({ path: 'tier2'}).exec().then((result)=>{
        res.status(200).json({
            data:result,
            message: "all tier",
        })
    }).catch(e=>console.log("no id given"))
}
exports.AaddTier1=async (req,res)=>{
    const name=req.body.name
    const section = req.body.section
    const TierClass = new tier1({
        _id: new mongoose.Types.ObjectId(),
        name,
        type:section
    })
    if(section=="silicon"){
      const check =  await silicon.findOne({name:'silicon'}).exec()
      if(check==null){
          const siliconClass = new silicon({
              _id:new mongoose.Types.ObjectId,
              name:'silicon',
              tier1id:[TierClass._id],
          })
          TierClass.save().then((result)=>{
            res.status(200).json({
                message: "tier saved",
            })
        }).catch((err)=>{
            res.status(200).json({
                message: err.message,
            })
        })
          const createSiclion = await siliconClass.save().then()

      }else{
        let aaa = silicon.findOneAndUpdate({name:'silicon'},{$push:{tier1id:TierClass._id}},{new: true}).exec()
  
        TierClass.save().then((result)=>{
            res.status(200).json({
                message: "tier saved",
            })
        }).catch((err)=>{
            res.status(200).json({
                message: err.message,
            })
        })
      }
    }else{
        const check =  await plastic.findOne({name:'plastic'}).then()
        if(check==null){
            const plasticClass = new plastic({
                _id:new mongoose.Types.ObjectId,
                name:'plastic',
                tier1id:[TierClass._id],
            })
            TierClass.save().then((result)=>{
                res.status(200).json({
                    message: "tier saved",
                })
            }).catch((err)=>{
                res.status(200).json({
                    message: err.message,
                })
            })
            const createplastic = await plasticClass.save().then()
 
    }else{
        plastic.findOneAndUpdate({name:'plastic'},{$push:{tier1id:TierClass._id}},{new: true}).exec()
        TierClass.save().then((result)=>{
            res.status(200).json({
                message: "tier saved",
            })
        }).catch((err)=>{
            res.status(200).json({
                message: err.message,
            })
        })
    }

}
}
exports.MaddTier1=(req,res)=>{
    
    const id=req.body.id
    tier1.findOneAndUpdate({_id:id},{$set:{name:req.body.newname}},{new: true}).exec().catch(e=>console.log('no id given for update tier 1'))
    res.status(200).json({
        message: "tier name changed",
    })
    
}
exports.DaddTier1=(req,res)=>{
    const id=req.body.id
    tier1.findOneAndRemove({_id:id}).then((result)=>{
        if(result.type=="plastic"){
             plastic.findOneAndUpdate({name:'plastic'},{$pull:{tier1id:result._id}},{new: true}).exec()
             res.status(200).json({
                message: "deleted",
            })
        }else{
             silicon.findOneAndUpdate({name:'silicon'},{$pull:{tier1id:result._id}},{new: true}).exec()
             res.status(200).json({
                message: "deleted",
            })
        }
    }).catch((e)=>{
        console.log(e.message)
    })

    
}
exports.AaddTier2=async (req,res)=>{
    const name=req.body.name
    const tier1id=req.body.tier1id
    const TierClass = new tier2({
        _id: new mongoose.Types.ObjectId(),
        name,
    })
    TierClass.save().then((result)=>{

    })
    tier1.findOneAndUpdate({_id:tier1id},{$push:{tier2:TierClass._id}}).then((result)=>{
        res.status(200).json({
            message: "was updated saved",
        })
    }).catch(e=>console.log("hout donne"))

}
exports.MaddTier2=(req,res)=>{
    const id=req.body.id
    tier2.findOneAndUpdate({_id:id},{$set:{name:req.body.newname}},{new: true}).exec().catch(e=>console.log('no id given tier 2'))
    res.status(200).json({
        message: "tier name changed",
    })
    
}
exports.DaddTier2=(req,res)=>{
    const name=req.body.name
    tier2.findOneAndRemove({name:name}).then((result)=>{
        if(result.type=="plastic"){
             plastic.findOneAndUpdate({name:'plastic'},{$pull:{tier2id:result._id}},{new: true}).exec()
             res.status(200).json({
                message: "deleted",
            })
        }else{
             silicon.findOneAndUpdate({name:'silicon'},{$pull:{tier2id:result._id}},{new: true}).exec()
             res.status(200).json({
                message: "deleted",
            })
        }
    }).catch((e)=>{
        console.log(e.message)
    })
}


/******************ena rani hne ***************** */

/*
const TierClass = new tier2({
    _id: new mongoose.Types.ObjectId(),
    name,
    type:'silicon'
})
if(section=="silicon"){
  const check =  await silicon.findOne({name:'silicon'}).exec()
  if(check==null){
      const siliconClass = new silicon({
          _id:new mongoose.Types.ObjectId,
          name:'silicon',
          tier1id:[],
          tier2id:[TierClass._id]
      })
      TierClass.save().then((result)=>{
        res.status(200).json({
            message: "tier saved",
        })
    }).catch((err)=>{
        res.status(200).json({
            message: err.message,
        })
    })
      const createSiclion = await siliconClass.save().then()

  }else{
    let aaa = silicon.findOneAndUpdate({name:'silicon'},{$push:{tier2id:TierClass._id}},{new: true}).exec()

    TierClass.save().then((result)=>{
        res.status(200).json({
            message: "tier saved",
        })
    }).catch((err)=>{
        res.status(200).json({
            message: err.message,
        })
    })
  }
}else{
    const check =  await plastic.findOne({name:'plastic'}).then()
    if(check==null){
        
        const plasticClass = new plastic({
            _id:new mongoose.Types.ObjectId,
            name:'plastic',
            tier1id:[],
            tier2id:[TierClass._id]
        })
        TierClass.save().then((result)=>{
            res.status(200).json({
                message: "tier saved",
            })
        }).catch((err)=>{
            res.status(200).json({
                message: err.message,
            })
        })
        const createplastic = await plasticClass.save().then()

}else{
    plastic.findOneAndUpdate({name:'plastic'},{$push:{tier2id:TierClass._id}},{new: true}).exec()
    TierClass.save().then((result)=>{
        res.status(200).json({
            message: "tier saved",
        })
    }).catch((err)=>{
        res.status(200).json({
            message: err.message,
        })
    })
}

}
*/
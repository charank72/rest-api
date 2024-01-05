const bcrypt=require('bcryptjs')

const comparePassword=async (pass,extPAss)=>{
  //comparing stored encrypted password with 
  let status=await bcrypt.compare(pass,extPAss)
  return status;
}

module.exports=comparePassword
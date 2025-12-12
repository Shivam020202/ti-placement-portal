const { Recruiter , User , Company } = require('../../models')

async function getAllRecruiters( req , res , next ){
  
  try {
    const recruiters = await Recruiter.findAll({
      include : [User , Company]
    });
    console.log(recruiters);
    res.status(200).json(
      recruiters
    )
  } catch (error) {
    next(error);   
  }
}


async function deleteRecruiter( req , res , next ){
  const { recruiterEmail } = req.params;
  try {
    const deletedUser = await User.destroy({
      where : { email : recruiterEmail }
    });
    
    if(!deletedUser)
      throw new Error("Invalid Recruiter Id");

    res.status(200).json(
      deletedUser
    )
  } catch (error) {
    next(error);
  }
}


module.exports = {
  getAllRecruiters,
  deleteRecruiter
}

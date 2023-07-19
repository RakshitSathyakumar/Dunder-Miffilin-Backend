const getJWTDetails = function(userData,statusCode,res){
    const token = userData.getJWTToken();
    const options = {
        expires:new Date (
            Date.now() + process.env.COOKIE_EXPIRE*24 * 60 * 60 * 1000
        ),
        httpOnly:true,
    }

    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        userData,
        token
    });
};

module.exports = getJWTDetails;
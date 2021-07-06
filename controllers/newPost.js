module.exports = (req,res)=>{
    if(req.session.userId){
        res.render('create')
    }
    else{
        res.render("/auth/login")
    }
}
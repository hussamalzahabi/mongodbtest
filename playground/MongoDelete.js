const mongoose = require("./../server/db/mongoose");
const {users} = require("./../server/model/Users");


/*
users.remove({}).then((result)=>{
    console.log(result)
})
*/


/*
users.findOneAndRemove({_id:"5a888f81c6241ae82b47dc22"}).then((result)=>{

    console.log(result)

})*/

users.findByIdAndRemove("5a888f8cc6241ae82b47dc23").then((result)=>{

    console.log(result)

})
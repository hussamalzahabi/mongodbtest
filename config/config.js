var env = process.env.NODE_ENV || "development";


if (env === "development" || env === "test"){
    let config = require("./config.json") , configEnv = config[env]
    Object.keys(configEnv).forEach((key)=>{
        process.env[key] = configEnv[key]
    })

}
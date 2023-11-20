const express=require('express');
const request = require('request');
const app=express();

app.get('/data',(req,res,next)=>{
    request('https://banzaicloud.com/cloudinfo/api/v1/providers/google/services/compute/regions/asia-east2/products',
     function (error, response, body) {
         res.send(body)
    });  
});
const port =process.env.port || 3000;
app.listen(port,()=>{
    console.log(`From port ${port}`);
});
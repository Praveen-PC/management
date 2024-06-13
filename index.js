const http=require('http')
const express=require('express')
const bodyparser=require('body-parser')
const mongoose=require('mongoose')
const path=require('path')


const app=express()


app.set('views',path.join(__dirname,'views'))
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))
app.use('/images',express.static('images'))

mongoose.connect('mongodb://localhost:27017/MACSOFT-Management')
var db=mongoose.connection; 

 db.once('open',(err,open)=>{
    if(err){
        console.log("error")
    }
    console.log("created db")
 })


app.get('/service-in',(req,res)=>{
    res.render('service-in')
})

app.post('/service-in',(req,res)=>{
    var from=req.body.from;
    var date=req.body.date;
    var productname=req.body.productname;
    var type=req.body.type;
    var quantity=req.body.quantity;
    var remarks=req.body.remark;
    var by=req.body.by;
      

    var data={
        "from":from,
        "date":date,
        "productname":productname,
        "type":type,
        "quantity":quantity,
        "remarks":remarks,
        "by":by
    }
    db.collection('Service').insertOne(data,(err,collection)=>{
        if(err)throw err
        console.log("recorded")
    })
     setTimeout(() => {
      return res.redirect('/service-in')   
    }, 800);   
}) 

app.get('/service-out',(req,res)=>{
    res.render('service-out')
})

app.post('/service-out',(req,res)=>{

     var from=req.body.from;
     var productname=req.body.productname;

     var date=req.body.date;
     var type=req.body.type;
      var quantity=req.body.quantity-req.body.solved;
        
      var old={from:from,productname:productname};
      var update={$set:{date:date,type:type,quantity:quantity}};


      if(quantity!=0){
        db.collection('Service').updateOne(old,update,(err,collection)=>{
           if (err) throw err;
          console.log("1 record updated")
       })
    }
    else{
        var remove={from:req.body.from,productname:req.body.productname}
        db.collection('Service').deleteOne(remove,(err)=>{
          if (err) throw err;
          console.log("All Quantity is dispatched , so particular document is deleted from database")
        })
    }
  

     setTimeout(() => {
        return res.redirect('/service-out')   
      }, 800);

})
 

app.listen(4000 )
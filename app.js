const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const app=express()
const cors=require('cors')
const paymentRouter =require("./routes/payment.route.js");
const CategorieRouter=require("./routes/categorie.route")
const scategorieRouter =require("./routes/scategorie.route")
const articleRouter =require("./routes/article.route")
const chatbotRouter=require("./routes/chatbot.route")
const userRouter = require("./routes/user.route")
const chatbotRequeteRouter = require("./routes/chatbot-requete.route")
const path = require('path');
app.use(express.json())
app.use(cors());
dotenv.config()
app.use(express.static(path.join(__dirname, './client/build'))); 
app.get('*', (req, res) => { res.sendFile(path.join(__dirname,'./client/build/index.html')); });

app.get('/',(req,res)=>{
    res.send("bienvenue dans notre site")
})
//connection a la base de donneé
mongoose.connect(process.env.DATABASECLOUD)
.then(()=>{console.log("connexion a la base de doonée réussie")})
.catch((error)=>{console.log("impossible de se connecter",error)
process.exit()
})
//connecter
app.use("/api/users",userRouter)
app.use("/api/chat",chatbotRouter)
app.use("/api/categories",CategorieRouter)
app.use("/api/article",articleRouter)
app.use('/api/payment',paymentRouter)
app.use('/api/scategories', scategorieRouter);
app.use('/api/chatbot', chatbotRequeteRouter);
app.use(express.static(path.join(__dirname, './client/build'))); 
app.get('*', (req, res) => { res.sendFile(path.join(__dirname,'./client/build/index.html')); });
app.listen(4000,function(){
    console.log(`serveur is listen on port ${process.env.PORT}`)
})
module.export = app ;

 
import {PORT} from './config.js';
import express from 'express'
import mysql2 from 'mysql2'
import bodyParser from 'body-parser';
import { appendFile } from 'fs';
import { parse } from 'path'
import { pool } from './db.js';


var app=express()


app.use(express.static('public'))
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended:true


}))


app.post('/agregarJuego', async (req,res)=>{

    let juego = req.body.videojuego
    let tematica = req.body.tematica
    
    const result = await pool.query('insert into jueguitos values("'+juego+'", "'+tematica+'")')
    

        res.redirect('/getLista')

})
app.post('/eliminarJuego', async(req,res)=>{

    let juego = req.body.juego
    
    const result = await pool.query('delete from jueguitos where nombre="'+juego+'"')
    res.redirect('/getLista')


})

app.post('/actualizarJuego', async(req,res)=>{

    let nombre = req.body.nombre
    let nombreA = req.body.nombreA
    
    const result = await pool.query('update jueguitos set nombre="'+nombreA+'" where nombre ="'+nombre+'"')
    res.redirect('/getLista')

        
})


app.listen(PORT,()=>{
    console.log("Servidor escuchando en el puerto "+PORT)
})

app.get('/getLista',async(req,res)=>{
    
    const [respuesta] = await pool.query('SELECT * FROM jueguitos')
        var jueguitosHTML=``
        var i = 0
        console.log(respuesta)
        respuesta.forEach(jueguitos=>{
            i++
            jueguitosHTML+= `
                            <div class="card clean-card text-center"><img class="card-img-top w-100 d-block" src="assets/img/logoComedor/infamous.png" />
                            <div class="card-body info"><button class="btn btn-primary overlay" type="button"><i class="fas fa-plus"></i> Pendiente</button>
                                <h4 class="card-title">${jueguitos.nombre}</h4>
                                <h4 class="card-title" style="color: var(--bs-code-color);">${jueguitos.tematica}</h4>
                            </div>
                        </div>`
        })

        res.send(`<!DOCTYPE html>
        <html>
        
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
            <title>Store - Brand</title>
            <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&amp;display=swap">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i&amp;display=swap">
            <link rel="stylesheet" href="assets/fonts/fontawesome-all.min.css">
            <link rel="stylesheet" href="assets/fonts/font-awesome.min.css">
            <link rel="stylesheet" href="assets/fonts/fontawesome5-overrides.min.css">
            <link rel="stylesheet" href="assets/css/Login-Form-Basic-icons.css">
            <link rel="stylesheet" href="assets/css/Login-Red.css">
            <link rel="stylesheet" href="assets/css/Ludens---5-Multiple-Cards-inside-Show-v2.css">
            <link rel="stylesheet" href="assets/css/Modal-Login-form.css">
            <link rel="stylesheet" href="assets/css/News-Cards-4-Columns-v2.css">
        </head>
        
        <body style="background:linear-gradient(rgba(47, 23, 15, 0.65), rgba(47, 23, 15, 0.65)), url('assets/img/bg.jpg');">
            <h1 class="text-center text-white d-none d-lg-block site-heading"><span class="text-primary site-heading-upper mb-3"><br><strong>¿JUEGAN CONTIGO COMO SI FUERAS VIDEOJUEGO?</strong><br></span><span class="site-heading-lower"><br>ORDEN GAMER<br></span></h1>
            <nav class="navbar navbar-dark navbar-expand-lg bg-dark py-lg-4" id="mainNav">
                <div class="container"><a class="navbar-brand text-uppercase d-lg-none text-expanded" href="#">Brand</a><button data-bs-toggle="collapse" class="navbar-toggler" data-bs-target="#navbarResponsive"><span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span></button>
                    <div class="collapse navbar-collapse" id="navbarResponsive">
                        <ul class="navbar-nav mx-auto">
                            <li class="nav-item"><a class="nav-link" href="index.html">Ordenar</a></li>
                            <li class="nav-item"><a class="nav-link" href="eliminar.html">eLIMINAR</a></li>
                            <li class="nav-item"><a class="nav-link" href="actualizar.html">aCTUALIZAR</a></li>
                            <li class="nav-item"><a class="nav-link" href="/getLista">cONSULTAR</a></li>
                            </ul>
                    </div>
                </div>
            </nav>
            <section class="page-section cta">
                <div class="container">
                    <div class="row">
                        <div class="col-xl-9 mx-auto">
                            <div class="text-center cta-inner rounded">
                                <h2 class="section-heading mb-5"><span class="section-heading-upper">Vamos</span><span class="section-heading-lower">Acábalos todos</span></h2>
                                <section class="clean-block about-us">
                                    <div class="container" style="text-align: center;">
                                        <h1>Videjuegos en la lista</h1>
                                    </div>
                                    <div class="row justify-content-center" style="margin-top: 10px;margin-right: 0px;margin-left: 0px;">
                                        <div class="col-sm-6 col-lg-4" style="margin-top: 35px;">
                                            ${jueguitosHTML}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="page-section about-heading"></section>
            <script src="assets/bootstrap/js/bootstrap.min.js"></script>
            <script src="assets/js/current-day.js"></script>
        </body>
        
        </html>`)

})
const http = require('http').createServer();
const path = require('path');
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 3000;

const urls = [
    {
        route: '',
        output: 'index.html'

    },

    {   
        route: 'educacion',
        output: 'educacion.html'

    },
    
    {   
        route: 'experiencia',
        output: 'experiencia.html'

    },
    
    {   
        route: 'skills',
        output: 'skills.html'

    },
    
    {   
        route: 'intereses',
        output: 'intereses.html'

    },

    {   
        route: 'contacto',
        output: 'contacto.html'

    },

    /*{   
        route: 'gracias',
        output: 'gracias.html'

    },*/
]

//https://cvenlinea.wiz.com.ar/gracias

function webServer(req, res){

    let pathURL = path.basename(req.url);

   if(pathURL == 'gracias'){
      if(req.method == 'POST'){
         let form = '';
         req.on('data', function(datosParciales){
         form += datosParciales;
                
         req.on('end', function(){
         const dataObject = querystring.parse(form);

         const nombre = dataObject.nombre;
         const email = dataObject.email;
         const telefono = dataObject.telefono;
         const mensaje = dataObject.mensaje;

         res.end(`<h3>Gracias por tu mensaje <em>${nombre}</em>, te estaré contactando a la brevedad!</h3>
                     <a href="https://cvenlinea.wiz.com.ar/gracias">Volver al inicio</a> `);
    
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.USER_NAME,
                pass: process.env.PASS
                }
        });
                  
        const mailOptions = {
            from:process.env.USER_NAME,
            to: process.env.USER_NAME,
            subject: 'Sent mail using Node JS',
            html: `<h3>Datos:</h3><br>Nombre: ${nombre} <br> 
                    Correo Electrónico: ${email} <br> 
                    Teléfono: ${telefono} <br>
                    Mensaje: ${mensaje}` 
        }
                  
        transporter.sendMail(mailOptions, function(error, info) {
            if(error){
                console.log(error);
            }else{
                console.log('Email sent successfully!');
            }
               
        });

        //Configuro la conexión con la BD MySQL
        var con = {    
            host: process.env.DB_HOST, 
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password:process.env.DB_PASS,
            database: process.env.DB_NAME
        }

        con = mysql.createConnection(con);

        con.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                 return;
            }
            console.log('Conexión exitosa a la BD');
            var sql = `INSERT INTO Interesados (name, email, telefono, mensaje) VALUES ('${nombre}', '${email}', '${telefono}', '${mensaje}')`;
            
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
            
        })
               
        })
 
        })

        }
  
    }

   }
   
http
   .on('request', webServer)
   .listen(port);

//console.log('Servidor corriendo en http://localhost:3000')

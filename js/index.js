const http = require ('http');
const form = require ('fs');
const querystring = require ('querystring');
const util = require ('util');
const nodemailer = require ('nodemailer');
const NODE_ENV = process.env.NODE_ENV || 'development';
require ('dotenv').config({
   path: `../.env.${NODE_ENV}`
});

//Configuración del puerto y host del servidor
const port = process.env.PORT || 3000;
const host = '127.0.0.1';

// Configuración del Servidor HTTP en Node.js
http.createServer(function(req, res) {
   
   if(req.method == 'POST'){
      //Leo los datos del formulario
      let info = '';
      req.on('data', datosparciales => {
      info += datosparciales;
      })
      req.on('end', () => {
      let formulario = querystring.parse(info);
      
      res.writeHead(200, {'Content-Type': 'text/html'});

      //Respuesta del servidor al enviar el formulario (en http://localhost:3000)
      res.end(`<!DOCTYPE html>
      <html>
      <head> 
         <meta charset="UTF-8">
      </head>
      <body>

    <h3> Muchas gracias por tu mensaje ${formulario.nombre}, en breve te estaré respondiendo!</h3>

    <a href="http://localhost:52330/index.html">Volver al inicio</a>
    
    </body>
    </html>
    
    `);

    //Establezco la conexión con la base de Datos MySQL
      var mysql = require('mysql');

      //Datos provenientes del formulario a ser insertados en la DB
      var name = formulario.nombre;
      var email = formulario.email;
      var telefono = formulario.telefono;
      var mensaje = formulario.mensaje;

      var con = mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'formdb'
      });
      
      con.connect(function(err) {
      if (err) {
         console.error('error connecting: ' + err.stack);
         return;
      }
      console.log('Conexión exitosa a la BD');
      var sql = `INSERT INTO Interesados (name, email, telefono, mensaje) VALUES ('${name}', '${email}', '${telefono}', '${mensaje}')`;
      console.log(`${name}, ${email}, ${telefono}, ${mensaje}`);
      
      con.query(sql, function (err, result) {
         if (err) throw err;
         console.log(result);
      });
      });

      //Variables de entorno USER_NAME y PASS para autenticación de cuenta de correo electrónico
      const user = process.env.USER_NAME;
      const pass = process.env.PASS;

      //Configuración del correo electrónico
      const transporter = nodemailer.createTransport({
         service: 'gmail',
         host: 'smtp.gmail.com',
         port: 465,
         auth: {
            user: user,
            pass: pass
         }
      });

      const mailOptions = {
         from:'juancsuarezl@gmail.com',
         to: 'juancsuarezl@gmail.com',
         subject: 'Sent mail using Node JS',
         html: `<h3>Datos:</h3><br>Nombre: ${formulario.nombre} <br> Correo Electrónico: ${formulario.email} <br> Teléfono: ${formulario.telefono} <br>Mensaje: ${formulario.mensaje}` 
      }

      transporter.sendMail(mailOptions, function(error, info) {
         if(error){
            console.log(error);
         }else{
            console.log('Email sent successfully!');
         }
      })
            
   })
   res.writeHead(200, {'Content-type': 'text/html'});

}

}).listen(port, host);

console.log(`Servidor corriendo en el puerto ${port}`);




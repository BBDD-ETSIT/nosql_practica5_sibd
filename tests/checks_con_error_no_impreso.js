// IMPORTS
const path = require('path');
const User = require('../user.json');

// CRITICAL ERRORS
let error_critical = null;
let dbname = "data";
let coleccionresults = "results";
let coleccionpartials = "partials";
const URL = 'mongodb://localhost:27017/' + dbname;
let connection;

const mongoose = require('mongoose');
let Admin = mongoose.mongo.Admin;

let withDebug = true;
const debug = (...args) => {
    if(withDebug){
      console.log(...args);
    }
}

let dbexists = false;

describe("Using Mongo Aggregation Framework", function () {

    before(async function() {
        console.log("COMPROBACIONES PREVIAS")
        console.log("Comprobando que la base de datos está arrancada y acepta conexiones...")
        try {
            await mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true, socketTimeoutMS: 3000, connectTimeoutMS:3000, serverSelectionTimeoutMS: 2000});
            //connection = await mongoose.createConnection(URL, {useNewUrlParser: true, useUnifiedTopology: true, socketTimeoutMS: 3000, connectTimeoutMS:3000, serverSelectionTimeoutMS: 2000});
            //should.exist(connection);
            console.log("La base de datos está ok, hemos conseguido conectar!");
            console.log("\n\n");
        } catch (err) {
            console.log("ERR", err);
            console.log("No se ha podido conectar al servidor de MongoDB, comprueba que ejecutaste el demonio (mongod) y que el puerto está libre y la base de datos quedó a la espera de conexiones.");
        }
    });


    it('0: Comprobando que existe la base de datos y las colecciones ...', async function() {
console.log("ASAAAXXXXXXXXXXXXXXX");
        this.score = 1;
        this.msg_ok = `Todo ok, hemos conseguido conectar a la base de datos "${dbname}" y la colección "${coleccion}"  `;
        this.msg_err = `No se ha podido conectar a la colección pedida. Comprueba que tienes una base de datos de nombre ${dbname} y la colección ${coleccionpartials} y la colección ${coleccionresults} .`;
          return new Promise(function(resolve, reject) {
            try {
              console.log("XXXXXXXXXXXXXXX");
                resolve();
            } catch (err) {
              console.log("ERR", err);
              should.not.exist(err);
              reject(err);
            }
          });
    });

    //
    // it('1. Recuento plaquetas medio ojos grises. Comprobando funcionalidad ...', async function() {
    //   this.score = 0.5;
    //   this.msg_ok = `El documento insertado en "partials" existe y es correcto`;
    //   this.msg_err = `El documento insertado en "partials" no existe o no es correcto`;
    //   try {
    //     let doc = await Partial.findOne({mediagrises: 275391.558018018});
    //     debug("DOC: ", doc);
    //     should.exist(doc);
    //   } catch(e){
    //     debug("ERROR:", e);
    //     should.not.exist(e);
    //   }
    // });



    after(function() {
        console.log("Cerramos la conexión con la BBDD");
        mongoose.connection.close();
    });

});

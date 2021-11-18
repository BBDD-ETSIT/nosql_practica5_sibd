// IMPORTS
const path = require('path');
const User = require('../user.json');

// CRITICAL ERRORS
let error_critical = null;
let dbname = "samples";
let coleccionresults = "results";
let coleccionpartials = "partials";
const URL = 'mongodb://localhost:27017/' + dbname;
let connection;

const mongoose = require('mongoose');
let Admin = mongoose.mongo.Admin;
const Partial = require('./partial');
const Result = require('./result');

let withDebug = false;
const debug = (...args) => {
    if(withDebug){
      console.log(...args);
    }
}

let dbexists = false;

describe("Using Mongo SHELL", function () {

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


    it('0: Comprobando que existe la base de datos y la colección ...', async function() {
        this.score = 1;
        this.msg_ok = `Todo ok, hemos conseguido conectar a la base de datos "${dbname}" y la colección "${coleccionpartials}" y la colección "${coleccionresults}"  `;
        this.msg_err = `No se ha podido conectar a las colecciones pedidas. Comprueba que tienes una base de datos de nombre ${dbname} y la colección "${coleccionpartials}" y la colección "${coleccionresults}" .`;
          return new Promise(function(resolve, reject) {
            console.log("XXX")
            try {
                new Admin(mongoose.connection.db).listDatabases(function(err, result) {
                    var allDatabases = result.databases.map((dat)=>dat.name);
                    debug('listDatabases succeeded', allDatabases);
                    dbexists = allDatabases.includes(dbname);
                    dbexists.should.be.equal(true);
                    mongoose.connection.db.listCollections().toArray(function (err, names) {
                        if(err) throw err;
                        let colnames = names.map((dat)=>dat.name);
                        colnames.includes(coleccionresults).should.be.equal(true);
                        colnames.includes(coleccionpartials).should.be.equal(true);
                        debug('listCollections succeeded', colnames);
                        resolve();
                    });
                });
            } catch (err) {
              console.log("ERR", err);
              should.not.exist(err);
              reject(err);
            }
          });
    });


    it('1. Recuento plaquetas medio ojos grises. Comprobando funcionalidad ...', async function() {
      this.score = 1;
      this.msg_ok = `El documento insertado en "partials" existe y es correcto`;
      this.msg_err = `El documento insertado en "partials" no existe o no es correcto`;
      try {
        let doc = await Partial.findOne({mediagrises: 275391.558018018});
        debug("DOC: ", doc);
        should.exist(doc);
      } catch(e){
        debug("ERROR:", e);
        should.not.exist(e);
      }
    });


    it('2. Colesterol HDL inferior a 43. Comprobando funcionalidad ...', async function() {
      this.score = 1;
      this.msg_ok = `El documento insertado en "partials" existe y es correcto`;
      this.msg_err = `El documento insertado en "partials" no existe o no es correcto`;
      try {
        let doc = await Partial.findOne({HDLbajo: 3634});
        debug("DOC: ", doc);
        should.exist(doc);
      } catch(e){
        debug("ERROR:", e);
        should.not.exist(e);
      }
    });


    it('3. Mínimo Hierro de los individuos que miden igual o más de 2.09. Comprobando funcionalidad ...', async function() {
      this.score = 1;
      this.msg_ok = `El documento insertado en "partials" existe y es correcto`;
      this.msg_err = `El documento insertado en "partials" no existe o no es correcto`;
      try {
        let doc = await Partial.findOne({MinHierro: 62.6625});
        debug("DOC: ", doc);
        should.exist(doc);
      } catch(e){
        debug("ERROR:", e);
        should.not.exist(e);
      }
    });


    it('4. Valores típicos de la saturación de oxígeno. Comprobando funcionalidad ...', async function() {
      this.score = 1;
      this.msg_ok = `El documento insertado en "partials" existe y es correcto`;
      this.msg_err = `El documento insertado en "partials" no existe o no es correcto`;
      try {
        let doc = await Partial.findOne({muestras: [95 , 97]});
        debug("DOC: ", doc);
        should.exist(doc);
      } catch(e){
        debug("ERROR:", e);
        should.not.exist(e);
      }
    });


    it('5. Hematocritos. Comprobando funcionalidad ...', async function() {
      this.score = 1;
      this.msg_ok = `El documento insertado en "partials" existe y es correcto`;
      this.msg_err = `El documento insertado en "partials" no existe o no es correcto`;
      try {
        let doc = await Partial.findOne({hematocritos: 14940});
        debug("DOC: ", doc);
        should.exist(doc);
      } catch(e){
        debug("ERROR:", e);
        should.not.exist(e);
      }
    });

    it('6. Resultado final. Comprobando funcionalidad ...', async function() {
      this.score = 3;
      this.msg_ok = `Los documentos insertados en "results" existen`;
      this.msg_err = `Los documentos insertados en "results" no existen o no son correctos`;
      try {
        let doc = await Result.findOne({"_id" : 75269});
        debug("DOC: ", doc);
        should.exist(doc);
        let doc2 = await Result.findOne({"_id" : 113178});
        debug("DOC: ", doc2);
        should.exist(doc2);
        let doc3 = await Result.findOne({"_id" : 216659});
        debug("DOC: ", doc3);
        should.exist(doc3);
        let doc4 = await Result.findOne({"_id" : 244778});
        debug("DOC: ", doc4);
        should.exist(doc4);
      } catch(e){
        debug("ERROR:", e);
        should.not.exist(e);
      }
    });

    it('7. Resultado final, projection. Comprobando funcionalidad ...', async function() {
      this.score = 1;
      this.msg_ok = `Los documentos insertados en "results" existen y tienen los campos adecuados`;
      this.msg_err = `Los documentos insertados en "results" no existen o no son correctos`;
      try {
        let doc = await Result.findOne({"_id" : 75269});
        debug("DOC: ", doc);
        should.not.exist(doc.address);
        let doc2 = await Result.findOne({"_id" : 113178});
        debug("DOC: ", doc2);
        should.not.exist(doc2.bioquimica);
        let doc3 = await Result.findOne({"_id" : 216659});
        debug("DOC: ", doc3);
        should.not.exist(doc3.code);
        let doc4 = await Result.findOne({"_id" : 244778});
        console.log("DOC: ", doc4.eye);
        should.not.exist(doc4.eye);
      } catch(e){
        debug("ERROR:", e);
        should.not.exist(e);
      }
    });

    after(function() {
        console.log("Cerramos la conexión con la BBDD");
        mongoose.connection.close();
    });

});

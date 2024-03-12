const {MongoClient,ObjectId} =require("mongodb");
require ("dotenv").config()

function conectar(){

    return MongoClient.connect(process.env.URL_DB);
}


function leerColores(){

    return new Promise(async (ok,ko)=>{

        try{

        const conexion = await conectar();//nos conectamos a la base de datos

        let coleccion =conexion.db("colores").collection("colores")//nos conectamos a nuestra carpeta de la base de datos

        let colores = await coleccion.find({}).toArray();//le decimos que encuentre el objeto de la base de datos  y lo convierta en un array

        conexion.close()//cortamos la conexion

        ok(colores)//devolvemos el array de colores al cumplirse la promesa
        
        }catch(error){

            ko({error :"error en base de datos"})
        }

    })

}

function crearColor(color){

    return new Promise(async (ok,ko)=>{

        try{

        const conexion = await conectar();//nos conectamos en la base de datos

        let coleccion =conexion.db("colores").collection("colores")//nos conectamos mi coleccion de colores en la base de datos

        let {insertedId} = await coleccion.insertOne(color);

        conexion.close()

        ok({id:insertedId})
        
        }catch(error){

            ko({error :"error en base de datos"})
        }

    })

}

function borrarColor(id){

    return new Promise(async (ok,ko)=>{

        try{

        const conexion = await conectar();

        let coleccion =conexion.db("colores").collection("colores")

        let {deletedCount} = await coleccion.deleteOne({_id:new ObjectId(id)});

        conexion.close()

        ok(deletedCount)
        
        }catch(error){

            ko({error :"error en base de datos"})
        }

    })

}

module.exports = {leerColores,crearColor,borrarColor}
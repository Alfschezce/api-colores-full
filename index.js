const  express =require("express");//me gtraigo express
const{json} =require("body-parser");//me traigo json

const cors =require("cors")
require ("dotenv").config()//me traigo para la conexion como virtual

const {leerColores,borrarColor,crearColor} =require("./db")
const servidor = express()//ponemos en marcha el servidor

servidor.use(cors())//usamos cors

servidor.use(json());//para extraer el cuerpo de la peticion


//servidor.use("/mentirillas",express.static("./pruebas"));//mentirillas apunta a la carpeta pruebas




servidor.get("/colores",async(peticion,respuesta)=>{

    try{


        let colores = await leerColores();

        colores =colores.map(({_id,r,g,b})=> { return {id :_id,r,g,b}});

        respuesta.json(colores)

    }catch(error){

        respuesta.status(500)
        respuesta.json(error)


    }

  




});

servidor.post("/colores/nuevo",async(peticion,respuesta,siguiente)=>{

    let {r,g,b} = peticion.body

    let valido =true;

    [r,g,b].forEach(n=>valido =valido&& n>=0 && n<=255);//ESTO ES LO DIFICIL VALIDAR LO QUE SE ESTA ESCRIBIENDO

    if(valido){

        try{

            let resultado = await crearColor({r,g,b})
            return respuesta.json(resultado)

        }catch(error){

            respuesta.status(500)
            return respuesta.json(error)
        }
    
        
    }


    
 
    siguiente({error:"faltan parametros"})
});

servidor.delete("/colores/borrar/:id([a-f0-9]{24})", async(peticion,respuesta)=>{

    try{
        let cantidad = await borrarColor(peticion.params.id);
        
        return respuesta.json({resultado :cantidad  ? "ok" : "ko"});

    }catch(error){

        respuesta.status(500);
        return respuesta.json(error);


    }  
    
});



servidor.use((error,peticion,respuesta,siguiente)=>{

    respuesta.status(400)
    respuesta.json({error:"error en la peticion"})
});

 //cuando la url esta mal por ejemplo /hola o por ejemplo peticion post a /colores
servidor.use((peticion,respuesta)=>{

    respuesta.status(404)
    respuesta.json({error: "recurso no encontrado"})
})


servidor.listen(process.env.PORT); //ponemos donde escucha el servidor
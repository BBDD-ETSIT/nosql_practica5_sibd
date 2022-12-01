<img  align="left" width="150" style="float: left;" src="https://www.upm.es/sfs/Rectorado/Gabinete%20del%20Rector/Logos/UPM/CEI/LOGOTIPO%20leyenda%20color%20JPG%20p.png">
<img  align="right" width="60" style="float: right;" src="http://www.dit.upm.es/figures/logos/ditupm-big.gif">


<br/><br/>


# Practica ReplicaSet + Sharding

## 1. Objetivo

- Familiarizarse con el funcionamiento de un sistema de bases de datos replicado y particionados, en concreto con ReplicaSet y Sharding de MongoDB
- Integrar en un servicio Web una base de datos en alta disponibilidad mediante dichas réplicas y mejorar la eficiencia a través del particionamiento

## 2. Dependencias

Para realizar la práctica el alumno deberá tener instalado en su ordenador:
- Herramienta GIT para gestión de repositorios [Github](https://git-scm.com/downloads)
- Entorno de ejecución de javascript [NodeJS](https://nodejs.org/es/download/) version 16 o 18
- Base de datos NoSQL [MongoDB](https://www.mongodb.com/download-center/community). Debe de poder ejecutar mongod y mongos

## 3. Descripción de la práctica

En esta práctica el alumno aprenderá por un lado a configurar y a operar con un ReplicaSet de MongoDB para ofrecer a un servicio Web alta disponibilidad en términos de persistencia. Y por otro lado aprenderá como configurar un particionamiento para mejorar la eficiencia de almacenamiento y de busqueda de información. El objetivo final de la práctica es ser capaz de desplegar de manera sencilla el siguiente escenario usando múltiples instancias de mongoDB que se ejecutarán en el mismo ordenador. A continuación se explica la función de cada módulo de la figura.

![](https://raw.githubusercontent.com/ging/nosql_practica5_sibd/main/img/arquitectura.png)

- App Gestión de Pacientes: se trata del servidor Web desarrollado en la práctica relativa a ODMs correspondiente de la asignatura. El servidor incluido en este repositorio escucha peticiones en http://localhost:8001 y se conectará a través de un router de Mongodb, Mongo (en localhost:27006), con dos clúster que contienen información particionada y replicada de los pacientes. Para saber a que clúser se debe dirigir el router, contaremos con el localizador de MongoDB llamado Config Server.

- config_server: se trata de un clúster replicaSet conformado por una única instancia de mongo desplegada en localhost:27001.

- shard_servers_1: se trata de un clúster replicaSet que contendrá parte de la información de los pacientes. Estará conformado por dos instancias de mongo: una primaria en localhost:27002 y otra secundaria en localhost:27003.

- shard_servers_2: se trata de un clúster replicaSet que contendrá la otra parte de la información de los pacientes. Estará conformado por dos instancias de mongo: una primaria en localhost:27003 y otra secundaria en localhost:27004.

## 4. Descargar e instalar el código del proyecto

Abra un terminal en su ordenador y siga los siguientes pasos.

El proyecto debe clonarse en el ordenador desde el que se está trabajando con:

    ```
    $ git clone https://github.com/BBDD-ETSIT/nosql_practica5_sibd
    ```

y entrar en el directorio de trabajo

    ```
    $ cd nosql_practica5_sibd
    ```

Una vez dentro de la carpeta, se instalan las dependencias con:

    ```
    $ npm install
    ```

Crear 4 carpetas (fuera de la carpeta del proyecto) para que allí se almacenen los datos de cada una de las instancias de mongo que se desplegarán:


    ```
    $ cd algunotrodirectorio
    $ mkdir data_patients
    $ mkdir data_patients/config data_patients/shard1_1 data_patients/shard1_2 data_patients/shard2_1 data_patients/shard2_2
    ```


## 5. Tareas a realizar

Antes comentar que en una situación real, cada instancia de mongo que ejecutaremos debe estar en un servidor separado, pero para nuestras pruebas vamos a hacer que las diferentes instancais de mongo se arranquen en la misma máquina pero en distintos puertos. Por otro lado, los comando que a continuación se exponen se ejecutan en Ubuntu. Si teneis otro Sistema Operativo, como Windows, para ejecutar mongod o mongos debeis abrir una PowerShell e ir al directorio donde teneis almacenado mongod.exe y mongos.exe. Además, deben indicar la ruta absoluta de donde se encuentra la carpeta data_patients, por ejemplo si el repositorio ha sido clonado en el escritorio la instrucción a ejecutar sería similar a esta: PS C:\Archivos de programa\MongoDB\Server\4.2\bin>.\mongod --port 27001 —dbpath C:\Users\usuarioX\Desktop\algunotrodirectorio\data_patients\shard1_1....

Se deben usar los mismos puertos que los mostrados en la figura. Si esta realizando la práctica desplegando instancias de Docker con Mongo asegurese de que ha realizado bien el mapeo de puertos entre el contenedor y el host.


1. En primer lugar arrancaremos y configuraremos el config server que contendrá la información acerca de a que partición dirigirse para obtener determinados datos de un paciente. Para ello, necesitamos:
    - Un directorio de datos por cada servidor de la réplica (creado en la anterior sección)
    - Un puerto para el servidor (indicado en la figura anteriormente mostrada)
    - Indicar que se arranquen en modo configsvr y además en modo replicaSet, indicando el id de dicho replica set (config_servers).

    En un terminal de Ubuntu, en el directorio que contiene la carpeta data_patients, ejecutamos la siguiente instrucción:
     ```
    mongod --configsvr --replSet config_servers --port 27001 --dbpath data_patients/config
    ```
    Una vez arrancado, desde otro terminal, nos conectamos al servidor que va a actuar como primario
    ```
    mongo --host localhost:27001
    ```
    Inicialice el replicaSet del config server como hemos visto en las trasparencias de clase, teniendo en cuenta que solo hay una instancia de mongo dentro del clúster y que debemos especificar que se trata de un config server.

2. A continuación, arrancaremos los clúster para almacenar la información particionada. Para ello, necesitamos:
    - Cuatro directorios de datos para cada una de las instancias de mongo (creados en la anterior sección)
    - Un puerto para cada servidor (indicado en la figura anteriormente mostrada)
    - Indicar que se arranquen en modo replicaSet, indicando el id correspondiente para cada replica set (shard_servers_1 y shard_servers_2)
    - Indicar que se arranquen en modo sharding 

    En cuatro terminales de Ubuntu, en el directorio que contiene la carpeta data_patients, ejecutamos en cada uno las siguiente instrucción:
    ```
    mongod  --shardsvr --replSet shard_servers_1 --port 27002 --dbpath data_patients/shard1_1 --oplogSize 50
    mongod  --shardsvr --replSet shard_servers_1 --port 27003 --dbpath data_patients/shard1_2 --oplogSize 50
    mongod  --shardsvr --replSet shard_servers_2 --port 27004 --dbpath data_patients/shard2_1 --oplogSize 50
    mongod  --shardsvr --replSet shard_servers_2 --port 27005 --dbpath data_patients/shard2_2 --oplogSize 50
    ```
    Una vez arrancados debe incializr los replicaSet para cada uno de los shards. Para ello, desde otro terminal nos conectaremos (como en el paso anterior) en primer lugar a la shell de mongo de localhost:27002 y después a localhost:27004 para configurar en cada uno el replicaSet correspondiente. El primero de ellos estará compuesto de localhost:27002 y localhost:27003 donde localhost:27002 debe tener una prioridad de 900 y localhost:27003 con prioridad de 700. El segundo de ellos estará compuesto de localhost:27004 y localhost:27005 donde localhost:27004 debe tener una prioridad de 600 y localhost:27005 con prioridad de 300.


3. Una vez configurado los clúster de particionamiento, arrancaremos el router Mongos. Para ello, necesitamos:
    - Indicar el host y puerto donde se arranca el router (indicado en la figura anteriormente mostrada)
    - Indicar el replicaSet correspondiente a los config servers.
    ```
    mongos --configdb config_servers/localhost:27001 --port 27004
    ```

4. En este paso, debe conectarse al router Mongos y añadir cada uno de los shards como se ha visto en las trasparencias de clase. Una vez realizado, cree un base de datos llamada "bio_bbdd" y una colección dentro de ella llamada "patients". Habilite el sharding en esa base de datos y defina una clave de particionamiento hashed para el atributo "dni" (el cual se creará a posteriori). IMPORTANTE: se debe hacer este paso obligatoriamente antes que el siguiente, ya que de otra manera el particionamiento no se hará efectivo.



5. En este momento, debería de tener bien configurado las particiones. Puede ejecutar algunos comandos vistos en clase para ver el estado. A continuación, en el terminal y dentro del directorio donde hemos clonado el código de la práctica, ejecutamos los seeders para que añadir una serie de pacientes por defecto a nuestro replicaSet:

    ```
    npm run seed
    ```
    
    
5. Compruebe que los pacientes se han guardado en cada una de los Mongos desplegados, de forma particionada, accediendo a la shell de cada uno de ellos y ejecute las operaciones que considere. Recuerde que, para poder rejecutar operaciones de lectura dentro de la shell de mongo de los nodos secundarios, debe ejecutar rs.slaveOk() previamente (o si esta usando Mongo en su versión 5 debe ejecutar rs.secondaryOk() ).

6. Una vez comprendido el funcionamiento del escenario debe establecerse la conexión a la réplica desde la aplicación. Para ello, el alumnos debe modificar la conexión en el fichero rest_server.js e incluir los valores correspondientes para que la aplicación se conecte al router Mongos y a la base de datos antes creada. Revise las transparencias de clase de ReplicaSet y Sharding para ver como hacerlo con Mongoose.

7. Ejecutar el servidor de la aplicación web de gestión de pacientes

    ```
    npm start
    ```

8. Insertar un nuevo paciente cuyo DNI sea el token del moodle del alumno por medio de la aplicación web de gestión de pacientes.

9. Verificar que los datos se han escrito solamente en uno de los shards y que además se respeta el delay en el servidor de mongo que actúa como secundario dentro de ese shard.

10. Sin detener la ejecución de las instancias de mongo. Añadir un una nueva instancia de mongo (localhost:27007) al primer shard (shard_servers_1). Esta Instancia debe estar configurado como arbiterOnly. Nuevamente cree un directorio especifico para esta instancia (Ej: data_patients/shard1_3), arranque una nueva instancia con mongod en otro terminal y consulte las transparencias de clase para ver como incluir un arbitro en el replicaSet.

## 6. Prueba de la práctica 

Para ayudar al desarrollo, se provee una herramienta de autocorrección que prueba las distintas funcionalidades que se piden en el enunciado.

La herramienta de autocorrección preguntará por el correo del alumno y el token de Moodle. En el enlace [https://www.npmjs.com/package/autocorector](https://www.npmjs.com/package/autocorector) se proveen instrucciones para encontrar dicho token.


```
$ npx autocorector
```

Se puede pasar la herramienta autocorector tantas veces como se desee sin ninguna repercusión en la calificación.

## 7. Instrucciones para la Entrega y Evaluación.

Una vez satisfecho con su calificación, el alumno puede subir su entrega a Moodle con el siguiente comando:
```
$ npx autocorector --upload
```

El alumno podrá subir al Moodle la entrega tantas veces como desee pero se quedará registrada solo la última subida.

**RÚBRICA**: Cada método que se pide resolver de la practica se puntuara de la siguiente manera:
-  **1.5 punto por cada uno de las siguientes funciones realizadas:**  Numero de réplicas desplegadas correctamente y replica principal con prioridad 900
-  **2 puntos por cada uno de las siguientes funciones realizadas:**  Conexión de la aplicación al replicaSet y añadir un arbitro a la replica posteriormente 
-  **3 puntos por cada uno de las siguientes funciones realizadas:**  Una replica secundaria con prioridad 0 más delay de 60 segundos (1,5 cada configuración)


Si pasa todos los tests se dará la máxima puntuación. 

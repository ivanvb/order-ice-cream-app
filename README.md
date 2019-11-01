# Ice Cream Ordering APP

Este proyecto busca satisfacer los requerimientos de la empresa Rantic, que en una breve introducción consisten en:

> La empresa Rantic es una de las empresas más grandes en la industria de la construcción de software hecho a la medida. A raíz de una encuesta realizada recientemente, se ha demostrado que al 92% de sus colaboradores les gusta comer helado con sus compañeros de trabajo. Sin embargo, debido a la gran cantidad de colaboradores que trabajan en la organización esta es una actividad que se ha tornado compleja.
>
>La empresa requiere de tus servicios para poder solucionar esta problemática que ha disminuido la productividad de sus colaboradores.


## Getting Started

Para tener este proyecto funcionando hay que hacer un clone a este repositorio

```
https://github.com/ivb98/order-ice-cream-app.git
```

Una vez tenemos el proyecto en nuestra máquina tenemos que hacer
```
npm install
```
desde la raiz del directorio, esto creará el folder ```node_modules``` con todas las dependencias necesarias para el correcto funcionamiento del código.

En la ruta ```order-ice-cream-app/server``` debe crearse el archvio ```.env``` en el cual se deben declarar las variables de entorno que utiliza la aplicación para su correcto funcionamiento.

El archivo debe quedar tal que

```
DATABASE_URL = url/to/database

TEST_DATABASE_URL = url/to/testdatabase    #Url de la base de datos usado para testing.

EMAIL = myemail@email.com    #Email que se utiliza para enviar los correos.

PASSWORD = mypassword    #Password del email.
```

Una vez se ha configurado todo esto, desde la raiz del directorio ejecutaremos el comando

```
npm run server
```
Este comando transpila el código Typescript que se encuentra dentro de la carpeta ```order-ice-cream-app/server/src/``` a Javascript dentro de la carptea ```order-ice-cream-app/server/dist/``` y luego corre el archivo ```index.js```.

## Running the tests

Para realizar los tests del servidor dentro del fichero ```server``` se ejecuta el comando 
```
npm run test
```
O desde la raíz del proyecto se ejecuta el comando
```
npm run server-test
```
dando cualquiera de estos el resultado de ejecutar los tests hechos en [Mocha](https://mochajs.org/) que prueban diversos aspectos de la aplicación.

## Built With

* [Node.js](https://nodejs.org/es/) 
* [Express](https://expressjs.com/es//)
* [MongoDB](https://www.mongodb.com/es)
* [Typescript](https://www.typescriptlang.org/index.html)
* [Mocha](https://mochajs.org/) - For testing

## Authors

* **Iván Valette**
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

En la ruta ```order-ice-cream-app/server``` debe crearse el archvio ```.env``` en el cual se debe declarar la variable de entorno ```DATABASE_URL``` la cual debe contener el string de conexión a una base de datos en [MongoDB](https://www.mongodb.com/es).

El archivo debe quedar tal que

```
DATABASE_URL = url/to/database
```

Una vez se ha configurado todo esto, desde la raiz del directorio ejecutaremos el comando

```
npm run server
```
Este comando transpila el código Typescript que se encuentra dentro de la carpeta ```order-ice-cream-app/server/src/``` a Javascript dentro de la carptea ```order-ice-cream-app/server/dist/``` y luego corre el archivo ```index.js```.

## Built With

* [Node.js](https://nodejs.org/es/)
* [Express](https://expressjs.com/es//)
* [MongoDB](https://www.mongodb.com/es)
* [Typescript](https://www.typescriptlang.org/index.html)

## Authors

* **Iván Valette**
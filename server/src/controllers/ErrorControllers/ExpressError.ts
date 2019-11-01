/**
 * Clase que representa un error de Express el cual
 * será enviado al cliente su una petición hecha
 * por este sale mal.
 */
export class ExpressError implements NodeJS.ErrnoException{
    ///Nombre del error.
    public name: string;
    
    /**
     * Construye un nuevo error.
     * @param message Mensaje de error
     * @param code Codigo del error
     * @param status HTTP status a retornar
     */
    constructor(public message: string, public code: string, public status: number){ }
}
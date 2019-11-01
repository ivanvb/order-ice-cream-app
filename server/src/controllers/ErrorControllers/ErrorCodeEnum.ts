/**
 * Códigos de error que retorna el API cuando una petición
 * falla o alguno de los datos necesarios para su correcto
 * funcionamiento resulta erróneo.
 */
export enum ErrorCodes{
    WRONG_CREDENTIALS = "1001",
    INCOMPLETE_INFORMATION = "1002",
    INCORRECT_DATE = "1003",
    RESOURCE_NOT_FOUND = "1004",
    GENERIC_UPDATE_ERROR = "1005",
    GENERIC_DELETE_ERROR = "1006",
    GENERIC_ERROR = "1007",
    DUPLICATED_EMAIL = "1008"
}
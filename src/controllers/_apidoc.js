/**
 *  @apiDefine UserNotFoundError
 *
 *  @apiError UserNotFound Dado(s) solicitado(s) não encontrado(s).
 *
 *  @apiErrorExample {json} Not found
HTTP/1.1 (404) Not Found
{
  "message": "Não encontrado.",
  "data": null,
  "metadata": {},
  "status": 404
}
 */

/**
 *  @apiDefine DataConflict
 *
 *  @apiError DataConflict Retorna um erro caso haja dado(s) já cadastrado(s).
 *
 *  @apiErrorExample {json} Conflict
HTTP/1.1 (409) Data Conflict
{
  "message": "Dado(s) já cadastrado(s).",
  "data": null,
  "metadata": {},
  "status": 409
}
 */

/**
 * @apiDefine UnauthorizedJwtExpired
 *
 * @apiError UnauthorizedJwtExpired JSON Web Token expirado.
 *
 * @apiErrorExample {json} Expired
HTTP/1.1 (401) Unauthorized Jwt
{
  "message": "Invalid token - jwt expired",
  "data": null,
  "metadata": {},
  "status": 401
}
 */

/**
 * @apiDefine UnauthorizedToken
 *
 * @apiError UnauthorizedToken Token não passado via Bearer Authorization.
 *
 * @apiErrorExample {json} Token
HTTP/1.1 (401) Unauthorized Token
{
  "message": "Invalid token - token",
  "data": null,
  "metadata": {},
  "status": 401
}
 */

/**
 * @apiDefine UnauthorizedSector
 *
 * @apiError UnauthorizedSector Decoded token com dados inválidos.
 *
 * @apiErrorExample {json} Sector
HTTP/1.1 (401) Unauthorized Decoded Sector
{
  "message": "Invalid token - sector",
  "data": null,
  "metadata": {},
  "status": 401
}
 */

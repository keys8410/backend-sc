/**
 * @api {get} /users Users
 *@apiVersion 0.0.1
 *@apiGroup Autenticação
 *@apiDescription Retorna todos os produtos da API
 *
 *@apiHeader {string} user Nome do Usuário
 *@apiHeader {string} hashPass Senha Criptografada
 *@apiHeader {Number} [keep=0] Se mantém logado
 *
 *@apiHeaderExample {json} Request-Example:
 *{
 *   "user": "gk.yanzinh@yahoo.com.br",
 *   "hashPass": "402562bbebdabd3dc1c86ad268ab3136aebd1756",
 *    "keep": 1
 *}
 *@apiSuccess {String} status Mensagem de acesso autorizado
 *@apiSuccess {String} token Token de Acesso
 *
 *@apiSuccessExample {json} Sucesso
 *   HTTP/1.1 200 OK
 *   {
 *     "status": "Logado!"
 *     "token": "c447c5b517efa57e04e1a4732b2a3b5df82f9d72"
 *   }
 *
 *@apiError {String} status Mensagem de acesso negada
 *
 *@apiErrorExample {json} Error
 *   HTTP/1.1 406 Not Acceptable
 *   {
 *     "status": "Usuário ou Senha incorretos"
 *   }
 *
 */

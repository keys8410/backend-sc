/**
 *  @apiDefine UserNotFoundError Dado(s) solicitado(s) não encontrado(s).
 *
 *  @apiError UserNotFound
 *
 *  @apiErrorExample {json} Error
 *    HTTP/1.1 404 Not Found
 *    {
 *      "message": "Não encontrado."
 *      "metadata": {},
 *      "status": 404
 *    }
 */

/**
 *  @apiDefine DataConflict Retorna um erro caso haja dado(s) já cadastrado(s).
 *
 *  @apiError DataConflict
 *
 *  @apiErrorExample {json} Error
 *    HTTP/1.1 404 Not Found
 *    {
 *      "message": "Dado(s) já cadastrado(s)."
 *      "metadata": {},
 *      "status": 500
 *    }
 */

/**
 *  @api {get} /users/
 *  @apiVersion 0.0.1
 *  @apiGroup Users
 *  @apiDescription Retorna todos os funcionários
 *
 *  @apiSuccessExample {json} Sucess
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Requisição efetuada com sucesso.",
 *      "data": {
 *        "total": n,
 *        "users": [
 *          {
 *            "id": 1,
 *            "name": "Yan Almeida Garcia",
 *            "about": "Apenas um teste!",
 *            "sector": "Direção"
 *          },
 *          {
 *            ...
 *          }
 *        ]
 *      },
 *      "metadata": {},
 *      "status": 200
 *    }
 *
 * @apiUse UserNotFoundError
 */

/**
 * @api {get} /users/:id_usuario
 * @apiVersion 0.0.1
 * @apiGroup Users
 * @apiDescription Retorna um funcionário específico
 *
 * @apiParam {Number} id_usuario funcionário único.
 *
 * @apiSuccessExample {json} Sucesso
 *   HTTP/1.1 200 OK
 *   {
 *     "message": "Requisição efetuada com sucesso.",
 *     "data": {
 *      "user": [
 *        {
 *          "id": 1,
 *          "name": "Yan Almeida Garcia",
 *          "email": "yan@almeida.com",
 *          "cpf": "000.000.000-00",
 *          "phone": "(00) 91234-5678",
 *          "sector": "Direção"
 *          "gender": "Não informar"
 *        },
 *      ]
 *    },
 *    "metadata": {},
 *    "status": 200
 *   }
 *
 * @apiUse UserNotFoundError
 */

/**
 * @api {post} /users/
 * @apiVersion 0.0.1
 * @apiGroup Users
 * @apiDescription Cria um novo funcionário
 *
 * @apiParam {string} Nome                Nome do funcionário.
 * @apiParam {number} Setor               Setor do funcionário (definirá as permissões dentro da aplicação).
 * @apiParam {string} E-mail              E-mail do(s) funcionário(s).
 * @apiParam {string} CPF                 CPF (único por funcionário).
 * @apiParam {number} Sexo                Sexo do funcionário.
 * @apiParam {string} Celular             Telefone de contato dos funcionários.
 * 
 * @apiParamExample {json} Formato de requisição
{
"cpf_usuario": "000.000.000-00",
"email_usuario": "yan@almeida.com",
"nome_usuario": "Yan Almeida Garcia",
"tel_usuario": "(00) 91234-5678",
"setor_usuario": 1,
"sexo_usuario": 1
}
 *
 * @apiSuccessExample {json} Sucesso
 *   HTTP/1.1 200 OK
 *   {
 *     "message": "Cadastro efetuado com sucesso.",
 *     "data": null,
 *     "metadata": {},
 *     "status": 200
 *   }
 *
 * @apiUse DataConflict
 *
 */

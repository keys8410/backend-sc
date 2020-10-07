/**
 * @apiDefine UserNotFoundError
 *
 * @apiError UserNotFound
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
 *  @api {get} /users/
 *  @apiVersion 0.0.1
 *  @apiGroup Users
 *  @apiDescription Retorna todos os usuários
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
 * @apiDescription Retorna um usuário específico
 *
 * @apiParam {Number} id usuário único.
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
 *          "cellphone": "(00) 9 1234-5678",
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

/**
 *  @apiDefine UserNotFoundError
 *
 *  @apiError UserNotFound Dado(s) solicitado(s) não encontrado(s).
 *
 *  @apiErrorExample {json} Error 404
 *    HTTP/1.1 404 Not Found
 *    {
 *      "message": "Não encontrado."
 *      "metadata": {},
 *      "status": 404
 *    }
 */

/**
 *  @apiDefine DataConflict
 *
 *  @apiError DataConflict Retorna um erro caso haja dado(s) já cadastrado(s).
 *
 *  @apiErrorExample {json} Error 409
 *    HTTP/1.1 409 Data Conflict
 *    {
 *      "message": "Dado(s) já cadastrado(s)."
 *      "metadata": {},
 *      "status": 409
 *    }
 */

/**
 *  @api {get} /users
 *  @apiVersion 0.0.1
 *  @apiGroup Users
 *  @apiDescription Retorna todos os funcionários
 *
 *  @apiSuccessExample {json} Success
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
 * @api {get} /users/:id_user
 * @apiVersion 0.0.1
 * @apiGroup Users
 * @apiDescription Retorna um funcionário específico
 *
 * @apiParam {Number} id_usuario funcionário único.
 *
 * @apiSuccessExample {json} Success
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
 * @api {post} /users
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
 * @apiSuccessExample {json} Success
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

define({
  api: [
    {
      type: 'get',
      url: '/user/:id',
      title: 'Read data of a User',
      version: '0.3.0',
      name: 'GetUser',
      group: 'User',
      permission: [
        {
          name: 'admin',
          title: 'Admin access rights needed.',
          description:
            '<p>Optionally you can write here further Informations about the permission.</p> <p>An &quot;apiDefinePermission&quot;-block can have an &quot;apiVersion&quot;, so you can attach the block to a specific version.</p> ',
        },
      ],
      description:
        '<p>Compare Verison 0.3.0 with 0.2.0 and you will see the green markers with new items in version 0.3.0 and red markers with removed items since 0.2.0.</p> ',
      parameter: {
        fields: {
          Parameter: [
            {
              group: 'Parameter',
              type: 'String',
              optional: false,
              field: 'id',
              description: '<p>The Users-ID.</p> ',
            },
          ],
        },
      },
      examples: [
        {
          title: 'Example usage:',
          content: 'curl -i http://localhost/user/4711',
          type: 'json',
        },
      ],
      success: {
        fields: {
          'Success 200': [
            {
              group: 'Success 200',
              type: 'String',
              optional: false,
              field: 'id',
              description: '<p>The Users-ID.</p> ',
            },
            {
              group: 'Success 200',
              type: 'Date',
              optional: false,
              field: 'registered',
              description: '<p>Registration Date.</p> ',
            },
            {
              group: 'Success 200',
              type: 'Date',
              optional: false,
              field: 'name',
              description: '<p>Fullname of the User.</p> ',
            },
            {
              group: 'Success 200',
              type: 'String[]',
              optional: false,
              field: 'nicknames',
              description:
                '<p>List of Users nicknames (Array of Strings).</p> ',
            },
            {
              group: 'Success 200',
              type: 'Object',
              optional: false,
              field: 'profile',
              description: '<p>Profile data (example for an Object)</p> ',
            },
            {
              group: 'Success 200',
              type: 'Number',
              optional: false,
              field: 'profile.age',
              description: '<p>Users age.</p> ',
            },
            {
              group: 'Success 200',
              type: 'String',
              optional: false,
              field: 'profile.image',
              description: '<p>Avatar-Image.</p> ',
            },
            {
              group: 'Success 200',
              type: 'Object[]',
              optional: false,
              field: 'options',
              description: '<p>List of Users options (Array of Objects).</p> ',
            },
            {
              group: 'Success 200',
              type: 'String',
              optional: false,
              field: 'options.name',
              description: '<p>Option Name.</p> ',
            },
            {
              group: 'Success 200',
              type: 'String',
              optional: false,
              field: 'options.value',
              description: '<p>Option Value.</p> ',
            },
          ],
        },
      },
      error: {
        fields: {
          'Error 4xx': [
            {
              group: 'Error 4xx',
              optional: false,
              field: 'NoAccessRight',
              description:
                '<p>Only authenticated Admins can access the data.</p> ',
            },
            {
              group: 'Error 4xx',
              optional: false,
              field: 'UserNotFound',
              description:
                '<p>The <code>id</code> of the User was not found.</p> ',
            },
          ],
        },
        examples: [
          {
            title: 'Response (example):',
            content:
              '    HTTP/1.1 401 Not Authenticated\n    {\n      "error": "NoAccessRight"\n    }',
            type: 'json',
          },
        ],
      },
      filename: 'source/example_full/example.js',
      groupTitle: 'User',
    },
    {
      type: 'get',
      url: '/user/:id',
      title: 'Read data of a User',
      version: '0.2.0',
      name: 'GetUser',
      group: 'User',
      permission: [
        {
          name: 'admin',
          title: 'This title is visible in version 0.1.0 and 0.2.0',
          description: '',
        },
      ],
      description:
        '<p>Here you can describe the function. Multilines are possible.</p> ',
      parameter: {
        fields: {
          Parameter: [
            {
              group: 'Parameter',
              type: 'String',
              optional: false,
              field: 'id',
              description: '<p>The Users-ID.</p> ',
            },
          ],
        },
      },
      success: {
        fields: {
          'Success 200': [
            {
              group: 'Success 200',
              type: 'String',
              optional: false,
              field: 'id',
              description: '<p>The Users-ID.</p> ',
            },
            {
              group: 'Success 200',
              type: 'Date',
              optional: false,
              field: 'name',
              description: '<p>Fullname of the User.</p> ',
            },
          ],
        },
      },
      error: {
        fields: {
          'Error 4xx': [
            {
              group: 'Error 4xx',
              optional: false,
              field: 'UserNotFound',
              description:
                '<p>The <code>id</code> of the User was not found.</p> ',
            },
          ],
        },
      },
      filename: 'source/example_full/_apidoc.js',
      groupTitle: 'User',
    },
    {
      type: 'get',
      url: '/user/:id',
      title: 'Read data of a User',
      version: '0.1.0',
      name: 'GetUser',
      group: 'User',
      permission: [
        {
          name: 'admin',
          title: 'This title is visible in version 0.1.0 and 0.2.0',
          description: '',
        },
      ],
      description:
        '<p>Here you can describe the function. Multilines are possible.</p> ',
      parameter: {
        fields: {
          Parameter: [
            {
              group: 'Parameter',
              type: 'String',
              optional: false,
              field: 'id',
              description: '<p>The Users-ID.</p> ',
            },
          ],
        },
      },
      success: {
        fields: {
          'Success 200': [
            {
              group: 'Success 200',
              type: 'String',
              optional: false,
              field: 'id',
              description: '<p>The Users-ID.</p> ',
            },
            {
              group: 'Success 200',
              type: 'Date',
              optional: false,
              field: 'name',
              description: '<p>Fullname of the User.</p> ',
            },
          ],
        },
      },
      error: {
        fields: {
          'Error 4xx': [
            {
              group: 'Error 4xx',
              optional: false,
              field: 'UserNotFound',
              description:
                '<p>The error description text in version 0.1.0.</p> ',
            },
          ],
        },
      },
      filename: 'source/example_full/_apidoc.js',
      groupTitle: 'User',
    },
    {
      type: 'post',
      url: '/user',
      title: 'Create a new User',
      version: '0.3.0',
      name: 'PostUser',
      group: 'User',
      permission: [
        {
          name: 'none',
        },
      ],
      description:
        '<p>In this case &quot;apiUse&quot; is defined and used. Define blocks with params that will be used in several functions, so you dont have to rewrite them.</p> ',
      parameter: {
        fields: {
          Parameter: [
            {
              group: 'Parameter',
              type: 'String',
              optional: false,
              field: 'name',
              description: '<p>Name of the User.</p> ',
            },
          ],
        },
      },
      success: {
        fields: {
          'Success 200': [
            {
              group: 'Success 200',
              type: 'String',
              optional: false,
              field: 'id',
              description: '<p>The new Users-ID.</p> ',
            },
          ],
        },
      },
      filename: 'source/example_full/example.js',
      groupTitle: 'User',
      error: {
        fields: {
          'Error 4xx': [
            {
              group: 'Error 4xx',
              optional: false,
              field: 'NoAccessRight',
              description:
                '<p>Only authenticated Admins can access the data.</p> ',
            },
            {
              group: 'Error 4xx',
              optional: false,
              field: 'UserNameTooShort',
              description: '<p>Minimum of 5 characters required.</p> ',
            },
          ],
        },
        examples: [
          {
            title: 'Response (example):',
            content:
              '    HTTP/1.1 400 Bad Request\n    {\n      "error": "UserNameTooShort"\n    }',
            type: 'json',
          },
        ],
      },
    },
    {
      type: 'post',
      url: '/user',
      title: 'Create a User',
      version: '0.2.0',
      name: 'PostUser',
      group: 'User',
      permission: [
        {
          name: 'none',
        },
      ],
      description:
        '<p>In this case &quot;apiUse&quot; is defined and used. Define blocks with params that will be used in several functions, so you dont have to rewrite them.</p> ',
      parameter: {
        fields: {
          Parameter: [
            {
              group: 'Parameter',
              type: 'String',
              optional: false,
              field: 'name',
              description: '<p>Name of the User.</p> ',
            },
          ],
        },
      },
      success: {
        fields: {
          'Success 200': [
            {
              group: 'Success 200',
              type: 'String',
              optional: false,
              field: 'id',
              description: '<p>The Users-ID.</p> ',
            },
          ],
        },
      },
      filename: 'source/example_full/_apidoc.js',
      groupTitle: 'User',
      error: {
        fields: {
          'Error 4xx': [
            {
              group: 'Error 4xx',
              optional: false,
              field: 'NoAccessRight',
              description:
                '<p>Only authenticated Admins can access the data.</p> ',
            },
            {
              group: 'Error 4xx',
              optional: false,
              field: 'UserNameTooShort',
              description: '<p>Minimum of 5 characters required.</p> ',
            },
          ],
        },
        examples: [
          {
            title: 'Response (example):',
            content:
              '    HTTP/1.1 400 Bad Request\n    {\n      "error": "UserNameTooShort"\n    }',
            type: 'json',
          },
        ],
      },
    },
    {
      type: 'put',
      url: '/user/:id',
      title: 'Change a new User',
      version: '0.3.0',
      name: 'PutUser',
      group: 'User',
      permission: [
        {
          name: 'none',
        },
      ],
      description:
        '<p>This function has same errors like POST /user, but errors not defined again, they were included with &quot;apiUse&quot;</p> ',
      parameter: {
        fields: {
          Parameter: [
            {
              group: 'Parameter',
              type: 'String',
              optional: false,
              field: 'name',
              description: '<p>Name of the User.</p> ',
            },
          ],
        },
      },
      filename: 'source/example_full/example.js',
      groupTitle: 'User',
      error: {
        fields: {
          'Error 4xx': [
            {
              group: 'Error 4xx',
              optional: false,
              field: 'NoAccessRight',
              description:
                '<p>Only authenticated Admins can access the data.</p> ',
            },
            {
              group: 'Error 4xx',
              optional: false,
              field: 'UserNameTooShort',
              description: '<p>Minimum of 5 characters required.</p> ',
            },
          ],
        },
        examples: [
          {
            title: 'Response (example):',
            content:
              '    HTTP/1.1 400 Bad Request\n    {\n      "error": "UserNameTooShort"\n    }',
            type: 'json',
          },
        ],
      },
    },
  ],
});

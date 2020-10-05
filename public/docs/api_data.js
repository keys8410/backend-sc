define({ "api": [
  {
    "type": "get",
    "url": "/users",
    "title": "Users",
    "version": "0.0.1",
    "group": "Autenticação",
    "description": "<p>Retorna todos os produtos da API</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "user",
            "description": "<p>Nome do Usuário</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "hashPass",
            "description": "<p>Senha Criptografada</p>"
          },
          {
            "group": "Header",
            "type": "Number",
            "optional": true,
            "field": "keep",
            "defaultValue": "0",
            "description": "<p>Se mantém logado</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"user\": \"gk.yanzinh@yahoo.com.br\",\n  \"hashPass\": \"402562bbebdabd3dc1c86ad268ab3136aebd1756\",\n   \"keep\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Mensagem de acesso autorizado</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>Token de Acesso</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Sucesso",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"Logado!\"\n  \"token\": \"c447c5b517efa57e04e1a4732b2a3b5df82f9d72\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Mensagem de acesso negada</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 406 Not Acceptable\n{\n  \"status\": \"Usuário ou Senha incorretos\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./_apidoc.js",
    "groupTitle": "Autenticação",
    "name": "GetUsers"
  }
] });

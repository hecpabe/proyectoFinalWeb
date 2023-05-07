

/*
    Título: Swagger Docs
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la configuración de Swagger
    Fecha: 7/5/2023
    Última Modificación: 7/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const swagger = require("swagger-jsdoc")

/* Opciones de Swagger */
const options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "CommerceGo - Express API with Swagger (OpenAPI 3.0)",
        version: "0.1.0",
        description:
          "This is a CRUD API application made with Express and documented with Swagger to manage commerce advertising",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "CommerceGo",
          url: "https://github.com/hecpabe",
          email: "commercegooficial@gmail.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            },
        },
        schemas:{
            login: {
                type: "object",
                required: ["username", "password"],
                properties: {
                  email: {
                    type: "string",
                    example: "user OR user@gmail.com"
                  },
                password: {
                    type: "string"
                  },
                }
            },
            restorePasswordEmail: {
                type: "object",
                required: ["email"],
                properties: {
                    email: {
                        type: "string",
                        example: "user@gmail.com"
                    }
                }
            },
            restorePasswordCode: {
                type: "object",
                required: ["code"],
                properties: {
                    code: {
                        type: "string",
                        example: "123456"
                    }
                }
            },
            restorePasswordPassword: {
                type: "object",
                required: ["password"],
                properties: {
                    password: {
                        type: "string"
                    }
                }
            },
            user: {
                type: "object",
                required: ["username", "name", "email", "password", "description", "avatar", "country", "city", "preferences", "allowAdvertising"],
                properties: {
                    username: {
                        type: "string",
                        example: "user"
                    },
                    name: {
                        type: "string",
                        example: "Firstname Lastname"
                    },
                    email: {
                        type: "string",
                        example: "user@gmail.com"
                    },
                    password: {
                        type: "string"
                    },
                    description: {
                        type: "string",
                        example: "This is a description"
                    },
                    avatar: {
                        type: "int",
                        example: 1
                    },
                    country: {
                        type: "string",
                        example: "España"
                    },
                    city: {
                        type: "string",
                        example: "Madrid"
                    },
                    preferences: {
                        type: "array",
                        example: ["Hotel", "Restaurant"]
                    },
                    allowAdvertising: {
                        type: "boolean",
                        example: true
                    }
                },
            },
            fav: {
                type: "object",
                required: ["id"],
                properties: {
                    id: {
                        type: "int",
                        example: 1
                    }
                }
            },
            merchant: {
                type: "object",
                required: ["merchantname", "name", "email", "password", "cif", "phone", "country", "city", "address"],
                properties: {
                    merchantname: {
                        type: "string",
                        example: "tienda"
                    },
                    name: {
                        type: "string",
                        example: "La tienda de ropa"
                    },
                    email: {
                        type: "string",
                        example: "tienda@gmail.com"
                    },
                    passwod: {
                        type: "string"
                    },
                    cif: {
                        type: "string",
                        example: "1234567890"
                    },
                    phone: {
                        type: "string",
                        example: "123456789"
                    },
                    country: {
                        type: "string",
                        example: "España"
                    },
                    city: {
                        type: "string",
                        example: "Madrid"
                    },
                    address: {
                        type: "string",
                        example: "C/ Gran Vía 8"
                    }
                }
            },
            loginMerchant: {
                type: "object",
                required: ["merchantname", "password"],
                properties: {
                    merchantname: {
                        type: "string",
                        example: "tienda"
                    },
                    password: {
                        type: "string"
                    }
                }
            },
            post: {
                type: "object",
                required: ["webpageID", "content", "attachment"],
                properties: {
                    webpageID: {
                        type: "string",
                        example: "1"
                    },
                    content: {
                        type: "string",
                        example: "Este es el contenido de la publicación"
                    },
                    attachment: {
                        type: "string",
                        example: "1"
                    }
                }
            },
            review: {
                type: "object",
                required: ["webpageID", "content", "rating"],
                properties: {
                    webpageID: {
                        type: "string",
                        example: "1"
                    },
                    content: {
                        type: "string",
                        example: "El servicio es bueno"
                    },
                    rating: {
                        type: "float",
                        example: 4.5
                    }
                }
            },
            webpage: {
                type: "object",
                required: ["name", "type", "avatar", "country", "city", "address", "phone", "email", "description"],
                properties: {
                    name: {
                        type: "string",
                        example: "La tienda"
                    },
                    type: {
                        type: "string",
                        example: "Ropa"
                    },
                    avatar: {
                        type: "int",
                        example: 1
                    },
                    country: {
                        type: "string",
                        example: "España"
                    },
                    city: {
                        type: "string",
                        example: "Madrid"
                    },
                    address: {
                        type: "string",
                        example: "C/ Gran Vía 8"
                    },
                    phone: {
                        type: "string",
                        example: "123456789"
                    },
                    email: {
                        type: "string",
                        example: "tienda@gmail.com"
                    },
                    description: {
                        type: "string",
                        example: "Esto es una tienda de ropa"
                    }
                }
            }
        },
      },
    },
    apis: ["./api/routes/*.js"],
  };

/* Exportado de Módulo */
module.exports = swagger(options);
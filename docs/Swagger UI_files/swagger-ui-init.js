
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "components": {
      "securitySchemes": {
        "apiKey": {
          "type": "apiKey",
          "in": "header",
          "name": "Authorization"
        }
      },
      "schemas": {
        "BodyJoint": {
          "type": "object",
          "required": [
            "label",
            "firstEdgeIndex",
            "secondEdgeIndex"
          ],
          "properties": {
            "_id": {
              "type": "string",
              "description": "The ID of the body joint",
              "example": "62b9dd789288ab71aa40b61d",
              "readOnly": true
            },
            "label": {
              "type": "string",
              "example": "left_elbow",
              "description": "The requirements for a specific pose"
            },
            "firstEdgeIndex": {
              "type": "number",
              "example": 4,
              "description": "The first edge index for a specific body joint"
            },
            "secondEdgeIndex": {
              "type": "number",
              "example": 5,
              "description": "The second edge index for a specific body joint"
            },
            "desiredAngle": {
              "type": "number",
              "example": 45,
              "description": "The desired angle of the body joint"
            }
          }
        },
        "Exercise": {
          "type": "object",
          "required": [
            "poses",
            "neededReps",
            "neededDuration",
            "title",
            "description"
          ],
          "properties": {
            "poses": {
              "$ref": "#/components/schemas/Pose"
            },
            "diagnoses": {
              "type": "array",
              "description": "The diagnoses that the exercise fits to.",
              "items": {
                "type": "string"
              },
              "example": [
                "F43.0G",
                "M54.4 G L"
              ]
            },
            "neededReps": {
              "type": "number",
              "description": "The number of reps of the exercise.",
              "example": 15
            },
            "neededDuration": {
              "type": "number",
              "description": "How long the exercise should be executed.",
              "example": 5
            },
            "title": {
              "type": "string",
              "description": "title of the exercise.",
              "example": "exampleExercise"
            },
            "link": {
              "type": "string",
              "description": "some link",
              "example": "http://example.com"
            },
            "description": {
              "type": "string",
              "description": "The description of the exercise.",
              "example": "A brief description of the exercise"
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "description": "The date of the record creation.",
              "example": "2022-06-27T15:36:04.440Z"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "description": "The date when the record was last updated",
              "example": "2022-06-27T15:36:04.440Z"
            }
          }
        },
        "ExerciseWithId": {
          "allOf": [
            {
              "$ref": "#/components/schemas/Exercise"
            },
            {
              "type": "object",
              "required": [
                "_id"
              ],
              "properties": {
                "_id": {
                  "type": "string",
                  "description": "The ID of the body joint",
                  "example": "62b98c96fc0211140f90b025"
                }
              }
            }
          ]
        },
        "Pose": {
          "type": "object",
          "required": [
            "requirements"
          ],
          "properties": {
            "_id": {
              "type": "string",
              "description": "The ID of the body joint",
              "example": "62b9dd7b9288ab71aa40b620",
              "readOnly": true
            },
            "requirements": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Requirement"
              },
              "description": "The requirements for a specific pose"
            }
          }
        },
        "Requirement": {
          "type": "object",
          "required": [
            "requiredAngle",
            "angleThreshold",
            "bodyJoint"
          ],
          "properties": {
            "_id": {
              "type": "string",
              "description": "The ID of the body joint",
              "example": "62b9dd789288ab71aa40b61c",
              "readOnly": true
            },
            "bodyJoint": {
              "$ref": "#/components/schemas/BodyJoint"
            },
            "requiredAngle": {
              "type": "number",
              "example": 33,
              "description": "The required angle for the requirement"
            },
            "angleThreshold": {
              "type": "number",
              "example": 40,
              "description": "The required angle threshold for the requirement"
            }
          }
        },
        "Role": {
          "type": "object",
          "required": [
            "type",
            "permissions"
          ],
          "properties": {
            "type": {
              "type": "string",
              "description": "The name of the permission role.",
              "example": "ADMIN"
            },
            "permissions": {
              "$ref": "#/components/schemas/Permission"
            }
          }
        },
        "Permission": {
          "type": "object",
          "required": [
            "exercises",
            "users",
            "roles"
          ],
          "properties": {
            "_id": {
              "type": "string",
              "description": "The ID of the Permission group",
              "example": "62fcf1c25afa97024e73a7e5",
              "readOnly": true
            },
            "exercises": {
              "$ref": "#/components/schemas/CRUDPermission"
            },
            "users": {
              "$ref": "#/components/schemas/CRUDPermission"
            },
            "roles": {
              "$ref": "#/components/schemas/CRUDPermission"
            }
          }
        },
        "CRUDPermission": {
          "type": "object",
          "required": [
            "create",
            "read",
            "update",
            "delete"
          ],
          "properties": {
            "_id": {
              "type": "string",
              "description": "The ID of the CRUDPermission",
              "readOnly": true,
              "example": "62fcec385afa97024e73a7d2"
            },
            "create": {
              "type": "boolean",
              "description": "The permission to create a new Ressource"
            },
            "read": {
              "type": "boolean",
              "description": "The permission to read a Ressource"
            },
            "update": {
              "type": "boolean",
              "description": "The permission to update a new Ressource"
            },
            "delete": {
              "type": "boolean",
              "description": "The permission to delete a Ressource"
            }
          }
        },
        "RoleWithId": {
          "allOf": [
            {
              "$ref": "#/components/schemas/Role"
            },
            {
              "type": "object",
              "required": [
                "_id"
              ],
              "properties": {
                "_id": {
                  "type": "string",
                  "description": "The ID of this Permission aggregate.",
                  "example": "62b98c96fc0211140f90b025"
                }
              }
            }
          ]
        },
        "User": {
          "type": "object",
          "required": [
            "role",
            "active",
            "diagnoses"
          ],
          "properties": {
            "token": {
              "type": "string",
              "description": "The token of the user (will only be displayed for ADMINS)",
              "example": "69bf11e1"
            },
            "role": {
              "type": "string",
              "description": "The ID of the role the user has.",
              "example": "62fe4d7dc4b8c05d82fdee7b"
            },
            "active": {
              "type": "boolean",
              "description": "If the user is verified or active and can authenticate with his token.",
              "example": true
            },
            "diagnoses": {
              "type": "array",
              "description": "The diagnoses the user has.",
              "items": {
                "type": "string"
              },
              "example": [
                "F43.0G"
              ]
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "description": "The date of the record creation.",
              "example": "2022-06-27T15:36:04.440Z"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "description": "The date when the record was last updated",
              "example": "2022-06-27T15:36:04.440Z"
            }
          }
        },
        "UserWithId": {
          "allOf": [
            {
              "$ref": "#/components/schemas/User"
            },
            {
              "type": "object",
              "required": [
                "_id"
              ],
              "properties": {
                "_id": {
                  "type": "string",
                  "description": "The ID of this User.",
                  "example": "62fe4cd04ff1e43c60ddbb52"
                }
              }
            }
          ]
        }
      }
    },
    "info": {
      "title": "Exercisebuddy-API",
      "version": "0.1.0",
      "description": "API for the Exercisebuddy project",
      "contact": {
        "name": "Robin Dürhager",
        "email": "robin.duerhager@hshl.de"
      }
    },
    "servers": [
      {
        "url": "http://localhost:3000/"
      }
    ],
    "paths": {
      "/exercises/{id}": {
        "get": {
          "tags": [
            "Exercises"
          ],
          "summary": "get a specific Exercise",
          "operationId": "findExerciseById",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the Exercise you want to query",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ExerciseWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "405": {
              "description": "Invalid Input"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/exercises": {
        "get": {
          "tags": [
            "Exercises"
          ],
          "summary": "get all Exercises",
          "operationId": "getAllExercises",
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ExerciseWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        },
        "post": {
          "tags": [
            "Exercises"
          ],
          "summary": "create a new Exercise",
          "operationId": "createExercise",
          "security": [
            {
              "apiKey": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Exercise"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Ressource Created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ExerciseWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        },
        "patch": {
          "tags": [
            "Exercises"
          ],
          "summary": "update a specific Exercises primitive values",
          "operationId": "updateExerciseById",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ExerciseWithId"
                }
              }
            }
          },
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ExerciseWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "405": {
              "description": "Invalid Input"
            }
          }
        },
        "delete": {
          "tags": [
            "Exercises"
          ],
          "summary": "delete a specific Exercise",
          "operationId": "deleteExerciseById",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": {
                      "type": "string"
                    }
                  },
                  "example": {
                    "_id": "62b98c96fc0211140f90b025"
                  }
                }
              }
            }
          },
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ExerciseWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "405": {
              "description": "Invalid Input"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/roles/{id}": {
        "get": {
          "tags": [
            "Roles"
          ],
          "summary": "get a specific Role",
          "operationId": "findRoleById",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the Role you want to query",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RoleWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "405": {
              "description": "Invalid Input"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/roles": {
        "get": {
          "tags": [
            "Roles"
          ],
          "summary": "get all Roles",
          "operationId": "getAllRoles",
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RoleWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        },
        "post": {
          "tags": [
            "Roles"
          ],
          "summary": "create a new Role",
          "operationId": "createRole",
          "security": [
            {
              "apiKey": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Role"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Ressource Created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RoleWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        },
        "patch": {
          "tags": [
            "Roles"
          ],
          "summary": "update a specific Roles values",
          "operationId": "updateRoleById",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RoleWithId"
                }
              }
            }
          },
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RoleWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "405": {
              "description": "Invalid Input"
            }
          }
        },
        "delete": {
          "tags": [
            "Roles"
          ],
          "summary": "delete a specific Role",
          "operationId": "deleteRoleById",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": {
                      "type": "string"
                    }
                  },
                  "example": {
                    "_id": "62b98c96fc0211140f90b025"
                  }
                }
              }
            }
          },
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/RoleWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "405": {
              "description": "Invalid Input"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/users/{id}": {
        "get": {
          "tags": [
            "Users"
          ],
          "summary": "get a specific User",
          "operationId": "findUserById",
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "description": "ID of the User you want to query",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "405": {
              "description": "Invalid Input"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      },
      "/users": {
        "get": {
          "tags": [
            "Users"
          ],
          "summary": "get all Users",
          "operationId": "getAllUsers",
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        },
        "post": {
          "tags": [
            "Users"
          ],
          "summary": "create a new User",
          "operationId": "createUser",
          "security": [
            {
              "apiKey": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "role",
                    "active",
                    "diagnoses"
                  ],
                  "properties": {
                    "active": {
                      "type": "boolean",
                      "description": "If the user is verified or active and can authenticate with his token.",
                      "example": true
                    },
                    "diagnoses": {
                      "type": "array",
                      "description": "The diagnoses the user has.",
                      "items": {
                        "type": "string",
                        "example": "F43.0G"
                      }
                    },
                    "role": {
                      "type": "string",
                      "description": "ID of the role the user should have",
                      "example": "62fcf1c25afa97024e73a7e5"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Ressource Created",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        },
        "patch": {
          "tags": [
            "Users"
          ],
          "summary": "update a specific Users values",
          "operationId": "updateUserById",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "_id"
                  ],
                  "properties": {
                    "active": {
                      "type": "boolean",
                      "description": "If the user is verified or active and can authenticate with his token.",
                      "example": true
                    },
                    "diagnoses": {
                      "type": "array",
                      "description": "The diagnoses the user has.",
                      "items": {
                        "type": "string",
                        "example": "F43.0G"
                      }
                    },
                    "role": {
                      "type": "string",
                      "description": "ID of the role the user should have",
                      "example": "62fcf1c25afa97024e73a7e5"
                    },
                    "_id": {
                      "type": "string",
                      "description": "ID of the user which should be modified",
                      "example": "62fe4cd04ff1e43c60ddbb52"
                    }
                  }
                }
              }
            }
          },
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "405": {
              "description": "Invalid Input"
            }
          }
        },
        "delete": {
          "tags": [
            "Users"
          ],
          "summary": "delete a specific User",
          "operationId": "deleteUserById",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "_id": {
                      "type": "string"
                    }
                  },
                  "example": {
                    "_id": "62b98c96fc0211140f90b025"
                  }
                }
              }
            }
          },
          "security": [
            {
              "apiKey": []
            }
          ],
          "responses": {
            "200": {
              "description": "A successfull Response",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserWithId"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "403": {
              "description": "Forbidden"
            },
            "405": {
              "description": "Invalid Input"
            },
            "500": {
              "description": "Internal Server Error"
            }
          }
        }
      }
    },
    "tags": [
      {
        "name": "Exercises",
        "description": "Endpoints for the Exercises Model"
      },
      {
        "name": "Roles",
        "description": "Endpoints for the Roles / Permissions Model"
      },
      {
        "name": "Users",
        "description": "Endpoints for the Users Model"
      }
    ]
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}

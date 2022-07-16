# TASK LIST API

> Projeto Concluído  

## Descrição  

- Uma REST API com sistema de Autenticação com JWT e CRUD simples para uma lista de tarefas.  

## Tecnologias Utilizadas  

- Node.JS  
- MongoDB (Banco de Dados)    
- Express  
- Mongoose  
- Bcrypt  
- JsonWebToken  
- Mocha e Chai (Testes)  

## Endpoints  

- URL BASE: https://task-list-backend-api.herokuapp.com 

### POST /auth/login  

- Body da Requisição (JSON):  
```
   {
      "email": "seuemail@mail.com",
      "password": "SUAsenha123!",
   }
   
   //Retorno Esperado (Status: 200):
   
   {
      "user": {
        "_id": "<id_aqui>",
        "name": "Teste",
        "email": "seuemail@mail.com",
        "createdAt": "2022-06-02T12:02:37.641Z",
        "updatedAt": "2022-06-02T12:05:08.077Z",
        "tasks": [],
        "__v": 0
      },
      "token": "<token_aqui>"
  }
  
  //Possíveis Erros (Status: 422):  
    
   //Body vazio
    // Body
    {

    }

    // Resposta
    {
       "error": "Email is required"
    }
    
    -----------------------------------
    
    // Body
    {
        "email": "seuemail@mail.com"
    }

    // Resposta
    {
       "error": "Password is required"
    }
    
    -----------------------------------
    
    // Body
    {
        "email": "seuemail@mail.com",
        "password": "senhaerradaaqui"
    }

    // Resposta
    {
       "error": "Password is invalid"
    }
    
    -----------------------------------
    
    // Body
    {
        "email": "seuemail@mail.com",
        "password": "senhaerradaaqui",
        "algoamais": "algoamais"
    }

    // Resposta
    {
       "error": "Some unnecessary data was sent"
    }
   
```  

### POST /auth/register  

- Body da Requisição (JSON):  
```
   {
      "name": "Teste",
      "email": "seuemail@mail.com",
      "password": "SUAsenha123!",
      "passwordConfirmation": "SUAsenha123!"
   }
   
   //Retorno Esperado (Status: 200):
   
   {
      "user": {
        "_id": "<id_aqui>",
        "name": "Teste",
        "email": "seuemail@mail.com",
        "createdAt": "2022-06-02T12:02:37.641Z",
        "updatedAt": "2022-06-02T12:05:08.077Z",
        "tasks": [],
        "__v": 0
      },
      "token": "<token_aqui>"
  }
  
  //Possíveis Erros (Status: 422):  
    
    // Body
    {

    }

    // Resposta
    {
       "error": "Name is required"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
    }

    // Resposta
    {
       "error": "Email is required"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
        "email": "seuemail@"
    }

    // Resposta
    {
       "error": "Email is invalid"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
        "email": "seuemail@mail.com"
    }

    // Resposta
    {
       "error": "Password is required"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
        "email": "seuemail@mail.com",
        "password": "sominusculas"
    }

    // Resposta
    {
       "error": "Password must be at least one capital letter"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
        "email": "seuemail@mail.com",
        "password": "SOMAISCULAS"
    }

    // Resposta
    {
       "error": "Password must be at least one lowercase letter"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
        "email": "seuemail@mail.com",
        "password": "semNUMEROS"
    }

    // Resposta
    {
       "error": "Password must have at least one number"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
        "email": "seuemail@mail.com",
        "password": "semCARACTERESESPECIAIS123"
    }

    // Resposta
    {
       "error": "Password must have at least one special character"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
        "email": "seuemail@mail.com",
        "password": "Curta1!"
    }

    // Resposta
    {
       "error": "Password is too short, minimum is 8 characters"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
        "email": "seuemail@mail.com",
        "password": "Correta1!!",
        "passwordConfirmation": "Incorreta1!!"
    }

    // Resposta
    {
       "error": "Passwords do not match"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
        "email": "seuemail@mail.com",
        "password": "senhaerradaaqui",
        "passwordConfirmation": "senhaerradaaqui",
        "algoamais": "algoamais"
    }

    // Resposta
    {
       "error": "Some unnecessary data was sent"
    }
    
    -----------------------------------
    
    // Body
    {
        "name": "Teste",
        "email": "seuemail@mail.com",
        "password": "Correta1!!",
        "passwordConfirmation": "Correta1!!"
    }

    // Resposta -> Usuário já cadastrado
    {
       "error": "Email already registered"
    }
    
```  







# PATECODE MOCK PROJECT

## Tech Stack

### Backend

- TypeScript
- NodeJS
- Express
- MongoDB

### Frontend

- TypeScript
- ReactJS
- Axios
- React-Router

### Testing API

- Postman

## API Description

### API GET /code/me

- Description: Get all code of users from the database.
- Authenticate: Required.
- Request Body: Not Required.
- Response (success case):

```bash
{
    "code": [
        {
            "_id": "66c61bf267e8c25777a1dfef",
            "title": "hello code",
            "description": "one line demo code here",
            "language": "html",
            "code": "<p>hello world<p/>",
            "isUsepassword": true,
            "password": "$2b$08$pY3AAoFdoT12SVoDKz2q9.ujuf83ti2NyDxX/ELu/j0G4VJCNS7Yi",
            "member": "66c4466ef3f8db9e2a79f792",
            "createdAt": "2024-08-21T16:55:14.231Z",
            "updatedAt": "2024-08-21T16:55:14.231Z",
            "__v": 0
        }
    ]
}
```

### API POST /code/create

- Description: Create a code snippet.
- Authenticate: Required.
- Request Body:

```bash
{
    "title": "hello code",
    "description": "one line demo code here",
    "language": "html",
    "code": "<p>hello world<p/>",
    "isUsepassword": true,
    "password": "gialinh123",
    "member": "66c4466ef3f8db9e2a79f792"
}
```

- Response (success case):

```bash
{
    "message": "Created Code Successfully",
    "link": "http://localhost:3000/snippet/66c98dbf677d6b9655fa167c"
}
```

### API GET /code/get/:id

- Description: Get code by id.
- Authenticate: Not Required.
- Request Body: Not Required.
- Response (success case):

```bash
{
    "requiredPass": true,
    "code": null
}
```

OR

```bash
{
    "requiredPass": false,
    "code":
    {
            "_id": "66c61bf267e8c25777a1dfef",
            "title": "hello code",
            "description": "one line demo code here",
            "language": "html",
            "code": "<p>hello world<p/>",
            "isUsepassword": true,
            "password": "$2b$08$pY3AAoFdoT12SVoDKz2q9.ujuf83ti2NyDxX/ELu/j0G4VJCNS7Yi",
            "member": "66c4466ef3f8db9e2a79f792",
            "createdAt": "2024-08-21T16:55:14.231Z",
            "updatedAt": "2024-08-21T16:55:14.231Z",
            "__v": 0
    }
}
```

### API POST /member/requestResetPassword

- Description: Request to change password when click "Forgot Password" Button. This api will return a token for reset password
- Authenticate: Not Required
- Request Body:

```bash
{
    "email":"03linhnguyen@gmail.com"
}
```

### API POST /member/resetPassword

- Description: Reset my password after sending request for change password.
- Authenticate: Not Required.
- Request Body:

```bash
{
    "memberId": "66c4466ef3f8db9e2a79f792",
    "newPassword": "gialinh123",
    "confirmNewPassword": "gialinh123",
    "token":"d4350e5e3d37d292f2a7fd5bee85ac3bae19e071bf035c419a986c2252883f0e"
}
```

## Before started

- This repository have:

```bash
    .
    ├── src                    # Backend API Source
    ├── user-app
       ├── user-app            # Frontend Source

```

## Getting started

### For Running Backend

#### Setup

- `npm install`

#### Build source

- `npm run build` to build production

#### Run source

- `npm start` to start
- Or `npm run dev` (If using nodemon)

### For Running Frondend

#### Setup

- `cd user-app/user-app`
- `npm install`

#### Run source

- `npm start` to start

### For connecting to MongoDB

#### Create .env file

- Create .env file in root directory (can use .env.example file)

## Author

- Nguyễn Gia Linh

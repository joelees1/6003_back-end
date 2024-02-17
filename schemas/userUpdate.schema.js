module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/user/[id]",
    "title": "User Update",
    "description": "An user updating their profile",
    "type": "object",
    "properties": {
        "role": {
            "description": "Role of the user",
            "type": "string",
            "enum": ["user", "admin"]
        },
        "username": {
            "description": "Username of the user",
            "type": "string",
            "minLength": 1,
            "maxLength": 18 // max length for db
        },
        "first_name": {
            "description": "First name of the user",
            "type": "string",
            "minLength": 1
        },
        "last_name": {
            "description": "Last name of the user",
            "type": "string",
            "minLength": 1
        },
        "email": {
            "description": "Email of the user",
            "type": "string",
            "format": "email"
        },
        "password": {
            "description": "Password of the user",
            "type": "string",
            "minLength": 7
        },
        "phone_number": {
            "description": "Phone number of the user",
            "type": "string"
        }
    },
    "additionalProperties": false
}

module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/user",
    "title": "User",
    "description": "An user on the platform",
    "type": "object",
    "properties": {
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
            "type": "string",
        }
    },
    "required": ["username", "first_name", "last_name", "email", "password"],
    "additionalProperties": false
}

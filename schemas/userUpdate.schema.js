module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/user/[id]",
    "title": "User Update",
    "description": "An user updating their profile",
    "type": "object",
    "properties": {
        "username": {
            "description": "Username of the user",
            "type": "string"
        },
        "first_name": {
            "description": "First name of the user",
            "type": "string"
        },
        "last_name": {
            "description": "Last name of the user",
            "type": "string"
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
    }
}

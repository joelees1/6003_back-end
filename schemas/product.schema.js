module.exports = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "/product",
    "title": "Product",
    "description": "A product",
    "type": "object",
    "properties": {
        "name": {
            "description": "Name of the product",
            "type": "string",
            "minLength": 1
        },
        "description": {
            "description": "Description of the product",
            "type": "string",
            "minLength": 1
        },
        "creator": {
            "description": "Creator of the product",
            "type": "string",
            "minLength": 1
        },
        "price": {
            "description": "Price of the product",
            "type": "number",
            "minimum": 0
        },
        "category_id": {
            "description": "Catagory of the product",
            "type": "number"
        },
        "image_url": {
            "description": "Image url of the product",
            "type": "string"
        }
    },
    "required": ["name", "description", "price"],
    "additionalProperties": false
}
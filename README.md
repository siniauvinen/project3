# Restaurant API

## Table of Contents
1. General Info
2. Technologies
3. Installation

### General Info
***
Restaurant API is a school project to learn build API's using Mongoose and Node.js.
For now, this is only back-end.

Back-end can be tested using Postman. Following routes work.
* https://ravintolaapi.herokuapp.com/api/getall = return all documents in collection (data length is limited to 10 objects)
* https://ravintolaapi.herokuapp.com/api/:id = return one item with given id
* https://ravintolaapi.herokuapp.com/api/add = create a new document in the collection
* https://ravintolaapi.herokuapp.com/api/update/:id = update the document with the given id
* https://ravintolaapi.herokuapp.com/api/delete/:id = delete the item with the given id
* https://ravintolaapi.herokuapp.com/api/boroughs = list of all possible boroughs
* https://ravintolaapi.herokuapp.com/api/cuisines = list of all possible cuisines

When creating or updating a document the structure of the schema is following:

{ <br />
  "address": { <br />
    "street": "String", <br />
    "zipcode": Number, <br />
  }, <br />
  "borough": "String", <br />
  "cuisine": "String", <br />
  "name": "String" <br />
}

### Technologies
***
A list of technologies that were used to create the project.
* Visual Studio Code 1.61.1
* Java Script
* Node.js
* Express
* MongoDB
* Mongoose

### Installation
***
No special requirements. Restaurant API can be found from https://ravintolaapi.herokuapp.com/api/getall

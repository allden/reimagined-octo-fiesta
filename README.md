Please be sure to take a look at the "controllers" folder for the code and the "models" folder for the database schemas.

Technologies Used: Node.js, MongoDB

Frameworks: Express, Mongoose

Backend for Blog made in React, Includes a Post, Comment and a User Schema

Features:
- User input validation.
- Password hashing using bcryptjs.
- User account schema for when the user registers.
- JWT based authentication, once the user is authenticated they receive a JWT token which is then stored in their browser and they are able to continue browsing through the website.
- Post schema, restricted only to registered users so that visitors are unable to tamper with the blog.
- Comments schema allowing all visitors to submit comments on each Post.

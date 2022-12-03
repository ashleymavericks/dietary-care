<div align="center">
<h1 align="center">Dietary Care</h1>
<br />
<img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" /><br>
<br>
A voice-based chatbot that helps the users in selecting food products taking into account their food allergies, supports fallback intents for continuous conversation and store user allergens in persistent storage for future sessions.
</div>

## System Architecture

## API Design

## API Endpoints
```json
status	200
message	"Welcome to dietary-care food products API"
valid_endpoints	
0	
endpoint	"/products"
method	"GET"
description	"Displays all products"
1	
endpoint	"/products/allergyCheck"
method	"POST"
description	"Lets you check if you are allergic to a certain product"
2	
endpoint	"/products/add"
method	"POST"
description	"Lets you add a product to the database"
3	
endpoint	"/products/recommend"
method	"POST"
description	"Get product recommendation based on query parameters"
```
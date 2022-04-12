#!/bin/bash

# This Job Runs End to End Tests
# Run the backend server.
docker-compose up

# Run the frontend development server
npm start

# Run Cypress
npm run cy:open

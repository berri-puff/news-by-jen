# Northcoders News API

This repository contains works of building a functioning API backend project using Javascript, Node.js and Postgres to access and interact with PSQL databases. 

A link to the fully hosted version can be found [here](https://hot-issue.onrender.com/)

**How to run this repo on your local computer:**

1: ```git clone``` this repo by your choice of method.

2: Once cloned, install `jest` by running `npm install --save-dev jest`.

Then, install dependencies by running the command `npm install i`.

3: Ensure that your `Node.js` is at least `v17.0.0` or above and `Postgres` will need to be `pg@8.2` and above to support Node.js. 

Making a connection with the databases: 
   
 Create two files named ```.env.test``` and ```.env.development``` and set the databases as ```PGDATABASE=nc_news_test``` and ```PGDATABASE=nc_news``` respectively in order to make the connection locally.

**Connecting to database locally:**

Run `npm run setup-dbs` in your terminal, this should set the connection between your computer and the databases, which the seed will retreive data from in order to runs the tests. **ENSURE YOU HAVE SET UP THE `PGDATABASE` CORRECTLY OR IT WILL FAIL**

**Running tests:**

Run `npm test <fileName>`, in this case, replace the file name with one of the two file names from `__tests__` folder. This will run the test suites within the files. 


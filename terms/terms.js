const express = require("express");
const termsRoute = express.Router();

termsRoute.get("/terms", (req, res) => {
  res.send(`
    <html>
   <head>
   <title>
     terms and conditions
   </title>
   <head>
   <body>
      <h1>Terms and Conditions</h1>
       <ul>
    <li>
      all cookies will be accepted !
    </li>
     <li>
      copyright will be included our platform
    </li>
     <li>
      scrapping not allowed
    </li>
     <li>
      do not allow unauthenticated users
    </li>
     <li>
      something is term and conditions
    </li>
     <li>
      coprate with site and content
    </li>
       </ul>
   </body>
    </html>
`);
});

module.exports = termsRoute;

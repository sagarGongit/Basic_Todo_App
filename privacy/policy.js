const express = require("express");
const policyRoute = express.Router();

policyRoute.get("/policy", (req, res) => {
  res.send(`
    <html>
   <head>
   <title>
     our policy
   </title>
   <head>
   <body>
      <h1>Our policy</h1>
       <ul>
    <li>
      content should be safe
    </li>
     <li>
      copyright will be included our platform
    </li>
     <li>
      scrapping not allowed
    </li>
     <li>
      context not copied from another sites
    </li>
     <li>
      something from policy
    </li>
     <li>
      honesty is the best policy 😁
    </li>
       </ul>
   </body>
    </html>
`);
});

module.exports = policyRoute;

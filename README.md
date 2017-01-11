# cpa-admin
This repository contains the code of the admin interface of "Comprendre pour Apprendre".

# How to run
It is an Aurelia project hitting the public API of CPA. Clone the repository, `npm install` and `au run` should work assuming
aurelia is installed globally. You can also change the api endpoint in `main.js`.

# How to deploy
Place `awscredentials.json` at the root of the project (gitignored) and run `au deploy`.

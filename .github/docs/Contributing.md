Development
-----------
* Clone the project: git clone https://github.com/ElementsProject/umbrel-core-lightning.git
* Change directory: cd umbrel-core-lightning
* Install dependencies: Assuming that nodejs (v14 & above) and npm are already installed, run `npm install`.
* Setup environment variables: Assuming that bitcoind and core-lightning are already running, adjust environment variables listed in `./env.sh` file and execute the script with `'. env.sh'` to setup required environment variables to connect to the node.
* Setup Commando auth: Update `CLN_PUBKEY` and `CLN_RUNE` variables in `.commando-env` for successful backend authentication and connection via commando.
* Run backend server: Get the backend server up by running `npm run backend:watch`.
* React frontend server: React development server is set to serve on port 4300. Run `npm run frontend:dev` script to get it working.

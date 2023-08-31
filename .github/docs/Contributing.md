Development
-----------
* Clone the project: git clone https://github.com/ElementsProject/cln-application.git
* Change directory: cd cln-application
* Install dependencies: Assuming that nodejs (v14 & above) and npm are already installed, run `npm install`.
* Setup environment variables: Assuming that bitcoind and core-lightning are already running, adjust environment variables listed in `./env.sh` file and execute the script with `'. env.sh'` to setup required environment variables to connect to the node.
* Setup Commando auth: Update `LIGHTNING_PUBKEY` and `LIGHTNING_RUNE` variables in `.commando` for successful backend authentication and connection via commando. Or run `entrypoint.sh` with correct lightningd path to do the same.
* Run backend server: Get backend server up by running `npm run backend:serve`.
* Watch backend server: Watch backend server for realtime changes with `npm run backend:watch`.
* React frontend server: React development server is set to serve on port 4300. Run `npm run frontend:dev` script to get it working.


Releasing and packaging on Github
----------------------------------
* Go to repo's `Releases` page and draft a new release.
* Prepare release notes with the help of milestone, issues and PRs. Add them on the release page.
* Signing the release:
	** `VERSION=vx.y.z`
	** `mkdir -p ./release & git archive --format zip --output ./release/cln-application-${VERSION}.zip main`
	** `cd release`
	** `sha256sum cln* > SHA256SUMS`
	** `gpg -sb --armor -o SHA256SUMS.asc SHA256SUMS`
* Verify the release with `gpg --verify SHA256SUMS.asc`.
* Upload `cln-application-${VERSION}.zip`, `SHA256SUMS` and `SHA256SUMS.asc` files on release assets.
* Go to repo's `Actions` tab and confirm that actions have been triggered for `Artifact` and `Build and publish Github image`.
* Confirm that both actions finished successfully and the latest package is available at `https://github.com/orgs/ElementsProject/packages?repo_name=cln-application`.

# Rankings

* https://rankings.polinetwork.org/

### Info


- This is a rewrite of the repo [RankingsOld](https://github.com/PoliNetworkOrg/RankingsOld) using React.
- Every time the `main` branch is updated, the website preview build will automatically update too: the preview build is hosted [here](https://PoliNetworkOrg.github.io/preview/PoliNetworkOrg/Rankings/branch/main).  
- Every PR will also get its own preview deployed by the CI workflows, and the link will be posted as a comment by the bot.

#### Data generation
- Python script - https://github.com/PoliNetworkOrg/GraduatorieScript
- C# script (still in dev) - https://github.com/PoliNetworkOrg/GraduatorieScriptCSharp

## Development Setup
#### Requirements:
- [NodeJS](http://nodejs.org/) >= LTS (18.16.0) (linux: [nvm](https://github.com/nvm-sh/nvm))
- [pnpm](https://pnpm.io/installation) >= 8.x (installation via corepack is ok)

#### Install deps and start:
1. Clone this repo
2. Install deps
    ```sh
    pnpm install
    ```
3. Start
    ```sh
    pnpn dev
    ```


 

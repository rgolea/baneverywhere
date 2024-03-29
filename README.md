[![Deploy to Production](https://github.com/rgolea/baneverywhere/actions/workflows/master.yml/badge.svg)](https://github.com/rgolea/baneverywhere/actions/workflows/master.yml)

|Project        |Coverage                                                                                                                                                         |
|---	          |---	                                                                                                                                                            |
|API            |[![API](https://rgolea.github.io/baneverywhere/badges/api.svg)](https://rgolea.github.io/baneverywhere/apps/api/lcov-report/)                                    |
|Baneverywhere  |[![Twitch Client](https://rgolea.github.io/baneverywhere/badges/baneverywhere.svg)](https://rgolea.github.io/baneverywhere/apps/baneverywhere/lcov-report/)      |
|Bot            |[![Bot](https://rgolea.github.io/baneverywhere/badges/bot.svg)](https://rgolea.github.io/baneverywhere/apps/bot/lcov-report/)                                    |
|Online Checker |[![Online Checker](https://rgolea.github.io/baneverywhere/badges/online_checker.svg)](https://rgolea.github.io/baneverywhere/apps/online-checker/lcov-report/)   |
|Queue Processor|[![Queue Processor](https://rgolea.github.io/baneverywhere/badges/queue_processor.svg)](https://rgolea.github.io/baneverywhere/apps/queue-processor/lcov-report/)|

|Libs           |Coverage                                                                                                                                                         |
|---	          |---	                                                                                                                                                            |
|Bot Interfaces |[![Bot Interfaces](https://rgolea.github.io/baneverywhere/badges/bot_interfaces.svg)](https://rgolea.github.io/baneverywhere/libs/bot-interfaces/lcov-report/)   |
|DB             |[![DB](https://rgolea.github.io/baneverywhere/badges/db.svg)](https://rgolea.github.io/baneverywhere/libs/db/lcov-report/)                                       |
|Error Handler  |[![Error Handler](https://rgolea.github.io/baneverywhere/badges/error_handler.svg)](https://rgolea.github.io/baneverywhere/libs/error-handler/lcov-report/)      |
|Namespaces     |[![Namespaces](https://rgolea.github.io/baneverywhere/badges/namespaces.svg)](https://rgolea.github.io/baneverywhere/libs/namespaces/lcov-report/)               |
|Twitch Client  |[![Twitch Client](https://rgolea.github.io/baneverywhere/badges/twitch_client.svg)](https://rgolea.github.io/baneverywhere/libs/twitch-client/lcov-report/)      |

# Baneverywhere

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

There are also many [community plugins](https://nx.dev/nx-community) you could add.

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@baneverywhere/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.






## ☁ Nx Cloud

### Computation Memoization in the Cloud

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.

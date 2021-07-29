# About The project

This is an assignment project used to automated the following cases
* Verify that when the user lands on page `https://hub.docker.com/search`. The default tab opened is containers
* Verify the checkboxes under Images with label
* Verify checkboxes under categories
* When a checkbox is clicked the same filter reflects on top
* When a filter is removed from top. Same is removed from left menu

## Commands:
To download all required dependency run:
* `npm install` or `yarn install`

To run tests: 
* If running npm: `npm run test`
* If using yarn: `yarn test`

To generate report:
* If using npm: `npm run create-report`
* if using yarn: `yarn create-report`

To run and also generate report:
* If using npm: `npm run test-with-report`
* If using yarn: `yarn test-with-report`

To create report there's a dependency to install allure. One can install it by running `npm install -g allure-commandline`
auto-cancellation-running-action
-------------

DEPRECATED : Use native [github action functionnalty](https://docs.github.com/en/actions/using-jobs/using-concurrency)

Auto Cancellation allows you to only run builds for the latest commits on a same branch.
Reduce number of minutes usage of github action by killing all old actions running on the same branch and not finished.

## Usage
You can create a `.github/workflows/auto-cancellation.yml` file:

```
name: auto cancellation running job
on: pull_request

jobs:
  cancel:
    name: auto-cancellation-running-action
    runs-on: ubuntu-latest
    steps:
      - uses: fauguste/auto-cancellation-running-action@0.1.4
```

This will trigger the action when a pull request is opened or updated.

## Package

````
npm run package
````
## License
Licensed under the [MIT license](https://github.com/outsideris/potential-conflicts-checker-action/blob/master/LICENSE).

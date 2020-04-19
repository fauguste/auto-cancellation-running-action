auto-cancellation-running-action
-------------

Auto Cancellation allows you to only run builds for the latest commits in the queue.
Reduce number of minutes usage of github action by killing all old actions running on the same branch and not finished.


## Usage
You can create a `.github/workflows/auto-concellation.yml` file:

```
name: auto concellation running job
on: pull_request

jobs:
  build:
    name: potential-conflicts-checker
    runs-on: ubuntu-latest
    steps:
      - uses: fauguste/auto-cancellation-running-action@0.1.0
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
```

This will trigger the action when a pull request is opened or updated.

## License
Licensed under the [MIT license](https://github.com/outsideris/potential-conflicts-checker-action/blob/master/LICENSE).
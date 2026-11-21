# CommitFlix demo

This is a separate, public demo project for the published [`commitflix`](https://www.npmjs.com/package/commitflix) npm package. Its build imports `createDemo`, `history`, `git`, and `diff` from the installed package to generate a four-commit timeline, live snapshot previews, and comparison patches. The deployed page is a prebuilt walkthrough of that real generated data.

**Live demo:** Deployment pending the first npm package release.

## Run the actual CLI locally

Requires Node.js 22+ and Git 2.31+.

```sh
git clone https://github.com/yashpanpaliya11/commitflix-demo.git
cd commitflix-demo
npm install
npm run demo
```

After the npm release, the last command will run the **installed npm package** and open its local dashboard with four sample commits. Pick two commits and click **Play both** to launch independent previews. `Ctrl+C` cleans up the disposable worktrees. To inspect this repository's own timeline, run `npm run start` or `npm run doctor`.

## Build the hosted walkthrough

```sh
npm ci
npm run build
npm test
```

The build calls the installed package, creates a temporary sample Git repository, reads its committed HTML snapshots, computes every pairwise patch, then writes static files into `dist/`. The temporary repository is removed. The website can replay those generated snapshots anywhere; live worktree creation and regression hunting run only on your machine because they execute local project code.

Source package: https://github.com/yashpanpaliya11/commitflix

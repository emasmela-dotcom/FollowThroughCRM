# Push this repo to GitHub

This project is **not** part of CreatorFlow. It has its own Git repo.

**To put it on GitHub:**

1. Create a **new empty repo** on GitHub (e.g. `FollowThroughCRM`).
2. In this folder, add the remote and push:

```bash
cd /Users/ericmasmela/FollowThroughCRM
git remote add origin https://github.com/YOUR_USERNAME/FollowThroughCRM.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME/FollowThroughCRM` with your repo URL. After that, deploy from this repo on Vercel (no root directory needed).

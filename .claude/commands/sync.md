# Git Sync Check

Run the mandatory sync check before starting work:

```bash
git pull origin main
git status
git checkout HEAD -- .
git log --oneline --since="10 minutes ago"
```

Report:
1. Whether there were any new commits pulled
2. Any uncommitted changes present
3. Whether other agents might be active (recent commits)


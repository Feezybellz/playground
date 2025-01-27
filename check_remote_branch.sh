#!/bin/bash

# Navigate to your Git repository directory
# cd /path/to/your/repo

# Specify the branch you want to check
BRANCH="master"  # Replace with your branch name

# Fetch updates from the remote repository
git fetch origin

# Get the latest commit hash for the local branch
local_hash=$(git rev-parse $BRANCH)

# Get the latest commit hash for the remote branch
remote_hash=$(git rev-parse origin/$BRANCH)

# Check if there are remote changes
if [ "$local_hash" != "$remote_hash" ]; then
  echo "There are remote changes detected on branch '$BRANCH'!"
  
  # Trigger your action here
  # For example, send a notification, pull changes, or run a script
  echo "Pulling changes from remote..."
  git pull origin "$BRANCH"

  # Example: Trigger a custom script
  # /path/to/your/script.sh
else
  echo "No remote changes detected on branch '$BRANCH'."
fi

#!/bin/bash

# Specify the branch you want to check
BRANCH="master"  # Replace with your branch name
WORK_DIR="/var/mckodev"  # Replace with your project directory
$SSH_FILE_PATH="/root/.ssh/mckodev"  # Replace with your SSH key path

# Start the SSH agent and add the SSH key (if not already started)
if [ -z "$SSH_AUTH_SOCK" ]; then
  eval "$(ssh-agent -s) " > /dev/null 2>&1
  ssh-add ~/.ssh/mckodev < /dev/null
fi

# Navigate to your Git repository directory
cd $WORK_DIR

# Fetch updates from the remote repository
git fetch origin

# Get the latest commit hash for the local branch
local_hash=$(git rev-parse $BRANCH)

# Get the latest commit hash for the remote branch
remote_hash=$(git rev-parse origin/$BRANCH)

# Check if there are remote changes
if [ "$local_hash" != "$remote_hash" ]; then
  
  # Trigger your action here
  echo "Pulling changes from remote..."
  git pull origin "$BRANCH"
else
 echo "No remote changes detected on branch '$BRANCH'."
fi

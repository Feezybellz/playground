
#!/bin/bash
: <<'COMMENT'
Check if you already have SSH keys by running the following command:
ls -al ~/.ssh

If you don't have an SSH key or you want to create a new one, run:
ssh-keygen -t rsa -b 4096 -C "email@domain.com"

it will ask for path, just press enter to save it in the default path or enter the path you want it to be saved.


After generating the SSH key, you need to ensure the SSH agent is running and add the key:
eval "$(ssh-agent -s)"

ssh-add ~/.ssh/id_rsa 
or 
ssh-add /path/to/your/ssh-key

To copy the SSH key to your clipboard, run:
cat ~/.ssh/id_rsa.pub
or
cat /path/to/your/ssh-key.pub


Then copy the output and add it to your git account.

For github Goto Settings > SSH and GPG keys > New SSH key.
For Bitbucket Goto Settings > SSH keys > Add key.

Then give this file execute permission.
chmod +x /path/to/file


To run this script every 2 minutes, add it to your crontab:
run: 
crontab -e

and add the following line:
*/2 * * * * /path/to/file
COMMENT


# Specify the branch you want to check
BRANCH="master"  # Replace with your branch name
WORK_DIR="/var/mckodev"  # Replace with your project directory
$SSH_FILE_PATH="/root/.ssh/mckodev"  # Replace with your SSH key path

# Start the SSH agent and add the SSH key (if not already started)
if [ -z "$SSH_AUTH_SOCK" ]; then
  eval "$(ssh-agent -s) " > /dev/null 2>&1
  ssh-add ~/.ssh/mckodev  < /dev/null > /dev/null 2>&1
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

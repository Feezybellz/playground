cd /var/db/

# Get a list of databases
databases=$(mysql -u root -p'NewMckodevTechLab@.02'  -e "SHOW DATABASES;" | grep -Ev "(Database|information_schema|performance_schema|mysql)")

# Dump each database into a separate SQL file
for db in $databases; do
    mysqldump -u root -p'NewMckodevTechLab@.02'  --databases $db > $db.sql
done

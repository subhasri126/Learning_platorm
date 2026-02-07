# Backend Setup Guide

## Prerequisites

### 1. Install MySQL
You need MySQL installed and running on your system.

**Option A: MySQL Community Server**
- Download from: https://dev.mysql.com/downloads/mysql/
- Install and note your root password

**Option B: XAMPP (Easier for Windows)**
- Download from: https://www.apachefriends.org/
- Start Apache and MySQL from XAMPP Control Panel

**Option C: Docker (Recommended for developers)**
```bash
docker run --name learnsphere-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=learnsphere -p 3306:3306 -d mysql:8
```

### 2. Configure Database Connection

Edit the `.env` file and update the `DATABASE_URL`:

```env
# If using XAMPP or local MySQL without password:
DATABASE_URL="mysql://root:@localhost:3306/learnsphere"

# If using MySQL with password:
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/learnsphere"

# If using Docker:
DATABASE_URL="mysql://root:password@localhost:3306/learnsphere"
```

### 3. Create Database (if needed)

If the database doesn't exist, create it manually:

```sql
CREATE DATABASE learnsphere;
```

Or use MySQL command line:
```bash
mysql -u root -p
CREATE DATABASE learnsphere;
exit;
```

## Installation Steps

1. **Install dependencies** (Already done! ✓)
```bash
npm install
```

2. **Generate Prisma Client** (Already done! ✓)
```bash
npx prisma generate
```

3. **Run database migrations**
```bash
npx prisma migrate dev --name init
```

4. **Seed database with sample data** (Optional)
```bash
npm run seed
```

5. **Start development server**
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Troubleshooting

### Connection Error P1000
- Make sure MySQL is running
- Verify your username and password in `.env`
- Check if port 3306 is not blocked

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 5000

### Prisma Migration Errors
- Drop and recreate the database: `DROP DATABASE learnsphere; CREATE DATABASE learnsphere;`
- Then run migrations again

## Testing the API

Once the server is running, test the health endpoint:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "LearnSphere API is running"
}
```

## Prisma Studio (Database GUI)

To view/edit data in a browser interface:
```bash
npx prisma studio
```

Opens at `http://localhost:5555`

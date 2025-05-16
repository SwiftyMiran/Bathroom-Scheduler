# MongoDB Installation Guide

Since MongoDB is not currently installed on your system, you'll need to install it to use the Bathroom Scheduler application.

## Installation Instructions for macOS

### Using Homebrew (Recommended)

1. If you don't have Homebrew installed, install it first:

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install MongoDB:

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

3. Start MongoDB service:
   ```bash
   brew services start mongodb-community
   ```

### Alternative: Using MongoDB Atlas (Cloud Database)

If you prefer not to install MongoDB locally, you can use MongoDB Atlas, a cloud-based MongoDB service:

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free cluster
3. Set up a database user
4. Add your IP address to the IP access list
5. Get your connection string
6. Update the connection string in `Main/index.js`:

   Change this line:

   ```javascript
   mongoose.connect("mongodb://localhost:27017/bathroom-scheduler", {
   ```

   To your MongoDB Atlas connection string:

   ```javascript
   mongoose.connect("your-mongodb-atlas-connection-string", {
   ```

## Verifying MongoDB Installation

After installation, you can verify MongoDB is running with:

```bash
mongo --eval "db.version()" || mongosh --eval "db.version()"
```

## Running the Application

Once MongoDB is properly installed and running:

1. Start the application:

   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:1530
   ```

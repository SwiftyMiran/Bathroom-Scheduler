# Running Your Bathroom Scheduler Application

## Installation and Setup

1. **Fix Permissions Issue**

   ```bash
   sudo chown -R $(whoami) /Users/miranrexhepi/Documents/Bathroom\ scheduler/
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Application**

   ```bash
   npm start
   ```

4. **Access the Application**
   Open your web browser and navigate to:
   ```
   http://localhost:1530
   ```

## Using the Application

1. **Schedule a Bathroom Reservation**

   - Fill in your name
   - Select a start time
   - Select an end time
   - Optionally, add a reason
   - Click "Schedule Bathroom"

2. **View Reservations**

   - All current reservations will be displayed in the table below the form

3. **Edit or Delete a Reservation**
   - Use the "Edit" button to modify an existing reservation
   - Use the "Delete" button to remove a reservation

## Troubleshooting

### MongoDB Connection Issues

The application will try to connect to a local MongoDB instance first. If that fails, it will automatically use an in-memory MongoDB server for development purposes.

Note that with the in-memory solution, all data will be lost when you restart the application.

For a more permanent solution, please install MongoDB locally by following the instructions in the MONGODB_SETUP.md file.

### Permission Issues

If you encounter permission issues when installing packages:

```bash
sudo npm install
```

Or fix the ownership of the project directory:

```bash
sudo chown -R $(whoami) /Users/miranrexhepi/Documents/Bathroom\ scheduler/
```

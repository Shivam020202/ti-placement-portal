# Database Setup & Migration Guide

## For New Installations

1. Create a MySQL database
2. Copy `.env.example` to `.env` in the `backend` folder
3. Update the database credentials in `.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=your_database_name
   ```
4. Start the backend server: `cd backend && npm start`
5. Sync the database schema by visiting: `http://localhost:8000/sync`

## For Existing Installations (After Code Updates)

If you have an existing database and have pulled new code changes:

### Quick Method

1. Start the backend server: `cd backend && npm start`
2. Open browser and visit: `http://localhost:8000/sync`
3. You should see "Successfully Synced"

### What the Sync Does

- Creates any new tables that don't exist
- Adds new columns to existing tables
- **Does NOT delete existing data**
- **Does NOT drop existing columns**

## Recent Database Changes (December 2024)

### Resumes Table Changes

The `resumes` table has been updated with new columns for database-based file storage:

| Column          | Type       | Description                           |
| --------------- | ---------- | ------------------------------------- |
| `id`            | INTEGER    | Primary key (existing)                |
| `name`          | STRING     | Display name (existing)               |
| `user`          | STRING     | User email (existing)                 |
| `url`           | STRING     | Firebase URL (existing, now optional) |
| `original_name` | STRING     | **NEW** - Original filename           |
| `mime_type`     | STRING     | **NEW** - File MIME type              |
| `file_data`     | MEDIUMBLOB | **NEW** - Actual file content         |
| `file_size`     | INTEGER    | **NEW** - File size in bytes          |

### Listing Reviews Table

The `listing_reviews` table stores job approval status:

| Column          | Type   | Description                                                 |
| --------------- | ------ | ----------------------------------------------------------- |
| `status`        | ENUM   | 'under_review', 'changes_requested', 'approved', 'rejected' |
| `status_reason` | STRING | Reason for status (required for rejected)                   |

## Troubleshooting

### Error: "Column doesn't exist"

Run the sync endpoint: `http://localhost:8000/sync`

### Error: "Table doesn't exist"

Run the sync endpoint: `http://localhost:8000/sync`

### Error: "Cannot add foreign key constraint"

This usually means data inconsistency. Check that referenced IDs exist.

### Sync Endpoint Returns Error

Check the backend console for detailed error messages. Common issues:

- Database connection failed (check `.env` credentials)
- Permission issues (ensure user has ALTER privileges)

## Manual Migration (Advanced)

If you prefer to manually update the database:

```sql
-- Add new columns to resumes table
ALTER TABLE resumes
ADD COLUMN original_name VARCHAR(255),
ADD COLUMN mime_type VARCHAR(255),
ADD COLUMN file_data MEDIUMBLOB,
ADD COLUMN file_size INT,
MODIFY COLUMN url VARCHAR(255) NULL;
```

## Environment Variables

Ensure these are set in `backend/.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=placement_portal

# Server
PORT=8000

# Firebase (for authentication)
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
# ... other Firebase config
```

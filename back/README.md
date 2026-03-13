# KGM Mobility API Backend

Laravel API backend for KGM Mobility website.

## Setup Instructions

### 1. Install Dependencies

```bash
composer install
```

### 2. Environment Configuration

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

### 3. Database Configuration

#### Option A: SQLite (Default - Easiest for Development)

The default configuration uses SQLite. Just make sure the database file exists:

```bash
touch database/database.sqlite
```

#### Option B: MySQL/MariaDB

Update your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kgm_mobility
DB_USERNAME=root
DB_PASSWORD=your_password
```

#### Option C: PostgreSQL

Update your `.env` file:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=kgm_mobility
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 4. Run Migrations

```bash
php artisan migrate
```

### 5. Start Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Coming Soon Form

**POST** `/api/coming-soon`

Submit coming soon form data.

**Request Body:**
```json
{
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+212 6 12 34 56 78",
  "email": "john.doe@example.com",
  "ville": "Casablanca"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Merci ! Nous vous tiendrons informé lors du lancement.",
  "data": {
    "id": 1,
    "nom": "Doe",
    "prenom": "John",
    ...
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Health Check

**GET** `/api/health`

Check if the API is running.

## CORS Configuration

CORS is configured in `config/cors.php`. By default, it allows requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- All origins (`*`)

Update the `allowed_origins` array in `config/cors.php` for production.

## Frontend Integration

In your Next.js frontend, set the API URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Environment Variables

Add these to your `.env` file:

```env
# Form notification email
FORM_NOTIFICATION_EMAIL=kgmmorocco@gmail.com

# KGM Webhook URL for sending leads
# For testing: use your local webhook endpoint (creates a loop for testing)
# For production: use KGM's production webhook endpoint
KGM_WEBHOOK_URL=http://localhost:8000/api/webhook/kgm
```

**Note:** For testing, you can set `KGM_WEBHOOK_URL` to your local webhook endpoint (`http://localhost:8000/api/webhook/kgm`) to test the full flow. For production, update it to KGM's actual webhook endpoint.

## Database Schema

### coming_soon_submissions

- `id` - Primary key
- `nom` - Last name (required)
- `prenom` - First name (required)
- `telephone` - Phone number (required)
- `email` - Email address (required)
- `ville` - City (optional)
- `ip_address` - IP address of submitter
- `user_agent` - Browser user agent
- `created_at` - Timestamp
- `updated_at` - Timestamp

## License

ISC


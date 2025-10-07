# Node.js Design Patterns on Express

A tour booking application built with Node.js, Express, and MongoDB demonstrating various design patterns.

## Environment Configuration

This project uses environment variables for configuration. There are two main configuration files:

### `config.env` (Template)
This file contains template/placeholder values and is tracked by git. It serves as a reference for what environment variables are needed.

### `config.env.local` (Local Development)
This file contains your actual development credentials and is **NOT tracked by git** (added to `.gitignore`).

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd node.js-design-patterns-on-express
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `config.env` to `config.env.local`
   - Update `config.env.local` with your actual credentials:
     ```bash
     cp config.env config.env.local
     ```
   - Edit `config.env.local` and add your actual values:
     - Mailtrap credentials for email testing
     - Database passwords (if using remote MongoDB)
     - Any other sensitive configuration

4. **Set up local MongoDB** (if using local database)
   - Install MongoDB locally
   - Start MongoDB service on port 27017
   - The application will connect to `mongodb://localhost:27017/natours-test`

5. **Start the application**
   ```bash
   npm start
   # or for development
   npm run start:dev
   # or for production
   npm run start:prod
   ```

## Configuration Loading

The application automatically loads configuration in this priority order:
1. `config.env.local` (if it exists) - for local development with real credentials
2. `config.env` - template file with placeholder values

This means you can:
- Use `config.env.local` for local development (ignored by git)
- Use `config.env` as a reference template (tracked by git)

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE` | MongoDB connection string | `mongodb://localhost:27017/natours-test` |
| `JWT_SECRET` | Secret for JWT token signing | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT token expiration | `30d` |
| `JWT_COOKIE_EXPIRES_IN` | JWT cookie expiration (days) | `30` |
| `EMAIL_USERNAME` | Mailtrap username | `your-mailtrap-username` |
| `EMAIL_PASSWORD` | Mailtrap password | `your-mailtrap-password` |
| `EMAIL_HOST` | Email service host | `sandbox.smtp.mailtrap.io` |
| `EMAIL_PORT` | Email service port | `2525` |

## Email Testing with Mailtrap

This project uses [Mailtrap](https://mailtrap.io/) for email testing in development:

1. Create a free Mailtrap account
2. Get your inbox credentials
3. Add them to your `config.env.local` file
4. All emails will be captured in your Mailtrap inbox instead of being sent to real recipients

## Security Notes

- **Never commit sensitive credentials** to version control
- The `config.env.local` file is ignored by git for security
- Use different credentials for development, staging, and production
- Rotate credentials regularly

## Database Options

The application supports both local and remote MongoDB:

- **Local**: `mongodb://localhost:27017/natours-test` (default)
- **Remote**: MongoDB Atlas or other cloud providers

Update the `DATABASE` variable in `config.env.local` to switch between them.

## Contributing

When contributing to this project:

1. Never commit your `config.env.local` file
2. Update the `config.env` template if you add new environment variables
3. Document any new environment variables in this README

## Scripts

- `npm start` - Start the application with nodemon (development)
- `npm run start:dev` - Start with nodemon (development mode)
- `npm run start:prod` - Start with node (production mode)
- `npm run debug` - Start with ndb debugger

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for emails
- And more...
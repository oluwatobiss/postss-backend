# Postss Rest API

Postss is a social media app, similar to Threads.com, that enables users to socialize and engage in discussions with people worldwide.

## Features

- **Authentication:** Create an account, log in, and log out of websites.
- **Authorization:** Only logged-in users have access to protected routes.
- **CRUD:** Most routes have complete Create, Read, Update, and Delete support.
- **Secured forms:** Forms' data are thoroughly sanitized and validated.
- **Tested Routes:** User registration form have thorough testing that ensures the request-response cycle works appropriately.

## Users and privileges

- **Subscriber:** Follower of an account
- **Owner:** Creator of an account
- **Admin:** An administrator

| Privilege                   | Subscriber | Owner | Admin |
| --------------------------- | ---------- | ----- | ----- |
| Create an account           | Yes        | Yes   | Yes   |
| Create post                 | Yes        | Yes   | Yes   |
| Manage post                 | No         | Yes   | No    |
| Delete post                 | No         | No    | Yes   |
| Send follow requests        | Yes        | Yes   | Yes   |
| Comment                     | Yes        | Yes   | Yes   |
| Manage profile              | No         | Yes   | No    |
| Delete personal account     | Yes        | Yes   | No    |
| Delete non-personal account | No         | No    | Yes   |

## API Routes

### Login

- `GET /login` Authenticate user via GitHub strategy
- `GET /login/github` Handle authentication success or failure (set user's data in-state on auth success)
- `GET /login/user` Get the user's data via cookie
- `POST /login` Authenticate user via Local strategy

### Logout

- `POST /logout` Clear user's cookie

### Post

- `GET /posts` Fetch all posts
- `GET /posts/authors/:authorId` Fetch all posts by a single author
- `GET /posts/:postId/comments` Fetch all comments in a single post
- `POST /posts` Create a new post
- `POST /posts/:postId/comments` Create a new comment for a single author in a single post
- `PUT /posts/:id` Update a single post
- `PUT /posts/:postId/comments/:id` Update a single comment in a single post
- `DELETE /posts/:id` Delete a single post
- `DELETE /posts/:postId/comments/:id` Delete a single comment in a single post

### User

- `GET /users` Fetch all users' data
- `POST /users` Create a new user account
- `PUT /users/:id` Update a single user's data
- `PUT /users/:followId/:id` Update a single user's follow data by following or unfollowing them
- `DELETE /users/:id` Delete a single user's data

## Technologies used

- Bcrypt: Hash password
- Cloudinary: Store images
- Cookie Parser: Store JWT in cookie
- Cors: Configure CORS
- Dotenv: Load `.env` file's environment variables
- ESLint: Lint code
- Express.js: Provide tools that streamline Node.js code
- Express Validator: Validate and sanitize forms
- Faker: Generate realistic-looking fake data
- JSON Web Token: Generate and verify JSON Web Tokens (JWTs)
- Multer: Process forms with `enctype="multipart/form-data"` attribute
- Node.js: Use JavaScript to develop app's backend
- Node Test runner (node:test): Run test cases
- Passport.js (local and github strategy): Verify user credentials
- PostgreSQL: Store and manage structured data
- Prisma ORM: Use type-safe JavaScript APIs to interact with database
- Socket IO: Enable event-based simultaneous communication between server and client
- SuperTest: Create HTTP routes' test cases
- TypeScript: Type check code
- TypeScript Execute (tsx): Run TypeScript code

## Usage

1. Clone the project

```bash
git clone https://github.com/oluwatobiss/postss-backend.git
```

2. Navigate into the project repo

```bash
cd postss-backend
```

3. Install dependencies

```bash
npm install
```

4. Create an environment variable file

```bash
touch .env
```

5. Define the project's environment variables

```
ADMIN_CODE=example-code
CLOUDINARY_CLOUD_NAME=exam0plex
CLOUDINARY_API_KEY=000000000000000
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://username:password@localhost:5432/posts
DEMO_EMAIL=example@mail.com
DEMO_PASSWORD=example-password
GITHUB_CLIENT_ID=Oe00xampL0eidcl0IEN0
GITHUB_CLIENT_SECRET=00000e00000x0a0m00mp000lesec00r00e00t000
JWT_SECRET=example_jwt_secret
PORT=3001
POSTSS_APP_URI=http://localhost:3000
```

6. Migrate the project's schema to your database

```bash
npm run db:dev
```

7. Start the server

```bash
npm run dev
```

## Related Repos

- [Postss Website](https://github.com/oluwatobiss/postss-frontend)

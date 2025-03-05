# Mystery Message Web App

A web application where users can sign in, generate a unique URL, and share it with friends. Friends can then send anonymous messages to the user through the generated link.

## Features

- User authentication (Sign in/Sign out)
- URL generation for receiving messages
- Anonymous messaging system
- Secure and private message storage

## Tech Stack

- **Next.js** - React framework for server-side rendering and static site generation
- **TypeScript** - Strongly typed JavaScript for better development experience
- **MongoDB/Firebase** - Database for storing messages
- **Tailwind CSS** - Styling for modern UI

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/mystery-message.git
cd mystery-message
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Environment Variables

Create a `.env.local` file and add the necessary environment variables:

```env
MONGODB_URI="your mongodb uri"
RESEND_API_KEY="your resend api key"
NEXTAUTH_SECRET="secretkey"
```

## Deployment

To deploy on **Vercel**, run:

```bash
vercel
```

Alternatively, deploy on **Netlify** or **Render** based on your preference.

## Contributing

Contributions are welcome! Feel free to fork the repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, reach out via [GitHub Issues](https://github.com/your-username/mystery-message/issues).


# chat.usmans.me

A modern, real-time chat application built with React, TanStack Start, and AI integration.

**🏆 This is a submission to the [T3 Chat Cloneathon](https://cloneathon.t3.chat)**

## ✨ Features

- 🔐 **Authentication** - Secure user authentication with Supabase
- 💬 **Real-time Chat** - Instant messaging with multiple AI providers
- 🤖 **AI Integration** - Support for OpenAI, Anthropic, and Google AI models
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS and Shadcn UI components
- 📱 **Responsive Design** - Works seamlessly on mobile
- ⚡ **Fast Performance** - Built for optimal speed
- 🔗 **Chat Sharing** - Share conversations with others
- 🗄️ **Database** - PostgreSQL with Drizzle ORM

## 🛠️ Tech Stack

- **Frontend**: React 19, TanStack Start, TanStack Query
- **Styling**: Tailwind CSS, Shadcn UI
- **AI**: AI SDK with multiple provider support
- **Database**: PostgreSQL, Drizzle ORM, Supabase
- **Runtime**: Bun
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/max-programming/chat.usmans.me.git
cd chat.usmans.me
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Configure your environment variables:
- Supabase credentials
- AI provider API keys (OpenAI, Anthropic, Google)
- Database connection string

4. Push the database schema to Supabase
```bash
bun run db:push
```

### Development

Start the development server:
```bash
bun run dev
```

### Building for Production

Build the application:
```bash
bun run build
```

Start the production server:
```bash
bun start
```

## 🔧 Configuration

The application supports multiple AI providers. Configure them in your environment:

- **OpenAI**: Set `OPENAI_API_KEY`
- **Anthropic**: Set `ANTHROPIC_API_KEY`
- **Google AI**: Set `GOOGLE_AI_API_KEY`

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

![Evaly_ Innovative assessment solution _ Design customized evaluations_ knowledge · 5 09am · 04-30](https://github.com/user-attachments/assets/9747ba46-b0e0-4b75-9224-eeed8b554d09)


# Evaly
Online examination platform that makes creating, distributing, and analyzing tests easy and secure.

## ✨ Features

1. **AI Question Generator** - Create questions by specifying topic, difficulty, and type
2. **Flexible Exam Formats** - List or presentation views with rich media support
3. **Flexible Scheduling** - Live synchronized tests or self-paced with custom time limits
4. **AI-Powered Analytics** - Insights into performance and potential issues
5. **Comprehensive Proctoring** - Webcam, tab/window detection, and activity logging
6. **Automatic Certification** - Generate certificates upon completion
7. **Collaboration Tools** - Team creation and external examiner access

## 🚀 Tech Stack

- **Framework**: Next.js 15 with tRPC
- **Database**: PostgreSQL (Supabase) with Drizzle ORM
- **Storage**: R2
- **Styling**: Tailwind CSS with Radix UI
- **Deployment**: AWS, SST.dev with OpenNext (Full-stack), Coolify (Supabase)  
- **Auth**: Better Auth
- **AI**: Gemini, OpenAI

## 🛠️ Development

### Prerequisites

- Node.js
- Bun
- PostgreSQL database

### Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/evaly.git
   cd evaly
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server
   ```bash
   bun dev
   ```

5. Database commands
   ```bash
   bun db:generate   # Generate migration files
   bun db:migrate    # Apply migrations
   bun db:studio     # Open Drizzle Studio
   ```

## 🤝 Contributing

Contributions welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md)

## 🙏 Acknowledgements

- All the amazing open-source libraries and tools that make this project possible
- The community for their continuous support and contributions

# Student Attendance Tracker

A modern, web-based attendance tracking system built with Next.js, React, and TypeScript. Track attendance for multiple subjects and students with an intuitive interface.

## Features

- 📊 **Multi-Subject Tracking** - Track attendance across multiple theory and lab subjects
- 👥 **Student Management** - Manage attendance for 71+ students
- 📈 **Real-time Statistics** - View attendance percentages with color-coded indicators
- ✏️ **Edit & Delete** - Modify or remove attendance records
- 📥 **Excel Export** - Export attendance data to Excel format
- 💾 **Local Storage** - Data persists in browser localStorage
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Next.js 15** - React framework for production
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **XLSX** - Excel file generation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd student-attendance-tracker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
student-attendance-tracker/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── post-attendance/   # Post attendance page
│   ├── view-attendance/   # View attendance by subject
│   ├── edit-attendance/   # Edit attendance records
│   └── overall-attendance/# Overall attendance view
├── components/            # React components
│   └── ui/               # UI component library
├── lib/                   # Utility functions
│   ├── attendance-data.ts # Student and subject data
│   ├── storage.ts         # LocalStorage operations
│   ├── excel-export.ts    # Excel export functionality
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Usage

1. **Post Attendance**: Click "Post Attendance" and select a subject, date, time, and mark absent students
2. **View Attendance**: Click on any subject card to view detailed attendance records
3. **Edit Records**: Click the edit icon on any attendance record to modify it
4. **Overall View**: View attendance across all subjects in one table
5. **Export Data**: Click "Export Excel" to download attendance data as an Excel file

## Important Notes

⚠️ **Data Storage**: This app uses browser localStorage. Data is stored locally and will be lost if:
- Browser cache is cleared
- You use a different browser or device
- You use incognito/private mode

💡 **Backup Recommendation**: Regularly export your data using the "Export Excel" feature to prevent data loss.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect Next.js and deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `.next`

### Deploy to GitHub Pages

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and React

import "./globals.css";

export const metadata = { title: "Valyra Portal" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          <header className="flex items-center justify-between mb-6">
            <div className="text-xl font-semibold">Valyra</div>
            <a className="btn btn-ghost" href="/logout">Logout</a>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}

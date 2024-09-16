import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>FPL Assistant</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Open+Sans&display=swap" rel="stylesheet" />
      </Head>
      <header className="bg-primary text-white p-4">
        <h1 className="text-2xl font-heading">FPL Assistant</h1>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-primary text-white p-4 mt-8">
        <p className="text-center">&copy; 2023 FPL Assistant</p>
      </footer>
    </div>
  );
}
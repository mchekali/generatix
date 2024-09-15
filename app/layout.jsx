import "@styles/globals.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";
import { ThemeProvider } from "next-themes";
import { Poppins, Fredoka } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-fredoka",
});

export const metadata = {
  title: "AI Art Transformer for Kids",
  description:
    "Transform children's drawings into photorealistic images with AI",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className={`${poppins.variable} ${fredoka.variable}`}>
      <body className="font-poppins bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Provider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Nav />
            <main className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
              {children}
            </main>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;

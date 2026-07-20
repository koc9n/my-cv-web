import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kostiantyn Mironchyk | Senior Full Stack Developer",
  description: "Senior Java and Full Stack Developer with 10+ years of experience in enterprise systems, cloud migrations, and scalable web platforms.",
  keywords: ["Senior Java Developer", "Senior Full Stack Developer", "Senior Software Engineer", "Spring Boot", "AWS", "Angular"],
  openGraph: { title: "Kostiantyn Mironchyk | Senior Full Stack Developer", description: "Java, full-stack, cloud, and enterprise engineering experience.", type: "profile" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

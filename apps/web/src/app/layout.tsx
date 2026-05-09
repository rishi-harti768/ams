import "@/styles/globals.css";
import { TooltipProvider } from "@ams/ui/components/tooltip";
import type { Metadata } from "next";
import { Noto_Serif_Georgian, Open_Sans } from "next/font/google";
import Header from "@/components/header";
import Providers from "@/components/providers";

const fontSans = Open_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontSerif = Noto_Serif_Georgian({
	subsets: ["latin"],
	variable: "--font-serif",
});

export const metadata: Metadata = {
	title: "AMS | Academic Management System",
	description:
		"Track your academic performance, CGPA, and semester goals efficiently.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${fontSans.variable} ${fontSerif.variable} antialiased`}
			>
				<Providers>
					<TooltipProvider>
						<div className="grid h-svh grid-rows-[auto_1fr]">
							<Header />
							{children}
						</div>
					</TooltipProvider>
				</Providers>
			</body>
		</html>
	);
}

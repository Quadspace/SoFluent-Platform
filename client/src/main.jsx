import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { BrowserRouter } from "react-router-dom";
import "./i18n/config"; // Initialize i18n

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we have a valid Clerk key
const hasValidClerkKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith('pk_') && PUBLISHABLE_KEY.length > 20;

// Dynamic import for ClerkProvider only when we have a valid key
const renderApp = async () => {
	if (hasValidClerkKey) {
		// Use Clerk when valid key is available
		const { ClerkProvider } = await import("@clerk/clerk-react");
		
		createRoot(document.getElementById("root")).render(
			<BrowserRouter>
				<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
					<AppContextProvider>
						<App />
					</AppContextProvider>
				</ClerkProvider>
			</BrowserRouter>
		);
	} else {
		// Preview mode - no Clerk
		console.warn('Clerk publishable key not set. Running in preview mode without authentication.');
		
		createRoot(document.getElementById("root")).render(
			<BrowserRouter>
				<AppContextProvider>
					<App />
				</AppContextProvider>
			</BrowserRouter>
		);
	}
};

renderApp();

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../lib/util";

export default function Unsubscribe() {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const { token: pathToken } = useParams<{ token?: string }>();

    useEffect(() => {
        const unsubscribe = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = pathToken ?? params.get("token");

            if (!token) {
                setStatus("error");
                setMessage("Invalid unsubscribe link.");
                return;
            }

            try {
                const response = await fetch(
                    `${config.apiBaseUrl}/api/auth/me/subscription?unsubscribe_token=${encodeURIComponent(
                        token
                    )}`
                );

                if (!response.ok) {
                    const contentType = response.headers.get("content-type") || "";
                    let bodyText = "";
                    try {
                        bodyText = contentType.includes("application/json")
                            ? JSON.stringify(await response.json())
                            : await response.text();
                    } catch (e: any) {
                        bodyText = `Error: ${e.message} (failed to read response body)`;
                    }

                    console.error("Unsubscribe failed", {
                        status: response.status,
                        statusText: response.statusText,
                        body: bodyText,
                        url: response.url,
                    });

                    setStatus("error");
                    setMessage(
                        bodyText || `Unsubscribe failed with status ${response.status}`
                    );
                    return;
                }

                // success
                setStatus("success");
                setMessage("You have been successfully unsubscribed from these alerts.");
            } catch (error: any) {
                console.error("Network or unexpected error during unsubscribe:", error);
                setStatus("error");
                setMessage(
                    error?.message || "We couldn't unsubscribe you. The link may be invalid or expired."
                );
            }
        };

        unsubscribe();
    }, [pathToken]);

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "100px auto",
                padding: "40px",
                textAlign: "center",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {status === "loading" && (
                <>
                    <h1>Unsubscribing...</h1>
                    <p>Please wait.</p>
                </>
            )}

            {status === "success" && (
                <>
                    <h1>Unsubscribed</h1>
                    <p>{message}</p>
                </>
            )}

            {status === "error" && (
                <>
                    <h1>Something went wrong</h1>
                    <p>{message}</p>
                </>
            )}
        </div>
    );
}
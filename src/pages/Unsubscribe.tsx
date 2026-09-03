import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_HOST = "https://elbeatoserverrealp.tailc1c195.ts.net";

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
                    `${API_HOST}/api/auth/me/subscription?unsubscribe_token=${encodeURIComponent(token)}`
                );

                if (!response.ok) {
                    throw new Error("Unsubscribe request failed");
                }

                setStatus("success");
                setMessage("You have been successfully unsubscribed from these alerts.");
            } catch (error) {
                console.error(error);
                setStatus("error");
                setMessage(
                    "We couldn't unsubscribe you. The link may be invalid or expired."
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
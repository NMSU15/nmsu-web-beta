'use client'

import { useState } from "react";
// import styles from "./LeaveClubButton.module.scss";

export default function LeaveClubButton({ clubId }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLeaveClub = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:3030/api/clubs/leave`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ clubId }),
            });

            if (!res.ok) {
                throw new Error("Failed to leave the club");
            }

            const data = await res.json();
            console.log(data);

            if (data.success) {
                alert("You have successfully left the club.");
                location.reload();
                // Optionally, you can redirect or update the UI here
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
            console.error("Error leaving club:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button style={{padding: "1rem 1.5rem", borderRadius: "1rem", color: "white", backgroundColor: "#3f3f3f"}} onClick={handleLeaveClub} disabled={loading}>
            {loading ? "Leaving..." : "Leave Club"}
        </button>
    );
}

'use client';

// import styles from './page.module.scss';

export default function JoinClubButton({ clubId }) {
    const handleJoinClub = async () => {
        try {
            const response = await fetch('/api/clubs/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clubId }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Successfully joined the club!');
                location.reload();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error joining club:', error);
            alert('An unexpected error occurred.');
        }
    };

    return (
        <button style={{padding: "1rem 1.5rem", borderRadius: "1rem", color: "white", backgroundColor: "#3f3f3f"}} onClick={handleJoinClub}>
            Join Club
        </button>
    );
}

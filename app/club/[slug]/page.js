import Image from "next/image";
import styles from "./page.module.scss";
import JoinClubButton from "@/components/JoinClubButton";
import LeaveClubButton from "@/components/LeaveClubButton"; // Ensure you have this component
import Link from "next/link";
import { getServerSession } from "next-auth"; // Adjust if using a different auth mechanism
import { authOptions } from "../../api/auth/[...nextauth]/route"; // Adjust path as needed

export default async function Page({ params }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return <main>You need to log in to view this page</main>;
    }

    const userEmail = session.user.email;

    const res = await fetch(`http://localhost:3030/api/clubs/get-one?id=${params.slug}`, 
        { cache: "no-store" }
    );

    if (!res.ok) {
        const errorMessage = await res.text();
        console.error("Error fetching data:", errorMessage);
        return <main>Error fetching club data</main>;
    }

    const data = await res.json();
    console.log(data);

    if (!data.club) {
        return <main>Club not found</main>;
    }

    // Check if the current user is a member of the club
    const isUserMember = data.club.members.some(member => member.email === userEmail);

    return (
        <main className={styles.main}>
            <section className={styles.sec}>
                <div className={styles.bg}>
                    {data.club.cover_image_url && (
                        <Image
                            className={styles.imagebg}
                            width={960}
                            height={540}
                            quality={100}
                            format="webp"
                            src={data.club.cover_image_url}
                            alt="Cover Image"
                        />
                    )}
                    <div className={styles.grad}></div>
                    <div className={styles.top}>
                        {data.club.profile_image_url && (
                            <Image
                                className={styles.imagepro}
                                width={128}
                                height={128}
                                quality={100}
                                format="webp"
                                src={data.club.profile_image_url}
                                alt="Profile Image"
                            />
                        )}
                        <h3 className={styles.name}>{data.club.name}</h3>
                    </div>
                </div>
                <div className={styles.members}>
                    <h3>Club Members</h3>
                    {data.club.members && data.club.members.length > 0 ? (
                        <div className={styles.memberGrid}>
                            {data.club.members.map((member) => (
                                <div key={member.id} className={styles.memberCard}>
                                    {member.image && (
                                        <Image
                                            src={member.image}
                                            alt={""}
                                            width={64}
                                            height={64}
                                            className={styles.memberAvatar}
                                        />
                                    )}
                                    <div className={styles.memberInfo}>
                                        <p className={styles.memberName}>{member.name}</p>
                                        {member.email && (
                                            <p className={styles.memberEmail}>{member.email}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No members in this club yet</p>
                    )}
                </div>
            </section>
            <section className={styles.sec2}>
                {isUserMember ? (
                    <LeaveClubButton clubId={params.slug} />
                ) : (
                    <JoinClubButton clubId={params.slug} />
                )}
            </section>
        </main>
    );
}

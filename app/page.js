import Image from "next/image";
import styles from "./page.module.scss";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Page() {
  
  const session = await getServerSession(authOptions);

  const user = session?.user;

  try {
    const res = await fetch(`http://localhost:3030/api/clubs/get`, {
      cache: 'no-store',
      // next: { revalidate: 1 },
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      console.error('Fetch Error:', errorMessage);
      throw new Error(`Failed to fetch clubs data: ${res.status} ${errorMessage}`);
    }

    const clubs = await res.json();

    return (
      <main>
        <div>
          {clubs.length === 0 ? (
            <p>No clubs available.</p>
          ) : (
            <section className={styles.clublist}>
              {clubs.map((club) => (
                <Link key={club.id} href={`/club/${club.id}`}>
                  <div
                    className={styles.club}
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.8) 100%), url(${club.cover_image_url ? `/api/image-proxy?url=${encodeURIComponent(`${club.id}/${club.cover_image}`)}?thumb=500x300` : './Logo.svg'})`,
                    }}
                  >
                    <div className={styles.inner}>
                      <div className={styles.pop}></div>
                      <h2 className={styles.title}>{club.name}</h2>
                      <p className={styles.desc}>{club.description}</p>
                      <Image
                        src={club.profile_image_url ? `${club.profile_image_url}` : '/Logo.svg'}
                        width={100}
                        height={100}
                        quality={100}
                        format="webp"
                        className={styles.proImg}
                      />
                      <div className={styles.members}>
                        {club.members && club.members.map(member => (
                          <Image
                            key={member.id}
                            src={member.image}
                            width={32}
                            height={32}
                            quality={100}
                            format="webp"
                            alt={``}
                            className={styles.memberImg}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in fetching clubs:', error);
    return (
      <main>
        <div>
          <h1>Error fetching clubs</h1>
          <p>{error.message}</p>
        </div>
      </main>
    );
  }
}

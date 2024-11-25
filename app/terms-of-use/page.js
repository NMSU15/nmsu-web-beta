import React from 'react';

const TermsOfUse = () => {
  return (
    <main style={styles.container}>
      <h1 style={styles.header}>Terms of Use</h1>
      <p style={styles.date}><strong>Effective Date: </strong>2024.11.24</p>

      <section style={styles.section}>
        <h2 style={styles.subheader}>1. Acceptance of Terms</h2>
        <p>
          By accessing or using our web app, you agree to be bound by these Terms of Use and any
          policies referenced herein. If you do not agree, you must discontinue use of the platform
          immediately.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheader}>2. Eligibility</h2>
        <p>
          Our platform is designed exclusively for students of New Mongol Institute of Technology. You must:
          <ul>
            <li>Be at least [Minimum Age, e.g., 13] years old.</li>
            <li>Have a valid school email to log in via Google OAuth.</li>
          </ul>
          By using the platform, you confirm that you meet these requirements.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheader}>3. User Accounts</h2>
        <p>
          Authentication is handled through Google OAuth. By signing in, you agree to comply with
          Google’s Terms of Service and Privacy Policy.
        </p>
        <p>
          You are responsible for safeguarding your login credentials. Unauthorized use of your
          account must be reported to us immediately. We reserve the right to terminate or suspend
          accounts for violations of these Terms.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subheader}>4. Data Collection and Privacy</h2>
        <p>
          We collect minimal data necessary for the app to function, including your name, email
          address, and any information you provide in club forms or interactions. Your data is
          processed in accordance with our <a href="/privacy-policy" style={styles.link}>Privacy Policy</a>.
        </p>
        <p>
          <strong>Google OAuth:</strong> We use Google OAuth solely for authentication and do not
          access or store your Google password.
        </p>
      </section>

      <footer style={styles.footer}>
        <p>If you have questions about these Terms of Use, contact us at <a href="mailto:student_union@nmit.edu.mn" style={styles.link}>student_union@nmit.edu.mn</a>.</p>
      </footer>
    </main>
  );
};

const styles = {
  container: {
    lineHeight: '1.6',
    width: '960px'
  },
  header: {
    fontSize: '2rem',
    marginBottom: '10px',
    color: '#fff',
  },
  date: {
    fontSize: '1rem',
    color: '#666',
  },
  section: {
    marginBottom: '20px',
  },
  subheader: {
    fontSize: '1.5rem',
    color: '#fff',
    marginBottom: '10px',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  footer: {
    marginTop: '30px',
    fontSize: '0.9rem',
    color: '#555',
  },
};

export default TermsOfUse;

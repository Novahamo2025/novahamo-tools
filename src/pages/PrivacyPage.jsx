import Breadcrumbs from '../components/Breadcrumbs';

export default function PrivacyPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Privacy Policy' },
        ]} />

        <h1 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>Privacy Policy</h1>

        <div style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            <strong style={{ color: 'var(--color-text)' }}>Last updated:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            1. Overview
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            NovaHamo Tools ("we", "our", "us") is operated by NovaHamo Technologies Pvt. Ltd.
            We are committed to protecting your privacy. This policy explains how we handle information when you use our tools.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            2. Local Processing
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            The majority of our tools process your files and data <strong style={{ color: 'var(--color-text)' }}>entirely in your web browser</strong>.
            Your files are not uploaded to our servers. Processing happens locally on your device using JavaScript and browser APIs.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            3. External Services
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            Some tools may optionally use external services (such as currency exchange rate APIs). When an external service
            is required, we clearly indicate this on the tool page. We do not send your personal files to external services
            without your knowledge.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            4. Data Collection
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            We do not require user registration or login. We do not collect personal information.
            We do not use tracking scripts or analytics by default.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            5. Browser Storage
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            Some tools may use browser localStorage for convenience (such as saving theme preferences or notepad content).
            This data stays on your device and can be cleared through your browser settings or through the provided clear options in each tool.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            6. Cookies
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            We do not use cookies for tracking purposes. The website may use local storage for functional purposes like theme preferences.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            7. Contact
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            For privacy-related questions, visit our website at{' '}
            <a href="https://www.novahamotechnologies.com/" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--color-primary)' }}>novahamotechnologies.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

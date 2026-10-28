import Breadcrumbs from '../components/Breadcrumbs';

export default function TermsPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Terms of Service' },
        ]} />

        <h1 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>Terms of Service</h1>

        <div style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            <strong style={{ color: 'var(--color-text)' }}>Last updated:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            1. Acceptance
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            By using NovaHamo Tools, you agree to these Terms of Service. NovaHamo Tools is operated by NovaHamo Technologies Pvt. Ltd.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            2. Services
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            NovaHamo Tools provides free online utilities including image processing, PDF manipulation, QR code generation,
            calculators, text tools, and more. These tools are provided "as is" without warranty of any kind.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            3. Usage
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            You may use our tools for personal and commercial purposes. You are responsible for the content you process.
            Do not use our tools for illegal activities or to process content you do not have the right to use.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            4. Accuracy
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            While we strive for accuracy, tools like calculators, converters, and estimators provide results based on
            standard formulas and may not account for all variables. Results should be verified for critical decisions.
            Generated certificates are not officially accredited. Resume checker scores are estimates.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            5. Limitation of Liability
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            NovaHamo Technologies Pvt. Ltd. is not liable for any damages arising from the use of these tools.
            Use them at your own discretion.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            6. Modifications
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            We reserve the right to modify, suspend, or discontinue any tool or service at any time.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
            7. Contact
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            For questions about these terms, visit{' '}
            <a href="https://www.novahamotechnologies.com/" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--color-primary)' }}>novahamotechnologies.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

import Logo from "../components/ui/Logo";

function About() {
  return (
    <div className="page">
      <div className="about-card">
        <Logo />

        <h1>PricePulse</h1>

        <p className="about-tagline">
          Compare Prices. Save More. Shop Smarter.
        </p>

        <div className="about-version">
          Version 1.0.0
        </div>

        <p className="about-description">
          PricePulse helps consumers compare product
          prices across multiple online stores and
          find the best deals.
        </p>

        <p className="made-in">
          Made with <span>♥</span> in Nigeria
        </p>
      </div>
    </div>
  );
}

export default About;
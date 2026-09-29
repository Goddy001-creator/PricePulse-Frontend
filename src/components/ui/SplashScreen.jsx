import Logo from "./Logo";

function SplashScreen() {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo">
          <Logo light />
        </div>

        <div className="splash-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p className="splash-tagline">
          Track smarter. Shop better.
        </p>
      </div>
    </div>
  );
}

export default SplashScreen;
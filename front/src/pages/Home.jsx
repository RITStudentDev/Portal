import ColorBends from "../assets/home_bg";
import "../styles/Home.css";

function Home() {
    return (
        <div className="home-page">
            <div className="background">
                <ColorBends
                    colors={["#282949", "#474781", "#3b3b69"]}
                    rotation={180}
                    speed={0.19}
                    scale={1}
                    frequency={1.9}
                    warpStrength={0.98}
                    mouseInfluence={0.55}
                    noise={0}
                    parallax={0.9}
                    iterations={1}
                    intensity={1.5}
                    bandWidth={4.5}
                    transparent
                    autoRotate={0}
                    color="#2b2b4d"
                />
            </div>
            <div id="nav-container">
                <nav className="headbar">
                    <h2>Portal</h2>
                    <a href="/login">Log In</a>
                </nav>
            </div>
                <div className="content">
                    <h1 id="title">PORTAL</h1>
                    <a href="/signup">Create Account</a>
                </div>
        </div>
    );
}

export default Home;
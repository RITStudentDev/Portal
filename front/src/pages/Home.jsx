import { Link } from "react-router-dom"
import '../styles/Home.css'

function Home () {

    return (
        <div className="home-page">
            <h1 id="title">Asynk Messenger</h1>
            <Link to={'/login'}>
                <h3>Login</h3>
            </Link>
            <Link to={'/signup'}>
                <h3>Create Account</h3>
            </Link>
        </div>
    )
}
export default Home;
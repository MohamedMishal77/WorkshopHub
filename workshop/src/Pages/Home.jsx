import Header from "../component/Header";
import Hero from "../component/Hero";
import About from "../component/About";  
import CTA from "../component/CTA";
import Footer from "../component/Footer";
import FeaturedEvents from "../component/FeaturedEvents";   

function Home() {
  return <div>
        <Header />
        <Hero />
        <About />
        <FeaturedEvents />  
        <CTA />
        <Footer />  
      </div>    }

export default Home;
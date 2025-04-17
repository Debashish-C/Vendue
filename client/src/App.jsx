
import Card from '../components/Card'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'


function App() {

  return (
    <>
      <header className='pb-30'>
        <nav>
          <Navbar />
        </nav>
      </header>
      <main className='flex justify-center items-center'> 
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-7xl'>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
         <Card/>
      </div>
      </main>
      <footer>
        <Footer/>
      </footer>
    </>
  )
}

export default App

import Hero from "../components/Hero";




const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Imagen de fondo con efecto hover */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-700 ease-in-out will-change-transform bg-cover"
  style={{ backgroundImage: 'url("/vista.png")', backgroundPosition: 'center 30%', backgroundSize: 'cover' }}
        tabIndex={-1}
      />
      {/* Capa para el contenido principal */}
  <section className="relative z-10 flex flex-col items-center justify-center flex-1 text-center px-6 min-h-screen">
        <Hero />
      </section>
      {/* Footer */}
      <footer className="relative z-10 w-full bg-gray-900 bg-opacity-80 text-white text-center py-3 text-sm">
        <div>Tel: (123) 456-7890 | Email: info@hotel.com | Dirección: Calle Ficticia 123</div>
      </footer>
      {/* Efecto hover para acercar la imagen */}
      <style>{`
        .relative:hover > .absolute {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
};

export default Home;

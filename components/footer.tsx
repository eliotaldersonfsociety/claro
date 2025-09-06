export function Footer() {
  return (
    <footer className="mt-12 text-center">
      {/* Iconos sociales */}
      <div className="flex justify-center space-x-6 mb-6">
        <a
          href="https://facebook.com/rifaloscuatrofantasticos"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/facebook.png"
            alt="Facebook"
            className="w-8 h-8 hover:scale-110 transition"
          />
        </a>
        <a
          href="https://instagram.com/rifaloscuatrofantasticos"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/instagram.png"
            alt="Instagram"
            className="w-8 h-8 hover:scale-110 transition"
          />
        </a>
        <a
          href="https://youtube.com/rifasloscuatrofantasticos"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/youtube.png"
            alt="YouTube"
            className="w-8 h-8 hover:scale-110 transition"
          />
        </a>
        <a
          href="https://www.tiktok.com/@rifaloscuatrofantasticos"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/tik-tok.png"
            alt="Tiktok"
            className="w-8 h-8 hover:scale-110 transition"
          />
        </a>
        <a
          href="https://wa.me/17863728246"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/whatsapp.png"
            alt="WhatsApp"
            className="w-8 h-8 hover:scale-110 transition"
          />
        </a>
        <a
          href="https://kick.com/rifaloscuatrofantasticos"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/k.png"
            alt="kick"
            className="w-8 h-8 hover:scale-110 transition"
          />
        </a>
      </div>

      {/* Derechos reservados */}
      <p className="text-gray-500 text-xs">
        © {new Date().getFullYear()} Rifas Los Cuatro Fantásticos. Todos los
        derechos reservados.
      </p>
    </footer>
  );
}

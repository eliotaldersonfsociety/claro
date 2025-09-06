import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RaffleInfo() {
  return (
    <div className="mb-8">
      {/* Título y descripción */}
      <div className="text-center mb-8">
        <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
          <div className="bg-stone-950 w-fit text-xs text-white py-3 px-6 rounded-full flex items-center space-x-2">
            <img
              src="/tiempo.png"
              alt="Reloj"
              className="w-6 h-6"
            />
            <span>
              Hora y Fecha al vender el <b>50%</b>
            </span>
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-white to-white mb-4 drop-shadow-lg">
          ¡El KLR-650 de tus sueños puede ser tuya!
        </h1>
        <p className="text-balance max-w-sm md:max-w-2xl mx-auto mb-0 text-center text-white">
          Compra 1 ticket por 2$ o compra la promoción 10 tickets por 15$ y participa por esta bella KLR-650.
        </p>
      </div>

      {/* Luces decorativas */}
      <section className="relative">
        <img
          src="/lighta.webp"
          alt="Un haz de luz en forma de curva"
          className="pointer-events-none absolute w-[390px] left-[-160px] h-auto object-contain top-0 md:h-screen md:w-auto md:-top-[110px] md:-left-[420px]"
        />
        <img
          src="/lighta.webp"
          alt="Un haz de luz en forma de curva"
          className="hidden md:block pointer-events-none absolute w-auto -right-[570px] z-10 aspect-[387/434]"
        />
      </section>

      {/* Botón de compra */}
      <div className="flex justify-center mb-4">
        <div className="relative p-[2px] rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(270deg,#ec4899,#facc15,#60a5fa,#22c55e,#ec4899)] bg-[length:200%_200%] animate-gradient rounded-xl"></div>
          <Button className="relative bg-yellow-400 text-black font-bold px-6 py-2 shadow-lg transform hover:scale-105 transition-all text-3xl rounded-xl">
            ¡Comprar boletos!
          </Button>
        </div>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Tarjeta 1: Imagen de la moto */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-white p-4 rounded-2xl shadow-2xl">
            <img
              src="/klr0.png"
              alt="KLR-650"
              className="w-full rounded-xl shadow-lg"
            />
            <div className="absolute top-6 left-6 bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span>¡ÚLTIMOS DÍAS!</span>
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Video de YouTube */}
        <div className="relative w-full aspect-[9/16] md:aspect-video">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg border-4 border-white"
            src="https://www.youtube.com/embed/GBQE3_G_LW4"
            title="Video promocional de la rifa"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>



        {/* Tarjeta 3: Detalles del premio */}
        <div className="p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
          <Card className="bg-card text-white p-6 shadow-xl rounded-xl border-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <h3 className="font-black text-2xl mb-3 flex items-center">
              <img
                src="/klr.jpg"
                alt="Carro en rifa"
                className="w-40 h-28 object-cover rounded-lg border-4 border-white shadow-lg transform rotate-3"
              />
              <span className="ml-4 text-light">
                ¡POR SOLO $2 USD PUEDE SER{" "}
                <b className="text-yellow-400 text-6xl">TUYO!</b>
              </span>
            </h3>
            <p className="text-lg">
              "Con tu boleto participas no solo por el premio 🎁, sino también
              en el reto de los 4 Fantásticos de la rifa: ¡Cuando lleguemos al 50% de los
              boletos vendidos, uno de nosotros tendrá que raparse totalmente
              el cabello! 💈✂️"
            </p>
            <p className="text-yellow-200 font-bold text-2xl mt-2">
              🎁 SI LLEVAS 10 BOLETOS = SOLO PAGAS $15 USD!
            </p>
          </Card>
        </div>

        {/* Tarjeta 4: Premios */}
        <div className="p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
          <Card className="bg-card text-white p-6 shadow-xl rounded-xl border-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="space-y-3 text-lg">
              <div className="text-center mb-8">
                <div className="p-[1px] rounded-full bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)] inline-block mb-4 shadow-lg">
                  <div className="bg-stone-950 w-fit text-sm text-white py-3 px-6 rounded-full flex items-center space-x-2">
                    <img
                      src="/sorpresas.png"
                      alt="Premios"
                      className="w-6 h-6"
                    />
                    <span>
                      <b>Premios</b>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src="/1.png"
                  alt="Primer premio"
                  className="w-8 h-8"
                />
                <span className="font-bold text-white">Moto KLR-650</span>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src="/2.png"
                  alt="Segundo premio"
                  className="w-8 h-8"
                />
                <span className="font-bold text-white">
                  $500 USD en efectivo.
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src="/3.png"
                  alt="Tercer premio"
                  className="w-8 h-8"
                />
                <span className="font-bold text-white">
                  $200 USD en efectivo.
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src="/sorpresa.png"
                  alt="Tercer premio"
                  className="w-8 h-8"
                />
                <span className="font-bold text-yellow-500">
                  $500 USD a la persona que compre mas Tikets, se entregara el ganador el dia de la rifa.
                </span>
              </div>
            </div>
            <div className="bg-[linear-gradient(270deg,#ec4899,#facc15,#60a5fa,#22c55e,#ec4899)] bg-[length:200%_200%] animate-gradient rounded-xl mt-4 p-3">
              <p className="text-stone-900 font-bold text-center">
                ¿No quieres la moto?
              </p>
              <p className="text-stone-900 font-light text-center">
                ¡Te entregamos <b className="font-bold text-white">3,000 USD</b> en efectivo! Recuerda si estás en Estados Unidos FLORiDA te la llevamos asta la puerta de tu casa si estás en otro estados te compramos tu boleto de avión para que vengas directamente por tu premio, Y si estás en cualquier otro lados como Colombia ecuador chile cualquier lugar del mundo 🌍 te hacemos llegar tu dinero 💴 con transferencia inmediata.
              </p>
            </div>
          </Card>
        </div>

        {/* Tarjeta 5: Promoción especial */}
        <div className="p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black p-6 shadow-xl border-0 rounded-xl">
            <div className="text-center">
              <p className="font-black text-xl mb-2 text-white">
                PROMOCIÓN ESPECIAL
              </p>
              <p className="font-light text-base mb-2 text-white">
                ¡Compra <b className="font-bold">10 tickets</b> por{" "}
                <b className="font-bold">15$</b> y participa por esta bella{" "}
                <b className="font-bold">KLR-650</b> y 2 premios más!
              </p>
            </div>
          </Card>
        </div>

        {/* Tarjeta 6: Reglas */}
        <div className="p-[1px] rounded-xl bg-[linear-gradient(to_right,_#ec4899,_#facc15,_#60a5fa,_#22c55e)]">
          <Card className="bg-card text-white p-6 shadow-xl rounded-xl border-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="space-y-3 text-xs">
              <p className="flex items-start space-x-2">
                <img
                  src="/uno.png"
                  alt="uno"
                  className="w-8 h-8"
                />
                <span>
                  Después de 24 horas recibirás tus boletos verificados,
                  siempre que la transferencia sea correcta.
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <img
                  src="/dos.png"
                  alt="dos"
                  className="w-8 h-8"
                />
                <span>
                  ¡Participa desde cualquier parte del mundo! Si resultas
                  ganador, recibirás tu premio en efectivo, estés donde estés.
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <img
                  src="/tres.png"
                  alt="tres"
                  className="w-8 h-8"
                />
                <span>
                  La fecha del sorteo se anunciará cuando se haya vendido el
                  50% de las boletas.
                </span>
              </p>
              <p className="flex items-start space-x-2">
                <img
                  src="/cuatro.png"
                  alt="cuatro"
                  className="w-8 h-8"
                />
                <span>
                  ¡Si llegamos al 100% de boletas vendidas antes de tiempo,
                  adelantamos la fecha del sorteo!.
                </span>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Mensaje final */}
      <div className="text-center font-black text-white text-4xl mt-8">
        ¡BUENA SUERTE!
      </div>
      <p className="text-yellow-400 text-center text-sm font-extralight mt-1">
        Recuerda que participar ya te acerca al premio.
      </p>
    </div>
  );
}
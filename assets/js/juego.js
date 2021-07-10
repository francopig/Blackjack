
const miModulo = (() => {
    'use strict';

    let deck = []; //inicializo el array
    const tipos      = ['C', 'D', 'H', 'S'], //Tipos de carta
          especiales = ['A','J', 'Q','K']; //Cartas con letras

    let puntosJugadores = [];

    //Referencias del html
    const btnPedir   = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo   = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small');

    //Esta función inicializa el juego   
    //El ultimo jugador es siempre la pc   
    const inicializarJuego = ( numJugadores = 2 ) => {
        deck = crearDeck();

        puntosJugadores = [];
        for ( let i = 0; i < numJugadores; i++){
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = '');

        //habilito los botones de nuevo
        btnPedir.disabled   = false;
        btnDetener.disabled = false;
    }

    //esta funcion crea una nueva baraja
    const crearDeck = () => {

        deck = [];
        for(let i = 2; i <= 10; i++){//2-10 cartas con numeros
            for ( let tipo of tipos ) {
              deck.push( i + tipo );
          }
          }
          for( let tipo of tipos){//para cartas especiales
            for ( let esp of especiales){
              deck.push( esp + tipo);
            }
          }

        return _.shuffle( deck );
    }
    
    //esta funcion me permite tomar una carta
    const pedirCarta = () =>{

        //si no hay cartas no puedo utilizar el deck.pop
        if( deck.length === 0){
          throw 'No hay cartas en el deck';
        }

        return deck.pop();//remueve y retornal el ult elemento
    }

    //para saber el valor de la cart que pedi
    const valorCarta = ( carta ) => {

        //Quiero cortar el tipo de carta (la letra)
        const valor = carta.substring(0, carta.length - 1);//-1 para obviar la ultima letra

        return  ( isNaN( valor )) ? 
                (valor === 'A') ? 11 : 10 //si es letra
                : valor * 1; //si es num
    }

    //turno: 0= player 1 | ultimo = pc
    const acumularPuntos = ( carta, turno ) => {

              //tengo que incrementar los puntos ahora
              puntosJugadores[turno] = puntosJugadores[turno] + valorCarta ( carta );
              puntosHTML[turno].innerText = puntosJugadores[turno];
              return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {

      const imgCarta = document.createElement('img');//creo una imagen
      //ahora tengo que colocarte el source y la clase
      imgCarta.src = `assets/cartas/${ carta }.png`;//source
      imgCarta.classList.add('carta');//clase
      divCartasJugadores[turno].append( imgCarta );

    }

    const determinarGanador = () => {

      const[ puntosMinimos, puntosComputadora ] = puntosJugadores;

      setTimeout(() => {
          if(puntosComputadora === puntosMinimos){
            alert('Empate');
          }else if( puntosMinimos > 21) {
              alert('Computadora gana');
          }else if (puntosComputadora > 21) {
            alert('Ganaste! :)')
          }else {
            alert('Computadora Gana');
          }
      }, 100);    
    }

    //turno de la computadora
    const turnoComputadora = ( puntosMinimos ) => {
        let puntosComputadora = 0;

        do {
              const carta = pedirCarta();
              puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1 );
              //Le paso la ultima posicion xq corresponde a la pc

              crearCarta(carta, puntosJugadores.length - 1);

        }while( (puntosComputadora < puntosMinimos) && (puntosMinimos <= 21)  );
        determinarGanador();                              
    }


    // Eventos
    btnPedir.addEventListener('click', ()=> {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos( carta, 0 );

        crearCarta( carta, 0);

        //Controlar los puntos
        if ( puntosJugador > 21 ){
            console.warn('Lo siento mucho, perdiste');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );

        }else if ( puntosJugador === 21 ){
            console.warn('21, genial!');
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora( puntosJugador );
        }
    });

    //boton detener
    btnDetener.addEventListener('click', () => {

        btnPedir.disabled   = true;
        btnDetener.disabled = true;

        turnoComputadora( puntosJugadores[0] );
    });

    return {
        nuevoJuego: inicializarJuego
    };
})();



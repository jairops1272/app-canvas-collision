// Obtenemos el elemento del canvas con id "canvas2" y su contexto de dibujo 2D
const canvas = document.getElementById("canvas2");
let ctx = canvas.getContext("2d");

// Definimos las dimensiones del canvas
const window_height = 500;
const window_width = 500;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "rgb(0, 0, 0)"; // Establecemos el fondo del canvas a negro
document.body.style.backgroundColor = "rgb(27, 94, 162)"; //Establecemos el fondo del documento en Azul Océano
// Creamos un objeto de audio para el sonido de colisión
const collisionSound = new Audio("./zzz.mp3");
collisionSound.preload = 'auto'; // Pre-cargamos el sonido para que esté listo para reproducirse

// Función que asegura la reproducción del sonido cuando el usuario hace clic en la página
function playSound() {
    collisionSound.play().catch(error => {
        console.log("Error al intentar reproducir el sonido automáticamente:", error);
    });
}

// Añadimos un evento que reproduce el sonido cuando el usuario hace clic en la página
document.addEventListener('click', playSound);

// Clase que representa a un círculo con propiedades de posición, velocidad, color y texto
class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;          // Posición horizontal del círculo
        this.posY = y;          // Posición vertical del círculo
        this.radius = radius;   // Radio del círculo
        this.originalColor = color;  // Color original del círculo
        this.color = color;     // Color actual del círculo
        this.text = parseInt(text); // Texto que muestra dentro del círculo
        this.speed = speed;     // Velocidad de movimiento del círculo
        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed; // Velocidad horizontal
        this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed; // Velocidad vertical
    }

    // Método para dibujar el círculo en el contexto
    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;  // Establecemos el color del borde
        context.fillStyle = this.color;    // Establecemos el color de relleno
        context.textAlign = "center";      // Alineamos el texto al centro
        context.textBaseline = "middle";   // Alineamos el texto verticalmente al medio
        context.font = "20px Arial";       // Definimos la fuente del texto
        context.fillText(this.text, this.posX, this.posY); // Dibujamos el texto dentro del círculo
        context.lineWidth = 2;             // Establecemos el grosor del borde
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false); // Dibujamos el círculo
        context.stroke();                  // Dibuja el contorno del círculo
        context.closePath();               // Cerramos el camino del dibujo
    }

    // Método para actualizar la posición del círculo y moverlo
    update(context) {
        this.draw(context);  // Dibuja el círculo actualizado

        // Rebotar el círculo en los bordes del canvas si toca los límites
        if ((this.posX + this.radius) > window_width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx; // Cambia la dirección horizontal
        }
        if ((this.posY + this.radius) > window_height || (this.posY - this.radius) < 0) {
            this.dy = -this.dy; // Cambia la dirección vertical
        }

        this.posX += this.dx;  // Actualiza la posición horizontal
        this.posY += this.dy;  // Actualiza la posición vertical
    }
}

// Función que genera un color aleatorio en formato rgb
function getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
}

// Función que genera una posición aleatoria dentro de los límites del canvas para el círculo
function getRandomPosition(radius, circles) {
    let pos;
    let overlap; // Variable para verificar si hay solapamiento
    
    do {
        // Generamos una posición aleatoria dentro del canvas
        pos = {
            x: Math.random() * (window_width - 2 * radius) + radius, // Genera una posición x dentro del canvas
            y: Math.random() * (window_height - 2 * radius) + radius // Genera una posición y dentro del canvas
        };

        // Comprobamos si la nueva posición se solapa con algún círculo existente
        overlap = false;
        for (let i = 0; i < circles.length; i++) {
            let dx = pos.x - circles[i].posX;
            let dy = pos.y - circles[i].posY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Si la distancia entre los círculos es menor que la suma de sus radios, están solapados
            if (distance < circles[i].radius + radius) {
                overlap = true; // Marcamos que hay solapamiento
                break; // Salimos del bucle
            }
        }
    } while (overlap); // Si hay solapamiento, generamos una nueva posición

    return pos; // Devolvemos la nueva posición aleatoria
}

// Función para verificar si dos círculos están colisionando
function checkCollision(circle1, circle2) {
    let dx = circle1.posX - circle2.posX;  // Distancia horizontal entre los círculos
    let dy = circle1.posY - circle2.posY;  // Distancia vertical entre los círculos
    let distance = Math.sqrt(dx * dx + dy * dy); // Distancia total entre los círculos

    // Si la distancia es menor que la suma de los radios, hay una colisión
    if (distance < circle1.radius + circle2.radius) {
        // Invertimos las velocidades de ambos círculos para simular rebote
        circle1.dx = -circle1.dx;
        circle1.dy = -circle1.dy;
        circle2.dx = -circle2.dx;
        circle2.dy = -circle2.dy;

        // Aumentamos el texto de ambos círculos como resultado de la colisión
        circle1.text++;
        circle2.text++;

        // Cambiamos el color de ambos círculos
        circle1.color = getRandomColor();
        circle2.color = getRandomColor();

        // Reproducimos el sonido de colisión
        collisionSound.play();
    }
}

// Función que reinicia las posiciones, colores y texto de los círculos
function resetCircles() {
    circles = []; // Limpiamos el array de círculos

    // Generamos los círculos con posiciones y radios aleatorios, asegurando que no se solapen
    for (let i = 0; i < numCircles; i++) {
        let radius = Math.floor(Math.random() * 30) + 20; // Generamos un radio aleatorio entre 20 y 50
        let pos = getRandomPosition(radius, circles);  // Obtenemos una posición aleatoria sin solapamiento
        circles.push(new Circle(pos.x, pos.y, radius, "blue", (i + 1).toString(), 3)); // Creamos un círculo y lo agregamos al array
    }
}

// Definimos el número de círculos a generar
const numCircles = 6;
let circles = []; // Array que almacenará los círculos

// Inicializamos los círculos cuando la página se carga
resetCircles();

// Función que actualiza los círculos y maneja la animación
function updateCircles() {
    requestAnimationFrame(updateCircles); // Llama a esta función continuamente para animar
    ctx.clearRect(0, 0, window_width, window_height); // Limpiamos el canvas en cada frame

    // Actualizamos todos los círculos
    for (let i = 0; i < circles.length; i++) {
        circles[i].update(ctx);
    }

    // Verificamos las colisiones entre todos los círculos
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            checkCollision(circles[i], circles[j]);
        }
    }
}

// Llamamos a la función de actualización para iniciar la animación
updateCircles();

// Este evento se asegura de que cuando la página se recargue o se reinicie, los círculos se reinicien con nuevas posiciones y colisiones.
window.addEventListener("beforeunload", resetCircles);

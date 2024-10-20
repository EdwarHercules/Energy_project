import React, { useEffect, useRef } from 'react';
import '../Styles/Home.css';

// Importar imágenes
import imagen1 from '../Images/Home/estructuras.png';
import imagen2 from '../Images/Home/Interaccion.png';
import imagen3 from '../Images/Home/Puntos en mapa.png';
import imagen4 from '../Images/Home/excel.png';

const Home = () => {
    const carouselRef = useRef(null);
    const intervalId = useRef(null);

    const sections = [
        {
            title: "Gestión de Proyectos Eléctricos",
            image: imagen1,
            text: "Nuestra aplicación está diseñada para profesionales que trabajan en el sector de construcciones eléctricas. Permite llevar un registro detallado de todos tus proyectos, facilitando el control y la organización de cada uno de ellos. Puedes agregar proyectos de forma manual o automática, asegurando que cada detalle esté siempre disponible."
        },
        {
            title: "Puntos Geográficos y Estructuras Eléctricas",
            image: imagen2,
            text: "Podrás añadir puntos geográficos en los proyectos para marcar ubicaciones importantes. Además, puedes colocar estructuras eléctricas en estos puntos. La visualización de estas estructuras te permite tener un control total sobre tus proyectos, asegurando que nada se pase por alto."
        },
        {
            title: "Visualización en Mapa",
            image: imagen3,
            text: "Dependiendo del plan que hayas escogido, tendrás acceso a un mapa interactivo donde podrás ver tus puntos geográficos y estructuras. Esto facilita la navegación y la comprensión de la disposición de tus proyectos en el terreno."
        },
        {
            title: "Listados y Descargas",
            image: imagen4,
            text: "Además, puedes ver un listado de las estructuras y materiales que estás utilizando, con una tabla que muestra toda la información relevante. La aplicación también te permite descargar archivos en formato KMZ para abrir en Google Earth y en Excel, que contiene toda la información de tus proyectos."
        }
    ];

    const scrollCarousel = (direction) => {
        const carousel = carouselRef.current;
        if (carousel) {
            const scrollAmount = direction === 'left' ? -carousel.clientWidth : carousel.clientWidth;
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });

            // Ciclo de carrusel
            if (direction === 'right') {
                if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
                    carousel.scrollTo({ left: 0, behavior: 'smooth' });
                }
            } else if (direction === 'left') {
                if (carousel.scrollLeft === 0) {
                    carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
                }
            }
        }
    };

    useEffect(() => {
        const startAutoScroll = () => {
            intervalId.current = setInterval(() => {
                scrollCarousel('right');
            }, 5000);
        };

        const stopAutoScroll = () => {
            clearInterval(intervalId.current);
        };

        startAutoScroll();

        return () => {
            stopAutoScroll();
        };
    }, []);

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Bienvenido a tu Project Manager</h1>
                <p>Esta plataforma está diseñada para facilitar la gestión de proyectos eléctricos, ayudándote a administrar tus proyectos, ubicaciones geográficas, estructuras eléctricas y más, todo en un solo lugar.</p>
            </header>

            <div className="carousel" ref={carouselRef}>
                {sections.map((section, index) => (
                    <div className="carousel-item" key={index}>
                        <div>
                            <h2>{section.title}</h2>
                            <p>{section.text}</p>
                        </div>
                        <img src={section.image} alt={section.title} className="home-image" />
                    </div>
                ))}
            </div>

            <div className="carousel-controls">
                <button onClick={() => { scrollCarousel('left'); }}>◀</button>
                <button onClick={() => { scrollCarousel('right'); }}>▶</button>
            </div>
        </div>
    );
};

export default Home;

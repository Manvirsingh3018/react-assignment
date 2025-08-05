import React, { useEffect, useRef, useState } from "react";
import { Box, CardMedia, Grid, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Image1 from "../assets/image1.png";
import Image2 from "../assets/image2.png";
import Image3 from "../assets/image3.jpg";

const images = [
  { url: Image1, alt: "Slide 1" },
  { url: Image2, alt: "Slide 2" },
  { url: Image3, alt: "Slide 3" },
];

const Carousel = () => {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const intervalRef = useRef(null);

  const changeIndex = (newIndex) => {
    setIsFading(true);
    setTimeout(() => {
      setIndex(newIndex);
      setIsFading(false);
    }, 300);
  };

  const nextImage = () => {
    changeIndex((index + 1) % images.length);
    resetInterval();
  };

  const prevImage = () => {
    changeIndex((index - 1 + images.length) % images.length);
    resetInterval();
  };

  const goToImage = (i) => {
    changeIndex(i);
    resetInterval();
  };

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setIsFading(false);
      }, 300);
    }, 3000);
  };

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    startAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <Box>
      <h2>Carousel</h2>
      <Box position="relative" width="100%" textAlign="center">
        <CardMedia
          component="img"
          image={images[index].url}
          alt={images[index].alt}
          sx={{
            height: "70vh",
            objectFit: "contain",
            width: "100%",
            transition: "opacity 0.5s ease-in-out",
            opacity: isFading ? 0 : 1,
          }}
        />

        <IconButton
          onClick={prevImage}
          sx={{
            position: "absolute",
            top: "50%",
            left: 20,
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>

        <IconButton
          onClick={nextImage}
          sx={{
            position: "absolute",
            top: "50%",
            right: 20,
            transform: "translateY(-50%)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>

        <Grid container spacing={2} justifyContent="center" mt={2}>
          {images.map((img, i) => (
            <Grid item key={i}>
              <CardMedia
                component="img"
                image={img.url}
                alt={img.alt}
                sx={{
                  width: 100,
                  height: 60,
                  cursor: "pointer",
                  objectFit: "contain",
                  border: index === i ? "2px solid blue" : "none",
                }}
                onClick={() => goToImage(i)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Carousel;

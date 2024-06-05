import React from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles';
import Image from 'next/image'

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  display: 'block',
  width: '100%',
  '&:hover': {
    opacity: 0.8,
  },
}));

const ClickableImage = ({ onClick, src, alt, width, height } : {
    onClick: () => void;
    src: string;
    alt: string;
    width: number;
    height: number;
}) => {
  return (
    <ImageButton onClick={onClick}>
       <Image src={src} alt={alt} width={width} height={height} />
    </ImageButton>
  );
};

export default ClickableImage;
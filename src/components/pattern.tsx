"use client";

import React from "react";
import styled from "styled-components";

const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="sandpaper-pattern">
        <svg className="sandpaper-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="sandTexture">
              <feTurbulence
                result="sand"
                seed={20}
                numOctaves={4}
                baseFrequency="0.6"
                type="fractalNoise"
              />
              <feColorMatrix
                values="0.8 0 0 0 0.1  0 0.7 0 0 0.05  0 0 0.6 0 0.02  0 0 0 1 0"
                type="matrix"
              />
            </filter>
          </defs>
          <rect filter="url(#sandTexture)" height="100%" width="100%" />
        </svg>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  .sandpaper-pattern {
    width: 100%;
    height: 100%;
    background: #edf5ef;
    overflow: hidden;
  }
  .sandpaper-svg {
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.85;
  }
`;

export default Pattern;

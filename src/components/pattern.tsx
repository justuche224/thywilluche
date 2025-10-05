"use client";

import { usePathname } from "next/navigation";
import React from "react";
import styled from "styled-components";

const Pattern = () => {

  const pathname = usePathname();
  const isAdminBlog = pathname.includes("/admin/blog");

  if (isAdminBlog) return null;

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
        <div className="geometric-overlay" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: -10;
  pointer-events: none;
  .sandpaper-pattern {
    width: 100%;
    height: 100%;
    background: #edf5ef;
    overflow: hidden;
    position: relative;
  }
  .sandpaper-svg {
    width: 100%;
    height: 100%;
    display: block;
    opacity: 0.85;
  }
  .geometric-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(72, 187, 120, 0.08) 0%,
      transparent 25%,
      transparent 75%,
      rgba(72, 187, 120, 0.06) 100%
    );
    z-index: 1;
  }
  .geometric-overlay::before {
    content: "";
    position: absolute;
    top: 20%;
    right: -10%;
    width: 40%;
    height: 60%;
    background: radial-gradient(
      ellipse at center,
      rgba(72, 187, 120, 0.12) 0%,
      transparent 70%
    );
    border-radius: 50%;
    transform: rotate(-15deg);
  }
  .geometric-overlay::after {
    content: "";
    position: absolute;
    bottom: 15%;
    left: -5%;
    width: 30%;
    height: 40%;
    background: linear-gradient(
      45deg,
      rgba(72, 187, 120, 0.1) 0%,
      transparent 60%
    );
    border-radius: 20px;
    transform: rotate(25deg);
  }
`;

export default Pattern;

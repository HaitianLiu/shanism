import React, { useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import styles from './index.module.css';
import { Link } from 'react-router-dom';

function Home() {
  useEffect(() => {
    const staggerVisualizerEl = document.querySelector(`.${styles.stagger_visualizer}`);
    const fragment = document.createDocumentFragment();
    const grid = [11, 11];
    const col = grid[0];
    const row = grid[1];
    const numberOfElements = col * row;

    for (let i = 0; i < numberOfElements; i++) {
      fragment.appendChild(document.createElement('div'));
    }

    staggerVisualizerEl.appendChild(fragment);

    const staggersAnimation = anime
      .timeline({
        targets: `.${styles.stagger_visualizer} div`,
        easing: 'easeInOutSine',
        delay: anime.stagger(50),
        loop: true,
        autoplay: false,
      })
      .add({
        translateX: [
          {
            value: anime.stagger('-.1rem', {
              grid: grid,
              from: 'center',
              axis: 'x',
            }),
          },
          {
            value: anime.stagger('.1rem', {
              grid: grid,
              from: 'center',
              axis: 'x',
            }),
          },
        ],
        translateY: [
          {
            value: anime.stagger('-.1rem', {
              grid: grid,
              from: 'center',
              axis: 'y',
            }),
          },
          {
            value: anime.stagger('.1rem', {
              grid: grid,
              from: 'center',
              axis: 'y',
            }),
          },
        ],
        duration: 1000,
        scale: 0.5,
        delay: anime.stagger(100, { grid: grid, from: 'center' }),
      })
      .add({
        translateX: () => anime.random(-10, 10),
        translateY: () => anime.random(-10, 10),
        delay: anime.stagger(8, { from: 'last' }),
      })
      .add({
        translateX: anime.stagger('.25rem', {
          grid: grid,
          from: 'center',
          axis: 'x',
        }),
        translateY: anime.stagger('.25rem', {
          grid: grid,
          from: 'center',
          axis: 'y',
        }),
        rotate: 0,
        scaleX: 2.5,
        scaleY: 0.25,
        delay: anime.stagger(4, { from: 'center' }),
      })
      .add({
        rotate: anime.stagger([90, 0], { grid: grid, from: 'center' }),
        delay: anime.stagger(50, { grid: grid, from: 'center' }),
      })
      .add({
        translateX: 0,
        translateY: 0,
        scale: 0.5,
        scaleX: 1,
        rotate: 180,
        duration: 1000,
        delay: anime.stagger(100, { grid: grid, from: 'center' }),
      })
      .add({
        scaleY: 1,
        scale: 1,
        delay: anime.stagger(20, { grid: grid, from: 'center' }),
      });

    staggersAnimation.play();
  });

  return (
    <div className={styles.container}>
      <Link to="/salary">
        <h1 className={styles.title}>SHANISM</h1>
      </Link>
      <div className={styles.stagger_visualizer} />
    </div>
  );
}
export default Home;

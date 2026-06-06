/* js/video.js — swaps the hero <img> for a looping muted <video> when
   the .hero element carries a data-hero-video URL. Falls back silently
   to the still image otherwise. */
(function () {
  'use strict';
  const hero = document.querySelector('.hero[data-hero-video]');
  if (!hero) return;
  const src = hero.dataset.heroVideo;
  if (!src) return;
  const media = hero.querySelector('.hero-media');
  if (!media) return;
  const img = media.querySelector('.hero-image');
  const poster = img ? (img.currentSrc || img.src || '') : '';
  const video = document.createElement('video');
  video.className = 'hero-video';
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  if (poster) video.poster = poster;
  const source = document.createElement('source');
  source.src = src;
  source.type = src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
  video.appendChild(source);
  if (img) img.replaceWith(video);
  else media.appendChild(video);
})();

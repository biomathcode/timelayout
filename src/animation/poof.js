async function poof(el) {
  // Get position of center of element on the screen
  const rect = el.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Create a div to hold the poof
  const poof = document.createElement("poof");
  poof.style.position = "fixed";
  poof.style.left = centerX + "px";
  poof.style.top = centerY + "px";
  poof.style.pointerEvents = "none";

  document.body.appendChild(poof);

  const animations = [];
  // Create 10 particles
  for (let i = 0; i < 4; i++) {
    const particle = document.createElement("poof-particle");
    particle.classList.add("particle");
    poof.appendChild(particle);
    particle.style.position = "absolute";
    particle.style.opacity = "0";

    particle.style.width = "50px";
    particle.style.height = "50px";
    // particle.style.backgroundColor = 'red';
    particle.style.background =
      "url(https://static.vecteezy.com/system/resources/thumbnails/013/994/726/small/white-3d-cloud-png.png)";
    particle.style.backgroundSize = "contain";
    particle.style.backgroundRepeat = "no-repeat";
    particle.style.backgroundPosition = "center";
    // particle.style.mixBlendMode = 'plus-lighter';

    // Animate particle from center in random direction using WAAPI
    const animation = particle.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(1)",
          opacity: 1,
        },
        {
          transform: `translate(-50%, -50%) translate(${getRandomInt(
            -100,
            100
          )}px, ${getRandomInt(-100, 100)}px) scale(0.001)`,
          opacity: 0.7,
        },
      ],
      {
        duration: 400,
        easing: "ease-out",
        delay: getRandomInt(0, 100),
      }
    );

    animations.push(animation);
  }
  animations.push(
    el.animate(
      [
        { transform: "scale(1)" },
        {
          opacity: 0,
          transform: "scale(0.3)",
        },
      ],
      {
        duration: 180,
        easing: "ease-out",
        delay: 0,
        fill: "forwards",
      }
    )
  );

  // Return a Promise that awaits all animations to finish, then removes the poof
  return Promise.all(animations.map((animation) => animation.finished)).then(
    () => {
      poof.remove();
    }
  );
}

// getRandomInt returns a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export { poof };

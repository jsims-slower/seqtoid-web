import React from "react";
import cs from "./ImpactHero.scss";

const ImpactHero = () => {
  return (
    <div className={cs.hero}>
      <h1>Explore SeqToID&apos;s Impact</h1>
      <p>
        Chan Zuckerberg ID (SeqToID): The free, cloud-based metagenomics
        platform for researchers
      </p>
      <a className={cs.heroButtonLink} href="#videoSection">
        Take the video tour
      </a>
    </div>
  );
};

export default ImpactHero;

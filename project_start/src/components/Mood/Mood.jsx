import NeutralGreen from "./neutral-green.png";
import Neutral from "./neutral.png";
import SadGreen from "./sad-green.png";
import Sad from "./sad.png";
import SmileGreen from "./smile-green.png";
import Smile from "./smile.png";
import "./Mood.css";

export default function Mood({ mood }) {
  if (mood === 1) {
    return (
      <div className="mood-grid">
        <img src={Sad} className="face" />
        <img src={Neutral} className="face" />
        <img src={SmileGreen} className="face" />
      </div>
    );
  } else if (mood == -1) {
    return (
      <div className="mood-grid">
        <img src={SadGreen} className="face" />
        <img src={Neutral} className="face" />
        <img src={Smile} className="face" />
      </div>
    );
  } else {
    return (
      <div className="mood-grid">
        <img src={Sad} className="face" />
        <img src={NeutralGreen} className="face" />
        <img src={Smile} className="face" />
      </div>
    );
  }
}

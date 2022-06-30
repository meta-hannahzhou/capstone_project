import "./SearchGrid.css";

export default function SearchGrid({ displayArtists, artists }) {
  return artists ? <div className="grid">{displayArtists()}</div> : null;
}

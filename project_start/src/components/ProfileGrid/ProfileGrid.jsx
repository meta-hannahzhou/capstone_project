export default function SearchProfile({ displayProfile, userInfo }) {
  return artists ? <div className="grid">{displayArtists()}</div> : null;
}

import "./SearchSong.css";

export default function SearchSong({
  track,
  isActive = false,
  onClick = () => {},
}) {
  let songClassName = isActive ? "song active" : "song";
  return (
    <div className={songClassName} key={track.id} onClick={onClick}>
      <img width={"5%"} src={track.album.images[0].url} alt="track image" />
      <div className="description">
        <div>{track.name}</div>
        <div>{track.artists[0].name}</div>
      </div>
    </div>
  );
}

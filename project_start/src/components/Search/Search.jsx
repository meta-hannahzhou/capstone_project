import "./Search.css";

export default function Search({ searchArtists, setSearch }) {
  return (
    <div className="search">
      <form onSubmit={searchArtists}>
        <input type="text" onChange={(e) => setSearch(e.target.value)} />
        <button type={"submit"}>Search</button>
      </form>
    </div>
  );
}

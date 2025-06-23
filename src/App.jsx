import { useState, useEffect } from "react";

export default function AwesomeList() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTB9a6UtJtvvOzJdKK4dozXmyP9J1ofMn4FFjB6VNfxJ72rgFp4JlNUMhSp0jJJCk5JPYGgWklX5PuR/pub?output=csv"
	)
      .then((res) => res.text())
      .then((csvText) => {
        const rows = csvText.split("\n").slice(1); // skip header
        const data = rows.map((row, index) => {
          const [title, image, studentNames, linkedins, portfolios] = row.split(",");
          const names = studentNames?.split("|") || [];
          const links = linkedins?.split("|") || [];
          const ports = portfolios?.split("|") || [];
          const students = names.map((name, i) => ({
            name: name.trim(),
            linkedin: links[i]?.trim() || "",
            portfolio: ports[i]?.trim() || ""
          }));
          return { id: index, title, image, students };
        });
        setItems(data);
      });
  }, []);

  return (
    <div className="bg-[#F8F8F8] min-h-screen p-8 font-sans">
      <header className="text-center mb-10">
  import staffsLogo from './assets/UofS_Master_Logo_RGB_Reverse.png';

<img src={staffsLogo} alt="Staffs Logo" />
        <h1 className="text-4xl font-bold text-[#C8102E]">The List of Awesome</h1>
        <h2 className="text-lg text-gray-700 mt-2">Game Credit list of Staffordshire Alumni</h2>
      </header>

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer border hover:border-[#C8102E] transition"
            onClick={() => setSelected(item)}
          >
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-t-xl" />
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-lg shadow-lg relative">
            <h3 className="text-xl font-bold text-[#C8102E] mb-4">{selected.title}</h3>
            {selected.students.map((s, i) => (
              <div key={i} className="mb-3">
                <p className="text-gray-700">{s.name}</p>
                {s.linkedin && (
                  <a href={s.linkedin} className="text-sm text-[#C8102E] block" target="_blank" rel="noreferrer">LinkedIn</a>
                )}
                {s.portfolio && (
                  <a href={s.portfolio} className="text-sm text-[#C8102E] block" target="_blank" rel="noreferrer">Portfolio</a>
                )}
              </div>
            ))}
            <button onClick={() => setSelected(null)} className="mt-4 bg-[#C8102E] text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

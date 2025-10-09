export default function ServiceCard({ image, title, description, reverse }) {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        reverse ? "md:flex-row-reverse" : ""
      } mb-16 items-center`}
    >
      <img
        src={image}
        alt={title}
        className="w-full md:w-1/2 rounded-2xl shadow-lg object-cover"
      />
      <div className="md:w-1/2 md:px-10 mt-6 md:mt-0">
        <h2 className="text-3xl font-semibold mb-4 text-white-400">{title}</h2>
        <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

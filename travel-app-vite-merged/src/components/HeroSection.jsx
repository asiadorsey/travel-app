export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-green-500 to-rose-500 text-white py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-4">
          Discover Tales Beyond Travel
        </h1>
        <p className="text-xl mb-8">
          Uncover hidden gems, create unique itineraries, and share your adventures.
        </p>
        <div className="space-x-4">
          <button className="bg-white text-green-600 px-6 py-3 rounded-full">
            Curated Destinations
          </button>
          <button className="bg-white text-green-600 px-6 py-3 rounded-full">
            Global Experiences
          </button>
          <button className="bg-white text-green-600 px-6 py-3 rounded-full">
            Unique Stories
          </button>
        </div>
      </div>
    </section>
  );
}

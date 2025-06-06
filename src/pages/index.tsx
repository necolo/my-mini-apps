import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const apps = [
  {
    title: "Anime Mate",
    description: "Effortless Access to Bulk Animation Data",
    link: "/animate",
    gradient: "from-violet-400 via-purple-500 to-indigo-600"
  },
  {
    title: "Spring Collection",
    description: "Fresh, vibrant styles perfect for the new season ahead",
    link: "",
    gradient: "from-emerald-400 via-teal-500 to-cyan-600"
  },
  {
    title: "Luxury Accessories",
    description: "Premium accessories to elevate your style and complete any look",
    link: "",
    gradient: "from-amber-400 via-orange-500 to-red-500"
  },
  {
    title: "Designer Collaborations",
    description: "Exclusive partnerships with world-renowned fashion designers",
    link: "",
    gradient: "from-cyan-400 via-blue-500 to-purple-600"
  },
  {
    title: "Sustainable Fashion",
    description: "Eco-conscious designs that don't compromise on style or quality",
    link: "",
    gradient: "from-lime-400 via-green-500 to-emerald-600"
  },
  {
    title: "Limited Edition",
    description: "Rare, exclusive pieces available for a limited time only",
    link: "",
    gradient: "from-pink-400 via-rose-500 to-red-500"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Hero Section - Made Much Smaller */}
      <div className="relative overflow-hidden bg-gradient-to-r from-black via-slate-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in">
              Necolo's
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}Mini Apps
              </span>
            </h1>
            {/* <p className="text-lg sm:text-xl text-gray-300 mb-6 max-w-2xl mx-auto animate-fade-in">
              Discover our latest collections and immerse yourself in the world of haute couture
            </p> */}
            <div className="w-120 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mx-auto animate-scale-in shadow-lg shadow-cyan-400/50"></div>
          </div>
        </div>
      </div>

      {/* Fashion Categories Grid - More Space */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.filter(app => app.link).map((app, index) => (
            <Link
              key={index}
              href={app.link}
              className="group block transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
            >
              <Card className="h-full py-0 overflow-hidden border border-gray-800 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-900/90 backdrop-blur-sm relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-300`}></div>
                <div className={`h-1 bg-gradient-to-r ${app.gradient} shadow-lg`}></div>
                <CardHeader className="relative">
                  <CardTitle className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                    {app.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 relative">
                  <CardDescription className="text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                    {app.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

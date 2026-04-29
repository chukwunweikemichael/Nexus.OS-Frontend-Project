import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-muted-foreground mb-6">Page not found</p>
      <Link to="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition">
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFound;

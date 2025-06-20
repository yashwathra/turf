'use client';

export default function Footer() {
  return (
    <footer className="bg-red-600 text-white py-10 mt-20 rounded-t-3xl">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        {/* GAMES */}
        <div>
          <h3 className="font-bold text-lg mb-4">GAMES</h3>
          <ul className="space-y-1">
            <li>Cricket</li>
            <li>Football</li>
            <li>Badminton</li>
            <li>Snooker</li>
          </ul>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="font-bold text-lg mb-4">SERVICES</h3>
          <ul className="space-y-1">
            <li>Software</li>
            <li>Website</li>
            <li>Other Services</li>
          </ul>
        </div>

        {/* PRIVACY POLICY */}
        <div>
          <h3 className="font-bold text-lg mb-4">PRIVACY POLICY</h3>
          <ul className="space-y-1">
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-bold text-lg mb-4">CONTACT US</h3>
          <ul className="space-y-1">
            <li>example@gmail.com</li>
            <li>+91 09876 54321</li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-10 text-xs text-white/80">
        &copy; {new Date().getFullYear()} Play Sports. All rights reserved.
      </div>
    </footer>
  );
}

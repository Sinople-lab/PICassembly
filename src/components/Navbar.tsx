// Martin Carballo november 03 / 2024
import { Cpu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            <span className="font-semibold text-lg">PIC Assembly by Martin Carballo</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://ww1.microchip.com/downloads/en/devicedoc/33023a.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-600"
            >
              PIC16F877 Datasheet
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Hero: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleClick = () => {
    if (session) {
      router.push("/create-invoice");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-18">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0B1A33] leading-tight">
              Create Professional Invoices
            </h1>

            <p className="text-sm md:text-base text-[#4A5568]">
              Create, save, and manage invoices effortlessly. Our user-friendly platform makes billing effortless and 
              allows you to send invoices to your clients wherever you are.
            </p>

            <ul className="space-y-2 text-[#4A5568] text-base">
              <li className="flex items-center gap-2">
                <span className="text-accent">✔</span>Create detailed invoices easily.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✔</span>Save invoices securely online.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent">✔</span>Download or email invoices as PDFs.
              </li>
            </ul>

            <div>
              <button
              onClick={handleClick}
                className="inline-block bg-accent text-white text-base font-semibold px-6 py-3 rounded-lg shadow hover:bg-secondary-accent hover:scale-105 transition-all duration-200 hover:cursor-pointer"
              >
                Get Started for Free
              </button>
            </div>
          </div>

          {/* <!-- RIGHT ILLUSTRATION --> */}
          <div className="flex justify-center">
            <Image
              src="/hero.webp"
              alt="Invoice Mockup Illustration"
              className="w-full max-w-sm drop-shadow-xl"
              height={300}
              width={300}
              fetchPriority="high"
              priority={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

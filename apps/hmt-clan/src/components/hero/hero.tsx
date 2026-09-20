import MinecraftBadge from "@/components/minecraft/minecraft-badge";
import MinecraftButton from "@/components/minecraft/minecraft-button";

type Particle = {
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  color: string;
};

const PARTICLES: Particle[] = [
  {
    left: "8%",
    top: "22%",
    size: 5,
    delay: "0s",
    duration: "7s",
    color: "#79c44a",
  },
  {
    left: "16%",
    top: "58%",
    size: 4,
    delay: "1.4s",
    duration: "8s",
    color: "#2ee06b",
  },
  {
    left: "26%",
    top: "32%",
    size: 6,
    delay: "0.6s",
    duration: "9s",
    color: "#dbcf9f",
  },
  {
    left: "34%",
    top: "70%",
    size: 4,
    delay: "2.2s",
    duration: "7s",
    color: "#91948a",
  },
  {
    left: "43%",
    top: "18%",
    size: 5,
    delay: "3s",
    duration: "10s",
    color: "#2ee06b",
  },
  {
    left: "52%",
    top: "63%",
    size: 6,
    delay: "0.9s",
    duration: "8s",
    color: "#79c44a",
  },
  {
    left: "61%",
    top: "28%",
    size: 4,
    delay: "1.8s",
    duration: "7s",
    color: "#dbcf9f",
  },
  {
    left: "69%",
    top: "52%",
    size: 5,
    delay: "0.3s",
    duration: "9s",
    color: "#2ee06b",
  },
  {
    left: "78%",
    top: "38%",
    size: 4,
    delay: "2.6s",
    duration: "8s",
    color: "#91948a",
  },
  {
    left: "86%",
    top: "66%",
    size: 6,
    delay: "1.1s",
    duration: "10s",
    color: "#79c44a",
  },
  {
    left: "93%",
    top: "24%",
    size: 5,
    delay: "3.4s",
    duration: "7s",
    color: "#2ee06b",
  },
  {
    left: "12%",
    top: "80%",
    size: 4,
    delay: "2s",
    duration: "8s",
    color: "#d14026",
  },
];

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[92svh] items-center justify-center overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(to_bottom,#080b08_0%,#0c100c_45%,#12170d_72%,#141a0c_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-32 top-16 -z-10 h-[420px] w-[420px] rounded-full bg-grass/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-24 -z-10 h-[360px] w-[360px] rounded-full bg-[#2ee06b]/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_bottom,rgb(121_196_74/0.16),transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="texture texture-stone tex-16 absolute inset-0 -z-10 opacity-[0.045]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 overflow-hidden"
      >
        {PARTICLES.map((particle, index) => (
          <span
            key={index}
            className="animate-float-slow absolute rounded-[1px]"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 10px ${particle.color}66`,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-16 bg-gradient-to-b from-transparent to-black/40"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10">
        <div className="texture texture-grass-side tex-32 h-8 w-full opacity-95" />
        <div className="texture texture-dirt tex-32 h-16 w-full" />
        <div className="absolute inset-x-0 top-0 h-1.5 bg-grass-dark" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-36 pt-28 text-center sm:pb-40">
        <div className="animate-fade-up mx-auto mb-6 flex justify-center [animation-delay:120ms]">
          <MinecraftBadge
            variant="grass"
            icon="grass"
            className="gap-2 px-3 py-2"
          >
            TheScape · Survival · Community
          </MinecraftBadge>
        </div>

        <h1 className="animate-rise font-pixel text-[44px] leading-none tracking-tight text-foreground [animation-delay:80ms] sm:text-7xl md:text-8xl">
          HMT{" "}
          <span className="text-grass drop-shadow-[0_5px_0_rgb(0_0_0/0.35)]">
            CLAN
          </span>
        </h1>

        <p className="animate-fade-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/75 [animation-delay:200ms] md:text-lg">
          Eine Gruppe von Freunden, die gemeinsam auf{" "}
          <span className="font-semibold text-foreground">TheScape</span>{" "}
          Minecraft spielt.
        </p>

        <div className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 [animation-delay:280ms] sm:flex-row">
          <MinecraftButton
            href="/events"
            variant="primary"
            size="lg"
            className="w-52 sm:w-auto"
          >
            Events
          </MinecraftButton>
          <MinecraftButton
            href="https://gaming.henrymeyer.de/projects/modpacks/hmt-pack/"
            variant="stone"
            size="lg"
            className="w-52 sm:w-auto"
          >
            Modpack
          </MinecraftButton>
        </div>
      </div>
    </section>
  );
}

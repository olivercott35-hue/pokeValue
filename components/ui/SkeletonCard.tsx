export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-20 h-20">
        {/* Static Background Ring */}
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />

        {/* Rotating Gradient Ring */}
        <div className="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />

        {/* Inner Pulse Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-purple-500/10 rounded-full animate-pulse backdrop-blur-sm border border-purple-500/20" />
        </div>
      </div>
      <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-500 animate-pulse">
        Syncing Assets
      </span>
    </div>
  );
}
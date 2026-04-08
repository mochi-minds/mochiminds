import { Nav } from "@/components/layout/nav";
import { EtherlinkDemo } from "@/components/etherlink/EtherlinkDemo";
import { TezosDemo } from "@/components/tezos/TezosDemo";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="min-h-screen flex flex-col items-center p-8 gap-8 pt-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">MochiMinds Project</h1>
          <p className="text-zinc-400">
            Built by MochiMinds
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <EtherlinkDemo />
          <TezosDemo />
        </div>
      </main>
    </>
  );
}

import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { FailedEval } from "./FailedEval";
import { CaseMatePromo } from "./CaseMate";
import { CaseMatePromo2 } from "./CaseMate2";
import { CaseMatePromo3 } from "./CaseMate3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* CaseMate Promo 3 — POV: Know Your Rights (1080×1920, 15s @ 30fps) */}
      <Composition
        id="CaseMatePromo3"
        component={CaseMatePromo3}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* CaseMate Promo 2 — "You Just Got Served" (1080×1920, 15s @ 30fps) */}
      <Composition
        id="CaseMatePromo2"
        component={CaseMatePromo2}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* CaseMate Promo — Instagram Reel (1080×1920, 15s @ 30fps) */}
      <Composition
        id="CaseMatePromo"
        component={CaseMatePromo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* AD 1 — "Failed Eval" (1080×1920, 15s @ 30fps) */}
      <Composition
        id="FailedEval"
        component={FailedEval}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
    </>
  );
};

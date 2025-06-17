"use client";

import { buildChallenges } from "@/actions/puzzle-actions";
import { Text } from "react-native";
import PuzzleClient from "./puzzle-client";
import { use, useEffect, useMemo, useRef } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useGameStore } from "@/stores/game";

export function PlaySection() {
  const { data: challenges } = useSuspenseQuery({
    queryKey: ["challenges"],
    queryFn: buildChallenges,
  });

  //   const hydrated = useRef(false);

  //   useEffect(() => {
  //     if (!hydrated.current && challenges?.length) {
  //       useGameStore.setState((state) => ({
  //         ...state,
  //         challenges,
  //         started: true,
  //         loading: false,
  //       }));
  //       hydrated.current = true;
  //     }
  //   }, [challenges]);

  return <PuzzleClient challenges={challenges} />;

  //   return (
  //     <Text style={{ color: "black" }}>
  //       {`test - server function, ${JSON.stringify(challenges[0]?.image?.user)}`}
  //     </Text>
  //   );
}

// function useChallenges() {
//   const challenges = useMemo(async () => await buildChallenges(), []);
//   return challenges;
// }

// export function PlaySection() {
//   const challenges = use(buildChallenges());

//   //   console.log("PlaySection challenges:", challenges);
//   //   const challenges = await buildChallenges(); // heavy work
//   return (
//     <Text style={{ color: "black" }}>{`test -server function, ${JSON.stringify(
//       challenges[0]?.image?.user
//     )}`}</Text>
//   );
//   //   return <PuzzleClient challenges={challenges} />;
// }

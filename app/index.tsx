import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";

import { useTheme } from "@/hooks/useTheme";
import { PlaySection } from "@/modules/puzzle/play-section";
import { ResultSection } from "@/modules/puzzle/result-section";
import { StartSession } from "@/modules/puzzle/start-section";
import { useGameStoreActions } from "@/stores/game";
import RegistrationModal from "@/components/modals/register";
import {
  RegistrationProvider,
  useRegistration,
} from "@/hooks/use-registration";

function ModalRoot() {
  const { state, close, submit, user } = useRegistration();
  return (
    <RegistrationModal
      visible={state.visible}
      onClose={close}
      onSubmit={submit}
      submitError={state.submitError}
    />
  );
}

function Index() {
  const playing = useLocalSearchParams().play === "true";
  const finished = useLocalSearchParams().finished === "true";
  const { restartGame } = useGameStoreActions();
  const { styles } = useTheme();
  const { containers } = styles;

  const onStart = () => {
    console.log("Start button pressed");
    router.push("/?play=true");
  };

  const onRestart = () => {
    restartGame();
    router.push("/?play=true");
  };

  const gotoInformations = () => {
    restartGame();
    router.push("/informations");
  };

  return (
    <SafeAreaView style={[containers.main, containers.centeredFullScreen]}>
      <RegistrationProvider>
        {playing ? (
          <PlaySection />
        ) : finished ? (
          <ResultSection onRestart={onRestart} />
        ) : (
          <StartSession onStart={onStart} gotoInformations={gotoInformations} />
        )}
        <ModalRoot />
      </RegistrationProvider>
    </SafeAreaView>
  );
}

export default Index;

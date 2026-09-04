import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { PlaySection } from "@/modules/puzzle/play-section";
import { ResultSection } from "@/modules/puzzle/result-section";
import { StartSession } from "@/modules/puzzle/start-section";
import { useGameStoreActions } from "@/stores/game";
import AccountModal from "@/components/modals/account";
import ScoreConfirmModal from "@/components/modals/score-confirm";
import {
  RegistrationProvider,
  useRegistration,
} from "@/hooks/use-registration";
import { useResultStore } from "@/stores/results";

function ModalRoot() {
  const {
    state,
    close,
    signUp,
    login,
    user,
    switchPlayer,
    closeScoreConfirm,
    submitScoreWithoutModal,
  } = useRegistration();
  const score = useResultStore((s) => s.score);
  return (
    <>
      <AccountModal
        visible={state.visible}
        onClose={close}
        user={user}
        submitting={state.submitting}
        submitted={state.submitted}
        generatedKey={state.generatedKey}
        loginFailed={state.loginFailed}
        usernameTaken={state.usernameTaken}
        submitError={state.submitError}
        onSignUp={signUp}
        onLogin={login}
        onSwitchPlayer={switchPlayer}
      />
      {user && (
        <ScoreConfirmModal
          visible={state.scoreConfirmVisible}
          onClose={closeScoreConfirm}
          onConfirm={submitScoreWithoutModal}
          userName={user.userName}
          score={score}
          submitting={state.submitting}
          submitted={state.scoreSubmitted}
          submitError={state.submitError}
        />
      )}
    </>
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

  const onGoHome = () => {
    restartGame();
    router.push("/");
  };

  const gotoInformations = () => {
    router.push("/informations");
  };

  return (
    <SafeAreaView style={[containers.main, containers.centeredFullScreen]}>
      <RegistrationProvider>
        {playing ? (
          <PlaySection />
        ) : finished ? (
          <ResultSection onRestart={onRestart} onGoHome={onGoHome} />
        ) : (
          <StartSession onStart={onStart} gotoInformations={gotoInformations} />
        )}
        <ModalRoot />
      </RegistrationProvider>
    </SafeAreaView>
  );
}

export default Index;

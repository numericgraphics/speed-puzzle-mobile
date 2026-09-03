import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/hooks/useTheme";
import { PlaySection } from "@/modules/puzzle/play-section";
import { ResultSection } from "@/modules/puzzle/result-section";
import { StartSession } from "@/modules/puzzle/start-section";
import { useGameStoreActions } from "@/stores/game";
import RegistrationModal from "@/components/modals/register";
import ProfileModal from "@/components/modals/profile";
import ScoreConfirmModal from "@/components/modals/score-confirm";
import RecoverPlayerModal from "@/components/modals/recover-player";
import {
  RegistrationProvider,
  useRegistration,
} from "@/hooks/use-registration";
import { useResultStore } from "@/stores/results";

function ModalRoot({
  profileVisible,
  onCloseProfile,
  recoverVisible,
  onCloseRecover,
  onOpenRecover,
}: {
  profileVisible: boolean;
  onCloseProfile: () => void;
  recoverVisible: boolean;
  onCloseRecover: () => void;
  onOpenRecover: () => void;
}) {
  const {
    state,
    close,
    submit,
    user,
    switchPlayer,
    findUserByEmail,
    recoverPlayer,
    closeScoreConfirm,
    submitScoreWithoutModal,
  } = useRegistration();
  const score = useResultStore((s) => s.score);
  return (
    <>
      <RegistrationModal
        visible={state.visible}
        onClose={close}
        onSubmit={submit}
        submitting={state.submitting}
        submitted={state.submitted}
        recognized={state.recognized}
        userName={user?.userName}
        submitError={state.submitError}
      />
      <ProfileModal
        visible={profileVisible}
        onClose={onCloseProfile}
        onSwitchPlayer={switchPlayer}
        onRecoverPlayer={() => {
          onCloseProfile();
          onOpenRecover();
        }}
        user={user}
      />
      <RecoverPlayerModal
        visible={recoverVisible}
        onClose={onCloseRecover}
        onLookup={findUserByEmail}
        onConfirm={recoverPlayer}
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
  const [profileVisible, setProfileVisible] = useState(false);
  const [recoverVisible, setRecoverVisible] = useState(false);

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
          <StartSession
            onStart={onStart}
            gotoInformations={gotoInformations}
            onOpenProfile={() => setProfileVisible(true)}
          />
        )}
        <ModalRoot
          profileVisible={profileVisible}
          onCloseProfile={() => setProfileVisible(false)}
          recoverVisible={recoverVisible}
          onCloseRecover={() => setRecoverVisible(false)}
          onOpenRecover={() => setRecoverVisible(true)}
        />
      </RegistrationProvider>
    </SafeAreaView>
  );
}

export default Index;
